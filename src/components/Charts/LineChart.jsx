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
    Filler,
} from 'chart.js';
import { lineChartOptions } from '../../utils/chartConfig';

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

export default function LineChart({ data, title }) {
    // Handle both 'count' and 'value' properties
    const chartData = {
        labels: data.map(item => item.month || item.label),
        datasets: [
            {
                label: 'Total Disasters',
                data: data.map(item => item.value || item.count || 0),
                borderColor: '#06b6d4',
                backgroundColor: 'rgba(6, 182, 212, 0.2)',
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#06b6d4',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6,
            },
        ],
    };

    // Custom options with better Y-axis
    const options = {
        ...lineChartOptions,
        scales: {
            ...lineChartOptions.scales,
            y: {
                ...lineChartOptions.scales?.y,
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                    color: '#94a3b8',
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
            },
            x: {
                ...lineChartOptions.scales?.x,
                ticks: {
                    color: '#94a3b8',
                },
                grid: {
                    color: 'rgba(148, 163, 184, 0.1)',
                },
            },
        },
    };

    return (
        <div className="h-full">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            <Line data={chartData} options={options} />
        </div>
    );
}
