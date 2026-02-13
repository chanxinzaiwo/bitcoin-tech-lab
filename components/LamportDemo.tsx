import React, { useState, useEffect } from 'react';
import { Lock, Unlock, ArrowRight, RefreshCw, AlertTriangle, CheckCircle2, Fingerprint, ShieldCheck, Eye, Hash } from 'lucide-react';
import { computeSHA256 } from '../utils/crypto-math';

// 1. 基础盒子组件
interface SecretBoxProps {
    label: string;
    secret: string;
    hash: string;
    isOpen: boolean;
    color?: 'blue' | 'red';
}

const SecretBox = ({ label, secret, hash, isOpen, color = 'blue' }: SecretBoxProps) => {
    const bgColors: Record<'blue' | 'red', string> = {
        blue: 'bg-cyan-50 border-cyan-200',
        red: 'bg-rose-50 border-rose-200',
    };
    const textColors: Record<'blue' | 'red', string> = {
        blue: 'text-cyan-600',
        red: 'text-rose-600',
    };

    return (
        <div className={`relative p-3 rounded-xl border-2 transition-all duration-500 flex flex-col items-center gap-2 ${isOpen ? bgColors[color] : 'bg-white border-slate-200'}`}>
            <div className="absolute -top-3 px-2 bg-white text-[10px] font-bold text-slate-400 border border-slate-200 rounded-full">
                {label}
            </div>
            
            <div className="mt-2">
                {isOpen ? (
                    <Unlock className={`w-8 h-8 ${textColors[color]} animate-in zoom-in`} />
                ) : (
                    <Lock className="w-8 h-8 text-slate-400" />
                )}
            </div>

            <div className="text-center w-full overflow-hidden">
                <div className="text-[10px] text-slate-400 uppercase font-bold">
                    {isOpen ? '里面的字条 (私钥)' : '锁住的盒子 (公钥)'}
                </div>
                <div className={`font-mono text-xs font-bold truncate transition-all ${isOpen ? textColors[color] : 'text-slate-300 blur-[2px]'}`}>
                    {isOpen ? secret : hash}
                </div>
            </div>
        </div>
    );
};

const LamportDemo = () => {
    const [step, setStep] = useState(0);

    // --- Data State ---
    const [simpleSecret, setSimpleSecret] = useState("1234");
    const [simpleHash, setSimpleHash] = useState("");
    const [simpleOpen, setSimpleOpen] = useState(false);
    const [bit0Pair, setBit0Pair] = useState<any>(null);
    const [bitChoice, setBitChoice] = useState<0 | 1 | null>(null);
    const [keys, setKeys] = useState<any[][]>([]);
    const [msg, setMsg] = useState("011");
    const [revealed, setRevealed] = useState<Set<string>>(new Set());
    const [verifyStep, setVerifyStep] = useState(0);
    const [hackHistory, setHackHistory] = useState<Set<string>>(new Set());

    useEffect(() => { computeSHA256(simpleSecret).then(res => setSimpleHash(res.hex.substring(0, 8))); }, [simpleSecret]);
    useEffect(() => {
        const init = async () => {
            const s0 = Math.floor(Math.random() * 9999).toString();
            const s1 = Math.floor(Math.random() * 9999).toString();
            const h0 = (await computeSHA256(s0)).hex.substring(0, 6);
            const h1 = (await computeSHA256(s1)).hex.substring(0, 6);
            setBit0Pair({ zero: { secret: s0, hash: h0 }, one: { secret: s1, hash: h1 } });

            const newKeys = [];
            for(let i=0; i<3; i++) {
                const k0 = Math.floor(Math.random() * 9999).toString();
                const k1 = Math.floor(Math.random() * 9999).toString();
                newKeys.push([
                    { secret: k0, hash: (await computeSHA256(k0)).hex.substring(0,6) },
                    { secret: k1, hash: (await computeSHA256(k1)).hex.substring(0,6) }
                ]);
            }
            setKeys(newKeys);
        };
        init();
    }, []);

    const signMessage = (m: string) => {
        setMsg(m);
        const newRevealed = new Set<string>();
        m.split('').forEach((bit, idx) => { newRevealed.add(`${idx}-${bit}`); });
        setRevealed(newRevealed);
        setVerifyStep(0);
    };

    const hackSign = (m: string) => {
        const newHistory = new Set(hackHistory);
        m.split('').forEach((bit, idx) => { newHistory.add(`${idx}-${bit}`); });
        setHackHistory(newHistory);
    };

    const sections = [
        { id: 'concept', title: '1. 神奇盒子' },
        { id: 'one-bit', title: '2. 选 0 还是 1' },
        { id: 'full-keys', title: '3. 生成密钥' },
        { id: 'sign', title: '4. 签名过程' },
        { id: 'verify', title: '5. 如何验证' },
        { id: 'hack', title: '6. 致命弱点' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 font-sans">
             <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-teal-600 text-white p-1.5 rounded-full">
                                <Hash className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">Lamport 签名</span>
                            <span className="font-bold text-lg tracking-tight text-slate-900 sm:hidden">Lamport</span>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="max-w-4xl mx-auto p-4 space-y-8 py-8">
                {/* Nav */}
                <div className="flex flex-wrap justify-center gap-2">
                    {sections.map((s, idx) => (
                        <button
                            key={s.id}
                            onClick={() => setStep(idx)}
                            className={`px-3 py-1.5 rounded-full text-xs md:text-sm font-bold transition-all ${
                                step === idx 
                                ? 'bg-teal-600 text-white shadow-md' 
                                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100'
                            }`}
                        >
                            {s.title}
                        </button>
                    ))}
                </div>

                {/* Content Container */}
                <div className="bg-white border border-slate-200 rounded-3xl p-6 min-h-[500px] relative overflow-hidden shadow-sm">
                    
                    {step === 0 && (
                        <div className="animate-in fade-in space-y-8 text-center max-w-lg mx-auto py-10">
                            <h2 className="text-2xl font-bold text-slate-900">基础：哈希承诺</h2>
                            <p className="text-slate-600">
                                想象一个透明但坚不可摧的盒子。<br/>
                                你把字条放进去锁好（哈希）。大家能看到锁住的样子，但看不到字条内容。
                            </p>
                            
                            <div className="flex flex-col items-center gap-6">
                                <div className={`p-6 rounded-2xl border-2 transition-all duration-500 ${simpleOpen ? 'bg-emerald-50 border-emerald-500' : 'bg-white border-slate-200'}`}>
                                    {simpleOpen ? <Unlock className="w-12 h-12 text-emerald-500 mx-auto mb-2"/> : <Lock className="w-12 h-12 text-slate-400 mx-auto mb-2"/>}
                                    <div className="font-mono text-xl font-bold text-slate-800">
                                        {simpleOpen ? simpleSecret : simpleHash}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-2 uppercase">
                                        {simpleOpen ? '私钥 (原像)' : '公钥 (哈希值)'}
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setSimpleOpen(false)}
                                        disabled={!simpleOpen}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm ${!simpleOpen ? 'bg-slate-100 text-slate-400' : 'bg-slate-200 hover:bg-slate-300 text-slate-700'}`}
                                    >
                                        关上盒子
                                    </button>
                                    <button 
                                        onClick={() => setSimpleOpen(true)}
                                        disabled={simpleOpen}
                                        className={`px-4 py-2 rounded-lg font-bold text-sm ${simpleOpen ? 'bg-slate-100 text-slate-400' : 'bg-teal-600 hover:bg-teal-500 text-white shadow-lg'}`}
                                    >
                                        打开盒子
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 1 && bit0Pair && (
                        <div className="animate-in fade-in space-y-8 max-w-xl mx-auto py-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">进阶：如何表达 "Yes" 或 "No"？</h2>
                                <p className="text-slate-600 text-sm">
                                    一个盒子只能证明“我有钥匙”。为了传递信息，我们需要<span className="font-bold">两个盒子</span>。
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-8 items-end">
                                <div className="flex flex-col items-center gap-4">
                                    <span className="text-cyan-600 font-bold text-lg">代表 "0"</span>
                                    <SecretBox label="Box 0" secret={bit0Pair.zero.secret} hash={bit0Pair.zero.hash} isOpen={bitChoice === 0} color="blue"/>
                                    <button onClick={() => setBitChoice(0)} disabled={bitChoice !== null} className="w-full py-2 bg-cyan-50 text-cyan-600 border border-cyan-200 rounded-lg hover:bg-cyan-100 disabled:opacity-50">打开 Box 0</button>
                                </div>
                                <div className="flex flex-col items-center gap-4">
                                    <span className="text-rose-600 font-bold text-lg">代表 "1"</span>
                                    <SecretBox label="Box 1" secret={bit0Pair.one.secret} hash={bit0Pair.one.hash} isOpen={bitChoice === 1} color="red"/>
                                    <button onClick={() => setBitChoice(1)} disabled={bitChoice !== null} className="w-full py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-lg hover:bg-rose-100 disabled:opacity-50">打开 Box 1</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="text-center">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">生成完整密钥</h2>
                                <p className="text-slate-600 text-sm">
                                    我们要签 3 个比特的消息（例如 "011"），所以需要 <span className="font-bold">3 对盒子</span>。
                                </p>
                            </div>
                            <div className="grid grid-cols-3 gap-4">
                                {[0, 1, 2].map(row => (
                                    <div key={row} className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex flex-col items-center gap-3">
                                        <span className="text-xs font-bold text-slate-500 bg-white border border-slate-200 px-2 py-1 rounded">第 {row+1} 组</span>
                                        <div className="w-full space-y-2">
                                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                                                <div className="w-6 h-6 rounded bg-cyan-100 text-cyan-700 flex items-center justify-center text-xs font-bold">0</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] text-slate-400">公钥: {keys[row][0].hash}</div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 p-2 bg-white rounded border border-slate-200">
                                                <div className="w-6 h-6 rounded bg-rose-100 text-rose-700 flex items-center justify-center text-xs font-bold">1</div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="text-[10px] text-slate-400">公钥: {keys[row][1].hash}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-center">
                                <button onClick={() => setStep(3)} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">去签名 <ArrowRight className="w-4 h-4"/></button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center justify-between gap-4">
                                <div>
                                    <div className="text-sm font-bold text-slate-500 mb-1">选择消息</div>
                                    <div className="flex gap-2">
                                        {msg.split('').map((bit, i) => (
                                            <button key={i} onClick={() => { const newMsg = msg.split(''); newMsg[i] = bit === '0' ? '1' : '0'; signMessage(newMsg.join('')); }} className={`w-10 h-10 rounded-lg font-bold text-xl border-b-4 active:border-b-0 active:translate-y-1 transition-all ${bit === '0' ? 'bg-cyan-500 border-cyan-700 text-white' : 'bg-rose-500 border-rose-700 text-white'}`}>{bit}</button>
                                        ))}
                                    </div>
                                </div>
                                <button onClick={() => { signMessage(msg); setStep(4); }} className="bg-teal-600 hover:bg-teal-500 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">生成签名并验证 <ArrowRight className="w-4 h-4"/></button>
                            </div>
                            <div className="grid grid-cols-3 gap-4 md:gap-8">
                                {[0, 1, 2].map(row => {
                                    const bit = msg[row];
                                    const isZero = bit === '0';
                                    return (
                                        <div key={row} className="relative pt-8">
                                            <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-8 ${isZero ? 'bg-cyan-400' : 'bg-rose-400'}`}></div>
                                            <div className={`p-2 rounded-xl border-2 space-y-3 ${isZero ? 'bg-cyan-50 border-cyan-200' : 'bg-rose-50 border-rose-200'}`}>
                                                <SecretBox label="0" secret={keys[row][0].secret} hash={keys[row][0].hash} isOpen={revealed.has(`${row}-0`)} color="blue"/>
                                                <SecretBox label="1" secret={keys[row][1].secret} hash={keys[row][1].hash} isOpen={revealed.has(`${row}-1`)} color="red"/>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="grid gap-4">
                                {msg.split('').map((bit, idx) => {
                                    const isChecking = verifyStep === idx;
                                    const isChecked = verifyStep > idx;
                                    const revealedKey = bit === '0' ? keys[idx][0].secret : keys[idx][1].secret;
                                    const originalHash = bit === '0' ? keys[idx][0].hash : keys[idx][1].hash;

                                    return (
                                        <div key={idx} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${isChecking ? 'bg-indigo-50 border-indigo-200 ring-1 ring-indigo-200' : 'bg-white border-slate-200'}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="font-bold text-slate-500">Bit {idx}</span>
                                                <div className="flex flex-col"><span className="text-xs text-slate-400">收到的字条</span><span className="font-mono font-bold text-slate-800">{revealedKey}</span></div>
                                                <ArrowRight className="text-slate-300"/>
                                                <div className="flex flex-col"><span className="text-xs text-slate-400">执行哈希</span><span className="font-mono text-teal-600">Hash({revealedKey})</span></div>
                                                <div className="text-xl font-bold text-slate-300">==</div>
                                                <div className="flex flex-col"><span className="text-xs text-slate-400">公钥盒子</span><span className="font-mono text-slate-500">{originalHash}</span></div>
                                            </div>
                                            <div>
                                                {isChecked ? <div className="flex items-center gap-2 text-teal-600 font-bold"><CheckCircle2 className="w-6 h-6"/> 匹配</div> : isChecking ? <Fingerprint className="w-6 h-6 text-indigo-500 animate-pulse" /> : <div className="w-6 h-6 rounded-full border-2 border-slate-200"></div>}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-center gap-4">
                                <button onClick={() => setVerifyStep(prev => Math.min(prev + 1, 3))} disabled={verifyStep >= 3} className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 text-white px-8 py-2 rounded-full font-bold flex items-center gap-2">{verifyStep >= 3 ? '验证完成' : '验证下一位'} <ShieldCheck className="w-4 h-4"/></button>
                                {verifyStep >= 3 && <button onClick={() => setStep(5)} className="text-slate-500 hover:text-teal-600 px-4 py-2 text-sm">继续: 看看缺点 &rarr;</button>}
                            </div>
                        </div>
                    )}

                    {step === 5 && (
                        <div className="animate-in fade-in space-y-6">
                            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex items-center gap-4">
                                <AlertTriangle className="w-8 h-8 text-amber-500 flex-shrink-0" />
                                <div>
                                    <h3 className="font-bold text-amber-700">为什么只能用一次？</h3>
                                    <p className="text-sm text-amber-600">
                                        每个比特只有两个盒子。如果你先签了 "0"（暴露了左边），又签了 "1"（暴露了右边），黑客就拥有了这一行的<span className="font-bold">所有钥匙</span>。
                                    </p>
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="text-sm font-bold text-slate-400">你的操作 (地址复用)</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['000', '111', '010', '101'].map(m => (
                                            <button key={m} onClick={() => hackSign(m)} className="bg-white border border-slate-200 hover:bg-slate-50 p-2 rounded text-sm font-mono flex justify-between items-center group"><span>签 "{m}"</span><ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity"/></button>
                                        ))}
                                    </div>
                                    <button onClick={() => setHackHistory(new Set())} className="text-xs text-slate-500 flex items-center gap-1"><RefreshCw className="w-3 h-3"/> 重置</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-sm font-bold text-red-500 flex items-center gap-2"><Eye className="w-4 h-4"/> 黑客收集的钥匙</div>
                                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                                        {[0, 1, 2].map(row => {
                                            const has0 = hackHistory.has(`${row}-0`);
                                            const has1 = hackHistory.has(`${row}-1`);
                                            const compromised = has0 && has1;
                                            return (
                                                <div key={row} className={`flex justify-between items-center p-2 rounded border ${compromised ? 'bg-red-50 border-red-200' : 'border-slate-200 bg-white'}`}>
                                                    <span className="text-xs font-mono text-slate-500">Row {row}</span>
                                                    <div className="flex gap-2">
                                                        <span className={`text-xs px-2 py-0.5 rounded ${has0 ? 'bg-cyan-100 text-cyan-700' : 'bg-slate-100 text-slate-400'}`}>0 Key</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded ${has1 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-400'}`}>1 Key</span>
                                                    </div>
                                                    {compromised && <AlertTriangle className="w-4 h-4 text-red-500 animate-pulse"/>}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LamportDemo;