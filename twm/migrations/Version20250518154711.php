<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250518154711 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE actividades (id INT AUTO_INCREMENT NOT NULL, nombre VARCHAR(255) NOT NULL, url VARCHAR(255) NOT NULL, foto VARCHAR(255) DEFAULT NULL, informacion LONGTEXT DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, username VARCHAR(255) NOT NULL, foto VARCHAR(255) DEFAULT NULL, telefono VARCHAR(255) DEFAULT NULL, viajes_realizados INT NOT NULL, nivel VARCHAR(255) NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE usuario_viaje (id INT AUTO_INCREMENT NOT NULL, usuario_id INT DEFAULT NULL, viaje_id INT DEFAULT NULL, INDEX IDX_9F8708DB38439E (usuario_id), INDEX IDX_9F870894E1E648 (viaje_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE viaje (id INT AUTO_INCREMENT NOT NULL, organizador_id INT NOT NULL, destino VARCHAR(255) NOT NULL, fecha_inicio DATE NOT NULL, fecha_fin DATE NOT NULL, presupuesto DOUBLE PRECISION NOT NULL, min_personas INT NOT NULL, max_personas INT NOT NULL, INDEX IDX_1D41ED16E3445778 (organizador_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE usuario_viaje ADD CONSTRAINT FK_9F8708DB38439E FOREIGN KEY (usuario_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE usuario_viaje ADD CONSTRAINT FK_9F870894E1E648 FOREIGN KEY (viaje_id) REFERENCES viaje (id)');
        $this->addSql('ALTER TABLE viaje ADD CONSTRAINT FK_1D41ED16E3445778 FOREIGN KEY (organizador_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE usuario_viaje DROP FOREIGN KEY FK_9F8708DB38439E');
        $this->addSql('ALTER TABLE usuario_viaje DROP FOREIGN KEY FK_9F870894E1E648');
        $this->addSql('ALTER TABLE viaje DROP FOREIGN KEY FK_1D41ED16E3445778');
        $this->addSql('DROP TABLE actividades');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE usuario_viaje');
        $this->addSql('DROP TABLE viaje');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
