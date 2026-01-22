// src/components/visualizations/ChartRenderer.jsx
import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function ChartRenderer({
  visualization,
  isThumbnail = false
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!visualization?.dataset?.id) {
      setError('Dataset manquant');
      setLoading(false);
      return;
    }

    const loadCSV = async () => {
      try {
        const token = localStorage.getItem('token');

        const res = await fetch(
          `http://localhost:8000/api/datasets/${visualization.dataset.id}/download`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (!res.ok) {
          throw new Error('Erreur chargement dataset');
        }

        const csvText = await res.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const formatted = results.data.map(row => ({
              name: row.label || row.name || Object.values(row)[0],
              value: Number(row.value || Object.values(row)[1])
            }));

            setData(formatted);
            setLoading(false);
          }
        });
      } catch (e) {
        setError(e.message);
        setLoading(false);
      }
    };

    loadCSV();
  }, [visualization]);

  if (loading) return <div style={{ height: isThumbnail ? 120 : 300 }} />;
  if (error) return <p>{error}</p>;

  const height = isThumbnail ? 140 : 300;

  switch (visualization.chartType) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <BarChart data={data}>
            {!isThumbnail && <XAxis dataKey="name" />}
            {!isThumbnail && <YAxis />}
            {!isThumbnail && <Tooltip />}
            <Bar dataKey="value" fill="#0088FE" />
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <LineChart data={data}>
            {!isThumbnail && <XAxis dataKey="name" />}
            {!isThumbnail && <YAxis />}
            {!isThumbnail && <Tooltip />}
            <Line type="monotone" dataKey="value" stroke="#00C49F" />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              outerRadius={isThumbnail ? 50 : 100}
            >
              {data.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            {!isThumbnail && <Tooltip />}
          </PieChart>
        </ResponsiveContainer>
      );

    default:
      return <p>Type de graphique non supporté</p>;
  }
}
