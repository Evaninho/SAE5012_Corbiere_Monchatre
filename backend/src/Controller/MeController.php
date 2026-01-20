<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\User;

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

     #[Route('/api/me', name: 'api_me_delete', methods: ['DELETE'])]
    public function deleteMe(
        Security $security,
        EntityManagerInterface $em
    ): JsonResponse {
        /** @var User|null $user */
        $user = $security->getUser();

        if (!$user) {
            return new JsonResponse(['message' => 'Non authentifié'], 401);
        }

        // suppression du compte
        $em->remove($user);
        $em->flush();

        return new JsonResponse(null, 204);
    }
    
}
