<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class RoleController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
        private Security $security
    ) {}

    /**
     * Attribuer un rôle à l'utilisateur connecté via une route dédiée
     * Exemple: /role/editeur
     */
    #[Route('/api/role/{roleName}', name: 'api_assign_role', methods: ['GET'])]
    public function assignRole(string $roleName): JsonResponse
    {
        /** @var User $user */
        $user = $this->security->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Non authentifié'], 401);
        }

        // Liste blanche des rôles autorisés à être assignés via URL
        $allowedRoles = [
            'editeur' => 'ROLE_EDITOR',
            'abonne' => 'ROLE_USER',
            'auteur' => 'ROLE_AUTHOR',
            'fournisseur' => 'ROLE_DATA_PROVIDER'
        ];

        if (!isset($allowedRoles[$roleName])) {
            return new JsonResponse(['error' => 'Rôle invalide'], 400);
        }

        $role = $allowedRoles[$roleName];
        $roles = $user->getRoles();

        if (!in_array($role, $roles)) {
            $roles[] = $role;
            $user->setRoles(array_values($roles));
            $this->em->flush();
        }

        return new JsonResponse([
            'success' => true,
            'userId' => $user->getId(),
            'roles' => $user->getRoles()
        ]);
    }
}
