<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\BookRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookRepository::class)]
#[ORM\Table(name: 'libros')]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'books')]
    #[ORM\JoinColumn(name: 'categoria_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?Category $category = null;

    #[ORM\ManyToOne(inversedBy: 'ownedBooks')]
    #[ORM\JoinColumn(name: 'propietario_id', referencedColumnName: 'id', nullable: true, onDelete: 'SET NULL')]
    private ?User $owner = null;

    #[ORM\Column(length: 500)]
    private string $titulo = '';

    #[ORM\Column(length: 32, unique: true, nullable: true)]
    private ?string $isbn = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $descripcion = null;

    #[ORM\Column(length: 255)]
    private string $autor = '';

    #[ORM\Column]
    private int $anioPublicacion = 0;

    #[ORM\Column(length: 512, nullable: true)]
    private ?string $portadaUrl = null;

    #[ORM\Column(options: ['default' => true])]
    private bool $compartidoPublico = true;

    #[ORM\Column(length: 25)]
    private string $estadoPublicacion = 'publicado';

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $creadoEn = null;

    /** @var Collection<int, BookCopy> */
    #[ORM\OneToMany(targetEntity: BookCopy::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $copies;

    /** @var Collection<int, BookRating> */
    #[ORM\OneToMany(targetEntity: BookRating::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $ratings;

    /** @var Collection<int, BookReview> */
    #[ORM\OneToMany(targetEntity: BookReview::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $reviews;

    /** @var Collection<int, BookComment> */
    #[ORM\OneToMany(targetEntity: BookComment::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $comments;

    /** @var Collection<int, ReadingBookmark> */
    #[ORM\OneToMany(targetEntity: ReadingBookmark::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $readingBookmarks;

    /** @var Collection<int, Favorite> */
    #[ORM\OneToMany(targetEntity: Favorite::class, mappedBy: 'book', orphanRemoval: true)]
    private Collection $favoritedBy;

    /** @var Collection<int, Tag> */
    #[ORM\ManyToMany(targetEntity: Tag::class, inversedBy: 'books')]
    #[ORM\JoinTable(name: 'libro_etiqueta')]
    #[ORM\JoinColumn(name: 'libro_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    #[ORM\InverseJoinColumn(name: 'etiqueta_id', referencedColumnName: 'id', onDelete: 'CASCADE')]
    private Collection $tags;

    public function __construct()
    {
        $this->copies = new ArrayCollection();
        $this->ratings = new ArrayCollection();
        $this->reviews = new ArrayCollection();
        $this->comments = new ArrayCollection();
        $this->readingBookmarks = new ArrayCollection();
        $this->favoritedBy = new ArrayCollection();
        $this->tags = new ArrayCollection();
        $this->creadoEn = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;

        return $this;
    }

    public function getOwner(): ?User
    {
        return $this->owner;
    }

    public function setOwner(?User $owner): static
    {
        $this->owner = $owner;

        return $this;
    }

    public function getTitulo(): string
    {
        return $this->titulo;
    }

    public function setTitulo(string $titulo): static
    {
        $this->titulo = $titulo;

        return $this;
    }

    public function getIsbn(): ?string
    {
        return $this->isbn;
    }

    public function setIsbn(?string $isbn): static
    {
        $this->isbn = $isbn;

        return $this;
    }

    public function getDescripcion(): ?string
    {
        return $this->descripcion;
    }

    public function setDescripcion(?string $descripcion): static
    {
        $this->descripcion = $descripcion;

        return $this;
    }

    public function getAutor(): string
    {
        return $this->autor;
    }

    public function setAutor(string $autor): static
    {
        $this->autor = $autor;

        return $this;
    }

    public function getAnioPublicacion(): int
    {
        return $this->anioPublicacion;
    }

    public function setAnioPublicacion(int $anioPublicacion): static
    {
        $this->anioPublicacion = $anioPublicacion;

        return $this;
    }

    public function getPortadaUrl(): ?string
    {
        return $this->portadaUrl;
    }

    public function setPortadaUrl(?string $portadaUrl): static
    {
        $this->portadaUrl = $portadaUrl;

        return $this;
    }

    public function isCompartidoPublico(): bool
    {
        return $this->compartidoPublico;
    }

    public function setCompartidoPublico(bool $compartidoPublico): static
    {
        $this->compartidoPublico = $compartidoPublico;

        return $this;
    }

    public function getEstadoPublicacion(): string
    {
        return $this->estadoPublicacion;
    }

    public function setEstadoPublicacion(string $estadoPublicacion): static
    {
        $this->estadoPublicacion = $estadoPublicacion;

        return $this;
    }

    public function getCreadoEn(): ?\DateTimeImmutable
    {
        return $this->creadoEn;
    }

    public function setCreadoEn(\DateTimeImmutable $creadoEn): static
    {
        $this->creadoEn = $creadoEn;

        return $this;
    }

    /** @return Collection<int, BookCopy> */
    public function getCopies(): Collection
    {
        return $this->copies;
    }

    /** @return Collection<int, BookRating> */
    public function getRatings(): Collection
    {
        return $this->ratings;
    }

    /** @return Collection<int, BookReview> */
    public function getReviews(): Collection
    {
        return $this->reviews;
    }

    /** @return Collection<int, BookComment> */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    /** @return Collection<int, ReadingBookmark> */
    public function getReadingBookmarks(): Collection
    {
        return $this->readingBookmarks;
    }

    /** @return Collection<int, Favorite> */
    public function getFavoritedBy(): Collection
    {
        return $this->favoritedBy;
    }

    /** @return Collection<int, Tag> */
    public function getTags(): Collection
    {
        return $this->tags;
    }
}
