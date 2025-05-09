<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

class UserController extends AbstractController
{
    #[Route('/api/usuarios', name: 'crear_usuario', methods: ['POST'])]
    public function crear(Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $user = new User();
        $user->setEmail($data['email']);
        $user->setUsername($data['username']);
        $user->setFoto($data['foto'] ?? null);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($passwordHasher->hashPassword($user, $data['password']));

        $em->persist($user);
        $em->flush();

        return new JsonResponse(['message' => 'Usuario creado', 'id' => $user->getId()], 201);
    }

    #[Route('/api/cuenta', name: 'mi_cuenta', methods: ['GET'])]
    public function miCuenta(): JsonResponse
    {
        $usuario = $this->getUser();

        return new JsonResponse([
            'id' => $usuario->getId(),
            'username' => $usuario->getUsername(),
            'email' => $usuario->getEmail(),
            'telefono' => $usuario->getTelefono(),
            'viajes_realizados' => $usuario->getViajesRealizados(),
            'nivel' => $usuario->getNivel(),
            'foto' => $usuario->getFoto(),
        ]);
    }
}
