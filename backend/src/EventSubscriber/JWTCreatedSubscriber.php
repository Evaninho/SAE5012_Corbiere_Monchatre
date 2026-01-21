<?php

namespace App\EventSubscriber;

use Lexik\Bundle\JWTAuthenticationBundle\Event\JWTCreatedEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;

class JWTCreatedSubscriber implements EventSubscriberInterface
{
    public static function getSubscribedEvents()
    {
        return [
            JWTCreatedEvent::class => 'onJWTCreated',
        ];
    }

    public function onJWTCreated(JWTCreatedEvent $event): void
    {
        $user = $event->getUser();
        $payload = $event->getData();

        $payload['id'] = $user->getId();
        $payload['email'] = $user->getEmail();
        $payload['roles'] = $user->getRoles();

        $event->setData($payload);
    }
}
