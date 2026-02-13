import React, { useState } from 'react';
import {
  FileSignature, Key, Copy, Hash, Lock, Fingerprint, ShieldCheck,
  Terminal, CheckCircle2, RefreshCcw, Play, Unlock
} from 'lucide-react';

// --- TYPES ---
type StackItem = {
  id: number;
  val: string;
  type: 'sig' | 'pub' | 'hash' | 'pkh' | 'bool';
  state: 'idle' | 'flying' | 'duping' | 'crushing' | 'colliding' | 'verified';
};

interface P2PKHDemoProps {
  isDarkMode?: boolean;
}

const P2PKHDemo: React.FC<P2PKHDemoProps> = ({ isDarkMode = false }) => {
  // --- STATE ---
  const [pc, setPc] = useState(-1); // -1 = disconnected state
  const [stack, setStack] = useState<StackItem[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [status, setStatus] = useState<'disconnected' | 'connected' | 'running' | 'success' | 'fail'>('disconnected');
  const [explanation, setExplanation] = useState("准备就绪。点击执行以连接脚本。");

  // --- SCRIPT DEFINITION ---
  const script = [
    // Unlock (ScriptSig)
    { 
      id: 'sig', op: '<Sig>', type: 'PUSH', val: 'Sig_Alice', icon: <FileSignature size={16}/>, group: 'unlock', 
      desc: "步骤 1/7: 提交解锁钥匙。用户首先提供数字签名（Signature），证明自己拥有私钥。这是解锁的第一步。" 
    },
    { 
      id: 'pub', op: '<PubKey>', type: 'PUSH', val: 'Pub_Alice', icon: <Key size={16}/>, group: 'unlock', 
      desc: "步骤 2/7: 提交身份凭证。推入用户的公钥（Public Key）。它是生成地址的源头，用于后续验证签名。"
    },
    // Lock (ScriptPubKey)
    { 
      id: 'dup', op: 'OP_DUP', type: 'OP', action: 'dup', icon: <Copy size={16}/>, group: 'lock', 
      desc: "步骤 3/7: 复制公钥。我们需要保留一份公钥用于最终的签名验证，同时复制一份用来验证地址哈希是否匹配。"
    },
    { 
      id: 'hash', op: 'OP_HASH160', type: 'OP', action: 'hash', icon: <Hash size={16}/>, group: 'lock', 
      desc: "步骤 4/7: 地址计算。对复制出的公钥进行 Hash160 运算。如果不匹配原地址，说明提供的公钥是错误的。"
    },
    { 
      id: 'pkh', op: '<PKH>', type: 'PUSH', val: 'Hash(Pub)', icon: <Lock size={16}/>, group: 'lock', 
      desc: "步骤 5/7: 推入锁。将 UTXO 中锁定的目标哈希（即收款人地址）推入堆栈，准备进行比对。"
    },
    { 
      id: 'eq', op: 'OP_EQUALVERIFY', type: 'OP', action: 'equal', icon: <Fingerprint size={16}/>, group: 'lock', 
      desc: "步骤 6/7: 验证地址。对比计算出的哈希与锁定的哈希。如果相等，说明你提供了正确的公钥。堆栈将消耗掉这两个哈希。"
    },
    { 
      id: 'sigcheck', op: 'OP_CHECKSIG', type: 'OP', action: 'checksig', icon: <ShieldCheck size={16}/>, group: 'lock', 
      desc: "步骤 7/7: 终极验证。使用留下的公钥验证最底部的签名。如果通过，脚本返回 TRUE，资金解锁成功！"
    }
  ];

  const offsets = [
      42, 110, 198, 266, 334, 402, 470 
  ];
  const currentOffset = pc >= 0 && pc < offsets.length ? offsets[pc] : 42;

  // --- ACTIONS ---

  const connectScripts = () => {
    setStatus('connected');
    setPc(0);
    setExplanation("脚本已拼接。堆栈机准备执行。");
  };

  const executeStep = () => {
    if (pc >= script.length || isAnimating) return;
    setIsAnimating(true);
    setStatus('running');

    const cmd = script[pc];
    setExplanation(cmd.desc);

    // 1. ANIMATION PHASE
    if (cmd.type === 'PUSH') {
        const newItem: StackItem = {
            id: Date.now(),
            val: cmd.val || '',
            type: cmd.id === 'sig' ? 'sig' : cmd.id === 'pub' ? 'pub' : 'pkh',
            state: 'flying'
        };
        setStack(prev => [newItem, ...prev]);
        
        setTimeout(() => {
            setStack(prev => prev.map(item => item.id === newItem.id ? { ...item, state: 'idle' } : item));
            nextStep();
        }, 800);
    } 
    else if (cmd.action === 'dup') {
        setStack(prev => {
            const top = prev[0];
            return [{...top, id: Date.now(), state: 'duping'}, ...prev];
        });
        setTimeout(() => {
            setStack(prev => prev.map((item, i) => i === 0 ? { ...item, state: 'idle' } : item));
            nextStep();
        }, 1000);
    }
    else if (cmd.action === 'hash') {
        setStack(prev => prev.map((item, i) => i === 0 ? { ...item, state: 'crushing' } : item));
        setTimeout(() => {
            setStack(prev => [
                { id: Date.now(), val: 'Hash(Pub)', type: 'hash', state: 'idle' },
                ...prev.slice(1)
            ]);
            nextStep();
        }, 1200);
    }
    else if (cmd.action === 'equal') {
        setStack(prev => prev.map((item, i) => i < 2 ? { ...item, state: 'colliding' } : item));
        setTimeout(() => {
            setStack(prev => prev.slice(2)); 
            nextStep();
        }, 1500);
    }
    else if (cmd.action === 'checksig') {
        setStack(prev => prev.map((item, i) => i < 2 ? { ...item, state: 'verified' } : item));
        setTimeout(() => {
            setStack([]); 
            setStatus('success');
            setExplanation("验证成功！资金已解锁。");
            setIsAnimating(false);
            setPc(prev => prev + 1);
        }, 2000);
    }
  };

  const nextStep = () => {
      setPc(prev => prev + 1);
      setIsAnimating(false);
  };

  const reset = () => {
      setPc(-1);
      setStack([]);
      setStatus('disconnected');
      setIsAnimating(false);
      setExplanation("准备就绪。");
  };

  return (
    <div className={`h-full flex flex-col relative ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} overflow-hidden rounded-[2rem] border shadow-sm min-h-[600px]`}>

        {/* --- 1. SCRIPT TAPE (TOP) --- */}
        <div className={`h-32 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-b relative flex items-center justify-center overflow-hidden`}>
            <div className={`absolute inset-0 bg-[linear-gradient(90deg,${isDarkMode ? '#334155' : '#e2e8f0'}_2px,transparent_2px)] bg-[size:40px_100%] opacity-50`}></div>

            {/* TAPE CONTAINER */}
            <div
                className="absolute left-1/2 top-1/2 flex gap-[4px] transition-all duration-700 ease-in-out"
                style={{ transform: `translate(-${currentOffset}px, -50%)` }}
            >

                {/* ScriptSig Group */}
                <div className={`flex gap-[4px] p-[8px] rounded-xl border-[2px] border-dashed transition-all duration-1000 ${status === 'disconnected' ? `mr-12 ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}` : 'mr-0 bg-transparent border-transparent'}`}>
                    {status === 'disconnected' && <div className={`absolute -top-6 left-2 text-[9px] font-black ${isDarkMode ? 'text-blue-400' : 'text-blue-500'} uppercase tracking-widest`}>Unlock (Key)</div>}
                    {script.filter(s => s.group === 'unlock').map((s, i) => (
                        <div key={s.id} className={`w-[64px] h-12 rounded ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'} border flex flex-col items-center justify-center text-xs font-mono font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-600'} relative transition-all shadow-sm ${pc === i ? `ring-2 ring-blue-500 scale-110 z-10 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}` : 'opacity-80'}`}>
                            {s.icon}
                            <span className="mt-1">{s.op}</span>
                            {/* Connector visual for puzzle feel */}
                            {i === 1 && status === 'disconnected' && <div className={`absolute -right-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'bg-blue-500/20 border-blue-500/30' : 'bg-blue-100 border-blue-200'} rotate-45 border-r border-t`}></div>}
                        </div>
                    ))}
                </div>

                {/* ScriptPubKey Group */}
                <div className={`flex gap-[4px] p-[8px] rounded-xl border-[2px] border-dashed transition-all duration-1000 ${status === 'disconnected' ? isDarkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200' : 'bg-transparent border-transparent'}`}>
                    {status === 'disconnected' && <div className={`absolute -top-6 left-2 text-[9px] font-black ${isDarkMode ? 'text-orange-400' : 'text-orange-500'} uppercase tracking-widest`}>Lock (Puzzle)</div>}
                    {script.filter(s => s.group === 'lock').map((s, i) => {
                        const realIdx = i + 2;
                        return (
                            <div key={s.id} className={`w-[64px] h-12 rounded ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300'} border flex flex-col items-center justify-center text-xs font-mono font-bold ${isDarkMode ? 'text-orange-400' : 'text-orange-600'} transition-all shadow-sm ${pc === realIdx ? `ring-2 ring-orange-500 scale-110 z-10 ${isDarkMode ? 'bg-slate-800' : 'bg-white'}` : 'opacity-80'}`}>
                                {s.icon}
                                <span className="mt-1 text-[10px]">{s.op.replace('OP_', '')}</span>
                            </div>
                        )
                    })}
                </div>

            </div>

            {/* Read Head Laser */}
            <div className={`absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-red-500 z-20 transition-opacity ${status === 'disconnected' ? 'opacity-0' : 'opacity-100'}`}></div>
        </div>

        {/* --- 2. MAIN WORKSPACE (MIDDLE) --- */}
        <div className="flex-1 relative flex flex-col md:flex-row">

            {/* LEFT: STACK CONTAINER */}
            <div className={`flex-1 relative flex items-end justify-center pb-8 pt-20 px-8 ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50/50'}`}>
                {/* The Glass Tube */}
                <div className={`w-48 h-full min-h-[300px] border-x-2 border-b-2 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-white'} rounded-b-2xl relative flex flex-col justify-end items-center p-2 gap-2 shadow-sm`}>
                    <div className={`absolute -top-6 text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-black uppercase tracking-[0.3em]`}>Stack Memory</div>

                    {stack.map((item, i) => (
                        <div
                            key={item.id}
                            className={`
                                w-full h-12 rounded border flex items-center justify-center font-mono font-bold text-sm shadow-sm relative overflow-hidden transition-all duration-500
                                ${item.type === 'sig'
                                    ? isDarkMode ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-100 border-blue-300 text-blue-700'
                                    : item.type === 'pub'
                                    ? isDarkMode ? 'bg-indigo-500/20 border-indigo-500/50 text-indigo-400' : 'bg-indigo-100 border-indigo-300 text-indigo-700'
                                    : item.type === 'hash'
                                    ? isDarkMode ? 'bg-purple-500/20 border-purple-500/50 text-purple-400' : 'bg-purple-100 border-purple-300 text-purple-700'
                                    : isDarkMode ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-orange-100 border-orange-300 text-orange-700'}
                                ${item.state === 'flying' ? 'animate-[drop-in_0.5s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]' : ''}
                                ${item.state === 'duping' ? 'animate-[pulse_0.5s_ease-in-out_infinite] border-pink-500' : ''}
                                ${item.state === 'crushing' ? `animate-[crush_1s_ease-in-out_forwards] ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}` : ''}
                                ${item.state === 'colliding' ? `animate-[collision_1s_ease-in-out_forwards] ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}` : ''}
                            `}
                        >
                            {item.val}
                        </div>
                    ))}

                    {stack.length === 0 && status !== 'success' && (
                        <div className={`${isDarkMode ? 'text-slate-600' : 'text-slate-300'} text-xs font-mono uppercase tracking-widest absolute top-1/2`}>Empty</div>
                    )}
                </div>
            </div>

            {/* RIGHT: EXPLAINER & CONTROLS */}
            <div className={`w-full md:w-80 ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border-t md:border-t-0 md:border-l p-6 flex flex-col relative z-30`}>
                <div className="flex-1">
                    <div className={`flex items-center gap-2 mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} text-xs font-black uppercase tracking-widest`}>
                        <Terminal size={14} /> Execution Log
                    </div>
                    <div className="bg-slate-900 border border-slate-700 p-4 rounded-xl font-mono text-sm text-slate-300 leading-relaxed min-h-[100px] shadow-inner relative overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                        <span className="text-green-500 mr-2">root@bitcoin:~$</span>
                        {explanation}
                        <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-slate-500 align-middle"></span>
                    </div>
                </div>

                <div className="mt-8 flex gap-3">
                    {status === 'disconnected' ? (
                        <button
                            onClick={connectScripts}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white shadow-lg ${isDarkMode ? 'shadow-blue-500/20' : 'shadow-blue-200'} transition-all active:scale-95`}
                        >
                            <Unlock size={14} /> 连接脚本
                        </button>
                    ) : status === 'success' ? (
                        <button
                            onClick={reset}
                            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 text-white shadow-lg ${isDarkMode ? 'shadow-green-500/20' : 'shadow-green-200'} transition-all active:scale-95 animate-pulse`}
                        >
                            <RefreshCcw size={14} /> 重置演示
                        </button>
                    ) : (
                        <>
                            <button
                                onClick={reset}
                                className={`px-4 py-4 rounded-xl ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border-slate-700' : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border-slate-200'} transition-all active:scale-95 border`}
                                aria-label="Reset"
                            >
                                <RefreshCcw size={16} />
                            </button>
                            <button
                                onClick={executeStep}
                                disabled={isAnimating}
                                className={`flex-1 py-4 rounded-xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 transition-all active:scale-95 border-b-4 ${isAnimating ? isDarkMode ? 'bg-slate-800 text-slate-500 border-slate-700 cursor-not-allowed' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed' : 'bg-orange-500 hover:bg-orange-400 text-white border-orange-700 shadow-md'}`}
                            >
                                {isAnimating ? <RefreshCcw size={14} className="animate-spin"/> : <Play size={14} fill="currentColor" />}
                                执行一步
                            </button>
                        </>
                    )}
                </div>
            </div>

        </div>

        {/* --- SUCCESS OVERLAY --- */}
        {status === 'success' && (
            <div className={`absolute inset-0 z-50 flex items-center justify-center ${isDarkMode ? 'bg-slate-900/80' : 'bg-white/80'} backdrop-blur-sm animate-fade-in`}>
                <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-white'} border-4 border-green-500 p-8 rounded-3xl shadow-xl transform scale-110 animate-[stamp_0.3s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards] flex flex-col items-center`}>
                    <CheckCircle2 size={80} className="text-green-500 mb-4" />
                    <h2 className={`text-3xl font-black ${isDarkMode ? 'text-white' : 'text-slate-800'} uppercase italic tracking-tighter`}>Verified</h2>
                    <p className="text-green-500 font-mono text-sm mt-2">Signature Valid. UTXO Spent.</p>

                    <button
                        onClick={reset}
                        className="mt-6 px-8 py-3 bg-green-600 hover:bg-green-500 text-white rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                        <RefreshCcw size={16} /> 重置演示
                    </button>
                </div>
            </div>
        )}

        {/* CSS Animations */}
        <style>{`
            @keyframes drop-in {
                0% { transform: translateY(-100px) scale(0.5); opacity: 0; }
                60% { transform: translateY(10px) scale(1.1); opacity: 1; }
                100% { transform: translateY(0) scale(1); opacity: 1; }
            }
            @keyframes crush {
                0% { transform: scale(1); filter: brightness(1); }
                50% { transform: scale(1.2, 0.5); filter: brightness(2) hue-rotate(90deg); }
                100% { transform: scale(0); opacity: 0; }
            }
            @keyframes collision {
                0% { transform: translateX(0); }
                20% { transform: translateX(-5px); }
                40% { transform: translateX(5px); }
                50% { transform: scale(1.2); filter: brightness(2); background-color: #fff; }
                100% { transform: scale(0); opacity: 0; }
            }
            @keyframes stamp {
                0% { transform: scale(3); opacity: 0; }
                100% { transform: scale(1); opacity: 1; }
            }
        `}</style>
    </div>
  );
};

export default P2PKHDemo;