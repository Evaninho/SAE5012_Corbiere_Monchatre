<?php

namespace App\Entity;

use App\Repository\BlockRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: BlockRepository::class)]
class Block
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $type = null;

    #[ORM\Column]
    private array $content = [];

    #[ORM\Column(nullable: false)]
    private ?int $orderIndex = 0;

    #[ORM\ManyToOne(inversedBy: 'blocks')]
    private ?Article $article = null;

    #[ORM\OneToOne(mappedBy: 'block', cascade: ['persist', 'remove'])]
    private ?Visualization $visualization = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

        return $this;
    }

    public function getContent(): array
    {
        return $this->content;
    }

    public function setContent(array $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getOrderIndex(): ?int
    {
        return $this->orderIndex;
    }

    public function setOrderIndex(int $orderIndex): static
    {
        $this->orderIndex = $orderIndex;

        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(?Article $article): static
    {
        $this->article = $article;

        return $this;
    }
    public function getVisualization(): ?Visualization
    {
        return $this->visualization;
    }

    public function setVisualization(?Visualization $visualization): static
    {

        // set the owning side of the relation if necessary
        if ($visualization !== null && $visualization->getBlock() !== $this) {
            $visualization->setBlock($this);
        }

        $this->visualization = $visualization;

        return $this;
    }
}
