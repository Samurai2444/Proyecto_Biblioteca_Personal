<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: 'usuarios')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $nombre = '';

    #[ORM\Column(length: 255, unique: true)]
    private string $email = '';

    #[ORM\Column(length: 255)]
    private string $password = '';

    #[ORM\Column(length: 20)]
    private string $rol = 'usuario';

    #[ORM\Column(options: ['default' => true])]
    private bool $activo = true;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $creadoEn = null;

    /** @var Collection<int, Book> */
    #[ORM\OneToMany(targetEntity: Book::class, mappedBy: 'owner')]
    private Collection $ownedBooks;

    /** @var Collection<int, Loan> */
    #[ORM\OneToMany(targetEntity: Loan::class, mappedBy: 'user')]
    private Collection $loans;

    /** @var Collection<int, ReadingBookmark> */
    #[ORM\OneToMany(targetEntity: ReadingBookmark::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $readingBookmarks;

    /** @var Collection<int, BookRating> */
    #[ORM\OneToMany(targetEntity: BookRating::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $ratingsGiven;

    /** @var Collection<int, BookReview> */
    #[ORM\OneToMany(targetEntity: BookReview::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $reviewsWritten;

    /** @var Collection<int, BookComment> */
    #[ORM\OneToMany(targetEntity: BookComment::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $commentsWritten;

    /** @var Collection<int, Favorite> */
    #[ORM\OneToMany(targetEntity: Favorite::class, mappedBy: 'user', orphanRemoval: true)]
    private Collection $favorites;

    /** @var Collection<int, ContentReport> */
    #[ORM\OneToMany(targetEntity: ContentReport::class, mappedBy: 'reportante', orphanRemoval: true)]
    private Collection $reportsFiled;

    public function __construct()
    {
        $this->ownedBooks = new ArrayCollection();
        $this->loans = new ArrayCollection();
        $this->readingBookmarks = new ArrayCollection();
        $this->ratingsGiven = new ArrayCollection();
        $this->reviewsWritten = new ArrayCollection();
        $this->commentsWritten = new ArrayCollection();
        $this->favorites = new ArrayCollection();
        $this->reportsFiled = new ArrayCollection();
        $this->creadoEn = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getNombre(): string
    {
        return $this->nombre;
    }

    public function setNombre(string $nombre): static
    {
        $this->nombre = $nombre;

        return $this;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    public function getRol(): string
    {
        return $this->rol;
    }

    public function setRol(string $rol): static
    {
        $this->rol = $rol;

        return $this;
    }

    public function isActivo(): bool
    {
        return $this->activo;
    }

    public function setActivo(bool $activo): static
    {
        $this->activo = $activo;

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

    /** @return Collection<int, Book> */
    public function getOwnedBooks(): Collection
    {
        return $this->ownedBooks;
    }

    /** @return Collection<int, Loan> */
    public function getLoans(): Collection
    {
        return $this->loans;
    }

    /** @return Collection<int, ReadingBookmark> */
    public function getReadingBookmarks(): Collection
    {
        return $this->readingBookmarks;
    }

    /** @return Collection<int, BookRating> */
    public function getRatingsGiven(): Collection
    {
        return $this->ratingsGiven;
    }

    /** @return Collection<int, BookReview> */
    public function getReviewsWritten(): Collection
    {
        return $this->reviewsWritten;
    }

    /** @return Collection<int, BookComment> */
    public function getCommentsWritten(): Collection
    {
        return $this->commentsWritten;
    }

    /** @return Collection<int, Favorite> */
    public function getFavorites(): Collection
    {
        return $this->favorites;
    }

    /** @return Collection<int, ContentReport> */
    public function getReportsFiled(): Collection
    {
        return $this->reportsFiled;
    }
}
