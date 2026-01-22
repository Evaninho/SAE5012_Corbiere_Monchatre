import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D'];
const API_BASE = 'http://localhost:8000/api';

/**
 * ChartRenderer - Composant central et unique pour afficher tous les graphiques
 * 
 * Props:
 * - visualization: { id, chartType, config, dataset: { id, name, path }, datasetId }
 * - isThumbnail: boolean (true = affichage miniature, false = affichage complet)
 * - height: nombre (hauteur en pixels)
 */
export default function ChartRenderer({
  visualization,
  isThumbnail = false,
  height = null
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Déterminer la hauteur
  const displayHeight = height || (isThumbnail ? 140 : 300);

  useEffect(() => {
    if (!visualization) {
      setError('Visualisation manquante');
      setLoading(false);
      return;
    }

    loadChartData();
  }, [visualization?.id, visualization?.dataset?.id, visualization?.datasetId]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/ld+json',
      'Accept': 'application/ld+json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const loadChartData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Déterminer l'ID du dataset
      let datasetId = visualization?.dataset?.id || visualization?.datasetId;

      // Si pas d'ID dataset, on essaie de récupérer la viz complète
      if (!datasetId && visualization?.id) {
        try {
          const fullVizResponse = await fetch(
            `${API_BASE}/visualizations/${visualization.id}`,
            { headers: getAuthHeaders() }
          );
          if (fullVizResponse.ok) {
            const fullViz = await fullVizResponse.json();
            datasetId = fullViz?.dataset?.id || fullViz?.datasetId;
          }
        } catch (err) {
          console.warn('Impossible enrichir visualisation:', err);
        }
      }

      if (!datasetId) {
        setError('Dataset non disponible');
        setLoading(false);
        return;
      }

      // Charger le CSV du dataset
      const csvUrl = `${API_BASE}/datasets/${datasetId}/download`;
      const csvResponse = await fetch(csvUrl, {
        headers: getAuthHeaders()
      });

      if (!csvResponse.ok) {
        throw new Error(`Erreur HTTP ${csvResponse.status}: ${csvResponse.statusText}`);
      }

      const csvText = await csvResponse.text();

      // Parser le CSV
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (!results.data || results.data.length === 0) {
            setError('Données CSV vides');
            setLoading(false);
            return;
          }

          // Formater les données pour recharts
          const formatted = results.data.map(row => {
            const obj = {};
            Object.keys(row).forEach(key => {
              const trimmed = row[key]?.toString().trim();
              // Essayer convertir en nombre si possible
              obj[key] = isNaN(trimmed) ? trimmed : Number(trimmed) || trimmed;
            });
            return obj;
          });

          setData(formatted);
          setLoading(false);
        },
        error: (error) => {
          setError('Erreur parsing CSV: ' + error.message);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error('Erreur chargement graphique:', err);
      setError(err.message || 'Erreur inconnue');
      setLoading(false);
    }
  };

  // États de chargement et erreur
  if (loading) {
    return (
      <div style={{
        height: `${displayHeight}px`,
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '12px'
      }}>
        ⏳ Chargement...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{
        height: `${displayHeight}px`,
        backgroundColor: '#fff5f5',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#dc2626',
        fontSize: '12px',
        padding: '10px',
        textAlign: 'center'
      }}>
        ❌ {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div style={{
        height: `${displayHeight}px`,
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#999',
        fontSize: '12px'
      }}>
        Pas de données
      </div>
    );
  }

  // Déterminer les colonnes à afficher (prendre les 2 premières)
  const keys = Object.keys(data[0]);
  const xKey = keys[0];
  const yKey = keys[1] || keys[0];

  // Rendu du graphique selon le type
  const chartType = visualization?.chartType?.toLowerCase() || 'bar';

  switch (chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={displayHeight}>
          <BarChart data={data}>
            {!isThumbnail && <CartesianGrid strokeDasharray="3 3" />}
            {!isThumbnail && <XAxis dataKey={xKey} />}
            {!isThumbnail && <YAxis />}
            {!isThumbnail && <Tooltip />}
            {!isThumbnail && <Legend />}
            <Bar dataKey={yKey} fill="#0088FE" radius={isThumbnail ? 0 : [8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height={displayHeight}>
          <LineChart data={data}>
            {!isThumbnail && <CartesianGrid strokeDasharray="3 3" />}
            {!isThumbnail && <XAxis dataKey={xKey} />}
            {!isThumbnail && <YAxis />}
            {!isThumbnail && <Tooltip />}
            {!isThumbnail && <Legend />}
            <Line
              type="monotone"
              dataKey={yKey}
              stroke="#00C49F"
              dot={!isThumbnail}
              strokeWidth={isThumbnail ? 1 : 2}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={displayHeight}>
          <PieChart>
            <Pie
              data={data}
              dataKey={yKey}
              nameKey={xKey}
              outerRadius={isThumbnail ? 40 : 80}
              label={!isThumbnail}
            >
              {data.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            {!isThumbnail && <Tooltip />}
            {!isThumbnail && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );

    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height={displayHeight}>
          <ScatterChart>
            {!isThumbnail && <CartesianGrid strokeDasharray="3 3" />}
            {!isThumbnail && <XAxis dataKey={xKey} />}
            {!isThumbnail && <YAxis />}
            {!isThumbnail && <Tooltip />}
            {!isThumbnail && <Legend />}
            <Scatter dataKey={yKey} data={data} fill="#FF8042" />
          </ScatterChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div style={{
          height: `${displayHeight}px`,
          backgroundColor: '#f9fafb',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#999',
          fontSize: '12px'
        }}>
          Type '{chartType}' non supporté
        </div>
      );
  }
}
