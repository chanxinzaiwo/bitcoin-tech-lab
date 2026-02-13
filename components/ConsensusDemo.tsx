import React, { useState, useEffect, useRef } from 'react';
import { GitMerge, Network, AlertTriangle, Play, RefreshCw, CheckCircle2, AlertCircle, ArrowRight, Zap, ZoomIn, ZoomOut, Maximize, Move, Plus, GitBranch, MousePointer2, Hammer, Clock, Shield, Info, Check, X, Scale, Users, Cpu, Lock, Award } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { consensusQuiz } from '../data/quizData';

// --- Types ---

interface Block {
    id: string;
    prevId: string | null;
    height: number;
    miner: string;
    isCanonical: boolean;
    y: number;
}

interface Node {
    id: string;
    name: string;
    currentTipId: string;
    color: string;
    colorHex: string;
}

// --- Main Container ---

const ConsensusDemo = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'sim', label: '分叉模拟' },
        { id: 'finality', label: '确认与终局' },
        { id: 'compare', label: '共识对比' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-purple-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-purple-600 text-white p-1.5 rounded-full">
                                <GitMerge className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Nakamoto 共识</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>共识</span>
                        </div>
                        <div className="flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-purple-500/10 text-purple-500'
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection isDarkMode={isDarkMode} changeTab={setActiveTab} />}
                {activeTab === 'sim' && <ConsensusPlayground isDarkMode={isDarkMode} />}
                {activeTab === 'finality' && <FinalitySection isDarkMode={isDarkMode} />}
                {activeTab === 'compare' && <CompareSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

const IntroSection = ({ isDarkMode, changeTab }: { isDarkMode: boolean, changeTab: (tab: string) => void }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">去中心化的真理</h1>
            <p className="text-purple-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                在没有中央银行的情况下，谁来决定账本的唯一版本？
                比特币依靠"最长链原则"：如果有两份不同的账本（分叉），算力投入最多的那一份就是真理。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">10分钟</div>
                    <div className="text-sm text-purple-200">平均出块时间</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">51%</div>
                    <div className="text-sm text-purple-200">攻击所需最小算力</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">6次</div>
                    <div className="text-sm text-purple-200">推荐确认数</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('sim')}
                className="mt-8 bg-white text-purple-700 hover:bg-purple-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                开始模拟分叉 <ArrowRight className="h-5 w-5" />
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card isDarkMode={isDarkMode} title="意外分叉" icon={<GitMerge className="h-8 w-8 text-purple-500" />}>
                当两名矿工几乎同时挖出区块时，网络会短暂分裂。一部分节点认为 A 是最新的，另一部分认为 B 是最新的。
            </Card>
            <Card isDarkMode={isDarkMode} title="算力投票" icon={<Zap className="h-8 w-8 text-purple-500" />}>
                矿工们会选择他们看到的"最长链"继续挖矿。这实际上是在用算力进行投票，因为只有在最长链上的区块奖励才是有效的。
            </Card>
            <Card isDarkMode={isDarkMode} title="链重组 (Reorg)" icon={<RefreshCw className="h-8 w-8 text-purple-500" />}>
                一旦某条分叉链变得更长，所有诚实节点都会抛弃短链（上面的区块变成孤块），切换到长链上。这是共识达成的时刻。
            </Card>
        </div>

        {/* Nakamoto Consensus Rules */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                中本聪共识规则
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {[
                    { rule: '最长链规则', desc: '永远选择累积工作量最多的链作为有效链', icon: Scale },
                    { rule: '独立验证', desc: '每个节点独立验证每个区块和交易的有效性', icon: Shield },
                    { rule: '工作量证明', desc: '新区块必须包含有效的 PoW 才会被接受', icon: Cpu },
                    { rule: '概率性终局', desc: '交易确认数越多，被撤销的概率指数级降低', icon: Lock }
                ].map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <div key={i} className={`flex items-start gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                            <div className="p-2 rounded-lg bg-purple-500/10">
                                <Icon className="w-5 h-5 text-purple-500" />
                            </div>
                            <div>
                                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.rule}</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);

const Card = ({ isDarkMode, title, icon, children }: any) => (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
    </div>
);

// Finality Section
const FinalitySection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [confirmations, setConfirmations] = useState(6);

    const confirmationLevels = [
        { confs: 0, safety: '无', risk: '极高', desc: '交易刚广播，未被挖入区块', color: 'red' },
        { confs: 1, safety: '低', risk: '高', desc: '已进入区块，但可能被重组', color: 'orange' },
        { confs: 2, safety: '较低', risk: '中等', desc: '重组概率约 25%（假设攻击者有 10% 算力）', color: 'amber' },
        { confs: 3, safety: '中等', risk: '较低', desc: '重组概率约 2.5%', color: 'yellow' },
        { confs: 6, safety: '高', risk: '很低', desc: '比特币核心推荐标准，重组概率 < 0.1%', color: 'emerald' },
        { confs: 12, safety: '很高', risk: '极低', desc: '交易所大额提款标准', color: 'cyan' },
        { confs: 100, safety: '极高', risk: '接近零', desc: '几乎不可能被重组', color: 'blue' }
    ];

    // Calculate probability (simplified model)
    const attackerHashrate = 0.1; // 10%
    const probability = Math.pow(attackerHashrate / (1 - attackerHashrate), confirmations);
    const probabilityPercent = (probability * 100).toFixed(confirmations > 6 ? 10 : 4);

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Clock className="w-8 h-8" /> 确认数与终局性
                </h1>
                <p className="text-emerald-50 text-lg leading-relaxed max-w-3xl">
                    比特币没有绝对的"终局性"，而是"概率性终局"。每增加一个区块确认，交易被撤销的概率就会指数级下降。
                    这就是为什么交易所需要等待多次确认。
                </p>
            </div>

            {/* Interactive Calculator */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    确认数安全计算器
                </h3>

                <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-6">
                        <div>
                            <label className="text-sm font-bold text-slate-500 mb-2 block">确认数</label>
                            <input
                                type="range" min="0" max="20" value={confirmations}
                                onChange={(e) => setConfirmations(Number(e.target.value))}
                                className="w-full accent-purple-500"
                            />
                            <div className="flex justify-between text-sm mt-1">
                                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{confirmations} 次确认</span>
                                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>≈ {confirmations * 10} 分钟</span>
                            </div>
                        </div>

                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className="text-sm text-slate-500 mb-1">重组概率（假设攻击者有 10% 算力）</div>
                            <div className={`text-3xl font-bold ${confirmations >= 6 ? 'text-emerald-500' : confirmations >= 3 ? 'text-amber-500' : 'text-red-500'}`}>
                                {confirmations === 0 ? '100%' : probabilityPercent + '%'}
                            </div>
                            <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                公式: (q/p)^n，其中 q=攻击者算力，p=诚实算力，n=确认数
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className={`p-4 rounded-xl ${
                            confirmations >= 6 ? isDarkMode ? 'bg-emerald-950/50 border border-emerald-900' : 'bg-emerald-50 border border-emerald-200' :
                            confirmations >= 3 ? isDarkMode ? 'bg-amber-950/50 border border-amber-900' : 'bg-amber-50 border border-amber-200' :
                            isDarkMode ? 'bg-red-950/50 border border-red-900' : 'bg-red-50 border border-red-200'
                        }`}>
                            <div className={`text-sm font-bold mb-2 ${
                                confirmations >= 6 ? 'text-emerald-500' :
                                confirmations >= 3 ? 'text-amber-500' : 'text-red-500'
                            }`}>
                                安全评估
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                {confirmations === 0 && '交易尚未确认，随时可能被双花或丢弃。不要接受 0 确认的付款！'}
                                {confirmations === 1 && '交易已进入区块，但单次确认仍有较高重组风险。只适合小额交易。'}
                                {confirmations >= 2 && confirmations < 6 && '安全性逐渐提升，但对于大额交易仍建议等待更多确认。'}
                                {confirmations >= 6 && confirmations < 12 && '已达到比特币核心推荐的安全标准。对于大多数交易来说足够安全。'}
                                {confirmations >= 12 && '极高安全性，适用于大额交易和交易所提款。'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Confirmation Levels Table */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        确认数安全等级参考
                    </h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
                            <tr>
                                <th className="text-left p-4 font-bold">确认数</th>
                                <th className="text-left p-4 font-bold">等待时间</th>
                                <th className="text-left p-4 font-bold">安全等级</th>
                                <th className="text-left p-4 font-bold">适用场景</th>
                            </tr>
                        </thead>
                        <tbody>
                            {confirmationLevels.map((level, i) => (
                                <tr key={i} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <td className="p-4 font-mono font-bold">{level.confs}</td>
                                    <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>~{level.confs * 10} 分钟</td>
                                    <td className="p-4">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                            level.color === 'red' ? 'bg-red-500/20 text-red-500' :
                                            level.color === 'orange' ? 'bg-orange-500/20 text-orange-500' :
                                            level.color === 'amber' ? 'bg-amber-500/20 text-amber-500' :
                                            level.color === 'yellow' ? 'bg-yellow-500/20 text-yellow-600' :
                                            level.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-500' :
                                            level.color === 'cyan' ? 'bg-cyan-500/20 text-cyan-500' :
                                            'bg-blue-500/20 text-blue-500'
                                        }`}>
                                            {level.safety}
                                        </span>
                                    </td>
                                    <td className={`p-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{level.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Compare Section
const CompareSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const consensusMechanisms = [
        {
            name: 'Nakamoto 共识 (PoW)',
            used: 'Bitcoin, Litecoin',
            pros: ['最久经考验', '完全去中心化', '无需许可参与', '抗审查性强'],
            cons: ['能源消耗大', '确认慢', 'TPS 较低'],
            finality: '概率性 (~60分钟)',
            decentralization: '高',
            security: '极高'
        },
        {
            name: 'Proof of Stake (PoS)',
            used: 'Ethereum 2.0, Cardano',
            pros: ['能源效率高', '更快的终局性', 'TPS 较高'],
            cons: ['富者愈富', '长程攻击风险', '需要质押'],
            finality: '概率性/确定性 (~15分钟)',
            decentralization: '中等',
            security: '高'
        },
        {
            name: 'PBFT 类共识',
            used: 'Hyperledger',
            pros: ['即时终局', '高 TPS', '无需代币'],
            cons: ['节点数量受限', '需要许可', '中心化风险'],
            finality: '确定性 (~秒级)',
            decentralization: '低',
            security: '中等'
        },
        {
            name: 'DPoS',
            used: 'EOS, TRON',
            pros: ['极高 TPS', '快速确认', '用户可投票'],
            cons: ['代理集中', '卡特尔风险', '21 个节点争议'],
            finality: '准确定性 (~秒级)',
            decentralization: '低',
            security: '中等'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Scale className="w-8 h-8" /> 共识机制对比
                </h1>
                <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl">
                    不同的区块链使用不同的共识机制。每种机制都有其权衡：去中心化、安全性、性能三者难以兼得（区块链不可能三角）。
                </p>
            </div>

            {/* Comparison Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {consensusMechanisms.map((mech, i) => (
                    <div key={i} className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mech.name}</h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>使用者: {mech.used}</p>

                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="text-xs text-slate-500">终局性</div>
                                <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{mech.finality}</div>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="text-xs text-slate-500">去中心化</div>
                                <div className={`text-sm font-bold ${mech.decentralization === '高' ? 'text-emerald-500' : mech.decentralization === '中等' ? 'text-amber-500' : 'text-red-500'}`}>{mech.decentralization}</div>
                            </div>
                            <div className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="text-xs text-slate-500">安全性</div>
                                <div className={`text-sm font-bold ${mech.security === '极高' || mech.security === '高' ? 'text-emerald-500' : 'text-amber-500'}`}>{mech.security}</div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <div className="text-xs font-bold text-emerald-500 mb-1">优点</div>
                                <div className="flex flex-wrap gap-1">
                                    {mech.pros.map((pro, j) => (
                                        <span key={j} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'}`}>
                                            {pro}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <div className="text-xs font-bold text-red-500 mb-1">缺点</div>
                                <div className="flex flex-wrap gap-1">
                                    {mech.cons.map((con, j) => (
                                        <span key={j} className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-red-500/10 text-red-400' : 'bg-red-50 text-red-700'}`}>
                                            {con}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Why PoW */}
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-purple-950/30 border border-purple-900' : 'bg-purple-50 border border-purple-200'}`}>
                <h3 className="font-bold text-purple-500 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    为什么比特币坚持使用 PoW？
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <ul className="space-y-2">
                            {[
                                'PoW 是唯一经过 15+ 年实战检验的共识机制',
                                '真正的"无需许可"参与，任何人都可以挖矿',
                                '没有"富者愈富"的内生问题',
                                '物理世界的能源消耗提供不可伪造的成本'
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <p className={`text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            <strong className="text-purple-500">中本聪的设计哲学：</strong> 比特币的目标不是成为"最快的支付系统"，而是成为"最安全、最去中心化的货币基础层"。在此之上，闪电网络等二层方案解决速度问题。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

const ConsensusPlayground = ({ isDarkMode }: { isDarkMode: boolean }) => {
    // --- State ---
    const [blocks, setBlocks] = useState<Block[]>([
        { id: '00', prevId: null, height: 0, miner: 'Satoshi', isCanonical: true, y: 0 }
    ]);

    const [nodes, setNodes] = useState<Node[]>([
        { id: 'n1', name: 'Node A (USA)', currentTipId: '00', color: 'bg-blue-500', colorHex: '#3b82f6' },
        { id: 'n2', name: 'Node B (EU)', currentTipId: '00', color: 'bg-indigo-500', colorHex: '#6366f1' },
        { id: 'n3', name: 'Node C (CN)', currentTipId: '00', color: 'bg-emerald-500', colorHex: '#10b981' },
    ]);

    const [view, setView] = useState({ x: 50, y: 300, k: 0.8 });
    const isDragging = useRef(false);
    const lastPos = useRef({ x: 0, y: 0 });

    // --- Helpers ---

    const getLongestTip = (currentBlocks: Block[]) => {
        return [...currentBlocks].sort((a,b) => b.height - a.height || b.id.localeCompare(a.id))[0];
    };

    const getTips = (currentBlocks: Block[]) => {
        const parentIds = new Set(currentBlocks.map(b => b.prevId).filter(Boolean));
        return currentBlocks.filter(b => !parentIds.has(b.id)).sort((a,b) => b.height - a.height);
    };

    const recalculateCanonical = (currentBlocks: Block[]) => {
        const bestTip = getLongestTip(currentBlocks);

        const canonicalIds = new Set<string>();
        let curr: Block | undefined = bestTip;
        while (curr) {
            canonicalIds.add(curr.id);
            curr = currentBlocks.find(b => b.id === curr?.prevId);
        }

        return currentBlocks.map(b => ({
            ...b,
            isCanonical: canonicalIds.has(b.id)
        }));
    };

    // --- Actions ---

    const mineBlock = (parentId?: string) => {
        setBlocks(prev => {
            const parent = parentId
                ? prev.find(b => b.id === parentId)!
                : getLongestTip(prev);

            const newId = Math.random().toString(36).substring(2, 4).toUpperCase();
            const newBlock: Block = {
                id: newId,
                prevId: parent.id,
                height: parent.height + 1,
                miner: 'Miner',
                isCanonical: false,
                y: parent.y
            };

            const nextBlocks = [...prev, newBlock];
            const updated = recalculateCanonical(nextBlocks);

            const tips = getTips(updated);
            const maxH = Math.max(...tips.map(t => t.height));
            const bestTips = tips.filter(t => t.height === maxH);

            setNodes(ns => ns.map((n, i) => {
                if (bestTips.length > 1) {
                    const targetTip = bestTips[i % bestTips.length];
                    return { ...n, currentTipId: targetTip.id };
                } else {
                    return { ...n, currentTipId: bestTips[0].id };
                }
            }));

            return updated;
        });
    };

    const createFork = (parentId?: string) => {
        setBlocks(prev => {
            const parent = parentId
                ? prev.find(b => b.id === parentId)!
                : getLongestTip(prev);

            const idA = Math.random().toString(36).substring(2, 4).toUpperCase();
            const idB = Math.random().toString(36).substring(2, 4).toUpperCase();

            const spread = 80;

            const blockA: Block = {
                id: idA, prevId: parent.id, height: parent.height + 1,
                miner: 'Miner A', isCanonical: false,
                y: parent.y - spread
            };
            const blockB: Block = {
                id: idB, prevId: parent.id, height: parent.height + 1,
                miner: 'Miner B', isCanonical: false,
                y: parent.y + spread
            };

            const nextBlocks = [...prev, blockA, blockB];
            const updated = recalculateCanonical(nextBlocks);

            const tips = getTips(updated);
            const maxH = Math.max(...tips.map(t => t.height));
            const bestTips = tips.filter(t => t.height === maxH);

            setNodes(ns => ns.map((n, i) => {
                if (bestTips.length > 1) {
                    const targetTip = bestTips[i % bestTips.length];
                    return { ...n, currentTipId: targetTip.id };
                }
                return { ...n, currentTipId: bestTips[0].id };
            }));

            return updated;
        });
    };

    const reset = () => {
        setBlocks([{ id: '00', prevId: null, height: 0, miner: 'Satoshi', isCanonical: true, y: 0 }]);
        setNodes(nodes.map(n => ({ ...n, currentTipId: '00' })));
        setView({ x: 50, y: 300, k: 0.8 });
    };

    // --- Interactive Graph Handlers ---
    const handleMouseDown = (e: React.MouseEvent) => {
        isDragging.current = true;
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging.current) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        setView(prev => ({ ...prev, x: prev.x + dx, y: prev.y + dy }));
        lastPos.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => { isDragging.current = false; };
    const handleWheel = (e: React.WheelEvent) => {
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        setView(prev => ({ ...prev, k: Math.max(0.2, Math.min(3, prev.k * delta)) }));
    };

    const tips = getTips(blocks);
    const hasFork = tips.length > 1;
    const maxHeight = Math.max(...tips.map(t => t.height));
    const competingTips = tips.filter(t => t.height >= maxHeight - 1);

    return (
        <div className="flex flex-col gap-6 animate-in fade-in">

            <div className="grid md:grid-cols-2 gap-6">

                {/* Controls */}
                <div className={`border p-6 rounded-2xl shadow-sm flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                        <Network className="w-5 h-5 text-purple-600"/> 上帝视角控制台
                    </h3>

                    <div className="flex-1 space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => mineBlock()}
                                className="py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:scale-95 transition-all"
                            >
                                <div className="flex items-center gap-2"><Play className="w-4 h-4" /> 正常挖矿</div>
                                <span className="text-[10px] opacity-80 font-normal">在最长链延伸</span>
                            </button>
                            <button
                                onClick={() => createFork()}
                                className={`py-3 border-2 rounded-xl font-bold flex flex-col items-center justify-center gap-1 active:scale-95 transition-all ${isDarkMode ? 'bg-slate-800 border-purple-500/30 text-purple-400 hover:border-purple-400' : 'bg-white border-purple-100 text-purple-700 hover:border-purple-300 hover:bg-purple-50'}`}
                            >
                                <div className="flex items-center gap-2"><GitBranch className="w-4 h-4" /> 制造分叉</div>
                                <span className="text-[10px] opacity-70 font-normal">分裂当前最长链</span>
                            </button>
                        </div>

                        {hasFork && competingTips.length > 1 && (
                            <div className={`animate-in fade-in slide-in-from-top-2 rounded-xl p-3 ${isDarkMode ? 'bg-amber-950/50 border border-amber-900' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className={`text-xs font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-800'}`}>
                                    <AlertTriangle className="w-3 h-3" />
                                    网络分裂中：请选择支持哪一方
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    {competingTips.map((tip) => (
                                        <button
                                            key={tip.id}
                                            onClick={() => mineBlock(tip.id)}
                                            className={`flex flex-col items-center justify-center py-2 px-3 border rounded-lg transition-colors shadow-sm ${isDarkMode ? 'bg-slate-800 border-amber-700 hover:bg-amber-900/30' : 'bg-white border-amber-300 hover:bg-amber-100'}`}
                                        >
                                            <span className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>区块 #{tip.id}</span>
                                            <span className={`text-[10px] ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>高度: {tip.height}</span>
                                            {tip.isCanonical && <span className="text-[10px] text-green-600 font-bold mt-0.5">(当前最长)</span>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className={`rounded-lg p-3 border max-h-[160px] overflow-y-auto custom-scrollbar ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className={`text-xs font-bold uppercase mb-2 flex justify-between items-center ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                <span className="flex items-center gap-1"><GitBranch className="w-3 h-3"/> 所有分支 ({tips.length})</span>
                            </div>
                            <div className="space-y-2">
                                {tips.map(tip => (
                                    <div key={tip.id} className={`flex items-center justify-between p-2 rounded border transition-all ${tip.isCanonical ? isDarkMode ? 'bg-emerald-950/30 border-emerald-900' : 'bg-white border-emerald-200 shadow-sm' : isDarkMode ? 'bg-slate-800 border-slate-700 opacity-80' : 'bg-slate-100 border-slate-200 opacity-80 hover:opacity-100'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className={`w-2 h-2 rounded-full ${tip.isCanonical ? 'bg-emerald-500' : 'bg-slate-400'}`}></span>
                                            <span className={`font-mono font-bold text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>#{tip.id}</span>
                                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>H:{tip.height}</span>
                                        </div>
                                        <div className="flex gap-1 items-center">
                                            <button
                                                onClick={() => mineBlock(tip.id)}
                                                className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-emerald-600 text-slate-300 hover:text-white' : 'bg-slate-200 hover:bg-emerald-500 text-slate-600 hover:text-white'}`}
                                            >
                                                <Hammer className="w-3 h-3"/> 挖矿
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`pt-4 mt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                        <button onClick={reset} className={`w-full py-2 text-sm flex items-center justify-center gap-2 transition-colors ${isDarkMode ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}>
                            <RefreshCw className="w-3 h-3" /> 重置区块链
                        </button>
                    </div>
                </div>

                {/* Node Status */}
                <div className={`border p-6 rounded-2xl shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>网络节点状态</h3>
                    <div className="space-y-3">
                        {nodes.map(n => (
                            <div key={n.id} className={`flex items-center justify-between p-3 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-100'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${n.color}`}></div>
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{n.name}</span>
                                </div>
                                <div className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                    Tip: <span className={`font-bold px-1.5 py-0.5 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-300' : 'bg-white border-slate-200 text-slate-700'}`}>{n.currentTipId}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className={`mt-6 p-3 rounded-lg border text-xs leading-relaxed ${isDarkMode ? 'bg-blue-950/30 border-blue-900 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'}`}>
                        <p className="font-bold mb-1 flex items-center gap-1"><MousePointer2 className="w-3 h-3"/> 玩法说明:</p>
                        当出现分叉时，网络会分裂。点击 <strong>挖矿</strong> 按钮在某条分支上挖矿。一旦某条链变长，所有节点都会倒戈（Reorg）。
                    </div>
                </div>
            </div>

            {/* Visualization */}
            <div className={`rounded-2xl border shadow-inner flex flex-col h-[500px] overflow-hidden relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>

                <div
                    className="flex-1 relative cursor-grab active:cursor-grabbing overflow-hidden"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onWheel={handleWheel}
                >
                    <div className={`absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(${isDarkMode ? '#475569' : '#cbd5e1'}_1px,transparent_1px)] [background-size:20px_20px]`}></div>

                    <div
                        className="absolute left-0 top-0 w-full h-full pointer-events-none"
                        style={{
                            transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})`,
                            transformOrigin: '0 0'
                        }}
                    >
                        <svg className="overflow-visible absolute top-0 left-0">
                            {blocks.map(b => {
                                if (!b.prevId) return null;
                                const parent = blocks.find(p => p.id === b.prevId);
                                if (!parent) return null;

                                return (
                                    <line
                                        key={`line-${b.id}`}
                                        x1={parent.height * 140 + 48} y1={parent.y}
                                        x2={b.height * 140} y2={b.y}
                                        stroke={b.isCanonical ? '#10b981' : isDarkMode ? '#475569' : '#cbd5e1'}
                                        strokeWidth="3"
                                        strokeDasharray={b.isCanonical ? '' : '5'}
                                    />
                                );
                            })}
                        </svg>

                        {blocks.map(b => (
                            <div
                                key={b.id}
                                className={`absolute w-12 h-12 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-500 z-10 shadow-sm
                                    ${b.isCanonical
                                        ? 'bg-emerald-50 border-emerald-500 text-emerald-700 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                        : isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-400 opacity-80' : 'bg-white border-slate-300 text-slate-400 opacity-80'
                                    }`}
                                style={{
                                    transform: `translate(${b.height * 140}px, ${b.y}px) translate(-50%, -50%)`,
                                    left: 0, top: 0
                                }}
                            >
                                <span className="font-bold text-xs">{b.id}</span>
                                <span className="text-[8px] opacity-70">#{b.height}</span>

                                <div className="absolute -bottom-6 flex gap-1 whitespace-nowrap pointer-events-none">
                                    {nodes.filter(n => n.currentTipId === b.id).map(n => (
                                        <div key={n.id} className={`w-3 h-3 rounded-full ${n.color} border-2 border-white shadow-sm`} />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                        <button onClick={() => setView(v => ({ ...v, k: Math.min(v.k + 0.2, 3) }))} className={`p-2 rounded-lg shadow border ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}><ZoomIn className="w-4 h-4"/></button>
                        <button onClick={() => setView(v => ({ ...v, k: Math.max(v.k - 0.2, 0.2) }))} className={`p-2 rounded-lg shadow border ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}><ZoomOut className="w-4 h-4"/></button>
                        <button onClick={() => setView({ x: 50, y: 300, k: 0.8 })} className={`p-2 rounded-lg shadow border ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-400' : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'}`}><Maximize className="w-4 h-4"/></button>
                    </div>
                    <div className={`absolute top-4 left-4 backdrop-blur px-3 py-2 rounded-lg text-xs border shadow-sm pointer-events-none flex items-center gap-2 ${isDarkMode ? 'bg-slate-800/90 border-slate-700 text-slate-400' : 'bg-white/90 border-slate-200 text-slate-500'}`}>
                        <Move className="w-3 h-3" /> 拖动平移 / 滚动缩放
                    </div>
                </div>

                <div className={`border-t p-4 text-sm shrink-0 z-20 min-h-[80px] ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600'}`}>
                    {!hasFork ? (
                        <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-emerald-950/30 border-emerald-900 text-emerald-400' : 'bg-emerald-50 border-emerald-100 text-emerald-700'}`}>
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            <span>网络达成共识。所有节点都在同一条最长链上工作。</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2">
                            <div className={`flex items-center gap-3 p-3 rounded-lg border font-bold ${isDarkMode ? 'bg-amber-950/30 border-amber-900 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-700'}`}>
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <span>检测到分叉！共识暂时破裂。</span>
                            </div>
                            <p className={`px-3 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                当前网络存在 {tips.length} 个竞争分支。
                                矿工正在 <span className="font-mono font-bold">#{getLongestTip(blocks).id}</span> (高度 {getLongestTip(blocks).height}) 上工作。
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

// Quiz Section
const QuizSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                    <Award className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    共识机制知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对 Nakamoto 共识的理解
                </p>
            </div>
            <Quiz quizData={consensusQuiz} />
        </div>
    );
};

export default ConsensusDemo;
