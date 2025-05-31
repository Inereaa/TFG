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
use Symfony\Component\String\Slugger\SluggerInterface;

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

        $logFile = $this->getParameter('kernel.project_dir') . '/var/log/logs.log';
        $fecha = (new \DateTime())->format('Y-m-d H:i:s');
        $mensaje = "[$fecha] Se ha creado un nuevo usuario con email '{$user->getEmail()}'" . PHP_EOL;
        file_put_contents($logFile, $mensaje, FILE_APPEND);

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

    #[Route('/api/cuenta', name: 'mi_cuenta_update', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();

        $data = json_decode($request->getContent(), true);
        
        if (isset($data['telefono'])) {
            $user->setTelefono($data['telefono']);
            $em->persist($user);
            $em->flush();
        }

        $logFile = $this->getParameter('kernel.project_dir') . '/var/log/logs.log';
        $fecha = (new \DateTime())->format('Y-m-d H:i:s');
        $mensaje = "[$fecha] El usuario '{$user->getEmail()}' ha actualizado su teléfono a '{$user->getTelefono()}'" . PHP_EOL;
        file_put_contents($logFile, $mensaje, FILE_APPEND);

        return $this->json([
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            'email' => $user->getEmail(),
            'telefono' => $user->getTelefono(),
            'viajes_realizados' => $user->getViajesRealizados(),
            'nivel' => $user->getNivel(),
            'foto' => $user->getFoto(),
        ]);
    }

    #[Route('/api/subir-foto', name: 'api_subir_foto', methods: ['POST'])]
    public function subirFoto(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $usuario = $this->getUser();
        $foto = $request->files->get('foto');

        if (!$foto) {
            return new JsonResponse(['error' => 'No se envió ningún archivo.'], Response::HTTP_BAD_REQUEST);
        }

        $nombreOriginal = pathinfo($foto->getClientOriginalName(), PATHINFO_FILENAME);
        $nombreSeguro = $slugger->slug($nombreOriginal);
        $nuevoNombre = $nombreSeguro . '-' . uniqid() . '.' . $foto->guessExtension();

        $foto->move($this->getParameter('uploads_directory'), $nuevoNombre);

        $usuario->setFoto('/uploads/' . $nuevoNombre);
        $em->persist($usuario);
        $em->flush();

        $logFile = $this->getParameter('kernel.project_dir') . '/var/log/logs.log';
        $fecha = (new \DateTime())->format('Y-m-d H:i:s');
        $mensaje = "[$fecha] El usuario '{$usuario->getEmail()}' ha subido una nueva foto: '{$usuario->getFoto()}'" . PHP_EOL;
        file_put_contents($logFile, $mensaje, FILE_APPEND);

        return new JsonResponse(['foto' => $usuario->getFoto()]);
    }

    #[Route('api/usuario/actualizar-viajes', name: 'actualizar_viajes', methods: ['POST'])]
    public function actualizarViajes(EntityManagerInterface $em): JsonResponse {
        $user = $this->getUser();

        if (!$user) {
            return $this->json(['error' => 'No autenticado'], 401);
        }

        $hoy = new \DateTime();
        $contadorViajesRealizados = 0;

        foreach ($user->getUsuarioViajes() as $usuarioViaje) {
            $viaje = $usuarioViaje->getViaje();

            if ($viaje->getFechaInicio() < $hoy) {
                $contadorViajesRealizados++;
            }
        }

        $user->setViajesRealizados($contadorViajesRealizados);

        if ($contadorViajesRealizados >= 20) {
            $nivel = 'Leyenda';
        } elseif ($contadorViajesRealizados >= 10) {
            $nivel = 'Experto';
        } elseif ($contadorViajesRealizados >= 5) {
            $nivel = 'Avanzado';
        } elseif ($contadorViajesRealizados >= 2) {
            $nivel = 'Intermedio';
        } else {
            $nivel = 'Básico';
        }
        $user->setNivel($nivel);

        $em->flush();

        return $this->json([
            'viajes_realizados' => $contadorViajesRealizados,
            'nivel' => $nivel
        ]);
    }
}
