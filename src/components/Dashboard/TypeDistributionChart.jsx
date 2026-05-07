/**
 * Type Distribution Chart Component
 * Interactive pie chart for disaster type breakdown
 */

import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TypeDistributionChart({ data, title }) {
    const chartData = {
        labels: Object.keys(data).map(type => type.charAt(0).toUpperCase() + type.slice(1)),
        datasets: [{
            data: Object.values(data).map(d => d.count),
            backgroundColor: [
                '#8b5cf6', // Hurricane - purple
                '#ef4444', // Fire - red
                '#3b82f6', // Flood - blue
                '#78350f', // Earthquake - brown
            ],
            borderColor: '#1e293b',
            borderWidth: 2
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#cbd5e1',
                    padding: 15,
                    font: { size: 12 }
                }
            },
            tooltip: {
                backgroundColor: '#1e293b',
                titleColor: '#f1f5f9',
                bodyColor: '#cbd5e1',
                borderColor: '#475569',
                borderWidth: 1,
                padding: 12,
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const percentage = data[label.toLowerCase()]?.percentage || 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div className="h-full">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="h-[300px]">
                <Pie data={chartData} options={options} />
            </div>
        </div>
    );
}
