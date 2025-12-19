import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "../components/news/search";
import { MessageSquare, Eye, Heart, Star, Send, Edit2, Trash2 } from "lucide-react";

export function NewsPage3() {
  const [expandedArticle, setExpandedArticle] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState("");
  const [favorites, setFavorites] = useState({});
  const [ratings, setRatings] = useState({});
  const [hoveredStar, setHoveredStar] = useState({});

  // Récupérer le token et user ID
  const getToken = () => localStorage.getItem('authToken');
  const getUserId = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData).id : null;
  };
  const isLoggedIn = !!getToken();
  const currentUserId = getUserId();

  // FETCH ARTICLES (VOTRE CODE - NE CHANGE PAS)
  const fetchArticles = async () => {
    const response = await fetch("http://localhost:8000/api/articles");

    if (!response.ok) {
      throw new Error("Erreur API");
    }

    const data = await response.json();
    return data.member;
  };

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  // FETCH COMMENTAIRES d'un article
  const fetchComments = async (articleId) => {
    if (comments[articleId]) return; // Déjà chargés

    try {
      const response = await fetch(`http://localhost:8000/api/rantings/${articleId}/comments`);
      const data = await response.json();
      setComments(prev => ({ ...prev, [articleId]: data.data || [] }));
      console.log(data);
    } catch (error) {
      console.error('Erreur commentaires:', error);
    }
  };

  // AJOUTER UN COMMENTAIRE
  const handleAddComment = async (articleId) => {
    if (!newComment.trim()) return;

    try {
      const response = await fetch(`http://localhost:8000/api/articles/${articleId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ content: newComment })
      });

      const data = await response.json();
      setComments(prev => ({
        ...prev,
        [articleId]: [data.data, ...(prev[articleId] || [])]
      }));
      setNewComment("");
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
      alert(error.message);
    }
  };

  // TOGGLE FAVORI
  const handleToggleFavorite = async (articleId) => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté');
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/articles/${articleId}/favorite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      setFavorites(prev => ({
        ...prev,
        [articleId]: !prev[articleId]
      }));
    } catch (error) {
      console.error('Erreur favori:', error);
    }
  };

  // NOTER UN ARTICLE
  const handleRate = async (articleId, rating) => {
    if (!isLoggedIn) {
      alert('Vous devez être connecté pour noter');
      return;
    }

    try {
      await fetch(`http://localhost:8000/api/ratings/${articleId}/stars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ rating })
      });
      console.log(rating);
      setRatings(prev => ({
        ...prev,
        [articleId]: rating
      }));
    } catch (error) {
      console.error('Erreur notation:', error);
    }
  };

  // TOGGLE EXPANSION (pour voir les commentaires)
  const toggleExpand = (articleId) => {
    if (expandedArticle === articleId) {
      setExpandedArticle(null);
    } else {
      setExpandedArticle(articleId);
      fetchComments(articleId);
    }
  };

  if (isLoading) return <p style={{ textAlign: 'center', padding: '40px' }}>Chargement...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>Erreur de chargement</p>;

  return (
    <main style={{ maxWidth: "900px", margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#0085C7', marginBottom: '10px' }}>
        📰 Actualités
      </h1>
      <Search />

      {articles.map((article) => {
        const sortedBlocks = [...article.blocks].sort(
          (a, b) => a.orderIndex - b.orderIndex
        );

        const isFavorite = favorites[article.id] || false;
        const userRating = ratings[article.id] || 0;
        const isExpanded = expandedArticle === article.id;
        const articleComments = comments[article.id] || [];

        return (
          <article
            key={article.id}
            style={{
              marginBottom: "60px",
              padding: "30px",
              borderRadius: "20px",
              background: "#fff",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
            }}
          >
            {/* HEADER AVEC TITRE + FAVORI */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
              <h2 style={{ color: "#0085C7", flex: 1 }}>{article.title}</h2>
              
              {/* Bouton Favori */}
              <button
                onClick={() => handleToggleFavorite(article.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '8px'
                }}
              >
                <Heart
                  size={24}
                  color={isFavorite ? '#dc2626' : '#666'}
                  fill={isFavorite ? '#dc2626' : 'transparent'}
                />
              </button>
            </div>

            {/* BLOCKS (VOTRE CODE - NE CHANGE PAS) */}
            {sortedBlocks.map((block) => {
              /* 📝 TEXTE */
              if (block.type === "text") {
                return (
                  <p
                    key={block.id}
                    style={{
                      marginBottom: "20px",
                      lineHeight: 1.7,
                      fontSize: "16px",
                    }}
                  >
                    {block.content?.text}
                  </p>
                );
              }

              /* 🖼 IMAGE */
              if (block.type === "image") {
                return (
                  <img
                    key={block.id}
                    src={block.content?.url}
                    alt=""
                    style={{
                      width: "100%",
                      borderRadius: "14px",
                      marginBottom: "25px",
                      objectFit: "cover",
                    }}
                  />
                );
              }

              /* 📊 VISUALIZATION */
              if (block.type === "visualization") {
                return (
                  <div
                    key={block.id}
                    style={{
                      height: "220px",
                      background: "#f0f4f8",
                      borderRadius: "14px",
                      marginBottom: "25px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#666",
                      fontWeight: "bold",
                    }}
                  >
                    📊 Visualisation (à venir)
                  </div>
                );
              }

              return null;
            })}

            {/* FOOTER : NOTATION + STATS + COMMENTAIRES */}
            <div style={{
              borderTop: '1px solid #e5e7eb',
              paddingTop: '20px',
              marginTop: '20px'
            }}>
              {/* Notation par étoiles */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '15px' }}>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#333' }}>Votre note :</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRate(article.id, star)}
                      onMouseEnter={() => setHoveredStar({ ...hoveredStar, [article.id]: star })}
                      onMouseLeave={() => setHoveredStar({ ...hoveredStar, [article.id]: 0 })}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: 0
                      }}
                    >
                      <Star
                        size={20}
                        color="#FFD700"
                        fill={star <= (hoveredStar[article.id] || userRating) ? '#FFD700' : 'transparent'}
                      />
                    </button>
                  ))}
                </div>
                {userRating > 0 && (
                  <span style={{ fontSize: '13px', color: '#0085C7', fontWeight: '600' }}>
                    {userRating}/5
                  </span>
                )}
              </div>

              {/* Bouton Voir les commentaires */}
              <button
                onClick={() => toggleExpand(article.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 16px',
                  backgroundColor: '#f3f4f6',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#333'
                }}
              >
                <MessageSquare size={18} />
                {isExpanded ? 'Masquer les commentaires' : 'Voir les commentaires'}
              </button>
            </div>

            {/* SECTION COMMENTAIRES (si expanded) */}
            {isExpanded && (
              <div style={{
                marginTop: '25px',
                paddingTop: '25px',
                borderTop: '1px solid #e5e7eb'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '15px' }}>
                  Commentaires ({articleComments.length})
                </h3>

                {/* Formulaire d'ajout */}
                {isLoggedIn ? (
                  <div style={{ marginBottom: '20px' }}>
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Ajouter un commentaire..."
                      style={{
                        width: '100%',
                        minHeight: '80px',
                        padding: '12px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '8px',
                        fontSize: '14px',
                        fontFamily: 'Arial, sans-serif',
                        resize: 'vertical',
                        boxSizing: 'border-box'
                      }}
                    />
                    <button
                      onClick={() => handleAddComment(article.id)}
                      style={{
                        marginTop: '10px',
                        padding: '8px 16px',
                        backgroundColor: '#0085C7',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '14px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}
                    >
                      <Send size={16} />
                      Publier
                    </button>
                  </div>
                ) : (
                  <div style={{
                    backgroundColor: '#f0f9ff',
                    border: '2px solid #0085C7',
                    borderRadius: '8px',
                    padding: '15px',
                    textAlign: 'center',
                    color: '#0085C7',
                    fontWeight: '600',
                    marginBottom: '20px'
                  }}>
                    Vous devez être connecté pour commenter
                  </div>
                )}

                {/* Liste des commentaires */}
                {articleComments.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#666', padding: '20px' }}>
                    Aucun commentaire. Soyez le premier !
                  </p>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {articleComments.map((comment) => (
                      <div
                        key={comment.id}
                        style={{
                          backgroundColor: '#f9f9f9',
                          padding: '15px',
                          borderRadius: '8px'
                        }}
                      >
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          marginBottom: '10px'
                        }}>
                          {/* Avatar */}
                          <div style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            backgroundColor: '#0085C7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '14px'
                          }}>
                            {comment.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </div>
                          
                          <div>
                            <div style={{ fontWeight: '600', fontSize: '14px' }}>
                              {comment.user?.name || 'Utilisateur'}
                            </div>
                            <div style={{ fontSize: '12px', color: '#999' }}>
                              {new Date(comment.created_at).toLocaleDateString('fr-FR')}
                            </div>
                          </div>
                        </div>
                        
                        <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                          {comment.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </article>
        );
      })}
    </main>
  );
}