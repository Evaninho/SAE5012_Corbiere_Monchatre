import React from 'react';
import { Search } from 'lucide-react';

export function SearchBar({ searchTerm, onSearchChange, placeholder = "Rechercher..." }) {
  const sectionStyle = {
    width: '100%',
    padding: '10px',
    marginBottom: '20px',
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    backgroundColor: "#ffffff",
    borderRadius: "10px"
  };

  const searchContainerStyle = {
    position: "relative",
    display: "flex",
    alignItems: "center"
  };

  const searchIconStyle = {
    position: "absolute",
    left: "15px",
    width: "18px",
    color: "#666"
  };

  const inputSearchStyle = {
    height: '44px',
    width: '100%',
    paddingLeft: '40px',
    paddingRight: '15px',
    border: 'none',
    backgroundColor: '#f3f3f3',
    borderRadius: '10px',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s'
  };

  return (
    <section style={sectionStyle}>
      <div style={searchContainerStyle}>
        <Search style={searchIconStyle} size={18} />
        <input
          type="search"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          style={inputSearchStyle}
          onFocus={(e) => e.target.style.backgroundColor = '#e8f5ff'}
          onBlur={(e) => e.target.style.backgroundColor = '#f3f3f3'}
        />
      </div>
    </section>
  );
}
