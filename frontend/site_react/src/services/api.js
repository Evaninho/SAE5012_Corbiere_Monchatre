// // Fonction helper pour gérer les réponses API Platform
// const handleResponse = async (response) => {
//   if (!response.ok) {
//     const error = await response.json().catch(() => ({ message: 'Erreur serveur' }));
//     throw new Error(error.message || 'Erreur API');
//   }
  
//   const json = await response.json();
  
//   // ADAPTATION API PLATFORM : extraire "member" si présent
//   if (json['hydra:member']) {
//     return {
//       data: json['hydra:member'],
//       totalItems: json['hydra:totalItems'] || json['hydra:member'].length
//     };
//   }
  
//   // Si c'est déjà au bon format
//   return json;
// };

// // Headers par défaut
// const getHeaders = (includeAuth = false) => {
//   const headers = {
//     'Accept': 'application/ld+json', // Important pour API Platform
//     'Content-Type': 'application/json'
//   };
  
//   if (includeAuth) {
//     const token = getAuthToken();
//     if (token) {
//       headers['Authorization'] = `Bearer ${token}`;
//     }
//   }
  
//   return headers;
// };

// // ========== ARTICLES ==========

// export const getArticles = async (filters = {}) => {
//   const { category, search, sort, page = 1, limit = 9 } = filters;
  
//   const params = new URLSearchParams();
//   if (category && category !== 'Toutes') params.append('category', category);
//   if (search) params.append('title', search); // API Platform utilise souvent le nom du champ
//   params.append('page', page);
  
//   const response = await fetch(
//     `${API_BASE_URL}/articles?${params.toString()}`,
//     { headers: getHeaders(true) }
//   );
//   return handleResponse(response);
// };

// export const getArticleById = async (id) => {
//   const response = await fetch(
//     `${API_BASE_URL}/articles/${id}`,
//     { headers: getHeaders(true) }
//   );
  
//   const json = await response.json();
  
//   // Retourner au format attendu
//   return {
//     data: json
//   };
// };

// export const incrementViews = async (id) => {
//   // À implémenter selon votre API
//   return Promise.resolve();
// };

// // ========== COMMENTAIRES ==========

// export const getComments = async (articleId) => {
//   const response = await fetch(
//     `${API_BASE_URL}/comments?article=${articleId}`,
//     { headers: getHeaders() }
//   );
//   return handleResponse(response);
// };

// export const addComment = async (articleId, content) => {
//   const response = await fetch(`${API_BASE_URL}/comments`, {
//     method: 'POST',
//     headers: getHeaders(true),
//     body: JSON.stringify({
//       article: `/api/articles/${articleId}`, // IRI pour API Platform
//       content: content
//     })
//   });
  
//   const json = await response.json();
//   return { data: json };
// };

// export const updateComment = async (commentId, content) => {
//   const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
//     method: 'PUT',
//     headers: getHeaders(true),
//     body: JSON.stringify({ content })
//   });
  
//   const json = await response.json();
//   return { data: json };
// };

// export const deleteComment = async (commentId) => {
//   const response = await fetch(`${API_BASE_URL}/comments/${commentId}`, {
//     method: 'DELETE',
//     headers: getHeaders(true)
//   });
  
//   if (response.status === 204) {
//     return { success: true };
//   }
//   return handleResponse(response);
// };

// // ==========================================
// // RATINGS (Notations)
// // ==========================================

// // Récupérer les ratings d'un article
// export const getArticleRatings = async (articleId) => {
//   const response = await fetch(
//     `${API_BASE_URL}/ratings?article=${articleId}`,
//     { headers: getHeaders(true) }
//   );

//   const data = await handleResponse(response);
//   return data['hydra:member'] || [];
// };

// // Ajouter une notation
// export const addRating = async (articleId, userId, score, comment) => {
//   const response = await fetch(`${API_BASE_URL}/ratings`, {
//     method: 'POST',
//     headers: getHeaders(true),
//     body: JSON.stringify({
//       article: `/api/articles/${articleId}`,
//       user: `/api/users/${userId}`,
//       score: score,
//       comment: comment
//     })
//   });

//   return handleResponse(response);
// };

// // Calculer la moyenne des ratings d'un article
// export const getAverageRating = async (articleId) => {
//   const ratings = await getArticleRatings(articleId);

//   if (ratings.length === 0) return { average: 0, count: 0 };

//   const sum = ratings.reduce((acc, rating) => acc + rating.score, 0);
//   return {
//     average: (sum / ratings.length).toFixed(1),
//     count: ratings.length
//   };
// };
