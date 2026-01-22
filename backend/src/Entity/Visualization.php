<?php

namespace App\Entity;

use App\Repository\VisualizationRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\{ApiResource, Get, GetCollection, Post, Put, Delete};
use Symfony\Component\Serializer\Annotation\Groups;
#[ORM\Entity(repositoryClass: VisualizationRepository::class)]
#[ApiResource(
     operations: [
        new Get(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new GetCollection(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Post(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Put(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(name: 'delete', security: "is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_ADMIN')")
    ],
    normalizationContext: ['groups' => ['visualization:read']],
    denormalizationContext: ['groups' => ['visualization:write']]
)]
class Visualization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['visualization:read', 'dataset:read', 'block:read'])]

    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['visualization:read', 'visualization:write', 'dataset:read', 'block:read'])]
    private ?string $chartType = null;

    #[ORM\Column]
    #[Groups(['visualization:read', 'visualization:write', 'dataset:read', 'block:read'])]

    private array $config = [];

    #[ORM\ManyToOne(inversedBy: 'visualizations')]
    #[Groups(['visualization:read', 'visualization:write'])]

    private ?Dataset $dataset = null;

    #[ORM\OneToOne(inversedBy: 'visualization', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['visualization:read', 'visualization:write'])]
    private ?Block $block = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getChartType(): ?string
    {
        return $this->chartType;
    }

    public function setChartType(string $chartType): static
    {
        $this->chartType = $chartType;

        return $this;
    }

    public function getConfig(): array
    {
        return $this->config;
    }

    public function setConfig(array $config): static
    {
        $this->config = $config;

        return $this;
    }

    public function getDataset(): ?Dataset
    {
        return $this->dataset;
    }

    public function setDataset(?Dataset $dataset): static
    {
        $this->dataset = $dataset;

        return $this;
    }

    public function getBlock(): ?Block
    {
        return $this->block;
    }

    public function setBlock(?Block $block): static
    {
        $this->block = $block;

        if ($block !== null && $block->getVisualization() !== $this) {
            $block->setVisualization($this);
        }

        return $this;
    }
}
