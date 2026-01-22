import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Share2, Star, MessageSquare, Send, Edit, Trash2, X, Plus, ArrowUp, ArrowDown, Type, Image, Upload, Folder, BarChart3 } from 'lucide-react';
import { usePermissions } from '../hooks/usePermissions';
import { Popup } from '../components/Popup';
import { ImageBlock } from '../components/common/ImageBlock';
import { VisualizationBlock } from '../components/common/VisualizationBlock';
import ChartRenderer from '../components/common/ChartRenderer';
import { LoadingScreen } from '../utils/LoadingScreen';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editFormData, setEditFormData] = useState({ title: '', blocks: [] });
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const [showVisualizationLibrary, setShowVisualizationLibrary] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [loadingVisualizations, setLoadingVisualizations] = useState(false);

  // ===== États pour la gestion des ratings =====
  const [editingRatingId, setEditingRatingId] = useState(null);
  const [editingRatingData, setEditingRatingData] = useState({ stars: 0, comment: '' });
  const [loadingRatingId, setLoadingRatingId] = useState(null);
  const [deletingRatingId, setDeletingRatingId] = useState(null);

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
    },
    editModalStyle: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '900px',
      width: '90%',
      maxHeight: '90vh',
      overflowY: 'auto',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      animation: 'slideIn 0.3s ease-out'
    },
    imageOptionsContainerStyle: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      marginBottom: '15px'
    },
    imageOptionButtonStyle: {
      padding: '12px 15px',
      border: '1px solid #D9D9D9',
      borderRadius: '8px',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.2s',
      fontSize: '13px',
      fontWeight: '600',
      color: '#666'
    },
    mediaLibraryModalStyle: {
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
      zIndex: 1001,
      padding: '20px',
      overflowY: 'auto'
    },
    mediaLibraryContentStyle: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '800px',
      width: '100%',
      maxHeight: '80vh',
      overflow: 'auto',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
    },
    mediaGridStyle: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
      gap: '15px',
      marginTop: '20px'
    },
    mediaItemStyle: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.2s'
    }
  };

  useEffect(() => {
    loadArticle();
    loadMediaLibrary();
    loadVisualizationLibrary();
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

  // Charger la médiathèque
  const loadMediaLibrary = async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      const articles = data.member || [];

      const allImages = [];
      articles.forEach(article => {
        if (article.blocks) {
          article.blocks.forEach(block => {
            if (block.type === 'image' && block.content?.url) {
              if (!allImages.some(img => img.url === block.content.url)) {
                allImages.push({
                  id: `${article.id}-${block.id}`,
                  url: block.content.url,
                  articleId: article.id
                });
              }
            }
          });
        }
      });

      setMediaLibrary(allImages);
    } catch (error) {
      console.error('Erreur chargement médiathèque:', error);
    } finally {
      setLoadingMedia(false);
    }
  };

  // Charger les visualisations depuis l'API
  const loadVisualizationLibrary = async () => {
    setLoadingVisualizations(true);
    try {
      const token = getToken();
      const headers = {
        'Content-Type': 'application/ld+json',
        'Accept': 'application/ld+json'
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${API_BASE_URL}/visualizations`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        console.error(`Erreur HTTP ${response.status}:`, response.statusText);
        throw new Error(`Erreur HTTP ${response.status}`);
      }

      const data = await response.json();
      const vizList = data.member || [];

      // Enrichir les visualisations avec les informations complètes du dataset si manquant
      const enrichedVizList = await Promise.all(
        vizList.map(async (viz) => {
          // Si dataset manque mais on a un datasetId ou dataset.id existe
          const hasDataset = viz.dataset && viz.dataset.id;
          const hasDatasetId = viz.datasetId || (viz.dataset && typeof viz.dataset === 'string');
          
          if (!hasDataset && (hasDatasetId)) {
            try {
              const actualDatasetId = viz.datasetId || viz.dataset;
              const datasetResponse = await fetch(`${API_BASE_URL}/datasets/${actualDatasetId}`, {
                headers
              });
              if (datasetResponse.ok) {
                const dataset = await datasetResponse.json();
                return {
                  ...viz,
                  dataset: dataset,
                  datasetId: actualDatasetId
                };
              }
            } catch (err) {
              console.warn(`Impossible charger dataset pour visualisation ${viz.id}:`, err);
            }
          }
          return viz;
        })
      );

      setVisualizations(enrichedVizList);
    } catch (error) {
      console.error('Erreur chargement visualisations:', error);
      setVisualizations([]);
    } finally {
      setLoadingVisualizations(false);
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
    

    try {
      const token = getToken();
      
      // Décoder le JWT pour voir les rôles
      if (token) {
        const decoded = JSON.parse(atob(token.split('.')[1]));
      }

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

      // console.log('API Response:', response);

      if (!response.ok) {
        const error = await response.json();
        console.error('API Error:', error);
        throw new Error(error.detail || 'Erreur lors de la création du commentaire');
      }

      const newRating = await response.json();
      
      setNewComment("");
      setNewStars(0);
      setHoveredStar(0);
      
      // Ajouter le nouveau rating à la liste sans recharger
      setRatings([...ratings, newRating]);
      
      // Recalculer la moyenne
      const allRatings = [...ratings, newRating];
      const withStars = allRatings.filter(r => r.stars > 0);
      setAverageStars(
        withStars.length
          ? withStars.reduce((s, r) => s + r.stars, 0) / withStars.length
          : 0
      );

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
    if (userRole === 'ROLE_EDITOR' || userRole === 'ROLE_ADMIN') return true;
    
    // AUTHOR peut modifier ses propres articles (comparer en string pour éviter les problèmes de type)
    if (userRole === 'ROLE_AUTHOR' && String(userId) === String(article.author?.id)) return true;
    
    return false;
  };

  const canDelete = () => {
    if (!article) return false;
    
    // EDITOR et ADMIN peuvent tout supprimer
    if (userRole === 'ROLE_EDITOR' || userRole === 'ROLE_ADMIN') return true;
    
    // AUTHOR peut supprimer ses propres articles (comparer en string pour éviter les problèmes de type)
    if (userRole === 'ROLE_AUTHOR' && String(userId) === String(article.author?.id)) return true;
    
    return false;
  };

  // Calculer les permissions une fois que l'article est chargé
  const editPermission = article ? canEdit() : false;
  const deletePermission = article ? canDelete() : false;

  // Modifier l'article
  const handleEdit = async () => {
    setIsLoadingArticle(true);
    setShowEditModal(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/articles/${id}`);
      if (!response.ok) throw new Error('Erreur de chargement');
      
      const fullArticle = await response.json();
      
      const blocksToEdit = (fullArticle.blocks || [])
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        .map(b => ({
          id: b.id,
          type: b.type,
          orderIndex: b.orderIndex || 0,
          content: { ...b.content }
        }));
      
      setEditFormData({
        title: fullArticle.title,
        blocks: blocksToEdit
      });
      setIsLoadingArticle(false);
    } catch (error) {
      setIsLoadingArticle(false);
      setShowEditModal(false);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Impossible de charger les détails de l\'article'
      });
    }
  };

  // Ajouter un block
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type,
      orderIndex: editFormData.blocks.length,
      content: type === 'text' ? { text: '' } : { url: '' }
    };
    setEditFormData({
      ...editFormData,
      blocks: [...editFormData.blocks, newBlock]
    });
  };

  const removeBlock = (id) => {
    setEditFormData({
      ...editFormData,
      blocks: editFormData.blocks.filter(b => b.id !== id)
    });
  };

  const moveBlock = (index, direction) => {
    const newBlocks = [...editFormData.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;
    
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    newBlocks.forEach((block, idx) => {
      block.orderIndex = idx;
    });
    
    setEditFormData({ ...editFormData, blocks: newBlocks });
  };

  const updateBlockContent = (id, content) => {
    setEditFormData({
      ...editFormData,
      blocks: editFormData.blocks.map(block =>
        block.id === id ? { ...block, content } : block
      )
    });
  };

  const handleImageUpload = (blockId, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateBlockContent(blockId, { url: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  const openMediaLibrary = async (blockId) => {
    setShowMediaLibrary(blockId);
    if (mediaLibrary.length === 0) {
      await loadMediaLibrary();
    }
  };

  const selectFromMediaLibrary = (blockId, imageUrl) => {
    updateBlockContent(blockId, { url: imageUrl });
    setShowMediaLibrary(null);
  };

  const removeImageFromBlock = (blockId) => {
    updateBlockContent(blockId, { url: '' });
  };

  // Sauvegarder modifications
  const handleSaveEdit = async () => {
    setIsLoadingArticle(true);
    
    try {
      if (!editFormData.title.trim()) {
        setPopup({
          isOpen: true,
          type: 'warning',
          title: 'Titre manquant',
          message: 'Veuillez entrer un titre'
        });
        setIsLoadingArticle(false);
        return;
      }

      const generatedContent = editFormData.blocks
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(block => {
          if (block.type === 'text') return block.content.text;
          if (block.type === 'image') return `{url: ${block.content.url}}`;
          return '';
        })
        .filter(text => text?.trim())
        .join('\n\n');

      const blocksToSend = editFormData.blocks.map(block => {
        const blockData = {
          type: block.type,
          orderIndex: block.orderIndex,
          content: block.content
        };
        
        if (typeof block.id === 'number' && block.id < 1700000000000) {
          blockData.id = block.id;
        }
        
        return blockData;
      });

      const patchData = {
        title: editFormData.title,
        content: generatedContent,
        blocks: blocksToSend
      };

      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(patchData)
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de la modification');
      }

      setShowEditModal(false);
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Modifié !',
        message: 'L\'article a été modifié avec succès'
      });

      await loadArticle();
      setIsLoadingArticle(false);
    } catch (error) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.message || 'Une erreur est survenue'
      });
      setIsLoadingArticle(false);
    }
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

  // ===== Modification d'un rating =====
  const handleEditRating = async (ratingId) => {
    setLoadingRatingId(ratingId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${getToken()}`,
          'Content-Type': 'application/merge-patch+json'
        },
        body: JSON.stringify(editingRatingData)
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Vous n\'avez pas le droit de modifier ce commentaire');
        }
        throw new Error('statu : ' +response.status+ ' ' +'Erreur lors de la modification');
      }

      const updatedRating = await response.json();
      
      // Mettre à jour les ratings localement
      setRatings(ratings.map(r => r.id === ratingId ? updatedRating : r));
      setEditingRatingId(null);
      
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Modifié !',
        message: 'Votre commentaire a été mis à jour'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      });
    } finally {
      setLoadingRatingId(null);
    }
  };

  // ===== Suppression d'un rating =====
  const handleDeleteRating = async (ratingId) => {
    setDeletingRatingId(ratingId);
    
    try {
      const response = await fetch(`${API_BASE_URL}/ratings/${ratingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('Vous n\'avez pas le droit de supprimer ce commentaire');
        }
        throw new Error('Erreur lors de la suppression');
      }

      // Supprimer le rating localement
      setRatings(ratings.filter(r => r.id !== ratingId));
      
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Supprimé !',
        message: 'Votre commentaire a été supprimé'
      });
    } catch (error) {
      console.error('Erreur:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      });
    } finally {
      setDeletingRatingId(null);
    }
  };

  // Vérifier si l'utilisateur est le créateur du rating
  const isRatingCreator = (rating) => {
    return isLoggedIn && userId && rating.user?.id === parseInt(userId);
  };

  // Vérifier si l'utilisateur peut supprimer ce rating (créateur ou EDITOR/ADMIN)
  const canDeleteRating = (rating) => {
    return isRatingCreator(rating) || userRole === 'ROLE_EDITOR' || userRole === 'ROLE_ADMIN';
  };

  if (loading) {
    return <LoadingScreen isLoading={true} message="Chargement de l'article..." type="spinner" fullScreen={true} />;
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
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); }}
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; }}
        @keyframes slideIn { 
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
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
          {(editPermission || deletePermission) && (
            <div style={styles.adminActions}>
              {editPermission && (
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
              
              {deletePermission && (
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
            if (block.type === 'visualization') {
              const viz = visualizations.find(v => v.id === block.content?.visualizationId);
              if (viz) {
                return (
                  <VisualizationBlock
                    key={block.id}
                    visualization={viz}
                    height={350}
                    showTitle={true}
                  />
                );
              }
              return null;
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
            <div key={rating.id} style={{ background: '#f9f9f9', padding: '15px', borderRadius: '10px', marginBottom: '15px', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div>
                  <strong>{rating.user?.pseudo ?? 'Utilisateur'}</strong>
                  <span style={{ fontSize: '12px', color: '#999', marginLeft: '10px' }}>
                    {new Date(rating.createdAt).toLocaleDateString('fr-FR')}
                  </span>
                </div>

                {/* Boutons d'action */}
                <div style={{ display: 'flex', gap: '5px' }}>
                  {/* Bouton Modifier - visible seulement pour le créateur */}
                  {isRatingCreator(rating) && (
                    <button
                      onClick={() => {
                        setEditingRatingId(rating.id);
                        setEditingRatingData({ stars: rating.stars, comment: rating.comment });
                      }}
                      disabled={loadingRatingId === rating.id}
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        backgroundColor: '#e0f2fe',
                        color: '#0085C7',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: loadingRatingId === rating.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: loadingRatingId === rating.id ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (loadingRatingId !== rating.id) {
                          e.currentTarget.style.backgroundColor = '#bae6fd';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#e0f2fe';
                      }}
                    >
                      Modifier
                    </button>
                  )}
                  
                  {/* Bouton Supprimer - visible pour créateur, EDITOR, ADMIN */}
                  {canDeleteRating(rating) && (
                    <button
                      onClick={() => handleDeleteRating(rating.id)}
                      disabled={deletingRatingId === rating.id}
                      style={{
                        padding: '5px 10px',
                        fontSize: '12px',
                        backgroundColor: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: deletingRatingId === rating.id ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: deletingRatingId === rating.id ? 0.6 : 1
                      }}
                      onMouseEnter={(e) => {
                        if (deletingRatingId !== rating.id) {
                          e.currentTarget.style.backgroundColor = '#fecaca';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#fee2e2';
                      }}
                    >
                      {deletingRatingId === rating.id ? 'Suppression...' : 'Supprimer'}
                    </button>
                  )}
                </div>
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

      {/* MODAL ÉDITION DE RATING */}
      {editingRatingId && (
        <div style={styles.modalOverlay} onClick={() => setEditingRatingId(null)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 20px 0', color: '#333', fontSize: '22px' }}>Modifier votre commentaire</h2>

            {/* Étoiles */}
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>Note</p>
              <div style={{ display: 'flex', gap: '5px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setEditingRatingData({ ...editingRatingData, stars: star })}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px'
                    }}
                  >
                    <Star
                      size={24}
                      fill={star <= (hoveredStar || editingRatingData.stars) ? '#FFD700' : 'transparent'}
                      color={star <= (hoveredStar || editingRatingData.stars) ? '#FFD700' : '#ddd'}
                    />
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>
                {editingRatingData.stars === 0 ? 'Cliquez sur une étoile' : `${editingRatingData.stars} étoile${editingRatingData.stars > 1 ? 's' : ''}`}
              </p>
            </div>

            {/* Commentaire */}
            <div style={{ marginBottom: '15px' }}>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px', fontWeight: '600' }}>Commentaire</p>
              <textarea
                value={editingRatingData.comment}
                onChange={(e) => setEditingRatingData({ ...editingRatingData, comment: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '80px',
                  padding: '10px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontFamily: 'Arial, sans-serif',
                  boxSizing: 'border-box',
                  resize: 'vertical'
                }}
                placeholder="Votre commentaire..."
              />
            </div>

            {/* Boutons */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setEditingRatingId(null)}
                disabled={loadingRatingId}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: '2px solid #d1d5db',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  cursor: loadingRatingId ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Annuler
              </button>
              <button
                onClick={() => handleEditRating(editingRatingId)}
                disabled={loadingRatingId}
                style={{
                  flex: 1,
                  padding: '12px',
                  border: 'none',
                  backgroundColor: loadingRatingId ? '#9ca3af' : '#0085C7',
                  color: 'white',
                  borderRadius: '8px',
                  cursor: loadingRatingId ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '14px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  if (!loadingRatingId) {
                    e.currentTarget.style.backgroundColor = '#006ba3';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#0085C7';
                }}
              >
                {loadingRatingId ? 'Modification...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉDITION */}
      {showEditModal && (
        <div style={styles.modalOverlay} onClick={() => !isLoadingArticle && setShowEditModal(false)}>
          <div style={styles.editModalStyle} onClick={(e) => e.stopPropagation()}>
            {isLoadingArticle ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px', gap: '25px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  border: '4px solid #e5e7eb',
                  borderTop: '4px solid #0085C7',
                  borderRadius: '50%',
                  animation: 'spin 1.5s linear infinite'
                }} />
                <div style={{ textAlign: 'center' }}>
                  <p style={{ color: '#0085C7', fontSize: '18px', fontWeight: '600', margin: '0 0 8px 0' }}>Chargement de l'article...</p>
                  <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>Patientez quelques secondes</p>
                </div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0085C7' }}>✏️ Modifier l'article</h2>
                  <button
                    onClick={() => setShowEditModal(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '5px',
                      borderRadius: '50%'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <X size={24} color="#666" />
                  </button>
                </div>

                <input
                  type="text"
                  value={editFormData.title}
                  onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '15px',
                    fontSize: '18px',
                    border: '2px solid #D9D9D9',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    boxSizing: 'border-box',
                    fontWeight: '600'
                  }}
                  placeholder="Titre de l'article"
                />

                {editFormData.blocks.map((block, index) => (
                  <div key={block.id} style={{
                    backgroundColor: '#f9fafb',
                    borderRadius: '10px',
                    padding: '20px',
                    marginBottom: '15px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                        {block.type === 'text' && <><Type size={16} /> Texte</>}
                        {block.type === 'image' && <><Image size={16} /> Image</>}
                      </div>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        {index > 0 && (
                          <button onClick={() => moveBlock(index, 'up')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <ArrowUp size={16} color="#666" />
                          </button>
                        )}
                        {index < editFormData.blocks.length - 1 && (
                          <button onClick={() => moveBlock(index, 'down')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                            <ArrowDown size={16} color="#666" />
                          </button>
                        )}
                        <button onClick={() => removeBlock(block.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                          <Trash2 size={16} color="#dc2626" />
                        </button>
                      </div>
                    </div>

                    {block.type === 'text' && (
                      <textarea
                        value={block.content.text || ''}
                        onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                        style={{
                          width: '100%',
                          minHeight: '100px',
                          padding: '10px',
                          border: '1px solid #D9D9D9',
                          borderRadius: '8px',
                          fontFamily: 'Arial',
                          fontSize: '14px',
                          boxSizing: 'border-box'
                        }}
                      />
                    )}

                    {block.type === 'image' && (
                      <ImageBlock
                        blockId={block.id}
                        imageUrl={block.content.url}
                        mediaLibrary={mediaLibrary}
                        loadingMedia={loadingMedia}
                        onImageUpload={handleImageUpload}
                        onImageUrlChange={updateBlockContent}
                        onSelectFromMediaLibrary={selectFromMediaLibrary}
                        onRemoveImage={removeImageFromBlock}
                        onOpenMediaLibrary={openMediaLibrary}
                      />
                    )}
                  </div>
                ))}

                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
                  <button
                    onClick={() => addBlock('text')}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#e0f2fe',
                      color: '#0085C7',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus size={16} /> Texte
                  </button>
                  <button
                    onClick={() => addBlock('image')}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#dbeafe',
                      color: '#1e40af',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '14px',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px'
                    }}
                  >
                    <Plus size={16} /> Image
                  </button>
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={() => setShowEditModal(false)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      backgroundColor: 'white',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Annuler
                  </button>
                  {/* La ici en dessous, c'est le bouton enregistrer qui ne changepas d'aspect quand on clique dessus mais seulement quand on hover dessus. Il a pas le deuxième texte Enregistrement qui s'affiche */}
                  <button
                    onClick={handleSaveEdit}
                    disabled={isLoadingArticle}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      backgroundColor: '#009F3D',
                      color: 'white',
                      borderRadius: '10px',
                      cursor: isLoadingArticle ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      opacity: isLoadingArticle ? 0.6 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px'
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoadingArticle) {
                        e.currentTarget.style.backgroundColor = '#008835';
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 159, 61, 0.3)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#009F3D';
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {isLoadingArticle ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL MÉDIATHÈQUE */}
      {showMediaLibrary !== null && (
        <div style={styles.mediaLibraryModalStyle} onClick={() => setShowMediaLibrary(null)}>
          <div style={styles.mediaLibraryContentStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 'bold', color: '#0085C7' }}>Médiathèque</h2>
              <button
                onClick={() => setShowMediaLibrary(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '5px',
                  borderRadius: '50%'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <X size={24} color="#666" />
              </button>
            </div>

            {loadingMedia ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '15px' }}>
                <div style={{ 
                  width: '48px', 
                  height: '48px', 
                  border: '3px solid #e5e7eb',
                  borderTop: '3px solid #0085C7',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                <p style={{ color: '#666' }}>Chargement de la médiathèque...</p>
              </div>
            ) : mediaLibrary.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#999', padding: '20px' }}>Aucune image disponible</p>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
                gap: '15px',
                marginTop: '20px'
              }}>
                {mediaLibrary.map(image => {
                  const currentBlock = editFormData.blocks.find(b => b.id === showMediaLibrary);
                  const isSelected = currentBlock?.content?.url === image.url;

                  return (
                    <div
                      key={image.id}
                      style={{
                        position: 'relative',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        border: isSelected ? '3px solid #0085C7' : '2px solid transparent',
                        transition: 'all 0.2s',
                        boxShadow: isSelected ? '0 4px 12px rgba(0, 133, 199, 0.3)' : 'none'
                      }}
                      onClick={() => selectFromMediaLibrary(showMediaLibrary, image.url)}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#0085C7';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = 'transparent';
                        }
                      }}
                    >
                      <img src={image.url} alt="Médiathèque" style={{ width: '100%', height: '200px', objectFit: 'cover' }} />
                      {isSelected && (
                        <div style={{
                          position: 'absolute',
                          top: '10px',
                          right: '10px',
                          backgroundColor: '#0085C7',
                          color: 'white',
                          borderRadius: '50%',
                          width: '30px',
                          height: '30px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 'bold'
                        }}>
                          ✓
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
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