const API_BASE_URL = 'http://localhost:8000/api';

// Headers par défaut pour API Platform
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Accept': 'application/ld+json',
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = localStorage.getItem('authToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Fonction helper pour gérer les réponses API Platform
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ 
      message: 'Erreur serveur' 
    }));
    throw new Error(error['hydra:description'] || error.message || 'Erreur API');
  }
  return response.json();
};

// ==========================================
// ARTICLES
// ==========================================

// Récupérer tous les articles avec pagination
export const getArticles = async (page = 1, filters = {}) => {
  const params = new URLSearchParams({ page });
  
  // Ajouter les filtres si présents
  if (filters.category) params.append('category', filters.category);
  if (filters.search) params.append('title', filters.search);
  
  const response = await fetch(
    `${API_BASE_URL}/articles?${params.toString()}`,
    { headers: getHeaders(true) }
  );
  
  const data = await handleResponse(response);
  
  // API Platform retourne les données dans "hydra:member"
  return {
    articles: data['hydra:member'] || [],
    totalItems: data['hydra:totalItems'] || 0,
    itemsPerPage: data['hydra:itemsPerPage'] || 30,
    currentPage: page
  };
};

// Récupérer un article par ID avec ses relations
export const getArticleById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/articles/${id}`,
    { headers: getHeaders(true) }
  );
  
  return handleResponse(response);
};

// Créer un article
export const createArticle = async (articleData) => {
  const response = await fetch(`${API_BASE_URL}/articles`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify(articleData)
  });
  
  return handleResponse(response);
};

// Mettre à jour un article
export const updateArticle = async (id, articleData) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify(articleData)
  });
  
  return handleResponse(response);
};

// Supprimer un article
export const deleteArticle = async (id) => {
  const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la suppression');
  }
  return true;
};

// ==========================================
// RATINGS (Notations)
// ==========================================

// Récupérer les ratings d'un article
export const getArticleRatings = async (articleId) => {
  const response = await fetch(
    `${API_BASE_URL}/ratings?article=${articleId}`,
    { headers: getHeaders() }
  );
  
  const data = await handleResponse(response);
  return data['hydra:member'] || [];
};

// Ajouter une notation
export const addRating = async (articleId, userId, score) => {
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({
      article: `/api/articles/${articleId}`,
      user: `/api/users/${userId}`,
      score: score
    })
  });
  
  return handleResponse(response);
};

// Calculer la moyenne des ratings d'un article
export const getAverageRating = async (articleId) => {
  const ratings = await getArticleRatings(articleId);
  
  if (ratings.length === 0) return { average: 0, count: 0 };
  
  const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
  return {
    average: (sum / ratings.length).toFixed(1),
    count: ratings.length
  };
};

// ==========================================
// DATASETS (Statistiques CSV)
// ==========================================

// Récupérer tous les datasets
export const getDatasets = async (page = 1) => {
  const response = await fetch(
    `${API_BASE_URL}/datasets?page=${page}`,
    { headers: getHeaders(true) }
  );
  
  const data = await handleResponse(response);
  
  return {
    datasets: data['hydra:member'] || [],
    totalItems: data['hydra:totalItems'] || 0
  };
};

// Récupérer un dataset par ID avec ses variables et visualisations
export const getDatasetById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/datasets/${id}`,
    { headers: getHeaders(true) }
  );
  
  return handleResponse(response);
};

// Récupérer les données CSV d'un dataset
export const getDatasetData = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/datasets/${id}/data`,
    { headers: getHeaders(true) }
  );
  
  return handleResponse(response);
};

// ==========================================
// VISUALIZATIONS
// ==========================================

// Récupérer les visualisations d'un dataset
export const getDatasetVisualizations = async (datasetId) => {
  const response = await fetch(
    `${API_BASE_URL}/visualizations?dataset=${datasetId}`,
    { headers: getHeaders() }
  );
  
  const data = await handleResponse(response);
  return data['hydra:member'] || [];
};

// Créer une visualisation
export const createVisualization = async (datasetId, chartType, config) => {
  const response = await fetch(`${API_BASE_URL}/visualizations`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({
      dataset: `/api/datasets/${datasetId}`,
      chartType: chartType,
      config: config
    })
  });
  
  return handleResponse(response);
};

// ==========================================
// USERS
// ==========================================

// Récupérer les informations d'un utilisateur
export const getUserById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/users/${id}`,
    { headers: getHeaders(true) }
  );
  
  return handleResponse(response);
};

// ==========================================
// AUTHENTIFICATION
// ==========================================

// Connexion
export const login = async (email, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  return handleResponse(response);
};

// Inscription
export const register = async (userData) => {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(userData)
  });
  
  return handleResponse(response);
};

// ==========================================
// FONCTIONS UTILITAIRES
// ==========================================

// Extraire l'ID depuis l'IRI API Platform (/api/articles/5 -> 5)
export const extractIdFromIri = (iri) => {
  if (!iri) return null;
  const parts = iri.split('/');
  return parseInt(parts[parts.length - 1]);
};

// Construire l'IRI depuis l'ID (5 -> /api/articles/5)
export const buildIri = (resource, id) => {
  return `/api/${resource}/${id}`;
};

// ==========================================
// GESTION DU CACHE (Optionnel mais recommandé)
// ==========================================

// Cache simple en mémoire pour éviter les appels répétés
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedData = async (key, fetchFunction) => {
  const cached = cache.get(key);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await fetchFunction();
  cache.set(key, { data, timestamp: Date.now() });
  
  return data;
};

// Vider le cache
export const clearCache = () => {
  cache.clear();
};

// ==========================================
// EXEMPLE D'UTILISATION AVEC CACHE
// ==========================================

// Récupérer les articles avec cache
export const getArticlesCached = async (page = 1, filters = {}) => {
  const cacheKey = `articles_${page}_${JSON.stringify(filters)}`;
  return getCachedData(cacheKey, () => getArticles(page, filters));
};

// Récupérer un dataset avec cache
export const getDatasetByIdCached = async (id) => {
  const cacheKey = `dataset_${id}`;
  return getCachedData(cacheKey, () => getDatasetById(id));
};