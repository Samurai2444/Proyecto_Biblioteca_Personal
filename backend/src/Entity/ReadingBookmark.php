<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ReadingBookmarkRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ReadingBookmarkRepository::class)]
#[ORM\Table(name: 'marcadores_lectura')]
class ReadingBookmark
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'readingBookmarks')]
    #[ORM\JoinColumn(name: 'usuario_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'readingBookmarks')]
    #[ORM\JoinColumn(name: 'libro_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Book $book = null;

    #[ORM\Column(length: 20)]
    private string $estado = 'pendiente';

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $notaPrivada = null;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $actualizadoEn = null;

    public function __construct()
    {
        $this->actualizadoEn = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
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

    public function getBook(): ?Book
    {
        return $this->book;
    }

    public function setBook(?Book $book): static
    {
        $this->book = $book;

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

    public function getNotaPrivada(): ?string
    {
        return $this->notaPrivada;
    }

    public function setNotaPrivada(?string $notaPrivada): static
    {
        $this->notaPrivada = $notaPrivada;

        return $this;
    }

    public function getActualizadoEn(): ?\DateTimeImmutable
    {
        return $this->actualizadoEn;
    }

    public function setActualizadoEn(\DateTimeImmutable $actualizadoEn): static
    {
        $this->actualizadoEn = $actualizadoEn;

        return $this;
    }
}
