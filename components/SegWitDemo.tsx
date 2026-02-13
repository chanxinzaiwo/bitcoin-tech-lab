
import React, { useState } from 'react';
import { Scaling, Layers, Box, Scale, Percent, ShieldAlert, AlertTriangle, CheckCircle2, Lock, ArrowRight, RefreshCw, Hash, FileSignature, ShieldCheck, Zap, AlertCircle, Fingerprint, Scissors, Calculator, Wallet, TrendingUp, Info, Check, X, Copy, ExternalLink, Award } from 'lucide-react';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';
import Quiz from './Quiz';
import { segwitQuiz } from '../data/quizData';

const SegWitDemo = () => {
    const [activeTab, setActiveTab] = useState('problem');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'problem', label: '延展性攻击' },
        { id: 'solution', label: '隔离见证' },
        { id: 'benefit', label: '扩容降费' },
        { id: 'addresses', label: '地址类型' },
        { id: 'adoption', label: '采用情况' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-cyan-600 text-white p-1.5 rounded-full">
                                <Scaling className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>隔离见证 (SegWit)</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SegWit</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Tab Navigation */}
            <div className={`border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'} backdrop-blur-sm sticky top-16 z-30`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-1 overflow-x-auto py-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                                    activeTab === tab.id
                                        ? 'bg-cyan-500 text-white shadow-lg'
                                        : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'problem' && <ProblemView isDarkMode={isDarkMode} onNext={() => setActiveTab('solution')} />}
                {activeTab === 'solution' && <SolutionView isDarkMode={isDarkMode} onNext={() => setActiveTab('benefit')} />}
                {activeTab === 'benefit' && <BenefitView isDarkMode={isDarkMode} onNext={() => setActiveTab('addresses')} />}
                {activeTab === 'addresses' && <AddressTypesView isDarkMode={isDarkMode} />}
                {activeTab === 'adoption' && <AdoptionView isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// Tab 1: The Problem (Malleability)
const ProblemView = ({ isDarkMode, onNext }: { isDarkMode: boolean, onNext: () => void }) => {
    const [isAttacked, setIsAttacked] = useState(false);

    const txData = "To: Bob, Amt: 1.0 BTC";
    const sigOriginal = "30450221... (Valid)";
    const sigAttacked = "30450221... (Modified)";
    const currentSig = isAttacked ? sigAttacked : sigOriginal;

    const originalHash = "a1b2c3d4";
    const attackedHash = "f9e8d7c6";
    const currentHash = isAttacked ? attackedHash : originalHash;

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-8 h-8" /> 痛点：交易延展性 (Malleability)
                </h1>
                <p className="text-red-50 text-lg leading-relaxed max-w-3xl">
                    在旧版比特币中，<strong>签名</strong>是交易 ID (TXID) 计算的一部分。
                    黑客可以微调签名的格式（不改变有效性），从而改变整个交易的 ID。这会导致钱包无法追踪余额，甚至引发双花风险。
                </p>
                <div className="mt-6 grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">2014</div>
                        <div className="text-sm text-red-200">MtGox 延展性攻击事件</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">85万</div>
                        <div className="text-sm text-red-200">BTC 疑似因此损失</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-4">
                        <div className="text-2xl font-bold">2017</div>
                        <div className="text-sm text-red-200">SegWit 软分叉激活</div>
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Visual Representation */}
                <div className={`md:col-span-7 p-8 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${isAttacked ? 'border-red-500 bg-red-50/10' : (isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-slate-200 bg-white')}`}>
                    <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest opacity-50">Legacy Transaction</div>

                    <div className="flex flex-col items-center gap-6 relative z-10">

                        {/* 1. The Content */}
                        <div className={`w-full p-4 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-slate-50'}`}>
                            <div className="flex items-center gap-3 mb-2">
                                <FileSignature className="w-5 h-5 text-slate-500" />
                                <span className="font-mono text-sm">交易数据 (不可变)</span>
                            </div>
                            <div className="font-mono font-bold pl-8">{txData}</div>
                        </div>

                        <div className="text-2xl text-slate-400 font-bold">+</div>

                        {/* 2. The Signature (Vulnerable) */}
                        <div className={`w-full p-4 rounded-xl border-2 transition-all duration-300 ${isAttacked ? 'border-red-500 bg-red-100 text-red-800' : 'border-emerald-500 bg-emerald-50 text-emerald-800'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <Fingerprint className="w-5 h-5" />
                                    <span className="font-mono text-sm font-bold">解锁签名 (ScriptSig)</span>
                                </div>
                                {isAttacked && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold animate-pulse">TAMPERED</span>}
                            </div>
                            <div className="font-mono pl-8 break-all">{currentSig}</div>
                        </div>

                        <div className="flex flex-col items-center">
                            <div className={`h-8 w-0.5 ${isAttacked ? 'bg-red-400' : 'bg-slate-300'}`}></div>
                            <ArrowRight className={`w-6 h-6 rotate-90 ${isAttacked ? 'text-red-400' : 'text-slate-300'}`} />
                        </div>

                        {/* 3. The Resulting ID */}
                        <div className={`w-full p-6 rounded-2xl border-2 text-center transition-all duration-300 ${isAttacked ? 'border-red-500 bg-red-500 text-white shadow-lg shadow-red-500/30' : (isDarkMode ? 'border-slate-600 bg-slate-800 text-slate-300' : 'border-slate-200 bg-white text-slate-600')}`}>
                            <div className="text-xs uppercase opacity-70 mb-2 font-bold">Transaction ID (Hash)</div>
                            <div className="font-mono text-3xl font-black tracking-wider">{currentHash}</div>
                        </div>

                    </div>
                </div>

                {/* Controls & Explanation */}
                <div className="md:col-span-5 flex flex-col justify-center gap-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Zap className="w-5 h-5 text-orange-500" /> 攻击模拟器
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            黑客作为一个节点，拦截了你的交易，修改了签名（例如翻转 S 值），然后抢先广播到网络。
                        </p>

                        <button
                            onClick={() => setIsAttacked(!isAttacked)}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isAttacked ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'}`}
                        >
                            {isAttacked ? <RefreshCw className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                            {isAttacked ? "重置交易" : "发动延展性攻击"}
                        </button>
                    </div>

                    <div className={`p-4 rounded-xl border text-sm transition-all duration-300 ${isAttacked ? 'bg-red-50 border-red-200 text-red-800 opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <div className="font-bold mb-1 flex items-center gap-2">
                            <AlertCircle className="w-4 h-4" /> 后果严重：
                        </div>
                        <p>
                            Bob 收到了钱，但链上记录的 ID 是 <span className="font-mono font-bold">{attackedHash}</span>。
                            你的钱包还在等待 <span className="font-mono font-bold">{originalHash}</span> 确认。
                            <strong>结果：</strong> 你以为转账失败，可能会再次转账（双倍支付）。
                        </p>
                    </div>

                    <button
                        onClick={onNext}
                        className="mt-auto self-end flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-bold transition-colors"
                    >
                        查看解决方案 <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Tab 2: The Solution (SegWit)
const SolutionView = ({ isDarkMode, onNext }: { isDarkMode: boolean, onNext: () => void }) => {
    const [isAttacked, setIsAttacked] = useState(false);

    const txData = "To: Bob, Amt: 1.0 BTC";
    const sigOriginal = "30450221... (Valid)";
    const sigAttacked = "30450221... (Modified)";
    const currentSig = isAttacked ? sigAttacked : sigOriginal;
    const segwitID = "a1b2c3d4";

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <ShieldCheck className="w-8 h-8" /> 方案：隔离见证 (Segregated Witness)
                </h1>
                <p className="text-cyan-50 text-lg leading-relaxed max-w-3xl">
                    解决方案很简单：把签名（见证数据）从计算 ID 的原材料中<strong>"隔离"</strong>出去。
                    签名依然随交易发送以验证合法性，但不再影响交易的身份证 (TXID)。
                </p>
            </div>

            <div className="grid md:grid-cols-12 gap-8">
                {/* Visual Representation */}
                <div className={`md:col-span-7 p-8 rounded-3xl border-2 transition-all duration-300 relative overflow-hidden ${isDarkMode ? 'border-cyan-900 bg-slate-900' : 'border-cyan-100 bg-white'}`}>
                    <div className="absolute top-4 right-4 text-xs font-bold uppercase tracking-widest text-cyan-600 opacity-70">SegWit Transaction</div>

                    <div className="flex flex-row items-stretch gap-8 relative z-10 h-full">

                        {/* COLUMN 1: Main Body (Calculates ID) */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="text-xs text-center font-bold text-slate-400 uppercase">主要部分 (Base)</div>
                            <div className={`flex-1 p-4 rounded-xl border-2 border-dashed flex flex-col items-center justify-center gap-2 ${isDarkMode ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-slate-50'}`}>
                                <FileSignature className="w-8 h-8 text-slate-500" />
                                <div className="font-mono font-bold text-center">{txData}</div>
                            </div>

                            <div className="flex flex-col items-center">
                                <ArrowRight className="w-6 h-6 rotate-90 text-slate-300" />
                            </div>

                            <div className={`w-full p-4 rounded-2xl border-2 text-center transition-all duration-300 ${isDarkMode ? 'border-cyan-600 bg-cyan-900/20 text-cyan-400' : 'border-cyan-200 bg-cyan-50 text-cyan-700'}`}>
                                <div className="text-[10px] uppercase opacity-70 mb-1 font-bold">Transaction ID</div>
                                <div className="font-mono text-2xl font-black tracking-wider">{segwitID}</div>
                            </div>
                        </div>

                        {/* SEPARATOR: Scissors */}
                        <div className="w-px bg-slate-200 relative flex items-center justify-center">
                            <div className={`absolute p-2 rounded-full border ${isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-400'}`}>
                                <Scissors className="w-4 h-4" />
                            </div>
                        </div>

                        {/* COLUMN 2: Witness (Signature) */}
                        <div className="flex-1 flex flex-col gap-4">
                            <div className="text-xs text-center font-bold text-cyan-600 uppercase">见证部分 (Witness)</div>
                            <div className={`flex-1 p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-2 ${isAttacked ? 'border-red-400 bg-red-50 text-red-800' : 'border-cyan-400 bg-cyan-50 text-cyan-800'}`}>
                                <Fingerprint className="w-8 h-8" />
                                <div className="font-mono text-xs break-all text-center">{currentSig}</div>
                                {isAttacked && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">TAMPERED</span>}
                            </div>

                            <div className="text-[10px] text-center text-slate-400 mt-auto pb-6 px-2">
                                * 签名只用于验证，不参与 ID 计算
                            </div>
                        </div>

                    </div>
                </div>

                {/* Controls & Explanation */}
                <div className="md:col-span-5 flex flex-col justify-center gap-6">
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" /> 攻击无效化
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">
                            尝试同样的攻击。修改右侧"见证部分"的签名，观察左侧的 Transaction ID 是否会变化。
                        </p>

                        <button
                            onClick={() => setIsAttacked(!isAttacked)}
                            className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg active:scale-95 ${isAttacked ? 'bg-slate-200 text-slate-600 hover:bg-slate-300' : 'bg-red-500 hover:bg-red-600 text-white shadow-red-500/30'}`}
                        >
                            {isAttacked ? <RefreshCw className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5" />}
                            {isAttacked ? "重置签名" : "再次尝试攻击"}
                        </button>
                    </div>

                    <div className={`p-4 rounded-xl border text-sm transition-all duration-300 ${isAttacked ? 'bg-green-50 border-green-200 text-green-800 opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
                        <div className="font-bold mb-1 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" /> 攻击失败（好事）：
                        </div>
                        <p>
                            虽然签名变了，但 Transaction ID 依然是 <span className="font-mono font-bold">{segwitID}</span>。
                            延展性问题被彻底根除。
                        </p>
                    </div>

                    <button
                        onClick={onNext}
                        className="mt-auto self-end flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-bold transition-colors"
                    >
                        查看额外福利 <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Tab 3: The Benefit (Weight)
const BenefitView = ({ isDarkMode, onNext }: { isDarkMode: boolean, onNext: () => void }) => {
    const legacyCost = 500;
    const segwitCost = 275;
    const savings = Math.round(((legacyCost - segwitCost) / legacyCost) * 100);

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Scale className="w-8 h-8" /> 福利：打折的区块空间
                </h1>
                <p className="text-emerald-50 text-lg leading-relaxed max-w-3xl">
                    既然签名被隔离了，比特币协议决定给它一个"折扣"。
                    放在见证字段的数据，其计费重量只有原来的 1/4。这意味着同样的区块空间，能塞进更多交易，手续费也更便宜。
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Comparison Card */}
                <div className={`p-8 rounded-3xl border-2 shadow-sm h-full flex flex-col justify-center ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold text-xl mb-8 text-center ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>交易体积 (vByte) 计费对比</h3>

                    <div className="flex items-end justify-center gap-16 h-64">
                        {/* Legacy Bar */}
                        <div className="flex flex-col items-center gap-3 group w-32">
                            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden flex flex-col-reverse shadow-inner">
                                <div className="bg-slate-400 w-full transition-all duration-500 flex items-center justify-center text-white font-bold text-xs" style={{ height: '40%' }}>
                                    数据
                                </div>
                                <div className="bg-slate-500 w-full transition-all duration-500 flex items-center justify-center text-white font-bold text-xs" style={{ height: '60%' }}>
                                    签名
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-slate-400 uppercase">Legacy</div>
                                <div className="font-mono text-2xl font-black text-slate-600">{legacyCost} <span className="text-sm font-normal">vB</span></div>
                            </div>
                        </div>

                        {/* SegWit Bar */}
                        <div className="flex flex-col items-center gap-3 group w-32 relative">
                            <div className="absolute -top-12 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg animate-bounce">
                                -{savings}% OFF
                            </div>

                            <div className="relative w-full h-48 bg-slate-100 rounded-xl overflow-hidden flex flex-col-reverse shadow-inner">
                                <div className="bg-slate-400 w-full transition-all duration-500 flex items-center justify-center text-white font-bold text-xs" style={{ height: '40%' }}>
                                    数据
                                </div>
                                <div className="bg-emerald-500 w-full transition-all duration-500 flex items-center justify-center text-white font-bold text-xs relative" style={{ height: '15%' }}>
                                    <span className="absolute -top-6 text-emerald-600 text-[10px] font-bold">签名(1/4)</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <div className="text-xs font-bold text-emerald-500 uppercase">SegWit</div>
                                <div className="font-mono text-2xl font-black text-emerald-600">{segwitCost} <span className="text-sm font-normal">vB</span></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Explanation */}
                <div className="space-y-6">
                    <div className={`p-6 rounded-2xl border flex items-start gap-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`p-3 rounded-xl shadow-sm ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                            <Calculator className="w-6 h-6 text-slate-600" />
                        </div>
                        <div>
                            <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>权重单位 (Weight Units)</h4>
                            <p className="text-sm text-slate-500 leading-relaxed">
                                旧的区块限制是 1MB 大小。SegWit 把它改成了 400万权重单位 (4MWU)。
                                普通数据 1字节 = 4权重。
                                <span className="text-emerald-600 font-bold"> 见证数据 1字节 = 1权重。</span>
                            </p>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border flex items-start gap-4 ${isDarkMode ? 'bg-emerald-900/20 border-emerald-800' : 'bg-emerald-50 border-emerald-200'}`}>
                        <div className={`p-3 rounded-xl shadow-sm ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                            <Box className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div>
                            <h4 className={`font-bold text-lg mb-1 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-800'}`}>实际效果</h4>
                            <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-emerald-300' : 'text-emerald-700'}`}>
                                因为大部分交易数据都是签名（约占 60%），打折后，一个 SegWit 区块实际能塞下约 <strong>2MB</strong> 的真实数据。
                                这就是在不进行硬分叉的情况下实现的"软扩容"。
                            </p>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SegWit 带来的其他好处</h4>
                        <ul className="space-y-2 text-sm">
                            {[
                                '为闪电网络奠定基础（需要可靠的 TXID）',
                                '启用 Schnorr 签名和 Taproot 升级',
                                '简化二层协议的开发',
                                '提高脚本验证效率'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <button
                        onClick={onNext}
                        className="self-end flex items-center gap-2 text-cyan-500 hover:text-cyan-600 font-bold transition-colors"
                    >
                        查看地址类型 <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

// Tab 4: Address Types
const AddressTypesView = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const toast = useToast();
    const [selectedType, setSelectedType] = useState<string | null>(null);

    const addressTypes = [
        {
            id: 'legacy',
            name: 'Legacy (P2PKH)',
            prefix: '1...',
            example: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
            fee: '100%',
            color: 'slate',
            pros: ['最广泛兼容', '所有钱包都支持'],
            cons: ['手续费最贵', '不支持高级脚本'],
            bip: 'BIP-44'
        },
        {
            id: 'nested',
            name: 'Nested SegWit (P2SH-P2WPKH)',
            prefix: '3...',
            example: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
            fee: '~80%',
            color: 'blue',
            pros: ['兼容旧系统', '节省约 20% 手续费'],
            cons: ['不是最优费用', '地址较长'],
            bip: 'BIP-49'
        },
        {
            id: 'native',
            name: 'Native SegWit (P2WPKH)',
            prefix: 'bc1q...',
            example: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            fee: '~55%',
            color: 'cyan',
            pros: ['手续费最低', '地址最短', '支持 Bech32'],
            cons: ['少数老旧系统不支持'],
            bip: 'BIP-84'
        },
        {
            id: 'taproot',
            name: 'Taproot (P2TR)',
            prefix: 'bc1p...',
            example: 'bc1p5cyxnuxmeuwuvkwfem96lqzszd02n6xdcjrs20cac6yqjjwudpxqkedrcr',
            fee: '~55%',
            color: 'purple',
            pros: ['最新标准', '支持复杂智能合约', '隐私更好'],
            cons: ['采用率还在提升中'],
            bip: 'BIP-86'
        }
    ];

    const copyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        toast.success('已复制', '示例地址已复制到剪贴板');
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Wallet className="w-8 h-8" /> 比特币地址类型演进
                </h1>
                <p className="text-purple-100 text-lg leading-relaxed max-w-3xl">
                    随着 SegWit 和 Taproot 的引入，比特币地址格式不断演进。不同的地址类型有不同的特性、手续费和兼容性。
                </p>
            </div>

            {/* Address Type Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {addressTypes.map((type) => (
                    <div
                        key={type.id}
                        onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                        className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
                            selectedType === type.id
                                ? type.color === 'slate' ? 'border-slate-500 bg-slate-500/10' :
                                  type.color === 'blue' ? 'border-blue-500 bg-blue-500/10' :
                                  type.color === 'cyan' ? 'border-cyan-500 bg-cyan-500/10' :
                                  'border-purple-500 bg-purple-500/10'
                                : isDarkMode ? 'border-slate-800 bg-slate-900 hover:border-slate-700' : 'border-slate-200 bg-white hover:border-slate-300'
                        }`}
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div>
                                <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{type.name}</h3>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                    type.color === 'slate' ? 'bg-slate-500/20 text-slate-500' :
                                    type.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                                    type.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-500' :
                                    'bg-purple-500/20 text-purple-500'
                                }`}>
                                    {type.bip}
                                </span>
                            </div>
                            <div className={`text-right ${
                                type.color === 'slate' ? 'text-slate-500' :
                                type.color === 'blue' ? 'text-blue-500' :
                                type.color === 'cyan' ? 'text-cyan-500' :
                                'text-purple-500'
                            }`}>
                                <div className="text-2xl font-bold">{type.fee}</div>
                                <div className="text-xs opacity-70">相对手续费</div>
                            </div>
                        </div>

                        <div className={`p-3 rounded-lg mb-4 font-mono text-xs break-all ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className="flex items-center justify-between gap-2">
                                <span className="truncate">{type.example}</span>
                                <button
                                    onClick={(e) => { e.stopPropagation(); copyAddress(type.example); }}
                                    className="shrink-0 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded"
                                >
                                    <Copy className="w-3 h-3" />
                                </button>
                            </div>
                        </div>

                        {selectedType === type.id && (
                            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-700 animate-in fade-in">
                                <div>
                                    <div className="text-xs font-bold text-emerald-500 mb-2">优点</div>
                                    <ul className="space-y-1">
                                        {type.pros.map((pro, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <Check className="w-3 h-3 text-emerald-500" />
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{pro}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className="text-xs font-bold text-amber-500 mb-2">缺点</div>
                                    <ul className="space-y-1">
                                        {type.cons.map((con, i) => (
                                            <li key={i} className="flex items-center gap-2 text-sm">
                                                <X className="w-3 h-3 text-amber-500" />
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{con}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Recommendation */}
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-cyan-950/30 border border-cyan-900' : 'bg-cyan-50 border border-cyan-200'}`}>
                <h3 className="font-bold text-cyan-500 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    推荐使用
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>日常使用</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            优先使用 <strong>Native SegWit (bc1q...)</strong> 地址。手续费最低，兼容性已经很好，是 2024 年的最佳选择。
                        </p>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>高级用户</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            考虑使用 <strong>Taproot (bc1p...)</strong> 地址。支持更复杂的智能合约，隐私性更好，是未来的趋势。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Tab 5: Adoption
const AdoptionView = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const adoptionData = [
        { year: '2017 Q3', segwit: 0, taproot: 0, event: 'SegWit 激活 (区块481824)' },
        { year: '2018', segwit: 30, taproot: 0, event: '主流交易所开始支持' },
        { year: '2019', segwit: 40, taproot: 0, event: '钱包广泛采用' },
        { year: '2020', segwit: 50, taproot: 0, event: '持续增长' },
        { year: '2021 Q4', segwit: 70, taproot: 0.5, event: 'Taproot 激活 (区块709632)' },
        { year: '2022', segwit: 75, taproot: 3, event: 'Taproot 开始增长' },
        { year: '2023', segwit: 80, taproot: 10, event: 'Ordinals 推动 Taproot' },
        { year: '2024', segwit: 85, taproot: 20, event: '继续增长' }
    ];

    const milestones = [
        { date: '2015年12月', title: 'SegWit 提案 (BIP-141)', desc: 'Pieter Wuille 提出隔离见证方案' },
        { date: '2017年8月', title: 'SegWit 激活', desc: '在区块 481824 通过软分叉激活' },
        { date: '2017年8月', title: 'Bitcoin Cash 分叉', desc: '反对 SegWit 的阵营创建 BCH' },
        { date: '2018年1月', title: 'Lightning Network 主网', desc: '闪电网络基于 SegWit 上线' },
        { date: '2020年1月', title: 'Taproot 提案合并', desc: 'BIP-340/341/342 合并到 Bitcoin Core' },
        { date: '2021年11月', title: 'Taproot 激活', desc: '在区块 709632 通过软分叉激活' },
        { date: '2023年1月', title: 'Ordinals 协议', desc: '利用 Taproot 的新用例出现' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <TrendingUp className="w-8 h-8" /> SegWit 采用情况
                </h1>
                <p className="text-amber-50 text-lg leading-relaxed max-w-3xl">
                    SegWit 自 2017 年激活以来，采用率稳步增长。目前超过 80% 的比特币交易使用 SegWit 格式，有效降低了网络拥堵和用户手续费。
                </p>
            </div>

            {/* Adoption Chart */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold text-lg mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    采用率趋势 (%)
                </h3>
                <div className="space-y-4">
                    {adoptionData.map((item, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <div className={`w-20 text-sm font-mono shrink-0 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {item.year}
                            </div>
                            <div className="flex-1">
                                <div className="flex gap-1 h-8">
                                    <div
                                        className="bg-cyan-500 rounded-l transition-all duration-500 flex items-center justify-end pr-2"
                                        style={{ width: `${item.segwit}%` }}
                                    >
                                        {item.segwit > 20 && <span className="text-white text-xs font-bold">{item.segwit}%</span>}
                                    </div>
                                    {item.taproot > 0 && (
                                        <div
                                            className="bg-purple-500 rounded-r transition-all duration-500 flex items-center justify-center"
                                            style={{ width: `${item.taproot}%` }}
                                        >
                                            {item.taproot > 5 && <span className="text-white text-xs font-bold">{item.taproot}%</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className={`text-xs w-48 shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {item.event}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex gap-6 mt-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-cyan-500 rounded"></div>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>SegWit</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-purple-500 rounded"></div>
                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Taproot</span>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`font-bold text-lg mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    发展历程
                </h3>
                <div className="relative">
                    <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className="space-y-6">
                        {milestones.map((item, i) => (
                            <div key={i} className="flex gap-4 relative">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                    i <= 3 ? 'bg-cyan-500' : 'bg-purple-500'
                                } text-white`}>
                                    <Check className="w-4 h-4" />
                                </div>
                                <div className={`flex-1 pb-6 ${i === milestones.length - 1 ? '' : 'border-b border-slate-200 dark:border-slate-800'}`}>
                                    <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {item.date}
                                    </div>
                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Current Stats */}
            <div className="grid md:grid-cols-4 gap-4">
                {[
                    { label: '当前 SegWit 采用率', value: '~85%', color: 'cyan' },
                    { label: 'Taproot 采用率', value: '~20%', color: 'purple' },
                    { label: '平均节省手续费', value: '~40%', color: 'emerald' },
                    { label: '支持的钱包', value: '99%+', color: 'amber' }
                ].map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'} border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                        <div className={`text-3xl font-bold ${
                            stat.color === 'cyan' ? 'text-cyan-500' :
                            stat.color === 'purple' ? 'text-purple-500' :
                            stat.color === 'emerald' ? 'text-emerald-500' :
                            'text-amber-500'
                        }`}>
                            {stat.value}
                        </div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{stat.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Quiz Section
const QuizSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                    <Award className="w-8 h-8 text-cyan-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    隔离见证知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对 SegWit 的理解
                </p>
            </div>
            <Quiz quizData={segwitQuiz} />
        </div>
    );
};

export default SegWitDemo;
