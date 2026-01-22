## 📚 Guide d'Utilisation - Nouveaux Composants

### 🎯 Composant ImageBlock

#### Utilisation dans CreateArticlePage/GestionArticlePage/NewsDetailPage

```jsx
import { ImageBlock } from '../components/common/ImageBlock';

// Dans le JSX (bloc image)
{block.type === 'image' && (
  <ImageBlock
    blockId={block.id}
    imageUrl={block.content.url}
    mediaLibrary={mediaLibrary}
    loadingMedia={loadingMedia}
    onImageUpload={handleImageUpload}
    onImageUrlChange={updateBlockContent}
    onSelectFromMediaLibrary={selectFromMediaLibrary}
    onRemoveImage={removeImageFromBlock}
    onOpenMediaLibrary={setShowMediaLibrary}
  />
)}
```

#### Props Requises

| Prop | Type | Description |
|------|------|-------------|
| `blockId` | string/number | ID unique du block image |
| `imageUrl` | string | URL actuelle de l'image (peut être vide) |
| `mediaLibrary` | array | Liste des images disponibles |
| `loadingMedia` | boolean | État de chargement de la médiathèque |
| `onImageUpload` | function | (blockId, file) => void |
| `onImageUrlChange` | function | (blockId, {url}) => void |
| `onSelectFromMediaLibrary` | function | (blockId, imageUrl) => void |
| `onRemoveImage` | function | (blockId) => void |
| `onOpenMediaLibrary` | function | (blockId) => void |

#### Fonctionnalités Incluses

1. **Upload d'image**
   - Accepte fichiers image (image/*)
   - Convertit en DataURL (base64)
   - Appelle onImageUpload au changement

2. **URL directe**
   - Input text pour coller une URL
   - Déclenche onImageUrlChange
   - Validation côté serveur

3. **Médiathèque**
   - Bouton qui déclenche onOpenMediaLibrary
   - Affiche le nombre d'images disponibles

4. **Prévisualisation**
   - Affiche l'image si URL existe
   - Bouton supprimer (X) en overlay

---

### 🔍 Composant SearchBar

#### Utilisation dans GestionArticlePage

```jsx
import { SearchBar } from '../components/common/SearchBar';

// Dans le JSX
<SearchBar 
  searchTerm={searchTerm}
  onSearchChange={setSearchTerm}
  placeholder="Rechercher un article ou un auteur..."
/>

// État associé
const [searchTerm, setSearchTerm] = useState("");

// Utiliser le terme de recherche
const filteredArticles = articles?.filter(article => {
  const searchLower = searchTerm.toLowerCase();
  const titleMatch = article.title?.toLowerCase().includes(searchLower);
  const authorMatch = getAuthorName(article).toLowerCase().includes(searchLower);
  return titleMatch || authorMatch;
}) || [];
```

#### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `searchTerm` | string | - | Valeur actuelle (contrôlée) |
| `onSearchChange` | function | - | Callback lors du changement |
| `placeholder` | string | "Rechercher..." | Texte placeholder |

#### Fonctionnalités

- Icône de loupe intégrée
- Input avec focus styling
- Responsive design
- Input type="search" (avec bouton X natif)

---

### 🔧 Intégration Complète

#### Exemple dans GestionArticlePage

```jsx
// 1. Imports
import { ImageBlock } from '../components/common/ImageBlock';
import { SearchBar } from '../components/common/SearchBar';

// 2. États
const [searchTerm, setSearchTerm] = useState("");
const [showMediaLibrary, setShowMediaLibrary] = useState(null);
const [mediaLibrary, setMediaLibrary] = useState([]);
const [loadingMedia, setLoadingMedia] = useState(false);
const [editFormData, setEditFormData] = useState({ title: '', blocks: [] });

// 3. Charger la médiathèque au montage
useEffect(() => {
  loadMediaLibrary();
}, []);

// 4. Fonction de chargement
const loadMediaLibrary = async () => {
  setLoadingMedia(true);
  try {
    const response = await fetch(`${API_BASE_URL}/articles`);
    const data = await response.json();
    const articles = data.member || [];
    
    const allImages = [];
    articles.forEach(article => {
      article.blocks?.forEach(block => {
        if (block.type === 'image' && block.content?.url) {
          if (!allImages.some(img => img.url === block.content.url)) {
            allImages.push({
              id: `${article.id}-${block.id}`,
              url: block.content.url
            });
          }
        }
      });
    });
    
    setMediaLibrary(allImages);
  } finally {
    setLoadingMedia(false);
  }
};

// 5. Fonctions de gestion d'images
const handleImageUpload = (blockId, file) => {
  const reader = new FileReader();
  reader.onload = (event) => {
    updateBlockContent(blockId, { url: event.target.result });
  };
  reader.readAsDataURL(file);
};

const selectFromMediaLibrary = (blockId, imageUrl) => {
  updateBlockContent(blockId, { url: imageUrl });
  setShowMediaLibrary(null);
};

const removeImageFromBlock = (blockId) => {
  updateBlockContent(blockId, { url: '' });
};

// 6. Utilisation dans le JSX
return (
  <div>
    <SearchBar 
      searchTerm={searchTerm}
      onSearchChange={setSearchTerm}
      placeholder="Rechercher un article..."
    />
    
    {editFormData.blocks.map(block => (
      block.type === 'image' && (
        <ImageBlock
          blockId={block.id}
          imageUrl={block.content.url}
          mediaLibrary={mediaLibrary}
          loadingMedia={loadingMedia}
          onImageUpload={handleImageUpload}
          onImageUrlChange={updateBlockContent}
          onSelectFromMediaLibrary={selectFromMediaLibrary}
          onRemoveImage={removeImageFromBlock}
          onOpenMediaLibrary={setShowMediaLibrary}
        />
      )
    ))}
    
    {/* Modal Médiathèque */}
    {showMediaLibrary !== null && (
      <div style={modalStyle}>
        {/* Grille d'images */}
      </div>
    )}
  </div>
);
```

---

### 🎨 Styling Personnalisé

#### ImageBlock
Tous les styles sont intégrés au composant. Pour personnaliser :

```jsx
// Modifier dans src/components/common/ImageBlock.jsx
const styles = {
  imageOptionButton: {
    padding: '15px 20px',  // Modifier le padding
    border: '2px dashed #D9D9D9',  // Modifier la bordure
    // ...
  }
};
```

#### SearchBar
Tous les styles sont intégrés au composant. Pour personnaliser :

```jsx
// Modifier dans src/components/common/SearchBar.jsx
const inputSearchStyle = {
  height: '44px',
  width: '100%',
  // ...
};
```

---

### 🔄 Flux de Travail

#### Créer un Article
1. CreateArticlePage ouvre
2. loadMediaLibrary() charge les images existantes
3. Utilisateur ajoute un bloc image
4. ImageBlock s'affiche avec 3 options
5. Utilisateur choisit l'option (upload/URL/médiathèque)
6. Image s'affiche en prévisualisation

#### Modifier un Article (GestionArticlePage)
1. Clic sur "Modifier"
2. Modal ouvre avec isLoadingArticle = true
3. Données chargées du serveur
4. isLoadingArticle = false, le formulaire s'affiche
5. Même flux que la création

#### Éditer depuis NewsDetailPage
1. Clic sur bouton "Modifier" (top-right)
2. handleEdit() charge les données
3. Modal d'édition s'ouvre avec z-index: 1000
4. Même fonctionnalités que GestionArticlePage

---

### ⚠️ Points Importants

1. **Médiathèque**
   - Les images viennent de TOUS les articles
   - Les doublons sont filtrés (même URL)
   - Chargement asynchrone avec loadingMedia

2. **Upload d'image**
   - Utilise FileReader pour convertir en base64
   - Stocké en mémoire (pas sur le serveur immédiatement)
   - Envoyé au serveur lors de la sauvegarde

3. **Modal Médiathèque**
   - Z-index 1001 (au-dessus du modal d'édition 1000)
   - Cliquable sur l'overlay pour fermer
   - Grid responsive (1 col mobile, 3 cols desktop)

4. **Animations**
   - Hover effects sur les boutons
   - Loader avec rotation (animation spin)
   - Transitions 0.2s sur les changements

---

### 📋 Checklist de Vérification

- [ ] SearchBar apparaît dans GestionArticlePage
- [ ] Recherche fonctionne en temps réel
- [ ] ImageBlock s'affiche dans les 3 pages
- [ ] Upload d'image fonctionne
- [ ] URL directe fonctionne
- [ ] Médiathèque charge et affiche les images
- [ ] Sélection d'image depuis médiathèque fonctionne
- [ ] Supprimer l'image fonctionne
- [ ] Loader s'affiche pendant le chargement de l'article
- [ ] Modal médiathèque a z-index supérieur
- [ ] Bouton Enregistrer a animations hover
- [ ] Styles cohérents entre les pages
