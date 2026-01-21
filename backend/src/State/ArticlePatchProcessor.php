<?php

namespace App\State;

use App\Entity\Article;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use Symfony\Bundle\SecurityBundle\Security;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Doctrine\ORM\EntityManagerInterface;

class ArticlePatchProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private PersistProcessor $persistProcessor,
        private EntityManagerInterface $entityManager
    ) {}

    public function process(
        mixed $data,
        Operation $operation,
        array $uriVariables = [],
        array $context = []
    ): mixed {
        if (!$data instanceof Article || $operation->getMethod() !== 'PATCH') {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        $user = $this->security->getUser();
        if (!$user) {
            throw new AccessDeniedException('Authentication required.');
        }

        $originalArticle = $this->entityManager
            ->getRepository(Article::class)
            ->find($data->getId());

        if (!$originalArticle) {
            throw new \LogicException('Article not found.');
        }

        // RÔLES
        $isAdmin  = $this->security->isGranted('ROLE_ADMIN');
        $isEditor = $this->security->isGranted('ROLE_EDITOR');
        $isAuthor = $this->security->isGranted('ROLE_AUTHOR');

        /**
         * 🎯 RÈGLE MÉTIER
         */
        if ($isAuthor && !$isEditor && !$isAdmin) {
            if (
                !$originalArticle->getAuthor()
                || (string) $originalArticle->getAuthor()->getId() !== (string) $user->getId()
            ) {
                throw new AccessDeniedException(
                    'Authors can only edit their own articles.'
                );
            }
        }

        // 🔒 Auteur intouchable
        $data->setAuthor($originalArticle->getAuthor());

        // ⏱ updatedAt auto
        $data->setUpdatedAt(new \DateTime('now', new \DateTimeZone('UTC')));

        // 🔗 Blocks
        foreach ($data->getBlocks() as $block) {
            if ($block->getArticle() !== $data) {
                $block->setArticle($data);
            }
        }

        // 🧹 Orphan removal
        $updatedBlockIds = array_map(
            static fn ($block) => $block->getId(),
            $data->getBlocks()->toArray()
        );

        foreach ($originalArticle->getBlocks() as $originalBlock) {
            if (
                $originalBlock->getId() !== null &&
                !in_array($originalBlock->getId(), $updatedBlockIds, true)
            ) {
                $data->removeBlock($originalBlock);
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
