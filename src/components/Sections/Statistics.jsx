import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Target, Image, TrendingUp, MapPin, Clock, AlertTriangle, Building, Users, DollarSign, Ruler } from 'lucide-react';
import { useStatistics } from '../../hooks/useStatistics';
import { useAnalytics } from '../../hooks/useAnalytics';
import StatCard from '../UI/StatCard';
import PieChart from '../Charts/PieChart';
import LineChart from '../Charts/LineChart';
import DoughnutChart from '../Charts/DoughnutChart';
import EventsTable from '../Dashboard/EventsTable';

export default function Statistics() {
    const {
        loading,
        overview,
        disastersByType,
        monthlyData,
        severityDistribution,
        topRegions,
        topDeadliest,
    } = useStatistics();

    const { geographicDistribution } = useAnalytics();

    // Load events data for the events table
    const [events, setEvents] = React.useState([]);

    React.useEffect(() => {
        import('../../data/dashboard_analytics.json')
            .then(data => {
                setEvents(data.default?.detailed_events || data.detailed_events || []);
            })
            .catch(err => console.error('Error loading events:', err));
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-slate-400">Loading statistics...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-20">
            <div className="max-w-7xl mx-auto w-full">
                {/* Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-5xl md:text-6xl font-bold mb-4 font-display bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        Disaster Analytics Dashboard
                    </h2>
                    <p className="text-xl text-slate-300">
                        Data-driven insights from satellite monitoring
                    </p>
                </motion.div>

                {/* KPI Cards - Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <StatCard
                        icon={BarChart3}
                        label="Total Disasters Analyzed"
                        value={overview.totalDisasters || 0}
                        delay={0}
                    />
                    <StatCard
                        icon={Globe}
                        label="Countries Covered"
                        value={overview.countriesCovered || 0}
                        delay={0.1}
                    />
                    <StatCard
                        icon={Target}
                        label="AI Accuracy Rate"
                        value={overview.accuracyRate || 0}
                        suffix="%"
                        delay={0.2}
                    />
                    <StatCard
                        icon={Image}
                        label="Images Processed"
                        value={overview.imagesProcessed || 0}
                        delay={0.3}
                    />
                </div>

                {/* KPI Cards - Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={Building}
                        label="Buildings Analyzed"
                        value={overview.totalBuildings || 0}
                        delay={0.4}
                    />
                    <StatCard
                        icon={Users}
                        label="Total Casualties"
                        value={overview.totalCasualties || 0}
                        delay={0.5}
                    />
                    <StatCard
                        icon={MapPin}
                        label="People Displaced"
                        value={overview.totalDisplaced || 0}
                        delay={0.6}
                    />
                    <StatCard
                        icon={DollarSign}
                        label="Economic Loss"
                        value={`$${overview.totalEconomicLoss || 0}B`}
                        delay={0.7}
                    />
                </div>

                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Timeline Chart */}
                    <motion.div
                        className="glass-dark rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <LineChart
                            data={monthlyData}
                            title="Disaster Timeline (Monthly Distribution)"
                        />
                    </motion.div>

                    {/* Disaster Type Distribution */}
                    <motion.div
                        className="glass-dark rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <PieChart
                            data={disastersByType}
                            title="Disaster Type Distribution"
                        />
                    </motion.div>
                </div>

                {/* Second Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Severity Distribution */}
                    <motion.div
                        className="glass-dark rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <DoughnutChart
                            data={severityDistribution}
                            title="Severity Level Distribution"
                        />
                    </motion.div>

                    {/* Top Affected Regions */}
                    <motion.div
                        className="glass-dark rounded-2xl p-6"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 }}
                    >
                        <h3 className="text-lg font-semibold mb-6">Top Affected Regions</h3>
                        <div className="space-y-4">
                            {topRegions.slice(0, 5).map((region, index) => (
                                <div key={index} className="space-y-2">
                                    <div className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-cyan-400" />
                                            <span className="font-medium">{region.country}</span>
                                        </div>
                                        <span className="text-slate-400">
                                            {region.disasters} disasters | {region.casualties.toLocaleString()} casualties
                                        </span>
                                    </div>
                                    <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${(region.disasters / topRegions[0].disasters) * 100}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Deadliest Disasters */}
                <motion.div
                    className="glass-dark rounded-2xl p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6 }}
                >
                    <h3 className="text-lg font-semibold mb-4">Deadliest Disasters in Dataset</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-700">
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Disaster</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Type</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Country</th>
                                    <th className="text-right py-3 px-4 text-slate-400 font-medium">Casualties</th>
                                    <th className="text-left py-3 px-4 text-slate-400 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topDeadliest.map((disaster, index) => (
                                    <tr key={index} className="border-b border-slate-700/50 hover:bg-white/5">
                                        <td className="py-3 px-4 font-medium">{disaster.name}</td>
                                        <td className="py-3 px-4 capitalize text-slate-300">{disaster.type}</td>
                                        <td className="py-3 px-4 text-slate-300">{disaster.country}</td>
                                        <td className="py-3 px-4 text-right text-red-400 font-semibold">
                                            {disaster.casualties?.toLocaleString() || 0}
                                        </td>
                                        <td className="py-3 px-4 text-slate-400">{disaster.date}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Key Insights */}
                <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                >
                    <div className="glass-dark rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-blue-500/20">
                                <TrendingUp className="w-5 h-5 text-blue-400" />
                            </div>
                            <h4 className="font-semibold">Trend Analysis</h4>
                        </div>
                        <p className="text-sm text-slate-300">
                            The xBD dataset covers {overview.totalDisasters} major disasters from 2016-2019. Hurricanes account for {Math.round((disastersByType.find(d => d.label === 'Hurricanes')?.value || 0) / overview.totalDisasters * 100)}% of analyzed events.
                        </p>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-cyan-500/20">
                                <Clock className="w-5 h-5 text-cyan-400" />
                            </div>
                            <h4 className="font-semibold">Impact Analysis</h4>
                        </div>
                        <p className="text-sm text-slate-300">
                            Total economic losses exceed ${overview.totalEconomicLoss || 0}B USD. Over {(overview.totalDisplaced || 0).toLocaleString()} people were displaced across {overview.countriesCovered} countries.
                        </p>
                    </div>

                    <div className="glass-dark rounded-xl p-6">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="p-2 rounded-lg bg-purple-500/20">
                                <AlertTriangle className="w-5 h-5 text-purple-400" />
                            </div>
                            <h4 className="font-semibold">Building Analysis</h4>
                        </div>
                        <p className="text-sm text-slate-300">
                            {(overview.totalBuildings || 0).toLocaleString()} buildings analyzed across {(overview.imagesProcessed || 0).toLocaleString()} satellite images for damage assessment.
                        </p>
                    </div>
                </motion.div>

                {/* Geographic Distribution - From Dashboard */}
                <motion.div
                    className="glass-dark rounded-2xl p-6 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 }}
                >
                    <h3 className="text-lg font-semibold mb-4">Geographic Distribution by Continent</h3>
                    <div className="space-y-3">
                        {Object.entries(geographicDistribution?.by_continent || {}).map(([continent, data], idx) => (
                            <div key={continent} className="space-y-1">
                                <div className="flex justify-between text-sm">
                                    <span>{continent}</span>
                                    <span className="text-slate-400">{data.count} disasters ({data.percentage}%)</span>
                                </div>
                                <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                    <motion.div
                                        className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${data.percentage}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1, delay: 0.8 + idx * 0.1 }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Events Table - From Dashboard */}
                {events.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.9 }}
                    >
                        <EventsTable events={events} />
                    </motion.div>
                )}
            </div>
        </div >
    );
}
