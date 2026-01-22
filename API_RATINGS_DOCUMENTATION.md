# Documentation API - Ratings Management

## Endpoints

### GET /api/ratings
Récupère tous les ratings

**Réponse**: 200 OK
```json
[
  {
    "id": 1,
    "stars": 5,
    "comment": "Excellent article!",
    "createdAt": "2024-01-21T10:30:00Z",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "pseudo": "JohnDoe"
    },
    "article": {
      "id": 1,
      "title": "Article Title"
    }
  }
]
```

---

### GET /api/ratings/{id}
Récupère un rating spécifique

**Paramètres**: `id` (integer)

**Réponse**: 200 OK
```json
{
  "id": 1,
  "stars": 5,
  "comment": "Excellent article!",
  "createdAt": "2024-01-21T10:30:00Z",
  "user": { ... },
  "article": { ... }
}
```

**Erreurs**:
- `404 Not Found`: Rating inexistant

---

### POST /api/ratings
Crée un nouveau rating

**Authentification**: Requise (ROLE_USER, ROLE_AUTHOR, ROLE_EDITOR, ROLE_ADMIN)

**Exemple de requête**:
```bash
curl -X POST http://localhost:8000/api/ratings \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stars": 5,
    "comment": "Excellent article!",
    "article": "/api/articles/1"
  }'
```

**Réponse**: 201 Created
```json
{
  "id": 2,
  "stars": 5,
  "comment": "Excellent article!",
  "createdAt": "2024-01-21T10:30:00Z",
  "user": { "id": 1, ... },
  "article": { "id": 1, ... }
}
```

**Erreurs**:
- `400 Bad Request`: Article manquant ou user a déjà commenté
- `401 Unauthorized`: Authentification requise

---

### PATCH /api/ratings/{id}
Modifie un rating existant

**Authentification**: Requise (créateur du rating uniquement)

**Règle de sécurité**: `object.getUser() == user`

**Exemple de requête**:
```bash
curl -X PATCH http://localhost:8000/api/ratings/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "stars": 4,
    "comment": "Bon article, quelques améliorations possibles"
  }'
```

**Réponse**: 200 OK
```json
{
  "id": 1,
  "stars": 4,
  "comment": "Bon article, quelques améliorations possibles",
  "createdAt": "2024-01-21T10:30:00Z",
  "user": { ... },
  "article": { ... }
}
```

**Erreurs**:
- `401 Unauthorized`: Non authentifié
- `403 Forbidden`: Pas le créateur du rating
- `404 Not Found`: Rating inexistant

---

### DELETE /api/ratings/{id}
Supprime un rating

**Authentification**: Requise

**Règle de sécurité**: `object.getUser() == user or is_granted('ROLE_EDITOR') or is_granted('ROLE_ADMIN')`

**Qui peut supprimer?**
- Le créateur du rating
- Un éditeur (ROLE_EDITOR)
- Un administrateur (ROLE_ADMIN)

**Exemple de requête**:
```bash
curl -X DELETE http://localhost:8000/api/ratings/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Réponse**: 204 No Content

**Erreurs**:
- `401 Unauthorized`: Non authentifié
- `403 Forbidden`: Pas autorisé à supprimer
- `404 Not Found`: Rating inexistant

---

## Restrictions métier

### POST /api/ratings
⚠️ **Limitation importante**: Un utilisateur ne peut poster qu'UN seul rating par article
- Si l'utilisateur tente de commenter deux fois le même article: `400 Bad Request`
- Message: "Vous avez déjà commenté cet article"

### PATCH /api/ratings/{id}
✅ Modification permise:
- Par le créateur du rating uniquement
- Les autres utilisateurs reçoivent `403 Forbidden`

### DELETE /api/ratings/{id}
✅ Suppression permise:
- Par le créateur du rating
- Par les modérateurs (ROLE_EDITOR)
- Par les administrateurs (ROLE_ADMIN)

---

## Headers requis

### Authorization
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Content-Type (pour POST/PATCH)
```
Content-Type: application/json
```

---

## Codes HTTP

| Code | Signification |
|------|---------------|
| 200  | OK - Requête réussie |
| 201  | Created - Ressource créée |
| 204  | No Content - Suppression réussie |
| 400  | Bad Request - Données invalides |
| 401  | Unauthorized - Authentification requise |
| 403  | Forbidden - Accès refusé |
| 404  | Not Found - Ressource introuvable |

---

## Groups de sérialisation

### rating:read
Affiché lors de GET:
- `id`, `stars`, `comment`, `createdAt`
- `user` (id, email, pseudo)
- `article` (id, title)

### rating:write
Autorisé lors de POST/PATCH:
- `stars` (integer, requis)
- `comment` (string, optionnel)
- `article` (obligatoire pour POST)

---

## Exemples Frontend (React)

### Créer un rating
```javascript
const createRating = async (articleId, stars, comment) => {
  const response = await fetch('http://localhost:8000/api/ratings', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      stars,
      comment,
      article: `/api/articles/${articleId}`
    })
  });
  
  if (!response.ok) throw new Error('Erreur création rating');
  return await response.json();
};
```

### Modifier un rating
```javascript
const updateRating = async (ratingId, stars, comment) => {
  const response = await fetch(`http://localhost:8000/api/ratings/${ratingId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getToken()}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ stars, comment })
  });
  
  if (!response.ok) throw new Error('Erreur modification rating');
  return await response.json();
};
```

### Supprimer un rating
```javascript
const deleteRating = async (ratingId) => {
  const response = await fetch(`http://localhost:8000/api/ratings/${ratingId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  
  if (!response.ok) throw new Error('Erreur suppression rating');
};
```
