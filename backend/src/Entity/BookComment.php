<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\BookCommentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BookCommentRepository::class)]
#[ORM\Table(name: 'comentarios_libro')]
class BookComment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'comments')]
    #[ORM\JoinColumn(name: 'libro_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?Book $book = null;

    #[ORM\ManyToOne(inversedBy: 'commentsWritten')]
    #[ORM\JoinColumn(name: 'usuario_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $user = null;

    #[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'replies')]
    #[ORM\JoinColumn(name: 'padre_id', referencedColumnName: 'id', nullable: true, onDelete: 'CASCADE')]
    private ?BookComment $parent = null;

    /** @var Collection<int, BookComment> */
    #[ORM\OneToMany(targetEntity: self::class, mappedBy: 'parent')]
    private Collection $replies;

    #[ORM\Column(type: 'text')]
    private string $contenido = '';

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $creadoEn = null;

    public function __construct()
    {
        $this->replies = new ArrayCollection();
        $this->creadoEn = new \DateTimeImmutable();
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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

        return $this;
    }

    public function getParent(): ?BookComment
    {
        return $this->parent;
    }

    public function setParent(?BookComment $parent): static
    {
        $this->parent = $parent;

        return $this;
    }

    /** @return Collection<int, BookComment> */
    public function getReplies(): Collection
    {
        return $this->replies;
    }

    public function getContenido(): string
    {
        return $this->contenido;
    }

    public function setContenido(string $contenido): static
    {
        $this->contenido = $contenido;

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
}
