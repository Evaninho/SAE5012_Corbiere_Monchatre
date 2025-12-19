import React, { useState, useEffect } from 'react';
import { Search, Filter, TrendingUp, Medal, Trophy, BarChart3 } from 'lucide-react';

export function StatsPage() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtres
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEdition, setSelectedEdition] = useState('all');
  const [selectedSport, setSelectedSport] = useState('all');
  const [sortBy, setSortBy] = useState('total');

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
  }, [selectedEdition, selectedSport, sortBy]);
  fetch('http://localhost:8000/api/datasets?page=1')
    .then(response => {
      console.log(response); // infos HTTP
      return response.json(); // lire les données
    })
    .then(data => {
      console.log(data); // 👈 LES DONNÉES
    })
    .catch(error => console.error(error));
  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (selectedEdition !== 'all') params.append('edition', selectedEdition);
      if (selectedSport !== 'all') params.append('sport', selectedSport);
      params.append('sort', sortBy);

      const response = await fetch(`${API_BASE_URL}/datasets?${params.toString()}`);
      // console.log('Response status:', response.status);

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des statistiques');
      }

      const data = await response.json();
      setStats(data.data || []);

    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filtrer par recherche
  const filteredStats = stats.filter(stat =>
    stat.country?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculer les totaux
  const totalGold = filteredStats.reduce((sum, s) => sum + (s.gold || 0), 0);
  const totalSilver = filteredStats.reduce((sum, s) => sum + (s.silver || 0), 0);
  const totalBronze = filteredStats.reduce((sum, s) => sum + (s.bronze || 0), 0);
  const totalMedals = totalGold + totalSilver + totalBronze;

  if (loading && stats.length === 0) {
    return (
      <div style={styles.pageContainer}>
        <div style={styles.loading}>Chargement des statistiques...</div>
      </div>
    );
  }

  return (
    <div style={styles.pageContainer}>
      <div style={styles.container}>
        {/* En-tête */}
        <div style={styles.header}>
          <h1 style={styles.title}>Statistiques Olympiques</h1>
          <p style={styles.subtitle}>
            Tableau des médailles et performances par pays
          </p>
        </div>

        {/* Cartes de résumé */}
        <div style={styles.summaryCards}>
          <div style={styles.summaryCard}>
            <div style={styles.iconContainer('#FFD700')}>
              <Trophy size={30} color="white" />
            </div>
            <div style={styles.summaryContent}>
              <div style={styles.summaryLabel}>Total Médailles</div>
              <div style={styles.summaryValue}>{totalMedals}</div>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.iconContainer('#FFD700')}>
              <Medal size={30} color="white" />
            </div>
            <div style={styles.summaryContent}>
              <div style={styles.summaryLabel}>Médailles d'Or</div>
              <div style={styles.summaryValue}>{totalGold}</div>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.iconContainer('#C0C0C0')}>
              <Medal size={30} color="white" />
            </div>
            <div style={styles.summaryContent}>
              <div style={styles.summaryLabel}>Médailles d'Argent</div>
              <div style={styles.summaryValue}>{totalSilver}</div>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div style={styles.iconContainer('#CD7F32')}>
              <Medal size={30} color="white" />
            </div>
            <div style={styles.summaryContent}>
              <div style={styles.summaryLabel}>Médailles de Bronze</div>
              <div style={styles.summaryValue}>{totalBronze}</div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div style={styles.filtersContainer}>
          <div style={styles.filtersGrid}>
            {/* Recherche */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Rechercher un pays</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="France, USA..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={styles.input}
                  onFocus={(e) => e.target.style.borderColor = '#0085C7'}
                  onBlur={(e) => e.target.style.borderColor = '#D9D9D9'}
                />
                <Search
                  size={20}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#999'
                  }}
                />
              </div>
            </div>

            {/* Édition */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Édition</label>
              <select
                value={selectedEdition}
                onChange={(e) => setSelectedEdition(e.target.value)}
                style={styles.select}
              >
                <option value="all">Toutes les éditions</option>
                <option value="paris2024">Paris 2024</option>
                <option value="tokyo2020">Tokyo 2020</option>
                <option value="rio2016">Rio 2016</option>
                <option value="london2012">Londres 2012</option>
              </select>
            </div>

            {/* Sport */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Sport</label>
              <select
                value={selectedSport}
                onChange={(e) => setSelectedSport(e.target.value)}
                style={styles.select}
              >
                <option value="all">Tous les sports</option>
                <option value="athletisme">Athlétisme</option>
                <option value="natation">Natation</option>
                <option value="gymnastique">Gymnastique</option>
                <option value="judo">Judo</option>
                <option value="cyclisme">Cyclisme</option>
              </select>
            </div>

            {/* Tri */}
            <div style={styles.filterGroup}>
              <label style={styles.label}>Trier par</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={styles.select}
              >
                <option value="total">Total médailles</option>
                <option value="gold">Médailles d'or</option>
                <option value="silver">Médailles d'argent</option>
                <option value="bronze">Médailles de bronze</option>
              </select>
            </div>
          </div>
        </div>

        {/* Erreur */}
        {error && <div style={styles.error}>{error}</div>}

        {/* Tableau des médailles */}
        {filteredStats.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏅</div>
            <p style={{ fontSize: '18px' }}>Aucune statistique trouvée</p>
          </div>
        ) : (
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead style={styles.thead}>
                <tr>
                  <th style={styles.th}>Rang</th>
                  <th style={styles.th}>Pays</th>
                  <th style={styles.thCenter}>🥇 Or</th>
                  <th style={styles.thCenter}>🥈 Argent</th>
                  <th style={styles.thCenter}>🥉 Bronze</th>
                  <th style={styles.thCenter}>Total</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((stat, index) => (
                  <tr
                    key={stat.id || index}
                    style={styles.tr}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                  >
                    <td style={styles.td}>
                      <div style={styles.rank(index + 1)}>
                        {index + 1}
                      </div>
                    </td>
                    <td style={styles.td}>
                      <div style={styles.country}>
                        <span style={styles.flag}>{stat.flag || '🏳️'}</span>
                        <span>{stat.country || 'Pays inconnu'}</span>
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={styles.medalBadge('gold')}>
                          {stat.gold || 0}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={styles.medalBadge('silver')}>
                          {stat.silver || 0}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <div style={styles.medalBadge('bronze')}>
                          {stat.bronze || 0}
                        </div>
                      </div>
                    </td>
                    <td style={styles.tdCenter}>
                      <div style={styles.total}>
                        {(stat.gold || 0) + (stat.silver || 0) + (stat.bronze || 0)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}