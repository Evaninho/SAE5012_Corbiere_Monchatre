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
const BACKEND_BASE = 'http://localhost:8000';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

// Removed AVAILABLE_DATASETS as we now upload files directly

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
    upload: false,
    createViz: false,
    viewViz: false,
  });
  const [selectedViz, setSelectedViz] = useState(null);

  // État pour l'upload
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadName, setUploadName] = useState('');

  // État du formulaire de visualisation
  const [vizForm, setVizForm] = useState({
    chartType: 'bar',
    xAxis: '',
    yAxis: '',
    colors: COLORS,
    title: ''
  });

  // États pour les contrôles de visualisation
  const [chartRowsLimit, setChartRowsLimit] = useState(15);
  const [chartSortOrder, setChartSortOrder] = useState('none');

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
      const token = getToken();
      console.log('🔐 Token présent:', !!token);
      console.log('🔑 Token valeur:', token ? `${token.substring(0, 20)}...` : 'AUCUN');
      
      const response = await fetch(`${API_BASE}/datasets`, {
        headers: getAuthHeaders()
      });

      console.log('📡 Réponse API /datasets:', response.status, response.ok);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Données reçues de l\'API:', data);
      
      const datasetsWithViz = data.member || data['hydra:member'] || [];
      console.log('📊 Datasets trouvés:', datasetsWithViz.length);
      
      // Charger les visualisations pour chaque dataset
      const datasetsEnriched = await Promise.all(
        datasetsWithViz.map(async (dataset) => {
          try {
            const vizResponse = await fetch(`${API_BASE}/datasets/${dataset.id}`, {
              headers: getAuthHeaders()
            });
            if (vizResponse.ok) {
              const vizData = await vizResponse.json();
              return {
                ...dataset,
                visualizations: vizData.visualizations || []
              };
            }
          } catch (error) {
            console.error(`Erreur chargement visualisations du dataset ${dataset.id}:`, error);
          }
          return dataset;
        })
      );
      
      console.log('✅ Datasets finaux:', datasetsEnriched);
      setDatasets(datasetsEnriched);
    } catch (error) {
      console.error('❌ Erreur chargement datasets:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur de connexion',
        message: 'Impossible de charger les datasets. Êtes-vous connecté ?'
      });
    } finally {
      setLoading(false);
    }
  };

  const loadLocalCSV = async (datasetId, filename) => {
    try {
      setLoading(true);
      console.log(`📥 Chargement du CSV pour le dataset ${datasetId}:`, filename);
      
      // Utiliser l'API pour télécharger le CSV (évite les problèmes CORS)
      const response = await fetch(`${API_BASE}/datasets/${datasetId}/download`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const csvText = await response.text();
      console.log('✅ CSV chargé avec succès');

      return new Promise((resolve) => {
        Papa.parse(csvText, {
          header: true,
          delimiter: ',',
          dynamicTyping: true,
          skipEmptyLines: true,
          trimHeaders: true,  // 🔧 Trim les espaces des en-têtes
          transformHeader: (h) => h.trim(),  // 🔧 Transform les en-têtes aussi
          complete: (results) => {
            // Trim les clés de tous les objets
            const trimmedData = results.data.map(row => {
              const newRow = {};
              Object.keys(row).forEach(key => {
                newRow[key.trim()] = row[key];
              });
              return newRow;
            });
            
            setCsvData(trimmedData);
            const trimmedFields = (results.meta.fields || []).map(f => f.trim());
            setCsvHeaders(trimmedFields);
            console.log(`📊 Données parsées: ${trimmedData.length} lignes, ${trimmedFields.length} colonnes`, trimmedFields);
            resolve({ data: trimmedData, headers: trimmedFields });
          },
          error: (error) => {
            console.error('❌ Erreur parsing CSV:', error);
            resolve(null);
          }
        });
      });
    } catch (error) {
      console.error('❌ Erreur chargement CSV:', error);
      setPopup({
        isOpen: true,
        type: 'error',
        title: 'Erreur',
        message: `Impossible de charger le fichier: ${error.message}`
      });
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
      // Mettre à jour le dataset sélectionné avec les visualisations
      setSelectedDataset(prev => ({
        ...prev,
        visualizations: data.visualizations || []
      }));
    } catch (error) {
      console.error('❌ Erreur:', error);
    }
  };

  // ========== INTERACTIONS UTILISATEUR ==========
  const handleSelectDataset = async (dataset) => {
    console.log('📌 Sélection du dataset:', dataset.name);
    setSelectedDataset(dataset);
    loadVisualizations(dataset.id);

    const filename = dataset.path.split('/').pop();
    await loadLocalCSV(dataset.id, filename);
  };

  const detectVariableType = (data, columnName) => {
    const sample = data.slice(0, 10).map(row => row[columnName]);
    const hasNumbers = sample.some(val => !isNaN(val) && val !== null && val !== '');
    return hasNumbers ? 'numeric' : 'categorical';
  };

  // ========== UPLOAD DATASET ==========
  const handleUploadDataset = async () => {
    if (!uploadFile || !uploadName.trim()) {
      alert('Veuillez sélectionner un fichier et saisir un nom');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', uploadFile);
      formData.append('name', uploadName.trim());

      const response = await fetch(`${API_BASE}/datasets/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'upload');
      }

      const data = await response.json();
      console.log('✅ Dataset uploadé:', data);

      closeModal('upload');
      setUploadFile(null);
      setUploadName('');
      loadDatasetsFromDB();
      alert('✅ Dataset uploadé avec succès !');
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
    
    // Trouver les vraies clés dans les données (trim les espaces)
    const getDataValue = (row, key) => {
      // Chercher d'abord la clé exacte
      if (row.hasOwnProperty(key)) {
        return row[key];
      }
      // Si pas trouvée, chercher en trimant les espaces
      const trimmedKey = Object.keys(row).find(k => k.trim() === key.trim());
      return trimmedKey ? row[trimmedKey] : null;
    };
    
    // Mapper les données avec validation et trim des clés
    // Important: on traite TOUTES les données d'abord, puis on trie, puis on limite
    let chartData = data.map(row => {
      const xValue = String(getDataValue(row, config.xAxis) || '').substring(0, 25).trim();
      const yValue = parseFloat(getDataValue(row, config.yAxis)) || 0;
      return {
        name: xValue || '(vide)',
        value: yValue,
        _original: row
      };
    }).filter(item => item.name !== '(vide)' || item.value !== 0);

    // Appliquer le tri
    if (chartSortOrder === 'asc') {
      chartData = chartData.sort((a, b) => a.value - b.value);
    } else if (chartSortOrder === 'desc') {
      chartData = chartData.sort((a, b) => b.value - a.value);
    }

    // Limiter le nombre de données affichées selon la sélection de l'utilisateur
    chartData = chartData.slice(0, chartRowsLimit);

    // Hauteur dynamique : minimum 400px, puis ajustée selon le nombre de lignes
    const dynamicHeight = Math.max(400, 200 + chartData.length * 20);

    console.log('📊 Chart Data:', { 
      xAxis: config.xAxis, 
      yAxis: config.yAxis,
      rowsLimit: chartRowsLimit,
      sortOrder: chartSortOrder,
      firstEntry: chartData[0],
      dataCount: chartData.length,
      dynamicHeight
    });

    const commonProps = { width: "100%", height: dynamicHeight };

    // Tooltip personnalisé pour tous les graphiques
    const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        const dataPoint = payload[0];
        // Accès aux données originales du chartData via payload[0].payload
        const originalData = dataPoint.payload;
        
        return (
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.98)',
            padding: '14px 16px',
            border: '3px solid #0088FE',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}>
            <p style={{ margin: '6px 0', fontWeight: 'bold', color: '#1a202c', fontSize: '14px' }}>
              📍 {config.xAxis}: <span style={{ color: '#0088FE' }}>{originalData.name}</span>
            </p>
            <p style={{ margin: '6px 0', color: '#2d3748', fontWeight: '600', fontSize: '14px' }}>
              📊 {config.yAxis}: <strong style={{ color: '#FF8042', fontSize: '16px' }}>{originalData.value}</strong>
            </p>
          </div>
        );
      }
      return null;
    };

    const charts = {
      bar: (
        <ResponsiveContainer {...commonProps}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              style={{ fontSize: '12px' }}
            />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 136, 254, 0.1)' }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              verticalAlign="top"
              height={36}
            />
            <Bar dataKey="value" fill="#0088FE" name={config.yAxis || 'Valeur'}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ),
      pie: (
        <ResponsiveContainer {...commonProps}>
          <PieChart margin={{ top: 20, right: 30, bottom: 80, left: 0 }}>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="40%"
              cy="45%"
              outerRadius={110}
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={true}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={config.colors[index % config.colors.length]} />
              ))}
            </Pie>
            <Tooltip 
              content={<CustomTooltip />}
              formatter={(value) => `${config.yAxis}: ${value}`}
              labelFormatter={(label) => `${config.xAxis}: ${label}`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ),
      line: (
        <ResponsiveContainer {...commonProps}>
          <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              style={{ fontSize: '12px' }}
            />
            <YAxis style={{ fontSize: '12px' }} />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#0088FE', strokeWidth: 2 }} />
            <Legend 
              wrapperStyle={{ paddingTop: '20px' }}
              verticalAlign="top"
              height={36}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#0088FE" 
              strokeWidth={3}
              dot={{ fill: '#0088FE', r: 5 }}
              activeDot={{ r: 7, fill: '#FF8042' }}
              name={config.yAxis || 'Valeur'}
            />
          </LineChart>
        </ResponsiveContainer>
      ),
      scatter: (
        <ResponsiveContainer {...commonProps}>
          <ScatterChart margin={{ top: 20, right: 30, left: 0, bottom: 80 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="name" 
              type="category" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              dataKey="value"
              style={{ fontSize: '12px' }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0, 136, 254, 0.1)' }} />
            <Legend 
              verticalAlign="top"
              height={36}
              wrapperStyle={{ paddingTop: '20px' }}
            />
            <Scatter 
              data={chartData} 
              fill="#0088FE" 
              name={config.yAxis || 'Valeur'}
              shape="circle"
            />
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
          onClick={() => openModal('upload')}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <Upload size={20} /> Uploader un CSV
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
            Vérifiez que vous êtes connecté et que des datasets existent en base de données.
          </p>
          <div style={{ marginBottom: '16px', padding: '12px', backgroundColor: '#edf2f7', borderRadius: '8px', borderLeft: '4px solid #4299e1' }}>
            <p style={{ fontSize: '12px', color: '#2d3748', margin: 0 }}>
              💡 Ouvrez la console (F12) pour voir les messages de debug
            </p>
          </div>
          <button 
            style={styles.buttonPrimary} 
            onClick={() => {
              console.log('🔄 Rechargement manuel des datasets...');
              loadDatasetsFromDB();
            }}
          >
            🔄 Recharger les datasets
          </button>
          <button style={{ ...styles.buttonPrimary, marginLeft: '10px', backgroundColor: '#48bb78' }} onClick={() => openModal('upload')}>
            <Upload size={20} /> Uploader un CSV
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

    const vizList = selectedDataset.visualizations || [];

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

        {vizList.length === 0 ? (
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
            {vizList.map(viz => (
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

  // Modale d'upload
  const UploadModal = () => {
    if (!modals.upload) return null;

    return (
      <div style={styles.modal} onClick={() => closeModal('upload')}>
        <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <div style={styles.modalHeader}>
            <h2 style={styles.modalTitle}>📤 Uploader un CSV</h2>
            <button
              onClick={() => closeModal('upload')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}
            >
              <X size={28} color="#718096" />
            </button>
          </div>

          <p style={{ fontSize: '14px', color: '#718096', marginBottom: '24px', lineHeight: '1.6' }}>
            Sélectionnez un fichier CSV à uploader. Le fichier sera stocké dans{' '}
            <code style={{ backgroundColor: '#f7fafc', padding: '2px 6px', borderRadius: '4px', fontSize: '13px' }}>
              public/datasets/
            </code>
          </p>

          <label style={styles.label}>Nom du dataset</label>
          <input
            type="text"
            style={styles.input}
            placeholder="Ex: Médailles Olympiques"
            value={uploadName}
            onChange={(e) => setUploadName(e.target.value)}
            onFocus={(e) => e.target.style.borderColor = '#0085C7'}
            onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
          />

          <label style={styles.label}>Fichier CSV</label>
          <input
            type="file"
            accept=".csv"
            style={styles.input}
            onChange={(e) => setUploadFile(e.target.files[0])}
          />

          {uploadFile && (
            <div style={styles.infoBox}>
              <p style={{ fontSize: '15px', color: '#2d3748', margin: '0 0 8px 0', fontWeight: '600' }}>
                📄 {uploadFile.name}
              </p>
              <p style={{ fontSize: '14px', color: '#718096', margin: 0 }}>
                Taille: {(uploadFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
          )}

          <button
            onClick={handleUploadDataset}
            style={{ ...styles.buttonPrimary, width: '100%', justifyContent: 'center', marginTop: '8px' }}
            disabled={loading || !uploadFile || !uploadName.trim()}
          >
            {loading ? '⏳ Upload...' : '✅ Uploader le CSV'}
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

          {/* Contrôles pour l'affichage du graphique */}
          <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', padding: '16px', backgroundColor: '#f7fafc', borderRadius: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div>
              <label style={{ fontWeight: '600', color: '#2d3748', marginRight: '8px', fontSize: '14px' }}>
                📊 Nombre de lignes:
              </label>
              <select
                value={chartRowsLimit}
                onChange={(e) => setChartRowsLimit(parseInt(e.target.value))}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #cbd5e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                <option value={15}>Top 15</option>
                <option value={30}>Top 30</option>
                <option value={50}>Top 50</option>
                <option value={100}>Top 100</option>
                <option value={9999}>Toutes les données ({csvData.length})</option>
              </select>
            </div>

            <div>
              <label style={{ fontWeight: '600', color: '#2d3748', marginRight: '8px', fontSize: '14px' }}>
                📈 Tri:
              </label>
              <select
                value={chartSortOrder}
                onChange={(e) => setChartSortOrder(e.target.value)}
                style={{
                  padding: '8px 12px',
                  border: '2px solid #cbd5e0',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  backgroundColor: 'white'
                }}
              >
                <option value="none">Aucun tri</option>
                <option value="asc">Croissant ↑</option>
                <option value="desc">Décroissant ↓</option>
              </select>
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

      {ViewVizModal && selectedViz && csvData.length > 0 && (
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

  return (
    <div style={styles.container}>
      <Header />
      <DatasetsList />
      <VisualizationsSection />
      <UploadModal />
      <CreateVizModal />
      <ViewVizModal />
      <Popup
        isOpen={popup.isOpen}
        onClose={() => setPopup({ ...popup, isOpen: false })}
        type={popup.type}
        title={popup.title}
        message={popup.message}
      />
    </div>
  );
}
