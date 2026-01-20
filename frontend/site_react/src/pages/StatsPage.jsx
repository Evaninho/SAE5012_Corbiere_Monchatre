import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { Upload, BarChart3, TrendingUp, Plus, Eye, X } from 'lucide-react';
import Papa from 'papaparse';
import { Popup } from '../components/Popup';

const API_BASE = 'http://localhost:8000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

export default function OlympicsDataViz() {
  const [datasets, setDatasets] = useState([]);
  const [selectedDataset, setSelectedDataset] = useState(null);
  const [visualizations, setVisualizations] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user] = useState({ role: 'ROLE_DATA_PROVIDER' });
  const [popup, setPopup] = useState({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  });

  const token = localStorage.getItem('token'); // 🔹 JWT récupéré ici

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showCreateVizModal, setShowCreateVizModal] = useState(false);
  const [showViewVizModal, setShowViewVizModal] = useState(false);
  const [selectedViz, setSelectedViz] = useState(null);

  const [uploadForm, setUploadForm] = useState({
    name: '',
    file: null,
    fileName: ''
  });

  const [vizForm, setVizForm] = useState({
    chartType: 'bar',
    xAxis: '',
    yAxis: '',
    colors: COLORS,
    title: ''
  });

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/datasets`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setDatasets(data['hydra:member'] || []);
    } catch (error) {
      console.error('Erreur chargement datasets:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadVisualizations = async (datasetId) => {
    try {
      const response = await fetch(`${API_BASE}/datasets/${datasetId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setVisualizations(data.visualizations || []);
    } catch (error) {
      console.error('Erreur chargement visualisations:', error);
    }
  };

  const loadCSVData = async (datasetPath) => {
    try {
      const response = await fetch(datasetPath, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const csvText = await response.text();
      Papa.parse(csvText, {
        header: true,
        delimiter: ';',
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          setCsvData(results.data);
        }
      });
    } catch (error) {
      console.error('Erreur chargement CSV:', error);
    }
  };

  const handleUploadCSV = async () => {
    if (!uploadForm.file) return;

    const formData = new FormData();
    formData.append('file', uploadForm.file);
    formData.append('name', uploadForm.name);

    try {
      setLoading(true);

      const uploadResponse = await fetch(`${API_BASE}/datasets/upload`, {
        method: 'POST',
        body: formData,
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!uploadResponse.ok) {
        throw new Error('Erreur lors de l\'upload');
      }

      const newDataset = await uploadResponse.json();

      Papa.parse(uploadForm.file, {
        header: true,
        delimiter: ';',
        complete: async (results) => {
          const headers = results.meta.fields;

          for (let i = 0; i < headers.length; i++) {
            const header = headers[i];
            const type = detectVariableType(results.data, header);

            await fetch(`${API_BASE}/dataset_variables`, {
              method: 'POST',
              headers: { 
                'Content-Type': 'application/ld+json',
                'Accept': 'application/ld+json',
                'Authorization': `Bearer ${token}` // 🔹 JWT ajouté
              },
              body: JSON.stringify({
                name: header,
                type: type,
                orderIndex: i,
                dataset: `/api/datasets/${newDataset.id}`
              })
            });
          }

          setShowUploadModal(false);
          setUploadForm({ name: '', file: null, fileName: '' });
          loadDatasets();
        }
      });
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

  const handleCreateVisualization = async () => {
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
        headers: { 
          'Content-Type': 'application/ld+json',
          'Accept': 'application/ld+json',
          'Authorization': `Bearer ${token}` // 🔹 JWT ajouté
        },
        body: JSON.stringify({
          chartType: vizForm.chartType,
          config: config,
          dataset: `/api/datasets/${selectedDataset.id}`
        })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la visualisation');
      }

      setShowCreateVizModal(false);
      setVizForm({ chartType: 'bar', xAxis: '', yAxis: '', colors: COLORS, title: '' });
      loadVisualizations(selectedDataset.id);
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

  const handleSelectDataset = (dataset) => {
    setSelectedDataset(dataset);
    loadVisualizations(dataset.id);
    loadCSVData(dataset.path);
  };

  const renderChart = (viz, data) => {
    const config = viz.config;
    const chartData = data.slice(0, 15).map(row => ({
      name: String(row[config.xAxis] || '').substring(0, 15),
      value: parseFloat(row[config.yAxis]) || 0
    }));

    switch (viz.chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
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
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
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
        );

      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#0088FE" strokeWidth={2} name={config.yAxis} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" type="category" angle={-45} textAnchor="end" height={100} />
              <YAxis dataKey="value" />
              <Tooltip />
              <Legend />
              <Scatter data={chartData} fill="#0088FE" name={config.yAxis} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Type de graphique non supporté</div>;
    }
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f5f5f5',
      padding: '30px'
    },
    header: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '15px',
      marginBottom: '30px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#0085C7',
      margin: 0
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#0085C7',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px',
      marginBottom: '30px'
    },
    card: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    },
    modalContent: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '600px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    modalContentLarge: {
      backgroundColor: 'white',
      borderRadius: '15px',
      padding: '30px',
      maxWidth: '1000px',
      width: '100%',
      maxHeight: '90vh',
      overflow: 'auto'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '15px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '14px',
      marginBottom: '15px',
      backgroundColor: 'white'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '600',
      color: '#333'
    }
  };

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
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📊 Visualisation de Données - Jeux Olympiques</h1>
        {user.role === 'ROLE_DATA_PROVIDER' && (
          <button style={styles.button} onClick={() => setShowUploadModal(true)}>
            <Upload size={20} />
            Importer un CSV
          </button>
        )}
      </div>

      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '22px', marginBottom: '20px', color: '#333' }}>
          📁 Jeux de données disponibles ({datasets.length})
        </h2>
        
        {loading && datasets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Chargement des datasets...
          </div>
        ) : datasets.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Aucun dataset disponible. Importez votre premier fichier CSV !
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
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                }}
              >
                <h3 style={{ fontSize: '18px', marginBottom: '10px', color: '#0085C7' }}>
                  {dataset.name}
                </h3>
                <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
                  📅 Créé le {new Date(dataset.createdAt).toLocaleDateString('fr-FR')}
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  📊 {dataset.datasetVariables?.length || 0} variables
                </p>
                <p style={{ fontSize: '14px', color: '#666' }}>
                  📈 {dataset.visualizations?.length || 0} visualisations
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedDataset && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '22px', color: '#333' }}>
              📈 Visualisations - {selectedDataset.name}
            </h2>
            <button style={styles.button} onClick={() => setShowCreateVizModal(true)}>
              <Plus size={20} />
              Créer une visualisation
            </button>
          </div>

          {visualizations.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', backgroundColor: 'white', borderRadius: '12px' }}>
              <p style={{ color: '#666', marginBottom: '20px' }}>
                Aucune visualisation créée pour ce dataset.
              </p>
              <button style={styles.button} onClick={() => setShowCreateVizModal(true)}>
                <Plus size={20} />
                Créer la première visualisation
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
                    setShowViewVizModal(true);
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {viz.chartType === 'bar' && <BarChart3 size={24} color="#0085C7" />}
                    {viz.chartType === 'line' && <TrendingUp size={24} color="#0085C7" />}
                    <h3 style={{ fontSize: '18px', color: '#333', margin: 0 }}>
                      {viz.config.title || `Graphique ${viz.chartType}`}
                    </h3>
                  </div>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Type: {viz.chartType === 'bar' ? 'Barres' : viz.chartType === 'pie' ? 'Camembert' : viz.chartType === 'line' ? 'Ligne' : 'Nuage de points'}
                  </p>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    Variables: {viz.config.xAxis} / {viz.config.yAxis}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showUploadModal && (
        <div style={styles.modal} onClick={() => setShowUploadModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#333', margin: 0 }}>📤 Importer un fichier CSV</h2>
              <button onClick={() => setShowUploadModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <label style={styles.label}>Nom du dataset</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Ex: Médailles JO 2024"
              value={uploadForm.name}
              onChange={(e) => setUploadForm({ ...uploadForm, name: e.target.value })}
            />

            <label style={styles.label}>Fichier CSV (séparateur: ;)</label>
            <input
              type="file"
              accept=".csv"
              style={styles.input}
              onChange={(e) => setUploadForm({
                ...uploadForm,
                file: e.target.files[0],
                fileName: e.target.files[0]?.name || ''
              })}
            />

            {uploadForm.fileName && (
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '15px' }}>
                📄 Fichier sélectionné: {uploadForm.fileName}
              </p>
            )}

            <button
              onClick={handleUploadCSV}
              style={{ ...styles.button, width: '100%', justifyContent: 'center' }}
              disabled={loading || !uploadForm.name || !uploadForm.file}
            >
              {loading ? 'Upload en cours...' : 'Importer le fichier'}
            </button>
          </div>
        </div>
      )}

      {showCreateVizModal && selectedDataset && (
        <div style={styles.modal} onClick={() => setShowCreateVizModal(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '22px', color: '#333', margin: 0 }}>📊 Créer une visualisation</h2>
              <button onClick={() => setShowCreateVizModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <label style={styles.label}>Titre de la visualisation</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Ex: Médailles par pays"
              value={vizForm.title}
              onChange={(e) => setVizForm({ ...vizForm, title: e.target.value })}
            />

            <label style={styles.label}>Type de graphique</label>
            <select
              style={styles.select}
              value={vizForm.chartType}
              onChange={(e) => setVizForm({ ...vizForm, chartType: e.target.value })}
            >
              <option value="bar">📊 Graphique en barres</option>
              <option value="pie">🥧 Camembert</option>
              <option value="line">📈 Graphique en ligne</option>
              <option value="scatter">⚫ Nuage de points</option>
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

            <label style={styles.label}>Variable Y (axe vertical / valeur)</label>
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
              style={{ ...styles.button, width: '100%', justifyContent: 'center' }}
              disabled={loading || !vizForm.title || !vizForm.xAxis || !vizForm.yAxis}
            >
              {loading ? 'Création en cours...' : 'Créer la visualisation'}
            </button>
          </div>
        </div>
      )}

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
    </div>
  );
}