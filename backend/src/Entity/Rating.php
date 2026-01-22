<?php

namespace App\Entity;

use App\Repository\RatingRepository;
use App\State\RatingProcessor;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use ApiPlatform\Metadata\{ApiResource, Get, GetCollection, Post, Patch, Delete};

#[ORM\Entity(repositoryClass: RatingRepository::class)]
#[ApiResource(
    operations: [
        new Get(),
        new GetCollection(),
        new Post(
            security: "is_granted('ROLE_USER') or is_granted('ROLE_AUTHOR') or is_granted('ROLE_EDITOR') or is_granted('ROLE_DATA_PROVIDER') or is_granted('ROLE_ADMIN')",
            processor: RatingProcessor::class
        ),
        new Patch(
            security: "object.getUser() == user",
            processor: RatingProcessor::class
        ),
        new Delete(
            security: "object.getUser() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"
        )
    ],
    normalizationContext: ['groups' => ['rating:read']],
    denormalizationContext: ['groups' => ['rating:write']]
)]

class Rating
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['rating:read', 'article:read'])]

    private ?int $id = null;

    #[ORM\Column]
    #[Groups(['rating:read', 'rating:write', 'article:read'])]

    private ?int $stars = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['rating:read', 'rating:write', 'article:read'])]

    private ?string $comment = null;

    #[ORM\Column]
    #[Groups(['rating:read', 'article:read'])]

    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'ratings')]
    #[Groups(['rating:read', 'article:read'])]

    private ?User $user = null;

    #[ORM\ManyToOne(inversedBy: 'ratings')]
    #[Groups(['rating:read', 'rating:write'])]

    private ?Article $article = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStars(): ?int
    {
        return $this->stars;
    }

    public function setStars(int $stars): static
    {
        $this->stars = $stars;

        return $this;
    }

    public function getComment(): ?string
    {
        return $this->comment;
    }

    public function setComment(?string $comment): static
    {
        $this->comment = $comment;

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

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;

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
}
