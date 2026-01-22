import React, { useState } from 'react';
import { BarChart3, X } from 'lucide-react';
import ChartRenderer from './ChartRenderer';

/**
 * VisualizationBlockEditable - Gère l'affichage et l'édition d'une visualisation
 * Utilisé dans CreateArticlePage et GestionArticlePage
 * 
 * Props:
 * - blockId: ID du bloc
 * - visualizationId: ID de la visualisation sélectionnée
 * - visualizations: Liste des visualisations disponibles
 * - loadingVisualizations: État de chargement
 * - onVisualizationSelect: Callback sélection
 * - onRemoveVisualization: Callback suppression
 * - onOpenMediaLibrary: Callback ouvrir modale
 */
export function VisualizationBlockEditable({
  blockId,
  visualizationId,
  visualizations = [],
  loadingVisualizations = false,
  onVisualizationSelect,
  onRemoveVisualization,
  onOpenMediaLibrary
}) {
  const selectedViz = visualizations.find(v => v.id === visualizationId);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    buttonGroup: {
      display: 'flex',
      gap: '10px'
    },
    button: {
      padding: '12px 20px',
      border: '2px dashed #D9D9D9',
      borderRadius: '10px',
      backgroundColor: '#f9fafb',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      transition: 'all 0.2s',
      fontSize: '14px',
      fontWeight: '600',
      color: '#666'
    },
    selectedBox: {
      backgroundColor: '#fff8f0',
      border: '2px solid #FF9800',
      borderRadius: '10px',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '15px'
    },
    selectedHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    selectedTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    removeBtn: {
      background: '#dc2626',
      color: 'white',
      border: 'none',
      borderRadius: '50%',
      width: '28px',
      height: '28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
      transition: 'all 0.2s'
    },
    chartPreview: {
      backgroundColor: 'white',
      border: '1px solid #D9D9D9',
      borderRadius: '8px',
      padding: '15px',
      minHeight: '250px'
    },
    buttonAction: {
      padding: '10px 15px',
      backgroundColor: '#fef3e0',
      color: '#FF9800',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '600',
      transition: 'all 0.2s'
    }
  };

  // Aucune visualisation sélectionnée
  if (!selectedViz) {
    return (
      <div style={styles.container}>
        <div style={styles.buttonGroup}>
          <button
            style={styles.button}
            onClick={() => onOpenMediaLibrary(blockId)}
            onMouseEnter={(e) => {
              e.target.style.borderColor = '#FF9800';
              e.target.style.backgroundColor = '#fffaf5';
            }}
            onMouseLeave={(e) => {
              e.target.style.borderColor = '#D9D9D9';
              e.target.style.backgroundColor = '#f9fafb';
            }}
          >
            <BarChart3 size={18} />
            Ajouter une visualisation
          </button>
        </div>

        {loadingVisualizations && (
          <div style={{ fontSize: '13px', color: '#999' }}>
            ⏳ Chargement des visualisations...
          </div>
        )}

        {!loadingVisualizations && visualizations.length === 0 && (
          <div style={{ fontSize: '13px', color: '#999' }}>
            📊 Aucune visualisation disponible
          </div>
        )}
      </div>
    );
  }

  // Visualisation sélectionnée
  return (
    <div style={styles.container}>
      <div style={styles.selectedBox}>
        <div style={styles.selectedHeader}>
          <div>
            <div style={styles.selectedTitle}>
              📊 {selectedViz.chartType} - {selectedViz.dataset?.name || 'Sans dataset'}
            </div>
          </div>
          <button
            style={styles.removeBtn}
            onClick={() => onRemoveVisualization(blockId)}
            title="Supprimer"
            onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
          >
            <X size={16} />
          </button>
        </div>

        {/* Aperçu du graphique */}
        <div style={styles.chartPreview}>
          <ChartRenderer
            visualization={selectedViz}
            isThumbnail={false}
            height={250}
          />
        </div>

        {/* Boutons d'action */}
        <div style={styles.buttonGroup}>
          <button
            style={styles.buttonAction}
            onClick={() => onOpenMediaLibrary(blockId)}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#fde5b4'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#fef3e0'}
          >
            Changer
          </button>
        </div>
      </div>
    </div>
  );
}
