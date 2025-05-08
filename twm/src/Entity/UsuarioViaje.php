<?php

namespace App\Entity;

use App\Repository\UsuarioViajeRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UsuarioViajeRepository::class)]
class UsuarioViaje
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioViajes')]
    private ?User $usuario = null;

    #[ORM\ManyToOne(inversedBy: 'usuarioViajes')]
    private ?Viaje $viaje = null;

    #[ORM\Column]
    private ?bool $revendido = null;

    #[ORM\Column]
    private ?float $precioReventa = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsuario(): ?User
    {
        return $this->usuario;
    }

    public function setUsuario(?User $usuario): static
    {
        $this->usuario = $usuario;

        return $this;
    }

    public function getViaje(): ?Viaje
    {
        return $this->viaje;
    }

    public function setViaje(?Viaje $viaje): static
    {
        $this->viaje = $viaje;

        return $this;
    }

    public function isRevendido(): ?bool
    {
        return $this->revendido;
    }

    public function setRevendido(bool $revendido): static
    {
        $this->revendido = $revendido;

        return $this;
    }

    public function getPrecioReventa(): ?float
    {
        return $this->precioReventa;
    }

    public function setPrecioReventa(float $precioReventa): static
    {
        $this->precioReventa = $precioReventa;

        return $this;
    }
}
