<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\BookCopyRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookCopyRepository::class)]
#[ORM\Table(name: 'ejemplares')]
class BookCopy
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'copies')]
    #[ORM\JoinColumn(name: 'libro_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Book $book = null;

    #[ORM\Column(length: 50, unique: true)]
    private string $codigo = '';

    #[ORM\Column(length: 20)]
    private string $estado = 'disponible';

    /** @var Collection<int, Loan> */
    #[ORM\OneToMany(targetEntity: Loan::class, mappedBy: 'bookCopy')]
    private Collection $loans;

    public function __construct()
    {
        $this->loans = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(?Book $book): static
    {
        $this->book = $book;

        return $this;
    }

    public function getCodigo(): string
    {
        return $this->codigo;
    }

    public function setCodigo(string $codigo): static
    {
        $this->codigo = $codigo;

        return $this;
    }

    public function getEstado(): string
    {
        return $this->estado;
    }

    public function setEstado(string $estado): static
    {
        $this->estado = $estado;

        return $this;
    }

    /** @return Collection<int, Loan> */
    public function getLoans(): Collection
    {
        return $this->loans;
    }
}
