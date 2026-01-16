<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

class AuthController extends AbstractController
{
    #[Route('/api/auth/reset-password', name: 'auth_reset_password', methods: ['POST'])]
    public function resetPassword(
        Request $request,
        EntityManagerInterface $em,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ): JsonResponse
    {
        // Récupérer les données JSON
        $data = json_decode($request->getContent(), true);

        // Validation des données
        if (!isset($data['email']) || !isset($data['newPassword'])) {
            return $this->json([
                'success' => false,
                'message' => 'Email et nouveau mot de passe requis'
            ], 400);
        }

        $email = $data['email'];
        $newPassword = $data['newPassword'];

        // Validation du format email
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json([
                'success' => false,
                'message' => 'Format d\'email invalide'
            ], 400);
        }

        // Validation du mot de passe (min 8 chars)
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

        // Rechercher l'utilisateur
        $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

        if (!$user) {
            return $this->json([
                'success' => false,
                'message' => 'Aucun compte trouvé avec cet email'
            ], 404);
        }

        // Hasher le nouveau mot de passe
        $hashedPassword = $passwordHasher->hashPassword($user, $newPassword);
        
        // Mettre à jour le mot de passe
        $user->setPassword($hashedPassword);
        
        // Optionnel : Mettre à jour la date de modification
        // $user->setUpdatedAt(new \DateTime());

        // Sauvegarder en base de données
        $em->flush();

        // Optionnel : Envoyer un email de confirmation
        // $this->sendPasswordResetEmail($user);

        return $this->json([
            'success' => true,
            'message' => 'Mot de passe réinitialisé avec succès'
        ], 200);
    }
}