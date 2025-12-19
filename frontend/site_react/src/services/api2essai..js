// import { API_BASE_URL } from '../utils/constants';
// import { getAuthToken } from '../utils/helpers';

// Fonction helper pour gérer les réponses API Platform
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
    throw new Error(error.message || 'Erreur API');
  }
  
  const json = await response.json();
  
  // ADAPTATION API PLATFORM : extraire "member" si présent
  if (json['hydra:member']) {
    return {
      data: json['hydra:member'],
      totalItems: json['hydra:totalItems'] || json['hydra:member'].length
    };
  }
  
  // Si c'est déjà au bon format
  return json;
};

// Headers par défaut
const getHeaders = (includeAuth = false) => {
  const headers = {
    'Accept': 'application/ld+json', // Important pour API Platform
    'Content-Type': 'application/json'
  };
  
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// ========== ARTICLES ==========

export const getArticles = async (filters = {}) => {
  const { category, search, sort, page = 1, limit = 9 } = filters;
  
  const params = new URLSearchParams();
  if (category && category !== 'Toutes') params.append('category', category);
  if (search) params.append('title', search); // API Platform utilise souvent le nom du champ
  params.append('page', page);
  
  const response = await fetch(
    `${API_BASE_URL}/articles?${params.toString()}`,
    { headers: getHeaders(true) }
  );
  return handleResponse(response);
};

export const getArticleById = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/articles/${id}`,
    { headers: getHeaders(true) }
  );
  
  const json = await response.json();
  
  // Retourner au format attendu
  return {
    data: json
  };
};

export const incrementViews = async (id) => {
  // À implémenter selon votre API
  return Promise.resolve();
};

// ========== COMMENTAIRES ==========

export const getComments = async (articleId) => {
  const response = await fetch(
    `${API_BASE_URL}/comments?article=${articleId}`,
    { headers: getHeaders() }
  );
  return handleResponse(response);
};

export const addComment = async (articleId, content) => {
  const response = await fetch(`${API_BASE_URL}/comments`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({
      article: `/api/articles/${articleId}`, // IRI pour API Platform
      content: content
    })
  });
  
  const json = await response.json();
  return { data: json };
};

export const updateComment = async (commentId, content) => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'PUT',
    headers: getHeaders(true),
    body: JSON.stringify({ content })
  });
  
  const json = await response.json();
  return { data: json };
};

export const deleteComment = async (commentId) => {
  const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
    method: 'DELETE',
    headers: getHeaders(true)
  });
  
  if (response.status === 204) {
    return { success: true };
  }
  return handleResponse(response);
};

// ========== NOTATIONS ==========

export const rateArticle = async (articleId, rating) => {
  const response = await fetch(`${API_BASE_URL}/ratings`, {
    method: 'POST',
    headers: getHeaders(true),
    body: JSON.stringify({
      article: `/api/articles/${articleId}`,
      rating: rating
    })
  });
  
  const json = await response.json();
  return { data: json };
};

// ========== FAVORIS ==========

export const toggleFavorite = async (articleId) => {
  // Vérifier si déjà en favori
  const checkResponse = await fetch(
    `${API_BASE_URL}/favorites?article=${articleId}`,
    { headers: getHeaders(true) }
  );
  
  const checkData = await checkResponse.json();
  const existing = checkData['hydra:member']?.[0];
  
  if (existing) {
    // Supprimer
    await fetch(`${API_BASE_URL}/favorites/${existing.id}`, {
      method: 'DELETE',
      headers: getHeaders(true)
    });
    return { data: { is_favorite: false } };
  } else {
    // Ajouter
    const response = await fetch(`${API_BASE_URL}/favorites`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({
        article: `/api/articles/${articleId}`
      })
    });
    const json = await response.json();
    return { data: { is_favorite: true, ...json } };
  }
};