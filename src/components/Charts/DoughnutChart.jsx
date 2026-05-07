import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { doughnutChartOptions, severityColors } from '../../utils/chartConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DoughnutChart({ data, title }) {
    // Handle both array format [{label, value, color}] and object format {key: value}
    let labels, values, colors;

    if (Array.isArray(data)) {
        // Array format
        labels = data.map(item => item.label);
        values = data.map(item => item.value);
        colors = data.map(item => item.color || severityColors[item.label?.toLowerCase()] || '#3b82f6');
    } else {
        // Object format
        labels = Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1));
        values = Object.values(data);
        colors = Object.keys(data).map(key => severityColors[key] || '#3b82f6');
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

    const total = values.reduce((a, b) => a + b, 0);

    return (
        <div className="h-full relative">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            <div className="relative">
                <Doughnut data={chartData} options={doughnutChartOptions} />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-white">{total}</div>
                        <div className="text-xs text-slate-400">Total</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
