// src/components/news/NewsFilters.jsx

import React from 'react';
// import { NEWS_CATEGORIES, SORT_OPTIONS, SORT_LABELS } from '../../utils/constants';

export function NewsFilters({ selectedCategory, onCategoryChange, sortBy, onSortChange }) {
  
  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    section: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    select: {
      padding: '12px 15px',
      fontSize: '14px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontFamily: 'Arial, sans-serif',
      transition: 'border-color 0.2s'
    },
    categoryButtons: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    categoryButton: (isActive) => ({
      padding: '8px 16px',
      border: 'none',
      borderRadius: '20px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      backgroundColor: isActive ? '#0085C7' : '#f3f4f6',
      color: isActive ? 'white' : '#666',
      transition: 'all 0.2s'
    })
  };

  const categories = Object.values(NEWS_CATEGORIES);

  return (
    <div style={styles.container}>
      {/* Catégories */}
      <div style={styles.section}>
        <label style={styles.label}>Catégorie</label>
        <div style={styles.categoryButtons}>
          {categories.map(category => (
            <button
              key={category}
              style={styles.categoryButton(selectedCategory === category)}
              onClick={() => onCategoryChange(category)}
              onMouseEnter={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = '#e0e7ff';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedCategory !== category) {
                  e.currentTarget.style.backgroundColor = '#f3f4f6';
                }
              }}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Tri */}
      <div style={styles.section}>
        <label style={styles.label}>Trier par</label>
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          style={styles.select}
          onFocus={(e) => e.target.style.borderColor = '#0085C7'}
          onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
        >
          {Object.entries(SORT_OPTIONS).map(([key, value]) => (
            <option key={value} value={value}>
              {SORT_LABELS[value]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}