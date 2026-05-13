import { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Zap, ExternalLink, BookmarkPlus, RefreshCw } from "lucide-react";

//// ── Keywords exactos del perfil de Antonio ────────────────────────────────
const PROFILE_KW = [
  "sales", "business development", "payments", "fintech", "latam", "mexico",
  "antifraude", "anti-fraud", "fraud", "crossborder", "cross-border", "acquiring",
  "kyc", "aml", "gtm", "growth", "manager", "director", "head", "general manager",
  "country manager", "commercial", "revenue", "account", "bdm", "bd",
];

const scoreJob = (job) => {
  const text = `${job.title} ${job.company} ${job.tags?.join(" ") || ""} ${job.location || ""}`.toLowerCase();
  let score = 6.0;
  PROFILE_KW.forEach(kw => { if (text.includes(kw)) score += 0.45; });
  if (text.includes("mexico") || text.includes("méxico")) score += 1.5;
  if (text.includes("latam") || text.includes("latin america")) score += 1.2;
  if (text.includes("remote") || text.includes("remoto") || text.includes("worldwide")) score += 0.8;
  if (text.includes("head") || text.includes("general manager") || text.includes("director")) score += 0.8;
  return Math.min(score, 10).toFixed(1);
};

const getAnalysis = (job) => {
  const title = (job.title || "").toLowerCase();
  const pros = [];
  const cons = [];

  if (title.includes("head") || title.includes("general manager") || title.includes("director") || title.includes("regional")) pros.push("Nivel de liderazgo alineado a tu seniority");
  if (title.includes("sales") || title.includes("business development") || title.includes("growth") || title.includes("commercial")) pros.push("Rol comercial B2B — tu zona de dominio");
  if (title.includes("payment") || title.includes("fintech") || title.includes("crypto") || title.includes("fx")) pros.push("Industria de pagos/Fintech — expertise directo");
  if (title.includes("latam") || title.includes("mexico") || title.includes("remote")) pros.push("Cobertura LATAM/México remoto — tu red activable");
  if (title.includes("fraud") || title.includes("antifraude") || title.includes("risk") || title.includes("kyc")) pros.push("Antifraude/Risk — área de alto valor en tu perfil");
  if (title.includes("gtm") || title.includes("enablement") || title.includes("revenue")) pros.push("GTM strategy — tu fortaleza diferenciadora");
  if (pros.length < 2) pros.push("Revisión manual recomendada para validar el fit");
  if (pros.length < 3) pros.push("Potencial de expansión de red de contactos Fintech");

  if (title.includes("junior") || title.includes("associate") || title.includes("analyst")) cons.push("Posible sub-nivel vs tu experiencia actual");
  else cons.push("Alta competencia de candidatos regionales");
  cons.push("Valida disponibilidad del rol — lista extraída hace 1-2 meses");

  const strategy =
    title.includes("general manager") || title.includes("country manager")
      ? "Presenta un plan de 90 días para el mercado mexicano. Usa datos de Clip/Fiserv como benchmark."
      : title.includes("fraud") || title.includes("risk")
      ? "Destaca tu experiencia en reducción de chargebacks y gestión de riesgo operacional en Fintech."
      : title.includes("gtm") || title.includes("enablement")
      ? "Muestra métricas concretas de habilitación comercial: reducción de ciclo de ventas, aumento en win rate."
      : "Conecta primero en LinkedIn con el Hiring Manager mencionando tu red Fintech MX como diferenciador.";

  return { pros: pros.slice(0, 3), cons: cons.slice(0, 2), strategy };
};

// ── Vacantes VERIFICADAS — Links directos LinkedIn ────────────────────────
// Última verificación: Mayo 2026 | ✅ = Activa | ❌ = Eliminada
const LINKEDIN_SEED = [
  // ── LIDERAZGO REGIONAL ──────────────────────────────────────────────────
  { company: "Taptap Send", title: "General Manager, LATAM", url: "https://www.linkedin.com/jobs/view/4242002934/", location: "Remote / LATAM", tags: ["General Manager", "LATAM", "Fintech"] },
  { company: "VelaFi", title: "Regional Head of Sales – LATAM", url: "https://www.linkedin.com/jobs/view/4370000287/", location: "Remote / LATAM", tags: ["Head of Sales", "LATAM", "Payments"] },
  { company: "Limited, Inc.", title: "Head of Sales — LATAM", url: "https://www.linkedin.com/jobs/view/4366888537/", location: "Remote / LATAM", tags: ["Head of Sales", "Fintech", "LATAM"] },

  // ── PAGOS & FINTECH ─────────────────────────────────────────────────────
  { company: "Binance", title: "Business Development – Payment (LATAM)", url: "https://www.linkedin.com/jobs/view/4330738587/", location: "Remote / LATAM", tags: ["BD", "Payments", "LATAM", "Crypto"] },
  { company: "DEUNA", title: "Enterprise Sales Executive – Payments (Remote MX)", url: "https://www.linkedin.com/jobs/view/4361105504/", location: "Ciudad de México (Remote)", tags: ["Enterprise Sales", "Payments", "Fintech", "Remote"] },
  { company: "Nuvei", title: "Sr. Account Manager – Mexico", url: "https://www.linkedin.com/jobs/view/4279700652/", location: "México", tags: ["Account Manager", "Payments", "Fintech"] },
  { company: "Nuvei", title: "Business Development Manager – LATAM Gaming", url: "https://www.linkedin.com/jobs/view/4303639210/", location: "Remote / LATAM", tags: ["BD", "Payments", "LATAM", "Gaming"] },

  // ── ANTIFRAUDE & RIESGO ─────────────────────────────────────────────────
  { company: "Koin", title: "Sales Executive Senior – Anti Fraud Solutions", url: "https://www.linkedin.com/jobs/view/4363999558/", location: "LATAM", tags: ["Anti-fraud", "Sales", "Fintech"] },
  { company: "Signifyd", title: "Principal, Strategic Accounts & Insights", url: "https://www.linkedin.com/jobs/view/4369240699/", location: "Remote / LATAM", tags: ["Anti-fraud", "Strategic Accounts", "Fintech"] },

  // ── CRYPTO & GROWTH ─────────────────────────────────────────────────────
  { company: "OKX", title: "Growth Manager", url: "https://www.linkedin.com/jobs/view/4379499288/", location: "Remote / México", tags: ["Growth", "Crypto", "Fintech"] },
  { company: "Bitso", title: "Prime Sales & Trading Manager", url: "https://www.linkedin.com/jobs/view/4366984630/", location: "México / Remote", tags: ["Sales", "Crypto", "Fintech"] },

  // ── GTM & ENABLEMENT ────────────────────────────────────────────────────
  { company: "Varicent", title: "GTM Enablement Specialist (Remote – México Only)", url: "https://www.linkedin.com/jobs/view/4366420024/", location: "México (Remote)", tags: ["GTM", "Enablement", "Revenue", "Remote"] },
];

export default function JobRadar() {
  // Semilla de LinkedIn visible inmediatamente sin esperar al backend
  const seedEnriched = LINKEDIN_SEED.map(j => ({
    ...j,
    score: parseFloat(scoreJob(j)),
    rationale: getAnalysis(j),
  })).sort((a, b) => b.score - a.score);

  const [jobs, setJobs] = useState(seedEnriched);
  const [loading, setLoading] = useState(false);
  const [tracked, setTracked] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("Curado · LinkedIn 2026");

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?q=fintech+antifraude+crossborder+payments+latam&location=mexico+remote`);
      if (!res.ok) throw new Error("Backend error");
      const data = await res.json();
      // Combina LinkedIn curado + datos frescos del backend, sin duplicados
      const seen = new Set(LINKEDIN_SEED.map(j => j.url));
      const fresh = data
        .filter(j => !seen.has(j.url))
        .map(j => ({ ...j, score: parseFloat(scoreJob(j)), rationale: getAnalysis(j) }));
      const combined = [...seedEnriched, ...fresh]
        .sort((a, b) => b.score - a.score)
        .slice(0, 20);
      setJobs(combined);
      setLastUpdated(`Live · ${new Date().toLocaleTimeString("es-MX")}`);
    } catch (e) {
      console.error("Backend fetch failed, keeping LinkedIn seed:", e);
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
            { name: "RemoteJobsFinder", emoji: "🌐", url: "https://remotejobsfinder.co/en?country=MX&query=fintech+sales+manager+remote", tip: "Remoto desde México" },
            { name: "LinkedIn Jobs", emoji: "💼", url: "https://www.linkedin.com/jobs/search/?keywords=fintech+sales+director+LATAM+remote&location=Mexico&f_E=4%2C5%2C6&f_WT=2", tip: "Director+ Remoto LATAM" },
            { name: "JobLeads", emoji: "🎯", url: "https://www.jobleads.com/search/jobs?q=sales+director+fintech+latam&l=remote", tip: "Ejecutivo Remoto $100k+" },
            { name: "Remotive", emoji: "🛸", url: "https://remotive.com/remote-jobs/sales?search=fintech+latam", tip: "Fintech Remoto / LATAM" },
            { name: "Glassdoor", emoji: "🔮", url: "https://www.glassdoor.com/Job/jobs.htm?sc.keyword=fintech+sales+director+latam&remoteWorkType=1&seniority=DIRECTOR", tip: "Remoto + Salarios reales" },
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
