import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import { Upload, BarChart3, TrendingUp, Plus, X, RefreshCw, Trash2 } from 'lucide-react';
import Papa from 'papaparse';
import { Popup } from '../components/Popup';

// ============ CONSTANTES ============
const API_BASE = 'http://localhost:8000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

const AVAILABLE_DATASETS = [
  {
    filename: 'olympics_medals_country_wise.csv',
    name: 'Médailles Olympiques par Pays',
    description: 'Statistiques des médailles depuis 1896 (été et hiver)'
  }
];

const CHART_TYPES = [
  { value: 'bar', label: '📊 Graphique en barres', icon: BarChart3 },
  { value: 'pie', label: '🥧 Camembert', icon: null },
  { value: 'line', label: '📈 Graphique en ligne', icon: TrendingUp },
  { value: 'scatter', label: '⚫ Nuage de points', icon: null }
];

// ============ COMPOSANT PRINCIPAL ============
export default function StatsPage() {
  // État des données
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState({ role: 'ROLE_DATA_PROVIDER' });
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  // État des modales
  const [modals, setModals] = useState({
    register: false,
    createViz: false,
    viewViz: false,
  });
  const [selectedLocalDataset, setSelectedLocalDataset] = useState(null);
  const [selectedViz, setSelectedViz] = useState(null);

  // État du formulaire de visualisation
  const [vizForm, setVizForm] = useState({
    chartType: 'bar',
    xAxis: '',
    yAxis: '',
    colors: COLORS,
    title: ''
  });

  // ========== UTILITAIRES D'AUTHENTIFICATION ==========
  const getToken = () => localStorage.getItem('authToken');

  const getAuthHeaders = () => {
    const token = getToken();
    return {
      'Content-Type': 'application/ld+json',
      'Accept': 'application/ld+json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  // ========== GESTION DES MODALES ==========
  const openModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };

  const closeModal = (modalName) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };

  // ========== CYCLE DE VIE ==========
  useEffect(() => {
    const token = getToken();
    if (!token) {
      console.log('⚠️ Pas de token d\'authentification. Vous devez être connecté.');
      alert('Vous devez être connecté pour accéder à cette page');
      return;
    }
    loadDatasetsFromDB();
  }, []);

  // ========== CHARGEMENT DES DONNÉES ==========
  const loadDatasetsFromDB = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/datasets`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      setDatasets(data['hydra:member'] || []);
    } catch (error) {
      console.error('❌ Erreur chargement datasets:', error);
      alert('Erreur de chargement. Êtes-vous connecté ?');
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCSV = async (filename) => {
    try {
      setLoading(true);
      const response = await fetch(`/datasets/${filename}`);
      const csvText = await response.text();

      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          delimiter: ';',
          dynamicTyping: true,
          skipEmptyLines: true,
          complete: (results) => {
            setCsvData(results.data);
            setCsvHeaders(results.meta.fields || []);
            resolve({ data: results.data, headers: results.meta.fields });
          },
          error: (error) => {
            console.error('❌ Erreur parsing CSV:', error);
            alert('Erreur lors de la lecture du fichier CSV');
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('❌ Erreur chargement CSV:', error);
      alert(`Impossible de charger ${filename}`);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const loadVisualizations = async (datasetId) => {
    try {
      const response = await fetch(`${API_BASE}/datasets/${datasetId}`, {
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error('Erreur chargement visualisations');
      }

      const data = await response.json();
      setVisualizations(data.visualizations || []);
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // ========== INTERACTIONS UTILISATEUR ==========
  const handleSelectDataset = async (dataset) => {
    setSelectedDataset(dataset);
    loadVisualizations(dataset.id);

    const filename = dataset.path.split('/').pop();
    await loadLocalCSV(filename);
  };

  const detectVariableType = (data, columnName) => {
    const sample = data.slice(0, 10).map(row => row[columnName]);
    const hasNumbers = sample.some(val => !isNaN(val) && val !== null && val !== '');
    return hasNumbers ? 'numeric' : 'categorical';
  };

  // ========== ENREGISTREMENT DATASET ==========
  const handleRegisterDataset = async () => {
    if (!selectedLocalDataset) return;

    try {
      setLoading(true);

      const csvResult = await loadLocalCSV(selectedLocalDataset.filename);
      if (!csvResult) return;

      const datasetResponse = await fetch(`${API_BASE}/datasets`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: selectedLocalDataset.name,
          path: `/datasets/${selectedLocalDataset.filename}`,
        })
      });

      if (!datasetResponse.ok) {
        const errorData = await datasetResponse.json();
        throw new Error(errorData.detail || 'Erreur lors de l\'enregistrement du dataset');
      }

      const newDataset = await datasetResponse.json();

      // Créer les variables associées
      for (let i = 0; i < csvResult.headers.length; i++) {
        const header = csvResult.headers[i];
        const type = detectVariableType(csvResult.data, header);

        const varResponse = await fetch(`${API_BASE}/dataset_variables`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            name: header,
            type: type,
            orderIndex: i,
            dataset: `/api/datasets/${newDataset.id}`
          })
        });

        if (!varResponse.ok) {
          console.error(`Erreur création variable ${header}`);
        }
      }

      closeModal('register');
      setSelectedLocalDataset(null);
      loadDatasetsFromDB();
      alert('✅ Dataset enregistré avec succès !');
    } catch (error) {
      console.error('Erreur upload:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de l\'upload du fichier'
      });
    } finally {
      setLoading(false);
    }
  };

  // ========== GESTION VISUALISATIONS ==========
  const handleCreateVisualization = async () => {
    if (!vizForm.xAxis || !vizForm.yAxis) {
      alert('Veuillez sélectionner les variables X et Y');
      return;
    }

    try {
      setLoading(true);

      const config = {
        xAxis: vizForm.xAxis,
        yAxis: vizForm.yAxis,
        colors: vizForm.colors,
        title: vizForm.title
      };

      const response = await fetch(`${API_BASE}/visualizations`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          chartType: vizForm.chartType,
          config: config,
          dataset: `/api/datasets/${selectedDataset.id}`
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Erreur lors de la création de la visualisation');
      }

      const data = await response.json();
      console.log('✅ Visualisation créée:', data);

      closeModal('createViz');
      setVizForm({ chartType: 'bar', xAxis: '', yAxis: '', colors: COLORS, title: '' });
      loadVisualizations(selectedDataset.id);
      alert('✅ Visualisation créée avec succès !');
    } catch (error) {
      console.error('Erreur création visualisation:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: 'Erreur lors de la création de la visualisation'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteVisualization = async (vizId) => {
    if (!window.confirm('⚠️ Êtes-vous sûr de vouloir supprimer cette visualisation ?')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/visualizations/${vizId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (!response.ok) throw new Error('Erreur suppression');

      closeModal('viewViz');
      loadVisualizations(selectedDataset.id);
      alert('✅ Visualisation supprimée');
    } catch (error) {
      console.error('❌ Erreur:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDU GRAPHIQUES ==========
  const renderChart = (viz, data) => {
    const config = viz.config;
    const chartData = data.slice(0, 15).map(row => ({
      name: String(row[config.xAxis] || '').substring(0, 20),
      value: parseFloat(row[config.yAxis]) || 0
    }));

    const commonProps = { width: "100%", height: 400 };

    const charts = {
      bar: (
        <ResponsiveContainer {...commonProps}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#0088FE" name={config.yAxis}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
      pie: (
        <ResponsiveContainer {...commonProps}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={(entry) => `${entry.name}: ${entry.value}`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ),
      line: (
        <ResponsiveContainer {...commonProps}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} name={config.yAxis} />
          </LineChart>
        </ResponsiveContainer>
      ),
      scatter: (
        <ResponsiveContainer {...commonProps}>
          <ScatterChart>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" height={100} />
            <YAxis dataKey="value" />
            <Tooltip />
            <Legend />
            <Scatter data={chartData} fill="#0088FE" name={config.yAxis} />
          </ScatterChart>
        </ResponsiveContainer>
      )
    };

    return charts[viz.chartType] || <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>Type non supporté</div>;
  };

  // ========== OBJETS DE STYLE ==========
  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f8f9fa',
      padding: '30px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    },
    header: {
      backgroundColor: 'white',
      padding: '30px',
      borderRadius: '16px',
      marginBottom: '30px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '20px'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a202c',
      margin: 0,
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    buttonPrimary: {
      padding: '12px 24px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s',
      boxShadow: '0 2px 4px rgba(0,133,199,0.2)'
    },
    buttonSuccess: {
      padding: '12px 24px',
      backgroundColor: '#27ae60',
      color: 'white',
      border: 'none',
      borderRadius: '10px',
      cursor: 'pointer',
      fontSize: '15px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.2s'
    },
    sectionTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    },
    card: {
      backgroundColor: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      border: '1px solid #e2e8f0'
    },
    cardTitle: {
      fontSize: '18px',
      fontWeight: '600',
      color: '#0085C7',
      marginBottom: '12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    cardText: {
      fontSize: '14px',
      color: '#718096',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px',
      backdropFilter: 'blur(4px)'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    modalContentLarge: {
      backgroundColor: 'white',
      borderRadius: '16px',
      padding: '32px',
      maxWidth: '1000px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto',
      boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)'
    },
    modalHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '2px solid #e2e8f0'
    },
    modalTitle: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#1a202c',
      margin: 0
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '15px',
      marginBottom: '16px',
      boxSizing: 'border-box',
      transition: 'border-color 0.2s',
      fontFamily: 'inherit'
    },
    select: {
      width: '100%',
      padding: '14px 16px',
      border: '2px solid #e2e8f0',
      borderRadius: '10px',
      fontSize: '15px',
      marginBottom: '16px',
      backgroundColor: 'white',
      cursor: 'pointer',
      fontFamily: 'inherit'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#2d3748',
      fontSize: '14px'
    },
    infoBox: {
      padding: '16px',
      backgroundColor: '#f7fafc',
      borderRadius: '10px',
      marginBottom: '20px',
      border: '1px solid #e2e8f0'
    },
    emptyState: {
      textAlign: 'center',
      padding: '60px 20px',
      backgroundColor: 'white',
      borderRadius: '12px',
      border: '2px dashed #cbd5e0'
    },
    loadingState: {
      textAlign: 'center',
      padding: '60px',
      color: '#718096'
    }
  };

  // ========== COMPOSANTS DE L'INTERFACE ==========

  // Header principal
  const Header = () => (
    <div style={styles.header}>
      <h1 style={styles.title}>📊 Visualisation de Données JO</h1>
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <button
          style={styles.buttonPrimary}
          onClick={() => openModal('register')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Upload size={20} /> Enregistrer un CSV
        </button>
        <button
          style={styles.buttonSuccess}
          onClick={loadDatasetsFromDB}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#229954'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#27ae60'}
        >
          <RefreshCw size={20} /> Actualiser
        </button>
      </div>
    </div>
  );

  // Liste des datasets
  const DatasetsList = () => (
    <div>
      <h2 style={styles.sectionTitle}>📁 Datasets enregistrés ({datasets.length})</h2>
      {loading && datasets.length === 0 ? (
        <div style={styles.loadingState}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <p style={{ fontSize: '16px' }}>Chargement des datasets...</p>
        </div>
      ) : datasets.length === 0 ? (
        <div style={styles.emptyState}>
          <div style={{ fontSize: '64px', marginBottom: '20px' }}>📦</div>
          <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '24px', fontWeight: '500' }}>
            Aucun dataset enregistré
          </p>
          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px' }}>
            Commencez par enregistrer un fichier CSV depuis public/datasets/
          </p>
          <button style={styles.buttonPrimary} onClick={() => openModal('register')}>
            <Upload size={20} /> Enregistrer votre premier CSV
          </button>
        </div>
      ) : (
        <div style={styles.grid}>
          {datasets.map(dataset => (
            <div
              key={dataset.id}
              style={styles.card}
              onClick={() => handleSelectDataset(dataset)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
              }}
            >
              <h3 style={styles.cardTitle}>{dataset.name}</h3>
              <p style={styles.cardText}>📄 {dataset.path.split('/').pop()}</p>
              <p style={styles.cardText}>📊 {dataset.datasetVariables?.length || 0} variables</p>
              <p style={styles.cardText}>📈 {dataset.visualizations?.length || 0} visualisations</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Section des visualisations
  const VisualizationsSection = () => {
    if (!selectedDataset) return null;

    return (
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <h2 style={styles.sectionTitle}>📈 Visualisations - {selectedDataset.name}</h2>
          <button
            style={styles.buttonPrimary}
            onClick={() => openModal('createViz')}
          >
            <Plus size={20} /> Créer une visualisation
          </button>
        </div>

        {visualizations.length === 0 ? (
          <div style={styles.emptyState}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
            <p style={{ fontSize: '18px', color: '#4a5568', marginBottom: '24px', fontWeight: '500' }}>
              Aucune visualisation créée
            </p>
            <button style={styles.buttonPrimary} onClick={() => openModal('createViz')}>
              <Plus size={20} /> Créer la première visualisation
            </button>
          </div>
        ) : (
          <div style={styles.grid}>
            {visualizations.map(viz => (
              <div
                key={viz.id}
                style={styles.card}
                onClick={() => {
                  setSelectedViz(viz);
                  openModal('viewViz');
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
                }}
              >
                <div style={styles.cardTitle}>
                  {viz.chartType === 'bar' && <BarChart3 size={24} />}
                  {viz.chartType === 'line' && <TrendingUp size={24} />}
                  {viz.config.title || `Graphique ${viz.chartType}`}
                </div>
                <p style={styles.cardText}>
                  📊 Type: {CHART_TYPES.find(ct => ct.value === viz.chartType)?.label.split(' ').pop()}
                </p>
                <p style={styles.cardText}>📍 Variables: {viz.config.xAxis} / {viz.config.yAxis}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Modale d'enregistrement
  const RegisterModal = () => {
    if (!modals.register) return null;

    return (
      <div style={styles.modal} onClick={() => closeModal('register')}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>📤 Enregistrer un CSV local</h2>
            <button
              onClick={() => closeModal('register')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={28} color="#718096" />
            </button>
          </div>

          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', lineHeight: '1.6' }}>
            Sélectionnez un fichier CSV disponible dans{' '}
            <code style={{ backgroundColor: '#f7fafc', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>
              public/datasets/
            </code>
          </p>

          <label style={styles.label}>Fichier CSV disponible</label>
          <select
            style={styles.select}
            value={selectedLocalDataset?.filename || ''}
            onChange={(e) => {
              const selected = AVAILABLE_DATASETS.find(d => d.filename === e.target.value);
              setSelectedLocalDataset(selected);
            }}
          >
            <option value="">Sélectionner un fichier</option>
            {AVAILABLE_DATASETS.map(dataset => (
              <option key={dataset.filename} value={dataset.filename}>
                {dataset.name} ({dataset.filename})
              </option>
            ))}
          </select>

          {selectedLocalDataset && (
            <div style={styles.infoBox}>
              <p style={{ fontSize: '15px', color: '#2d3748', margin: '0 0 8px 0', fontWeight: '600' }}>
                📄 {selectedLocalDataset.name}
              </p>
              <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                {selectedLocalDataset.description}
              </p>
            </div>
          )}

          <button
            onClick={handleRegisterDataset}
            style={{ ...styles.buttonPrimary, width: '100%', justifyContent: 'center', marginTop: '8px' }}
            disabled={loading || !selectedLocalDataset}
          >
            {loading ? '⏳ Enregistrement...' : '✅ Enregistrer dans la BDD'}
          </button>
        </div>
      </div>
    );
  };

  // Modale de création de visualisation
  const CreateVizModal = () => {
    if (!modals.createViz || !selectedDataset) return null;

    return (
      <div style={styles.modal} onClick={() => closeModal('createViz')}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>📊 Créer une visualisation</h2>
            <button
              onClick={() => closeModal('createViz')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={28} color="#718096" />
            </button>
          </div>

          <label style={styles.label}>Titre de la visualisation</label>
          <input
            type="text"
            style={styles.input}
            placeholder="Ex: Médailles d'or par pays"
            value={vizForm.title}
            onChange={(e) => setVizForm({ ...vizForm, title: e.target.value })}
            onFocus={(e) => e.target.style.borderColor = '#0085C7'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />

          <label style={styles.label}>Type de graphique</label>
          <select
            style={styles.select}
            value={vizForm.chartType}
            onChange={(e) => setVizForm({ ...vizForm, chartType: e.target.value })}
          >
            {CHART_TYPES.map(ct => (
              <option key={ct.value} value={ct.value}>
                {ct.label}
              </option>
            ))}
          </select>

          <label style={styles.label}>Variable X (axe horizontal / catégorie)</label>
          <select
            style={styles.select}
            value={vizForm.xAxis}
            onChange={(e) => setVizForm({ ...vizForm, xAxis: e.target.value })}
          >
            <option value="">Sélectionner une variable</option>
            {selectedDataset.datasetVariables?.map(variable => (
              <option key={variable.id} value={variable.name}>
                {variable.name} ({variable.type})
              </option>
            ))}
          </select>

          <label style={styles.label}>Variable Y (axe vertical / valeur numérique)</label>
          <select
            style={styles.select}
            value={vizForm.yAxis}
            onChange={(e) => setVizForm({ ...vizForm, yAxis: e.target.value })}
          >
            <option value="">Sélectionner une variable</option>
            {selectedDataset.datasetVariables?.filter(v => v.type === 'numeric').map(variable => (
              <option key={variable.id} value={variable.name}>
                {variable.name}
              </option>
            ))}
          </select>

          <button
            onClick={handleCreateVisualization}
            style={{ ...styles.buttonPrimary, width: '100%', justifyContent: 'center', marginTop: '16px' }}
            disabled={!vizForm.xAxis || !vizForm.yAxis || loading}
          >
            {loading ? '⏳ Création...' : '✅ Créer la visualisation'}
          </button>
        </div>
      </div>
    );
  };

  // Modale de visualisation
  const ViewVizModal = () => {
    if (!modals.viewViz || !selectedViz) return null;

    return (
      <div style={styles.modal} onClick={() => closeModal('viewViz')}>
        <div style={styles.modalContentLarge} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>{selectedViz.config?.title || 'Visualisation'}</h2>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleDeleteVisualization(selectedViz.id)}
                style={{ ...styles.buttonPrimary, backgroundColor: '#e53e3e', padding: '8px 12px' }}
              >
                <Trash2 size={18} />
              </button>
              <button
                onClick={() => closeModal('viewViz')}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <X size={28} color="#718096" />
              </button>
            </div>
          </div>

          {csvData.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#718096' }}>Aucune donnée chargée</p>
          ) : (
            renderChart(selectedViz, csvData)
          )}
        </div>
      </div>
    );
  };

      {showViewVizModal && selectedViz && csvData.length > 0 && (
        <div style={styles.modal} onClick={() => setShowViewVizModal(false)}>
          <div style={styles.modalContentLarge} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#333', margin: 0 }}>
                {selectedViz.config.title || 'Visualisation'}
              </h2>
              <button onClick={() => setShowViewVizModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            {renderChart(selectedViz, csvData)}

            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
              <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                <strong>Type:</strong> {selectedViz.chartType}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                <strong>Variable X:</strong> {selectedViz.config.xAxis}
              </p>
              <p style={{ fontSize: '14px', color: '#666', margin: '5px 0' }}>
                <strong>Variable Y:</strong> {selectedViz.config.yAxis}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* POPUP */}
      <Popup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
  
}