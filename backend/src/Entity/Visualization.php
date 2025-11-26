<?php

namespace App\Entity;

use App\Repository\VisualizationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: VisualizationRepository::class)]
class Visualization
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $chartType = null;

    #[ORM\Column]
    private array $config = [];

    #[ORM\ManyToOne(inversedBy: 'visualizations')]
    private ?Dataset $dataset = null;

    #[ORM\OneToOne(inversedBy: 'visualization', cascade: ['persist', 'remove'])]
    #[ORM\JoinColumn(nullable: false)]
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

        return $this;
    }
}
