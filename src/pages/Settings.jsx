import React from 'react';
import { Settings as SettingsIcon, Shield, Key, Bell, User } from 'lucide-react';

const Settings = () => {
    return (
        <div className="space-y-8 pb-20">
            <div>
                <h3 className="text-3xl font-extrabold text-white">Configuración</h3>
                <p className="text-slate-400">Gestiona tu identidad estratégica y claves de IA</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-slate-900/50 border border-white/10 rounded-3xl p-8 backdrop-blur-xl">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="p-3 bg-sky-500/20 rounded-2xl">
                                <Key className="text-sky-500" size={24} />
                            </div>
                            <h4 className="text-xl font-bold text-white">API Keys</h4>
                        </div>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">OpenAI API Key</label>
                                <input 
                                    type="password" 
                                    placeholder="sk-••••••••••••••••"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-sky-500 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-500 mb-3">Scrape.do Token</label>
                                <input 
                                    type="password" 
                                    placeholder="••••••••••••••••"
                                    className="w-full bg-slate-950 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-sky-500 text-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-sky-900/20 to-black border border-sky-500/20 rounded-3xl p-8">
                        <Shield className="text-sky-500 mb-4" size={32} />
                        <h4 className="text-lg font-bold text-white mb-2">Modo Privacidad</h4>
                        <p className="text-sm text-slate-400 leading-relaxed">Tus datos y CVs se procesan localmente o mediante túneles cifrados. Nada se almacena fuera de tu control.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
