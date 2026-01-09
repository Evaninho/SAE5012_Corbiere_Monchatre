<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use App\Entity\User;

class UserPasswordHasherProcessor implements ProcessorInterface
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
        private ProcessorInterface $persistProcessor
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if (!$data instanceof User) {
            return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
        }

        // 🔐 Hash seulement si un nouveau mot de passe est fourni
        if ($data->getPlainPassword()) {
            $data->setPassword(
                $this->passwordHasher->hashPassword(
                    $data,
                    $data->getPlainPassword()
                )
            );

            // Nettoyage mémoire
            $data->setPlainPassword(null);
        }

        return $this->persistProcessor->process($data, $operation, $uriVariables, $context);
    }
}
