<?php

declare(strict_types=1);

namespace App\Controller\Api;

use App\Repository\BookCommentRepository;
use App\Repository\BookRatingRepository;
use App\Repository\BookRepository;
use App\Repository\BookReviewRepository;
use App\Repository\CategoryRepository;
use App\Repository\LoanRepository;
use App\Repository\TagRepository;
use App\Repository\UserRepository;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Book;
use App\Entity\BookComment;
use App\Entity\Category;
use App\Entity\Loan;
use App\Entity\User;

final class ApiController extends AbstractController
{
    private function addCorsHeaders(JsonResponse $response): void
    {
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
        $response->headers->set('Access-Control-Max-Age', '3600');
    }

    #[Route('/health/db', name: 'api_health_db', methods: ['GET'])]
    public function healthDb(Connection $connection): JsonResponse
    {
        try {
            $connection->executeQuery('SELECT 1')->fetchOne();

            return $this->json(['ok' => true]);
        } catch (\Throwable $e) {
            return $this->json(['ok' => false, 'error' => $e->getMessage()], JsonResponse::HTTP_SERVICE_UNAVAILABLE);
        }
    }

    #[Route('/login', name: 'api_login_real', methods: ['POST', 'OPTIONS'])]
    public function userLogin(Request $request, UserRepository $userRepository): JsonResponse
    {

        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user || $user->getPassword() !== $password) {
            $response = $this->json(['error' => 'Email o contraseña incorrectos'], 401);
            $this->addCorsHeaders($response);
            return $response;
        }

        $response = $this->json([
            'id' => $user->getId(),
            'nombre' => $user->getNombre(),
            'email' => $user->getEmail(),
            'rol' => $user->getRol()
        ]);
        
        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/register', name: 'api_register', methods: ['POST', 'OPTIONS'])]
    public function register(Request $request, EntityManagerInterface $em, UserRepository $userRepo): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $data = json_decode($request->getContent(), true);

        if (empty($data['email']) || empty($data['password']) || empty($data['nombre'])) {
            return $this->json(['error' => 'Faltan datos obligatorios'], 400);
        }

        if ($userRepo->findOneBy(['email' => $data['email']])) {
            return $this->json([
                'error' => 'El correo electrónico ya está registrado',
                'debug' => $data
            ], 409);
        }

        $user = new User();
        $user->setEmail($data['email']);
        $user->setNombre($data['nombre']);

        $user->setPassword($data['password']);

        $user->setRol('usuario');
        $user->setActivo(true);

        try {
            $em->persist($user);
            $em->flush();
        } catch (\Exception $e) {
            return $this->json(['error' => 'No se pudo crear el usuario'], 500);
        }

        $response = $this->json([
            'message' => 'Usuario registrado con éxito',
            'id' => $user->getId()
        ], 201);

        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/categorias', name: 'api_categorias', methods: ['GET'])]
    public function categorias(CategoryRepository $categories): JsonResponse
    {
        $rows = array_map(static fn($c) => ['id' => $c->getId(), 'nombre' => $c->getNombre()], $categories->findAllOrdered());

        return $this->json(['categorias' => $rows]);
    }

    #[Route('/etiquetas', name: 'api_etiquetas', methods: ['GET'])]
    public function etiquetas(TagRepository $tags): JsonResponse
    {
        $rows = array_map(static fn($t) => ['id' => $t->getId(), 'nombre' => $t->getNombre()], $tags->findAllOrdered());

        return $this->json(['etiquetas' => $rows]);
    }

    #[Route('/libros', name: 'api_libros', methods: ['GET'])]
    public function libros(BookRepository $books, BookRatingRepository $ratings): JsonResponse
    {
        $list = $books->findPublishedForCatalog();
        $ids = array_map(static fn($b) => $b->getId(), $list);
        $stats = $ratings->averageStatsByBookIds(array_filter($ids));

        $libros = [];
        foreach ($list as $b) {
            $disponibles = 0;
            foreach ($b->getCopies() as $copy) {
                if ($copy->getEstado() === 'disponible') {
                    ++$disponibles;
                }
            }
            $id = $b->getId();
            $st = $id !== null ? ($stats[$id] ?? null) : null;
            $libros[] = [
                'id' => $id,
                'titulo' => $b->getTitulo(),
                'autor' => $b->getAutor(),
                'portadaUrl' => $b->getPortadaUrl(),
                'isbn' => $b->getIsbn(),
                'anioPublicacion' => $b->getAnioPublicacion(),
                'descripcion' => $b->getDescripcion(),
                'categoria' => $b->getCategory() ? ['id' => $b->getCategory()->getId(), 'nombre' => $b->getCategory()->getNombre()] : null,
                'propietarioId' => $b->getOwner()?->getId(),
                'etiquetas' => $b->getTags()->map(static fn($t) => ['id' => $t->getId(), 'nombre' => $t->getNombre()])->getValues(),
                'valoracionMedia' => $st['media'] ?? null,
                'valoracionCantidad' => $st['total'] ?? 0,
                'ejemplaresDisponibles' => $disponibles,
                'ejemplaresTotal' => $b->getCopies()->count(),
            ];
        }

        $response = $this->json(['libros' => $libros]);

        $this->addCorsHeaders($response);

        return $response;
    }

    #[Route('/libros/{id}/resenas', name: 'api_libro_resenas', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function libroResenas(int $id, BookRepository $books, BookReviewRepository $reviews): JsonResponse
    {
        if (!$books->findOnePublished($id)) {
            return $this->json(['error' => 'Libro no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }
        $rows = [];
        foreach ($reviews->findByBookOrdered($id) as $r) {
            $u = $r->getUser();
            $rows[] = [
                'id' => $r->getId(),
                'titulo' => $r->getTitulo(),
                'cuerpo' => $r->getCuerpo(),
                'creadoEn' => $r->getCreadoEn()?->format(\DateTimeInterface::ATOM),
                'autor' => $u ? ['id' => $u->getId(), 'nombre' => $u->getNombre()] : null,
            ];
        }

        return $this->json(['resenas' => $rows]);
    }

    #[Route('/libros/{id}/comentarios', name: 'api_libro_comentarios', requirements: ['id' => '\d+'], methods: ['GET'])]
    public function libroComentarios(int $id, BookRepository $books, BookCommentRepository $comments): JsonResponse
    {
        if (!$books->findOnePublished($id)) {
            return $this->json(['error' => 'Libro no encontrado'], JsonResponse::HTTP_NOT_FOUND);
        }
        $rows = [];
        foreach ($comments->findRootCommentsByBook($id) as $c) {
            $u = $c->getUser();
            $replies = [];
            foreach ($c->getReplies() as $rep) {
                $ru = $rep->getUser();
                $replies[] = [
                    'id' => $rep->getId(),
                    'contenido' => $rep->getContenido(),
                    'creadoEn' => $rep->getCreadoEn()?->format(\DateTimeInterface::ATOM),
                    'autor' => $ru ? ['id' => $ru->getId(), 'nombre' => $ru->getNombre()] : null,
                ];
            }
            $rows[] = [
                'id' => $c->getId(),
                'contenido' => $c->getContenido(),
                'creadoEn' => $c->getCreadoEn()?->format(\DateTimeInterface::ATOM),
                'autor' => $u ? ['id' => $u->getId(), 'nombre' => $u->getNombre()] : null,
                'respuestas' => $replies,
            ];
        }

        return $this->json(['comentarios' => $rows]);
    }

    #[Route('/libros/{id}/prestar', name: 'api_libro_prestar', methods: ['POST', 'OPTIONS'])]
    public function solicitarPrestamo(int $id, BookRepository $bookRepo, EntityManagerInterface $em, Request $request, UserRepository $userRepo): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $libro = $bookRepo->find($id);
        if (!$libro) return $this->json(['error' => 'Libro no encontrado'], 404);

        $ejemplarDisponible = null;
        foreach ($libro->getCopies() as $copy) {
            if ($copy->getEstado() === 'disponible') {
                $ejemplarDisponible = $copy;
                break;
            }
        }

        if (!$ejemplarDisponible) {
            $response = $this->json(['error' => 'No hay ejemplares disponibles'], 400);
            $this->addCorsHeaders($response);
            return $response;
        }

        $data = json_decode($request->getContent(), true);
        $user = $userRepo->find($data['usuario_id'] ?? 1);

        $prestamo = new Loan();
        $prestamo->setBookCopy($ejemplarDisponible);
        $prestamo->setUser($user);
        $prestamo->setFechaPrestamo(new \DateTimeImmutable());
        $prestamo->setFechaDevolucionPrevista(new \DateTimeImmutable('+15 days'));
        $prestamo->setEstado('activo');

        $ejemplarDisponible->setEstado('prestado');

        $em->persist($prestamo);
        $em->flush();

        $response = $this->json([
            'message' => '¡Préstamo realizado!',
            'fechaDevolucion' => $prestamo->getFechaDevolucionPrevista()->format('d-m-Y')
        ]);
        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/prestamos/activos', name: 'api_prestamos_activos', methods: ['GET'])]
    public function prestamosActivos(LoanRepository $loans): JsonResponse
    {
        $rows = [];
        foreach ($loans->findActivos() as $p) {
            $e = $p->getBookCopy();
            $book = $e?->getBook();
            $u = $p->getUser();
            $rows[] = [
                'id' => $p->getId(),
                'ejemplarCodigo' => $e?->getCodigo(),
                'libroTitulo' => $book?->getTitulo(),
                'usuario' => $u ? ['id' => $u->getId(), 'nombre' => $u->getNombre()] : null,
                'fechaPrestamo' => $p->getFechaPrestamo()?->format('Y-m-d'),
                'fechaDevolucionPrevista' => $p->getFechaDevolucionPrevista()?->format('Y-m-d'),
            ];
        }

        return $this->json(['prestamos' => $rows]);
    }

    #[Route('/libros/{id}', name: 'api_book_detail', methods: ['GET'])]
    public function getBookDetail(int $id, BookRepository $bookRepo): JsonResponse
    {
        try {
            $book = $bookRepo->find($id);

            if (!$book) {
                return $this->json(['error' => 'Libro no encontrado'], 404);
            }

            $disponibles = 0;
            foreach ($book->getCopies() as $copy) {
                if ($copy->getEstado() === 'disponible') {
                    $disponibles++;
                }
            }
            $comentarios = [];
            $bookComments = method_exists($book, 'getBookComments') ? $book->getBookComments() : [];

            foreach ($bookComments as $comment) {
                if ($comment->getParent() === null) {
                    $respuestas = [];
                    foreach ($comment->getReplies() as $reply) {
                        $respuestas[] = [
                            'id' => $reply->getId(),
                            'texto' => $reply->getContenido(),
                            'usuario' => $reply->getUser() ? $reply->getUser()->getNickname() : 'Anónimo',
                        ];
                    }
                    $comentarios[] = [
                        'id' => $comment->getId(),
                        'texto' => $comment->getContenido(),
                        'usuario' => $comment->getUser() ? $comment->getUser()->getNickname() : 'Anónimo',
                        'respuestas' => $respuestas
                    ];
                }
            }

            $categoriasArr = [];
            if (method_exists($book, 'getCategories')) {
                foreach ($book->getCategories() as $cat) {
                    $categoriasArr[] = $cat->getNombre();
                }
            } elseif (method_exists($book, 'getCategory') && $book->getCategory()) {
                $categoriasArr[] = $book->getCategory()->getNombre();
            }

            return $this->json([
                'id' => $book->getId(),
                'titulo' => $book->getTitulo(),
                'autor' => $book->getAutor(),
                'descripcion' => $book->getDescripcion(),
                'anio' => $book->getAnioPublicacion(),
                'portada' => $book->getPortadaUrl(),
                'categorias' => $categoriasArr,
                'valoracionMedia' => method_exists($book, 'getValoracionMedia') ? $book->getValoracionMedia() : 0,
                'ejemplaresDisponibles' => $disponibles,
                'ejemplaresTotal' => $book->getCopies()->count(),
                'comentarios' => $comentarios
            ]);
        } catch (\Exception $e) {
            $response = $this->json([
                'error' => 'Error interno del servidor',
                'mensaje' => $e->getMessage(),
                'archivo' => $e->getFile(),
                'linea' => $e->getLine()
            ], 500);
            $this->addCorsHeaders($response);
            return $response;
        }
    }

    #[Route('/libros/{id}/comentarios', name: 'api_comentarios_publicar', methods: ['POST', 'OPTIONS'])]
    public function publicarComentario(int $id, Request $request, BookRepository $bookRepo, UserRepository $userRepo, EntityManagerInterface $em): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $data = json_decode($request->getContent(), true);
        $libro = $bookRepo->find($id);

        $usuario = $userRepo->find($data['usuario_id'] ?? 1);

        if (!$libro || !$usuario || empty($data['contenido'])) {
            return $this->json(['error' => 'Faltan datos'], 400);
        }

        $comentario = new BookComment();
        $comentario->setContenido($data['contenido']);
        $comentario->setBook($libro);
        $comentario->setUser($usuario);
        $comentario->setCreadoEn(new \DateTimeImmutable());

        if (!empty($data['parent_id'])) {
            $padre = $em->getRepository(BookComment::class)->find($data['parent_id']);
            if ($padre) $comentario->setParent($padre);
        }

        $em->persist($comentario);
        $em->flush();

        $response = $this->json([
            'id' => $comentario->getId(),
            'contenido' => $comentario->getContenido(),
            'creadoEn' => $comentario->getCreadoEn()->format(\DateTimeInterface::ATOM),
            'autor' => [
                'nombre' => $usuario->getNombre()
            ],
            'respuestas' => []
        ]);

        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/comentarios/{id}', name: 'api_comentario_borrar', methods: ['DELETE', 'OPTIONS'])]
    public function borrarComentario(int $id, BookCommentRepository $commentRepo, EntityManagerInterface $em, Request $request): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $comentario = $commentRepo->find($id);

        if (!$comentario) {
            return $this->json(['error' => 'El comentario no existe'], 404);
        }

        $em->remove($comentario);
        $em->flush();

        $response = $this->json(['message' => 'Comentario eliminado']);
        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/usuarios/{id}/prestamos', name: 'api_usuario_prestamos', methods: ['GET', 'OPTIONS'])]
    public function prestamosUsuario(int $id, UserRepository $userRepo, LoanRepository $loanRepo): JsonResponse
    {
        $user = $userRepo->find($id);

        if (!$user) {
            $response = $this->json(['error' => 'Usuario no encontrado'], 404);
            $this->addCorsHeaders($response);
            return $response;
        }

        $prestamosRaw = $loanRepo->findBy(['user' => $user]);

        $rows = [];
        foreach ($prestamosRaw as $p) {
            $copy = $p->getBookCopy();
            $book = $copy?->getBook();

            $rows[] = [
                'id' => $p->getId(),
                'libroTitulo' => $book?->getTitulo() ?? 'Libro desconocido',
                'estado' => $p->getEstado(),
                'fechaPrestamo' => $p->getFechaPrestamo()?->format('Y-m-d'),
                'fechaDevolucionPrevista' => $p->getFechaDevolucionPrevista()?->format('Y-m-d'),
                'fechaDevolucionReal' => $p->getFechaDevolucion()?->format('Y-m-d'),
            ];
        }

        $response = $this->json(['prestamos' => $rows]);
        $this->addCorsHeaders($response);

        return $response;
    }

    #[Route('/usuarios', name: 'api_usuarios_lista', methods: ['GET'])]
    public function listarUsuarios(UserRepository $userRepo): JsonResponse
    {
        $usuarios = $userRepo->findAll();

        $rows = array_map(static function ($u) {
            return [
                'id' => $u->getId(),
                'nombre' => $u->getNombre(),
                'email' => $u->getEmail(),
                'rol' => $u->getRol(),
                'activo' => $u->isActivo(),
            ];
        }, $usuarios);

        $response = $this->json(['usuarios' => $rows]);
        $this->addCorsHeaders($response);

        return $response;
    }

    #[Route('/libros/{id}', name: 'api_libros_eliminar', methods: ['DELETE'])]
    public function eliminarLibro(int $id, BookRepository $repo, EntityManagerInterface $em): JsonResponse
    {
        $libro = $repo->find($id);
        if (!$libro) {
            return $this->json(['error' => 'Libro no encontrado'], 404);
        }

        $em->remove($libro);
        $em->flush();

        $response = $this->json(['message' => 'Libro eliminado']);
        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/libros/nuevo', name: 'api_libros_crear', methods: ['POST'])]
    public function crearLibro(Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $data = json_decode($request->getContent(), true);

        $libro = new Book();
        $libro->setTitulo($data['titulo'] ?? 'Sin título');
        $libro->setAutor($data['autor'] ?? 'Anónimo');
        $libro->setIsbn($data['isbn'] ?? null);
        $libro->setPortadaUrl($data['portadaUrl'] ?? null);
        $libro->setDescripcion($data['descripcion'] ?? '');
        $libro->setAnioPublicacion($data['anio_publicacion'] ?? (int)date('Y'));
        $libro->setCompartidoPublico($data['compartido_publico'] ?? false);
        $libro->setEstadoPublicacion($data['estado_publicacion'] ?? 'publicado');
        $libro->setCreadoEn(new \DateTimeImmutable());

        $categoria = $em->getRepository(Category::class)->find($data['categoria_id'] ?? 1);
        $libro->setCategory($categoria);

        $propietario = $em->getRepository(User::class)->find($data['propietario_id'] ?? 1);
        $libro->setOwner($propietario);

        $em->persist($libro);
        $em->flush();

        $response = $this->json(['message' => 'Libro creado', 'id' => $libro->getId()]);
        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/libros/editar/{id}', name: 'api_libros_editar', methods: ['PUT', 'OPTIONS'])]
    public function editarLibro(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($request->getMethod() === 'OPTIONS') {
            $response = new JsonResponse(null, 204);
            $this->addCorsHeaders($response);
            return $response;
        }

        $libro = $em->getRepository(Book::class)->find($id);
        if (!$libro) {
            return $this->json(['error' => 'Libro no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);

        $libro->setTitulo($data['titulo'] ?? $libro->getTitulo());
        $libro->setAutor($data['autor'] ?? $libro->getAutor());
        $libro->setIsbn($data['isbn'] ?? $libro->getIsbn());
        $libro->setEstadoPublicacion($data['estado_publicacion'] ?? $libro->getEstadoPublicacion());

        $em->flush();

        $response = $this->json(['message' => 'Libro actualizado']);
        $this->addCorsHeaders($response);
        return $response;
    }

    #[Route('/usuarios/{id}/status', methods: ['PATCH'])]
    public function toggleStatus(User $user, Request $request, EntityManagerInterface $em)
    {
        $data = json_decode($request->getContent(), true);
        $user->setActivo($data['activo']);
        $em->flush();
        return $this->json(['status' => 'ok']);
    }

    #[Route('/usuarios/{id}/role', methods: ['PATCH'])]
    public function changeRole(int $id, UserRepository $repo, EntityManagerInterface $em, Request $request): JsonResponse
    {
        $user = $repo->find($id);
        if (!$user) {
            return new JsonResponse(['error' => 'Usuario no encontrado'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $rolRecibido = $data['rol'];

        $nuevoRol = match ($rolRecibido) {
            'admin' => 'admin',
            'bibliotecario' => 'bibliotecario',
            default => 'usuario',
        };

        $user->setRol($nuevoRol);
        $em->flush();

        return new JsonResponse(['message' => 'Rol actualizado correctamente']);
    }
}
