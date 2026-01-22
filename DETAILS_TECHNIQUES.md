# 🔧 Détails Techniques - Implémentation

## 📝 Résumé des Changements

### Composants Créés: 2
1. **ImageBlock.jsx** - Bloc image réutilisable
2. **SearchBar.jsx** - Barre de recherche réutilisable

### Fichiers Modifiés: 3
1. **GestionArticlePage.jsx** - Intégration complète ImageBlock + SearchBar + Médiathèque
2. **CreateArticlePage.jsx** - Intégration ImageBlock (refactorisation)
3. **NewsDetailPage.jsx** - Intégration ImageBlock + Médiathèque

### Imports Ajoutés: 5
- `ImageBlock` dans 3 pages
- `SearchBar` dans GestionArticlePage
- `Upload, Folder` icons dans CreateArticlePage (déjà présentes)

---

## 🎯 Architecture

### Hiérarchie des Composants

```
App
├── CreateArticlePage
│   ├── ImageBlock (réutilisable) ✨
│   └── Popup
│
├── GestionArticlePage
│   ├── SearchBar (réutilisable) ✨
│   ├── ImageBlock (réutilisable) ✨
│   └── Popup
│
└── NewsDetailPage
    ├── ImageBlock (réutilisable) ✨
    └── Popup
```

### State Management

#### GestionArticlePage
```javascript
// États existants
const [searchTerm, setSearchTerm] = useState("");
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [articleToDelete, setArticleToDelete] = useState(null);
const [showEditModal, setShowEditModal] = useState(false);
const [articleToEdit, setArticleToEdit] = useState(null);
const [editFormData, setEditFormData] = useState({ title: '', blocks: [] });
const [isLoadingArticle, setIsLoadingArticle] = useState(false);

// États NOUVEAUX pour Médiathèque
const [showMediaLibrary, setShowMediaLibrary] = useState(null);
const [mediaLibrary, setMediaLibrary] = useState([]);
const [loadingMedia, setLoadingMedia] = useState(false);

// État pour Popup
const [popup, setPopup] = useState({ isOpen: false, type: 'info', title: '', message: '' });
```

#### NewsDetailPage
```javascript
// États existants
const [article, setArticle] = useState(null);
const [loading, setLoading] = useState(true);
const [showEditModal, setShowEditModal] = useState(false);
const [editFormData, setEditFormData] = useState({ title: '', blocks: [] });
const [isLoadingArticle, setIsLoadingArticle] = useState(false);

// États NOUVEAUX pour Médiathèque
const [showMediaLibrary, setShowMediaLibrary] = useState(null);
const [mediaLibrary, setMediaLibrary] = useState([]);
const [loadingMedia, setLoadingMedia] = useState(false);

// État pour Popup
const [popup, setPopup] = useState({ isOpen: false, type: 'info', title: '', message: '' });
```

---

## 🔄 Flux de Données

### Upload d'Image

```
File (input change)
    ↓
handleImageUpload(blockId, file)
    ↓
FileReader.readAsDataURL(file)
    ↓
updateBlockContent(blockId, { url: dataURL })
    ↓
editFormData.blocks[index].content.url = dataURL
    ↓
ImageBlock affiche la prévisualisation
    ↓
handleSaveEdit() envoie au serveur
    ↓
PATCH /api/articles/{id}
```

### Sélection depuis Médiathèque

```
setShowMediaLibrary(blockId)
    ↓
loadMediaLibrary() (si première fois)
    ↓
fetch /api/articles
    ↓
Extraire toutes les images
    ↓
setMediaLibrary(allImages)
    ↓
Modal médiathèque affiche grid
    ↓
Clic sur image
    ↓
selectFromMediaLibrary(blockId, imageUrl)
    ↓
updateBlockContent(blockId, { url: imageUrl })
    ↓
setShowMediaLibrary(null) ferme le modal
```

### Chargement d'Article

```
handleEditClick(article)
    ↓
setIsLoadingArticle(true)
    ↓
setShowEditModal(true)
    ↓
fetch /api/articles/{id}
    ↓
Formater les blocks
    ↓
setEditFormData({ title, blocks })
    ↓
setIsLoadingArticle(false)
    ↓
Modal affiche le formulaire
```

---

## 🎨 Styling

### ImageBlock Styles
```javascript
const styles = {
  imageOptionsContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    marginBottom: '20px'
  },
  imageOptionButton: {
    padding: '15px 20px',
    border: '2px dashed #D9D9D9',
    borderRadius: '10px',
    backgroundColor: '#f9fafb',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    transition: 'all 0.2s',
    fontSize: '14px',
    fontWeight: '600',
    color: '#666'
  },
  // ... autres styles
};
```

### SearchBar Styles
```javascript
const sectionStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '20px',
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#ffffff",
  borderRadius: "10px"
};

const inputSearchStyle = {
  height: '44px',
  width: '100%',
  paddingLeft: '40px',
  paddingRight: '15px',
  border: 'none',
  backgroundColor: '#f3f3f3',
  borderRadius: '10px',
  fontSize: '14px',
  outline: 'none',
  transition: 'all 0.2s'
};
```

---

## 🔌 Hooks et Lifecycle

### useEffect Ajoutés

#### GestionArticlePage
```javascript
useEffect(() => {
  loadMediaLibrary();
}, []); // Au montage
```

#### NewsDetailPage
```javascript
useEffect(() => {
  loadArticle();
  loadMediaLibrary();
}, [id]); // Au montage et quand l'ID change
```

### Mutations (React Query)

Déjà existantes dans le code:
- `deleteMutation` - DELETE /api/articles/{id}
- `updateMutation` - PATCH /api/articles/{id}

---

## 📡 API Endpoints Utilisés

### Récupérer Médiathèque
```
GET /api/articles
Réponse: { member: [{ id, title, blocks: [{ type, content: { url } }] }] }
```

### Charger Article pour Édition
```
GET /api/articles/{id}
Réponse: { id, title, blocks: [{ id, type, orderIndex, content }] }
```

### Sauvegarder Article
```
PATCH /api/articles/{id}
Body: {
  title: string,
  content: string,
  blocks: [{ type, orderIndex, content }]
}
```

### Supprimer Article
```
DELETE /api/articles/{id}
```

---

## ⚡ Optimisations Implémentées

### Médiathèque
- ✅ Filtre les doublons (même URL)
- ✅ Chargée une seule fois (au montage)
- ✅ LoadingMedia état pour UX

### Loader
- ✅ Visible pendant fetch article
- ✅ Spinner CSS animé
- ✅ Modal fermable si erreur

### Upload
- ✅ FileReader pour base64
- ✅ Prévisualisation immédiate
- ✅ Pas de serveur jusqu'à sauvegarde

### Recherche
- ✅ En temps réel (pas de debounce)
- ✅ Filtre titre ET auteur
- ✅ Case-insensitive

---

## 🔒 Sécurité

### Authentification
- ✅ Token stocké en localStorage
- ✅ Envoyé en Authorization header
- ✅ Utilisé pour toutes les mutations

### Validation
- ✅ Titre non-vide requis
- ✅ Au moins un block requis
- ✅ Blocs non-vides requis

### Permissions
- ✅ Vérifiées côté frontend avec `canEdit()`
- ✅ Vérifiées côté backend aussi
- ✅ Boutons masqués si pas permission

---

## 🧪 Points de Test Critiques

### ImageBlock
```javascript
// Upload
handleImageUpload(blockId, file) → DataURL

// URL
updateBlockContent(blockId, { url: string })

// Médiathèque
onOpenMediaLibrary(blockId) → Modal

// Suppression
removeImageFromBlock(blockId) → url = ''
```

### SearchBar
```javascript
// Change
onSearchChange(newValue) → searchTerm update

// Filter
articles.filter(a => a.title.includes(searchTerm))
```

### Médiathèque Modal
```javascript
// Ouverture
setShowMediaLibrary(blockId)

// Sélection
selectFromMediaLibrary(blockId, imageUrl)

// Fermeture
setShowMediaLibrary(null)
```

---

## 🐛 Gestion d'Erreurs

### Médiathèque
```javascript
const loadMediaLibrary = async () => {
  setLoadingMedia(true);
  try {
    // ... fetch et traitement
  } catch (error) {
    console.error('Erreur chargement médiathèque:', error);
    // mediaLibrary reste [] (vide)
  } finally {
    setLoadingMedia(false);
  }
};
```

### Sauvegarde
```javascript
const handleSaveEdit = async () => {
  try {
    if (!editFormData.title.trim()) {
      setPopup({ type: 'warning', ... });
      return;
    }
    // ... appel serveur
  } catch (error) {
    setPopup({ type: 'error', message: error.message });
  }
};
```

---

## 📊 Performance

### Renders
- Chaque state change trigger re-render
- ImageBlock est pur (pas de side-effects)
- SearchBar est contrôlé (pas de state interne)

### Mémoire
- FileReader libéré après readAsDataURL
- Médiathèque en mémoire (tableau)
- Modals fermés = DOM décroché

### Network
- Une requête /api/articles pour médiathèque
- Une requête /api/articles/{id} pour édition
- Une requête PATCH pour sauvegarde

---

## 🚀 Déploiement

### Production Checklist
- [ ] npm run build réussit
- [ ] Pas de console.error en dev
- [ ] Pas de console.warn en dev
- [ ] API_BASE_URL correc
- [ ] Token stockage sécurisé
- [ ] Images chargées depuis bon domaine
- [ ] CORS configuré si nécessaire

---

## 🔍 Debugging

### Console Logs Utiles
```javascript
// Vérifier les images chargées
console.log('mediaLibrary:', mediaLibrary);

// Vérifier les blocks
console.log('editFormData.blocks:', editFormData.blocks);

// Vérifier la requête PATCH
console.log('patchData:', patchData);

// Vérifier le FileReader
console.log('imageUrl (base64):', imageUrl);
```

### DevTools React
- Inspecter l'état avec React DevTools
- Vérifier les re-renders
- Profiler les performances

---

## 📚 Fichiers de Référence

### Avant (Sans Composants)
- CreateArticlePage: 836 lignes (+ ImageBlock inline)
- GestionArticlePage: 818 lignes (+ simple input)
- NewsDetailPage: 1286 lignes (+ basic image handling)
- **Total: ~2940 lignes**

### Après (Avec Composants)
- ImageBlock.jsx: ~90 lignes (réutilisable)
- SearchBar.jsx: ~50 lignes (réutilisable)
- CreateArticlePage: ~750 lignes (-11%)
- GestionArticlePage: ~900 lignes (+10% mais + fonctionnalités)
- NewsDetailPage: ~1300 lignes (+1% mais + édition inline)
- **Total: ~3090 lignes (mais modulaire)**

**Gain: Code partagé + Maintenabilité ++**

---

## ✅ Validation Finale

- [x] Composants créés et exportés
- [x] Imports configurés correctement
- [x] States ajoutés et initialisés
- [x] Fonctions de gestion implémentées
- [x] Styles cohérents
- [x] Animations fonctionnelles
- [x] Loader visible
- [x] Modal médiathèque opérationnel
- [x] SearchBar intégrée
- [x] Pas de duplication
- [x] Code réutilisable
