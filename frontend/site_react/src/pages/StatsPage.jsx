import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Medal, Trophy, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';

export function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState([]);
  const [currentDatasetIndex, setCurrentDatasetIndex] = useState(0);
  const [datasets, setDatasets] = useState([]);
  const [csvLoading, setCsvLoading] = useState(false);
  const [sortBy, setSortBy] = useState('name');

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEdition, setSelectedEdition] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');

  const API_BASE_URL = 'http://localhost:8000/api';

  const styles = {
    pageContainer: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '40px 20px',
      fontFamily: 'Arial, sans-serif'
    },
    container: {
      maxWidth: '1400px',
      margin: '0 auto'
    },
    header: {
      marginBottom: '40px'
    },
    title: {
      fontSize: '36px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '10px'
    },
    subtitle: {
      fontSize: '16px',
      color: '#666'
    },

    // Cartes de résumé
    summaryCards: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    summaryCard: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '25px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    iconContainer: (bgColor) => ({
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      backgroundColor: bgColor,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }),
    summaryContent: {
      flex: 1
    },
    summaryLabel: {
      fontSize: '14px',
      color: '#666',
      marginBottom: '5px'
    },
    summaryValue: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#333'
    },

    // Filtres
    filtersContainer: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    filtersGrid: {
      display: 'grid',
      gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(4, 1fr)',
      gap: '15px'
    },
    filterGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#333'
    },
    input: {
      padding: '12px 15px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      fontSize: '14px',
      width: '100%',
      boxSizing: 'border-box'
    },
    select: {
      padding: '12px 15px',
      border: '1px solid #D9D9D9',
      borderRadius: '10px',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer',
      width: '100%'
    },

    // Tableau
    tableContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      overflow: 'hidden'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    thead: {
      backgroundColor: '#f9fafb'
    },
    th: {
      padding: '15px',
      textAlign: 'left',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      borderBottom: '2px solid #e5e7eb'
    },
    thCenter: {
      padding: '15px',
      textAlign: 'center',
      fontSize: '14px',
      fontWeight: '600',
      color: '#333',
      borderBottom: '2px solid #e5e7eb'
    },
    tr: {
      borderBottom: '1px solid #e5e7eb',
      transition: 'background-color 0.2s'
    },
    td: {
      padding: '15px',
      fontSize: '14px',
      color: '#555'
    },
    tdCenter: {
      padding: '15px',
      textAlign: 'center',
      fontSize: '14px',
      color: '#555'
    },
    rank: (rank) => ({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      backgroundColor: rank <= 3 ? '#FFD700' : '#f3f4f6',
      color: rank <= 3 ? 'white' : '#666',
      fontWeight: 'bold',
      fontSize: '14px'
    }),
    country: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      fontWeight: '600'
    },
    flag: {
      fontSize: '24px'
    },
    medalBadge: (type) => {
      const colors = {
        gold: '#FFD700',
        silver: '#C0C0C0',
        bronze: '#CD7F32'
      };
      return {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        backgroundColor: colors[type],
        fontWeight: 'bold',
        color: 'white',
        fontSize: '14px'
      };
    },
    total: {
      fontWeight: 'bold',
      fontSize: '16px',
      color: '#0085C7'
    },
    loading: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '400px',
      fontSize: '18px',
      color: '#666'
    },
    error: {
      backgroundColor: '#fee2e2',
      border: '2px solid #dc2626',
      borderRadius: '10px',
      padding: '20px',
      textAlign: 'center',
      color: '#dc2626',
      fontWeight: '600'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      color: '#666'
    }
  };

  // Charger les statistiques
  useEffect(() => {
    loadStats();
  }, [selectedEdition, selectedSport]);

  // Charger les données CSV quand le dataset change
  useEffect(() => {
    if (datasets.length > 0) {
      loadCsvData(datasets[currentDatasetIndex].path);
    }
  }, [currentDatasetIndex, datasets]);
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedEdition !== 'all') params.append('edition', selectedEdition);
      if (selectedSport !== 'all') params.append('sport', selectedSport);

      const response = await fetch(`${API_BASE_URL}/datasets?${params.toString()}`);
      console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }

      const data = await response.json();
      console.log('Datasets reçus:', data);
      
      // Extraire les datasets avec le path
      const datasetsWithPath = data.member.map(dataset => ({
        ...dataset,
        path: dataset.path
      }));
      
      console.log('Datasets avec path:', datasetsWithPath);
      setDatasets(datasetsWithPath);
      setStats(datasetsWithPath);
      setCurrentDatasetIndex(0);

    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Charger et parser les données CSV
  const loadCsvData = async (csvPath) => {
    try {
      setCsvLoading(true);
      console.log('Tentative de chargement du CSV:', csvPath);
      
      // Essayer d'abord depuis le backend
      let response = await fetch(`http://localhost:8000/${csvPath}`, {
        mode: 'cors'
      }).catch(() => null);
      
      // Si ça échoue, essayer depuis le dossier public du frontend
      if (!response || !response.ok) {
        console.log('Chargement depuis le backend échoué, essai depuis le frontend...');
        // Extraire le nom du fichier
        const fileName = csvPath.split('/').pop();
        response = await fetch(`/datasets/${fileName}`);
      }
      
      if (!response || !response.ok) {
        console.error('Response status:', response?.status, 'Response OK:', response?.ok);
        throw new Error(`Impossible de charger le fichier CSV. Status: ${response?.status}`);
      }
      
      const text = await response.text();
      console.log('Contenu CSV reçu (premiers 200 chars):', text.substring(0, 200));
      
      const rows = text.trim().split('\n').filter(row => row.trim());
      if (rows.length === 0) {
        throw new Error('Le fichier CSV est vide');
      }
      
      const headers = rows[0].split(',').map(h => h.trim());
      
      const data = rows.slice(1).map((row, rowIndex) => {
        const values = row.split(',').map(v => v.trim());
        const obj = {};
        headers.forEach((header, index) => {
          const value = values[index];
          obj[header] = isNaN(value) ? value : parseFloat(value);
        });
        return obj;
      });
      
      console.log('Données CSV chargées:', data);
      console.log('Nombre de lignes:', data.length);
      setCsvData(data);
    } catch (err) {
      console.error('Erreur chargement CSV:', err);
      setError(`Erreur lors du chargement du CSV: ${err.message}`);
    } finally {
      setCsvLoading(false);
    }
  };

  // Trier les données
  const getSortedData = () => {
    if (csvData.length === 0) return [];
    
    const sorted = [...csvData];
    sorted.sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return bVal - aVal;
      }
      
      return String(aVal).localeCompare(String(bVal));
    });
    
    return sorted;
  };

  // Filtrer par recherche
  const filteredStats = stats.filter(stat =>
    stat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les totaux
  const totalGold = filteredStats.reduce((sum, s) => sum + (s.gold || 0), 0);
  const totalSilver = filteredStats.reduce((sum, s) => sum + (s.silver || 0), 0);
  const totalBronze = filteredStats.reduce((sum, s) => sum + (s.bronze || 0), 0);
  const totalMedals = totalGold + totalSilver + totalBronze;

  const currentDataset = datasets[currentDatasetIndex];
  const sortedCsvData = getSortedData();

  if (loading && stats.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loading}>Chargement des statistiques...</div>
      </div>
    );
  }

  // Styles supplémentaires pour les boutons de navigation
  const buttonStyles = {
    navButton: {
      padding: '10px 20px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'background-color 0.3s'
    },
    navButtonDisabled: {
      padding: '10px 20px',
      backgroundColor: '#ccc',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'not-allowed',
      fontSize: '14px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    datasetNav: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      justifyContent: 'space-between',
      backgroundColor: 'white',
      padding: '20px 25px',
      borderRadius: '15px',
      marginBottom: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      flexWrap: 'wrap'
    },
    datasetInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flex: 1
    },
    datasetTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#0085C7'
    },
    datasetPath: {
      fontSize: '14px',
      color: '#666'
    },
    chartContainer: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    },
    chartTitle: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#0085C7',
      marginBottom: '20px'
    },
    chart: {
      width: '100%',
      height: '400px',
      backgroundColor: '#f9fafb',
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'flex-end',
      justifyContent: 'space-around',
      padding: '20px',
      gap: '10px'
    },
    chartBar: (height, maxHeight) => ({
      flex: 1,
      height: `${Math.max((height / maxHeight) * 350, 20)}px`,
      backgroundColor: '#0085C7',
      borderRadius: '5px 5px 0 0',
      position: 'relative',
      minHeight: '20px',
      cursor: 'pointer',
      transition: 'background-color 0.3s'
    }),
    chartBarLabel: {
      fontSize: '12px',
      color: '#666',
      marginTop: '10px',
      textAlign: 'center',
      width: '100%'
    }
  };

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>Statistiques - Analyse CSV</h1>
          <p style={styles.subtitle}>
            Visualisation et analyse des données des datasets
          </p>
        </div>

        {/* Navigation entre datasets */}
        {datasets.length > 0 && (
          <div style={buttonStyles.datasetNav}>
            <div style={buttonStyles.datasetInfo}>
              <div>
                <div style={buttonStyles.datasetTitle}>
                  {currentDataset?.name || 'Dataset'}
                </div>
                <div style={buttonStyles.datasetPath}>
                  📁 {currentDataset?.path}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setCurrentDatasetIndex(Math.max(0, currentDatasetIndex - 1))}
                style={currentDatasetIndex === 0 ? buttonStyles.navButtonDisabled : buttonStyles.navButton}
                onMouseEnter={(e) => {
                  if (currentDatasetIndex > 0) e.target.style.backgroundColor = '#0073a8';
                }}
                onMouseLeave={(e) => {
                  if (currentDatasetIndex > 0) e.target.style.backgroundColor = '#0085C7';
                }}
                disabled={currentDatasetIndex === 0}
              >
                <ChevronLeft size={20} />
                Précédent
              </button>
              
              <div style={{
                padding: '10px 15px',
                backgroundColor: '#f0f0f0',
                borderRadius: '8px',
                alignSelf: 'center',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                {currentDatasetIndex + 1} / {datasets.length}
              </div>

              <button
                onClick={() => setCurrentDatasetIndex(Math.min(datasets.length - 1, currentDatasetIndex + 1))}
                style={currentDatasetIndex === datasets.length - 1 ? buttonStyles.navButtonDisabled : buttonStyles.navButton}
                onMouseEnter={(e) => {
                  if (currentDatasetIndex < datasets.length - 1) e.target.style.backgroundColor = '#0073a8';
                }}
                onMouseLeave={(e) => {
                  if (currentDatasetIndex < datasets.length - 1) e.target.style.backgroundColor = '#0085C7';
                }}
                disabled={currentDatasetIndex === datasets.length - 1}
              >
                Suivant
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}

        {/* Erreur */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Graphique */}
        {csvLoading ? (
          <div style={styles.chartContainer}>
            <div style={styles.loading}>Chargement du fichier CSV...</div>
          </div>
        ) : sortedCsvData.length > 0 ? (
          <div style={styles.chartContainer}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={styles.chartTitle}>📊 Visualisation graphique</div>
              <div style={styles.filterGroup}>
                <label style={styles.label}>Trier par colonne</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  style={styles.select}
                >
                  {sortedCsvData.length > 0 && Object.keys(sortedCsvData[0]).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <div style={buttonStyles.chart}>
              {sortedCsvData.slice(0, 10).map((item, index) => {
                const numericColumns = Object.values(item).filter(v => typeof v === 'number');
                const maxValue = Math.max(...numericColumns, 1);
                const firstKey = Object.keys(item)[0];
                const value = item[sortBy] || item[firstKey];
                
                return (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div
                      style={buttonStyles.chartBar(value, maxValue)}
                      title={`${firstKey}: ${value}`}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#0073a8'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#0085C7'}
                    />
                    <div style={buttonStyles.chartBarLabel}>{String(item[firstKey]).substring(0, 8)}</div>
                  </div>
                );
              })}
            </div>

            {/* Tableau des données CSV */}
            <div style={{ marginTop: '40px' }}>
              <h3 style={styles.chartTitle}>📋 Données brutes</h3>
              <div style={styles.tableContainer}>
                <table style={styles.table}>
                  <thead style={styles.thead}>
                    <tr>
                      {sortedCsvData.length > 0 && Object.keys(sortedCsvData[0]).map(key => (
                        <th key={key} style={styles.th}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedCsvData.map((row, index) => (
                      <tr
                        key={index}
                        style={styles.tr}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                      >
                        {Object.values(row).map((value, idx) => (
                          <td key={idx} style={styles.td}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <p style={{ fontSize: '18px' }}>Aucune donnée CSV disponible</p>
          </div>
        )}
      </div>
    </div>
  );
}