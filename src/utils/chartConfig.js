// Chart.js configuration utilities

export const disasterColors = {
    flood: '#2196F3',
    earthquake: '#795548',
    fire: '#F44336',
    cyclone: '#00BCD4',
    landslide: '#FF9800',
    hurricane: '#9C27B0',
};

export const severityColors = {
    low: '#4CAF50',
    medium: '#FF9800',
    high: '#FF5722',
    critical: '#F44336',
};

export const defaultChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true,
            position: 'bottom',
            labels: {
                color: '#cbd5e1',
                padding: 15,
                font: {
                    size: 12,
                    family: 'Inter, sans-serif',
                },
                usePointStyle: true,
                pointStyle: 'circle',
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
                label: function (context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += context.parsed.y;
                    }
                    return label;
                }
            }
        },
    },
    scales: {
        x: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false,
            },
            ticks: {
                color: '#94a3b8',
                font: {
                    size: 11,
                },
            },
        },
        y: {
            grid: {
                color: 'rgba(255, 255, 255, 0.05)',
                drawBorder: false,
            },
            ticks: {
                color: '#94a3b8',
                font: {
                    size: 11,
                },
            },
        },
    },
};

export const pieChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            display: true,
            position: 'right',
            labels: {
                color: '#cbd5e1',
                padding: 15,
                font: {
                    size: 12,
                },
                usePointStyle: true,
                pointStyle: 'circle',
            },
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            titleColor: '#f1f5f9',
            bodyColor: '#cbd5e1',
            borderColor: 'rgba(255, 255, 255, 0.1)',
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            callbacks: {
                label: function (context) {
                    const label = context.label || '';
                    const value = context.parsed || 0;
                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                    const percentage = ((value / total) * 100).toFixed(1);
                    return `${label}: ${value} (${percentage}%)`;
                }
            }
        },
    },
};

export const barChartOptions = {
    ...defaultChartOptions,
    indexAxis: 'y',
    plugins: {
        ...defaultChartOptions.plugins,
        legend: {
            display: false,
        },
    },
};

export const lineChartOptions = {
    ...defaultChartOptions,
    elements: {
        line: {
            tension: 0.4,
            borderWidth: 2,
        },
        point: {
            radius: 4,
            hoverRadius: 6,
            borderWidth: 2,
            backgroundColor: '#1e293b',
        },
    },
};

export const doughnutChartOptions = {
    ...pieChartOptions,
    cutout: '70%',
};

export const getGradient = (ctx, color1, color2) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, color1);
    gradient.addColorStop(1, color2);
    return gradient;
};
