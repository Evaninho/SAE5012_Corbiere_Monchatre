import React, { useState } from 'react';
import { MessageSquare, Eye, Heart, Star } from 'lucide-react';
// import { formatRelativeTime, isLoggedIn } from '../../utils/helpers';
import { toggleFavorite, rateArticle } from '../../services/api2essai.';

export function NewsArticle({ article, onArticleClick, onUpdate }) {
  // ========== ADAPTATION API PLATFORM ==========
  // L'API retourne des champs différents, on les mappe ici
  
  const articleData = {
    id: article.id,
    title: article.title || 'Sans titre',
    content: article.content || '',
    excerpt: article.content ? article.content.substring(0, 200) + '...' : 'Pas de description',
    category: article.category || 'Actualité',
    image_url: article.imageUrl || article.image_url || null, // Adaptez selon votre API
    author: {
      name: article.author?.email?.split('@')[0] || 'Rédaction' // On prend le début de l'email
    },
    views: article.views || 0,
    created_at: article.createdAt || article.created_at || new Date().toISOString(),
    // Stats - À ADAPTER selon votre structure
    stats: {
      average_rating: article.averageRating || 0,
      total_ratings: article.totalRatings || 0,
      total_comments: article.totalComments || 0,
      total_favorites: article.totalFavorites || 0
    },
    // Interactions utilisateur - À ADAPTER
    user_interaction: {
      has_rated: article.userHasRated || false,
      user_rating: article.userRating || 0,
      is_favorite: article.isFavorite || false
    }
  };

  const [isFavorite, setIsFavorite] = useState(articleData.user_interaction.is_favorite);
  const [favoriteCount, setFavoriteCount] = useState(articleData.stats.total_favorites);
  const [userRating, setUserRating] = useState(articleData.user_interaction.user_rating);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  const styles = {
    card: {
      backgroundColor: 'white',
      borderRadius: '15px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s',
      cursor: 'pointer'
    },
    imageContainer: {
      width: '100%',
      height: '200px',
      overflow: 'hidden',
      backgroundColor: '#e5e7eb',
      position: 'relative'
    },
    image: {
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    },
    categoryBadge: {
      position: 'absolute',
      top: '15px',
      left: '15px',
      backgroundColor: '#0085C7',
      color: 'white',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600'
    },
    favoriteButton: {
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
    },
    content: {
      padding: '20px'
    },
    title: {
      fontSize: '20px',
      fontWeight: 'bold',
      marginBottom: '10px',
      color: '#333',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    excerpt: {
      fontSize: '14px',
      color: '#666',
      lineHeight: '1.6',
      marginBottom: '15px',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden'
    },
    footer: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: '15px',
      borderTop: '1px solid #e5e7eb',
      flexWrap: 'wrap',
      gap: '10px'
    },
    rating: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    stats: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      fontSize: '13px',
      color: '#666'
    },
    stat: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    date: {
      fontSize: '12px',
      color: '#999',
      marginTop: '10px'
    }
  };

  // Gérer le clic sur le favori
  const handleFavoriteClick = async (e) => {
    e.stopPropagation();

    if (!isLoggedIn()) {
      alert('Vous devez être connecté pour ajouter aux favoris');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await toggleFavorite(articleData.id);
      const newIsFavorite = !isFavorite;
      setIsFavorite(newIsFavorite);
      setFavoriteCount(prev => newIsFavorite ? prev + 1 : prev - 1);
      
      if (onUpdate) {
        onUpdate(articleData.id, { is_favorite: newIsFavorite });
      }
    } catch (error) {
      console.error('Erreur favori:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  // Gérer la notation
  const handleRate = async (rating, e) => {
    e.stopPropagation();

    if (!isLoggedIn()) {
      alert('Vous devez être connecté pour noter');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);

    try {
      await rateArticle(articleData.id, rating);
      setUserRating(rating);
      
      if (onUpdate) {
        onUpdate(articleData.id, { user_rating: rating });
      }
    } catch (error) {
      console.error('Erreur notation:', error);
      alert(error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div
      style={styles.card}
      onClick={() => onArticleClick && onArticleClick(articleData)}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
      }}
    >
      {/* Image */}
      <div style={styles.imageContainer}>
        {articleData.image_url ? (
          <img src={articleData.image_url} alt={articleData.title} style={styles.image} />
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

        {/* Badge catégorie */}
        <span style={styles.categoryBadge}>{articleData.category}</span>

        {/* Bouton favori */}
        <button
          style={styles.favoriteButton}
          onClick={handleFavoriteClick}
          disabled={isProcessing}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          <Heart
            size={20}
            color={isFavorite ? '#dc2626' : '#666'}
            fill={isFavorite ? '#dc2626' : 'transparent'}
          />
        </button>
      </div>

      {/* Contenu */}
      <div style={styles.content}>
        <h3 style={styles.title}>{articleData.title}</h3>
        <p style={styles.excerpt}>{articleData.excerpt}</p>

        <div style={styles.footer}>
          {/* Notation */}
          <div style={styles.rating}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
                onClick={(e) => handleRate(star, e)}
                onMouseEnter={() => setHoveredStar(star)}
                onMouseLeave={() => setHoveredStar(0)}
                disabled={isProcessing}
              >
                <Star
                  size={16}
                  color="#FFD700"
                  fill={star <= (hoveredStar || userRating) ? '#FFD700' : 'transparent'}
                />
              </button>
            ))}
            <span style={{ fontSize: '13px', color: '#666', marginLeft: '5px' }}>
              {articleData.stats.average_rating.toFixed(1)}
            </span>
          </div>

          {/* Stats */}
          <div style={styles.stats}>
            <div style={styles.stat}>
              <MessageSquare size={16} />
              <span>{articleData.stats.total_comments}</span>
            </div>
            <div style={styles.stat}>
              <Eye size={16} />
              <span>{articleData.views}</span>
            </div>
          </div>
        </div>

        {/* Date */}
        <div style={styles.date}>{formatRelativeTime(articleData.created_at)}</div>
      </div>
    </div>
  );
}