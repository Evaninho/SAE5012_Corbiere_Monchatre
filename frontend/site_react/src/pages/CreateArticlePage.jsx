// src/pages/CreateArticlePage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Trash2, ArrowUp, ArrowDown, Image, Type, BarChart } from "lucide-react";

export function CreateArticlePage() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getToken = () => localStorage.getItem('authToken');

  const styles = {
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

    // Réorganiser les orderIndex
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

  // Soumettre l'article
  const handleSubmit = async () => {
    if (!title.trim()) {
      alert('Veuillez entrer un titre');
      return;
    }

    if (blocks.length === 0) {
      alert('Veuillez ajouter au moins un block de contenu');
      return;
    }

    // Vérifier que tous les blocks ont du contenu
    const hasEmptyBlocks = blocks.some(block => {
      if (block.type === 'text') return !block.content.text?.trim();
      if (block.type === 'image') return !block.content.url?.trim();
      return false;
    });

    if (hasEmptyBlocks) {
      alert('Tous les blocks doivent avoir du contenu');
      return;
    }

    setIsSubmitting(true);

    console.log('envoie...');


    try {
      // Générer le contenu à partir des blocks
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

      console.log('📤 Envoi de l\'article:', {
        title,
        content: generatedContent,
        blocks: blocks.length
      });

      const response = await fetch('http://localhost:8000/api/articles', {
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

      console.log('Response status:', response.status);

      if (!response.ok) {
        const error = await response.json();
        console.error('Erreur API:', error);
        throw new Error(error.detail || error.message || 'Erreur lors de la création');
      }

      const data = await response.json();
      console.log('✅ Article créé:', data);
      alert('Article créé avec succès !');
      navigate(`/actualites/${data.id}`);

    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
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
                  {block.type === 'image' && <><Image size={18} /> Image</>}
                  {block.type === 'visualization' && <><BarChart size={18} /> Visualisation</>}
                </div>

                <div style={styles.blockActions}>
                  {/* Déplacer vers le haut */}
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

                  {/* Déplacer vers le bas */}
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

                  {/* Supprimer */}
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

              {/* Contenu du block */}
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

              {block.type === 'image' && (
                <div>
                  <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                      Importer une image
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          const file = e.target.files[0];
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            updateBlockContent(block.id, { url: event.target.result });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      style={{
                        padding: '10px',
                        border: '2px dashed #0085C7',
                        borderRadius: '10px',
                        backgroundColor: '#f0f8ff',
                        cursor: 'pointer',
                        width: '100%',
                        boxSizing: 'border-box'
                      }}
                    />
                  </div>

                  <div style={{ marginBottom: '15px', textAlign: 'center', color: '#999', fontSize: '14px' }}>
                    OU
                  </div>

                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: '600', color: '#666' }}>
                    Coller l'URL de l'image
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

                  {block.content.url && (
                    <div style={{ marginTop: '15px', textAlign: 'center' }}>
                      <img
                        src={block.content.url}
                        alt="Aperçu"
                        style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    </div>
                  )}
                </div>
              )}

              {block.type === 'visualization' && (
                <div style={{
                  padding: '40px',
                  backgroundColor: '#f0f4f8',
                  borderRadius: '10px',
                  textAlign: 'center',
                  color: '#666'
                }}>
                  📊 Visualisation (configuration à venir)
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Boutons d'ajout de blocks */}
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
              <Image size={18} />
              Image
            </button>

            {/* <button
              onClick={() => addBlock('visualization')}
              style={{
                ...styles.addBlockButton,
                backgroundColor: '#e0e7ff',
                color: '#4f46e5'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#c7d2fe'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#e0e7ff'}
            >
              <BarChart size={18} />
              Visualisation
            </button> */}
          </div>
        </div>

        {/* Boutons de soumission */}
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
    </div>
  );
}