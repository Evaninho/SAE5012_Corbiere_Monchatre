<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

class UserController extends AbstractController
{
    #[Route('/api/users/change-password', name: 'user_change_password', methods: ['POST'])]
    #[IsGranted('IS_AUTHENTICATED_FULLY')]
    public function changePassword(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse
    {
        // Récupérer l'utilisateur connecté
        $user = $this->getUser();

        if (!$user instanceof User) {
            return $this->json([
                'success' => false,
                'message' => 'Utilisateur non authentifié'
            ], 401);
        }

        // Récupérer les données JSON
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!isset($data['oldPassword']) || !isset($data['newPassword'])) {
            return $this->json([
                'success' => false,
                'message' => 'Ancien et nouveau mot de passe requis'
            ], 400);
        }

        $oldPassword = $data['oldPassword'];
        $newPassword = $data['newPassword'];

        // Vérifier l'ancien mot de passe
        if (!$passwordHasher->isPasswordValid($user, $oldPassword)) {
            return $this->json([
                'success' => false,
                'message' => 'Ancien mot de passe incorrect'
            ], 401);
        }

        // Vérifier que le nouveau mot de passe est différent
        if ($passwordHasher->isPasswordValid($user, $newPassword)) {
            return $this->json([
                'success' => false,
                'message' => 'Le nouveau mot de passe doit être différent de l\'ancien'
            ], 400);
        }

        // Validation du nouveau mot de passe (min 8 chars)
        if (strlen($newPassword) < 8) {
            return $this->json([
                'success' => false,
                'message' => 'Le mot de passe doit contenir au moins 8 caractères'
            ], 400);
        }

        // Validation présence majuscule
        if (!preg_match('/[A-Z]/', $newPassword)) {
            return $this->json([
                'success' => false,
                'message' => 'Le mot de passe doit contenir au moins une majuscule'
            ], 400);
        }

        // Validation présence chiffre
        if (!preg_match('/[0-9]/', $newPassword)) {
            return $this->json([
                'success' => false,
                'message' => 'Le mot de passe doit contenir au moins un chiffre'
            ], 400);
        }

        // Hasher le nouveau mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $newPassword);
        
        // Mettre à jour
        $user->setPassword($hashedPassword);
        
        // Optionnel : Mettre à jour la date de modification
        // $user->setUpdatedAt(new \DateTime());

        // Sauvegarder
        $em->flush();

        return $this->json([
            'success' => true,
            'message' => 'Mot de passe changé avec succès'
        ], 200);
    }
}