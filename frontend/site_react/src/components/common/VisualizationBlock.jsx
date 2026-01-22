// src/components/visualizations/VisualizationBlock.jsx
import ChartRenderer from './ChartRenderer';

export default function VisualizationBlock({ visualization }) {
  return (
    <div className="visualization-block">
      <h4>{visualization.title}</h4>
      <ChartRenderer visualization={visualization} />
    </div>
  );
}
