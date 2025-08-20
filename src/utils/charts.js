// charts.js
import { Chart, ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(ArcElement, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export function renderPieChart(canvas, data) {
  if (!canvas) return;

  // Destroy previous chart instance if exists
  if (canvas._chartInstance) {
    canvas._chartInstance.destroy();
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        data: data.counts,
        backgroundColor: data.colors,
        borderWidth: 2,
        borderColor: '#fff',
      },
    ],
  };

  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(0,0,0,0.9)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 1,
        padding: 10,
        displayColors: false,
        callbacks: {
          label: function(context) {
            const value = context.parsed;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percent = total ? Math.round((value / total) * 100) : 0;
            return `${value} applications (${percent}%)`;
          }
        }
      },
    },
  };

  canvas._chartInstance = new Chart(canvas, {
    type: 'pie',
    data: chartData,
    options: chartOptions,
  });
}

export function renderBarChart(canvas, data) {
  if (!canvas) return;

  // Destroy previous chart instance if exists
  if (canvas._chartInstance) {
    canvas._chartInstance.destroy();
  }

  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: data.label || '',
        data: data.counts,
        backgroundColor: data.colors,
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  canvas._chartInstance = new Chart(canvas, {
    type: 'bar',
    data: chartData,
    options: chartOptions,
  });
}
