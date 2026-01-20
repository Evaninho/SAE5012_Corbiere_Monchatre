import React, { useState, useEffect } from 'react';
import { Loader, Trophy } from 'lucide-react';

/**
 * Composant LoadingScreen - Écran de chargement réutilisable
 * 
 * @param {boolean} isLoading - Afficher ou masquer le loading
 * @param {string} message - Message à afficher (défaut: "Chargement...")
 * @param {boolean} showProgress - Afficher la barre de progression (défaut: false)
 * @param {number} progress - Pourcentage de progression (0-100)
 * @param {boolean} fullScreen - Afficher en plein écran (défaut: true)
 * @param {string} type - Type de spinner: 'spinner', 'dots', 'bars', 'olympic' (défaut: 'spinner')
 */
export function LoadingScreen({ 
  isLoading = true,
  message = "Chargement...",
  showProgress = false,
  progress = 0,
  fullScreen = true,
  type = 'spinner'
}) {
  
  if (!isLoading) return null;

  // Styles
  const containerStyle = fullScreen ? {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
    backdropFilter: 'blur(5px)'
  } : {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    minHeight: '200px'
  };

  const messageStyle = {
    marginTop: '20px',
    fontSize: '18px',
    fontWeight: '600',
    color: '#333'
  };

  const progressBarContainerStyle = {
    width: '300px',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '10px',
    overflow: 'hidden',
    marginTop: '20px'
  };

  const progressBarStyle = {
    height: '100%',
    backgroundColor: '#0085C7',
    borderRadius: '10px',
    transition: 'width 0.3s ease',
    width: `${progress}%`
  };

  const progressTextStyle = {
    marginTop: '10px',
    fontSize: '14px',
    color: '#666',
    fontWeight: '500'
  };

  // Rendu du spinner selon le type
  const renderSpinner = () => {
    switch(type) {
      case 'dots':
        return <DotsSpinner />;
      case 'bars':
        return <BarsSpinner />;
      case 'olympic':
        return <OlympicSpinner />;
      default:
        return <DefaultSpinner />;
    }
  };

  return (
    <>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>

      <div style={containerStyle}>
        {renderSpinner()}
        
        <p style={messageStyle}>{message}</p>
        
        {showProgress && (
          <>
            <div style={progressBarContainerStyle}>
              <div style={progressBarStyle}></div>
            </div>
            <p style={progressTextStyle}>{progress}%</p>
          </>
        )}
      </div>
    </>
  );
}

// ========================================
// DIFFÉRENTS TYPES DE SPINNERS
// ========================================

// Spinner par défaut (rotatif)
function DefaultSpinner() {
  return (
    <Loader 
      size={48} 
      color="#0085C7" 
      style={{ animation: 'spin 1s linear infinite' }}
    />
  );
}

// Spinner avec 3 points qui rebondissent
function DotsSpinner() {
  const dotStyle = (delay) => ({
    width: '15px',
    height: '15px',
    backgroundColor: '#0085C7',
    borderRadius: '50%',
    margin: '0 5px',
    animation: `bounce 1s ease-in-out ${delay}s infinite`
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={dotStyle(0)}></div>
      <div style={dotStyle(0.2)}></div>
      <div style={dotStyle(0.4)}></div>
    </div>
  );
}

// Spinner avec des barres qui ondulent
function BarsSpinner() {
  const barStyle = (delay) => ({
    width: '6px',
    height: '40px',
    backgroundColor: '#0085C7',
    margin: '0 4px',
    borderRadius: '3px',
    animation: `wave 1s ease-in-out ${delay}s infinite`
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
      <div style={barStyle(0)}></div>
      <div style={barStyle(0.1)}></div>
      <div style={barStyle(0.2)}></div>
      <div style={barStyle(0.3)}></div>
      <div style={barStyle(0.4)}></div>
    </div>
  );
}

// Spinner avec le logo olympique
function OlympicSpinner() {
  const olympicColors = ['#0085C7', '#F4C300', '#000000', '#009F3D', '#DF0024'];
  
  const ringStyle = (color, delay) => ({
    width: '30px',
    height: '30px',
    border: '4px solid ' + color,
    borderRadius: '50%',
    margin: '0 -5px',
    animation: `pulse 1.5s ease-in-out ${delay}s infinite`
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {olympicColors.map((color, index) => (
        <div key={index} style={ringStyle(color, index * 0.2)}></div>
      ))}
    </div>
  );
}

// ========================================
// COMPOSANT AVEC PROGRESSION AUTOMATIQUE
// ========================================

export function LoadingWithProgress({ 
  isLoading = true,
  message = "Chargement...",
  duration = 3000, // Durée en ms
  onComplete = null,
  type = 'spinner'
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setProgress(0);
      return;
    }

    const interval = 50; // Mise à jour toutes les 50ms
    const increment = (interval / duration) * 100;
    
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + increment;
        if (newProgress >= 100) {
          clearInterval(timer);
          if (onComplete) onComplete();
          return 100;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [isLoading, duration, onComplete]);

  return (
    <LoadingScreen
      isLoading={isLoading}
      message={message}
      showProgress={true}
      progress={Math.round(progress)}
      type={type}
    />
  );
}

// ========================================
// COMPOSANT OVERLAY (pour loader sur une partie de la page)
// ========================================

export function LoadingOverlay({ 
  isLoading = true,
  message = "Chargement...",
  type = 'spinner'
}) {
  if (!isLoading) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '15px',
      zIndex: 10
    }}>
      <LoadingScreen
        isLoading={true}
        message={message}
        fullScreen={false}
        type={type}
      />
    </div>
  );
}