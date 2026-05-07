/**
 * Events Table Component
 * Sortable, filterable table with CSV export
 */

import { useState } from 'react';
import { ArrowUpDown, Download, Search } from 'lucide-react';

export default function EventsTable({ events }) {
    const [sortField, setSortField] = useState('date');
    const [sortDirection, setSortDirection] = useState('desc');
    const [searchTerm, setSearchTerm] = useState('');

    const handleSort = (field) => {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    const sortedEvents = [...events].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];
        const modifier = sortDirection === 'asc' ? 1 : -1;

        if (typeof aVal === 'string') {
            return aVal.localeCompare(bVal) * modifier;
        }
        return (aVal - bVal) * modifier;
    });

    const filteredEvents = sortedEvents.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const exportCSV = () => {
        const headers = ['Name', 'Type', 'Severity', 'Date', 'Location', 'Casualties', 'Displaced', 'Economic Loss'];
        const rows = filteredEvents.map(e => [
            e.name,
            e.type,
            e.severity,
            e.date,
            e.location,
            e.casualties,
            e.displaced,
            e.economic_loss
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'disaster_events.csv';
        a.click();
    };

    const getTypeColor = (type) => {
        const colors = {
            hurricane: 'bg-purple-500/20 text-purple-300',
            fire: 'bg-red-500/20 text-red-300',
            flood: 'bg-blue-500/20 text-blue-300',
            earthquake: 'bg-yellow-500/20 text-yellow-300'
        };
        return colors[type] || 'bg-gray-500/20 text-gray-300';
    };

    return (
        <div className="glass-dark rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold">Disaster Events</h3>
                <div className="flex gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search events..."
                            className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                        />
                    </div>
                    <button
                        onClick={exportCSV}
                        className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 rounded-lg transition-colors text-sm font-medium"
                    >
                        <Download className="w-4 h-4" />
                        Export CSV
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-slate-700">
                            {['name', 'type', 'severity', 'date', 'location', 'casualties'].map(field => (
                                <th
                                    key={field}
                                    onClick={() => handleSort(field)}
                                    className="px-4 py-3 text-left text-sm font-medium text-slate-300 cursor-pointer hover:text-cyan-400 transition-colors"
                                >
                                    <div className="flex items-center gap-2">
                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                        <ArrowUpDown className="w-3 h-3" />
                                    </div>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEvents.map((event, idx) => (
                            <tr key={idx} className="border-b border-slate-700/50 hover:bg-slate-700/30 transition-colors">
                                <td className="px-4 py-3 text-sm">{event.name}</td>
                                <td className="px-4 py-3">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(event.type)}`}>
                                        {event.type.toUpperCase()}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-sm capitalize">{event.severity}</td>
                                <td className="px-4 py-3 text-sm">{new Date(event.date).toLocaleDateString()}</td>
                                <td className="px-4 py-3 text-sm">{event.location}</td>
                                <td className="px-4 py-3 text-sm">{event.casualties.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-4 text-sm text-slate-400">
                Showing {filteredEvents.length} of {events.length} events
            </div>
        </div>
    );
}
