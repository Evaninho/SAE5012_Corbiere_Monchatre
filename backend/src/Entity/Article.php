<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use App\State\ArticleProcessor;
use App\State\ArticlePatchProcessor;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\{ApiResource, Get, GetCollection, Post, Put, Patch, Delete};
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ORM\HasLifecycleCallbacks]
#[ApiResource(
    operations: [
        new Get(
            security: "true"
        ),
        new GetCollection(
            security: "true"
        ),
        new Post(
            security: "is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR')",
            processor: ArticleProcessor::class
        ),
        new Put(
            security: "object.getAuthor() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"
        ),
        new Patch(
            security: " is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')",
            processor: ArticlePatchProcessor::class
        ),
        new Delete(
            security: "is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"
        )
    ],
    normalizationContext: ['groups' => ['article:read']],
    denormalizationContext: ['groups' => ['article:write']]
)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:read'])]

    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'article:write'])]

    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:read', 'article:write'])]

    private ?string $content = null;

    #[ORM\Column]
    #[Groups(['article:read'])]

    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:read'])]

    private ?\DateTime $updatedAt = null;

    #[ORM\ManyToOne(inversedBy: 'articles')]
    #[ORM\JoinColumn(nullable: true)]
    #[Groups(['article:read'])]

    private ?User $author = null;

    /**
     * @var Collection<int, Block>
     */
    #[ORM\OneToMany( mappedBy: 'article', targetEntity: Block::class, cascade: ['persist'], orphanRemoval: true )]
    #[Groups(['article:read', 'article:write'])]

    private Collection $blocks;

    /**
     * @var Collection<int, Rating>
     */
    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'article')]
    #[Groups(['article:read', 'article:write'])]

    private Collection $ratings;

    public function __construct()
    {
        $this->blocks = new ArrayCollection();
        $this->ratings = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getContent(): ?string
    {
        return $this->content;
    }

    public function setContent(string $content): static
    {
        $this->content = $content;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTime
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTime $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }

    /**
     * @return Collection<int, Block>
     */
    public function getBlocks(): Collection
    {
        return $this->blocks;
    }

    public function addBlock(Block $block): self
    {
        if (!$this->blocks->contains($block)) {
            $this->blocks->add($block);
            $block->setArticle($this);
        }

        return $this;
    }

    public function removeBlock(Block $block): static
    {
        if ($this->blocks->removeElement($block)) {
            // set the owning side to null (unless already changed)
            if ($block->getArticle() === $this) {
                $block->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Rating>
     */
    public function getRatings(): Collection
    {
        return $this->ratings;
    }

    public function addRating(Rating $rating): static
    {
        if (!$this->ratings->contains($rating)) {
            $this->ratings->add($rating);
            $rating->setArticle($this);
        }

        return $this;
    }

    public function removeRating(Rating $rating): static
    {
        if ($this->ratings->removeElement($rating)) {
            // set the owning side to null (unless already changed)
            if ($rating->getArticle() === $this) {
                $rating->setArticle(null);
            }
        }

        return $this;
    }

    // ===== Lifecycle Callbacks =====
    
    #[ORM\PrePersist]
    public function setCreatedAtValue(): void
    {
        if ($this->createdAt === null) {
            $this->createdAt = new \DateTimeImmutable();
        }
    }
}
