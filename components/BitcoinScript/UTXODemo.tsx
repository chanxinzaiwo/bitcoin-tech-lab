import React, { useState } from 'react';
import { Lock, Key, ArrowRight, RefreshCcw, ShieldCheck, Scissors, Unlock, FileCode, Code2 } from 'lucide-react';

const UTXODemo: React.FC = () => {
  const [stage, setStage] = useState<'idle' | 'unlocking' | 'processing' | 'minting' | 'done'>('idle');

  // Input UTXO Data
  const outputs = [
    { amount: 3, address: 'Bob', type: 'payment' },
    { amount: 7, address: 'Alice', type: 'change' }
  ];

  const opcodes = [
    { text: '<Sig>', color: 'text-blue-700 border-blue-200 bg-blue-50' },
    { text: '<PubKey>', color: 'text-blue-700 border-blue-200 bg-blue-50' },
    { text: 'OP_DUP', color: 'text-orange-700 border-orange-200 bg-orange-50' },
    { text: 'OP_HASH160', color: 'text-purple-700 border-purple-200 bg-purple-50' },
    { text: 'OP_EQUALVERIFY', color: 'text-yellow-700 border-yellow-200 bg-yellow-50' },
    { text: 'OP_CHECKSIG', color: 'text-green-700 border-green-200 bg-green-50' }
  ];

  const handleProcess = () => {
    if (stage !== 'idle') return;
    setStage('unlocking');
    
    // Sequence Timeline
    setTimeout(() => setStage('processing'), 2000); 
    setTimeout(() => setStage('minting'), 3500);    
    setTimeout(() => setStage('done'), 5000);       
  };

  const reset = () => {
    setStage('idle');
  };

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 rounded-2xl p-4 md:p-8 select-none relative overflow-hidden min-h-[600px] shadow-sm">
        {/* Title / Header */}
        <div className="text-center mb-8 md:mb-12 z-10">
            <h3 className="text-2xl font-black uppercase tracking-widest text-slate-700">
                UTXO 生命周期
            </h3>
            <p className="text-slate-500 text-xs font-mono mt-2">
                输入 (销毁) -&gt; 解锁 -&gt; 输出 (铸造)
            </p>
        </div>

        {/* Main Process Area */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-16 md:gap-32 relative z-10 w-full max-w-5xl mx-auto">
            
            {/* 1. INPUT ZONE */}
            <div className="relative z-20 group">
                <div className={`text-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest transition-opacity`}>
                    Input (Unspent)
                </div>
                
                <div 
                    onClick={handleProcess}
                    className={`
                        w-40 h-24 border-2 rounded-xl flex flex-col items-center justify-center transition-all duration-500 relative overflow-visible
                        ${stage === 'idle' 
                            ? 'bg-white border-orange-400 cursor-pointer hover:border-orange-500 hover:scale-105 shadow-md' 
                            : 'bg-slate-50 border-slate-200 opacity-50 cursor-default scale-95'}
                    `}
                >
                    <div className="absolute top-2 right-2">
                        {stage === 'idle' ? <Lock size={14} className="text-slate-400" /> : <Unlock size={14} className="text-slate-400" />}
                    </div>
                    <div className="text-2xl font-black text-slate-800 transition-colors">10 BTC</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1">@Alice</div>
                    
                    {/* Hover Hint */}
                    {stage === 'idle' && (
                        <>
                            <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full animate-ping"></div>
                            <div className="absolute inset-0 bg-orange-50/50 animate-pulse rounded-xl pointer-events-none"></div>
                        </>
                    )}
                    
                    {/* Spent Stamp */}
                    {stage !== 'idle' && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/80 rounded-xl backdrop-blur-[1px]">
                            <span className="text-slate-400 text-xs font-black uppercase -rotate-12 border-2 border-slate-400 px-2 py-1 rounded">SPENT</span>
                        </div>
                    )}
                </div>

                {/* Explicit Click Prompt */}
                {stage === 'idle' && (
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 whitespace-nowrap animate-bounce">
                        <div className="text-orange-600 text-[10px] font-black uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                            👆 点击消费
                        </div>
                    </div>
                )}
            </div>

            {/* ANIMATION LAYER (Absolute) */}
            {stage === 'unlocking' && (
                <div className="absolute inset-0 pointer-events-none z-50">
                    
                    {/* Flying Key (ScriptSig) */}
                    <div className="absolute top-1/2 left-[20%] md:left-[22%] -translate-y-1/2 animate-[fly-key_1.8s_cubic-bezier(0.4,0,0.2,1)_forwards]">
                        <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center shadow-lg text-white border-2 border-orange-200 relative z-20">
                            <Key size={24} className="drop-shadow-sm" />
                            {/* Trail particles */}
                            <div className="absolute right-full top-1/2 w-12 h-0.5 bg-gradient-to-l from-orange-400/50 to-transparent"></div>
                        </div>
                    </div>

                    {/* Flying Opcodes Trail */}
                    {opcodes.map((op, i) => (
                        <div 
                            key={op.text}
                            className={`
                                absolute top-1/2 left-[20%] md:left-[22%] -translate-y-1/2 
                                flex items-center gap-1.5 
                                border px-2 py-1 rounded
                                shadow-sm backdrop-blur-md
                                origin-left
                                ${op.color}
                            `}
                            style={{
                                animation: `fly-opcode 1.5s cubic-bezier(0.4,0,0.2,1) forwards`,
                                animationDelay: `${i * 0.15 + 0.1}s`, 
                                opacity: 0,
                                zIndex: 10 - i
                            }}
                        >
                            <Code2 size={10} className="opacity-70" />
                            <span className="font-mono text-[9px] md:text-[10px] font-bold">{op.text}</span>
                        </div>
                    ))}
                </div>
            )}

            {/* 2. PROCESSOR (Middle) */}
            <div className="relative flex flex-col items-center justify-center w-48 h-48 shrink-0 z-20">
                {/* Connecting Lines (Background) */}
                <div className="absolute top-1/2 left-[-100px] right-[-100px] h-0.5 bg-gradient-to-r from-transparent via-slate-200 to-transparent -z-10 hidden md:block"></div>
                
                {/* The "Machine" */}
                <div className={`w-36 h-36 rounded-full border-4 flex items-center justify-center bg-white z-10 transition-all duration-500 relative overflow-hidden
                    ${stage === 'unlocking' ? 'border-orange-500 shadow-[0_0_30px_rgba(249,115,22,0.2)] scale-105' : 
                      stage === 'processing' ? 'border-red-500 animate-pulse' : 
                      'border-slate-200'}
                `}>
                    {/* Inner Activity Ring */}
                    {stage === 'unlocking' && (
                        <div className="absolute inset-0 border-t-4 border-orange-500 rounded-full animate-spin"></div>
                    )}

                    {/* Icon Logic */}
                    {stage === 'idle' && <ArrowRight size={32} className="text-slate-300" />}
                    
                    {stage === 'unlocking' && (
                        <div className="flex flex-col items-center animate-pulse">
                            <FileCode size={32} className="text-orange-500" />
                            <span className="text-[9px] text-orange-500 font-bold uppercase mt-1">Verifying</span>
                        </div>
                    )}
                    
                    {stage === 'processing' && (
                        <div className="flex flex-col items-center animate-bounce">
                            <Scissors size={32} className="text-red-500" />
                            <span className="text-[9px] text-red-500 font-black uppercase mt-1">Destroying</span>
                        </div>
                    )}

                    {(stage === 'minting' || stage === 'done') && (
                        <ShieldCheck size={48} className="text-emerald-500" />
                    )}
                </div>
                
                {/* Label */}
                <div className="absolute -bottom-8 text-[10px] font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap">
                    {stage === 'idle' ? 'Script Engine' : stage === 'unlocking' ? 'Running Script...' : stage === 'processing' ? 'Consuming Input' : 'Verifying Output'}
                </div>
            </div>

            {/* 3. OUTPUT ZONE */}
            <div className="relative min-w-[200px] flex flex-col items-center z-20">
                <div className={`text-center mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest transition-opacity duration-500 ${stage === 'minting' || stage === 'done' ? 'opacity-100' : 'opacity-0'}`}>New Outputs</div>
                
                {/* Output Containers */}
                <div className="flex flex-col gap-4">
                    {outputs.map((out, i) => (
                        <div 
                            key={i}
                            className={`w-48 h-16 bg-white border-2 rounded-xl flex items-center justify-between px-4 transition-all duration-700 shadow-sm
                                ${stage === 'minting' || stage === 'done' 
                                    ? 'opacity-100 translate-x-0' 
                                    : 'opacity-0 -translate-x-12 scale-90'}
                                ${out.type === 'change' ? 'border-slate-200 text-slate-400' : 'border-emerald-200 text-emerald-600'}
                            `}
                            style={{ transitionDelay: `${i * 200}ms` }}
                        >
                            <div className="flex flex-col text-left">
                                <span className="font-black text-lg">{out.amount} BTC</span>
                                <span className="text-[9px] uppercase tracking-wider opacity-70">{out.type}</span>
                            </div>
                            <div className="text-[10px] font-mono opacity-50">@{out.address}</div>
                        </div>
                    ))}
                </div>
            </div>

        </div>

        {/* Reset Button (Bottom) */}
        <div className="mt-auto flex justify-center pb-8 z-20">
            {stage === 'done' && (
                <button 
                    onClick={reset}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 rounded-full text-slate-600 font-bold uppercase text-xs tracking-widest transition-all animate-fade-in-up"
                >
                    <RefreshCcw size={14} /> 重置演示
                </button>
            )}
        </div>

        {/* Animation Keyframes */}
        <style>{`
            @keyframes fly-key {
                0% { left: 22%; opacity: 0; transform: translateY(-50%) scale(0.5) rotate(-45deg); }
                10% { opacity: 1; transform: translateY(-50%) scale(1) rotate(0deg); }
                85% { left: 50%; opacity: 1; transform: translateY(-50%) scale(1) rotate(0deg); }
                100% { left: 50%; opacity: 0; transform: translateY(-50%) scale(0.2) rotate(45deg); }
            }
            @keyframes fly-opcode {
                0% { left: 22%; opacity: 0; transform: translate(0, -50%) scale(0.5); }
                15% { opacity: 1; transform: translate(0, -90%) scale(1); } /* Float up slightly to scatter */
                85% { left: 50%; opacity: 1; transform: translate(0, -50%) scale(0.8); }
                100% { left: 50%; opacity: 0; transform: translate(20px, -50%) scale(0.1); }
            }
        `}</style>

        {/* Background Particles/Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>
    </div>
  );
};

export default UTXODemo;