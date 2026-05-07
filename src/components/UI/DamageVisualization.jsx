/**
 * Damage Visualization Component
 * Displays heatmap/overlay images and damage statistics
 * Based on the 5-class system from main.ipynb
 */

import { motion } from 'framer-motion';
import { DAMAGE_COLORS, DAMAGE_LABELS } from '../../hooks/useAIAnalysis';

export default function DamageVisualization({ statistics, heatmapImage, overlayImage }) {
    if (!statistics) return null;

    const { percentages, counts, severity_score } = statistics;

    // Order for display (excluding background)
    const damageClasses = ['no_damage', 'minor_damage', 'major_damage', 'destroyed'];

    return (
        <div className="space-y-6">
            {/* Images Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div
                    className="glass-dark rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                >
                    <h4 className="text-sm font-medium mb-3 text-slate-300">Damage Heatmap</h4>
                    {heatmapImage ? (
                        <img
                            src={heatmapImage}
                            alt="Damage Heatmap"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-48 rounded-lg bg-gradient-to-br from-green-500/20 via-yellow-500/20 via-orange-500/20 to-red-500/20 flex items-center justify-center border border-slate-600">
                            <div className="text-center">
                                <div className="text-4xl mb-2">🗺️</div>
                                <p className="text-sm text-slate-400">Heatmap unavailable</p>
                                <p className="text-xs text-slate-500">Backend processing required</p>
                            </div>
                        </div>
                    )}
                </motion.div>
                <motion.div
                    className="glass-dark rounded-xl p-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h4 className="text-sm font-medium mb-3 text-slate-300">Damage Overlay</h4>
                    {overlayImage ? (
                        <img
                            src={overlayImage}
                            alt="Damage Overlay"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                    ) : (
                        <div className="w-full h-48 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-600">
                            <div className="text-center">
                                <div className="text-4xl mb-2">🛰️</div>
                                <p className="text-sm text-slate-400">Overlay unavailable</p>
                                <p className="text-xs text-slate-500">Backend processing required</p>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Color Legend */}
            <div className="glass-dark rounded-xl p-4">
                <h4 className="text-sm font-medium mb-4 text-slate-300">Damage Classification Legend</h4>
                <div className="flex flex-wrap gap-4">
                    {damageClasses.map((cls) => (
                        <div key={cls} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: DAMAGE_COLORS[cls] }}
                            />
                            <span className="text-sm text-slate-300">{DAMAGE_LABELS[cls]}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Statistics Breakdown */}
            <div className="glass-dark rounded-xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h4 className="text-lg font-semibold">Damage Distribution</h4>
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-slate-400">Severity Score:</span>
                        <span className={`text-lg font-bold ${severity_score >= 75 ? 'text-red-400' :
                            severity_score >= 50 ? 'text-orange-400' :
                                severity_score >= 25 ? 'text-yellow-400' : 'text-green-400'
                            }`}>
                            {severity_score?.toFixed(1)}%
                        </span>
                    </div>
                </div>

                <div className="space-y-4">
                    {damageClasses.map((cls, index) => (
                        <motion.div
                            key={cls}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 * index }}
                        >
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded"
                                        style={{ backgroundColor: DAMAGE_COLORS[cls] }}
                                    />
                                    <span className="text-sm font-medium">{DAMAGE_LABELS[cls]}</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="text-sm text-slate-400">
                                        {counts?.[cls]?.toLocaleString() || 0} pixels
                                    </span>
                                    <span className="text-sm font-semibold" style={{ color: DAMAGE_COLORS[cls] }}>
                                        {percentages?.[cls]?.toFixed(1) || 0}%
                                    </span>
                                </div>
                            </div>
                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full rounded-full"
                                    style={{ backgroundColor: DAMAGE_COLORS[cls] }}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentages?.[cls] || 0}%` }}
                                    transition={{ duration: 0.8, delay: 0.3 + 0.1 * index }}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <SummaryCard
                    label="Severely Damaged"
                    value={`${((percentages?.destroyed || 0) + (percentages?.major_damage || 0)).toFixed(1)}%`}
                    color="text-red-400"
                    delay={0.5}
                />
                <SummaryCard
                    label="Partially Damaged"
                    value={`${(percentages?.minor_damage || 0).toFixed(1)}%`}
                    color="text-yellow-400"
                    delay={0.6}
                />
                <SummaryCard
                    label="Intact"
                    value={`${(percentages?.no_damage || 0).toFixed(1)}%`}
                    color="text-green-400"
                    delay={0.7}
                />
                <SummaryCard
                    label="Total Pixels Analyzed"
                    value={(statistics?.total_pixels || 0).toLocaleString()}
                    color="text-cyan-400"
                    delay={0.8}
                />
            </div>
        </div>
    );
}

function SummaryCard({ label, value, color, delay }) {
    return (
        <motion.div
            className="glass-dark rounded-xl p-4 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <div className={`text-2xl font-bold ${color} mb-1`}>{value}</div>
            <div className="text-xs text-slate-400">{label}</div>
        </motion.div>
    );
}
