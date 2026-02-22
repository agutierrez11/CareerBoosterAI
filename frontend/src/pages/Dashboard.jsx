import React from 'react';

const Dashboard = () => {
    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Stat Cards */}
                {[
                    { label: 'Analyzed CVs', value: '13', color: 'blue' },
                    { label: 'Active Applications', value: '5', color: 'indigo' },
                    { label: 'Match Rate', value: '82%', color: 'emerald' },
                ].map((stat, i) => (
                    <div key={i} className="bg-[#161922] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all shadow-sm">
                        <p className="text-gray-400 text-sm font-medium mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#161922] p-8 rounded-2xl border border-gray-800">
                    <h3 className="text-xl font-bold mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[1, 2, 3].map((item) => (
                            <div key={item} className="flex items-center gap-4 p-4 rounded-xl bg-gray-900/50 border border-gray-800/50">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                <div>
                                    <p className="text-sm font-medium">Parsed CV: Antonio_Resume_2026.pdf</p>
                                    <p className="text-xs text-gray-500">2 hours ago</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-[#161922] p-8 rounded-2xl border border-gray-800">
                    <h3 className="text-xl font-bold mb-6">Market Trends (Fintech MX)</h3>
                    <div className="space-y-4">
                        <p className="text-gray-400 text-sm">Top trending skills this week:</p>
                        <div className="flex flex-wrap gap-2">
                            {['Python', 'FastAPI', 'AWS', 'Fintech', 'Compliance', 'Product'].map((skill) => (
                                <span key={skill} className="px-3 py-1 rounded-full bg-blue-900/20 text-blue-400 border border-blue-900/50 text-xs font-medium">
                                    {skill}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
