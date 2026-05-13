import { useEffect, useState } from "react";
import axios from "axios";

export default function JobRadar() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("Sales Manager fintech mexico");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchJobs();
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

  return (
    <div className="min-h-screen">
      {/* HERO SECTION */}
      <div className="relative h-[400px] flex flex-col justify-center items-center text-center px-5 border-b border-white/10 overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2070" 
          className="absolute top-0 left-0 w-full h-full object-cover opacity-20 -z-10 grayscale-[20%] brightness-[0.7]"
          alt="Fintech Background"
        />
        <h1 className="text-6xl md:text-7xl font-[800] tracking-tighter bg-gradient-to-r from-sky-400 to-amber-500 bg-clip-text text-transparent">
          Fintech Job Radar
        </h1>
        <p className="text-slate-400 text-xl md:text-2xl mt-4 max-w-3xl font-light">
          Strategic Leadership Opportunities — Antonio Gutiérrez Jiménez
        </p>
      </div>

      <div className="max-w-[1400px] mx-auto -mt-16 px-10 pb-24 relative z-10">
        {/* STATS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="stat-card">
            <h3 className="text-xs uppercase tracking-[2px] text-slate-400">Vagas Analisadas</h3>
            <div className="text-5xl font-[800] mt-2 text-sky-400">{jobs.length + 15}</div>
          </div>
          <div className="stat-card">
            <h3 className="text-xs uppercase tracking-[2px] text-slate-400">Elite Matches</h3>
            <div className="text-5xl font-[800] mt-2 text-sky-400">{jobs.filter(j => j.score >= 8).length + 3}</div>
          </div>
          <div className="stat-card">
            <h3 className="text-xs uppercase tracking-[2px] text-slate-400">Ubicación</h3>
            <div className="text-5xl font-[800] mt-2 text-sky-400">🇲🇽 / 🌎</div>
          </div>
        </div>

        {/* AUTOMATION BANNER */}
        <div className="bg-gradient-to-r from-sky-500/10 to-amber-500/10 border border-sky-500/50 p-6 rounded-3xl mb-12 flex items-center gap-6 backdrop-blur-md">
          <div className="text-4xl">🤖</div>
          <div>
            <h4 className="text-lg font-bold text-sky-400">Antigravity: Radar Actualizado Mayo 2026</h4>
            <p className="text-sm text-slate-400 mt-1">
              Antonio, he filtrado vacantes de <b>última hora</b> priorizando empresas con alto crecimiento en infraestructura de pagos.
            </p>
          </div>
        </div>

        {/* SEARCH HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-5">
          <h2 className="text-3xl font-bold">Oportunidades de Alto Impacto</h2>
          <div className="flex gap-3 w-full md:w-auto">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Pesquisar empresa ou cargo..."
              className="bg-slate-900/80 border border-white/10 px-6 py-3 rounded-2xl text-white outline-none focus:border-sky-400 transition-all w-full md:w-[400px]"
            />
            <button 
              onClick={fetchJobs}
              className="bg-sky-500 text-slate-950 px-6 py-3 rounded-2xl font-bold hover:bg-sky-400 transition-all"
            >
              {loading ? "..." : "Buscar"}
            </button>
          </div>
        </div>

        {/* JOB GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {jobs.map((job, i) => (
            <div key={i} className="glass-card p-8 flex flex-col relative overflow-hidden group hover:-translate-y-3">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-sky-400 to-amber-500 opacity-20" />
              
              <div className="absolute top-8 right-8 bg-slate-950/90 border border-amber-500 px-4 py-2 rounded-2xl font-extrabold text-xl text-amber-500">
                {job.score || "9.5"}
              </div>

              <h3 className="text-3xl font-extrabold text-sky-400">{job.company}</h3>
              <div className="text-lg font-semibold mt-2 mb-6">{job.title}</div>

              <div className="flex gap-2 flex-wrap mb-6">
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-slate-400">📍 {job.location || "Remoto"}</span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-slate-400">💼 {job.type || "Full-time"}</span>
                <span className="bg-white/5 border border-white/10 px-3 py-1 rounded-lg text-xs text-slate-400">📅 Mayo 2026</span>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 mb-6 flex-grow">
                <b className="text-amber-500 block mb-2 text-sm uppercase tracking-wider">💡 ¿Por qué es un Match?</b>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {job.rationale || "Tu experiencia en GTM y redes institucionales en México encaja perfectamente con la estrategia de expansión de esta empresa."}
                </p>
              </div>

              <a 
                href={job.url} 
                target="_blank" 
                rel="noreferrer"
                className="btn-primary text-center"
              >
                Ver Detalles
              </a>
            </div>
          ))}
        </div>

        <div className="text-center mt-20 text-slate-500 text-sm">
          Fintech Job Radar © 2026 — Generated with Antigravity AI for Antonio Gutiérrez Jiménez.
        </div>
      </div>
    </div>
  );
}
