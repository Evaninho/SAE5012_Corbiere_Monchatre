<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251126140602 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE dataset (id INT AUTO_INCREMENT NOT NULL, uploaded_by_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, path VARCHAR(255) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_B7A041D0A2B28FE8 (uploaded_by_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE dataset_variable (id INT AUTO_INCREMENT NOT NULL, dataset_id INT DEFAULT NULL, name VARCHAR(255) NOT NULL, type VARCHAR(255) NOT NULL, order_index INT NOT NULL, INDEX IDX_53D9B104D47C2D1B (dataset_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE visualization (id INT AUTO_INCREMENT NOT NULL, dataset_id INT DEFAULT NULL, block_id INT NOT NULL, chart_type VARCHAR(255) NOT NULL, config JSON NOT NULL, INDEX IDX_E0936C40D47C2D1B (dataset_id), UNIQUE INDEX UNIQ_E0936C40E9ED820C (block_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE dataset ADD CONSTRAINT FK_B7A041D0A2B28FE8 FOREIGN KEY (uploaded_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE dataset_variable ADD CONSTRAINT FK_53D9B104D47C2D1B FOREIGN KEY (dataset_id) REFERENCES dataset (id)');
        $this->addSql('ALTER TABLE visualization ADD CONSTRAINT FK_E0936C40D47C2D1B FOREIGN KEY (dataset_id) REFERENCES dataset (id)');
        $this->addSql('ALTER TABLE visualization ADD CONSTRAINT FK_E0936C40E9ED820C FOREIGN KEY (block_id) REFERENCES block (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE dataset DROP FOREIGN KEY FK_B7A041D0A2B28FE8');
        $this->addSql('ALTER TABLE dataset_variable DROP FOREIGN KEY FK_53D9B104D47C2D1B');
        $this->addSql('ALTER TABLE visualization DROP FOREIGN KEY FK_E0936C40D47C2D1B');
        $this->addSql('ALTER TABLE visualization DROP FOREIGN KEY FK_E0936C40E9ED820C');
        $this->addSql('DROP TABLE dataset');
        $this->addSql('DROP TABLE dataset_variable');
        $this->addSql('DROP TABLE visualization');
    }
}
