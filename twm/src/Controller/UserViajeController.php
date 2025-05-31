<?php

namespace App\Controller;

use App\Entity\UsuarioViaje;
use App\Entity\User;
use App\Entity\Viaje;
use App\Repository\UsuarioViajeRepository;
use App\Repository\ViajeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class UserViajeController extends AbstractController
{
    #[Route('api/unirse/{id}', name: 'unirse_viaje', methods: ['POST'])]
    public function unirseAViaje(Viaje $viaje, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        foreach ($viaje->getUsuarioViajes() as $uv) {
            if ($uv->getUsuario()->getId() === $usuario->getId()) {
                return new JsonResponse(['error' => 'Ya estás inscrito en este viaje'], 400);
            }
        }

        $usuarioViaje = new UsuarioViaje();
        $usuarioViaje->setUsuario($usuario);
        $usuarioViaje->setViaje($viaje);

        $em->persist($usuarioViaje);
        $em->flush();

        $logFile = $this->getParameter('kernel.project_dir') . '/var/log/logs.log';
        $fecha = (new \DateTime())->format('Y-m-d H:i:s');
        $mensaje = "[$fecha] El usuario '{$usuario->getEmail()}' se ha unido al viaje a '{$viaje->getDestino()}' del {$viaje->getFechaInicio()->format('Y-m-d')} al {$viaje->getFechaFin()->format('Y-m-d')}" . PHP_EOL;
        file_put_contents($logFile, $mensaje, FILE_APPEND);

        return new JsonResponse(['message' => 'Te uniste al viaje con éxito']);
    }

    #[Route('api/mis-viajes', name: 'mis_viajes', methods: ['GET'])]
    public function verMisViajes(UsuarioViajeRepository $usuarioViajeRepo): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario instanceof User) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        $resultados = $usuarioViajeRepo->findBy(['usuario' => $usuario]);

        $data = array_map(function (UsuarioViaje $uv) {
            return [
                'id' => $uv->getId(),
                'viajeId' => $uv->getViaje()->getId(),
                'destino' => $uv->getViaje()->getDestino(),
                'fechaInicio' => $uv->getViaje()->getFechaInicio()->format('Y-m-d')
            ];
        }, $resultados);

        return $this->json($data);
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(): JsonResponse
    {
        $usuario = $this->getUser();
        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        return new JsonResponse([
            'id' => $usuario->getId(),
            'email' => $usuario->getEmail(),
            'nombre' => $usuario->getUsername()
        ]);
    }


    #[Route('/api/cancelar-plaza/{id}', name: 'cancelar_plaza', methods: ['DELETE'])]
    public function cancelarPlaza(int $id, EntityManagerInterface $em, UsuarioViajeRepository $repo): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        $usuarioViaje = $repo->find($id);

        if (!$usuarioViaje) {
            return new JsonResponse(['error' => 'Registro no encontrado'], 404);
        }

        if ($usuarioViaje->getUsuario()->getId() !== $usuario->getId()) {
            return new JsonResponse(['error' => 'No tienes permiso para cancelar esta plaza'], 403);
        }

        $viaje = $usuarioViaje->getViaje();

        $em->remove($usuarioViaje);
        $em->flush();

        $logFile = $this->getParameter('kernel.project_dir') . '/var/log/logs.log';
        $fecha = (new \DateTime())->format('Y-m-d H:i:s');
        $mensaje = "[$fecha] El usuario '{$usuario->getEmail()}' canceló su plaza en el viaje a '{$viaje->getDestino()}' del {$viaje->getFechaInicio()->format('Y-m-d')} al {$viaje->getFechaFin()->format('Y-m-d')}" . PHP_EOL;
        file_put_contents($logFile, $mensaje, FILE_APPEND);

        return new JsonResponse(['message' => 'Plaza cancelada con éxito']);
    }

    #[Route('/api/cancelar-viaje/{id}', name: 'cancelar_viaje', methods: ['DELETE'])]
    public function cancelarViaje(int $id, EntityManagerInterface $em, ViajeRepository $viajeRepo): JsonResponse
    {
        $usuario = $this->getUser();
        $viaje = $viajeRepo->find($id);

        if (!$usuario || !$viaje) {
            return new JsonResponse(['error' => 'Usuario o viaje no encontrado'], 404);
        }

        if ($viaje->getOrganizador()->getId() !== $usuario->getId()) {
            return new JsonResponse(['error' => 'No tienes permiso para cancelar este viaje'], 403);
        }

        foreach ($viaje->getUsuarioViajes() as $uv) {
            $em->remove($uv);
        }

        $em->remove($viaje);
        $em->flush();

        $logFile = $this->getParameter('kernel.project_dir') . '/var/log/logs.log';
        $fecha = (new \DateTime())->format('Y-m-d H:i:s');
        $mensaje = "[$fecha] El usuario '{$usuario->getEmail()}' canceló el viaje a '{$viaje->getDestino()}' que estaba programado del {$viaje->getFechaInicio()->format('Y-m-d')} al {$viaje->getFechaFin()->format('Y-m-d')}" . PHP_EOL;
        file_put_contents($logFile, $mensaje, FILE_APPEND);

        return new JsonResponse(['message' => 'Viaje cancelado con éxito']);
    }

}
