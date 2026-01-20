import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Edit, Eye, Search, AlertTriangle, ArrowLeft, Loader, X, Plus, ArrowUp, ArrowDown, Type, Image } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Popup } from '../components/Popup';

const API_BASE_URL = 'http://localhost:8000/api';

export function GestionArticlesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const getToken = () => localStorage.getItem('authToken');

  // États
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [articleToDelete, setArticleToDelete] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [articleToEdit, setArticleToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({ title: '', blocks: [] });
  
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
      const response = await fetch(`${API_BASE_URL}/articles/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/ld+json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Erreur de modification');
      return await response.json();
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
  const handleEditClick = (article) => {
    setArticleToEdit(article);
    setEditFormData({
      title: article.title,
      blocks: article.blocks.map(b => ({...b}))
    });
    setShowEditModal(true);
  };

  // Sauvegarder modifications
  const handleSaveEdit = () => {
    if (!editFormData.title.trim()) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Titre manquant',
        message: 'Veuillez entrer un titre'
      });
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

    updateMutation.mutate({
      id: articleToEdit.id,
      data: {
        title: editFormData.title,
        content: generatedContent,
        blocks: editFormData.blocks.map(block => ({
          type: block.type,
          orderIndex: block.orderIndex,
          content: block.content
        }))
      }
    });
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
        <div style={filtersContainerStyle}>
          <div style={{ position: "relative" }}>
            <Search style={{ position: "absolute", left: "15px", top: "12px", width: "18px", color: "#666" }} />
            <input
              type="text"
              placeholder="Rechercher un article ou un auteur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={searchInputStyle}
            />
          </div>
        </div>

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
        <div style={modalOverlayStyle} onClick={() => setShowEditModal(false)}>
          <div style={editModalStyle} onClick={(e) => e.stopPropagation()}>
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
                  <div>
                    <input
                      type="text"
                      value={block.content.url || ''}
                      onChange={(e) => updateBlockContent(block.id, { url: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #D9D9D9',
                        borderRadius: '8px',
                        fontSize: '14px',
                        boxSizing: 'border-box'
                      }}
                      placeholder="URL de l'image"
                    />
                    {block.content.url && (
                      <img src={block.content.url} alt="Preview" style={{ maxWidth: '100%', maxHeight: '200px', marginTop: '10px', borderRadius: '8px' }} />
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Ajouter blocks */}
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
                  fontWeight: '600'
                }}
              >
                {updateMutation.isPending ? 'Enregistrement...' : 'Enregistrer'}
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