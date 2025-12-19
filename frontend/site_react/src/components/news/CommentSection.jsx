// src/components/news/CommentSection.jsx

import React, { useState, useEffect } from 'react';
import { MessageSquare, Edit2, Trash2, Send } from 'lucide-react';
import { getComments, addComment, updateComment, deleteComment } from '../../services/api2essai.';
// import { formatRelativeTime, isLoggedIn, getCurrentUserId, getInitial } from '../../utils/helpers';

export function CommentSection({ articleId }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingContent, setEditingContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentUserId = getCurrentUserId();
  const loggedIn = isLoggedIn();

  const styles = {
    container: {
      marginTop: '30px'
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginBottom: '20px',
      fontSize: '20px',
      fontWeight: 'bold'
    },
    form: {
      marginBottom: '30px'
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
      boxSizing: 'border-box'
    },
    submitButton: {
      marginTop: '10px',
      padding: '10px 20px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      transition: 'all 0.2s'
    },
    commentsList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    comment: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '10px'
    },
    commentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px'
    },
    userInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    avatar: {
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
    },
    userName: {
      fontWeight: '600',
      fontSize: '14px',
      color: '#333'
    },
    date: {
      fontSize: '12px',
      color: '#999'
    },
    content: {
      fontSize: '14px',
      color: '#555',
      lineHeight: '1.6',
      marginBottom: '10px'
    },
    actions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'all 0.2s'
    },
    editButton: {
      backgroundColor: '#f3f4f6',
      color: '#0085C7'
    },
    deleteButton: {
      backgroundColor: '#fee2e2',
      color: '#dc2626'
    },
    loginPrompt: {
      backgroundColor: '#f0f9ff',
      border: '2px solid #0085C7',
      borderRadius: '10px',
      padding: '15px',
      textAlign: 'center',
      color: '#0085C7',
      fontWeight: '600',
      fontSize: '14px'
    },
    emptyState: {
      textAlign: 'center',
      padding: '30px',
      color: '#666',
      fontSize: '14px'
    }
  };

  // Charger les commentaires
  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    try {
      setLoading(true);
      const data = await getComments(articleId);
      setComments(data.data || []);
    } catch (error) {
      console.error('Erreur chargement commentaires:', error);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter un commentaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!newComment.trim()) {
      alert('Veuillez entrer un commentaire');
      return;
    }

    setIsSubmitting(true);

    try {
      const data = await addComment(articleId, newComment);
      setComments([data.data, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Erreur ajout commentaire:', error);
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Modifier un commentaire
  const handleUpdate = async (commentId) => {
    if (!editingContent.trim()) {
      alert('Le commentaire ne peut pas être vide');
      return;
    }

    try {
      await updateComment(commentId, editingContent);
      setComments(comments.map(c => 
        c.id === commentId ? { ...c, content: editingContent } : c
      ));
      setEditingId(null);
      setEditingContent('');
    } catch (error) {
      console.error('Erreur modification:', error);
      alert(error.message);
    }
  };

  // Supprimer un commentaire
  const handleDelete = async (commentId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce commentaire ?')) {
      return;
    }

    try {
      await deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
    } catch (error) {
      console.error('Erreur suppression:', error);
      alert(error.message);
    }
  };

  if (loading) {
    return <div style={styles.container}>Chargement des commentaires...</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <MessageSquare size={24} />
        <span>Commentaires ({comments.length})</span>
      </div>

      {/* Formulaire d'ajout */}
      {loggedIn ? (
        <form style={styles.form} onSubmit={handleSubmit}>
          <textarea
            style={styles.textarea}
            placeholder="Ajouter un commentaire..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#0085C7'}
            onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
          />
          <button
            type="submit"
            style={styles.submitButton}
            disabled={isSubmitting}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#006ba3';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#0085C7';
            }}
          >
            <Send size={16} />
            {isSubmitting ? 'Envoi...' : 'Publier'}
          </button>
        </form>
      ) : (
        <div style={styles.loginPrompt}>
          Vous devez être connecté pour commenter
        </div>
      )}

      {/* Liste des commentaires */}
      {comments.length === 0 ? (
        <div style={styles.emptyState}>
          Aucun commentaire pour le moment. Soyez le premier à commenter !
        </div>
      ) : (
        <div style={styles.commentsList}>
          {comments.map((comment) => (
            <div key={comment.id} style={styles.comment}>
              <div style={styles.commentHeader}>
                <div style={styles.userInfo}>
                  <div style={styles.avatar}>
                    {getInitial(comment.user?.name)}
                  </div>
                  <div>
                    <div style={styles.userName}>{comment.user?.name || 'Utilisateur'}</div>
                    <div style={styles.date}>{formatRelativeTime(comment.created_at)}</div>
                  </div>
                </div>
              </div>

              {/* Contenu */}
              {editingId === comment.id ? (
                <div>
                  <textarea
                    style={styles.textarea}
                    value={editingContent}
                    onChange={(e) => setEditingContent(e.target.value)}
                  />
                  <div style={{...styles.actions, marginTop: '10px'}}>
                    <button
                      style={{...styles.actionButton, ...styles.editButton}}
                      onClick={() => handleUpdate(comment.id)}
                    >
                      Sauvegarder
                    </button>
                    <button
                      style={{...styles.actionButton, backgroundColor: '#f3f4f6', color: '#666'}}
                      onClick={() => {
                        setEditingId(null);
                        setEditingContent('');
                      }}
                    >
                      Annuler
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div style={styles.content}>{comment.content}</div>

                  {/* Actions si c'est son commentaire */}
                  {comment.user?.id === currentUserId && (
                    <div style={styles.actions}>
                      <button
                        style={{...styles.actionButton, ...styles.editButton}}
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditingContent(comment.content);
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      >
                        <Edit2 size={12} />
                        Modifier
                      </button>
                      <button
                        style={{...styles.actionButton, ...styles.deleteButton}}
                        onClick={() => handleDelete(comment.id)}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fecaca'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                      >
                        <Trash2 size={12} />
                        Supprimer
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}