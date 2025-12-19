export function SearchBar({ value, onChange, placeholder = "Rechercher une actualité..." }) {
  
  const styles = {
    container: {
      position: 'relative',
      width: '100%'
    },
    input: {
      width: '100%',
      padding: '12px 45px 12px 15px',
      fontSize: '14px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif',
      transition: 'border-color 0.2s'
    },
    icon: {
      position: 'absolute',
      right: '15px',
      top: '50%',
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      color: '#999'
    }
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.input}
        onFocus={(e) => e.target.style.borderColor = '#0085C7'}
        onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
      />
      {/* <Search size={20} style={styles.icon} /> */}
    </div>
  );
}