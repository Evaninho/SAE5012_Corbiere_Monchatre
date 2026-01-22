# Présentation Orale - Application de Visualisation de Données Olympiques

## Introduction (1-2 minutes)
"Bonjour/Bonjour Madame/Monsieur,

Aujourd'hui, je vais vous présenter notre projet de SAE  Olympeak: une application web de visualisation de données olympiques. Cette application permet aux utilisateurs d'explorer les statistiques des Jeux Olympiques à travers des graphiques interactifs, de consulter des actualités sportives et de tester leurs connaissances avec des jeux éducatifs.

Le projet utilise une architecture moderne avec React pour le front-end et Symfony pour le back-end, déployée dans un environnement Dockerisé."

---

## 1. Démonstration du Produit Final (5-7 minutes)

### Lancement de l'application
"Démarrons l'application pour vous montrer son fonctionnement."

*[Démarrer les conteneurs Docker]*
```bash
docker-compose up -d
```

*[Ouvrir l'application dans le navigateur - http://localhost]*

### Parcours utilisateur complet

#### Page d'accueil
"Voici la page d'accueil qui présente le projet et ses fonctionnalités principales :
- Section 'À propos' expliquant le concept
- Accès rapide aux statistiques, actualités et jeux
- Présentation des partenaires (Carrefour, EDF, Allianz, Decathlon)
- Aperçu des trois modes de jeu disponibles"

#### Authentification
"Pour accéder aux fonctionnalités avancées, l'utilisateur doit s'authentifier."

*[Se connecter avec un compte existant]*

#### Page Statistiques - Fonctionnalité Core
"C'est ici que se trouve le cœur de l'application : la visualisation de données."

*[Uploader un dataset CSV de médailles olympiques]*
- Montrer l'interface d'upload
- Sélectionner un fichier CSV
- Créer une visualisation (graphique en barres : pays vs nombre de médailles d'or)

*[Créer différentes visualisations]*
- Graphique en barres : Top 10 pays par médailles totales
- Camembert : Répartition des médailles par continent
- Graphique en ligne : Évolution des médailles dans le temps
- Nuage de points : Corrélation population vs performances

*[Démontrer les contrôles interactifs]*
- Filtrage par année (si données temporelles)
- Tri croissant/décroissant
- Limitation du nombre de résultats affichés

#### Section Actualités
"Passons maintenant à la gestion de contenu."

*[Créer un nouvel article]*
- Interface de création d'article
- Éditeur de contenu
- Gestion des articles (CRUD complet)

#### Jeux éducatifs
"Enfin, l'aspect ludique avec trois modes de jeu :
- Quiz rapide sur l'histoire olympique
- Devine le sport (reconnaissance de disciplines)
- Chrono records (battre des records de vitesse)"

---

## 2. Architecture Générale de l'Application (3-4 minutes)

### Technologies utilisées
"Notre application repose sur une architecture moderne full-stack :

**Front-end : React avec Vite**
- React 19.2.0 pour l'interface utilisateur
- React Router pour la navigation
- TanStack React Query pour la gestion des requêtes API
- Recharts pour les graphiques interactifs
- Lucide React pour les icônes
- Vite comme bundler ultra-rapide

**Back-end : Symfony 6.4**
- API Platform pour l'exposition automatique des API REST
- Doctrine ORM pour la persistance des données
- JWT Authentication pour la sécurité
- Nelmio CORS pour la gestion des requêtes cross-origin

**Infrastructure**
- Docker et Docker Compose pour la conteneurisation
- Nginx comme reverse proxy
- PostgreSQL comme base de données"

### Communication Front-Back
"Le lien entre React et Symfony se fait exclusivement via des API REST :

- **Authentification** : Login/register avec génération de tokens JWT
- **Datasets** : Upload de fichiers CSV, parsing automatique, création de métadonnées
- **Visualisations** : Création, stockage et récupération de configurations de graphiques
- **Articles** : CRUD complet pour le système de news
- **Utilisateurs** : Gestion des rôles et permissions (User, Data Provider, Editor, Admin)"

---

## 3. Interface React - Concepts et Outils Utilisés (4-5 minutes)

### Concepts React maîtrisés (déjà connus)
"Avant cette SAE, j'avais déjà une bonne base en React. Voici les concepts que j'ai pu réutiliser :

**Composants et Props**
- Architecture modulaire avec des composants réutilisables
- Passage de props pour la communication parent-enfant
- Exemple : Composant `StatsPage` qui reçoit les données utilisateur

**Hooks fondamentaux**
- `useState` pour la gestion d'état local (modales, formulaires)
- `useEffect` pour les effets de bord (chargement des données au montage)
- `useNavigate` de React Router pour la navigation programmatique

**Gestion d'état**
- État local pour les formulaires d'upload et de création de visualisations
- Props drilling pour transmettre les données entre composants"

### Concepts React nouvellement appris/approfondis

#### TanStack React Query (nouvellement appris)
"C'est un outil que j'ai découvert lors de cette SAE et qui a révolutionné ma façon de gérer les données.

**Avant** : Gestion manuelle des requêtes avec fetch, gestion d'état de chargement/erreur
```javascript
// Code traditionnel
const [loading, setLoading] = useState(false);
const [data, setData] = useState(null);
const [error, setError] = useState(null);

useEffect(() => {
  setLoading(true);
  fetch('/api/datasets')
    .then(res => res.json())
    .then(setData)
    .catch(setError)
    .finally(() => setLoading(false));
}, []);
```

**Après avec React Query** :
```javascript
// Code avec React Query
const { data, isLoading, error } = useQuery({
  queryKey: ['datasets'],
  queryFn: () => fetch('/api/datasets').then(res => res.json())
});
```

**Avantages découverts** :
- Cache automatique des données
- Synchronisation des requêtes
- Gestion optimisée du loading et des erreurs
- Mutations pour les opérations d'écriture
- Invalidation intelligente du cache"

#### Context API et Hooks personnalisés (approfondi)
"J'ai créé un hook personnalisé `usePermissions` pour gérer les rôles utilisateur :

```javascript
// Hook personnalisé pour les permissions
export function usePermissions() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Décodage du JWT pour extraire le rôle
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserRole(payload.roles?.[0] || null);
    }
  }, []);

  return { userRole };
}
```

**Utilisation dans les composants** :
```javascript
const { userRole } = usePermissions();

// Affichage conditionnel basé sur les rôles
{userRole === 'ROLE_DATA_PROVIDER' && (
  <button>Uploader un CSV</button>
)}
```

#### Gestion d'état complexe
"Pour la page de statistiques, j'ai dû gérer un état complexe avec :
- Liste des datasets
- Dataset sélectionné
- Données CSV parsées
- Configuration des visualisations
- Contrôles d'affichage (tri, filtrage, limitation)

J'ai organisé cela avec un état principal et des fonctions utilitaires."

---

## 4. Développement Front-End - Points de Développement Remarquables (4-5 minutes)

### Point 1 : Parsing et Visualisation de Données CSV (Challenge technique)

#### Problématique
"**Challenge** : Permettre aux utilisateurs d'uploader des fichiers CSV arbitraires et de créer des visualisations sans connaître la structure des données.

**Pourquoi intéressant** : Les données olympiques peuvent avoir différents formats (avec/sans colonne Year, noms de colonnes variables, types de données mixtes)."

#### Solution implémentée
"**1. Upload et parsing automatique**
```javascript
// Utilisation de PapaParse pour le parsing CSV
Papa.parse(csvText, {
  header: true,
  dynamicTyping: true,
  skipEmptyLines: true,
  complete: (results) => {
    const data = results.data;
    const headers = results.meta.fields;

    // Détection automatique du format
    detectCSVFormat(data, headers);
  }
});
```

**2. Détection automatique du type de données**
```javascript
const detectVariableType = (data, columnName) => {
  const sample = data.slice(0, 10).map(row => row[columnName]);
  const hasNumbers = sample.some(val => !isNaN(val) && val !== null);
  return hasNumbers ? 'numeric' : 'categorical';
};
```

**3. Mapping intelligent des données pour Recharts**
```javascript
const renderChart = (viz, data) => {
  // Gestion des clés avec espaces
  const getDataValue = (row, key) => {
    if (row.hasOwnProperty(key)) return row[key];
    const trimmedKey = Object.keys(row).find(k => k.trim() === key.trim());
    return trimmedKey ? row[trimmedKey] : null;
  };

  // Filtrage et mapping des données
  const chartData = filteredData.map(row => ({
    name: String(getDataValue(row, config.xAxis) || '').substring(0, 25),
    value: parseFloat(getDataValue(row, config.yAxis)) || 0
  }));
};
```

**Apprentissages** :
- Manipulation avancée des données JavaScript
- Gestion des edge cases (données manquantes, formats variables)
- Optimisation des performances pour gros volumes de données"

### Point 2 : Interface Utilisateur Responsive et Interactive

#### Problématique
"**Challenge** : Créer une interface moderne, responsive et intuitive pour la visualisation de données complexes.

**Pourquoi intéressant** : Les utilisateurs doivent pouvoir explorer facilement des données complexes sans être des experts en data visualization."

#### Solutions implémentées

**Design System cohérent**
- Palette de couleurs olympique (#0085C7, #009F3D, #DF0024)
- Composants réutilisables (cards, modales, boutons)
- Animations et transitions fluides

**Interface adaptative**
```javascript
// Grille responsive
const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
  gap: '20px'
};
```

**Contrôles interactifs**
- Filtres dynamiques (année, tri, nombre d'éléments)
- Tooltips personnalisés avec informations contextuelles
- États de chargement et gestion d'erreurs

**UX optimisée**
- Drag & drop pour l'upload de fichiers
- Aperçu des données avant création de visualisations
- Messages d'aide contextuels

### Point 3 : Gestion des Rôles et Permissions en Front-End

#### Problématique
"**Challenge** : Gérer plusieurs niveaux de rôles utilisateurs (Visitor, User, Data Provider, Admin) et contrôler l'accès aux fonctionnalités (upload CSV, gestion articles, etc.) de façon sécurisée et centralisée.

**Pourquoi intéressant** : Sans système de permissions robuste, on risque des failles de sécurité et une expérience utilisateur incohérente. Il faut une architecture facilement maintenable."

#### Solution implémentée
"**Système centralisé de permissions via un hook personnalisé**

J'ai créé deux fichiers clés :
- `roles.js` : Définit la hiérarchie des rôles et leurs permissions
- `usePermissions.js` : Hook qui fournit les méthodes de vérification

```javascript
// Exemple : Page détail article avec permissions granulaires
const { userRole, userId } = usePermissions();

const canEditArticle = () => {
  // EDITOR et ADMIN peuvent modifier tous les articles
  if (userRole === 'EDITOR' || userRole === 'ADMIN') return true;
  
  // AUTHOR peut modifier seulement ses propres articles
  if (userRole === 'AUTHOR' && article.author?.id === userId) return true;
  
  return false;
};

{canEditArticle() && <Button>Modifier l'article</Button>}
```

**Approche adoptée** :
- Permissions **granulaires** : Hiérarchie de rôles + vérification du propriétaire de la ressource
- Logique de permissions encapsulée en fonctions réutilisables (`canEditArticle()`, `canDelete()`)
- Décodage du JWT côté client pour extraire le rôle et l'ID utilisateur
- Combinaison de vérifications : rôle + propriété de la ressource
- Validation des permissions aussi au backend (défense en profondeur)

**Apprentissages** :
- Gestion des permissions **contextuelles** (pas juste des rôles statiques)
- Importance de vérifier la propriété des ressources (qui a créé cet article ?)
- Hooks personnalisés pour abstraire la complexité des vérifications
- Patterns réutilisables pour différentes pages et ressources"

---

## Conclusion (2-3 minutes)

### Résumé des acquis
"Cette SAE m'a permis de consolider mes compétences en React tout en découvrant de nouveaux outils comme TanStack React Query. J'ai particulièrement apprécié le challenge technique du parsing de données CSV et de la création d'une interface intuitive pour la visualisation de données.

Le projet démontre une architecture moderne avec une séparation claire des responsabilités entre front-end et back-end, utilisant les meilleures pratiques de développement web actuel."

### Avec le projet entre les mains
"Si j'avais ce projet entre les mains aujourd'hui pour le présenter, je mettrais l'accent sur :

1. **La démo live** : Montrer concrètement le workflow complet
2. **Les challenges techniques** : Expliquer les décisions d'architecture
3. **L'évolution personnelle** : Ce que j'ai appris vs ce que je connaissais déjà
4. **Les perspectives d'amélioration** : Nouvelles fonctionnalités possibles

Ce projet représente un bel exemple d'application web moderne répondant à un besoin concret : rendre les données olympiques accessibles et compréhensibles pour tous."

---

## Temps total : 15-21 minutes
- Introduction : 1-2 min
- Démonstration : 5-7 min
- Architecture : 3-4 min
- Interface React : 4-5 min
- Développement : 4-5 min
- Conclusion : 2-3 min

## Support visuel recommandé
- Slides avec captures d'écran de l'application
- Schéma d'architecture
- Exemples de code (pas trop verbeux)
- Démo live de l'application

---

*Note : Adapter le timing selon le temps imparti et le public. Préparer des slides de backup au cas où la démo technique échoue.*
