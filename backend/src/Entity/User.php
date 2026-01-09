<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use ApiPlatform\Metadata\{ApiResource, Get, GetCollection, Post, Put, Delete};
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[ApiResource(
    operations: [
        new Get(
            security: "is_granted('ROLE_USER')"
        ),
        new GetCollection(
            security: "is_granted('ROLE_ADMIN')"
        ),
        new Post(),
        new Put(
            security: "object == user or is_granted('ROLE_ADMIN')"
        ),
        new Delete(
            security: "is_granted('ROLE_ADMIN')"
        )
    ],
    normalizationContext: ['groups' => ['user:read']],
    denormalizationContext: ['groups' => ['user:write']],
)]



class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['user:read', 'article:read', 'rating:read', 'dataset:read'])]

    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:write', 'article:read', 'rating:read'])]

    private ?string $email = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $prenom = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $nom = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $pseudo = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $pays = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $sportFavoris = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    #[Groups(['user:read'])]
    private array $roles  = ['ROLE_USER'];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    #[Groups(['user:write'])]
    private ?string $password = null;

    #[ORM\Column]
    #[Groups(['user:read'])]
    private \DateTimeImmutable $createdAt;

    /**
     * @var Collection<int, Article>
     */
    #[ORM\OneToMany(targetEntity: Article::class, mappedBy: 'author')]
    #[Groups(['user:read'])]
    private Collection $articles;

    /**
     * @var Collection<int, Rating>
     */
    #[ORM\OneToMany(targetEntity: Rating::class, mappedBy: 'user')]
    #[Groups(['user:read'])]
    private Collection $ratings;

    /**
     * @var Collection<int, Dataset>
     */
    #[ORM\OneToMany(targetEntity: Dataset::class, mappedBy: 'uploadedBy')]
    #[Groups(['user:read'])]
    private Collection $datasets;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->articles = new ArrayCollection();
        $this->ratings = new ArrayCollection();
        $this->datasets = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(?string $prenom): static
    {
        $this->prenom = $prenom;
        return $this;
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(?string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getPseudo(): ?string
    {
        return $this->pseudo;
    }

    public function setPseudo(?string $pseudo): static
    {
        $this->pseudo = $pseudo;
        return $this;
    }

    public function getPays(): ?string
    {
        return $this->pays;
    }

    public function setPays(?string $pays): static
    {
        $this->pays = $pays;
        return $this;
    }

    public function getSportFavoris(): ?string
    {
        return $this->sportFavoris;
    }

    public function setSportFavoris(?string $sportFavoris): static
    {
        $this->sportFavoris = $sportFavoris;
        return $this;
    }
    /**
     * A visual identifier that represents this user.
     *
     * @see UserInterface
     */
    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    /**
     * @see UserInterface
     */
    public function getRoles(): array
    {
        $roles = $this->roles;
        // guarantee every user at least has ROLE_USER
        $roles[] = 'ROLE_USER';

        return array_unique($roles);
    }

    /**
     * @param list<string> $roles
     */
    public function setRoles(array $roles): static
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @see PasswordAuthenticatedUserInterface
     */
    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;

        return $this;
    }

    #[\Deprecated]
    public function eraseCredentials(): void
    {
        // @deprecated, to be removed when upgrading to Symfony 8
    }
    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    /**
     * @return Collection<int, Article>
     */
    public function getArticles(): Collection
    {
        return $this->articles;
    }

    public function addArticle(Article $article): static
    {
        if (!$this->articles->contains($article)) {
            $this->articles->add($article);
            $article->setAuthor($this);
        }

        return $this;
    }

    public function removeArticle(Article $article): static
    {
        if ($this->articles->removeElement($article)) {
            // set the owning side to null (unless already changed)
            if ($article->getAuthor() === $this) {
                $article->setAuthor(null);
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
            $rating->setUser($this);
        }

        return $this;
    }

    public function removeRating(Rating $rating): static
    {
        if ($this->ratings->removeElement($rating)) {
            // set the owning side to null (unless already changed)
            if ($rating->getUser() === $this) {
                $rating->setUser(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Dataset>
     */
    public function getDatasets(): Collection
    {
        return $this->datasets;
    }

    public function addDataset(Dataset $dataset): static
    {
        if (!$this->datasets->contains($dataset)) {
            $this->datasets->add($dataset);
            $dataset->setUploadedBy($this);
        }

        return $this;
    }

    public function removeDataset(Dataset $dataset): static
    {
        if ($this->datasets->removeElement($dataset)) {
            // set the owning side to null (unless already changed)
            if ($dataset->getUploadedBy() === $this) {
                $dataset->setUploadedBy(null);
            }
        }

        return $this;
    }
}
