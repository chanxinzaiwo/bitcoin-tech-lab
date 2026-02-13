import React, { useState, useMemo } from 'react';
import { Coins, Calculator, Zap, Target, RefreshCw, CheckCircle, XCircle, AlertTriangle, ArrowRight, Scale, TrendingDown, Shuffle, Filter, BarChart3 } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

interface UTXO {
    id: string;
    value: number; // satoshis
    age: number; // blocks since confirmed
    selected: boolean;
}

const CoinSelectionDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    // Interactive simulation state
    const [utxos, setUtxos] = useState<UTXO[]>([
        { id: 'utxo1', value: 50000, age: 1000, selected: false },
        { id: 'utxo2', value: 100000, age: 500, selected: false },
        { id: 'utxo3', value: 25000, age: 2000, selected: false },
        { id: 'utxo4', value: 200000, age: 100, selected: false },
        { id: 'utxo5', value: 75000, age: 1500, selected: false },
        { id: 'utxo6', value: 30000, age: 800, selected: false },
        { id: 'utxo7', value: 150000, age: 300, selected: false },
        { id: 'utxo8', value: 10000, age: 3000, selected: false },
    ]);

    const [targetAmount, setTargetAmount] = useState(180000);
    const [feeRate, setFeeRate] = useState(10); // sat/vB
    const [algorithm, setAlgorithm] = useState<'manual' | 'largest' | 'smallest' | 'branch_bound' | 'random'>('manual');

    const INPUT_SIZE = 68; // vB per input (P2WPKH)
    const OUTPUT_SIZE = 31; // vB per output
    const OVERHEAD = 10; // vB transaction overhead

    const selectedUtxos = useMemo(() => utxos.filter(u => u.selected), [utxos]);
    const totalSelected = useMemo(() => selectedUtxos.reduce((sum, u) => sum + u.value, 0), [selectedUtxos]);
    const txSize = useMemo(() => OVERHEAD + selectedUtxos.length * INPUT_SIZE + 2 * OUTPUT_SIZE, [selectedUtxos]);
    const fee = useMemo(() => txSize * feeRate, [txSize, feeRate]);
    const change = useMemo(() => totalSelected - targetAmount - fee, [totalSelected, targetAmount, fee]);

    const isValid = totalSelected >= targetAmount + fee;
    const hasExcessiveChange = change > targetAmount * 0.5;
    const hasDustChange = change > 0 && change < 546;

    const toggleUtxo = (id: string) => {
        if (algorithm !== 'manual') return;
        setUtxos(prev => prev.map(u => u.id === id ? { ...u, selected: !u.selected } : u));
    };

    const runAlgorithm = (algo: string) => {
        setAlgorithm(algo as typeof algorithm);
        let sorted: UTXO[] = [];
        let selected: string[] = [];
        let currentSum = 0;
        const target = targetAmount + OVERHEAD * feeRate + 2 * OUTPUT_SIZE * feeRate;

        switch (algo) {
            case 'largest':
                sorted = [...utxos].sort((a, b) => b.value - a.value);
                for (const utxo of sorted) {
                    if (currentSum >= target + sorted.filter(u => selected.includes(u.id)).length * INPUT_SIZE * feeRate) break;
                    selected.push(utxo.id);
                    currentSum += utxo.value;
                }
                break;

            case 'smallest':
                sorted = [...utxos].sort((a, b) => a.value - b.value);
                for (const utxo of sorted) {
                    if (currentSum >= target + sorted.filter(u => selected.includes(u.id)).length * INPUT_SIZE * feeRate) break;
                    selected.push(utxo.id);
                    currentSum += utxo.value;
                }
                break;

            case 'branch_bound':
                // Simplified: try to find exact match or closest
                const allSubsets: UTXO[][] = [];
                const n = utxos.length;
                for (let i = 0; i < (1 << n); i++) {
                    const subset: UTXO[] = [];
                    for (let j = 0; j < n; j++) {
                        if (i & (1 << j)) subset.push(utxos[j]);
                    }
                    const sum = subset.reduce((s, u) => s + u.value, 0);
                    const reqFee = (OVERHEAD + subset.length * INPUT_SIZE + 2 * OUTPUT_SIZE) * feeRate;
                    if (sum >= targetAmount + reqFee) {
                        allSubsets.push(subset);
                    }
                }
                // Find the one with least waste
                if (allSubsets.length > 0) {
                    allSubsets.sort((a, b) => {
                        const wasteA = a.reduce((s, u) => s + u.value, 0) - targetAmount - (OVERHEAD + a.length * INPUT_SIZE + 2 * OUTPUT_SIZE) * feeRate;
                        const wasteB = b.reduce((s, u) => s + u.value, 0) - targetAmount - (OVERHEAD + b.length * INPUT_SIZE + 2 * OUTPUT_SIZE) * feeRate;
                        return wasteA - wasteB;
                    });
                    selected = allSubsets[0].map(u => u.id);
                }
                break;

            case 'random':
                const shuffled = [...utxos].sort(() => Math.random() - 0.5);
                for (const utxo of shuffled) {
                    if (currentSum >= target + shuffled.filter(u => selected.includes(u.id)).length * INPUT_SIZE * feeRate) break;
                    selected.push(utxo.id);
                    currentSum += utxo.value;
                }
                break;

            default:
                return;
        }

        setUtxos(prev => prev.map(u => ({ ...u, selected: selected.includes(u.id) })));
    };

    const resetSelection = () => {
        setAlgorithm('manual');
        setUtxos(prev => prev.map(u => ({ ...u, selected: false })));
    };

    const regenerateUtxos = () => {
        const newUtxos: UTXO[] = [];
        for (let i = 0; i < 8; i++) {
            newUtxos.push({
                id: `utxo${i + 1}`,
                value: Math.floor(Math.random() * 190000) + 10000,
                age: Math.floor(Math.random() * 3000) + 100,
                selected: false,
            });
        }
        setUtxos(newUtxos);
        setAlgorithm('manual');
    };

    const formatSats = (sats: number) => {
        if (sats >= 100000000) return (sats / 100000000).toFixed(8) + ' BTC';
        return sats.toLocaleString() + ' sats';
    };

    const tabs = [
        { id: 'intro', label: '概念介绍' },
        { id: 'algorithms', label: '算法详解' },
        { id: 'interactive', label: '交互模拟' },
        { id: 'privacy', label: '隐私影响' },
        { id: 'optimization', label: '优化策略' },
        { id: 'quiz', label: '知识测验' },
    ];

    const quizData = getQuizByModule('coinselection');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Coins className="w-4 h-4" />
                        交易优化
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Coin Selection 币种选择</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
                        币种选择算法决定了构建交易时使用哪些 UTXO 作为输入，直接影响交易费用、隐私性和 UTXO 集合的健康度
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-amber-500 text-white'
                                    : isDarkMode
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={`rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6`}>
                    {activeTab === 'intro' && (
                        <div className="space-y-8">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Target className="w-5 h-5 text-amber-400" />
                                        什么是币种选择？
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                                        当你发送比特币时，钱包需要决定使用哪些 UTXO 作为交易输入。
                                        这个决策过程被称为<strong>币种选择 (Coin Selection)</strong>。
                                        选择不同的 UTXO 组合会产生不同的费用、找零金额和隐私影响。
                                    </p>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Scale className="w-5 h-5 text-emerald-400" />
                                        为什么重要？
                                    </h3>
                                    <ul className="space-y-2">
                                        {[
                                            '交易费用优化 - 减少输入数量可降低费用',
                                            '隐私保护 - 避免关联不同来源的资金',
                                            'UTXO 管理 - 保持健康的 UTXO 集合',
                                            '避免粉尘 - 防止产生无法花费的小额 UTXO',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* The Problem */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'}`}>
                                <h3 className="text-xl font-bold mb-4">核心挑战：背包问题</h3>
                                <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    币种选择本质上是一个<strong>变体背包问题 (Knapsack Problem)</strong>：
                                    从一组 UTXO 中选择子集，使得总值至少覆盖目标金额加手续费，同时最小化浪费。
                                </p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="text-2xl font-bold text-amber-400 mb-1">目标金额</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>发送给接收方的金额</div>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="text-2xl font-bold text-rose-400 mb-1">+ 手续费</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>取决于输入数量和费率</div>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="text-2xl font-bold text-emerald-400 mb-1">= 找零</div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>返回给自己的余额</div>
                                    </div>
                                </div>
                            </div>

                            {/* Key Concepts */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">关键概念</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            title: '粉尘 (Dust)',
                                            desc: '太小无法经济花费的 UTXO，通常 < 546 sats',
                                            icon: TrendingDown,
                                            color: 'rose'
                                        },
                                        {
                                            title: '找零输出',
                                            desc: '超出目标和费用的部分返回给自己',
                                            icon: ArrowRight,
                                            color: 'blue'
                                        },
                                        {
                                            title: '输入成本',
                                            desc: '每个输入增加约 68 vB 的交易大小',
                                            icon: Calculator,
                                            color: 'amber'
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 text-${item.color}-400 flex items-center justify-center mb-3`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold mb-1">{item.title}</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'algorithms' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">币种选择算法</h3>

                            <div className="space-y-6">
                                {[
                                    {
                                        name: 'Branch and Bound',
                                        desc: 'Bitcoin Core 默认算法，尝试找到无找零的精确匹配',
                                        color: 'emerald',
                                        pros: ['最小化浪费', '避免找零输出', '最优费用'],
                                        cons: ['计算量大', '可能失败', '需要回退算法'],
                                        complexity: 'O(2^n) 最坏情况'
                                    },
                                    {
                                        name: 'Largest First',
                                        desc: '优先选择最大的 UTXO，直到覆盖目标',
                                        color: 'blue',
                                        pros: ['简单快速', '减少输入数量', '清理大额 UTXO'],
                                        cons: ['可能产生大额找零', '隐私性差', '浪费较多'],
                                        complexity: 'O(n log n)'
                                    },
                                    {
                                        name: 'Smallest First',
                                        desc: '优先选择最小的 UTXO，整合碎片',
                                        color: 'amber',
                                        pros: ['整合粉尘', '减少 UTXO 数量', '长期优化'],
                                        cons: ['输入多费用高', '不适合高费率期', '交易大'],
                                        complexity: 'O(n log n)'
                                    },
                                    {
                                        name: 'Random Selection',
                                        desc: '随机选择 UTXO 直到满足条件',
                                        color: 'violet',
                                        pros: ['增加隐私性', '简单', '不可预测'],
                                        cons: ['可能次优', '费用不确定', '结果不稳定'],
                                        complexity: 'O(n)'
                                    },
                                    {
                                        name: 'Knapsack',
                                        desc: '动态规划求解背包问题变体',
                                        color: 'rose',
                                        pros: ['较优解', '平衡各因素', 'Bitcoin Core 回退'],
                                        cons: ['复杂', '近似解', '参数敏感'],
                                        complexity: 'O(nW)'
                                    },
                                ].map((algo, i) => (
                                    <div key={i} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex flex-col md:flex-row md:items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl bg-${algo.color}-500/20 flex items-center justify-center shrink-0`}>
                                                <Calculator className={`w-6 h-6 text-${algo.color}-400`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="text-lg font-bold">{algo.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                        {algo.complexity}
                                                    </span>
                                                </div>
                                                <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{algo.desc}</p>
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <span className="text-sm font-bold text-emerald-400">优点</span>
                                                        <ul className="mt-1 space-y-1">
                                                            {algo.pros.map((p, j) => (
                                                                <li key={j} className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                                    {p}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-rose-400">缺点</span>
                                                        <ul className="mt-1 space-y-1">
                                                            {algo.cons.map((c, j) => (
                                                                <li key={j} className={`text-sm flex items-center gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                                    <XCircle className="w-3 h-3 text-rose-400" />
                                                                    {c}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">币种选择模拟器</h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={regenerateUtxos}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
                                    >
                                        <Shuffle className="w-4 h-4" />
                                        新 UTXO
                                    </button>
                                    <button
                                        onClick={resetSelection}
                                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
                                    >
                                        <RefreshCw className="w-4 h-4" />
                                        重置
                                    </button>
                                </div>
                            </div>

                            {/* Parameters */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <label className="block font-bold mb-2">目标金额</label>
                                    <input
                                        type="range"
                                        min="50000"
                                        max="400000"
                                        step="10000"
                                        value={targetAmount}
                                        onChange={(e) => setTargetAmount(Number(e.target.value))}
                                        className="w-full mb-2"
                                    />
                                    <div className="text-center font-bold text-amber-400">{formatSats(targetAmount)}</div>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <label className="block font-bold mb-2">费率 (sat/vB)</label>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={feeRate}
                                        onChange={(e) => setFeeRate(Number(e.target.value))}
                                        className="w-full mb-2"
                                    />
                                    <div className="text-center font-bold text-rose-400">{feeRate} sat/vB</div>
                                </div>
                            </div>

                            {/* Algorithm Selector */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <label className="block font-bold mb-3">选择算法</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { id: 'manual', name: '手动选择' },
                                        { id: 'largest', name: '最大优先' },
                                        { id: 'smallest', name: '最小优先' },
                                        { id: 'branch_bound', name: 'Branch & Bound' },
                                        { id: 'random', name: '随机' },
                                    ].map(algo => (
                                        <button
                                            key={algo.id}
                                            onClick={() => algo.id === 'manual' ? resetSelection() : runAlgorithm(algo.id)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                algorithm === algo.id
                                                    ? 'bg-amber-500 text-white'
                                                    : isDarkMode
                                                        ? 'bg-slate-700 hover:bg-slate-600'
                                                        : 'bg-slate-200 hover:bg-slate-300'
                                            }`}
                                        >
                                            {algo.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* UTXO List */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-3">可用 UTXO</h4>
                                <div className="grid md:grid-cols-2 gap-2">
                                    {utxos.map(utxo => (
                                        <div
                                            key={utxo.id}
                                            onClick={() => toggleUtxo(utxo.id)}
                                            className={`p-3 rounded-lg cursor-pointer transition-all ${
                                                utxo.selected
                                                    ? 'bg-amber-500/20 border-2 border-amber-500'
                                                    : isDarkMode
                                                        ? 'bg-slate-900 hover:bg-slate-700 border-2 border-transparent'
                                                        : 'bg-white hover:bg-slate-50 border-2 border-transparent'
                                            } ${algorithm !== 'manual' ? 'cursor-not-allowed' : ''}`}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                        utxo.selected ? 'bg-amber-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                                                    }`}>
                                                        {utxo.selected && <CheckCircle className="w-4 h-4" />}
                                                    </div>
                                                    <span className="font-mono text-sm">{utxo.id}</span>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-bold text-amber-400">{formatSats(utxo.value)}</div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        {utxo.age} blocks old
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Results */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'}`}>
                                <h4 className="font-bold mb-4">交易摘要</h4>
                                <div className="grid md:grid-cols-4 gap-4 mb-4">
                                    <div>
                                        <span className="text-sm text-slate-500">已选输入</span>
                                        <div className="font-bold text-lg">{selectedUtxos.length} 个</div>
                                        <div className="text-emerald-400">{formatSats(totalSelected)}</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-500">交易大小</span>
                                        <div className="font-bold text-lg">{txSize} vB</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-500">手续费</span>
                                        <div className="font-bold text-lg text-rose-400">{formatSats(fee)}</div>
                                    </div>
                                    <div>
                                        <span className="text-sm text-slate-500">找零</span>
                                        <div className={`font-bold text-lg ${change < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                                            {change >= 0 ? formatSats(change) : '不足！'}
                                        </div>
                                    </div>
                                </div>

                                {/* Validation */}
                                <div className="space-y-2">
                                    <div className={`flex items-center gap-2 ${isValid ? 'text-emerald-400' : 'text-rose-400'}`}>
                                        {isValid ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
                                        <span>{isValid ? '金额足够' : '金额不足以支付目标和手续费'}</span>
                                    </div>
                                    {hasDustChange && (
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span>警告：找零为粉尘 ({formatSats(change)})</span>
                                        </div>
                                    )}
                                    {hasExcessiveChange && (
                                        <div className="flex items-center gap-2 text-amber-400">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span>提示：找零金额较大，可能存在更优选择</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">币种选择与隐私</h3>

                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-rose-900/20 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'}`}>
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-rose-400">
                                    <AlertTriangle className="w-5 h-5" />
                                    隐私风险
                                </h4>
                                <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    币种选择直接影响区块链分析者对你资金的追踪能力。当多个 UTXO 被用作同一交易的输入时，
                                    它们被假定属于同一个人（<strong>共同输入所有权假设</strong>）。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className="font-bold mb-4 text-rose-400">链上可见信息</h4>
                                    <ul className="space-y-3">
                                        {[
                                            '使用了哪些 UTXO 作为输入',
                                            '输入 UTXO 的来源历史',
                                            '找零输出（通常可识别）',
                                            '输出的金额和地址',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-400"></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className="font-bold mb-4 text-emerald-400">隐私保护策略</h4>
                                    <ul className="space-y-3">
                                        {[
                                            '避免混合不同来源的 UTXO',
                                            '使用 CoinJoin 增加混淆',
                                            '选择相同金额输出（PayJoin）',
                                            '随机化输出顺序',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Change Output Identification */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4">找零输出识别方法</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            method: '地址类型',
                                            desc: '找零地址通常与输入地址类型相同',
                                        },
                                        {
                                            method: '金额启发',
                                            desc: '圆整金额通常是支付，零散金额是找零',
                                        },
                                        {
                                            method: '输出顺序',
                                            desc: '某些钱包总是将找零放在特定位置',
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            <h5 className="font-bold mb-1">{item.method}</h5>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'optimization' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">优化策略</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: '低费率期间整合',
                                        icon: TrendingDown,
                                        color: 'emerald',
                                        desc: '当网络费率低时，主动整合小额 UTXO',
                                        tips: ['周末/凌晨费率通常较低', '一次整合多个粉尘', '未来使用更便宜']
                                    },
                                    {
                                        title: '高费率期间精选',
                                        icon: Zap,
                                        color: 'amber',
                                        desc: '网络拥堵时优先使用大额 UTXO',
                                        tips: ['减少输入数量', '避免使用粉尘', '考虑延迟交易']
                                    },
                                    {
                                        title: '批量处理',
                                        icon: Filter,
                                        color: 'blue',
                                        desc: '将多个支付合并到一笔交易',
                                        tips: ['减少总输出数', '分摊固定成本', '交易所常用']
                                    },
                                    {
                                        title: '无找零交易',
                                        icon: Target,
                                        color: 'violet',
                                        desc: '寻找精确匹配，避免产生找零',
                                        tips: ['Branch & Bound 算法', '减少一个输出', '增强隐私']
                                    },
                                ].map((strategy, i) => (
                                    <div key={i} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className={`w-12 h-12 rounded-xl bg-${strategy.color}-500/20 text-${strategy.color}-400 flex items-center justify-center mb-4`}>
                                            <strategy.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">{strategy.title}</h4>
                                        <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{strategy.desc}</p>
                                        <ul className="space-y-1">
                                            {strategy.tips.map((tip, j) => (
                                                <li key={j} className={`text-sm flex items-center gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    <CheckCircle className="w-3 h-3 text-emerald-400" />
                                                    {tip}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>

                            {/* UTXO Health */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20' : 'bg-gradient-to-r from-amber-100 to-orange-100 border border-amber-200'}`}>
                                <h4 className="font-bold mb-4 flex items-center gap-2">
                                    <BarChart3 className="w-5 h-5 text-amber-400" />
                                    健康的 UTXO 集合
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="font-bold text-emerald-400 mb-2">理想分布</div>
                                        <ul className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 多种面额的 UTXO</li>
                                            <li>• 避免过多粉尘</li>
                                            <li>• 有足够大额备用</li>
                                        </ul>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="font-bold text-amber-400 mb-2">定期维护</div>
                                        <ul className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 低费率期整合</li>
                                            <li>• 监控 UTXO 数量</li>
                                            <li>• 清理粉尘</li>
                                        </ul>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="font-bold text-rose-400 mb-2">避免</div>
                                        <ul className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 大量碎片化</li>
                                            <li>• 单一大额 UTXO</li>
                                            <li>• 忽视粉尘累积</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div>
                            {quizData ? (
                                <Quiz quizData={quizData} />
                            ) : (
                                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                    测验数据加载中...
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoinSelectionDemo;
