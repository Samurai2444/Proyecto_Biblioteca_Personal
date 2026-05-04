<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\LoanRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LoanRepository::class)]
#[ORM\Table(name: 'prestamos')]
class Loan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'loans')]
    #[ORM\JoinColumn(name: 'ejemplar_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    private ?BookCopy $bookCopy = null;

    #[ORM\ManyToOne(inversedBy: 'loans')]
    #[ORM\JoinColumn(name: 'usuario_id', referencedColumnName: 'id', nullable: false, onDelete: 'RESTRICT')]
    private ?User $user = null;

    #[ORM\Column(type: 'date_immutable')]
    private ?\DateTimeImmutable $fechaPrestamo = null;

    #[ORM\Column(type: 'date_immutable')]
    private ?\DateTimeImmutable $fechaDevolucionPrevista = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $fechaDevolucion = null;

    #[ORM\Column(length: 20)]
    private string $estado = 'activo';

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getBookCopy(): ?BookCopy
    {
        return $this->bookCopy;
    }

    public function setBookCopy(?BookCopy $bookCopy): static
    {
        $this->bookCopy = $bookCopy;

        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getFechaPrestamo(): ?\DateTimeImmutable
    {
        return $this->fechaPrestamo;
    }

    public function setFechaPrestamo(\DateTimeImmutable $fechaPrestamo): static
    {
        $this->fechaPrestamo = $fechaPrestamo;

        return $this;
    }

    public function getFechaDevolucionPrevista(): ?\DateTimeImmutable
    {
        return $this->fechaDevolucionPrevista;
    }

    public function setFechaDevolucionPrevista(\DateTimeImmutable $fechaDevolucionPrevista): static
    {
        $this->fechaDevolucionPrevista = $fechaDevolucionPrevista;

        return $this;
    }

    public function getFechaDevolucion(): ?\DateTimeImmutable
    {
        return $this->fechaDevolucion;
    }

    public function setFechaDevolucion(?\DateTimeImmutable $fechaDevolucion): static
    {
        $this->fechaDevolucion = $fechaDevolucion;

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
}
