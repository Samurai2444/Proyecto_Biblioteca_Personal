<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\BookReview;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<BookReview> */
class BookReviewRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BookReview::class);
    }

    /** @return list<BookReview> */
    public function findByBookOrdered(int $bookId): array
    {
        return $this->createQueryBuilder('r')
            ->andWhere('IDENTITY(r.book) = :bid')
            ->setParameter('bid', $bookId)
            ->leftJoin('r.user', 'u')->addSelect('u')
            ->orderBy('r.creadoEn', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
