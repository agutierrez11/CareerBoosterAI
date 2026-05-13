import { useEffect, useState } from "react";
import axios from "axios";
import { CheckCircle, AlertCircle, Zap, ExternalLink, BookmarkPlus } from "lucide-react";

export default function JobRadar() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("Sales Manager fintech mexico");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total_applications: 0, response_rate: "0%", active_interviews: 0 });

  useEffect(() => {
    fetchJobs();
    fetchStats();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/jobs", {
        params: { q: query, location: "Mexico" },
      });
      setJobs(res.data);
    } catch (error) {
      console.error("Radar Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get("/api/stats");
      setStats(res.data);
    } catch (e) { console.log(e); }
  };

  const trackJob = async (job) => {
    try {
      await axios.post("/api/track", {
        company: job.company,
        title: job.title,
        url: job.url,
        score: job.score,
        rationale: job.rationale
      });
      alert("✅ Aplicación guardada en tu base de datos.");
      fetchStats();
    } catch (e) { alert("Error al trackear"); }
  };

  return (
    <div className="min-h-screen pt-10 px-8 pb-32">
      {/* HEADER SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black tracking-tight">
          <span className="text-sky-400">Fintech</span> <span className="text-white">Job</span> <span className="text-amber-500">Radar</span>
        </h1>
        <p className="text-slate-400 text-xl mt-4 font-medium tracking-wide">
          Strategic Intelligence v2.0 — Antonio Gutiérrez Jiménez
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="stat-box">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Aplicaciones Realizadas</h3>
          <div className="text-6xl font-black text-sky-400 mt-4">{stats.total_applications}</div>
        </div>
        <div className="stat-box">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Tasa de Respuesta</h3>
          <div className="text-6xl font-black text-sky-400 mt-4">{stats.response_rate}</div>
        </div>
        <div className="stat-box">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Entrevistas Activas</h3>
          <div className="text-6xl font-black text-sky-400 mt-4">{stats.active_interviews}</div>
        </div>
      </div>

      {/* JOB GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {jobs.map((job, i) => (
          <div key={i} className="ultimate-card group">
            <div className="score-circle">{job.score || "8.5"}</div>
            
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-3xl font-black text-sky-400 mb-1">{job.company}</h3>
                <div className="text-xl font-bold text-white">{job.title}</div>
              </div>
            </div>

            {/* ANALYSIS BOXES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2 text-sm">
                  <CheckCircle size={16} /> PROS
                </div>
                <ul className="text-xs text-slate-400 space-y-1">
                  {(job.rationale?.pros || ["Seniority match", "Fintech expertise", "GTM background"]).map((p,idx) => (
                    <li key={idx}>• {p}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-4">
                <div className="flex items-center gap-2 text-rose-400 font-bold mb-2 text-sm">
                  <AlertCircle size={16} /> CONTRAS
                </div>
                <ul className="text-xs text-slate-400 space-y-1">
                  {(job.rationale?.cons || ["Competitive market", "Remote timezone"]).map((c,idx) => (
                    <li key={idx}>• {c}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 mb-8">
              <div className="flex items-center gap-2 text-sky-400 font-bold mb-2 text-sm uppercase tracking-tighter">
                <Zap size={16} /> Estrategia de Abordaje
              </div>
              <p className="text-xs text-slate-300 italic">
                "{job.rationale?.strategy || "Contactar al Hiring Manager enfocándote en tu experiencia escalando startups de pagos."}"
              </p>
            </div>

            <div className="flex gap-4">
              <a 
                href={job.url} 
                target="_blank" 
                className="flex-1 flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black py-4 rounded-2xl font-bold transition-all border border-sky-500/20"
              >
                Ir a Vacante <ExternalLink size={18} />
              </a>
              <button 
                onClick={() => trackJob(job)}
                className="px-6 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl border border-white/5 transition-all"
                title="Track Application"
              >
                <BookmarkPlus size={22} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
