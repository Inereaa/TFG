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
                'viajeId' => $uv->getViaje()->getId(),
                'destino' => $uv->getViaje()->getDestino(),
                'fechaInicio' => $uv->getViaje()->getFechaInicio()->format('Y-m-d')
            ];
        }, $resultados);

        return $this->json($data);
    }
}
