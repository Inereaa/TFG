<?php

namespace App\Entity;

use App\Repository\ViajeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ViajeRepository::class)]
class Viaje
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $destino = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fechaInicio = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $fechaFin = null;

    #[ORM\Column]
    private ?float $presupuesto = null;

    #[ORM\Column]
    private ?int $minPersonas = null;

    #[ORM\Column]
    private ?int $maxPersonas = null;

    #[ORM\ManyToOne(inversedBy: 'viajes')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $organizador = null;

    /**
     * @var Collection<int, UsuarioViaje>
     */
    #[ORM\OneToMany(targetEntity: UsuarioViaje::class, mappedBy: 'viaje')]
    private Collection $usuarioViajes;

    public function __construct()
    {
        $this->usuarioViajes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDestino(): ?string
    {
        return $this->destino;
    }

    public function setDestino(string $destino): static
    {
        $this->destino = $destino;

        return $this;
    }

    public function getFechaInicio(): ?\DateTimeInterface
    {
        return $this->fechaInicio;
    }

    public function setFechaInicio(\DateTimeInterface $fechaInicio): static
    {
        $this->fechaInicio = $fechaInicio;

        return $this;
    }

    public function getFechaFin(): ?\DateTimeInterface
    {
        return $this->fechaFin;
    }

    public function setFechaFin(\DateTimeInterface $fechaFin): static
    {
        $this->fechaFin = $fechaFin;

        return $this;
    }

    public function getPresupuesto(): ?float
    {
        return $this->presupuesto;
    }

    public function setPresupuesto(float $presupuesto): static
    {
        $this->presupuesto = $presupuesto;

        return $this;
    }

    public function getMinPersonas(): ?int
    {
        return $this->minPersonas;
    }

    public function setMinPersonas(int $minPersonas): static
    {
        $this->minPersonas = $minPersonas;

        return $this;
    }

    public function getMaxPersonas(): ?int
    {
        return $this->maxPersonas;
    }

    public function setMaxPersonas(int $maxPersonas): static
    {
        $this->maxPersonas = $maxPersonas;

        return $this;
    }

    public function getOrganizador(): ?User
    {
        return $this->organizador;
    }

    public function setOrganizador(?User $organizador): static
    {
        $this->organizador = $organizador;

        return $this;
    }

    /**
     * @return Collection<int, UsuarioViaje>
     */
    public function getUsuarioViajes(): Collection
    {
        return $this->usuarioViajes;
    }

    public function addUsuarioViaje(UsuarioViaje $usuarioViaje): static
    {
        if (!$this->usuarioViajes->contains($usuarioViaje)) {
            $this->usuarioViajes->add($usuarioViaje);
            $usuarioViaje->setViaje($this);
        }

        return $this;
    }

    public function removeUsuarioViaje(UsuarioViaje $usuarioViaje): static
    {
        if ($this->usuarioViajes->removeElement($usuarioViaje)) {
            // set the owning side to null (unless already changed)
            if ($usuarioViaje->getViaje() === $this) {
                $usuarioViaje->setViaje(null);
            }
        }

        return $this;
    }
}
