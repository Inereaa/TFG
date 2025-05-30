<?php

namespace App\Controller;

use App\Entity\Viaje;
use App\Entity\User;
use App\Entity\UsuarioViaje;
use App\Repository\UsuarioViajeRepository;
use App\Repository\ViajeRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

class ViajeController extends AbstractController
{
    #[Route('/api/viajes', name: 'crear_viaje', methods: ['POST'])]
    public function crearViaje(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuario instanceof User) {
            return new JsonResponse(['error' => 'Usuario no autenticado'], 401);
        }

        $data = json_decode($request->getContent(), true);

        $viaje = new Viaje();
        $viaje->setOrganizador($usuario);
        $viaje->setDestino($data['destino']);
        $viaje->setFechaInicio(new \DateTime($data['fecha_inicio']));
        $viaje->setFechaFin(new \DateTime($data['fecha_fin']));
        $viaje->setPresupuesto($data['presupuesto']);
        $viaje->setMinPersonas($data['min_personas']);
        $viaje->setMaxPersonas($data['max_personas']);

        $em->persist($viaje);
        $em->flush();

        $usuarioViaje = new UsuarioViaje();
        $usuarioViaje->setUsuario($usuario);
        $usuarioViaje->setViaje($viaje);

        $em->persist($usuarioViaje);
        $em->flush();

        return new JsonResponse(['message' => 'Viaje creado con éxito', 'id' => $viaje->getId()], 201);
    }

    #[Route('/api/viajes/{id}/participantes', name: 'contar_participantes', methods: ['GET'])]
    public function contarParticipantes(Viaje $viaje, UsuarioViajeRepository $repo): JsonResponse
    {
        $total = $repo->count(['viaje' => $viaje]);
        return new JsonResponse(['total' => $total]);
    }

    #[Route('/api/viajes', name: 'listar_viajes', methods: ['GET'])]
    public function listarViajes(ViajeRepository $viajeRepository): JsonResponse
    {
        $viajes = $viajeRepository->findAll();

        $data = array_map(function (Viaje $viaje) {
            return [
                'id' => $viaje->getId(),
                'destino' => $viaje->getDestino(),
                'fechaInicio' => $viaje->getFechaInicio()->format('Y-m-d'),
                'fechaFin' => $viaje->getFechaFin()->format('Y-m-d'),
                'presupuestoMinimo' => $viaje->getPresupuesto(),
                'minPersonas' => $viaje->getMinPersonas(),
                'maxPersonas' => $viaje->getMaxPersonas(),
                'usuarioOrganizador' => [
                    'id' => $viaje->getOrganizador()->getId(),
                    'nombre' => $viaje->getOrganizador()->getUsername(),
                ],
            ];
        }, $viajes);

        return $this->json($data);
    }

    #[Route('/api/viajes/destacados', name: 'viajes_destacados', methods: ['GET'])]
    public function viajesDestacados(ViajeRepository $repo): JsonResponse
    {
        $viajes = $repo->findBy([], null, 3);

        $resultado = [];

        foreach ($viajes as $viaje) {
            $organizador = $viaje->getOrganizador();

            $resultado[] = [
                'id' => $viaje->getId(),
                'destino' => $viaje->getDestino(),
                'fechaInicio' => $viaje->getFechaInicio()?->format('Y-m-d'),
                'fechaFin' => $viaje->getFechaFin()?->format('Y-m-d'),
                'maxPersonas' => $viaje->getMaxPersonas(),
                'minPersonas' => $viaje->getMinPersonas(),
                'presupuestoMinimo' => $viaje->getPresupuesto(),
                'usuarioOrganizador' => $organizador ? [
                    'id' => $organizador->getId(),
                ] : null,
            ];
        }

        return $this->json($resultado);
    }
}
