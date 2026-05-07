/**
 * Enhanced Disaster Popup Component
 * Displays detailed disaster information with damage breakdown, charts, thumbnails, and navigation
 */

import { Calendar, MapPin, Users, Home, DollarSign, AlertTriangle, ExternalLink, TrendingUp } from 'lucide-react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function DisasterPopup({ location, onViewAnalysis, onViewTimeline, onViewAIAnalysis }) {
    const formatNumber = (num) => {
        if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
        if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
        return num.toLocaleString();
    };

    const getSeverityColor = (severity) => {
        const colors = {
            low: ['text-green-400', 'bg-green-500/20', 'border-green-500'],
            medium: ['text-yellow-400', 'bg-yellow-500/20', 'border-yellow-500'],
            high: ['text-orange-400', 'bg-orange-500/20', 'border-orange-500'],
            critical: ['text-red-400', 'bg-red-500/20', 'border-red-500']
        };
        return colors[severity] || ['text-gray-400', 'bg-gray-500/20', 'border-gray-500'];
    };

    const getDamagePercentages = () => {
        if (!location.damageBreakdown) return null;
        const total = location.buildingsAnalyzed || 0;
        if (total === 0) return null;

        const { noDamage, minorDamage, majorDamage, destroyed } = location.damageBreakdown;
        return {
            noDamage: ((noDamage / total) * 100).toFixed(1),
            minorDamage: ((minorDamage / total) * 100).toFixed(1),
            majorDamage: ((majorDamage / total) * 100).toFixed(1),
            destroyed: ((destroyed / total) * 100).toFixed(1)
        };
    };

    const getDamageChartData = () => {
        if (!location.damageBreakdown) return null;
        const { noDamage, minorDamage, majorDamage, destroyed } = location.damageBreakdown;

        return {
            labels: ['No Damage', 'Minor', 'Major', 'Destroyed'],
            datasets: [{
                data: [noDamage, minorDamage, majorDamage, destroyed],
                backgroundColor: [
                    'rgba(34, 197, 94, 0.8)',
                    'rgba(234, 179, 8, 0.8)',
                    'rgba(249, 115, 22, 0.8)',
                    'rgba(239, 68, 68, 0.8)'
                ],
                borderColor: [
                    'rgb(34, 197, 94)',
                    'rgb(234, 179, 8)',
                    'rgb(249, 115, 22)',
                    'rgb(239, 68, 68)'
                ],
                borderWidth: 2
            }]
        };
    };

    const chartOptions = {
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = location.buildingsAnalyzed || 0;
                        const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    const [severityText, severityBg, severityBorder] = getSeverityColor(location.severity);
    const percentages = getDamagePercentages();
    const chartData = getDamageChartData();

    return (
        <div className="min-w-[320px] max-w-[380px] text-slate-900">
            {/* Header */}
            <div className="mb-3">
                <h3 className="font-bold text-lg mb-2 leading-tight">{location.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium uppercase">
                        {location.type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${severityBg} ${severityText} ${severityBorder}`}>
                        {location.severity.toUpperCase()}
                    </span>
                </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm mb-3">
                <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-slate-600" />
                    <div>
                        <div className="font-medium">{location.location}</div>
                        <div className="text-slate-600">{location.country}</div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-600" />
                    <span>{new Date(location.date).toLocaleDateString()}</span>
                </div>

                {location.buildingsAnalyzed > 0 && (
                    <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-slate-600" />
                        <span>{formatNumber(location.buildingsAnalyzed)} buildings analyzed</span>
                    </div>
                )}

                {location.casualties > 0 && (
                    <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-600" />
                        <span>{formatNumber(location.casualties)} casualties</span>
                    </div>
                )}

                {location.displaced > 0 && (
                    <div className="flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-slate-600" />
                        <span>{formatNumber(location.displaced)} displaced</span>
                    </div>
                )}

                {location.economicLoss > 0 && (
                    <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-slate-600" />
                        <span>${location.economicLoss}B economic loss</span>
                    </div>
                )}
            </div>

            {/* Damage Breakdown */}
            {percentages && chartData && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="w-4 h-4 text-slate-600" />
                        <h4 className="font-semibold text-sm">Building Damage Analysis</h4>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        {/* Pie Chart */}
                        <div className="flex items-center justify-center">
                            <div className="w-24 h-24">
                                <Pie data={chartData} options={chartOptions} />
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    <span>No Damage</span>
                                </div>
                                <span className="font-semibold">{percentages.noDamage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                    <span>Minor</span>
                                </div>
                                <span className="font-semibold">{percentages.minorDamage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                                    <span>Major</span>
                                </div>
                                <span className="font-semibold">{percentages.majorDamage}%</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                    <span>Destroyed</span>
                                </div>
                                <span className="font-semibold">{percentages.destroyed}%</span>
                            </div>
                        </div>
                    </div>

                    {location.destructionRate !== undefined && (
                        <div className="mt-3 p-2 bg-slate-100 rounded text-xs">
                            <span className="font-semibold">Destruction Rate:</span> {location.destructionRate}%
                        </div>
                    )}
                </div>
            )}

            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2">
                <button
                    onClick={() => onViewAIAnalysis && onViewAIAnalysis(location)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm hover:from-purple-600 hover:to-pink-600 transition-all flex items-center justify-center gap-2"
                >
                    <span>🤖</span>
                    View AI Analytics
                </button>
                <button
                    onClick={() => onViewTimeline && onViewTimeline(location)}
                    className="w-full px-4 py-2 bg-slate-700 text-white rounded-lg font-medium text-sm hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                >
                    <TrendingUp className="w-4 h-4" />
                    View on Timeline
                </button>
            </div>

            {/* Description */}
            {location.description && (
                <div className="mt-3 pt-3 border-t border-slate-200">
                    <p className="text-xs text-slate-600 line-clamp-2">{location.description}</p>
                </div>
            )}
        </div>
    );
}
