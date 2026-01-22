import React from 'react';
import { BarChart3 } from 'lucide-react';
import { ChartRenderer } from './ChartRendererold';

/**
 * VisualizationBlock - Composant pour afficher un bloc de visualisation
 * Utilise ChartRenderer en interne
 */
export function VisualizationBlock({ 
  visualization, 
  height = 350,
  showTitle = true,
  blockId = null,
  onRemove = null
}) {
  if (!visualization || !visualization.config) {
    return (
      <div style={{
        padding: '20px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        color: '#dc2626',
        fontSize: '14px',
        textAlign: 'center'
      }}>
        ❌ Visualisation invalide
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
              {visualization.chartType} - {visualization.dataset?.name || 'Sans dataset'}
            </span>
          </div>
          {onRemove && blockId && (
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
        <ChartRenderer visualization={visualization} height={height} />
      </div>
    </div>
  );
}
