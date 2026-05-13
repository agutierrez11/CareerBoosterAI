import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, Briefcase, MapPin, DollarSign, Clock, ExternalLink, Filter, ShieldCheck, Zap } from 'lucide-react';

const JobRadar = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [optimizationResult, setOptimizationResult] = useState(null);
    const [optimizingId, setOptimizingId] = useState(null);

    // Vercel friendly API path
    const API_BASE = "/api";

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (query = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_BASE}/jobs${query ? `?q=${query}` : ''}`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(searchQuery);
    };

    return (
        <div className="min-h-screen bg-[#020617] text-white p-4 md:p-8 space-y-10">
            {/* Header / Hero Section */}
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 to-black p-8 md:p-12 text-center">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500 rounded-full blur-[120px]"></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500 rounded-full blur-[120px]"></div>
                </div>
                
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tighter bg-gradient-to-r from-sky-400 to-amber-500 bg-clip-text text-transparent mb-4">
                    Job Radar 2026
                </h1>
                <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
                    Strategic Intelligence for Antonio Gutiérrez Jiménez — Fintech & GTM Leadership
                </p>
            </div>

            {/* Stats & Search Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 flex flex-col md:flex-row gap-4">
                    <form onSubmit={handleSearch} className="relative flex-grow">
                        <input
                            type="text"
                            placeholder="Search by company or role..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-slate-900/50 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:border-sky-500 transition-all text-white backdrop-blur-xl"
                        />
                        <Radar className="absolute left-4 top-4 text-sky-500 animate-pulse" size={20} />
                    </form>
                </div>
                <div className="bg-gradient-to-r from-sky-900/20 to-amber-900/20 border border-sky-500/30 rounded-2xl p-4 flex items-center gap-4">
                    <Zap className="text-amber-400" size={24} />
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest text-amber-500">Auto-Inference Active</h4>
                        <p className="text-xs text-slate-400">Filtering based on Toku GTM Profile & 500+ Connections</p>
                    </div>
                </div>
            </div>

            {/* Main Radar Grid */}
            {loading ? (
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                    <p className="text-slate-400 font-medium text-lg">Scanning the horizon for high-impact opportunities...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                    {jobs.map((job) => (
                        <div key={job.id || job.empresa} className="group relative bg-slate-900/40 border border-white/5 rounded-[2rem] p-8 hover:border-sky-500/50 transition-all duration-500 hover:-translate-y-2 backdrop-blur-3xl overflow-hidden">
                            {/* Card Glow Effect */}
                            <div className="absolute -top-24 -right-24 w-48 h-48 bg-sky-500/10 rounded-full blur-[80px] group-hover:bg-sky-500/20 transition-colors"></div>
                            
                            <div className="relative z-10 flex flex-col h-full">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-3xl font-black text-white mb-1">{job.empresa || job.company}</h3>
                                        <p className="text-amber-500 font-bold text-sm tracking-tight">{job.puesto || job.title}</p>
                                    </div>
                                    <div className="bg-slate-950 border border-amber-500/50 px-3 py-2 rounded-2xl text-center">
                                        <span className="block text-2xl font-black text-amber-500">{job.match_score || "NEW"}</span>
                                        <span className="text-[10px] text-slate-500 font-bold uppercase">Match</span>
                                    </div>
                                </div>

                                <div className="space-y-3 mb-8">
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <MapPin size={16} className="text-sky-500" />
                                        <span>{job.location || "MX / LATAM / Remote"}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-slate-400 text-sm">
                                        <Clock size={16} className="text-sky-500" />
                                        <span>May 2026 Update</span>
                                    </div>
                                </div>

                                {job.match_score && (
                                    <div className="bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 mb-8 flex-grow">
                                        <div className="flex items-center gap-2 mb-2">
                                            <ShieldCheck size={14} className="text-sky-400" />
                                            <span className="text-[10px] font-black uppercase text-sky-400 tracking-wider">Tactical Rationale</span>
                                        </div>
                                        <p className="text-sm text-slate-400 leading-relaxed italic">
                                            {job.empresa === "Bitso" ? "Tu liderazgo en Toku enfocado en B2B es el fit exacto para liderar la unidad Business de Bitso." : 
                                             job.empresa === "Binance" ? "Tu expertise en ventas institucionales y pagos LATAM te da una ventaja competitiva masiva." :
                                             "Perfil analizado: match detectado en base a trayectoria en infraestructura de pagos y GTM."}
                                        </p>
                                    </div>
                                )}

                                <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-white text-black hover:bg-sky-500 hover:text-white py-4 rounded-2xl font-black text-center transition-all uppercase tracking-widest text-sm shadow-xl"
                                >
                                    Detonar Aplicación
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <footer className="pt-20 pb-10 text-center border-t border-white/5">
                <p className="text-slate-600 text-sm font-medium">Job Radar © 2026 • Powered by Antigravity OS for Antonio Gutiérrez Jiménez</p>
            </footer>
        </div>
    );
};

export default JobRadar;
