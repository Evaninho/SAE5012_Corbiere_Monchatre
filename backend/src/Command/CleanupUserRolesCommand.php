<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:cleanup:roles',
    description: 'Nettoie les rôles en doublons dans la base de données'
)]
class CleanupUserRolesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $users = $this->em->getRepository(User::class)->findAll();
        $cleaned = 0;

        $io->writeln('🧹 Nettoyage des rôles utilisateurs...');
        $io->progressStart(count($users));

        foreach ($users as $user) {
            $roles = $user->getRoles();
            $filteredRoles = [];

            // Hiérarchie des rôles: garder le plus haut niveau uniquement
            if (in_array('ROLE_ADMIN', $roles)) {
                $filteredRoles = ['ROLE_ADMIN'];
            } elseif (in_array('ROLE_DATA_PROVIDER', $roles)) {
                $filteredRoles = ['ROLE_DATA_PROVIDER'];
            } elseif (in_array('ROLE_EDITOR', $roles)) {
                $filteredRoles = ['ROLE_EDITOR'];
            } elseif (in_array('ROLE_AUTHOR', $roles)) {
                $filteredRoles = ['ROLE_AUTHOR'];
            } else {
                $filteredRoles = ['ROLE_USER'];
            }

            // Si le rôle a changé
            if (array_diff($roles, $filteredRoles) || array_diff($filteredRoles, $roles)) {
                $io->writeln(sprintf(
                    '👤 %s: %s → %s',
                    $user->getEmail(),
                    implode(', ', $roles),
                    implode(', ', $filteredRoles)
                ));
                
                $user->setRoles($filteredRoles);
                $this->em->persist($user);
                $cleaned++;
            }

            $io->progressAdvance();
        }

        $io->progressFinish();
        $this->em->flush();

        $io->success("✅ Nettoyage terminé! $cleaned utilisateur(s) modifié(s).");

        return Command::SUCCESS;
    }
}
