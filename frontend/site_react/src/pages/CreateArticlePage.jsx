
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowUp, ArrowDown, ArrowLeft, Image as ImageIcon, Type, X, Upload, Folder } from "lucide-react";
import { Popup } from "../components/Popup";

const API_BASE_URL = 'http://localhost:8000/api';

export function CreateArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // État pour la popup
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // État pour la médiathèque
  const [showMediaLibrary, setShowMediaLibrary] = useState(null); // ID du block concerné
  const [mediaLibrary, setMediaLibrary] = useState([]);
  const [loadingMedia, setLoadingMedia] = useState(false);

  const getToken = () => localStorage.getItem('authToken');

  // Charger toutes les images des articles au montage
  useEffect(() => {
    loadMediaLibrary();
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

  const styles = {
    headerStyle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "30px",
      flexWrap: "wrap",
      gap: "20px"
    },
    backButton: {
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
    },
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px'
    },
    container: {
      maxWidth: '900px',
      margin: '0 auto'
    },
    header: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      marginBottom: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },
    title: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '20px'
    },
    titleInput: {
      width: '100%',
      padding: '15px',
      fontSize: '18px',
      border: '2px solid #D9D9D9',
      borderRadius: '10px',
      boxSizing: 'border-box',
      fontWeight: '600'
    },
    blocksContainer: {
      marginBottom: '30px'
    },
    block: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '20px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      position: 'relative'
    },
    blockHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    blockType: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#666',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    blockActions: {
      display: 'flex',
      gap: '8px'
    },
    iconButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      padding: '6px',
      borderRadius: '6px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'background-color 0.2s'
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '15px',
      fontSize: '14px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      fontFamily: 'Arial, sans-serif',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '14px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      boxSizing: 'border-box'
    },
    // NOUVEAU: Disposition verticale
    imageOptionsContainer: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
      marginBottom: '20px'
    },
    imageOptionButton: {
      padding: '15px 20px',
      border: '2px dashed #D9D9D9',
      borderRadius: '10px',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      transition: 'all 0.2s',
      fontSize: '14px',
      fontWeight: '600',
      color: '#666'
    },
    mediaLibraryOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    mediaLibraryModal: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '900px',
      width: '100%',
      maxHeight: '80vh',
      overflow: 'auto',
      position: 'relative'
    },
    mediaGrid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
      gap: '15px',
      marginTop: '20px'
    },
    mediaItem: {
      position: 'relative',
      borderRadius: '8px',
      overflow: 'hidden',
      cursor: 'pointer',
      border: '2px solid transparent',
      transition: 'all 0.2s'
    },
    selectedMediaItem: {
      border: '3px solid #0085C7',
      boxShadow: '0 4px 12px rgba(0, 133, 199, 0.3)'
    },
    addBlocksSection: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      marginBottom: '30px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
    },
    addBlockButton: {
      padding: '12px 20px',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      marginRight: '10px',
      marginBottom: '10px'
    },
    submitSection: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '15px'
    },
    submitButton: {
      padding: '15px 40px',
      backgroundColor: '#009F3D',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: 'bold',
      transition: 'all 0.2s'
    },
    cancelButton: {
      padding: '15px 40px',
      backgroundColor: '#f3f4f6',
      color: '#666',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'all 0.2s'
    },
    removeImageButton: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      backgroundColor: 'rgba(220, 38, 38, 0.9)',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    }
  };

  // Ajouter un block
  const addBlock = (type) => {
    const newBlock = {
      id: Date.now(),
      type: type,
      orderIndex: blocks.length,
      content: type === 'text' ? { text: '' } : type === 'image' ? { url: '' } : {}
    };
    setBlocks([...blocks, newBlock]);
  };

  // Supprimer un block
  const removeBlock = (id) => {
    setBlocks(blocks.filter(b => b.id !== id));
  };

  // Déplacer un block
  const moveBlock = (index, direction) => {
    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= newBlocks.length) return;

    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];

    newBlocks.forEach((block, idx) => {
      block.orderIndex = idx;
    });

    setBlocks(newBlocks);
  };

  // Mettre à jour le contenu d'un block
  const updateBlockContent = (id, content) => {
    setBlocks(blocks.map(block =>
      block.id === id ? { ...block, content } : block
    ));
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

  // Soumettre l'article
  const handleSubmit = async () => {
    if (!title.trim()) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Titre manquant',
        message: 'Veuillez entrer un titre pour votre article'
      });
      return;
    }

    if (blocks.length === 0) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Contenu manquant',
        message: 'Veuillez ajouter au moins un block de contenu'
      });
      return;
    }

    const hasEmptyBlocks = blocks.some(block => {
      if (block.type === 'text') return !block.content.text?.trim();
      if (block.type === 'image') return !block.content.url?.trim();
      return false;
    });

    if (hasEmptyBlocks) {
      setPopup({
        isOpen: true,
        type: 'warning',
        title: 'Blocks incomplets',
        message: 'Tous les blocks doivent avoir du contenu'
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const generatedContent = blocks
        .map(block => {
          if (block.type === 'text') {
            return block.content.text;
          } else if (block.type === 'image') {
            return `{url: ${block.content.url}}`;
          }
          return '';
        })
        .filter(text => text?.trim())
        .join('\n\n');

      const response = await fetch(`${API_BASE_URL}/articles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          title: title,
          content: generatedContent,
          blocks: [...blocks]
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map(block => ({
              type: block.type,
              orderIndex: block.orderIndex,
              content: block.content
            }))
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || error.message || 'Erreur lors de la création');
      }

      const data = await response.json();

      setPopup({
        isOpen: true,
        type: 'success',
        title: 'Succès !',
        message: 'Article créé avec succès'
      });

      setTimeout(() => {
        navigate(`/actualites/${data.id}`);
      }, 1500);

    } catch (error) {
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: error.message
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.headerStyle}>
        <button
            onClick={() => navigate('/actualites')}
            style={styles.backButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#006ba3'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#0085C7'}
          >
            <ArrowLeft size={18} />
            Retour
          </button>
      </div>
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>✏️ Créer un article</h1>
          <input
            type="text"
            placeholder="Titre de l'article..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={styles.titleInput}
            onFocus={(e) => e.target.style.borderColor = '#0085C7'}
            onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
          />
        </div>

        {/* Blocks */}
        <div style={styles.blocksContainer}>
          {blocks.map((block, index) => (
            <div key={block.id} style={styles.block}>
              {/* Header du block */}
              <div style={styles.blockHeader}>
                <div style={styles.blockType}>
                  {block.type === 'text' && <><Type size={18} /> Texte</>}
                  {block.type === 'image' && <><ImageIcon size={18} /> Image</>}
                </div>

                <div style={styles.blockActions}>
                  {index > 0 && (
                    <button
                      onClick={() => moveBlock(index, 'up')}
                      style={styles.iconButton}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ArrowUp size={18} color="#666" />
                    </button>
                  )}

                  {index < blocks.length - 1 && (
                    <button
                      onClick={() => moveBlock(index, 'down')}
                      style={styles.iconButton}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <ArrowDown size={18} color="#666" />
                    </button>
                  )}

                  <button
                    onClick={() => removeBlock(block.id)}
                    style={styles.iconButton}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#fee2e2'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <Trash2 size={18} color="#dc2626" />
                  </button>
                </div>
              </div>

              {/* Contenu TEXTE */}
              {block.type === 'text' && (
                <textarea
                  placeholder="Entrez votre texte ici..."
                  value={block.content.text || ''}
                  onChange={(e) => updateBlockContent(block.id, { text: e.target.value })}
                  style={styles.textarea}
                  onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                  onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
                />
              )}

              {/* Contenu IMAGE - DISPOSITION VERTICALE */}
              {block.type === 'image' && (
                <div>
                  {/* 3 OPTIONS EN COLONNE */}
                  <div style={styles.imageOptionsContainer}>
                    {/* Option 1: Upload */}
                    <label
                      style={styles.imageOptionButton}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e0f2fe';
                        e.currentTarget.style.borderColor = '#0085C7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#D9D9D9';
                      }}
                    >
                      <Upload size={20} color="#0085C7" />
                      <span>Importer une image</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            handleImageUpload(block.id, e.target.files[0]);
                          }
                        }}
                        style={{ display: 'none' }}
                      />
                    </label>

                    {/* Option 2: URL */}
                    <div style={{ marginTop: '10px' }}>
                      <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                        Ou coller l'URL de l'image
                      </label>
                      <input
                        type="text"
                        placeholder="https://exemple.com/image.jpg"
                        value={block.content.url || ''}
                        onChange={(e) => updateBlockContent(block.id, { url: e.target.value })}
                        style={styles.input}
                        onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                        onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
                      />
                    </div>

                    {/* Option 3: Médiathèque */}
                    <button
                      onClick={() => setShowMediaLibrary(block.id)}
                      style={{ ...styles.imageOptionButton, border: '2px dashed #D9D9D9' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#e0f2fe';
                        e.currentTarget.style.borderColor = '#0085C7';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#f9fafb';
                        e.currentTarget.style.borderColor = '#D9D9D9';
                      }}
                    >
                      <Folder size={20} color="#0085C7" />
                      <span>Médiathèque ({mediaLibrary.length} images)</span>
                    </button>
                  </div>

                  {/* Aperçu avec bouton de suppression */}
                  {block.content.url && (
                    <div style={{ marginTop: '15px', position: 'relative', textAlign: 'center' }}>
                      <img
                        src={block.content.url}
                        alt="Aperçu"
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                      <button
                        onClick={() => removeImageFromBlock(block.id)}
                        style={styles.removeImageButton}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#b91c1c'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(220, 38, 38, 0.9)'}
                        title="Retirer l'image"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Boutons d'ajout */}
        <div style={styles.addBlocksSection}>
          <h3 style={{ marginBottom: '15px', fontSize: '18px', fontWeight: '600' }}>
            Ajouter un élément
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            <button
              onClick={() => addBlock('text')}
              style={{
                ...styles.addBlockButton,
                backgroundColor: '#e0f2fe',
                color: '#0085C7'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bae6fd'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e0f2fe'}
            >
              <Type size={18} />
              Texte
            </button>

            <button
              onClick={() => addBlock('image')}
              style={{
                ...styles.addBlockButton,
                backgroundColor: '#dbeafe',
                color: '#1e40af'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#bfdbfe'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#dbeafe'}
            >
              <ImageIcon size={18} />
              Image
            </button>
          </div>
        </div>

        {/* Boutons submit */}
        <div style={styles.submitSection}>
          <button
            onClick={() => navigate('/actualites')}
            style={styles.cancelButton}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
          >
            Annuler
          </button>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              opacity: isSubmitting ? 0.6 : 1,
              cursor: isSubmitting ? 'not-allowed' : 'pointer'
            }}
            onMouseEnter={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#008835';
            }}
            onMouseLeave={(e) => {
              if (!isSubmitting) e.currentTarget.style.backgroundColor = '#009F3D';
            }}
          >
            {isSubmitting ? 'Création en cours...' : 'Publier l\'article'}
          </button>
        </div>
      </div>

      {/* MODAL MÉDIATHÈQUE */}
      {showMediaLibrary !== null && (
        <div
          style={styles.mediaLibraryOverlay}
          onClick={() => setShowMediaLibrary(null)}
        >
          <div
            style={styles.mediaLibraryModal}
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
              <div style={styles.mediaGrid}>
                {mediaLibrary.map((image) => {
                  const isSelected = blocks.find(b => b.id === showMediaLibrary)?.content?.url === image.url;

                  return (
                    <div
                      key={image.id}
                      style={{
                        ...styles.mediaItem,
                        ...(isSelected ? styles.selectedMediaItem : {})
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