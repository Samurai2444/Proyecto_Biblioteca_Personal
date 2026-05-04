<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Book;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Book> */
class BookRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Book::class);
    }

    /** @return list<Book> */
    public function findPublishedForCatalog(): array
    {
        return $this->createQueryBuilder('b')
            ->leftJoin('b.category', 'cat')->addSelect('cat')
            ->leftJoin('b.copies', 'cp')->addSelect('cp')
            ->leftJoin('b.tags', 't')->addSelect('t')
            ->andWhere('b.estadoPublicacion = :pub')
            ->setParameter('pub', 'publicado')
            ->andWhere('b.owner IS NULL OR b.compartidoPublico = true')
            ->orderBy('b.titulo', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findOnePublished(int $id): ?Book
    {
        return $this->createQueryBuilder('b')
            ->andWhere('b.id = :id')
            ->andWhere('b.estadoPublicacion = :pub')
            ->andWhere('b.owner IS NULL OR b.compartidoPublico = true')
            ->setParameter('id', $id)
            ->setParameter('pub', 'publicado')
            ->setMaxResults(1)
            ->getQuery()
            ->getOneOrNullResult();
    }
}
