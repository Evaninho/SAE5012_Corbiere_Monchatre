<?php

namespace App\DataFixtures;

use App\Entity\User;
use App\Entity\Article;
use App\Entity\Block;
use App\Entity\Visualization;
use App\Entity\Dataset;
use App\Entity\DatasetVariable;
use App\Entity\Rating;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;

class AppFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $faker = Factory::create('fr_FR');

        // =========================
        // USERS
        // =========================
        $users = [];

        // Admin
        $admin = new User();
        $admin->setEmail("admin@olympeak.com");
        $admin->setPassword("admin123"); // ⚠️ À encoder si tu utilises password hashing
        $admin->setRoles(["ROLE_ADMIN"]);
        $manager->persist($admin);
        $users[] = $admin;

        // 4 users
        for ($i = 0; $i < 4; $i++) {
            $u = new User();
            $u->setEmail($faker->unique()->email());
            $u->setPassword("password");
            $u->setRoles(["ROLE_USER"]);
            $manager->persist($u);
            $users[] = $u;
        }

        // =========================
        // DATASETS + VARIABLES
        // =========================
        $datasets = [];

        for ($i = 0; $i < 3; $i++) {
            $dataset = new Dataset();
            $dataset->setName("Dataset " . ($i + 1));
            $dataset->setPath("datasets/data" . ($i + 1) . ".csv");
            $dataset->setCreatedAt(new \DateTimeImmutable());
            $dataset->setUploadedBy($faker->randomElement($users));

            $manager->persist($dataset);
            $datasets[] = $dataset;

            // Variables
            for ($j = 0; $j < 5; $j++) {
                $var = new DatasetVariable();
                $var->setName("Variable_" . ($i + 1) . "_" . ($j + 1));
                $var->setType($faker->randomElement(["string", "integer", "float"]));
                $var->setDataset($dataset);
                $var->setOrderIndex($j);
                
                $manager->persist($var);
            }
        }

        // =========================
        // VISUALIZATIONS
        // =========================
        $visualizations = [];

        $chartTypes = ["bar", "line", "pie", "scatter"];

        for ($i = 0; $i < 10; $i++) {
            $viz = new Visualization();
            $viz->setChartType($faker->randomElement($chartTypes));
            $viz->setConfig([
                "title" => "Graphique " . ($i + 1),
                "x" => "Variable X",
                "y" => "Variable Y"
            ]);
            $viz->setDataset($faker->randomElement($datasets));

            $manager->persist($viz);
            $visualizations[] = $viz;
        }

        // =========================
        // ARTICLES
        // =========================
        $articles = [];

        for ($i = 0; $i < 6; $i++) {
            $article = new Article();
            $article->setTitle("Article Olympique " . ($i + 1));
            $article->setContent("Description générale de l'article.");
            $article->setCreatedAt(new \DateTimeImmutable());
            $article->setAuthor($faker->randomElement($users));

            $manager->persist($article);
            $articles[] = $article;

            // BLOCKS
            for ($b = 0; $b < rand(3, 6); $b++) {
                $block = new Block();
                $block->setType($faker->randomElement(["text", "image", "visualization"]));
                $block->setOrderIndex($b);
                $block->setArticle($article);

                if ($block->getType() === "text") {
                    $block->setContent([
                        "text" => $faker->paragraph(3)
                    ]);
                } elseif ($block->getType() === "image") {
                    $block->setContent([
                        "url" => "https://picsum.photos/800/400?random=" . rand(1, 100)
                    ]);
                } else {
                    $block->setContent(["info" => "visualization block"]);

                    // Attacher une visualisation
                    $viz = $faker->randomElement($visualizations);
                    $block->setVisualization($viz);
                    $viz->setBlock($block);
                }

                $manager->persist($block);
            }
        }

        // =========================
        // RATINGS
        // =========================
        foreach ($articles as $article) {
            for ($r = 0; $r < rand(2, 8); $r++) {
                $rating = new Rating();
                $rating->setStars(rand(1, 5));
                $rating->setComment($faker->optional()->sentence());
                $rating->setCreatedAt(new \DateTimeImmutable());
                $rating->setUser($faker->randomElement($users));
                $rating->setArticle($article);

                $manager->persist($rating);
            }
        }

        // SAVE ALL
        $manager->flush();
    }
}
