import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "../components/news/search";
import { MessageSquare, Heart, Star, Plus, Settings, Loader } from "lucide-react";
import { usePermissions } from '../hooks/usePermissions';

// ========== CONSTANTE API ==========
const API_BASE_URL = 'http://localhost:8000/api';

// ========== STYLES ==========
const styles = {
  createButton: {
    marginTop: '20px',
    marginRight: '10px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    backgroundColor: '#009F3D',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0,159,61,0.2)'
  },
  gestionButton: {
    marginTop: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    backgroundColor: '#0085C7',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(0, 133, 199, 0.2)'
  },
  articleCard: {
    backgroundColor: 'white',
    borderRadius: '15px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    position: 'relative'
  },
  articleCardHover: {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0,0,0,0.15)'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '15px',
    zIndex: 10
  }
};

export function NewsPage3() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const [loadingArticle, setLoadingArticle] = useState(null);
  const { can } = usePermissions();

  // Style pour l'animation du loader
  const spinnerStyle = {
    animation: 'spin 1s linear infinite'
  };

  // =======================
  // FETCH ARTICLES
  // =======================
  const fetchArticles = async () => {
    const response = await fetch(`${API_BASE_URL}/articles`);

    if (!response.ok) {
      throw new Error("Erreur API");
    }

    const data = await response.json();
    console.log(data);
    
    return data.member;
  };

  const { data: articles, isLoading, error } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  // =======================
  // NAVIGATION ARTICLE
  // =======================
  const handleArticleClick = async (articleId) => {
    setLoadingArticle(articleId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}`);
      const data = await response.json();
      
      // Petit délai pour voir l'animation
      await new Promise(resolve => setTimeout(resolve, 300));
      
      navigate(`/articles/${articleId}`, { state: { article: data } });
    } catch {
      navigate(`/articles/${articleId}`);
    } finally {
      setLoadingArticle(null);
    }
  };

  // =======================
  // FILTRAGE AVEC RECHERCHE
  // =======================
  const filteredArticles = articles?.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = article.title?.toLowerCase().includes(searchLower);
    
    // Recherche dans le contenu des blocks
    const contentMatch = article.blocks?.some(block => 
      block.type === 'text' && 
      block.content?.text?.toLowerCase().includes(searchLower)
    );
    
    // Recherche dans le nom de l'auteur
    const authorMatch = article.author?.pseudo?.toLowerCase().includes(searchLower);
    
    return titleMatch || contentMatch || authorMatch;
  }) || [];

  // =======================
  // HELPER - Récupérer le nom de l'auteur
  // =======================
  const getAuthorName = (article) => {
    if (article.author?.pseudo) {
      return article.author.pseudo;
    }
    // Générer un pseudo aléatoire si l'utilisateur a été supprimé
    const randomPseudos = [
      'Ancien utilisateur',
      'Utilisateur_' + Math.floor(Math.random() * 1000),
      'Anonyme',
      'Ex-membre'
    ];
    return randomPseudos[Math.floor(Math.random() * randomPseudos.length)];
  };

  // =======================
  // HELPER - Extraire le texte
  // =======================
  const getExcerpt = (blocks, maxLength = 150) => {
    const textBlocks = blocks
      ?.filter(b => b.type === 'text')
      .sort((a, b) => a.orderIndex - b.orderIndex);
    
    if (!textBlocks || textBlocks.length === 0) return '';
    
    const fullText = textBlocks.map(b => b.content?.text || '').join(' ');
    
    if (fullText.length <= maxLength) return fullText;
    
    return fullText.substring(0, maxLength) + '...';
  };

  // Ajout du CSS d'animation au début du composant
  const loadingSpinnerStyle = {
    animation: 'spin 1s linear infinite'
  };

  if (isLoading) {
    return (
      <>
        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
        <div style={{ 
          textAlign: 'center', 
          padding: '100px 40px', 
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '20px'
        }}>
          <Loader size={48} color="#0085C7" style={loadingSpinnerStyle} />
          <p style={{ fontSize: '18px', color: '#666' }}>Chargement des articles...</p>
        </div>
      </>
    );
  }

  if (error) {
    return <p style={{ textAlign: 'center', padding: '40px', color: '#dc2626', fontSize: '18px' }}>
      ❌ Erreur de chargement des articles
    </p>;
  }

  return (
    <>
      {/* CSS pour l'animation */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <main style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px 20px",
        fontFamily: 'Arial, sans-serif'
      }}>
      {/* HEADER */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '36px', fontWeight: 'bold', color: '#0085C7', marginBottom: '10px' }}>
          📰 Actualités
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          Découvrez les dernières actualités olympiques
        </p>
        
        {/* Boutons d'action */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {/* Bouton "Créer un article" - Visible pour AUTHOR, EDITOR, ADMIN */}
          {can('canCreateArticles') && (
            <button
              style={styles.createButton}
              onClick={() => navigate('/create-article')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#007a33';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,159,61,0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#009F3D';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,159,61,0.2)';
              }}
            >
              <Plus size={20} />
              <span>Créer un article</span>
            </button>
          )}
          
          {/* Bouton "Gestion des articles" - Visible pour EDITOR, ADMIN */}
          {can('canSupprimerArticles') && (
            <button
              style={styles.gestionButton}
              onClick={() => navigate('/gestion-articles')}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#006ba3';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(0, 133, 199, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#0085C7';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 133, 199, 0.2)';
              }}
            >
              <Settings size={20} />
              <span>Gérer les articles</span>
            </button>
          )}
        </div>
      </div>

      {/* SEARCH */}
      <Search value={searchTerm} onChange={setSearchTerm} />

      {/* Nombre de résultats */}
      <p style={{ 
        marginTop: '20px', 
        marginBottom: '10px', 
        color: '#666', 
        fontSize: '14px' 
      }}>
        {filteredArticles.length} article{filteredArticles.length > 1 ? 's' : ''} trouvé{filteredArticles.length > 1 ? 's' : ''}
      </p>

      {/* GRID */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        marginTop: '20px'
      }}>
        {filteredArticles.map(article => {
          const sortedBlocks = [...article.blocks].sort(
            (a, b) => a.orderIndex - b.orderIndex
          );

          const firstImage = sortedBlocks.find(b => b.type === 'image');
          const excerpt = getExcerpt(article.blocks);
          const hasImage = !!firstImage?.content?.url;

          // ===== MOYENNE DES ÉTOILES =====
          const ratings = article.ratings || [];
          const avgStars =
            ratings.length > 0
              ? ratings.reduce((sum, r) => sum + r.stars, 0) / ratings.length
              : 0;

          const commentCount =
            ratings.filter(r => r.comment && r.comment.trim() !== '').length;

          const isHovered = hoveredCard === article.id;
          const isLoadingThis = loadingArticle === article.id;

          return (
            <article
              key={article.id}
              onClick={() => handleArticleClick(article.id)}
              onMouseEnter={() => setHoveredCard(article.id)}
              onMouseLeave={() => setHoveredCard(null)}
              style={{
                ...styles.articleCard,
                ...(isHovered && !isLoadingThis ? styles.articleCardHover : {})
              }}
            >
              {/* Overlay de chargement */}
              {isLoadingThis && (
                <div style={styles.loadingOverlay}>
                  <Loader size={40} color="#0085C7" style={spinnerStyle} />
                </div>
              )}

              {/* IMAGE OU TEXTE */}
              {hasImage ? (
                <div style={{ height: '200px', backgroundColor: '#e5e7eb', position: 'relative' }}>
                  <img
                    src={firstImage.content.url}
                    alt={article.title}
                    style={{ 
                      width: '100%', 
                      height: '100%', 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)'
                    }}
                  />
                </div>
              ) : (
                // SANS IMAGE - Afficher le texte avec "Voir plus"
                <div style={{ 
                  padding: '20px', 
                  backgroundColor: '#f9fafb',
                  minHeight: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative'
                }}>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#666', 
                    lineHeight: '1.6',
                    flex: 1
                  }}>
                    {excerpt}
                  </p>
                  <div style={{
                    marginTop: '10px',
                    fontSize: '14px',
                    color: '#0085C7',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    Voir plus →
                  </div>
                </div>
              )}
              {/* CONTENT */}
              <div style={{ padding: '20px' }}>
                <h2 style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  marginBottom: '10px',
                  color: isHovered ? '#0085C7' : '#333',
                  transition: 'color 0.2s'
                }}>
                  {article.title}
                </h2>

                {/* Auteur */}
                <p style={{ 
                  fontSize: '13px', 
                  color: '#999',
                  marginBottom: '10px'
                }}>
                  Par {getAuthorName(article)}
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
                    ({avgStars.toFixed(1)}/5)
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
                  {commentCount} commentaire{commentCount > 1 ? 's' : ''}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Message si aucun résultat */}
      {filteredArticles.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '60px 20px',
          color: '#666'
        }}>
          <p style={{ fontSize: '18px', marginBottom: '10px' }}>
            Aucun article trouvé
          </p>
          <p style={{ fontSize: '14px' }}>
            Essayez de modifier votre recherche
          </p>
        </div>
      )}
    </main>
    </>
  );
}