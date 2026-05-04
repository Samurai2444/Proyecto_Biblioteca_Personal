<?php

declare(strict_types=1);

namespace App\Entity;

use App\Repository\ContentReportRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ContentReportRepository::class)]
#[ORM\Table(name: 'reportes_contenido')]
class ContentReport
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'reportsFiled')]
    #[ORM\JoinColumn(name: 'reportante_id', referencedColumnName: 'id', nullable: false, onDelete: 'CASCADE')]
    private ?User $reportante = null;

    #[ORM\Column(length: 20)]
    private string $tipo = 'libro';

    #[ORM\Column]
    private int $referenciaId = 0;

    #[ORM\Column(length: 500)]
    private string $motivo = '';

    #[ORM\Column(length: 20)]
    private string $estado = 'abierto';

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $creadoEn = null;

    public function __construct()
    {
        $this->creadoEn = new \DateTimeImmutable();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReportante(): ?User
    {
        return $this->reportante;
    }

    public function setReportante(?User $reportante): static
    {
        $this->reportante = $reportante;

        return $this;
    }

    public function getTipo(): string
    {
        return $this->tipo;
    }

    public function setTipo(string $tipo): static
    {
        $this->tipo = $tipo;

        return $this;
    }

    public function getReferenciaId(): int
    {
        return $this->referenciaId;
    }

    public function setReferenciaId(int $referenciaId): static
    {
        $this->referenciaId = $referenciaId;

        return $this;
    }

    public function getMotivo(): string
    {
        return $this->motivo;
    }

    public function setMotivo(string $motivo): static
    {
        $this->motivo = $motivo;

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
