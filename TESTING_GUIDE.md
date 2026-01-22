# Guide de Test - SAE5012 Implémentations

## 🚀 Instructions de démarrage

### Prérequis
- Docker installé et en cours d'exécution
- Node.js 16+
- Un navigateur web récent

### Démarrer l'application

1. **Backend (Symfony)**
   ```bash
   cd backend
   docker-compose up -d
   # Les migrations doivent s'exécuter automatiquement
   ```

2. **Frontend (React)**
   ```bash
   cd frontend/site_react
   npm install
   npm run dev
   # L'app sera accessible sur http://localhost:5173
   ```

---

## 📋 Checklist de test

### 1️⃣ Animation Navbar

#### Test de base
- [ ] Accéder à http://localhost:5173
- [ ] Survoler les liens de navigation (Accueil, Statistiques, Actualités, Contact, Jeux)
- [ ] Vérifier que le texte change de couleur en bleu (#0085C7)
- [ ] Vérifier le léger agrandissement (scale 1.05)

#### Bouton "se connecter"
- [ ] Non connecté: survoler le bouton "se connecter"
- [ ] Vérifier: background passe au vert (#009F3D), texte devient blanc
- [ ] Vérifier: bouton s'élève légèrement (translateY -2px)
- [ ] Vérifier: une ombre apparaît sous le bouton

#### Menu burger (mobile)
- [ ] Redimensionner le navigateur en < 768px
- [ ] Vérifier que le menu burger apparaît
- [ ] Survoler le burger button
- [ ] Vérifier: background bleu clair (#f0f9ff) et agrandissement

**Résultat attendu**: Animations fluides, réactives, sans lag

---

### 2️⃣ Animations de chargement

#### NewsPage3 (Actualités)
- [ ] Aller à http://localhost:5173/actualites
- [ ] La première fois, un LoadingScreen fullscreen doit apparaître
- [ ] Message: "Chargement des articles..."
- [ ] Spinner rotatif au centre
- [ ] Au chargement, les articles s'affichent normalement

#### NewsDetailPage (Détail article)
- [ ] Cliquer sur un article
- [ ] Un LoadingScreen fullscreen doit s'afficher brièvement
- [ ] Message: "Chargement de l'article..."
- [ ] L'article se charge et s'affiche complètement

#### Modal d'édition article
- [ ] Connecté en tant qu'auteur ou éditeur
- [ ] Cliquer sur "Modifier" sur un article
- [ ] La modal s'ouvre
- [ ] Un petite spinner doit aparaître si "Enregistrer" est cliqué
- [ ] Message: "Enregistrement..." avec spinner

**Résultat attendu**: Tous les loaders utilisent le même style LoadingScreen

---

### 3️⃣ Bouton Enregistrer (édition article)

#### État normal
- [ ] Cliquer sur "Modifier" sur un article (connecté)
- [ ] Vérifier: bouton "Enregistrer" est vert (#009F3D)
- [ ] Vérifier: texte blanc, border-radius 10px
- [ ] Hover: passe en vert plus foncé (#008835)
- [ ] Hover: s'élève avec une ombre sous le bouton

#### État de chargement
- [ ] Cliquer sur "Enregistrer" pour modifier l'article
- [ ] Vérifier: bouton passe en gris (#9ca3af)
- [ ] Vérifier: text change en "Enregistrement..."
- [ ] Vérifier: un petite spinner rotatif apparaît à gauche du texte
- [ ] Vérifier: le bouton devient disabled (not-allowed cursor)
- [ ] Au succès: message "Article modifié avec succès"

**Résultat attendu**: Animation fluide, feedback utilisateur clair

---

### 4️⃣ Gestion des Ratings (Modification/Suppression)

#### Prérequis
- [ ] Être connecté en tant qu'utilisateur
- [ ] Aller sur un article avec des commentaires

#### Test modification (PATCH)

**Cas 1: Modifier son propre commentaire**
- [ ] Sur un commentaire que vous avez écrit
- [ ] Vérifier: boutons "Modifier" et "Supprimer" sont visibles
- [ ] Cliquer "Modifier"
- [ ] Une modal s'ouvre avec:
  - Étoiles modifiables (cliquables)
  - Textarea avec le commentaire actuel
  - Boutons "Annuler" et "Enregistrer"
- [ ] Modifier les étoiles (ex: 4 au lieu de 5)
- [ ] Modifier le texte du commentaire
- [ ] Cliquer "Enregistrer"
- [ ] Vérifier: bouton affiche "Modification..."
- [ ] Vérifier: message "Votre commentaire a été mis à jour"
- [ ] Vérifier: la page se rafraîchit avec les nouvelles données

**Cas 2: Voir les boutons (sécurité)**
- [ ] Visiteur non connecté: aucun bouton d'action sur les commentaires
- [ ] Connecté mais pas créateur: aucun bouton d'action
- [ ] Créateur du commentaire: boutons visibles

#### Test suppression (DELETE)

**Cas 1: Supprimer son propre commentaire**
- [ ] Sur un commentaire que vous avez écrit
- [ ] Cliquer "Supprimer"
- [ ] Vérifier: bouton change en "Suppression..."
- [ ] Vérifier: message "Votre commentaire a été supprimé"
- [ ] Vérifier: le commentaire disparaît de la liste

**Cas 2: Suppressions avec rôles**
- [ ] Utilisateur normal: peut supprimer ses propres commentaires seulement
- [ ] Éditeur (ROLE_EDITOR): peut supprimer tous les commentaires
- [ ] Admin (ROLE_ADMIN): peut supprimer tous les commentaires

#### Gestion d'erreurs

**Erreur 403 Forbidden**
- [ ] Tenter de modifier le commentaire d'un autre (via API)
- [ ] Vérifier: message "Vous n'avez pas le droit de modifier ce commentaire"

**Erreur réseau**
- [ ] Simuler une erreur réseau (DevTools > Network > Offline)
- [ ] Cliquer "Modifier" ou "Supprimer"
- [ ] Vérifier: message d'erreur approprié

**Résultat attendu**: 
- Modification/suppression fonctionnent pour le créateur
- Sécurité respectée (éditeurs/admins peuvent tout supprimer)
- Messages clairs en cas d'erreur

---

### 5️⃣ Gestion des Ratings - Création

#### Créer un commentaire
- [ ] Aller sur un article
- [ ] Défiler vers "Laisser un commentaire"
- [ ] Cliquer sur les étoiles pour noter (1-5)
- [ ] Écrire un commentaire dans la textarea
- [ ] Cliquer "Soumettre"
- [ ] Vérifier: message "Commentaire publié !"
- [ ] Vérifier: le commentaire apparaît dans la liste

#### Règle métier: 1 commentaire par article
- [ ] Avoir commenté un article
- [ ] Recharger la page
- [ ] Essayer de commenter à nouveau
- [ ] Vérifier: message "Vous avez déjà commenté cet article"
- [ ] Vérifier: le formulaire reste bloqué

**Résultat attendu**: Création et validation fonctionnent correctement

---

## 🔍 Tests d'intégration API

### Tester les endpoints avec curl

#### POST /api/ratings (créer)
```bash
curl -X POST http://localhost:8000/api/ratings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stars": 5,
    "comment": "Excellent!",
    "article": "/api/articles/1"
  }'
```
✅ Réponse attendue: 201 Created

#### PATCH /api/ratings/1 (modifier)
```bash
curl -X PATCH http://localhost:8000/api/ratings/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stars": 4,
    "comment": "Bon article"
  }'
```
✅ Réponse attendue: 200 OK (si créateur)
❌ Réponse attendue: 403 Forbidden (si pas créateur)

#### DELETE /api/ratings/1 (supprimer)
```bash
curl -X DELETE http://localhost:8000/api/ratings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```
✅ Réponse attendue: 204 No Content (si autorisé)
❌ Réponse attendue: 403 Forbidden (si pas autorisé)

---

## 📱 Tests responsive

- [ ] Desktop (1920x1080): toutes les animations visible
- [ ] Tablet (768x1024): menu burger fonctionne
- [ ] Mobile (375x667): interface fluide, animations smooth

---

## 🐛 Débogage

### DevTools Chrome/Firefox

#### Onglet Console
- Rechercher les erreurs JavaScript
- Vérifier les requêtes API dans Network
- Status codes: 200, 201, 204, 400, 401, 403, 404

#### Onglet Network
- Filtre par XHR pour voir les requêtes API
- Vérifier les headers `Authorization: Bearer ...`
- Vérifier `Content-Type: application/json`
- Vérifier les réponses JSON

#### Performance
- Onglet Performance
- Enregistrer les animations
- Chercher les pics de CPU/mémoire
- Les animations doivent être fluides (60 fps)

### Backend Logs

```bash
# Voir les logs Docker
docker logs container_name

# Activer debug Symfony (si besoin)
# dans .env: APP_DEBUG=1
```

---

## ✅ Checklist finale

### Frontend
- [ ] Navbar animée (hover fluide)
- [ ] LoadingScreen uniformisé
- [ ] Bouton Enregistrer animé
- [ ] Commentaires avec mod/del
- [ ] Modal d'édition fonctionnelle
- [ ] Messages d'erreur clairs
- [ ] Aucune erreur console

### Backend
- [ ] PATCH /ratings/{id} fonctionne
- [ ] DELETE /ratings/{id} fonctionne
- [ ] Sécurité respectée (creator only)
- [ ] Erreurs 403 retournées correctement
- [ ] Aucune erreur PHP/Symfony

### Performance
- [ ] Animations fluides (60fps)
- [ ] Pas de lag sur les interactions
- [ ] Chargement rapide des données
- [ ] Pas de memory leak

### UX/UI
- [ ] Interface cohérente
- [ ] Feedback utilisateur clair
- [ ] Responsive design
- [ ] Accessibilité OK

---

## 📞 Support

En cas de problème:

1. Vérifier les logs (console + DevTools)
2. Vérifier les endpoints API (avec curl)
3. Vérifier l'authentification (token valide)
4. Vérifier les permissions de l'utilisateur
5. Redémarrer Docker si besoin

---

## 📚 Fichiers de référence

- [IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md) - Résumé technique complet
- [API_RATINGS_DOCUMENTATION.md](./API_RATINGS_DOCUMENTATION.md) - Documentation API complète
