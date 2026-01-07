import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

function ChartCard({ title, subtitle, trend, chartId, chartConfig, legend }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (chartRef.current && chartConfig) {
      const ctx = chartRef.current.getContext('2d');
      
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      chartInstance.current = new Chart(ctx, chartConfig);
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [chartConfig]);

  return (
    <div className="card chart-card">
      <div className="chart-header">
        <div>
          <div className="chart-title">{title}</div>
          <div className="chart-subtitle">{subtitle}</div>
        </div>
        {trend && (
          <div className="chart-trend">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
              <polyline points="22,7 13.5,15.5 8.5,10.5 2,17"/>
              <polyline points="16,7 22,7 22,13"/>
            </svg>
            {trend}
          </div>
        )}
      </div>
      <div className="chart-container">
        <canvas ref={chartRef} id={chartId}></canvas>
      </div>
      {legend && <div className="chart-legend">{legend}</div>}
    </div>
  );
}

export default ChartCard;