import React, { useState, useMemo } from 'react';
import { ArrowUp, Zap, Clock, AlertTriangle, Info, Check, ChevronRight, Layers, Calculator, TrendingUp, ArrowRight, DollarSign, Package } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { cpfpQuiz } from '../data/quizData';

type TabType = 'intro' | 'mechanism' | 'calculation' | 'simulator' | 'comparison' | 'quiz';

interface Transaction {
    id: string;
    name: string;
    size: number; // vbytes
    fee: number; // sats
    feeRate: number; // sats/vB
    status: 'pending' | 'confirmed';
}

const CPFPDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    // CPFP 模拟器状态
    const [parentTx, setParentTx] = useState<Transaction>({
        id: 'parent_tx_001',
        name: '父交易',
        size: 250,
        fee: 500,
        feeRate: 2,
        status: 'pending'
    });

    const [targetFeeRate, setTargetFeeRate] = useState<number>(20);
    const [childTxSize, setChildTxSize] = useState<number>(150);

    // 计算子交易需要支付的费用
    const calculations = useMemo(() => {
        const totalSize = parentTx.size + childTxSize;
        const totalFeeNeeded = totalSize * targetFeeRate;
        const childFeeNeeded = totalFeeNeeded - parentTx.fee;
        const childFeeRate = childFeeNeeded / childTxSize;
        const effectiveFeeRate = totalFeeNeeded / totalSize;

        return {
            totalSize,
            totalFeeNeeded,
            childFeeNeeded: Math.max(0, childFeeNeeded),
            childFeeRate: Math.max(0, childFeeRate),
            effectiveFeeRate
        };
    }, [parentTx, targetFeeRate, childTxSize]);

    const tabs = [
        { id: 'intro', label: '简介', icon: Info },
        { id: 'mechanism', label: '工作原理', icon: Layers },
        { id: 'calculation', label: '费用计算', icon: Calculator },
        { id: 'simulator', label: 'CPFP 模拟器', icon: Zap },
        { id: 'comparison', label: 'CPFP vs RBF', icon: TrendingUp },
        { id: 'quiz', label: '测验', icon: Check },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-green-900/30 via-emerald-900/20 to-teal-900/30' : 'bg-gradient-to-r from-green-100 via-emerald-50 to-teal-100'} py-12 px-6`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-green-500/20' : 'bg-green-500/10'}`}>
                            <ArrowUp className="w-8 h-8 text-green-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">CPFP 子付父</h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Child Pays For Parent - 加速未确认交易
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mt-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-green-500 text-white'
                                        : isDarkMode
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* 简介 */}
                {activeTab === 'intro' && (
                    <div className="space-y-8">
                        {/* 核心概念 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <ArrowUp className="w-5 h-5 text-green-500" />
                                什么是 CPFP？
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                CPFP (Child Pays For Parent，子付父) 是一种交易加速技术。当一笔交易因手续费过低而卡在内存池时，
                                交易的<strong>接收方</strong>可以创建一笔新交易（子交易），支付足够高的手续费来"拉动"原交易（父交易）一起被打包。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center mb-3">
                                        <Clock className="w-5 h-5 text-green-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">解决卡交易</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        当父交易手续费过低导致长时间未确认时使用
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                                        <DollarSign className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">接收方发起</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        由交易接收方创建子交易，而非发送方
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-3">
                                        <Package className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">打包激励</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        矿工为获取子交易高手续费，必须先打包父交易
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 使用场景 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">典型使用场景</h2>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">场景 1：紧急收款</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        你在等待一笔付款，但发送方设置的手续费太低，交易一直未确认。
                                        你需要尽快使用这笔资金，于是创建一笔 CPFP 交易来加速。
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-emerald-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-emerald-400 mb-2">场景 2：发送方无法操作</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        发送方的钱包不支持 RBF，或者发送方无法再次操作（如交易所提现）。
                                        此时接收方可以通过 CPFP 自行加速交易。
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-teal-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-teal-400 mb-2">场景 3：找零加速</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        你发送了一笔交易后发现手续费设置太低。如果交易有找零输出（返回给你自己的 UTXO），
                                        你可以花费这个找零来创建 CPFP 加速原交易。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 核心原理图示 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">CPFP 原理图示</h2>
                            <div className="flex flex-col md:flex-row items-center justify-center gap-4 py-6">
                                {/* 父交易 */}
                                <div className={`p-4 rounded-lg border-2 border-orange-500/50 ${isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50'} w-full md:w-48`}>
                                    <div className="text-center">
                                        <div className="text-orange-400 font-bold mb-2">父交易</div>
                                        <div className="text-sm text-slate-400">手续费: 2 sat/vB</div>
                                        <div className="text-xs text-orange-400 mt-2">⏳ 卡住未确认</div>
                                    </div>
                                </div>

                                <ArrowRight className="w-8 h-8 text-slate-500 rotate-90 md:rotate-0" />

                                {/* 子交易 */}
                                <div className={`p-4 rounded-lg border-2 border-green-500/50 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'} w-full md:w-48`}>
                                    <div className="text-center">
                                        <div className="text-green-400 font-bold mb-2">子交易</div>
                                        <div className="text-sm text-slate-400">手续费: 50 sat/vB</div>
                                        <div className="text-xs text-green-400 mt-2">💰 高手续费</div>
                                    </div>
                                </div>

                                <ArrowRight className="w-8 h-8 text-slate-500 rotate-90 md:rotate-0" />

                                {/* 结果 */}
                                <div className={`p-4 rounded-lg border-2 border-blue-500/50 ${isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50'} w-full md:w-48`}>
                                    <div className="text-center">
                                        <div className="text-blue-400 font-bold mb-2">打包结果</div>
                                        <div className="text-sm text-slate-400">有效费率: 20 sat/vB</div>
                                        <div className="text-xs text-blue-400 mt-2">✓ 一起被确认</div>
                                    </div>
                                </div>
                            </div>
                            <p className={`text-center text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mt-4`}>
                                矿工必须先打包父交易，才能获取子交易的高手续费
                            </p>
                        </div>
                    </div>
                )}

                {/* 工作原理 */}
                {activeTab === 'mechanism' && (
                    <div className="space-y-8">
                        {/* 依赖关系 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-green-500" />
                                交易依赖关系
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                CPFP 利用了比特币交易的依赖特性：子交易花费父交易的输出，
                                因此子交易的有效性依赖于父交易先被确认。
                            </p>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="text-sm overflow-x-auto">
{`父交易 (Parent Transaction)
├── 输入: 之前的 UTXO
└── 输出:
    ├── Output 0: 给接收方 (1 BTC)    ← 子交易花费这个
    └── Output 1: 找零 (0.5 BTC)

子交易 (Child Transaction)
├── 输入: 父交易的 Output 0          ← 依赖父交易
└── 输出:
    └── Output 0: 新地址 (0.999 BTC)  (扣除高手续费)`}
                                </pre>
                            </div>
                        </div>

                        {/* 矿工视角 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">矿工的选择逻辑</h2>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">祖先费率 (Ancestor Fee Rate)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>
                                        矿工在选择交易时，会计算每笔交易的"祖先费率"——即该交易及其所有未确认祖先交易的总费用除以总大小。
                                    </p>
                                    <div className={`p-3 rounded bg-slate-900 font-mono text-sm`}>
                                        祖先费率 = (父交易费用 + 子交易费用) / (父交易大小 + 子交易大小)
                                    </div>
                                </div>

                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-emerald-400 mb-2">打包决策</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                            如果子交易的祖先费率足够高，矿工会将父子交易一起打包
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                            矿工获得的是父子交易的总手续费，而非单独的子交易费用
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                                            子交易必须在父交易之后被确认，因此矿工会按正确顺序打包
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 内存池处理 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">内存池中的 CPFP</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-amber-400 mb-3">链长度限制</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Bitcoin Core 默认限制未确认交易链的长度为 25 笔交易，
                                        总大小不超过 101KB。超过限制的交易会被拒绝进入内存池。
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-blue-400 mb-3">Package Relay (BIP 331)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        新提案允许节点以"包"的形式接收和验证交易，
                                        使得低费率父交易和高费率子交易可以一起被评估和传播。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 注意事项 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                                使用注意事项
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                                    <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        <strong>需要可花费输出：</strong>接收方必须拥有父交易的某个输出（如收款地址）才能创建子交易
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                                    <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        <strong>费用来自子交易：</strong>加速费用从你要花费的 UTXO 中扣除，减少了可用金额
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 mt-1" />
                                    <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        <strong>钱包支持：</strong>需要钱包支持花费未确认输出，有些钱包可能禁止此操作
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 费用计算 */}
                {activeTab === 'calculation' && (
                    <div className="space-y-8">
                        {/* 计算公式 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Calculator className="w-5 h-5 text-green-500" />
                                CPFP 费用计算公式
                            </h2>
                            <div className="space-y-6">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="font-bold text-green-400 mb-3">目标：让父子交易包达到目标费率</h3>
                                    <div className="space-y-3 font-mono text-sm">
                                        <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            目标总费用 = (父交易大小 + 子交易大小) × 目标费率
                                        </div>
                                        <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            子交易费用 = 目标总费用 - 父交易已付费用
                                        </div>
                                        <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            子交易费率 = 子交易费用 / 子交易大小
                                        </div>
                                    </div>
                                </div>

                                {/* 示例计算 */}
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">计算示例</h3>
                                    <div className="space-y-2 text-sm">
                                        <p><strong>已知条件：</strong></p>
                                        <ul className={`ml-4 space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <li>• 父交易大小：250 vB，已付手续费：500 sats (2 sat/vB)</li>
                                            <li>• 子交易大小：150 vB</li>
                                            <li>• 目标费率：20 sat/vB</li>
                                        </ul>
                                        <p className="mt-4"><strong>计算过程：</strong></p>
                                        <div className={`p-3 rounded font-mono ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                            <p>目标总费用 = (250 + 150) × 20 = 8,000 sats</p>
                                            <p>子交易费用 = 8,000 - 500 = 7,500 sats</p>
                                            <p className="text-green-400">子交易费率 = 7,500 / 150 = 50 sat/vB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 费率分析 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">费率放大效应</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                由于子交易需要"补贴"父交易的费用不足，子交易的实际费率通常会远高于目标费率：
                            </p>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                                            <th className="text-left py-3 px-4">父交易费率</th>
                                            <th className="text-left py-3 px-4">目标费率</th>
                                            <th className="text-left py-3 px-4">子交易费率</th>
                                            <th className="text-left py-3 px-4">放大倍数</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4">1 sat/vB</td>
                                            <td className="py-3 px-4">20 sat/vB</td>
                                            <td className="py-3 px-4 text-green-400">51.3 sat/vB</td>
                                            <td className="py-3 px-4">2.57x</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4">2 sat/vB</td>
                                            <td className="py-3 px-4">20 sat/vB</td>
                                            <td className="py-3 px-4 text-green-400">50 sat/vB</td>
                                            <td className="py-3 px-4">2.50x</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4">5 sat/vB</td>
                                            <td className="py-3 px-4">20 sat/vB</td>
                                            <td className="py-3 px-4 text-green-400">45 sat/vB</td>
                                            <td className="py-3 px-4">2.25x</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4">10 sat/vB</td>
                                            <td className="py-3 px-4">20 sat/vB</td>
                                            <td className="py-3 px-4 text-green-400">36.7 sat/vB</td>
                                            <td className="py-3 px-4">1.83x</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <p className={`text-xs mt-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                * 假设父交易 250vB，子交易 150vB
                            </p>
                        </div>
                    </div>
                )}

                {/* CPFP 模拟器 */}
                {activeTab === 'simulator' && (
                    <div className="space-y-8">
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-green-500" />
                                CPFP 费用计算器
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* 输入区 */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-300">父交易信息</h3>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            父交易大小 (vBytes)
                                        </label>
                                        <input
                                            type="number"
                                            value={parentTx.size}
                                            onChange={(e) => setParentTx({
                                                ...parentTx,
                                                size: parseInt(e.target.value) || 0,
                                                feeRate: parentTx.fee / (parseInt(e.target.value) || 1)
                                            })}
                                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} border focus:ring-2 focus:ring-green-500`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            父交易已付费用 (sats)
                                        </label>
                                        <input
                                            type="number"
                                            value={parentTx.fee}
                                            onChange={(e) => setParentTx({
                                                ...parentTx,
                                                fee: parseInt(e.target.value) || 0,
                                                feeRate: (parseInt(e.target.value) || 0) / parentTx.size
                                            })}
                                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} border focus:ring-2 focus:ring-green-500`}
                                        />
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            当前费率: {parentTx.feeRate.toFixed(2)} sat/vB
                                        </p>
                                    </div>

                                    <h3 className="font-bold text-slate-300 mt-6">CPFP 设置</h3>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            子交易大小 (vBytes)
                                        </label>
                                        <input
                                            type="number"
                                            value={childTxSize}
                                            onChange={(e) => setChildTxSize(parseInt(e.target.value) || 0)}
                                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} border focus:ring-2 focus:ring-green-500`}
                                        />
                                    </div>
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            目标有效费率 (sat/vB)
                                        </label>
                                        <input
                                            type="number"
                                            value={targetFeeRate}
                                            onChange={(e) => setTargetFeeRate(parseInt(e.target.value) || 0)}
                                            className={`w-full px-4 py-3 rounded-lg ${isDarkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-slate-200'} border focus:ring-2 focus:ring-green-500`}
                                        />
                                    </div>
                                </div>

                                {/* 结果区 */}
                                <div className="space-y-4">
                                    <h3 className="font-bold text-slate-300">计算结果</h3>

                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <div className="text-sm text-slate-400 mb-1">交易包总大小</div>
                                        <div className="text-2xl font-bold text-white">
                                            {calculations.totalSize} <span className="text-sm text-slate-400">vBytes</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <div className="text-sm text-slate-400 mb-1">需要的总费用</div>
                                        <div className="text-2xl font-bold text-white">
                                            {calculations.totalFeeNeeded.toLocaleString()} <span className="text-sm text-slate-400">sats</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg border-2 border-green-500/50 ${isDarkMode ? 'bg-green-500/10' : 'bg-green-50'}`}>
                                        <div className="text-sm text-green-400 mb-1">子交易需付费用</div>
                                        <div className="text-2xl font-bold text-green-400">
                                            {calculations.childFeeNeeded.toLocaleString()} <span className="text-sm">sats</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <div className="text-sm text-slate-400 mb-1">子交易费率</div>
                                        <div className="text-2xl font-bold text-amber-400">
                                            {calculations.childFeeRate.toFixed(2)} <span className="text-sm text-slate-400">sat/vB</span>
                                        </div>
                                        <div className="text-xs text-slate-500 mt-1">
                                            是目标费率的 {(calculations.childFeeRate / targetFeeRate).toFixed(2)}x
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <div className="text-sm text-slate-400 mb-1">有效组合费率</div>
                                        <div className="text-2xl font-bold text-blue-400">
                                            {calculations.effectiveFeeRate.toFixed(2)} <span className="text-sm text-slate-400">sat/vB</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 可视化 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h3 className="font-bold mb-4">费用构成可视化</h3>
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>父交易费用</span>
                                        <span>{parentTx.fee.toLocaleString()} sats</span>
                                    </div>
                                    <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full"
                                            style={{ width: `${(parentTx.fee / calculations.totalFeeNeeded) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>子交易费用</span>
                                        <span>{calculations.childFeeNeeded.toLocaleString()} sats</span>
                                    </div>
                                    <div className="h-6 bg-slate-700 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-green-500 rounded-full"
                                            style={{ width: `${(calculations.childFeeNeeded / calculations.totalFeeNeeded) * 100}%` }}
                                        />
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <div className="flex justify-between">
                                        <span className="font-bold">总费用</span>
                                        <span className="font-bold text-green-400">{calculations.totalFeeNeeded.toLocaleString()} sats</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CPFP vs RBF */}
                {activeTab === 'comparison' && (
                    <div className="space-y-8">
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-green-500" />
                                CPFP vs RBF 对比
                            </h2>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                                            <th className="text-left py-3 px-4">特性</th>
                                            <th className="text-left py-3 px-4">CPFP (子付父)</th>
                                            <th className="text-left py-3 px-4">RBF (费用替换)</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">发起方</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">接收方</span>（或发送方的找零）
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-blue-400">发送方</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">前置条件</td>
                                            <td className="py-3 px-4">需要可花费的未确认输出</td>
                                            <td className="py-3 px-4">原交易需标记 RBF (nSequence &lt; 0xfffffffe)</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">链上占用</td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">增加</span>（需要额外交易）
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">相同</span>（替换原交易）
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">费用效率</td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">较低</span>（需补贴父交易）
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">较高</span>（只付差额）
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">可修改内容</td>
                                            <td className="py-3 px-4">无法修改父交易</td>
                                            <td className="py-3 px-4">可修改输出地址和金额</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">交易取消</td>
                                            <td className="py-3 px-4">
                                                <span className="text-red-400">不支持</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">支持</span>（发回自己）
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 选择建议 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">何时使用哪种方法？</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">使用 CPFP</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 你是交易接收方</li>
                                        <li>• 发送方无法或不愿使用 RBF</li>
                                        <li>• 原交易未启用 RBF</li>
                                        <li>• 你有父交易的输出可以花费</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-blue-400 mb-2">使用 RBF</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 你是交易发送方</li>
                                        <li>• 原交易启用了 RBF</li>
                                        <li>• 想要更高的费用效率</li>
                                        <li>• 可能需要取消或修改交易</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 组合使用 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Info className="w-5 h-5 text-green-500" />
                                高级技巧：CPFP + RBF 组合
                            </h2>
                            <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                如果子交易也启用了 RBF，你可以多次替换子交易来调整整个交易包的有效费率。
                                这在费率波动较大时特别有用：先创建一个相对保守的 CPFP，
                                如果网络拥堵加剧，再通过 RBF 提高子交易的费用。
                            </p>
                        </div>
                    </div>
                )}

                {/* 测验 */}
                {activeTab === 'quiz' && (
                    <Quiz quizData={cpfpQuiz} />
                )}
            </div>
        </div>
    );
};

export default CPFPDemo;
