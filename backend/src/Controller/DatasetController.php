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
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

#[Route('/api')]
class DatasetController extends AbstractController
{
    #[Route('/datasets/{id}/download', name: 'dataset_download', methods: ['GET'])]
    public function download(Dataset $dataset): Response
    {
        $filePath = $this->getParameter('datasets_directory') . '/' . basename($dataset->getPath());
        
        if (!file_exists($filePath)) {
            return new JsonResponse(['error' => 'File not found'], 404);
        }

        $csvContent = file_get_contents($filePath);
        
        return new Response($csvContent, 200, [
            'Content-Type' => 'text/csv; charset=utf-8',
            'Content-Disposition' => 'inline; filename="' . basename($dataset->getPath()) . '"'
        ]);
    }

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
        $extension = $file->guessExtension();
        $newFilename = $safeFilename.'.'.$extension;
        
        $datasetsDir = $this->getParameter('datasets_directory');
        
        // Vérifier si le fichier existe déjà et ne pas créer de doublon
        $counter = 1;
        $baseFilename = $safeFilename;
        while (file_exists($datasetsDir . '/' . $newFilename)) {
            $newFilename = $baseFilename . '-' . $counter . '.' . $extension;
            $counter++;
        }
        
        try {
            $uploadedFile = $file->move($datasetsDir, $newFilename);
            $filePath = $uploadedFile->getPathname();
        } catch (FileException $e) {
            return new JsonResponse(['error' => 'Upload failed: ' . $e->getMessage()], 500);
        }

        if (!file_exists($filePath)) {
            return new JsonResponse(['error' => 'File not found after upload'], 500);
        }

        $dataset = new Dataset();
        $dataset->setName($name);
        $dataset->setPath('/datasets/' . $newFilename);
        $dataset->setCreatedAt(new \DateTimeImmutable());
        $dataset->setUploadedBy($this->getUser());

        $em->persist($dataset);

        // Lire le CSV pour créer DatasetVariables

        try {
            $csvContent = file_get_contents($filePath);
            if (empty($csvContent)) {
                return new JsonResponse(['error' => 'Empty CSV file'], 400);
            }

            // Parse CSV with proper delimiter detection
            $csv = array_map(function($line) {
                return str_getcsv($line, ',', '"', '\\');
            }, explode("\n", trim($csvContent)));

            // Remove empty lines
            $csv = array_filter($csv, function($row) {
                return !empty(array_filter($row));
            });

            if (empty($csv)) {
                return new JsonResponse(['error' => 'No valid data found in CSV'], 400);
            }

            $headers = array_map('trim', $csv[0]);
            $dataRows = array_slice($csv, 1);

            if (empty($headers) || empty($dataRows)) {
                return new JsonResponse(['error' => 'CSV must have headers and at least one data row'], 400);
            }
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Error reading CSV file: ' . $e->getMessage()], 500);
        }

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
            $variable->setName(trim($header));  // 🔧 Trim ici aussi
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
