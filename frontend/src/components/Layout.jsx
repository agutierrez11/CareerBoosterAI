import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    Radar,
    Target,
    Settings,
    ChevronRight
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active }) => (
    <Link
        to={path}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${active
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
    >
        <Icon size={20} className={`${active ? 'text-white' : 'group-hover:text-blue-400'}`} />
        <span className="font-medium">{label}</span>
        {active && <ChevronRight size={16} className="ml-auto" />}
    </Link>
);

const Layout = ({ children }) => {
    const location = useLocation();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
        { icon: FileText, label: 'CV Vault', path: '/vault' },
        { icon: Radar, label: 'Job Radar', path: '/radar' },
        { icon: Target, label: 'Optimizer', path: '/optimizer' },
    ];

    return (
        <div className="flex min-h-screen bg-[#0f1117] text-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 border-r border-gray-800 flex flex-col p-6 sticky top-0 h-screen">
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/20">
                        <Target className="text-white" size={24} />
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">Career<span className="text-blue-500">Booster</span></h1>
                </div>

                <nav className="flex-1 space-y-2">
                    {menuItems.map((item) => (
                        <SidebarItem
                            key={item.path}
                            icon={item.icon}
                            label={item.label}
                            path={item.path}
                            active={location.pathname === item.path}
                        />
                    ))}
                </nav>

                <div className="mt-auto pt-6 border-t border-gray-800">
                    <SidebarItem
                        icon={Settings}
                        label="Settings"
                        path="/settings"
                        active={location.pathname === '/settings'}
                    />
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-20 border-b border-gray-800 flex items-center justify-between px-10 bg-[#0f1117]/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-lg font-semibold text-gray-300">
                        {menuItems.find(m => m.path === location.pathname)?.label || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm font-medium">Antonio</p>
                            <p className="text-xs text-gray-500 uppercase tracking-wider">Premium Plan</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-gray-700 flex items-center justify-center text-white font-bold">
                            A
                        </div>
                    </div>
                </header>

                <div className="p-10 max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
