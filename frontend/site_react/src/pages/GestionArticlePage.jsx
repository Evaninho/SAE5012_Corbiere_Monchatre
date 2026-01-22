import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Eye, Search, AlertTriangle, ArrowLeft, Loader, X, Plus, ArrowUp, ArrowDown, Type, Image, Upload, Folder, BarChart3 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Popup } from '../components/Popup';
import { ImageBlock } from '../components/common/ImageBlock';
import { VisualizationBlockEditable } from '../components/common/VisualizationBlockEditable';
import { ChartRenderer } from '../components/common/ChartRenderer';
import { SearchBar } from '../components/common/SearchBar';
import { LoadingScreen } from '../utils/LoadingScreen';

const API_BASE_URL = 'http://localhost:8000/api';

export function GestionArticlesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getToken = () => localStorage.getItem('authToken');

  // Charger la médiathèque au montage
  useEffect(() => {
    loadMediaLibrary();
    loadVisualizationLibrary();
  }, []);

  // Charger les images depuis l'API (toutes les images de tous les articles)
  const loadMediaLibrary = async () => {
    setLoadingMedia(true);
    try {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) throw new Error('Erreur de chargement');

      const data = await response.json();
      const articles = data.member || [];

      // Extraire toutes les images de tous les blocks de tous les articles
      const allImages = [];
      articles.forEach(article => {
        if (article.blocks) {
          article.blocks.forEach(block => {
            if (block.type === 'image' && block.content?.url) {
              // Éviter les doublons
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

      const newVisualizations = enrichedVizList.map(viz => ({
        id: viz.id,
        chartType: viz.chartType,
        config: viz.config,
        dataset: viz.dataset,
        datasetId: viz.datasetId
      }));

      setVisualizations(newVisualizations);
    } catch (error) {
      console.error('Erreur chargement visualisations:', error);
      setVisualizations([]);
    } finally {
      setLoadingVisualizations(false);
    }
  };

  // États
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', blocks: [] });
  const [isLoadingArticle, setIsLoadingArticle] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(null);
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);
  
  const [showVisualizationLibrary, setShowVisualizationLibrary] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [loadingVisualizations, setLoadingVisualizations] = useState(false);
  
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // Styles
  const pageStyle = {
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f5f5f5",
    minHeight: "calc(100vh - 80px)",
    padding: "40px 20px"
  };

  const containerStyle = {
    maxWidth: "1400px",
    margin: "0 auto"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
    flexWrap: "wrap",
    gap: "20px"
  };

  const titleStyle = {
    fontSize: "32px",
    fontWeight: "bold",
    color: "#0085C7"
  };

  const backButton = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 20px',
    backgroundColor: '#0085C7',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
    transition: 'all 0.2s'
  };

  const filtersContainerStyle = {
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    marginBottom: "20px"
  };

  const searchInputStyle = {
    width: "100%",
    padding: "10px 15px 10px 40px",
    borderRadius: "10px",
    border: "1px solid #D9D9D9",
    fontSize: "14px"
  };

  const tableContainerStyle = {
    backgroundColor: "white",
    borderRadius: "10px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    overflow: "hidden"
  };

  const tableStyle = {
    width: "100%",
    borderCollapse: "collapse"
  };

  const thStyle = {
    padding: "15px",
    textAlign: "left",
    backgroundColor: "#f9fafb",
    fontWeight: "600",
    fontSize: "14px",
    color: "#333",
    borderBottom: "2px solid #e5e7eb"
  };

  const tdStyle = {
    padding: "15px",
    borderBottom: "1px solid #e5e7eb",
    fontSize: "14px"
  };

  const actionButtonStyle = (color) => ({
    padding: "8px 12px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "13px",
    fontWeight: "500",
    transition: "all 0.2s",
    backgroundColor: color,
    color: "white",
    marginRight: "5px"
  });

  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(5px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    padding: '20px',
    overflowY: 'auto'
  };

  const deleteModalStyle = {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "30px",
    maxWidth: "400px",
    width: "90%",
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    animation: 'slideIn 0.3s ease-out'
  };

  const editModalStyle = {
    backgroundColor: "white",
    borderRadius: "15px",
    padding: "30px",
    maxWidth: "900px",
    width: "90%",
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
    animation: 'slideIn 0.3s ease-out'
  };

  // Fetch articles
  const { data: articles, isLoading, error } = useQuery({
    queryKey: ['articles'],
    queryFn: async () => {
      const response = await fetch(`${API_BASE_URL}/articles`);
      if (!response.ok) throw new Error('Erreur de chargement');
      const data = await response.json();
      return data.member;
    }
  });

  // Mutation pour supprimer
  const deleteMutation = useMutation({
    mutationFn: async (articleId) => {
      const response = await fetch(`${API_BASE_URL}/articles/${articleId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      if (!response.ok) throw new Error('Erreur de suppression');
      return articleId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Supprimé !',
        message: `L'article a été supprimé avec succès`
      });
    },
    onError: (error) => {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      });
    }
  });

  // Mutation pour modifier
  const updateMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      console.log('Envoi de la mise à jour (PATCH):', { id, data });
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/merge-patch+json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Erreur réponse serveur:', { status: response.status, text: errorText });
        throw new Error(`Erreur ${response.status}: ${errorText || 'Modification échouée'}`);
      }
      
      const result = await response.json();
      console.log('Mise à jour réussie:', result);
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      setShowEditModal(false);
      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Modifié !',
        message: 'L\'article a été modifié avec succès'
      });
    }
  });

  // Helper - nom auteur
  const getAuthorName = (article) => {
    if (article.author?.pseudo) return article.author.pseudo;
    return 'Ancien utilisateur';
  };

  // Filtrage
  const filteredArticles = articles?.filter(article => {
    const searchLower = searchTerm.toLowerCase();
    const titleMatch = article.title?.toLowerCase().includes(searchLower);
    const authorMatch = getAuthorName(article).toLowerCase().includes(searchLower);
    return titleMatch || authorMatch;
  }) || [];

  // Ouvrir modal suppression
  const handleDeleteClick = (article) => {
    setArticleToDelete(article);
    setShowDeleteModal(true);
  };

  // Confirmer suppression
  const confirmDelete = () => {
    if (articleToDelete) {
      deleteMutation.mutate(articleToDelete.id);
      setShowDeleteModal(false);
      setArticleToDelete(null);
    }
  };

  // Ouvrir modal édition
  const handleEditClick = async (article) => {
    setIsLoadingArticle(true);
    setArticleToEdit(article);
    setShowEditModal(true);
    
    try {
      // Récupérer les détails complets de l'article avec les blocs
      const response = await fetch(`${API_BASE_URL}/articles/${article.id}`);
      if (!response.ok) throw new Error('Erreur de chargement');
      
      const fullArticle = await response.json();
      
      // Cloner les blocs existants en s'assurant que le contenu est bien préservé
      const blocksToEdit = (fullArticle.blocks || [])
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        .map(b => ({
          id: b.id,
          type: b.type,
          orderIndex: b.orderIndex || 0,
          content: { ...b.content } // Cloner le contenu
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

  // Sauvegarder modifications
  const handleSaveEdit = () => {
    try {
      if (!editFormData.title.trim()) {
        setPopup({
          isOpen: true,
          type: 'warning',
          title: 'Titre manquant',
          message: 'Veuillez entrer un titre'
        });
        return;
      }

      console.log('Blocs avant modification:', editFormData.blocks);

      const generatedContent = editFormData.blocks
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map(block => {
          if (block.type === 'text') return block.content.text;
          if (block.type === 'image') return `{url: ${block.content.url}}`;
          return '';
        })
        .filter(text => text?.trim())
        .join('\n\n');

      // Préparer les blocs pour l'envoi
      const blocksToSend = editFormData.blocks.map(block => {
        const blockData = {
          type: block.type,
          orderIndex: block.orderIndex,
          content: block.content
        };
        
        // Ajouter l'ID seulement pour les blocs existants (ID < 1700000000000 = avant Date.now())
        if (typeof block.id === 'number' && block.id < 1700000000000) {
          blockData.id = block.id;
        }
        
        return blockData;
      });

      // ===== Structure correcte pour PATCH =====
      // Ne pas envoyer { id, data }, mais directement les champs à modifier
      const patchData = {
        title: editFormData.title,
        content: generatedContent,
        blocks: blocksToSend
      };
      
      console.log('Données PATCH à envoyer:', patchData);
      updateMutation.mutate({
        id: articleToEdit.id,
        data: patchData
      });
    } catch (error) {
      console.error('Erreur dans handleSaveEdit:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur de validation',
        message: error.message || 'Une erreur est survenue lors du traitement'
      });
    }
  };

  // Gestion des blocks (édition)
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

  // Gérer l'upload d'image
  const handleImageUpload = (blockId, file) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      updateBlockContent(blockId, { url: imageUrl });
    };
    reader.readAsDataURL(file);
  };

  // Sélectionner une image depuis la médiathèque
  const selectFromMediaLibrary = (blockId, imageUrl) => {
    updateBlockContent(blockId, { url: imageUrl });
    setShowMediaLibrary(null);
  };

  // Supprimer l'image du block
  const removeImageFromBlock = (blockId) => {
    updateBlockContent(blockId, { url: '' });
  };

  if (isLoading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <Loader size={48} color="#0085C7" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#666' }}>Chargement des articles...</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); }}`}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ minHeight: '100vh', textAlign: 'center', padding: '100px', color: '#dc2626' }}>
        Erreur de chargement
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={containerStyle}>
        {/* Header */}
        <div style={headerStyle}>
          <div>
            <button
              onClick={() => navigate('/actualites')}
              style={backButton}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006ba3'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0085C7'}
            >
              <ArrowLeft size={18} />
              Retour
            </button>
            <h1 style={{...titleStyle, marginTop: '15px'}}>Gestion des Articles</h1>
          </div>
        </div>

        {/* Filtres */}
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          placeholder="Rechercher un article ou un auteur..."
        />

        {/* Tableau */}
        <div style={tableContainerStyle}>
          {filteredArticles.length === 0 ? (
            <div style={{ padding: "60px 20px", textAlign: "center", color: "#666" }}>
              <p style={{ fontSize: "18px" }}>Aucun article trouvé</p>
            </div>
          ) : (
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Titre</th>
                  <th style={thStyle}>Auteur</th>
                  <th style={thStyle}>Date</th>
                  <th style={thStyle}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredArticles.map((article) => (
                  <tr key={article.id} style={{ backgroundColor: "white" }}>
                    <td style={tdStyle}>
                      <strong>{article.title}</strong>
                    </td>
                    <td style={tdStyle}>
                      {getAuthorName(article)}
                    </td>
                    <td style={tdStyle}>
                      {new Date(article.createdAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td style={tdStyle}>
                      <button
                        onClick={() => navigate(`/articles/${article.id}`)}
                        style={actionButtonStyle("#6b7280")}
                        title="Voir l'article"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() => handleEditClick(article)}
                        style={actionButtonStyle("#0085C7")}
                        title="Modifier"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() => handleDeleteClick(article)}
                        style={actionButtonStyle("#dc2626")}
                        title="Supprimer"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Stats */}
        <div style={{ marginTop: "20px", fontSize: "14px", color: "#666" }}>
          <span>{filteredArticles.length} article(s) affiché(s)</span>
        </div>
      </div>

      {/* MODAL SUPPRESSION */}
      {showDeleteModal && articleToDelete && (
        <div style={modalOverlayStyle} onClick={() => setShowDeleteModal(false)}>
          <div style={deleteModalStyle} onClick={(e) => e.stopPropagation()}>
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <AlertTriangle size={48} color="#dc2626" style={{ marginBottom: "15px" }} />
              <h2 style={{ margin: "0 0 10px 0", color: "#333" }}>Confirmer la suppression</h2>
              <p style={{ color: "#666", fontSize: "14px", lineHeight: "1.6" }}>
                Êtes-vous sûr de vouloir supprimer l'article<br />
                <strong>"{articleToDelete.title}"</strong> ?<br />
                Cette action est irréversible.
              </p>
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={() => setShowDeleteModal(false)}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "2px solid #d1d5db",
                  backgroundColor: "white",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                Annuler
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteMutation.isPending}
                style={{
                  flex: 1,
                  padding: "12px",
                  border: "none",
                  backgroundColor: deleteMutation.isPending ? "#9ca3af" : "#dc2626",
                  color: "white",
                  borderRadius: "8px",
                  cursor: deleteMutation.isPending ? "not-allowed" : "pointer",
                  fontWeight: "600",
                  fontSize: "14px"
                }}
              >
                {deleteMutation.isPending ? 'Suppression...' : 'Supprimer'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL ÉDITION */}
      {showEditModal && articleToEdit && (
        <div style={modalOverlayStyle} onClick={() => !isLoadingArticle && setShowEditModal(false)}>
          <div style={editModalStyle} onClick={(e) => e.stopPropagation()}>
            {isLoadingArticle ? (
              <LoadingScreen isLoading={true} message="Chargement de l'article..." type="spinner" fullScreen={false} />
            ) : (
              <>
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0085C7' }}>
                    ✏️ Modifier l'article
                  </h2>
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

                {/* Titre */}
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

                {/* Blocks */}
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
                        {block.type === 'visualization' && <><BarChart3 size={16} /> Visualisation</>}
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
                        onOpenMediaLibrary={setShowMediaLibrary}
                      />
                    )}

                    {block.type === 'visualization' && (
                      <VisualizationBlockEditable
                        blockId={block.id}
                        visualizationId={block.content.visualizationId}
                        visualizations={visualizations}
                        loadingVisualizations={loadingVisualizations}
                        onVisualizationSelect={() => setShowVisualizationLibrary(block.id)}
                        onRemoveVisualization={() => removeBlock(block.id)}
                        onOpenMediaLibrary={() => setShowVisualizationLibrary(block.id)}
                      />
                    )}
                  </div>
                ))}

                {/* Ajouter blocks */}
                <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
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
                  <button
                    onClick={() => addBlock('visualization')}
                    style={{
                      padding: '10px 15px',
                      backgroundColor: '#fed7aa',
                      color: '#ea580c',
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
                    <Plus size={16} /> Visualisation
                  </button>
                </div>

                {/* Boutons */}
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
                      fontWeight: '600'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={updateMutation.isPending}
                    style={{
                      flex: 1,
                      padding: '12px',
                      border: 'none',
                      backgroundColor: updateMutation.isPending ? '#9ca3af' : '#009F3D',
                      color: 'white',
                      borderRadius: '10px',
                      cursor: updateMutation.isPending ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s',
                      opacity: updateMutation.isPending ? 0.7 : 1
                    }}
                    onMouseEnter={(e) => {
                      if (!updateMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#008835';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!updateMutation.isPending) {
                        e.currentTarget.style.backgroundColor = '#009F3D';
                      }
                    }}
                  >
                    {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* MODAL MÉDIATHÈQUE */}
      {showMediaLibrary !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
            padding: '20px',
            overflowY: 'auto'
          }}
          onClick={() => setShowMediaLibrary(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#0085C7' }}>
                📁 Médiathèque ({mediaLibrary.length} image{mediaLibrary.length > 1 ? 's' : ''})
              </h2>
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
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Chargement des images...
              </div>
            ) : mediaLibrary.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <Folder size={48} color="#D9D9D9" style={{ marginBottom: '10px' }} />
                <p>Aucune image dans la médiathèque</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>
                  Les images des articles apparaîtront ici
                </p>
              </div>
            ) : (
              <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
                gap: '15px',
                marginTop: '20px'
              }}>
                {mediaLibrary.map((image) => {
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
                      <img
                        src={image.url}
                        alt="Médiathèque"
                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                      />
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

      {/* MODAL MÉDIATHÈQUE VISUALISATIONS */}
      {showVisualizationLibrary !== null && (
        <div
          style={{
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
          }}
          onClick={() => setShowVisualizationLibrary(null)}
        >
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '15px',
              padding: '30px',
              maxWidth: '900px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold', color: '#FF9800' }}>
                📊 Visualisations ({visualizations.length} visualization{visualizations.length > 1 ? 's' : ''})
              </h2>
              <button
                onClick={() => setShowVisualizationLibrary(null)}
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

            {loadingVisualizations ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                Chargement des visualisations...
              </div>
            ) : visualizations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                <BarChart3 size={48} color="#D9D9D9" style={{ marginBottom: '10px' }} />
                <p>Aucune visualisation disponible</p>
                <p style={{ fontSize: '14px', marginTop: '5px' }}>
                  Les visualisations créées apparaîtront ici
                </p>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '15px' }}>
                {visualizations.map((viz) => {
                  const currentBlock = editFormData.blocks.find(b => b.id === showVisualizationLibrary);
                  const isSelected = currentBlock?.content?.visualizationId === viz.id;

                  return (
                    <div
                      key={viz.id}
                      style={{
                        padding: '12px',
                        border: isSelected ? '3px solid #FF9800' : '2px solid #D9D9D9',
                        borderRadius: '8px',
                        backgroundColor: isSelected ? '#fff8f0' : '#f9fafb',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '10px',
                        position: 'relative'
                      }}
                      onClick={() => {
                        const block = editFormData.blocks.find(b => b.id === showVisualizationLibrary);
                        if (block) {
                          setEditFormData({
                            ...editFormData,
                            blocks: editFormData.blocks.map(b =>
                              b.id === showVisualizationLibrary
                                ? { ...b, content: { ...b.content, visualizationId: viz.id } }
                                : b
                            )
                          });
                          setShowVisualizationLibrary(null);
                        }
                      }}
                      onMouseEnter={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#FF9800';
                          e.currentTarget.style.backgroundColor = '#fffaf5';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!isSelected) {
                          e.currentTarget.style.borderColor = '#D9D9D9';
                          e.currentTarget.style.backgroundColor = '#f9fafb';
                        }
                      }}
                    >
                      {/* Titre et type */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', color: '#333', fontSize: '14px' }}>
                            {viz.chartType}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', marginTop: '2px' }}>
                            {viz.dataset?.name || 'Sans dataset'}
                          </div>
                        </div>
                        {isSelected && (
                          <div style={{
                            backgroundColor: '#FF9800',
                            color: 'white',
                            borderRadius: '50%',
                            width: '24px',
                            height: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 'bold',
                            fontSize: '14px',
                            flexShrink: 0
                          }}>
                            ✓
                          </div>
                        )}
                      </div>

                      {/* Aperçu du graphique */}
                      <div style={{
                        backgroundColor: 'white',
                        borderRadius: '6px',
                        padding: '8px',
                        minHeight: '150px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid #e5e7eb'
                      }}>
                        <ChartRenderer
                          visualization={viz}
                          isThumbnail={true}
                          height={150}
                        />
                      </div>
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