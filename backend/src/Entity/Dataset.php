<?php

namespace App\Entity;

use App\Repository\DatasetRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\{ApiResource, Get, GetCollection, Post, Put, Delete};
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DatasetRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER')"),
        new GetCollection(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER')"),
        new Post(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER')"),
        new Put(security: "object.getUploadedBy() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')"),
        new Delete(security: "is_granted('ROLE_ADMIN')")
    ],
    normalizationContext: ['groups' => ['dataset:read']],
    denormalizationContext: ['groups' => ['dataset:write']]
)]

class Dataset
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['dataset:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['dataset:read', 'dataset:write', 'visualization:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['dataset:read', 'dataset:write'])]
    private ?string $path = null;

    #[ORM\Column]
    #[Groups(['dataset:read'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\ManyToOne(inversedBy: 'datasets')]
    #[Groups(['dataset:read', 'dataset:write'])]
    private ?User $uploadedBy = null;

    /**
     * @var Collection<int, DatasetVariable>
     */
    #[ORM\OneToMany(targetEntity: DatasetVariable::class, mappedBy: 'dataset')]
    #[Groups(['dataset:read'])]

    private Collection $datasetVariables;

    /**
     * @var Collection<int, Visualization>
     */
    #[ORM\OneToMany(targetEntity: Visualization::class, mappedBy: 'dataset')]
    #[Groups(['dataset:read'])]

    private Collection $visualizations;

    public function __construct()
    {
        $this->datasetVariables = new ArrayCollection();
        $this->visualizations = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

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

    public function getUploadedBy(): ?User
    {
        return $this->uploadedBy;
    }

    public function setUploadedBy(?User $uploadedBy): static
    {
        $this->uploadedBy = $uploadedBy;

        return $this;
    }

    /**
     * @return Collection<int, DatasetVariable>
     */
    public function getDatasetVariables(): Collection
    {
        return $this->datasetVariables;
    }

    public function addDatasetVariable(DatasetVariable $datasetVariable): static
    {
        if (!$this->datasetVariables->contains($datasetVariable)) {
            $this->datasetVariables->add($datasetVariable);
            $datasetVariable->setDataset($this);
        }

        return $this;
    }

    public function removeDatasetVariable(DatasetVariable $datasetVariable): static
    {
        if ($this->datasetVariables->removeElement($datasetVariable)) {
            // set the owning side to null (unless already changed)
            if ($datasetVariable->getDataset() === $this) {
                $datasetVariable->setDataset(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Visualization>
     */
    public function getVisualizations(): Collection
    {
        return $this->visualizations;
    }

    public function addVisualization(Visualization $visualization): static
    {
        if (!$this->visualizations->contains($visualization)) {
            $this->visualizations->add($visualization);
            $visualization->setDataset($this);
        }

        return $this;
    }

    public function removeVisualization(Visualization $visualization): static
    {
        if ($this->visualizations->removeElement($visualization)) {
            // set the owning side to null (unless already changed)
            if ($visualization->getDataset() === $this) {
                $visualization->setDataset(null);
            }
        }

        return $this;
    }
}
