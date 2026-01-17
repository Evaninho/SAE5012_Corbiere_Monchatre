<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function me(Security $security): JsonResponse
    {
        /**@var user $user */
        $user = $security->getUser();
        

        if (!$user) {
            return new JsonResponse(['message' => 'Non authentifié'], 401);
        }

        return new JsonResponse([
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'pseudo' => $user->getPseudo(),
            'prenom' => $user->getPrenom(),
            'nom' => $user->getNom(),
            'pays' => $user->getPays(),
            'roles' => $user->getRoles(),
            'sportFavoris' => $user->getsportFavoris(),
            
        ]);
    }
}
