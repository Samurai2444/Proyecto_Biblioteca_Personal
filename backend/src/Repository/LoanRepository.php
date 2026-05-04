<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\Loan;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<Loan> */
class LoanRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Loan::class);
    }

    /** @return list<Loan> */
    public function findActivos(): array
    {
        return $this->createQueryBuilder('p')
            ->leftJoin('p.bookCopy', 'e')->addSelect('e')
            ->leftJoin('e.book', 'b')->addSelect('b')
            ->leftJoin('p.user', 'u')->addSelect('u')
            ->andWhere('p.estado = :activo')
            ->setParameter('activo', 'activo')
            ->orderBy('p.fechaPrestamo', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
