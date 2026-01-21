<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\Rating;
use App\Repository\RatingRepository;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\HttpKernel\Exception\AccessDeniedHttpException;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;

class RatingProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private RatingRepository $ratingRepository,
        private ProcessorInterface $persistProcessor
    ) {}

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ) {
        /** @var Rating $data */
        $user = $this->security->getUser();

        if (!$user) {
            throw new AccessDeniedHttpException('Utilisateur non authentifié');
        }

        // ===== POST - Création d'un nouveau rating =====
        if ($operation instanceof Post) {
            if (!$data->getArticle()) {
                throw new BadRequestHttpException('Article manquant');
            }

            // 🔒 1 commentaire par article par utilisateur
            $existingRating = $this->ratingRepository->findOneBy([
                'user' => $user,
                'article' => $data->getArticle()
            ]);

            if ($existingRating) {
                throw new BadRequestHttpException('Vous avez déjà commenté cet article');
            }

            $data->setUser($user);
            $data->setCreatedAt(new \DateTimeImmutable());
        }
        
        // ===== PATCH - Modification d'un rating existant =====
        if ($operation instanceof Patch) {
            // La sécurité est vérifiée par API Platform (object.getUser() == user)
            // On peut juste laisser passer
        }

        return $this->persistProcessor->process(
            $data,
            $operation,
            $uriVariables,
            $context
        );
    }
}
