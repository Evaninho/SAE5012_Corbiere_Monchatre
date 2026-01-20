<?php

namespace App\Controller;

use App\Entity\Dataset;
use App\Entity\DatasetVariable;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\String\Slugger\SluggerInterface;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class DatasetController extends AbstractController
{
    #[Route('/datasets/upload', name: 'dataset_upload', methods: ['POST'])]
    public function upload(Request $request, EntityManagerInterface $em, SluggerInterface $slugger): JsonResponse
    {
        $file = $request->files->get('file');
        $name = $request->request->get('name');

        if (!$file || !$name) {
            return new JsonResponse(['error' => 'File and name required'], 400);
        }

        $originalFilename = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
        $safeFilename = $slugger->slug($originalFilename);
        $newFilename = $safeFilename.'-'.uniqid().'.'.$file->guessExtension();

        try {
            $file->move($this->getParameter('datasets_directory'), $newFilename);
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Upload failed'], 500);
        }

        $dataset = new Dataset();
        $dataset->setName($name);
        $dataset->setPath('/datasets/' . $newFilename);
        $dataset->setCreatedAt(new \DateTimeImmutable());
        $dataset->setUploadedBy($this->getUser());

        $em->persist($dataset);

        // Lire le CSV pour créer DatasetVariables
        $csv = array_map('str_getcsv', file($file->getPathname()));
        $headers = array_map('trim', $csv[0] ?? []);

        foreach ($headers as $index => $header) {
            $columnSample = array_column(array_slice($csv, 1), $index);
            $isNumeric = false;
            foreach ($columnSample as $val) {
                if (is_numeric($val)) {
                    $isNumeric = true;
                    break;
                }
            }

            $variable = new DatasetVariable();
            $variable->setName($header);
            $variable->setType($isNumeric ? 'numeric' : 'categorical');
            $variable->setOrderIndex($index);
            $variable->setDataset($dataset);

            $em->persist($variable);
        }

        $em->flush();

        return new JsonResponse([
            'id' => $dataset->getId(),
            'name' => $dataset->getName(),
            'path' => $dataset->getPath(),
            'variables' => array_map(fn($v) => [
                'name' => $v->getName(),
                'type' => $v->getType()
            ], $dataset->getDatasetVariables()->toArray())
        ], 201);
    }
}
