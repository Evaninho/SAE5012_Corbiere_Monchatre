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
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }
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
        $admin->setPrenom($faker->firstName());
        $admin->setNom($faker->lastName());
        $admin->setPseudo($faker->userName());
        $admin->setPays($faker->country());
        $admin->setSportFavoris($faker->word());
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setRoles(["ROLE_ADMIN"]);
        $manager->persist($admin);
        $users[] = $admin;

        // 4 users
        for ($i = 0; $i < 4; $i++) {
            $u = new User();
            $u->setEmail($faker->unique()->email());
        
            $u->setPrenom($faker->firstName());
            $u->setNom($faker->lastName());
            $u->setPseudo($faker->userName());
            $u->setPays($faker->country());
            $u->setSportFavoris($faker->word());
            $u->setPassword(
                $this->passwordHasher->hashPassword($u, 'password')
            );
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
            $dataset = $faker->randomElement($datasets);
            $datasetVariables = $dataset->getDatasetVariables()->toArray();

            // Get categorical and numeric variables
            $categoricalVars = array_filter($datasetVariables, fn($v) => $v->getType() === 'string');
            $numericVars = array_filter($datasetVariables, fn($v) => $v->getType() !== 'string');

            $xVar = !empty($categoricalVars) ? $faker->randomElement($categoricalVars)->getName() : "Variable_1_1";
            $yVar = !empty($numericVars) ? $faker->randomElement($numericVars)->getName() : "Variable_1_2";

            $viz = new Visualization();
            $viz->setChartType($faker->randomElement($chartTypes));
            $viz->setConfig([
                "title" => "Graphique " . ($i + 1),
                "xAxis" => $xVar,
                "yAxis" => $yVar,
                "colors" => ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]
            ]);
            $viz->setDataset($dataset);

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
