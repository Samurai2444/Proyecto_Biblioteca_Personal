<?php

declare(strict_types=1);

namespace App\Repository;

use App\Entity\BookRating;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/** @extends ServiceEntityRepository<BookRating> */
class BookRatingRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, BookRating::class);
    }

    /** @return array<int, array{media: float, total: int}> libro_id => stats */
    public function averageStatsByBookIds(array $bookIds): array
    {
        if ($bookIds === []) {
            return [];
        }
        $conn = $this->getEntityManager()->getConnection();
        $placeholders = implode(',', array_fill(0, \count($bookIds), '?'));
        $sql = "SELECT libro_id, AVG(puntuacion) AS media, COUNT(*) AS total FROM valoraciones WHERE libro_id IN ($placeholders) GROUP BY libro_id";
        $stmt = $conn->executeQuery($sql, $bookIds);
        $out = [];
        while ($row = $stmt->fetchAssociative()) {
            $out[(int) $row['libro_id']] = [
                'media' => round((float) $row['media'], 2),
                'total' => (int) $row['total'],
            ];
        }

        return $out;
    }
}
