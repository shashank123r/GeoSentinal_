import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { barChartOptions } from '../../utils/chartConfig';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

export default function BarChart({ data, title, horizontal = false }) {
    const labels = Object.keys(data).map(key => key.charAt(0).toUpperCase() + key.slice(1));
    const values = Object.values(data);

    const chartData = {
        labels,
        datasets: [
            {
                label: title || 'Data',
                data: values,
                backgroundColor: 'rgba(6, 182, 212, 0.8)',
                borderColor: '#06b6d4',
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const options = horizontal ? barChartOptions : {
        ...barChartOptions,
        indexAxis: 'x',
    };

    return (
        <div className="h-full">
            {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
            <Bar data={chartData} options={options} />
        </div>
    );
}
