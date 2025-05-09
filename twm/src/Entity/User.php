<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $username = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $foto = null;

    /**
     * @var Collection<int, Viaje>
     */
    #[ORM\OneToMany(targetEntity: Viaje::class, mappedBy: 'organizador')]
    private Collection $viajes;

    /**
     * @var Collection<int, UsuarioViaje>
     */
    #[ORM\OneToMany(targetEntity: UsuarioViaje::class, mappedBy: 'usuario')]
    private Collection $usuarioViajes;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $telefono = null;

    #[ORM\Column]
    private ?int $viajesRealizados = 0;

    #[ORM\Column(length: 255)]
    private ?string $nivel = 'Básico';

    public function __construct()
    {
        $this->viajes = new ArrayCollection();
        $this->usuarioViajes = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     *
     * @return list<string>
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    /**
     * @see UserInterface
     */
    public function eraseCredentials(): void
    {
        // If you store any temporary, sensitive data on the user, clear it here
        // $this->plainPassword = null;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): static
    {
        $this->username = $username;

        return $this;
    }

    public function getFoto(): ?string
    {
        return $this->foto;
    }

    public function setFoto(?string $foto): static
    {
        $this->foto = $foto;

        return $this;
    }

    /**
     * @return Collection<int, Viaje>
     */
    public function getViajes(): Collection
    {
        return $this->viajes;
    }

    public function addViaje(Viaje $viaje): static
    {
        if (!$this->viajes->contains($viaje)) {
            $this->viajes->add($viaje);
            $viaje->setOrganizador($this);
        }

        return $this;
    }

    public function removeViaje(Viaje $viaje): static
    {
        if ($this->viajes->removeElement($viaje)) {
            // set the owning side to null (unless already changed)
            if ($viaje->getOrganizador() === $this) {
                $viaje->setOrganizador(null);
            }
        }

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
            $usuarioViaje->setUsuario($this);
        }

        return $this;
    }

    public function removeUsuarioViaje(UsuarioViaje $usuarioViaje): static
    {
        if ($this->usuarioViajes->removeElement($usuarioViaje)) {
            // set the owning side to null (unless already changed)
            if ($usuarioViaje->getUsuario() === $this) {
                $usuarioViaje->setUsuario(null);
            }
        }

        return $this;
    }

    public function getTelefono(): ?string
    {
        return $this->telefono;
    }

    public function setTelefono(?string $telefono): static
    {
        $this->telefono = $telefono;

        return $this;
    }

    public function getViajesRealizados(): ?int
    {
        return $this->viajesRealizados;
    }

    public function setViajesRealizados(int $viajesRealizados): static
    {
        $this->viajesRealizados = $viajesRealizados;

        return $this;
    }

    public function getNivel(): ?string
    {
        return $this->nivel;
    }

    public function setNivel(string $nivel): static
    {
        $this->nivel = $nivel;

        return $this;
    }
}
