<?php

namespace App\Controller;

use App\Entity\Dataset;
use App\Entity\DatasetVariable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/api')]
class DatasetController extends AbstractController
{
    #[Route('/datasets/upload', name: 'dataset_upload', methods: ['POST'])]
    public function upload(
        Request $request,
        EntityManagerInterface $em,
        SluggerInterface $slugger
    ): JsonResponse {
        $file = $request->files->get('file');
        $name = $request->request->get('name');

        if (!$file || !$name) {
            return new JsonResponse(['error' => 'File and name required'], 400);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            $file->move(
                $this->getParameter('datasets_directory'),
                $newFilename
            );
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Upload failed'], 500);
        }

        $dataset = new Dataset();
        $dataset->setName($name);
        $dataset->setPath('/uploads/datasets/' . $newFilename);
        $dataset->setCreatedAt(new \DateTimeImmutable());
        $dataset->setUploadedBy($this->getUser());

        $em->persist($dataset);
        $em->flush();

        return new JsonResponse([
            'id' => $dataset->getId(),
            'name' => $dataset->getName(),
            'path' => $dataset->getPath(),
            'createdAt' => $dataset->getCreatedAt()->format('Y-m-d H:i:s')
        ], 201);
    }

    // 🔹 Réponse OPTIONS pour préflight
    #[Route('/datasets/upload', name: 'dataset_upload_options', methods: ['OPTIONS'])]
    public function uploadOptions(): JsonResponse
    {
        return new JsonResponse([], 204);
    }
}
