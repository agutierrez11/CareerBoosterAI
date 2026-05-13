import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Zap, ExternalLink, BookmarkPlus, RefreshCw } from "lucide-react";

// Análisis táctico basado en el perfil de Antonio
const getAnalysis = (job) => {
  const title = (job.title || "").toLowerCase();
  const company = (job.company_name || job.company || "").toLowerCase();
  
  const pros = [];
  const cons = [];
  
  if (title.includes("manager") || title.includes("director") || title.includes("lead")) pros.push("Nivel de seniority alineado a tu experiencia");
  if (title.includes("sales") || title.includes("business") || title.includes("commercial")) pros.push("Rol comercial B2B — tu zona de dominio");
  if (title.includes("fintech") || title.includes("payment") || title.includes("crypto")) pros.push("Industria Fintech — expertise directo aplicable");
  if (title.includes("latam") || title.includes("mexico") || title.includes("remote")) pros.push("Cobertura regional LATAM — red de contactos activable");
  if (title.includes("product")) pros.push("Rol de producto con impacto en go-to-market");

  if (pros.length < 2) pros.push("Revisa si el rol requiere tu red de contactos en Fintech MX");
  if (pros.length < 3) pros.push("Potencial para aportar experiencia en pagos digitales");

  if (title.includes("junior") || title.includes("associate")) cons.push("Posible sub-nivel vs tu experiencia actual");
  else cons.push("Alta competencia de candidatos regionales");
  cons.push("Valida si el salario está alineado a expectativas $100k+ USD");

  const strategy = title.includes("sales")
    ? "Abre el proceso enviando un mensaje directo al VP of Sales. Menciona tu red en Clip/Fiserv como palanca inmediata."
    : title.includes("product")
    ? "Presenta un mini-caso de éxito en lanzamiento de producto de pagos en menos de 3 slides."
    : "Conecta primero con el Recruiter en LinkedIn y menciona tu experiencia en expansión Fintech LATAM.";

  return { pros: pros.slice(0, 3), cons: cons.slice(0, 2), strategy };
};

const scoreJob = (job) => {
  const text = `${job.title} ${job.tags?.join(" ") || ""} ${job.candidate_required_location || ""}`.toLowerCase();
  let score = 6.0;
  const keywords = ["fintech", "payments", "sales", "manager", "director", "latam", "mexico", "b2b", "remote", "business development", "commercial", "growth", "crypto"];
  keywords.forEach(kw => { if (text.includes(kw)) score += 0.4; });
  return Math.min(score, 10).toFixed(1);
};

export default function JobRadar() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tracked, setTracked] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      // API pública y gratuita de vacantes remotas en Fintech
      const [r1, r2] = await Promise.allSettled([
        fetch("https://remotive.com/api/remote-jobs?search=fintech+sales+manager&limit=20"),
        fetch("https://remotive.com/api/remote-jobs?search=payments+director+latam&limit=10"),
      ]);

      let allJobs = [];
      for (const result of [r1, r2]) {
        if (result.status === "fulfilled" && result.value.ok) {
          const data = await result.value.json();
          allJobs = [...allJobs, ...(data.jobs || [])];
        }
      }

      // Deduplicar y enriquecer con análisis táctico
      const seen = new Set();
      const enriched = allJobs
        .filter(j => {
          if (seen.has(j.id)) return false;
          seen.add(j.id);
          return true;
        })
        .map(j => ({
          company: j.company_name,
          title: j.title,
          url: j.url,
          location: j.candidate_required_location || "Remote",
          score: parseFloat(scoreJob(j)),
          rationale: getAnalysis(j),
          salary: j.salary || null,
          tags: j.tags?.slice(0, 4) || [],
        }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 12);

      setJobs(enriched);
      setLastUpdated(new Date().toLocaleTimeString("es-MX"));
    } catch (e) {
      console.error("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, []);

  const trackJob = (job) => {
    setTracked(prev => [...prev, job.url]);
  };

  return (
    <div className="min-h-screen pt-10 px-8 pb-32">
      {/* HERO */}
      <div className="text-center mb-12">
        <h1 className="text-6xl font-black tracking-tight">
          <span className="text-sky-400">Fintech</span>{" "}
          <span className="text-white">Job</span>{" "}
          <span className="text-amber-500">Radar</span>
        </h1>
        <p className="text-slate-400 text-xl mt-4 font-medium">
          Strategic Intelligence v2.0 — Antonio Gutiérrez Jiménez
        </p>
        {lastUpdated && (
          <p className="text-xs text-slate-600 mt-2">Actualizado: {lastUpdated}</p>
        )}
      </div>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-8 mb-12">
        {[
          { label: "Vacantes en Vivo", value: loading ? "..." : jobs.length },
          { label: "Elite Matches (9+)", value: loading ? "..." : jobs.filter(j => j.score >= 9).length },
          { label: "Trackeadas", value: tracked.length },
        ].map((s, i) => (
          <div key={i} className="stat-box">
            <h3 className="text-xs uppercase tracking-widest text-slate-500 font-bold">{s.label}</h3>
            <div className="text-6xl font-black text-sky-400 mt-4">{s.value}</div>
          </div>
        ))}
      </div>

      {/* EXTERNAL SOURCES */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-400 mb-4 uppercase tracking-widest text-xs">🔗 Fuentes de Búsqueda Directa</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: "RemoteJobsFinder", emoji: "🌐", url: "https://remotejobsfinder.co/en?country=USA&query=fintech+sales+manager", tip: "300k+ vacantes remotas" },
            { name: "LinkedIn Jobs", emoji: "💼", url: "https://www.linkedin.com/jobs/search/?keywords=fintech%20sales%20director%20LATAM&location=Mexico&f_E=4%2C5%2C6", tip: "Roles Senior / Director+" },
            { name: "JobLeads", emoji: "🎯", url: "https://www.jobleads.com/search/jobs?q=sales+director+fintech&l=mexico&salary=100000", tip: "Roles $100k+ USD" },
            { name: "Remotive", emoji: "🛸", url: "https://remotive.com/remote-jobs/sales/fintech", tip: "Fintech remoto global" },
            { name: "Glassdoor", emoji: "🔮", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=fintech+sales+director&locT=N&locId=1&jl=100000&seniority=DIRECTOR", tip: "Salarios + Reviews" },
          ].map((src, i) => (
            <a key={i} href={src.url} target="_blank" rel="noreferrer"
              className="flex items-center gap-3 bg-[#11151f] border border-white/5 hover:border-sky-500/40 p-4 rounded-2xl transition-all group">
              <span className="text-2xl">{src.emoji}</span>
              <div>
                <div className="text-xs font-bold text-white group-hover:text-sky-400 transition-colors">{src.name}</div>
                <div className="text-xs text-slate-500">{src.tip}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* REFRESH BUTTON */}
      <div className="flex justify-end mb-8">
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="flex items-center gap-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/20 px-5 py-3 rounded-full text-sm font-bold transition-all"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          {loading ? "Escaneando mercado..." : "Actualizar Radar"}
        </button>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="text-center py-32 text-slate-500">
          <div className="text-5xl mb-6">🛰️</div>
          <p className="text-lg">Escaneando oportunidades en tiempo real...</p>
        </div>
      )}

      {/* JOB GRID */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {jobs.map((job, i) => (
            <div key={i} className="ultimate-card group">
              <div className="score-circle">{job.score}</div>

              <h3 className="text-2xl font-black text-sky-400 mb-1 pr-16">{job.company}</h3>
              <div className="text-base font-bold text-white mb-1">{job.title}</div>
              <div className="text-xs text-slate-500 mb-4">📍 {job.location}</div>

              {job.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {job.tags.map((tag, ti) => (
                    <span key={ti} className="text-xs bg-white/5 border border-white/5 px-3 py-1 rounded-full text-slate-400">{tag}</span>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-3">
                  <div className="flex items-center gap-1 text-emerald-400 font-bold mb-2 text-xs uppercase">
                    <CheckCircle size={12} /> Por qué SÍ
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {job.rationale.pros.map((p, idx) => <li key={idx}>• {p}</li>)}
                  </ul>
                </div>
                <div className="bg-rose-500/5 border border-rose-500/20 rounded-2xl p-3">
                  <div className="flex items-center gap-1 text-rose-400 font-bold mb-2 text-xs uppercase">
                    <AlertCircle size={12} /> Por qué NO
                  </div>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {job.rationale.cons.map((c, idx) => <li key={idx}>• {c}</li>)}
                  </ul>
                </div>
              </div>

              <div className="bg-sky-500/5 border border-sky-500/10 rounded-2xl p-4 mb-5">
                <div className="flex items-center gap-1 text-sky-400 font-bold mb-1 text-xs uppercase">
                  <Zap size={12} /> Estrategia Táctica
                </div>
                <p className="text-xs text-slate-300 italic">"{job.rationale.strategy}"</p>
              </div>

              <div className="flex gap-3">
                <a
                  href={job.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-sky-500/10 hover:bg-sky-500 text-sky-400 hover:text-black py-4 rounded-2xl font-bold transition-all border border-sky-500/20 text-sm"
                >
                  Ver Vacante <ExternalLink size={16} />
                </a>
                <button
                  onClick={() => trackJob(job)}
                  disabled={tracked.includes(job.url)}
                  className={`px-5 rounded-2xl border transition-all ${
                    tracked.includes(job.url)
                      ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                      : "bg-slate-800 hover:bg-slate-700 text-slate-300 border-white/5"
                  }`}
                >
                  {tracked.includes(job.url) ? <CheckCircle size={20} /> : <BookmarkPlus size={20} />}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
