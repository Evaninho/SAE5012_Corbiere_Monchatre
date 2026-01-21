<?php

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTAuthenticatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use App\Repository\UserRepository;

class JWTAuthenticatedSubscriber implements EventSubscriberInterface
{
    public function __construct(private UserRepository $userRepository)
    {
    }

    public static function getSubscribedEvents(): array
    {
        return [
            JWTAuthenticatedEvent::class => 'onJWTAuthenticated',
        ];
    }

    public function onJWTAuthenticated(JWTAuthenticatedEvent $event): void
    {
        $token = $event->getToken();
        $user = $token->getUser();
        
        // Recharger l'utilisateur depuis la base de données pour avoir les rôles à jour
        if ($user && $user->getEmail()) {
            $freshUser = $this->userRepository->findOneBy(['email' => $user->getEmail()]);
            if ($freshUser) {
                // Remplacer l'utilisateur par la version fraîche de la base de données
                $token->setUser($freshUser);
            }
        }
    }
}

