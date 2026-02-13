
import React, { useState } from 'react';
import { Sigma, Plus, ArrowRight, User, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLab } from '../store/LabContext';

const SchnorrDemo = () => {
    const { isDarkMode } = useLab();
    const [step, setStep] = useState(0);

    const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
    const reset = () => setStep(0);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-purple-600 text-white p-1.5 rounded-full">
                        <Sigma className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">Schnorr 聚合签名</span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
                
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <Plus className="w-8 h-8" /> 线性特性的魔法
                    </h2>
                    <p className="text-purple-100 text-lg leading-relaxed max-w-3xl">
                        Schnorr 签名最强大的特性是“线性”：多个公钥可以相加变成一个聚合公钥，多个签名也可以相加变成一个聚合签名。
                        <br/>
                        这意味着多重签名 (MultiSig) 在链上看起来和一个普通签名完全一样，既省空间又保护隐私。
                    </p>
                </div>

                {/* Simulation Stage */}
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    
                    {/* Left: Individual Signers */}
                    <div className="space-y-4">
                        {['Alice', 'Bob', 'Charlie'].map((name, i) => (
                            <div key={name} className={`p-4 rounded-xl border-2 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} ${step >= 1 ? 'opacity-50' : 'opacity-100'}`}>
                                <div className="flex items-center gap-2 mb-2 font-bold">
                                    <User className="w-4 h-4" /> {name}
                                </div>
                                <div className="text-xs font-mono space-y-1 text-slate-500">
                                    <div>Priv: d{i+1}</div>
                                    <div>Pub: P{i+1} = d{i+1}*G</div>
                                    {step >= 2 && <div className="text-purple-500 font-bold">Sig: s{i+1}</div>}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Middle: Operation */}
                    <div className="flex flex-col items-center gap-6">
                        <div className={`text-4xl font-bold text-slate-300 transition-all ${step >= 1 ? 'scale-110 text-purple-500' : ''}`}>
                            <Plus />
                        </div>
                        <button 
                            onClick={nextStep} 
                            disabled={step >= 3}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95 flex items-center gap-2"
                        >
                            {step === 0 && "1. 聚合公钥"}
                            {step === 1 && "2. 聚合签名"}
                            {step === 2 && "3. 验证"}
                            {step === 3 && "完成"}
                            <ArrowRight className="w-4 h-4"/>
                        </button>
                        {step >= 3 && (
                            <button onClick={reset} className="text-sm text-slate-500 underline">重置</button>
                        )}
                    </div>

                    {/* Right: Aggregated Result */}
                    <div className="space-y-6">
                        {/* Aggregated Public Key */}
                        <div className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-500 ${step >= 1 ? 'border-purple-500 bg-purple-50 dark:bg-slate-800' : 'border-slate-300'}`}>
                            <div className="text-center">
                                <div className="text-xs font-bold uppercase text-slate-500 mb-2">Aggregate Public Key</div>
                                {step >= 1 ? (
                                    <div className="font-mono font-bold text-xl text-purple-600 animate-in zoom-in">
                                        P_agg = ΣPi
                                    </div>
                                ) : (
                                    <div className="text-slate-300">Wait...</div>
                                )}
                            </div>
                        </div>

                        {/* Aggregated Signature */}
                        <div className={`p-6 rounded-2xl border-2 border-dashed transition-all duration-500 ${step >= 2 ? 'border-green-500 bg-green-50 dark:bg-slate-800' : 'border-slate-300'}`}>
                            <div className="text-center">
                                <div className="text-xs font-bold uppercase text-slate-500 mb-2">Aggregate Signature</div>
                                {step >= 2 ? (
                                    <div className="font-mono font-bold text-xl text-green-600 animate-in zoom-in">
                                        S_agg = Σsi
                                    </div>
                                ) : (
                                    <div className="text-slate-300">Wait...</div>
                                )}
                            </div>
                        </div>

                        {/* Verification */}
                        {step >= 3 && (
                            <div className="p-4 bg-slate-900 text-green-400 rounded-xl font-mono text-xs animate-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2 mb-2 font-bold">
                                    <ShieldCheck className="w-4 h-4" /> 矿工验证:
                                </div>
                                <div>Verify(P_agg, S_agg) {'->'} TRUE</div>
                                <div className="mt-2 text-slate-500">
                                    矿工只看到 1 个公钥和 1 个签名。它不知道这是由 3 个人共同生成的。
                                </div>
                            </div>
                        )}
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SchnorrDemo;
