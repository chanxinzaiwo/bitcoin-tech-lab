
import React, { useState } from 'react';
import { Smartphone, Server, ArrowRight, Search, CheckCircle, Database, FileText } from 'lucide-react';
import { useLab } from '../store/LabContext';

const SPVDemo = () => {
    const { isDarkMode } = useLab();
    const [step, setStep] = useState(0);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-blue-500 text-white p-1.5 rounded-full">
                        <Smartphone className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">SPV 轻节点验证</span>
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
                
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4">不下载，只验证</h2>
                    <p className="text-blue-100 text-lg leading-relaxed max-w-3xl">
                        手机无法存储 500GB+ 的区块链数据。
                        简单支付验证 (SPV) 允许轻钱包只下载区块头（80字节），并通过<strong>默克尔路径</strong>向全节点查询交易是否被打包。
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8 min-h-[400px]">
                    
                    {/* Left: Light Client */}
                    <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-between relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="text-center">
                            <Smartphone className="w-12 h-12 mx-auto text-blue-500 mb-2" />
                            <h3 className="font-bold">轻钱包 (Phone)</h3>
                            <p className="text-xs text-slate-500">仅存储区块头 (Headers)</p>
                        </div>

                        {step === 0 && (
                            <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-6 py-2 rounded-full font-bold text-sm hover:bg-blue-700 transition-colors animate-bounce">
                                1. 查询交易 TX_A
                            </button>
                        )}

                        {step >= 3 && (
                            <div className="bg-green-100 text-green-800 p-4 rounded-xl text-xs font-mono w-full animate-in zoom-in">
                                <div className="font-bold mb-2">本地验证:</div>
                                <div>Hash(TX_A + Path)</div>
                                <div className="text-center my-1">==</div>
                                <div>Merkle Root (Header)</div>
                                <div className="mt-2 flex items-center justify-center gap-1 font-bold text-green-600">
                                    <CheckCircle className="w-4 h-4"/> Verified
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Middle: Network / Merkle Path */}
                    <div className="flex flex-col items-center justify-center relative">
                        {step === 1 && (
                            <div className="absolute top-1/3 w-full h-1 bg-blue-200 animate-pulse">
                                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full animate-[ping_1s_infinite]"></div>
                            </div>
                        )}
                        {step === 2 && (
                            <div className="flex flex-col items-center gap-2 animate-in slide-in-from-right">
                                <div className="bg-slate-800 text-white px-3 py-1 rounded text-xs font-mono">Merkle Path</div>
                                <ArrowRight className="w-6 h-6 text-slate-400 rotate-180" />
                                <div className="flex flex-col gap-1">
                                    <div className="w-8 h-8 bg-orange-200 rounded border border-orange-400"></div>
                                    <div className="w-8 h-8 bg-purple-200 rounded border border-purple-400"></div>
                                </div>
                            </div>
                        )}
                        {step >= 1 && step < 3 && (
                            <button onClick={() => setStep(prev => prev+1)} className="mt-8 bg-slate-200 hover:bg-slate-300 text-slate-700 px-4 py-1 rounded text-xs font-bold">
                                下一步 &rarr;
                            </button>
                        )}
                        {step === 3 && (
                            <button onClick={() => setStep(0)} className="mt-8 text-slate-400 text-xs hover:underline">
                                重置
                            </button>
                        )}
                    </div>

                    {/* Right: Full Node */}
                    <div className={`p-6 rounded-2xl border-2 flex flex-col items-center justify-between ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="text-center">
                            <Server className="w-12 h-12 mx-auto text-slate-500 mb-2" />
                            <h3 className="font-bold">全节点 (Server)</h3>
                            <p className="text-xs text-slate-500">存储完整区块链 (500GB+)</p>
                        </div>

                        <div className="space-y-2 w-full">
                            <div className="flex justify-center">
                                <div className={`w-32 h-32 border-2 border-slate-300 rounded-lg flex flex-col items-center justify-end p-2 relative ${step >= 1 ? 'bg-slate-100' : ''}`}>
                                    <div className="absolute top-2 text-[10px] font-bold text-slate-400">Merkle Tree</div>
                                    <div className="flex gap-1">
                                        <div className={`w-6 h-6 border ${step >= 1 ? 'bg-blue-500 border-blue-600' : 'bg-white'}`} title="TX_A"></div>
                                        <div className="w-6 h-6 border bg-slate-200"></div>
                                        <div className="w-6 h-6 border bg-slate-200"></div>
                                        <div className="w-6 h-6 border bg-slate-200"></div>
                                    </div>
                                </div>
                            </div>
                            {step >= 1 && (
                                <div className="text-center text-xs text-slate-500 animate-pulse">
                                    Locating TX_A... Generating Proof...
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default SPVDemo;
