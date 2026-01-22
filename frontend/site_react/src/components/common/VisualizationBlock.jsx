import React from 'react';
import { BarChart3, Plus } from 'lucide-react';
import { ChartRenderer } from './ChartRenderer';

/**
 * VisualizationBlock - Composant pour afficher un bloc de visualisation
 * Peut être utilisé en mode lecture (article) ou édition (création article)
 */
export function VisualizationBlock({ 
  visualization = null,
  visualizationId = null,
  visualizations = [],
  blockId = null,
  onRemove = null,
  onOpenMediaLibrary = null,
  height = 350,
  showTitle = true,
  editable = false
}) {
  // Chercher la visualisation dans la liste si on a un ID
  const viz = visualization || (visualizationId && visualizations.find(v => v.id === visualizationId));

  // Mode édition : pas de visualisation sélectionnée
  if (editable && !viz) {
    return (
      <div style={{
        padding: '30px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        border: '2px dashed #D9D9D9',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.2s',
        minHeight: '150px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }}
      onClick={() => onOpenMediaLibrary?.(blockId)}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#FF9800';
        e.currentTarget.style.backgroundColor = '#fffaf5';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = '#D9D9D9';
        e.currentTarget.style.backgroundColor = '#f9fafb';
      }}
      >
        <BarChart3 size={32} color="#D9D9D9" />
        <p style={{ margin: '0', color: '#666', fontWeight: '500' }}>
          Cliquez pour sélectionner une visualisation
        </p>
        <p style={{ margin: '0', fontSize: '12px', color: '#999' }}>
          ou ouvrez la médiathèque
        </p>
      </div>
    );
  }

  // Pas de visualisation valide
  if (!viz || !viz.config) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        color: '#dc2626',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        ❌ Visualisation invalide (ID: {visualizationId})
      </div>
    );
  }

  return (
    <div style={{
      marginBottom: '25px',
      padding: '20px',
      backgroundColor: '#f9fafb',
      borderRadius: '14px',
      border: '1px solid #e5e7eb'
    }}>
      {showTitle && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '15px',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="#FF9800" />
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#666' }}>
              {viz.chartType} - {viz.dataset?.name || 'Sans dataset'}
            </span>
          </div>
          {editable && onRemove && blockId && (
            <button
              onClick={() => onRemove(blockId)}
              style={{
                background: 'none',
                border: 'none',
                color: '#dc2626',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '4px 8px'
              }}
              title="Supprimer"
            >
              ✕
            </button>
          )}
        </div>
      )}
      
      <div style={{
        backgroundColor: 'white',
        padding: '15px',
        borderRadius: '8px',
        minHeight: `${height}px`
      }}>
        <ChartRenderer visualization={viz} height={height} />
      </div>

      {editable && onOpenMediaLibrary && (
        <button
          onClick={() => onOpenMediaLibrary(blockId)}
          style={{
            marginTop: '10px',
            padding: '8px 12px',
            backgroundColor: '#FF9800',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '5px'
          }}
        >
          <Plus size={14} />
          Changer la visualisation
        </button>
      )}
    </div>
  );
}
