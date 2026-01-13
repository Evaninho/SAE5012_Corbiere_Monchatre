import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "../components/news/search";
import { MessageSquare, Eye, Heart, Star, Send } from "lucide-react";

// ========== CONSTANTE API ==========
const API_BASE_URL = 'http://localhost:8000/api';

export function NewsPage3() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
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

  // FETCH ARTICLES
  const fetchArticles = async () => {
    const response = await fetch(`${API_BASE_URL}/articles`);

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

  // TOGGLE FAVORI
  const handleToggleFavorite = async (articleId, e) => {
    e.stopPropagation(); // Empêcher la navigation

    if (!isLoggedIn) {
      alert('Vous devez être connecté');
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/articles/${articleId}/favorite`, {
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
  const handleRate = async (articleId, rating, e) => {
    e.stopPropagation(); // Empêcher la navigation

    if (!isLoggedIn) {
      alert('Vous devez être connecté pour noter');
      return;
    }

    try {
      await fetch(`${API_BASE_URL}/ratings/${articleId}/stars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ rating })
      });

      setRatings(prev => ({
        ...prev,
        [articleId]: rating
      }));
    } catch (error) {
      console.error('Erreur notation:', error);
    }
  };

  // NAVIGATION VERS LE DÉTAIL (récupère l'article puis navigue en passant les données)
  const handleArticleClick = async (articleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}`);
      if (!response.ok) {
        throw new Error('Erreur API');
      }
      const data = await response.json();
      const articleData = data.member || data;
      navigate(`/articles/${articleId}`, { state: { article: articleData } });
    } catch (error) {
      console.error('Erreur récupération article:', error);
      navigate(`/articles/${articleId}`);
    }
  };

  // FILTRER LES ARTICLES PAR RECHERCHE
  const filteredArticles = articles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) return <p style={{ textAlign: 'center', padding: '40px', minHeight:'100vh', lineHeight:'25vh', fontSize: '20px', color: "rgb(102, 102, 102)" }}>Chargement...</p>;
  if (error) return <p style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>Erreur de chargement</p>;

  return (
    <main style={{ 
      maxWidth: "1200px", 
      margin: "0 auto", 
      padding: "40px 20px",
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ 
          fontSize: '36px', 
          fontWeight: 'bold', 
          color: '#0085C7', 
          marginBottom: '10px' 
        }}>
          📰 Actualités
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>
          Découvrez les dernières actualités olympiques
        </p>
      </div>

      {/* BARRE DE RECHERCHE */}
      <Search value={searchTerm} onChange={setSearchTerm} />

      {/* MESSAGE SI AUCUN RÉSULTAT */}
      {filteredArticles.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          backgroundColor: 'white',
          borderRadius: '15px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '18px', color: '#666' }}>
            Aucun article trouvé pour "{searchTerm}"
          </p>
        </div>
      )}

      {/* GRILLE D'ARTICLES */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px'
      }}>
        {filteredArticles.map((article) => {
          const sortedBlocks = [...article.blocks].sort(
            (a, b) => a.orderIndex - b.orderIndex
          );

          // Trouver la première image
          const firstImage = sortedBlocks.find(block => block.type === 'image');
          
          // Extraire le premier texte (extrait)
          const firstText = sortedBlocks.find(block => block.type === 'text');
          const excerpt = firstText?.content?.text?.substring(0, 150) + '...' || '';

          const isFavorite = favorites[article.id] || false;
          const userRating = ratings[article.id] || 0;

          return (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                flexDirection: 'column'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
              }}
            >
              {/* IMAGE */}
              <div style={{
                width: '100%',
                height: '200px',
                backgroundColor: '#e5e7eb',
                position: 'relative',
                overflow: 'hidden'
              }}>
                {firstImage ? (
                  <img
                    src={firstImage.content?.url}
                    alt={article.title}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px'
                  }}>
                    📰
                  </div>
                )}

                {/* BOUTON FAVORI */}
                <button
                  onClick={(e) => handleToggleFavorite(article.id, e)}
                  style={{
                    position: 'absolute',
                    top: '15px',
                    right: '15px',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Heart
                    size={20}
                    color={isFavorite ? '#dc2626' : '#666'}
                    fill={isFavorite ? '#dc2626' : 'transparent'}
                  />
                </button>
              </div>

              {/* CONTENU */}
              <div style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                {/* TITRE */}
                <h2 style={{ 
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: '#333',
                  marginBottom: '10px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}>
                  {article.title}
                </h2>

                {/* EXTRAIT */}
                <p style={{
                  fontSize: '14px',
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '15px',
                  flex: 1
                }}>
                  {excerpt}
                </p>

                {/* FOOTER */}
                <div style={{
                  borderTop: '1px solid #e5e7eb',
                  paddingTop: '15px'
                }}>
                  {/* NOTATION */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px',
                    marginBottom: '10px'
                  }}>
                    <div style={{ display: 'flex', gap: '3px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={(e) => handleRate(article.id, star, e)}
                          onMouseEnter={(e) => {
                            e.stopPropagation();
                            setHoveredStar({ ...hoveredStar, [article.id]: star });
                          }}
                          onMouseLeave={(e) => {
                            e.stopPropagation();
                            setHoveredStar({ ...hoveredStar, [article.id]: 0 });
                          }}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0
                          }}
                        >
                          <Star
                            size={16}
                            color="#FFD700"
                            fill={star <= (hoveredStar[article.id] || userRating) ? '#FFD700' : 'transparent'}
                          />
                        </button>
                      ))}
                    </div>
                    {userRating > 0 && (
                      <span style={{ fontSize: '12px', color: '#0085C7', fontWeight: '600' }}>
                        {userRating}/5
                      </span>
                    )}
                  </div>

                  {/* STATS */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    fontSize: '13px',
                    color: '#666'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <MessageSquare size={16} />
                      <span>{article.comments?.length || 0}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Eye size={16} />
                      <span>{article.views || 0}</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}