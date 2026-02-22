import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Radar, Briefcase, MapPin, DollarSign, Clock, ExternalLink, Filter } from 'lucide-react';

const JobRadar = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [urlInput, setUrlInput] = useState('');
    const [optimizationResult, setOptimizationResult] = useState(null);
    const [optimizingId, setOptimizingId] = useState(null);
    const [scores, setScores] = useState({}); // Track scores per job

    const handleUrlSearch = async (e) => {
        e.preventDefault();
        if (!urlInput) return;
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/jobs/custom?url=${encodeURIComponent(urlInput)}`);
            setJobs(response.data);
            setOptimizationResult(null);
        } catch (error) {
            console.error('Error fetching custom URL jobs:', error);
            alert('Failed to scrape URL. The site might be protected.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async (query = '') => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/jobs${query ? `?q=${query}` : ''}`);
            setJobs(response.data);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleOptimization = async (jobId, jobDescription) => {
        setOptimizingId(jobId);
        setOptimizationResult(null);
        try {
            const response = await axios.post('http://localhost:8000/optimize', {
                cv_id: 'default_cv',
                job_id: jobId,
                job_description: jobDescription
            });
            setOptimizationResult({ ...response.data, jobId });
            setScores(prev => ({ ...prev, [jobId]: response.data.match_score }));
        } catch (error) {
            console.error('Error optimizing application:', error);
        } finally {
            setOptimizingId(null);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(searchQuery);
    };

    // Sort jobs by score if available
    const sortedJobs = [...jobs].sort((a, b) => {
        const scoreA = scores[a.id] || 0;
        const scoreB = scores[b.id] || 0;
        return scoreB - scoreA;
    });

    return (
        <div className="space-y-8 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h3 className="text-2xl font-bold">Job Radar</h3>
                    <p className="text-gray-400">Smart matching for Fintech & Remote roles in LATAM</p>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                    <form onSubmit={handleSearch} className="relative w-full md:w-64">
                        <input
                            type="text"
                            placeholder="Keywords..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-[#161922] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                        <Radar className="absolute left-3 top-3 text-gray-500" size={18} />
                    </form>

                    <form onSubmit={handleUrlSearch} className="relative w-full md:w-80">
                        <input
                            type="text"
                            placeholder="Paste Job URL (Jooble, LinkedIn...)"
                            value={urlInput}
                            onChange={(e) => setUrlInput(e.target.value)}
                            className="w-full bg-[#161922] border border-blue-900/30 rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-blue-500 transition-colors text-sm"
                        />
                        <ExternalLink className="absolute left-3 top-3 text-blue-500" size={18} />
                        <button type="submit" className="hidden">Scrape</button>
                    </form>
                </div>
            </div>

            {loading ? (
                <div className="p-20 text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-gray-400">Scanning the horizon for opportunities...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
                    <div className="space-y-6">
                        {sortedJobs.map((job) => (
                            <div key={job.id} className={`bg-[#161922] p-6 rounded-2xl border ${optimizingId === job.id ? 'border-blue-500' : optimizationResult?.jobId === job.id ? 'border-green-500/50' : 'border-gray-800'} hover:border-blue-900/40 transition-all group relative overflow-hidden`}>
                                {/* Subtle background glow on hover */}
                                <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                                <div className="relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-900 rounded-lg flex items-center justify-center border border-gray-800">
                                                <Briefcase className="text-blue-500" size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{job.title}</h4>
                                                <p className="text-gray-400 text-sm">{job.company}</p>
                                            </div>
                                        </div>
                                        {scores[job.id] ? (
                                            <div className="text-right">
                                                <span className="text-xs font-bold px-2.5 py-1 bg-green-900/20 text-green-400 rounded-full border border-green-900/30">
                                                    {scores[job.id]}% MATCH
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-900/30 text-blue-400 rounded-full border border-blue-900/50">
                                                NEW
                                            </span>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-y-3 mb-6">
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <MapPin size={16} />
                                            <span className="truncate">{job.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Clock size={16} />
                                            {job.posted}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {job.tags.map((tag) => (
                                            <span key={tag} className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 bg-gray-900 text-gray-400 rounded border border-gray-800">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <button
                                            onClick={() => handleOptimization(job.id, job.description)}
                                            disabled={optimizingId !== null}
                                            className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white py-2 rounded-xl font-medium transition-all text-sm flex items-center justify-center gap-2"
                                        >
                                            {optimizingId === job.id ? (
                                                <>
                                                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                    Analyzing...
                                                </>
                                            ) : (
                                                'Analyze & Optimize Match'
                                            )}
                                        </button>
                                        <a
                                            href={job.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 border border-gray-800 hover:bg-gray-800 rounded-xl text-gray-400 transition-all"
                                            title="View Original Post"
                                        >
                                            <ExternalLink size={18} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Optimization Sidebar/Drawer */}
                    <div className="space-y-6">
                        {optimizationResult ? (
                            <div className="bg-[#161922] rounded-2xl border border-blue-500/30 p-8 sticky top-8 animate-in fade-in slide-in-from-right-4 duration-500 max-h-[calc(100vh-100px)] overflow-y-auto custom-scrollbar">
                                <div className="flex justify-between items-center mb-6">
                                    <h4 className="text-xl font-bold text-white">AI Analysis</h4>
                                    <div className="text-center">
                                        <div className={`text-3xl font-bold ${optimizationResult.match_score > 70 ? 'text-green-500' : 'text-blue-500'}`}>
                                            {optimizationResult.match_score}%
                                        </div>
                                        <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Match</div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Winning Profile Strategy</p>
                                        <p className="text-sm text-gray-300 italic leading-relaxed bg-gray-900/50 p-4 rounded-xl border border-gray-800">
                                            "{optimizationResult.summary_punchline}"
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Matching Skills Found</p>
                                        <div className="flex flex-wrap gap-2">
                                            {optimizationResult.matching_skills.map(skill => (
                                                <span key={skill} className="px-3 py-1 bg-green-900/10 text-green-400 border border-green-900/30 rounded-lg text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Tailored Experience Rewrites</p>
                                        <div className="space-y-3">
                                            {optimizationResult.suggested_rewrites.map((rewrite, i) => (
                                                <div key={i} className="text-xs bg-gray-900/30 p-4 rounded-xl border border-gray-800">
                                                    <p className="text-gray-500 mb-2 line-through">{rewrite.original}</p>
                                                    <p className="text-blue-300 font-medium">💡 {rewrite.rewritten}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-4">
                                        <a
                                            href={jobs.find(j => j.id === optimizationResult.jobId)?.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-full bg-white text-black py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-gray-200 transition-all"
                                        >
                                            Apply on Company Website
                                            <ExternalLink size={16} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-[400px] border-2 border-dashed border-gray-800 rounded-2xl flex items-center justify-center p-8 text-center sticky top-8">
                                <div className="space-y-4">
                                    <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto border border-gray-800">
                                        <Radar className="text-gray-700 animate-pulse" size={32} />
                                    </div>
                                    <p className="text-gray-500 text-sm max-w-[200px]">Select a job to start the AI matching engine and see your custom strategy.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobRadar;
