/**
 * Timeline Chart Component
 * Multi-axis line chart for temporal trends
 */

import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function TimelineChart({ data, title }) {
    const chartData = {
        labels: data.years || [],
        datasets: [
            {
                label: 'Disasters',
                data: data.disaster_counts || [],
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
            },
            {
                label: 'Casualties',
                data: data.casualties || [],
                borderColor: '#ef4444',
                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                fill: true,
                tension: 0.4,
                yAxisID: 'y1'
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                position: 'top',
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
                padding: 12
            }
        },
        scales: {
            x: {
                grid: { color: '#334155' },
                ticks: { color: '#cbd5e1' }
            },
            y: {
                type: 'linear',
                position: 'left',
                grid: { color: '#334155' },
                ticks: { color: '#cbd5e1' }
            },
            y1: {
                type: 'linear',
                position: 'right',
                grid: { display: false },
                ticks: { color: '#cbd5e1' }
            }
        }
    };

    return (
        <div className="h-full">
            <h3 className="text-lg font-semibold mb-4">{title}</h3>
            <div className="h-[300px]">
                <Line data={chartData} options={options} />
            </div>
        </div>
    );
}
