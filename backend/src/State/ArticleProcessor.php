<?php

namespace App\State;

use App\Entity\Article;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use ApiPlatform\Doctrine\Common\State\PersistProcessor;
use Symfony\Bundle\SecurityBundle\Security;

class ArticleProcessor implements ProcessorInterface
{
    public function __construct(
        private Security $security,
        private PersistProcessor $persistProcessor
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof Article) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        if ($operation->getMethod() === 'POST') {

            // Auteur
            if ($user = $this->security->getUser()) {
                $data->setAuthor($user);
            }
            dump($data->getBlocks());

            // 🔥 FORÇAGE DU LIEN ARTICLE → BLOCKS
            foreach ($data->getBlocks() as $block) {
                if ($block->getArticle() !== $data) {
                    $block->setArticle($data);
                }
            }
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
