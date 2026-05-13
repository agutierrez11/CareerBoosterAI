import React from 'react';
import { Sparkles, FileText, Target, ArrowRight } from 'lucide-react';

const Optimizer = () => {
    return (
        <div className="space-y-8 pb-20">
            <div className="text-center py-12">
                <div className="inline-flex p-4 bg-sky-500/10 rounded-full mb-6">
                    <Sparkles className="text-sky-500 animate-pulse" size={40} />
                </div>
                <h3 className="text-4xl font-black text-white">AI CV Optimizer</h3>
                <p className="text-slate-400 mt-4 max-w-xl mx-auto text-lg">Selecciona una vacante del Radar para detonar la reescritura táctica de tu currículum.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                    <FileText className="text-slate-700 mb-6" size={64} />
                    <h4 className="text-xl font-bold text-white mb-2">Paso 1: Tu CV</h4>
                    <p className="text-slate-500 text-sm">Sube tu perfil base en el CV Vault.</p>
                </div>
                <div className="bg-slate-900/50 border border-white/10 rounded-[2.5rem] p-10 flex flex-col items-center justify-center text-center">
                    <Target className="text-slate-700 mb-6" size={64} />
                    <h4 className="text-xl font-bold text-white mb-2">Paso 2: La Vacante</h4>
                    <p className="text-slate-500 text-sm">Escanea el mercado desde el Job Radar.</p>
                </div>
            </div>
            
            <div className="bg-gradient-to-r from-sky-600 to-indigo-600 rounded-3xl p-1 flex items-center justify-center">
                <div className="bg-black w-full rounded-[1.4rem] p-8 text-center">
                    <button className="text-xl font-black text-sky-400 flex items-center gap-4 mx-auto hover:scale-105 transition-transform">
                        Ir al Radar para empezar <ArrowRight />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Optimizer;
