import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

/**
 * Composant Popup réutilisable
 * 
 * @param {boolean} isOpen - Afficher ou masquer la popup
 * @param {function} onClose - Fonction appelée à la fermeture
 * @param {string} type - Type: 'success', 'error', 'warning', 'info'
 * @param {string} title - Titre de la popup
 * @param {string} message - Message principal
 * @param {boolean} showConfirm - Afficher les boutons Confirmer/Annuler (pour confirmation)
 * @param {function} onConfirm - Fonction appelée lors du clic sur Confirmer
 * @param {string} confirmText - Texte du bouton confirmer (défaut: "Confirmer")
 * @param {string} cancelText - Texte du bouton annuler (défaut: "Annuler")
 */
export function Popup({ 
  isOpen, 
  onClose, 
  type = 'info',
  title = '',
  message = '',
  showConfirm = false,
  onConfirm = null,
  confirmText = 'Confirmer',
  cancelText = 'Annuler'
}) {
  
  if (!isOpen) return null;

  // Styles
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    animation: 'fadeIn 0.2s ease-in-out'
  };

  const popupStyle = {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '30px',
    maxWidth: '400px',
    width: '90%',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    animation: 'slideIn 0.3s ease-out'
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: '15px',
    right: '15px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.2s'
  };

  const iconContainerStyle = {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 20px',
    backgroundColor: 
      type === 'success' ? '#d1fae5' :
      type === 'error' ? '#fee2e2' :
      type === 'warning' ? '#fef3c7' :
      '#dbeafe'
  };

  const titleStyle = {
    fontSize: '22px',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '15px',
    color: '#333'
  };

  const messageStyle = {
    fontSize: '15px',
    lineHeight: '1.6',
    textAlign: 'center',
    color: '#666',
    marginBottom: showConfirm ? '25px' : '20px'
  };

  const buttonsContainerStyle = {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  };

  const buttonStyle = (isPrimary) => ({
    flex: 1,
    padding: '12px 20px',
    border: isPrimary ? 'none' : '2px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: isPrimary ? getColorByType() : 'white',
    color: isPrimary ? 'white' : '#666'
  });

  const getColorByType = () => {
    switch(type) {
      case 'success': return '#10b981';
      case 'error': return '#dc2626';
      case 'warning': return '#f59e0b';
      default: return '#0085C7';
    }
  };

  const getIcon = () => {
    const iconProps = { size: 32, color: getColorByType() };
    
    switch(type) {
      case 'success': return <CheckCircle {...iconProps} />;
      case 'error': return <XCircle {...iconProps} />;
      case 'warning': return <AlertTriangle {...iconProps} />;
      default: return <Info {...iconProps} />;
    }
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateY(-20px) scale(0.95);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>

      <div 
        style={overlayStyle}
        onClick={onClose}
      >
        <div 
          style={popupStyle}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Bouton fermer */}
          <button
            onClick={onClose}
            style={closeButtonStyle}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <X size={20} color="#666" />
          </button>

          {/* Icône */}
          <div style={iconContainerStyle}>
            {getIcon()}
          </div>

          {/* Titre */}
          {title && <h2 style={titleStyle}>{title}</h2>}

          {/* Message */}
          {message && <p style={messageStyle}>{message}</p>}

          {/* Boutons */}
          {showConfirm ? (
            <div style={buttonsContainerStyle}>
              <button
                onClick={onClose}
                style={buttonStyle(false)}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
              >
                {cancelText}
              </button>
              <button
                onClick={handleConfirm}
                style={buttonStyle(true)}
                onMouseEnter={(e) => {
                  const darker = type === 'success' ? '#059669' :
                                 type === 'error' ? '#b91c1c' :
                                 type === 'warning' ? '#d97706' : '#006ba3';
                  e.currentTarget.style.backgroundColor = darker;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = getColorByType();
                }}
              >
                {confirmText}
              </button>
            </div>
          ) : (
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px 20px',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
                backgroundColor: getColorByType(),
                color: 'white',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => {
                const darker = type === 'success' ? '#059669' :
                               type === 'error' ? '#b91c1c' :
                               type === 'warning' ? '#d97706' : '#006ba3';
                e.currentTarget.style.backgroundColor = darker;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = getColorByType();
              }}
            >
              OK
            </button>
          )}
        </div>
      </div>
    </>
  );
}

// ========================================
// EXEMPLES D'UTILISATION
// ========================================

export function PopupExamples() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const [showError, setShowError] = React.useState(false);
  const [showWarning, setShowWarning] = React.useState(false);
  const [showInfo, setShowInfo] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const exampleContainerStyle = {
    padding: '40px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'Arial, sans-serif'
  };

  const buttonExampleStyle = {
    padding: '12px 24px',
    margin: '10px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    color: 'white'
  };

  return (
    <div style={exampleContainerStyle}>
      <h1>Exemples de Popups</h1>
      
      {/* Boutons de test */}
      <div>
        <button 
          onClick={() => setShowSuccess(true)}
          style={{...buttonExampleStyle, backgroundColor: '#10b981'}}
        >
          Popup Succès
        </button>

        <button 
          onClick={() => setShowError(true)}
          style={{...buttonExampleStyle, backgroundColor: '#dc2626'}}
        >
          Popup Erreur
        </button>

        <button 
          onClick={() => setShowWarning(true)}
          style={{...buttonExampleStyle, backgroundColor: '#f59e0b'}}
        >
          Popup Avertissement
        </button>

        <button 
          onClick={() => setShowInfo(true)}
          style={{...buttonExampleStyle, backgroundColor: '#0085C7'}}
        >
          Popup Info
        </button>

        <button 
          onClick={() => setShowConfirm(true)}
          style={{...buttonExampleStyle, backgroundColor: '#6b7280'}}
        >
          Popup Confirmation
        </button>
      </div>

      {/* Popups */}
      <Popup
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        type="success"
        title="Succès !"
        message="L'article a été créé avec succès."
      />

      <Popup
        isOpen={showError}
        onClose={() => setShowError(false)}
        type="error"
        title="Erreur"
        message="Une erreur est survenue lors de la création de l'article."
      />

      <Popup
        isOpen={showWarning}
        onClose={() => setShowWarning(false)}
        type="warning"
        title="Attention"
        message="Tous les champs doivent être remplis avant de continuer."
      />

      <Popup
        isOpen={showInfo}
        onClose={() => setShowInfo(false)}
        type="info"
        title="Information"
        message="Les modifications seront enregistrées automatiquement."
      />

      <Popup
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        type="warning"
        title="Confirmer la suppression"
        message="Êtes-vous sûr de vouloir supprimer cet article ? Cette action est irréversible."
        showConfirm={true}
        onConfirm={() => {
          console.log('Article supprimé !');
        }}
        confirmText="Supprimer"
        cancelText="Annuler"
      />
    </div>
  );
}