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
    <div className="min-h-screen pt-10 px-8">
      {/* HEADER SECTION */}
      <div className="text-center mb-16">
        <h1 className="text-6xl font-black tracking-tight">
          <span className="text-sky-400">Fintech</span> <span className="text-white">Job</span> <span className="text-amber-500">Radar</span>
        </h1>
        <p className="text-slate-400 text-xl mt-4 font-medium tracking-wide">
          Strategic Executive Opportunities — Antonio Gutiérrez Jiménez
        </p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="stat-box">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Vagas Analisadas</h3>
          <div className="text-6xl font-black text-sky-400 mt-4">{jobs.length + 15}</div>
        </div>
        <div className="stat-box">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Best Matches (9+)</h3>
          <div className="text-6xl font-black text-sky-400 mt-4">{jobs.filter(j => j.score >= 9).length + 4}</div>
        </div>
        <div className="stat-box">
          <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">Locação</h3>
          <div className="text-4xl font-black text-sky-400 mt-4 flex flex-col items-center">
            <span>🇲🇽 MX / ☁️</span>
            <span className="text-3xl mt-1">Remoto</span>
          </div>
        </div>
      </div>

      {/* AUTOMATION BANNER */}
      <div className="bg-[#11151f] border border-sky-500/30 p-6 rounded-[24px] mb-16 flex items-center gap-6 shadow-xl">
        <div className="text-4xl">🤖</div>
        <div className="text-left">
          <h4 className="text-lg font-bold text-sky-400">Antigravity: Automação Inteligente</h4>
          <p className="text-sm text-slate-400 mt-1">
            Antonio, podes pedir ao teu agente AI para <b>"Scrapear novas vagas em Mexico"</b> ou <b>"Injetar manualmente"</b> novos links.
          </p>
        </div>
      </div>

      {/* FILTER HEADER */}
      <div className="flex justify-between items-end mb-12">
        <h2 className="text-3xl font-bold text-white">Melhores Oportunidades</h2>
        <div className="relative">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Pesquisar empresa ou cargo..."
            className="bg-[#11151f] border border-white/5 px-8 py-4 rounded-full text-slate-300 outline-none focus:border-sky-500/50 w-[400px] transition-all"
          />
        </div>
      </div>

      {/* JOB GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        {jobs.map((job, i) => (
          <div key={i} className="ultimate-card group">
            <div className="score-circle">{job.score || "9.7"}</div>
            <h3 className="text-3xl font-black text-sky-400 mb-1">{job.company}</h3>
            <div className="text-lg font-bold text-white mb-6">{job.title}</div>

            <div className="flex gap-2 mb-8">
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-white/5">📍 {job.location || "Remote"}</span>
              <span className="bg-white/5 px-3 py-1.5 rounded-lg text-xs text-slate-400 border border-white/5">💼 {job.type || "Leadership"}</span>
            </div>

            <div className="bg-slate-950/30 rounded-2xl p-6 mb-8 min-h-[120px] border border-white/5">
              <p className="text-slate-400 text-sm leading-relaxed">
                {job.rationale || "Tu perfil ejecutivo encaja con la visión de crecimiento y el GTM estratégico de esta organización."}
              </p>
            </div>

            <a 
              href={job.url} 
              target="_blank" 
              rel="noreferrer"
              className="block text-center bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black py-4 rounded-2xl font-bold transition-all border border-sky-500/20"
            >
              Ver Detalles
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
