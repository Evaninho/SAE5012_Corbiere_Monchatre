import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, MessageSquare, Send } from 'lucide-react';

const API_BASE_URL = 'http://localhost:8000/api';

export function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // États pour les ratings (stars + comments combinés)
  const [ratings, setRatings] = useState([]); // Liste de tous les ratings
  const [userRating, setUserRating] = useState(null); // Rating du user actuel
  const [averageStars, setAverageStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  // États pour nouveau commentaire
  const [newComment, setNewComment] = useState("");
  
  // États favoris
  const [isFavorite, setIsFavorite] = useState(false);

  const getToken = () => localStorage.getItem('authToken');
  const getUserId = () => {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData).id : null;
  };
  const isLoggedIn = !!getToken();
  const currentUserId = getUserId();

useEffect(() => {
  loadArticle();
}, [id]);

const loadArticle = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(`${API_BASE_URL}/articles/${id}`);
    if (!response.ok) throw new Error('Article non trouvé');

    const data = await response.json();
    setArticle(data);
    // console.log(data);

    // ===============================
    // RATINGS DIRECTEMENT DE L'ARTICLE
    // ===============================
    const ratingsData = data.ratings || [];
    setRatings(ratingsData);

    // Moyenne des étoiles
    const ratingsWithStars = ratingsData.filter(r => r.stars > 0);
    if (ratingsWithStars.length > 0) {
      const avg =
        ratingsWithStars.reduce((sum, r) => sum + r.stars, 0) /
        ratingsWithStars.length;
      setAverageStars(avg);
    } else {
      setAverageStars(0);
    }

    // Rating de l'utilisateur connecté
    if (currentUserId) {
      const myRating = ratingsData.find(
        r => r.user?.id === currentUserId
      );
      setUserRating(myRating || null);
    }

    // Incrémenter les vues
    fetch(`${API_BASE_URL}/articles/${id}/view`, { method: 'POST' });

  } catch (err) {
    console.error('Erreur chargement:', err);
    setError(err.message);
  } finally {
    setLoading(false);
  }
};

  // ========== PARTAGER ==========
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  // ========== STYLES ==========
  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      fontFamily: 'Arial, sans-serif'
    },
    backButton: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      padding: '12px 20px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      margin: '20px',
      transition: 'all 0.2s'
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '20px'
    },
    header: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '20px'
    },
    actionsBar: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap',
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #e5e7eb'
    },
    actionButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '20px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    commentsSection: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
    },
    textarea: {
      width: '100%',
      minHeight: '100px',
      padding: '15px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      resize: 'vertical',
      boxSizing: 'border-box',
      marginBottom: '10px'
    },
    submitButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '10px 20px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    comment: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '10px',
      marginBottom: '15px'
    },
    commentHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '10px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      backgroundColor: '#0085C7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    }
  };

  // ========== LOADING / ERROR ==========
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px', minHeight: '100vh', fontSize: '20px', color: '#666' }}>
        Chargement...
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={styles.pageContainer}>
        <div style={{ textAlign: 'center', padding: '100px' }}>
          <p style={{ fontSize: '24px', color: '#dc2626', marginBottom: '20px' }}>
            Article introuvable
          </p>
          <button onClick={() => navigate('/actualites')} style={styles.backButton}>
            Retour aux actualités
          </button>
        </div>
      </div>
    );
  }

  const sortedBlocks = [...article.blocks].sort((a, b) => a.orderIndex - b.orderIndex);

  // Séparer les ratings en : ceux avec commentaires vs ceux sans
  const ratingsWithComments = ratings.filter(r => r.comment && r.comment.trim() !== '');
  const totalRatings = ratings.filter(r => r.stars > 0).length;

  return (
    <div style={styles.pageContainer}>
      {/* BOUTON RETOUR */}
      <button
        style={styles.backButton}
        onClick={() => navigate('/actualites')}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006ba3'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0085C7'}
      >
        <ArrowLeft size={20} />
        Retour
      </button>

      <div style={styles.container}>
        {/* HEADER */}
        <div style={styles.header}>
          <h1 style={styles.title}>{article.title}</h1>

          {/* ACTIONS */}
          <div style={styles.actionsBar}>
            {/* NOTATION */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', fontWeight: '600' }}>Votre note :</span>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => handleRate(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star
                      size={24}
                      color="#FFD700"
                      fill={star <= (hoveredStar || userRating?.stars || 0) ? '#FFD700' : 'transparent'}
                    />
                  </button>
                ))}
              </div>
              {averageStars > 0 && (
                <span style={{ fontSize: '14px', color: '#666' }}>
                  {averageStars.toFixed(1)}/5 ({totalRatings} {totalRatings > 1 ? 'notes' : 'note'})
                </span>
              )}
            </div>

            {/* FAVORI */}
            <button
              // onClick={}
              style={{
                ...styles.actionButton,
                backgroundColor: isFavorite ? '#fee2e2' : '#f3f4f6',
                color: isFavorite ? '#dc2626' : '#666'
              }}
            >
              <Heart size={18} fill={isFavorite ? '#dc2626' : 'transparent'} />
              {isFavorite ? 'En favoris' : 'Ajouter aux favoris'}
            </button>

            {/* PARTAGER */}
            <button onClick={handleShare} style={{ ...styles.actionButton, backgroundColor: '#f3f4f6', color: '#666' }}>
              <Share2 size={18} />
              Partager
            </button>
          </div>
        </div>

        {/* CONTENU (BLOCKS) */}
        <div style={styles.content}>
          {sortedBlocks.map((block) => {
            if (block.type === 'text') {
              return (
                <p key={block.id} style={{ marginBottom: '20px', lineHeight: 1.7, fontSize: '16px', color: '#333' }}>
                  {block.content?.text}
                </p>
              );
            }

            if (block.type === 'image') {
              return (
                <img
                  key={block.id}
                  src={block.content?.url}
                  alt=""
                  style={{ width: '100%', borderRadius: '14px', marginBottom: '25px', objectFit: 'cover' }}
                />
              );
            }

            if (block.type === 'visualization') {
              return (
                <div
                  key={block.id}
                  style={{
                    height: '220px',
                    background: '#f0f4f8',
                    borderRadius: '14px',
                    marginBottom: '25px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#666',
                    fontWeight: 'bold'
                  }}
                >
                  📊 Visualisation
                </div>
              );
            }

            return null;
          })}
        </div>

        {/* SECTION COMMENTAIRES */}
        <div style={styles.commentsSection}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '20px' }}>
            💬 Commentaires ({ratingsWithComments.length})
          </h2>

          {/* FORMULAIRE */}
          {isLoggedIn ? (
            <div style={{ marginBottom: '30px' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
              />
              {/* <button onClick={handleAddComment} style={styles.submitButton}>
                <Send size={16} />
                Publier
              </button> */}
            </div>
          ) : (
            <div style={{
              backgroundColor: '#f0f9ff',
              border: '2px solid #0085C7',
              borderRadius: '10px',
              padding: '20px',
              textAlign: 'center',
              color: '#0085C7',
              fontWeight: '600',
              marginBottom: '30px'
            }}>
              Vous devez être connecté pour commenter
            </div>
          )}

          {/* LISTE DES COMMENTAIRES */}
          {ratingsWithComments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '40px' }}>
              Aucun commentaire. Soyez le premier !
            </p>
          ) : (
            ratingsWithComments.map((rating) => (
              <div key={rating.id} style={styles.comment}>
                <div style={styles.commentHeader}>
                  <div style={styles.avatar}>
                    {rating.user?.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>
                      {rating.user?.name || 'Utilisateur'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(rating.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  {/* Afficher les étoiles si le user a noté */}
                  {rating.stars > 0 && (
                    <div style={{ marginLeft: 'auto', display: 'flex', gap: '2px' }}>
                      {[...Array(rating.stars)].map((_, i) => (
                        <Star key={i} size={14} color="#FFD700" fill="#FFD700" />
                      ))}
                    </div>
                  )}
                </div>
                <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.6' }}>
                  {rating.comment}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}