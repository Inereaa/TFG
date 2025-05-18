<?php

namespace App\Controller;

use App\Repository\ActividadesRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ActividadesController extends AbstractController
{
    #[Route('/api/actividades', name: 'api_actividades', methods: ['GET'])]
    public function index(ActividadesRepository $repo): JsonResponse
    {
        $actividades = $repo->findAll();

        $data = array_map(function($actividad) {
            return [
                'id' => $actividad->getId(),
                'nombre' => $actividad->getNombre(),
                'url' => $actividad->getUrl(),
                'foto' => $actividad->getFoto(),
                'informacion' => $actividad->getInformacion(),
            ];
        }, $actividades);

        return $this->json($data);
    }
}
