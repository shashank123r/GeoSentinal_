import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { pieChartOptions, disasterColors } from '../../utils/chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function PieChart({ data, title }) {
    // Handle both array format [{label, value, color}] and object format {key: value}
    let labels, values, colors;

    if (Array.isArray(data)) {
        // Array format from useStatistics
        labels = data.map(item => item.label);
        values = data.map(item => item.value);
        colors = data.map(item => item.color || disasterColors[item.label?.toLowerCase()] || '#3b82f6');
    } else {
        // Object format
        labels = Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1));
        values = Object.values(data);
        colors = Object.keys(data).map(key => disasterColors[key] || '#3b82f6');
    }

    const chartData = {
        labels: labels,
        datasets: [
            {
                data: values,
                backgroundColor: colors,
                borderColor: '#1e293b',
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    // Custom options with visible legend
    const options = {
        ...pieChartOptions,
        plugins: {
            ...pieChartOptions.plugins,
            legend: {
                display: true,
                position: 'right',
                labels: {
                    color: '#e2e8f0',
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        size: 12,
                    },
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = Math.round((value / total) * 100);
                        return `${label}: ${value} (${percentage}%)`;
                    },
                },
            },
        },
    };

    return (
        <div className="h-full">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            <Pie data={chartData} options={options} />
        </div>
    );
}
