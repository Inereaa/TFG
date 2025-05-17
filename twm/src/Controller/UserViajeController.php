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
        $usuarioViaje->setRevendido(false);
        $usuarioViaje->setPrecioReventa(0);

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
                'fechaInicio' => $uv->getViaje()->getFechaInicio()->format('Y-m-d'),
                'revendido' => $uv->isRevendido(),
                'precioReventa' => $uv->getPrecioReventa(),
            ];
        }, $resultados);

        return $this->json($data);
    }

    #[Route('/poner-en-reventa/{id}', name: 'poner_en_reventa', methods: ['POST'])]
    public function ponerEnReventa(UsuarioViaje $usuarioViaje, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();

        if ($usuarioViaje->getUsuario()->getId() !== $usuario->getId()) {
            return new JsonResponse(['error' => 'No puedes revender un viaje que no te pertenece'], 403);
        }

        if (!isset($data['precio']) || !is_numeric($data['precio']) || $data['precio'] < 0) {
            return new JsonResponse(['error' => 'Precio inválido'], 400);
        }

        $data = json_decode($request->getContent(), true);

        $usuarioViaje->setRevendido(true);
        $usuarioViaje->setPrecioReventa($data['precio']);

        $em->flush();

        return new JsonResponse(['message' => 'El viaje fue puesto en reventa']);
    }

    #[Route('/comprar/{id}', name: 'comprar_viaje_reventa', methods: ['POST'])]
    public function comprarViajeReventa(UsuarioViaje $usuarioViaje, EntityManagerInterface $em): JsonResponse
    {
        $usuario = $this->getUser();

        if (!$usuarioViaje->isRevendido()) {
            return new JsonResponse(['error' => 'Este viaje no está en reventa'], 400);
        }

        if ($usuarioViaje->getUsuario()->getId() === $usuario->getId()) {
            return new JsonResponse(['error' => 'No puedes comprar tu propio viaje'], 400);
        }

        $nuevoUsuarioViaje = new UsuarioViaje();
        $nuevoUsuarioViaje->setUsuario($usuario);
        $nuevoUsuarioViaje->setViaje($usuarioViaje->getViaje());
        $nuevoUsuarioViaje->setRevendido(false);
        $nuevoUsuarioViaje->setPrecioReventa(0);

        $usuarioViaje->setRevendido(false);
        $em->persist($nuevoUsuarioViaje);
        $em->flush();
        $em->remove($usuarioViaje);

        return new JsonResponse(['message' => 'Compra realizada con éxito']);
    }
}
