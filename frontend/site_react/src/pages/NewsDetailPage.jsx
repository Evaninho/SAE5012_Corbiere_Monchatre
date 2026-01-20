import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, MessageSquare, Send, Edit, Trash2, Loader } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Popup } from '../components/Popup';

const API_BASE_URL = 'http://localhost:8000/api';

export function NewsDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { can, userRole, userId } = usePermissions();

  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [ratings, setRatings] = useState([]);
  const [averageStars, setAverageStars] = useState(0);

  // Formulaire commentaire
  const [newComment, setNewComment] = useState("");
  const [newStars, setNewStars] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);

  const getToken = () => localStorage.getItem('authToken');
  const isLoggedIn = !!getToken();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

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
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    adminActions: {
      position: 'absolute',
      top: '20px',
      right: '20px',
      display: 'flex',
      gap: '10px'
    },
    adminButton: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '8px 16px',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      transition: 'all 0.2s',
      color: 'white'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '20px',
      paddingRight: '200px'
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
    modalOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      backdropFilter: 'blur(5px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      animation: 'fadeIn 0.2s ease-in-out'
    },
    modal: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '400px',
      width: '90%',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      animation: 'slideIn 0.3s ease-out'
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
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Copié !',
        message: 'Le lien a été copié dans le presse-papier'
      });
    }
  };

  // Ajouter commentaire + note
  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment.trim() && newStars === 0) return;

    setIsSubmitting(true);
    console.log('go');
    

    try {
      const token = getToken();
      // console.log('Token:', token);

      const response = await fetch(`${API_BASE_URL}/ratings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          stars: newStars,
          comment: newComment,
          article: `/api/articles/${id}`
        })
      });

      console.log('API Response:', response);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.detail || 'Erreur lors de la création du commentaire');
      }

      setNewComment("");
      setNewStars(0);
      setHoveredStar(0);
      await loadArticle();

      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Commentaire publié !',
        message: 'Votre commentaire a été ajouté avec succès'
      });

    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la publication du commentaire'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Vérifier les permissions
  const canEdit = () => {
    if (!article) return false;
    
    // EDITOR et ADMIN peuvent tout modifier
    if (userRole === 'EDITOR' || userRole === 'ADMIN') return true;
    
    // AUTHOR peut modifier ses propres articles
    if (userRole === 'AUTHOR' && article.author?.id === userId) return true;
    
    return false;
  };
  // console.log(userRole, " ", userId);
  

  const canDelete = () => {
    if (!article) return false;
    
    // EDITOR et ADMIN peuvent tout supprimer
    if (userRole === 'EDITOR' || userRole === 'ADMIN') return true;
    
    // AUTHOR peut supprimer ses propres articles
    if (userRole === 'AUTHOR' && article.author?.id === userId) return true;
    
    return false;
  };

  // Modifier l'article
  const handleEdit = () => {
    navigate(`/gestion-articles?edit=${article.id}`);
  };

  // Supprimer l'article
  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) throw new Error('Erreur lors de la suppression');

      setShowDeleteModal(false);
      
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Supprimé !',
        message: 'L\'article a été supprimé avec succès'
      });

      setTimeout(() => {
        navigate('/actualites');
      }, 1500);

    } catch (error) {
      console.error('Erreur:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper - nom auteur
  const getAuthorName = (author) => {
    if (author?.pseudo) return author.pseudo;
    const randomPseudos = ['Ancien utilisateur', 'Utilisateur anonyme', 'Ex-membre'];
    return randomPseudos[Math.floor(Math.random() * randomPseudos.length)];
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '20px'
      }}>
        <Loader size={48} color="#0085C7" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ fontSize: '18px', color: '#666' }}>Chargement de l'article...</p>
        <style>{`
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); }}
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }}
          @keyframes slideIn { 
            from { opacity: 0; transform: translateY(-20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div style={{ minHeight: '100vh', textAlign: 'center', padding: '100px', fontSize: '20px', color: '#dc2626' }}>
        ❌ Article introuvable
      </div>
    );
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
          {/* Boutons ADMIN/AUTHOR (en haut à droite) */}
          {(canEdit() || canDelete()) && (
            <div style={styles.adminActions}>
              {canEdit() && (
                <button
                  onClick={handleEdit}
                  style={{
                    ...styles.adminButton,
                    backgroundColor: '#0085C7'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006ba3'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0085C7'}
                >
                  <Edit size={16} />
                  Modifier
                </button>
              )}
              
              {canDelete() && (
                <button
                  onClick={() => setShowDeleteModal(true)}
                  style={{
                    ...styles.adminButton,
                    backgroundColor: '#dc2626'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dc2626'}
                >
                  <Trash2 size={16} />
                  Supprimer
                </button>
              )}
            </div>
          )}

          <h1 style={styles.title}>{article.title}</h1>

          <div style={styles.actionsBar}>
            {/* Date et auteur */}
            <p style={{ fontSize: '13px', color: '#999', marginBottom: '15px', width: '100%' }}>
              Publié le {new Date(article.createdAt).toLocaleDateString('fr-FR')} par {getAuthorName(article.author)}
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

            {/* PARTAGER */}
            <button 
              onClick={handleShare} 
              style={{ ...styles.actionButton, backgroundColor: '#f3f4f6', color: '#666' }}
            >
              <Share2 size={18} />
              Partager
            </button>
          </div>
        </div>

        {/* CONTENU */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', marginBottom: '20px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          {sortedBlocks.map(block => {
            if (block.type === 'text') {
              return <p key={block.id} style={{ marginBottom: '20px', lineHeight: '1.8', fontSize: '16px', color: '#333' }}>{block.content?.text}</p>;
            }
            if (block.type === 'image') {
              return <img key={block.id} src={block.content?.url} alt="" style={{ width: '100%', borderRadius: '14px', marginBottom: '25px' }} />;
            }
            return null;
          })}
        </div>

        {/* COMMENTAIRES */}
        <div style={{ background: 'white', borderRadius: '15px', padding: '30px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MessageSquare size={24} color="#0085C7" />
            Commentaires ({ratingsWithComments.length})
          </h2>

          {/* LISTE */}
          {ratingsWithComments.map(rating => (
            <div key={rating.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <strong>{rating.user?.pseudo ?? 'Utilisateur'}</strong>
                <span style={{ fontSize: '12px', color: '#999' }}>
                  {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>

              <div style={{ display: 'flex', gap: '3px', margin: '5px 0' }}>
                {[...Array(rating.stars)].map((_, i) => (
                  <Star key={i} size={14} color="#FFD700" fill="#FFD700" />
                ))}
              </div>

              <p style={{ fontSize: '14px', color: '#333', marginTop: '8px' }}>{rating.comment}</p>
            </div>
          ))}

          {ratingsWithComments.length === 0 && (
            <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>
              Aucun commentaire pour le moment. Soyez le premier à commenter !
            </p>
          )}

          {/* FORMULAIRE */}
          {isLoggedIn ? (
            <div style={{ marginTop: '30px', borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
              <h3 style={{ fontSize: '18px', marginBottom: '15px', fontWeight: '600' }}>Laisser un commentaire</h3>
              
              {/* Étoiles */}
              <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    onClick={() => setNewStars(star)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    <Star
                      size={24}
                      color="#FFD700"
                      fill={star <= (hoveredStar || newStars) ? '#FFD700' : 'transparent'}
                    />
                  </button>
                ))}
                <span style={{ marginLeft: '10px', color: '#666', fontSize: '14px' }}>
                  {newStars > 0 ? `${newStars}/5 étoiles` : 'Notez l\'article'}
                </span>
              </div>

              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Ajouter un commentaire..."
                style={styles.textarea}
                onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
              />

              <button 
                onClick={handleAddComment}
                disabled={isSubmitting}
                style={{
                  ...styles.submitButton,
                  opacity: isSubmitting ? 0.6 : 1,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#006ba3';
                }}
                onMouseLeave={(e) => {
                  if (!isSubmitting) e.currentTarget.style.backgroundColor = '#0085C7';
                }}
              >
                <Send size={16} />
                {isSubmitting ? 'Publication...' : 'Publier'}
              </button>
            </div>
          ) : (
            <div style={{ 
              marginTop: '30px', 
              padding: '20px', 
              backgroundColor: '#f9fafb', 
              borderRadius: '10px',
              textAlign: 'center'
            }}>
              <p style={{ color: '#666', marginBottom: '15px' }}>
                Connectez-vous pour laisser un commentaire
              </p>
              <button
                onClick={() => navigate('/connexion')}
                style={{
                  padding: '10px 24px',
                  backgroundColor: '#0085C7',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Se connecter
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL SUPPRESSION */}
      {showDeleteModal && (
        <div style={styles.modalOverlay} onClick={() => setShowDeleteModal(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <Trash2 size={48} color="#dc2626" style={{ marginBottom: '15px' }} />
              <h2 style={{ margin: '0 0 10px 0', color: '#333', fontSize: '22px' }}>Supprimer l'article ?</h2>
              <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.6' }}>
                Êtes-vous sûr de vouloir supprimer<br />
                <strong>"{article.title}"</strong> ?<br />
                Cette action est irréversible.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Annuler
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: isDeleting ? '#9ca3af' : '#dc2626',
                  color: 'white',
                  borderRadius: '10px',
                  cursor: isDeleting ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                {isDeleting ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* POPUP */}
      <Popup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
    </div>
  );
}