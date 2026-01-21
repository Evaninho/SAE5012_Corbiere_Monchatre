import React from 'react';
import { Upload, Folder, X } from 'lucide-react';

export function ImageBlock({
  blockId,
  imageUrl,
  mediaLibrary,
  loadingMedia,
  onImageUpload,
  onImageUrlChange,
  onSelectFromMediaLibrary,
  onRemoveImage,
  onOpenMediaLibrary
}) {
  const styles = {
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
    uploadLabel: {
      display: 'block',
      marginBottom: '8px',
      fontSize: '14px',
      fontWeight: '600',
      color: '#666'
    },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '14px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      boxSizing: 'border-box'
    },
    urlContainer: {
      marginTop: '10px'
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
    },
    imagePreview: {
      marginTop: '15px',
      position: 'relative',
      textAlign: 'center'
    }
  };

  return (
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
                onImageUpload(blockId, e.target.files[0]);
              }
            }}
            style={{ display: 'none' }}
          />
        </label>

        {/* Option 2: URL */}
        <div style={styles.urlContainer}>
          <label style={styles.uploadLabel}>
            Ou coller l'URL de l'image
          </label>
          <input
            type="text"
            placeholder="https://exemple.com/image.jpg"
            value={imageUrl || ''}
            onChange={(e) => onImageUrlChange(blockId, { url: e.target.value })}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = '#0085C7'}
            onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
          />
        </div>

        {/* Option 3: Médiathèque */}
        <button
          onClick={() => onOpenMediaLibrary(blockId)}
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
          <span>Médiathèque ({mediaLibrary.length} image{mediaLibrary.length > 1 ? 's' : ''})</span>
        </button>
      </div>

      {/* Aperçu avec bouton de suppression */}
      {imageUrl && (
        <div style={styles.imagePreview}>
          <img
            src={imageUrl}
            alt="Aperçu"
            style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
            onError={(e) => e.target.style.display = 'none'}
          />
          <button
            onClick={() => onRemoveImage(blockId)}
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
  );
}
