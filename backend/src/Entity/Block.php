<?php

namespace App\Entity;

use App\Repository\BlockRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\{ApiResource, Get, GetCollection, Post, Put, Delete};
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: BlockRepository::class)]
#[ApiResource(
    operations: [
        new Get(
            security: "true"
        ),
        new GetCollection(
            security: "true"
        ),
        new Post(security: "is_granted('ROLE_USER')"),
        new Put(security: "is_granted('ROLE_USER')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    normalizationContext: ['groups' => ['block:read']],
    denormalizationContext: ['groups' => ['block:write']]
)]
class Block
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['block:read', 'article:read'])]

    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['block:read', 'block:write', 'article:read', 'article:write'])]
    private ?string $type = null;

    #[ORM\Column]
    #[Groups(['block:read', 'block:write', 'article:read', 'article:write'])]

    private array $content = [];

    #[ORM\Column(nullable: false)]
    #[Groups(['block:read', 'block:write', 'article:read', 'article:write'])]

    private ?int $orderIndex = 0;

    #[ORM\ManyToOne(inversedBy: 'blocks')]
    #[Groups(['block:read', 'block:write'])]
    private ?Article $article = null;

    #[ORM\OneToOne(mappedBy: 'block', cascade: ['persist', 'remove'])]
    #[Groups(['block:read'])]
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

    public function setArticle(?Article $article): self
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
