<?php

namespace App\Entity;

use App\Repository\DatasetVariableRepository;
use Doctrine\ORM\Mapping as ORM;
use ApiPlatform\Metadata\{ApiResource, Get, Post};
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: DatasetVariableRepository::class)]
#[ApiResource(
    operations: [
        new Get(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER')"),
        new Post(security: "is_granted('ROLE_USER') or is_granted('ROLE_DATA_PROVIDER')")
    ],
    normalizationContext: ['groups' => ['variable:read']],
    denormalizationContext: ['groups' => ['variable:write']]
)]
class DatasetVariable
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['variable:read', 'dataset:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['variable:read', 'variable:write', 'dataset:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    #[Groups(['variable:read', 'variable:write', 'dataset:read'])]
    private ?string $type = null;

    #[ORM\Column]
    #[Groups(['variable:read', 'variable:write', 'dataset:read'])]
    private ?int $orderIndex = null;

    #[ORM\ManyToOne(inversedBy: 'datasetVariables')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['variable:read', 'variable:write'])]
    private ?Dataset $dataset = null;

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

    public function getType(): ?string
    {
        return $this->type;
    }

    public function setType(string $type): static
    {
        $this->type = $type;

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

    public function getDataset(): ?Dataset
    {
        return $this->dataset;
    }

    public function setDataset(?Dataset $dataset): static
    {
        $this->dataset = $dataset;

        return $this;
    }
}
