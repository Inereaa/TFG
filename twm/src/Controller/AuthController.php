<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\BadCredentialsException;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;

class AuthController extends AbstractController
{
    private $em;
    private $userRepository;
    private $jwtManager;
    private $passwordEncoder;

    public function __construct(
        EntityManagerInterface $em,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordEncoder,
        JWTTokenManagerInterface $jwtManager
    ) {
        $this->em = $em;
        $this->userRepository = $userRepository;
        $this->passwordEncoder = $passwordEncoder;
        $this->jwtManager = $jwtManager;
    }


    #[Route('/api/usuarios/login', name: 'login', methods: ['POST'])]
    public function login(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';

        $user = $this->userRepository->findOneBy(['email' => $email]);

        if (!$user || !$this->passwordEncoder->isPasswordValid($user, $password)) {
            throw new BadCredentialsException('Invalid credentials');
        }

        // Generate the JWT token
        $token = $this->jwtManager->create($user);

        return new JsonResponse(['token' => $token]);
    }

    #[Route('/api/usuarios', name: 'register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'];
        $password = $data['password'];
        $username = $data['username'];

        $user = new User();
        $user->setEmail($email);
        $user->setUsername($username);
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($this->passwordEncoder->hashPassword($user, $password));

        $this->em->persist($user);
        $this->em->flush();

        // Generate JWT for the newly created user
        $token = $this->jwtManager->create($user);

        return new JsonResponse(['token' => $token]);
    }
}
