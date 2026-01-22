import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie,
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, Cell, ResponsiveContainer
} from 'recharts';
import Papa from 'papaparse';

const API_BASE = 'http://localhost:8000/api';
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];

/**
 * ChartRenderer - Affiche un graphique à partir d'une visualisation
 * Utilise Papa.parse comme StatsPage.jsx
 */
export function ChartRenderer({ visualization, height = 350 }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    if (!visualization?.config) {
      setError('Configuration manquante');
      setLoading(false);
      return;
    }
    
    loadChartData();
  }, [visualization?.id, visualization?.dataset?.id]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = {
      'Content-Type': 'application/ld+json',
      'Accept': 'application/ld+json'
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
  };

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      let datasetId = visualization?.dataset?.id;
      // console.log(visualization);
      // console.log(visualization?.dataset?.id);
      
      
      // Si pas de dataset.id, on récupère la visualisation complète via l'API
      if (!datasetId && visualization?.id) {
        try {
          const fullVizResponse = await fetch(`${API_BASE}/visualizations/${visualization.id}`, {
            headers: getAuthHeaders()
          });
          
          if (fullVizResponse.ok) {
            const fullViz = await fullVizResponse.json();
            datasetId = fullViz?.dataset?.id || fullViz?.datasetId;
          }
        } catch (enrichError) {
          console.warn('Impossible enrichir visualisation:', enrichError);
        }
      }
      
      if (!datasetId) {
        setError('Pas de dataset disponible');
        setLoading(false);
        return;
      }
      
      console.log(`📥 Chargement du CSV pour datasetId: ${datasetId}`);
      
      // Utiliser l'endpoint /download comme dans StatsPage (évite les problèmes d'URL)
      const csvUrl = `${API_BASE}/datasets/${datasetId}/download`;
      console.log(`📍 URL CSV:`, csvUrl);
      
      // Headers spécifiques pour le téléchargement CSV
      const csvHeaders = {
        'Accept': 'text/csv, text/plain, */*'
      };
      const token = localStorage.getItem('authToken');
      if (token) {
        csvHeaders['Authorization'] = `Bearer ${token}`;
      }
      
      console.log('📤 Headers:', csvHeaders);
      
      const csvResponse = await fetch(csvUrl, {
        headers: csvHeaders
      });

      if (!csvResponse.ok) {
        console.error(`❌ Erreur CSV ${csvResponse.status}:`, csvResponse.statusText);
        console.error('URL tentée:', csvUrl);
        throw new Error(`Erreur chargement CSV: ${csvResponse.status}`);
      }

      console.log('✅ CSV téléchargé avec succès');
      const csvText = await csvResponse.text();
      
      // Parser le CSV avec Papa.parse (comme dans StatsPage)
      Papa.parse(csvText, {
        header: true,
        delimiter: ',',
        dynamicTyping: true,
        skipEmptyLines: true,
        trimHeaders: true,
        transformHeader: (h) => h.trim(),
        complete: (results) => {
          try {
            if (!results.data || results.data.length === 0) {
              setError('Aucune donnée dans le CSV');
              setLoading(false);
              return;
            }

            // Nettoyer les données (trim des clés)
            const trimmedData = results.data.map(row => {
              const newRow = {};
              Object.keys(row).forEach(key => {
                newRow[key.trim()] = row[key];
              });
              return newRow;
            }).filter(row => Object.values(row).some(v => v !== null && v !== ''));

            console.log(`📊 Données parsées: ${trimmedData.length} lignes`);
            setCsvData(trimmedData);
            
            const mapped = mapChartData(trimmedData, visualization.config);
            setChartData(mapped);
            setLoading(false);
          } catch (parseError) {
            console.error('❌ Erreur parsing données:', parseError);
            setError('Erreur parsing CSV');
            setLoading(false);
          }
        },
        error: (err) => {
          console.error('❌ Erreur Papa.parse:', err);
          setError(`Erreur parsing: ${err.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Erreur chargement graphique:', err);
      setError(err.message || 'Erreur');
      setLoading(false);
    }
  };

  const mapChartData = (data, config) => {
    if (!data.length || !config?.xAxis || !config?.yAxis) return [];

    const getDataValue = (row, key) => {
      if (row.hasOwnProperty(key)) return row[key];
      const trimmedKey = Object.keys(row).find(k => k && k.trim() === key?.trim?.());
      return trimmedKey ? row[trimmedKey] : null;
    };

    return data.map(row => {
      const xValue = String(getDataValue(row, config.xAxis) || '').substring(0, 50).trim();
      const yValue = parseFloat(getDataValue(row, config.yAxis)) || 0;
      return {
        name: xValue || '(vide)',
        value: yValue,
        _original: row
      };
    })
      .filter(item => item.name !== '(vide)' || item.value !== 0)
      .slice(0, 100);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
      const data = payload[0].payload;
      return (
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.98)',
          padding: '12px 14px',
          border: '2px solid #FF9800',
          borderRadius: '6px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
          fontSize: '12px'
        }}>
          <p style={{ margin: '3px 0', color: '#333' }}>
            <strong>{visualization.config?.xAxis}:</strong> {data.name}
          </p>
          <p style={{ margin: '3px 0', color: '#FF9800', fontWeight: 'bold' }}>
            <strong>{visualization.config?.yAxis}:</strong> {data.value}
          </p>
        </div>
      );
    }
    return null;
  };

  // États affichage
  if (loading) {
    return (
      <div style={{
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px',
        backgroundColor: '#fafafa',
        borderRadius: '8px'
      }}>
        ⏳ Chargement du graphique...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#dc2626',
        fontSize: '13px',
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        padding: '20px',
        textAlign: 'center'
      }}>
        ❌ {error}
      </div>
    );
  }

  if (!chartData.length) {
    return (
      <div style={{
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '14px',
        backgroundColor: '#fafafa',
        borderRadius: '8px'
      }}>
        📊 Aucune donnée
      </div>
    );
  }

  const config = visualization.config;
  const colors = config?.colors || COLORS;
  const chartType = visualization.chartType;

  const commonProps = {
    width: '100%',
    height: height
  };

  const getDataValue = (row, key) => {
    if (row.hasOwnProperty(key)) return row[key];
    const trimmedKey = Object.keys(row).find(k => k && k.trim() === key?.trim?.());
    return trimmedKey ? row[trimmedKey] : null;
  };

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer {...commonProps}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '11px' }} />
              <YAxis style={{ fontSize: '11px' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255, 152, 0, 0.1)' }} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Bar dataKey="value" name={config?.yAxis || 'Valeur'}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer {...commonProps}>
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} style={{ fontSize: '11px' }} />
              <YAxis style={{ fontSize: '11px' }} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#FF9800', strokeWidth: 2 }} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Line type="monotone" dataKey="value" stroke="#FF9800" name={config?.yAxis || 'Valeur'} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer {...commonProps}>
            <PieChart margin={{ top: 20, right: 30, bottom: 60, left: 20 }}>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="45%"
                cy="45%"
                outerRadius={80}
                label={({ name, value }) => `${name}: ${value}`}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend verticalAlign="bottom" height={30} wrapperStyle={{ paddingTop: '15px' }} />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'scatter':
        return (
          <ResponsiveContainer {...commonProps}>
            <ScatterChart margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="name" style={{ fontSize: '11px' }} />
              <YAxis dataKey="value" style={{ fontSize: '11px' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ paddingTop: '15px' }} />
              <Scatter name={config?.yAxis || 'Valeur'} data={chartData} fill={colors[0]} />
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div style={{
            width: '100%',
            height: `${height}px`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#999'
          }}>
            Type de graphique inconnu: {chartType}
          </div>
        );
    }
  };

  return (
    <div style={{ width: '100%', height: `${height}px` }}>
      {renderChart()}
    </div>
  );
}
