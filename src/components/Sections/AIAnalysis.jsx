import { motion } from 'framer-motion';
import { useApp } from '../../context/AppContext';
import DamageVisualization from '../UI/DamageVisualization';
import { Brain, AlertTriangle, Loader2, BarChart3, Activity } from 'lucide-react';

export default function AIAnalysis() {
    const { analysisResults, isAnalyzing } = useApp();

    // Loading state
    if (isAnalyzing) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <Loader2 className="w-16 h-16 text-cyan-400 animate-spin mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Running AI Analysis</h3>
                    <p className="text-slate-400">Processing satellite imagery with SiamUnet model...</p>
                    <p className="text-sm text-slate-500 mt-2">This may take a few moments</p>
                </motion.div>
            </div>
        );
    }

    // No results state
    if (!analysisResults) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4 py-20">
                <div className="max-w-2xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center">
                            <Brain className="w-12 h-12 text-cyan-400" />
                        </div>
                        <h2 className="text-4xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            AI Damage Analysis
                        </h2>
                        <p className="text-xl text-slate-300 mb-6">
                            Powered by SiamUnet Deep Learning Model
                        </p>
                        <p className="text-slate-400 mb-8">
                            Select a disaster from the Browse or Comparison section and click "Run AI Analysis" to generate damage assessment results using our advanced neural network.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="glass-dark rounded-xl p-4">
                                <Activity className="w-8 h-8 text-green-400 mx-auto mb-2" />
                                <div className="text-sm text-slate-300">5-Class Damage Detection</div>
                            </div>
                            <div className="glass-dark rounded-xl p-4">
                                <BarChart3 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                                <div className="text-sm text-slate-300">Statistical Analysis</div>
                            </div>
                            <div className="glass-dark rounded-xl p-4">
                                <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                                <div className="text-sm text-slate-300">Severity Assessment</div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Results display
    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-7xl mx-auto w-full">
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <h2 className="text-5xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        AI Analysis Results
                    </h2>
                    <p className="text-xl text-slate-300">
                        Damage assessment for <span className="text-cyan-400 font-medium">{analysisResults.disasterName?.replace(/-/g, ' ').replace(/_/g, ' ')}</span>
                    </p>
                </motion.div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {[
                        { label: 'Affected Area', value: `${analysisResults.affectedArea} km²`, icon: '📏', color: 'from-blue-500 to-cyan-500' },
                        { label: 'Severity Level', value: analysisResults.severity, icon: '⚠️', color: getSeverityGradient(analysisResults.severityLevel) },
                        { label: 'Infrastructure Damage', value: `${analysisResults.infrastructureDamage}%`, icon: '🏗️', color: 'from-orange-500 to-red-500' },
                        { label: 'Population Impact', value: analysisResults.populationImpact?.toLocaleString() || '0', icon: '👥', color: 'from-purple-500 to-pink-500' },
                    ].map((kpi, i) => (
                        <motion.div
                            key={i}
                            className="glass-dark rounded-xl p-6"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <div className="text-4xl mb-2">{kpi.icon}</div>
                            <div className={`text-3xl font-bold mb-1 bg-gradient-to-r ${kpi.color} bg-clip-text text-transparent`}>
                                {kpi.value}
                            </div>
                            <div className="text-sm text-slate-400">{kpi.label}</div>
                        </motion.div>
                    ))}
                </div>

                {/* Damage Visualization Component */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <DamageVisualization
                        statistics={analysisResults.statistics}
                        heatmapImage={analysisResults.heatmapImage}
                        overlayImage={analysisResults.overlayImage}
                    />
                </motion.div>

                {/* Detailed Breakdown */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    <motion.div
                        className="glass-dark rounded-xl p-8"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-2xl font-bold mb-6">Infrastructure Damage</h3>
                        <div className="space-y-4">
                            {Object.entries(analysisResults.damage || {}).map(([key, value]) => (
                                <div key={key}>
                                    <div className="flex justify-between mb-2">
                                        <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                        <span className="text-cyan-400">{value}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min(value, 100)}%` }}
                                            transition={{ duration: 1, delay: 0.5 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        className="glass-dark rounded-xl p-8"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                    >
                        <h3 className="text-2xl font-bold mb-6">Key Findings</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start gap-3">
                                <span className="text-red-400 text-xl">●</span>
                                <span className="text-slate-300">
                                    {analysisResults.statistics?.percentages?.destroyed?.toFixed(1) || 0}% of analyzed area shows complete destruction
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-orange-400 text-xl">●</span>
                                <span className="text-slate-300">
                                    {analysisResults.statistics?.percentages?.major_damage?.toFixed(1) || 0}% has major structural damage
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-yellow-400 text-xl">●</span>
                                <span className="text-slate-300">
                                    {analysisResults.statistics?.percentages?.minor_damage?.toFixed(1) || 0}% shows minor damage
                                </span>
                            </li>
                            <li className="flex items-start gap-3">
                                <span className="text-green-400 text-xl">●</span>
                                <span className="text-slate-300">
                                    {analysisResults.statistics?.percentages?.no_damage?.toFixed(1) || 0}% remains intact
                                </span>
                            </li>
                        </ul>

                        <div className="mt-6 p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                            <div className="flex items-center gap-2 mb-2">
                                <AlertTriangle className={`w-5 h-5 ${getSeverityColor(analysisResults.severityLevel)}`} />
                                <span className="font-semibold">Overall Assessment</span>
                            </div>
                            <p className="text-sm text-slate-300">
                                This disaster has been classified as <span className={`font-bold ${getSeverityColor(analysisResults.severityLevel)}`}>{analysisResults.severity}</span> severity based on the SiamUnet damage classification model with a severity score of {analysisResults.statistics?.severity_score?.toFixed(1) || 0}%.
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}

function getSeverityGradient(level) {
    switch (level?.toLowerCase()) {
        case 'critical': return 'from-red-500 to-red-700';
        case 'high': return 'from-orange-500 to-red-500';
        case 'medium': return 'from-yellow-500 to-orange-500';
        default: return 'from-green-500 to-cyan-500';
    }
}

function getSeverityColor(level) {
    switch (level?.toLowerCase()) {
        case 'critical': return 'text-red-400';
        case 'high': return 'text-orange-400';
        case 'medium': return 'text-yellow-400';
        default: return 'text-green-400';
    }
}

