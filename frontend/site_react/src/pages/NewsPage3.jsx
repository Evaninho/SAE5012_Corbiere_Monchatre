import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "../components/news/search";
import { MessageSquare, Heart, Star } from "lucide-react";

// ========== CONSTANTE API ==========
const API_BASE_URL = 'http://localhost:8000/api';

export function NewsPage3() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState({});

  // =======================
  // FETCH ARTICLES (UN SEUL)
  // =======================
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

  // =======================
  // FAVORI
  // =======================
  const handleToggleFavorite = async (articleId, e) => {
    e.stopPropagation();

    try {
      await fetch(`${API_BASE_URL}/articles/${articleId}/favorite`, {
        method: 'POST'
      });

      setFavorites(prev => ({
        ...prev,
        [articleId]: !prev[articleId]
      }));
    } catch (error) {
      console.error('Erreur favori:', error);
    }
  };

  // =======================
  // NAVIGATION ARTICLE
  // =======================
  const handleArticleClick = async (articleId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}`);
      const data = await response.json();
      navigate(`/articles/${articleId}`, { state: { article: data } });
    } catch {
      navigate(`/articles/${articleId}`);
    }
  };

  // =======================
  // FILTRAGE
  // =======================
  const filteredArticles = articles?.filter(article =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (isLoading) {
    return <p style={{ textAlign: 'center', padding: '40px' }}>Chargement...</p>;
  }

  if (error) {
    return <p style={{ textAlign: 'center', padding: '40px', color: '#dc2626' }}>
      Erreur de chargement
    </p>;
  }

  return (
    <main style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#0085C7' }}>
          📰 Actualités
        </h1>
        <p style={{ color: '#666' }}>
          Découvrez les dernières actualités olympiques
        </p>
      </div>

      {/* SEARCH */}
      <Search value={searchTerm} onChange={setSearchTerm} />

      {/* GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        marginTop: '40px'
      }}>
        {filteredArticles.map(article => {
          const sortedBlocks = [...article.blocks].sort(
            (a, b) => a.orderIndex - b.orderIndex
          );

          const firstImage = sortedBlocks.find(b => b.type === 'image');
          const firstText = sortedBlocks.find(b => b.type === 'text');
          const excerpt =
            firstText?.content?.text?.substring(0, 150) + '...' || '';

          // ===== MOYENNE DES ÉTOILES =====
          const ratings = article.ratings || [];
          const avgStars =
            ratings.length > 0
              ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
              : 0;

          const commentCount =
            ratings.filter(r => r.comment && r.comment.trim() !== '').length;

          const isFavorite = favorites[article.id] || false;

          return (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              style={{
                backgroundColor: 'white',
                borderRadius: '15px',
                overflow: 'hidden',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                cursor: 'pointer'
              }}
            >
              {/* IMAGE */}
              <div style={{ height: '200px', backgroundColor: '#e5e7eb', position: 'relative' }}>
                {firstImage && (
                  <img
                    src={firstImage.content?.url}
                    alt={article.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                )}

                {/* FAVORI */}
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
                    border: 'none'
                  }}
                >
                  <Heart
                    size={20}
                    color={isFavorite ? '#dc2626' : '#666'}
                    fill={isFavorite ? '#dc2626' : 'transparent'}
                  />
                </button>
              </div>

              {/* CONTENT */}
              <div style={{ padding: '20px' }}>
                <h2 style={{ fontSize: '20px', fontWeight: 'bold' }}>
                  {article.title}
                </h2>

                <p style={{ fontSize: '14px', color: '#666' }}>
                  {excerpt}
                </p>

                {/* ÉTOILES + NOTE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', gap: '3px' }}>
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        size={16}
                        color="#FFD700"
                        fill={star <= Math.round(avgStars) ? '#FFD700' : 'transparent'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#969595' }}>
                   ( {avgStars.toFixed(1)}/5 )
                  </span>
                </div>

                {/* COMMENTAIRES */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '5px',
                  marginTop: '8px',
                  fontSize: '13px',
                  color: '#666'
                }}>
                  <MessageSquare size={16} />
                  {commentCount}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </main>
  );
}
