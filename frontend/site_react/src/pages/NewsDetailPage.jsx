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

  const [ratings, setRatings] = useState([]);
  const [averageStars, setAverageStars] = useState(0);

  // ⭐ formulaire
  const [newComment, setNewComment] = useState("");
  const [newStars, setNewStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const getToken = () => localStorage.getItem('authToken');
  const isLoggedIn = !!getToken();
  const [isFavorite, setIsFavorite] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);


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

  useEffect(() => {
    loadArticle();
  }, [id]);

  const loadArticle = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      if (!response.ok) throw new Error('Article non trouvé');

      const data = await response.json();
      console.log(data);

      setArticle(data);
      
      // const test = await fetch(`${API_BASE_URL}/ratings`);
      // const datatest = await test.json();

      // console.log(datatest);
      

      const ratingsData = data.ratings || [];
      setRatings(ratingsData);

      const withStars = ratingsData.filter(r => r.stars > 0);
      setAverageStars(
        withStars.length
          ? withStars.reduce((s, r) => s + r.stars, 0) / withStars.length
          : 0
      );

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: article.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Lien copié !');
    }
  };

  // ========== AJOUT COMMENTAIRE + NOTE ==========
  const handleAddComment = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim() && newStars === 0) return;

    setIsSubmitting(true);
    console.log(newComment, ' ', newStars);
    

    try {
      await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          comment: newComment,
          stars: newStars,
          article: `/api/articles/${id}`
        })
      });
      console.log('Commentaire envoyé avec succès');

      setNewComment("");
      setNewStars(0);
      setHoveredStar(0);
      await loadArticle();

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de la publication du commentaire');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', textAlign: 'center', padding: '100px', fontSize:'20px' }}>Chargement...</div>;
  }

  if (error || !article) {
    return <div style={{minHeight: '100vh', textAlign: 'center', padding: '100px', fontSize:'20px' }}>Article introuvable</div>;
  }

  const sortedBlocks = [...article.blocks].sort((a, b) => a.orderIndex - b.orderIndex);
  const ratingsWithComments = ratings.filter(r => r.comment);

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* RETOUR */}
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

          <div style={styles.actionsBar}>
            {/* 📅 date article */}
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '15px' }}>
              Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR')}
            </p>

            {/* NOTE MOYENNE */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <Star
                  key={star}
                  size={22}
                  color="#FFD700"
                  fill={star <= Math.round(averageStars) ? '#FFD700' : 'transparent'}
                />
              ))}
              <span style={{ color: '#666' }}>
                {averageStars.toFixed(1)}/5
              </span>
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

        {/* CONTENU */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '20px' }}>
          {sortedBlocks.map(block => {
            if (block.type === 'text') {
              return <p key={block.id} style={{ marginBottom: '20px' }}>{block.content?.text}</p>;
            }
            if (block.type === 'image') {
              return <img key={block.id} src={block.content?.url} alt="" style={{ width: '100%', borderRadius: '14px', marginBottom: '25px' }} />;
            }
            return null;
          })}
        </div>

        {/* COMMENTAIRES */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>
            💬 Commentaires ({ratingsWithComments.length})
          </h2>

          {/* LISTE */}
          {ratingsWithComments.map(rating => (
            <div key={rating.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong> {data.author?.pseudo ?? 'Utilisateur'}</strong>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '3px', margin: '5px 0' }}>
                {[...Array(rating.stars)].map((_, i) => (
                  <Star key={i} size={14} color="#FFD700" fill="#FFD700" />
                ))}
              </div>

              <p style={{ fontSize: '14px' }}>{rating.comment}</p>
            </div>
          ))}

          {/* <hr style={{ color: 'gray' }} /> */}

          {/* FORMULAIRE */}
          <form onSubmit={handleAddComment}>
            {isLoggedIn && (
              <div style={{ marginBottom: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
                {/* ⭐ étoiles */}
                <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={(e) => {
                        e.preventDefault();
                        setNewStars(star);
                      }}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                      <Star
                        size={20}
                        color="#FFD700"
                        fill={star <= (hoveredStar || newStars) ? '#FFD700' : 'transparent'}
                      />
                    </button>
                  ))}
                </div>

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Ajouter un commentaire..."
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                  onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
                />

                <button type="submit" disabled={isSubmitting} style={styles.submitButton}>
                  <Send size={16} />
                  {isSubmitting ? 'Publication...' : 'Publier'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
