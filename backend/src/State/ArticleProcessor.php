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
        // Assigner l'utilisateur actuel comme auteur si c'est une création (POST)
        if ($data instanceof Article && $operation->getMethod() === 'POST') {
            $user = $this->security->getUser();
            if ($user) {
                $data->setAuthor($user);
            }
        }

        // Déléguer au processeur standard de persistence
        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
