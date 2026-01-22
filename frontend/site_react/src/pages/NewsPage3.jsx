import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Search } from "../components/news/search";
import { MessageSquare, Heart, Star, Plus, Settings, RefreshCw } from "lucide-react";
import { usePermissions } from '../hooks/usePermissions';
import { LoadingScreen } from '../utils/LoadingScreen';
import { ChartRenderer } from '../components/common/ChartRenderer';

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
  refreshButton: {
    marginTop: '20px',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '10px',
    padding: '12px 24px',
    backgroundColor: '#666',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 8px rgba(102, 102, 102, 0.2)'
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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { can } = usePermissions();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
  const [showZone2, setShowZone2] = useState(false);
  const [visualizations, setVisualizations] = useState([]);

  // =======================
  // LOAD VISUALIZATIONS
  // =======================
  const loadVisualizations = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      };

      const response = await fetch(`${API_BASE_URL}/visualizations`, {
        headers
      });

      if (!response.ok) throw new Error('Erreur chargement visualisations');

      const data = await response.json();
      const vizList = data.member || [];

      // Enrichir les visualisations avec les datasets complets si nécessaire
      const enrichedVizList = await Promise.all(
        vizList.map(async (viz) => {
          const hasDataset = viz.dataset && viz.dataset.id;
          const hasDatasetId = viz.datasetId || (viz.dataset && typeof viz.dataset === 'string');

          if (!hasDataset && hasDatasetId) {
            try {
              const actualDatasetId = viz.datasetId || viz.dataset;
              const datasetResponse = await fetch(`${API_BASE_URL}/datasets/${actualDatasetId}`, {
                headers
              });
              if (datasetResponse.ok) {
                const dataset = await datasetResponse.json();
                return { ...viz, dataset, datasetId: actualDatasetId };
              }
            } catch (err) {
              console.warn(`Impossible charger dataset pour viz ${viz.id}:`, err);
            }
          }
          return viz;
        })
      );

      setVisualizations(enrichedVizList);
    } catch (error) {
      console.error('Erreur chargement visualisations:', error);
    }
  };

  // Charger les visualisations au montage
  React.useEffect(() => {
    loadVisualizations();
  }, []);

  // =======================
  // FETCH ARTICLES
  // =======================
  const fetchArticles = async () => {
    const response = await fetch(`${API_BASE_URL}/articles`);

    if (!response.ok) {
      throw new Error("Erreur API");
    }

    const data = await response.json();
    // console.log(data);
    
    return data.member;
  };

  const { data: articles, isLoading, error, refetch } = useQuery({
    queryKey: ["articles"],
    queryFn: fetchArticles,
  });

  // =======================
  // REFRESH ARTICLES
  // =======================
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
    } finally {
      // Garder l'animation pendant un peu
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  // =======================
  // UPDATE ZONE BASED ON ARTICLE COUNT
  // =======================
  React.useEffect(() => {
    if (articles) {
      const threshold = isMobile ? 10 : 20;
      setShowZone2(articles.length >= threshold);
    }
  }, [articles, isMobile]);

  // =======================
  // HANDLE WINDOW RESIZE
  // =======================
  React.useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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

  if (isLoading) {
    return <LoadingScreen isLoading={true} message="Chargement des articles..." type="spinner" fullScreen={true} />;
  }

  if (error) {
    return <p style={{ textAlign: 'center', padding: '40px', color: '#dc2626', fontSize: '18px' }}>
      ❌ Erreur de chargement des articles
    </p>;
  }

  return (
    <main style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px 20px",
      fontFamily: 'Arial, sans-serif'
    }}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
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

          {/* Bouton "Actualiser" */}
          <button
            style={{
              ...styles.refreshButton,
              opacity: isRefreshing ? 0.7 : 1,
              cursor: isRefreshing ? 'not-allowed' : 'pointer'
            }}
            onClick={handleRefresh}
            disabled={isRefreshing}
            onMouseEnter={(e) => {
              if (!isRefreshing) {
                e.currentTarget.style.backgroundColor = '#555';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 12px rgba(102, 102, 102, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#666';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(102, 102, 102, 0.2)';
            }}
          >
            <RefreshCw 
              size={20} 
              style={isRefreshing ? { animation: 'spin 1s linear infinite' } : {}}
            />
            <span>{isRefreshing ? 'Actualisation...' : 'Actualiser'}</span>
          </button>
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

      {/* ZONE 1 - Articles principaux (affichés toujours sur mobile, masqués si Zone 2 existe sur desktop) */}
      {(!showZone2 || isMobile) && (
        <div>
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
              const firstViz = sortedBlocks.find(b => b.type === 'visualization');
              const excerpt = getExcerpt(article.blocks);
              const hasImage = !!firstImage?.content?.url;
              const hasViz = !!firstViz?.content?.visualizationId;

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
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #0085C7',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    </div>
                  )}

                  {/* IMAGE OU VISUALISATION OU TEXTE */}
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
                  ) : hasViz ? (() => {
                    const viz = visualizations.find(v => v.id === firstViz.content?.visualizationId);
                    return (
                      <div style={{ height: '200px', backgroundColor: '#f9fafb', position: 'relative' }}>
                        {viz ? (
                          <ChartRenderer
                            visualization={viz}
                            isThumbnail={true}
                            height={200}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '14px' }}>
                            📊 Visualisation
                          </div>
                        )}
                      </div>
                    );
                  })() : (
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
        </div>
      )}

      {/* ZONE 2 - Zone bonus (affichée seulement sur desktop si articles >= threshold) */}
      {showZone2 && !isMobile && (
        <div style={{ marginTop: '60px' }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#0085C7', 
            marginBottom: '20px',
            paddingBottom: '15px',
            borderBottom: '2px solid #0085C7'
          }}>
            ⭐ Autres Actualités
          </h2>
          
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
              const firstViz = sortedBlocks.find(b => b.type === 'visualization');
              const excerpt = getExcerpt(article.blocks);
              const hasImage = !!firstImage?.content?.url;
              const hasViz = !!firstViz?.content?.visualizationId;

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
                      <div style={{ 
                        width: '40px', 
                        height: '40px', 
                        border: '3px solid #e5e7eb',
                        borderTop: '3px solid #0085C7',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
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
                  ) : hasViz ? (() => {
                    const viz = visualizations.find(v => v.id === firstViz.content?.visualizationId);
                    return (
                      <div style={{ height: '200px', backgroundColor: '#f9fafb', position: 'relative' }}>
                        {viz ? (
                          <ChartRenderer
                            visualization={viz}
                            isThumbnail={true}
                            height={200}
                          />
                        ) : (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999', fontSize: '14px' }}>
                            📊 Visualisation
                          </div>
                        )}
                      </div>
                    );
                  })() : (
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
        </div>
      )}

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
  );
}