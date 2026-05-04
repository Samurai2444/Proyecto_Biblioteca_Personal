<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\BookComment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<BookComment> */
class BookCommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BookComment::class);
    }

    /** @return list<BookComment> */
    public function findRootCommentsByBook(int $bookId): array
    {
        return $this->createQueryBuilder('c')
            ->distinct()
            ->andWhere('IDENTITY(c.book) = :bid')
            ->setParameter('bid', $bookId)
            ->andWhere('c.parent IS NULL')
            ->leftJoin('c.user', 'u')->addSelect('u')
            ->leftJoin('c.replies', 'rep')->addSelect('rep')
            ->leftJoin('rep.user', 'ru')->addSelect('ru')
            ->orderBy('c.creadoEn', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
