import React, { useState, useEffect } from 'react';
import { Shuffle, Users, EyeOff, CheckCircle, XCircle, AlertTriangle, ArrowRight, Coins, Lock, Shield, Zap, Clock, TrendingUp, Building } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const CoinJoinDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'process', label: '混币流程' },
        { id: 'interactive', label: '交互演示' },
        { id: 'protocols', label: '协议对比' },
        { id: 'analysis', label: '隐私分析' },
        { id: 'quiz', label: '测验' }
    ];

    // Interactive CoinJoin simulation
    const [participants, setParticipants] = useState([
        { id: 'A', inputAmount: 0.5, outputAddress: 'bc1q...alice', color: 'red' },
        { id: 'B', inputAmount: 0.5, outputAddress: 'bc1q...bob', color: 'blue' },
        { id: 'C', inputAmount: 0.5, outputAddress: 'bc1q...carol', color: 'green' },
    ]);
    const [mixingStep, setMixingStep] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);
    const [showLinks, setShowLinks] = useState(true);

    // Auto-play simulation
    useEffect(() => {
        if (!isAutoPlaying) return;

        if (mixingStep < 4) {
            const timer = setTimeout(() => {
                setMixingStep(prev => prev + 1);
            }, 1500);
            return () => clearTimeout(timer);
        } else {
            setIsAutoPlaying(false);
        }
    }, [isAutoPlaying, mixingStep]);

    const resetSimulation = () => {
        setMixingStep(0);
        setIsAutoPlaying(false);
        setShowLinks(true);
    };

    const quizData = getQuizByModule('coinjoin');

    return (
        <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className={`rounded-2xl p-6 mb-6 border ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border-indigo-800/50' : 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-100'}`}>
                            <Shuffle className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                CoinJoin 混币
                            </h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                多方协作的隐私增强技术
                            </p>
                        </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        CoinJoin 是一种隐私增强技术，通过将多个用户的交易合并为一笔，打断区块链上的交易追踪链路。
                        外部观察者无法确定哪个输入对应哪个输出，从而保护用户隐私。
                    </p>
                </div>

                {/* Tabs */}
                <div className={`flex flex-wrap gap-2 mb-6 p-2 rounded-xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-indigo-500 text-white'
                                : isDarkMode
                                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {activeTab === 'intro' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                什么是 CoinJoin？
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'}`}>
                                <p className={`${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>
                                    <strong>CoinJoin</strong> 由 Gregory Maxwell 在 2013 年提出，是一种无需信任的混币协议。
                                    多个用户将他们的交易输入和输出合并到同一笔交易中，使得外部观察者无法追踪资金流向。
                                </p>
                            </div>

                            {/* Visual comparison */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                        <XCircle className="w-5 h-5" />
                                        普通交易（可追踪）
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`px-3 py-1 rounded ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                                Alice: 1 BTC
                                            </div>
                                            <ArrowRight className="w-4 h-4" />
                                            <div className={`px-3 py-1 rounded ${isDarkMode ? 'bg-red-500/20' : 'bg-red-100'}`}>
                                                商家: 1 BTC
                                            </div>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-red-300/70' : 'text-red-600'}`}>
                                            任何人都能看到 Alice 付款给商家
                                        </p>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                        <CheckCircle className="w-5 h-5" />
                                        CoinJoin 交易（隐私保护）
                                    </h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <div className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                A: 1 BTC
                                            </div>
                                            <div className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                B: 1 BTC
                                            </div>
                                            <ArrowRight className="w-4 h-4" />
                                            <div className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                ?: 1 BTC
                                            </div>
                                            <div className={`px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                ?: 1 BTC
                                            </div>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-green-300/70' : 'text-green-600'}`}>
                                            无法确定哪个输入对应哪个输出
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Shield className="w-5 h-5 text-green-500" />
                                        核心优势
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>无需信任</strong>：参与者无法窃取他人资金</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>匿名集</strong>：参与者越多，隐私越强</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>链上隐私</strong>：直接在比特币主链实现</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>可组合</strong>：可进行多轮混币</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        注意事项
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>协调需求</strong>：需要找到其他参与者</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>手续费</strong>：比普通交易更高</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>时间成本</strong>：需要等待足够参与者</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>金额限制</strong>：需要使用标准化金额</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                                    关键概念：匿名集 (Anonymity Set)
                                </h3>
                                <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                    匿名集是指在一笔 CoinJoin 交易中，某个输出可能来自的输入数量。
                                    例如，5 个人参与的 CoinJoin，每个输出的匿名集大小为 5。
                                    匿名集越大，追踪难度越高，隐私保护越强。
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'process' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                CoinJoin 混币流程
                            </h2>

                            <div className="space-y-4">
                                {[
                                    {
                                        step: 1,
                                        title: '参与者聚集',
                                        icon: <Users className="w-5 h-5" />,
                                        color: 'blue',
                                        content: '多个想要提升隐私的用户通过协调服务器找到彼此。每个人准备相同金额的 UTXO 作为输入。'
                                    },
                                    {
                                        step: 2,
                                        title: '提交输入和输出',
                                        icon: <Coins className="w-5 h-5" />,
                                        color: 'purple',
                                        content: '每个参与者向协调者提交：(1) 他们的输入 UTXO (2) 一个全新生成的接收地址。使用盲签名确保协调者无法关联输入和输出。'
                                    },
                                    {
                                        step: 3,
                                        title: '构建交易',
                                        icon: <Shuffle className="w-5 h-5" />,
                                        color: 'indigo',
                                        content: '协调者将所有输入和输出打乱顺序，构建一笔包含所有参与者的交易。每个输出金额相同，无法区分。'
                                    },
                                    {
                                        step: 4,
                                        title: '验证与签名',
                                        icon: <CheckCircle className="w-5 h-5" />,
                                        color: 'green',
                                        content: '每个参与者收到交易后验证：(1) 自己的输入存在 (2) 自己的输出存在且金额正确。确认无误后签名自己的输入。'
                                    },
                                    {
                                        step: 5,
                                        title: '广播交易',
                                        icon: <Zap className="w-5 h-5" />,
                                        color: 'amber',
                                        content: '收集所有签名后，完整的 CoinJoin 交易被广播到网络。交易在链上看起来像一笔普通的多输入多输出交易。'
                                    }
                                ].map((item) => (
                                    <div key={item.step} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                                                    item.color === 'purple' ? 'bg-purple-500/20 text-purple-500' :
                                                        item.color === 'indigo' ? 'bg-indigo-500/20 text-indigo-500' :
                                                            item.color === 'green' ? 'bg-green-500/20 text-green-500' :
                                                                'bg-amber-500/20 text-amber-500'
                                                }`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    步骤 {item.step}: {item.title}
                                                </h3>
                                                <p className={`mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {item.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                    <Lock className="w-5 h-5" />
                                    为什么是"无需信任"的？
                                </h3>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                                    <li>• 协调者无法偷走资金：交易需要每个参与者签名自己的输入</li>
                                    <li>• 协调者无法关联输入输出：使用盲签名技术</li>
                                    <li>• 参与者验证后才签名：确保自己的输出存在且正确</li>
                                    <li>• 任何人拒绝签名：整个交易无效，资金安全</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                交互式 CoinJoin 演示
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                    观察 3 个参与者如何通过 CoinJoin 混合他们的 0.5 BTC。
                                    切换 "显示链接" 来模拟外部观察者的视角。
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => {
                                        resetSimulation();
                                        setIsAutoPlaying(true);
                                    }}
                                    disabled={isAutoPlaying}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${isAutoPlaying
                                            ? 'bg-slate-500 text-slate-300 cursor-not-allowed'
                                            : 'bg-indigo-500 text-white hover:bg-indigo-600'
                                        }`}
                                >
                                    <Zap className="w-4 h-4" />
                                    自动播放
                                </button>
                                <button
                                    onClick={resetSimulation}
                                    className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                >
                                    重置
                                </button>
                                <button
                                    onClick={() => setShowLinks(!showLinks)}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${showLinks
                                            ? 'bg-green-500 text-white'
                                            : 'bg-slate-500 text-white'
                                        }`}
                                >
                                    <EyeOff className="w-4 h-4" />
                                    {showLinks ? '显示链接' : '隐藏链接（观察者视角）'}
                                </button>
                            </div>

                            {/* Visualization */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    {/* Inputs */}
                                    <div className="space-y-3">
                                        <h3 className={`font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            输入 (Inputs)
                                        </h3>
                                        {participants.map((p, idx) => (
                                            <div
                                                key={p.id}
                                                className={`p-3 rounded-lg border-2 transition-all ${mixingStep >= 1
                                                        ? (showLinks
                                                            ? `border-${p.color}-500 bg-${p.color}-500/20`
                                                            : `border-slate-500 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`)
                                                        : isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'
                                                    }`}
                                                style={showLinks && mixingStep >= 1 ? {
                                                    borderColor: p.color === 'red' ? '#ef4444' : p.color === 'blue' ? '#3b82f6' : '#22c55e',
                                                    backgroundColor: p.color === 'red' ? 'rgba(239,68,68,0.2)' : p.color === 'blue' ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)'
                                                } : {}}
                                            >
                                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {showLinks ? `${p.id}` : '?'}: {p.inputAmount} BTC
                                                </div>
                                                <div className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {showLinks ? `UTXO from ${p.id}` : 'Unknown UTXO'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Mixing Animation */}
                                    <div className="flex flex-col items-center gap-4">
                                        <div className={`p-6 rounded-xl border-2 border-dashed ${mixingStep >= 2 && mixingStep < 4
                                                ? 'border-indigo-500 bg-indigo-500/20 animate-pulse'
                                                : isDarkMode ? 'border-slate-700' : 'border-slate-300'
                                            }`}>
                                            <Shuffle className={`w-12 h-12 ${mixingStep >= 2 ? 'text-indigo-500' : isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                        </div>
                                        <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {mixingStep === 0 && '等待开始'}
                                            {mixingStep === 1 && '收集输入...'}
                                            {mixingStep === 2 && '混合中...'}
                                            {mixingStep === 3 && '签名中...'}
                                            {mixingStep === 4 && '完成!'}
                                        </div>
                                    </div>

                                    {/* Outputs */}
                                    <div className="space-y-3">
                                        <h3 className={`font-bold text-center mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            输出 (Outputs)
                                        </h3>
                                        {/* Shuffled order for outputs */}
                                        {[participants[1], participants[2], participants[0]].map((p, idx) => (
                                            <div
                                                key={`out-${p.id}`}
                                                className={`p-3 rounded-lg border-2 transition-all ${mixingStep >= 3
                                                        ? (showLinks
                                                            ? `border-${p.color}-500`
                                                            : `border-slate-500 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`)
                                                        : isDarkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-300 bg-white'
                                                    }`}
                                                style={showLinks && mixingStep >= 3 ? {
                                                    borderColor: p.color === 'red' ? '#ef4444' : p.color === 'blue' ? '#3b82f6' : '#22c55e',
                                                    backgroundColor: p.color === 'red' ? 'rgba(239,68,68,0.2)' : p.color === 'blue' ? 'rgba(59,130,246,0.2)' : 'rgba(34,197,94,0.2)'
                                                } : {}}
                                            >
                                                <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {showLinks ? `${p.id}` : '?'}: 0.5 BTC
                                                </div>
                                                <div className={`text-xs font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {showLinks ? p.outputAddress : 'bc1q...????'}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Progress indicator */}
                                <div className="mt-6">
                                    <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                        <div
                                            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                                            style={{ width: `${mixingStep * 25}%` }}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-2 text-xs">
                                        <span className={mixingStep >= 1 ? 'text-indigo-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}>收集</span>
                                        <span className={mixingStep >= 2 ? 'text-indigo-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}>混合</span>
                                        <span className={mixingStep >= 3 ? 'text-indigo-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}>签名</span>
                                        <span className={mixingStep >= 4 ? 'text-green-500' : isDarkMode ? 'text-slate-500' : 'text-slate-400'}>完成</span>
                                    </div>
                                </div>
                            </div>

                            {/* Explanation based on state */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                    {!showLinks ? (
                                        <span className="text-amber-500">
                                            <strong>外部观察者视角：</strong>只能看到 3 个相同金额的输入和 3 个相同金额的输出。
                                            无法确定哪个输入对应哪个输出，每个输出有 1/3 的概率来自任意输入。
                                        </span>
                                    ) : (
                                        <span>
                                            <strong>真实链接：</strong>只有参与者知道自己的输入对应哪个输出。
                                            颜色显示了真实的资金流向，但这些信息对外部观察者是不可见的。
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'protocols' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                主要 CoinJoin 协议对比
                            </h2>

                            <div className="overflow-x-auto">
                                <table className={`w-full ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <thead>
                                        <tr className={isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                            <th className="px-4 py-3 text-left font-medium">协议</th>
                                            <th className="px-4 py-3 text-left font-medium">协调方式</th>
                                            <th className="px-4 py-3 text-left font-medium">匿名集大小</th>
                                            <th className="px-4 py-3 text-left font-medium">费用</th>
                                        </tr>
                                    </thead>
                                    <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Wasabi Wallet</td>
                                            <td className="px-4 py-3">中心化协调者</td>
                                            <td className="px-4 py-3 text-green-500">大 (50-100+)</td>
                                            <td className="px-4 py-3">0.3% 协调费</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">JoinMarket</td>
                                            <td className="px-4 py-3">去中心化做市商</td>
                                            <td className="px-4 py-3 text-amber-500">可变</td>
                                            <td className="px-4 py-3">市场定价</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">Whirlpool (Samourai)</td>
                                            <td className="px-4 py-3">中心化协调者</td>
                                            <td className="px-4 py-3 text-green-500">固定 (5)</td>
                                            <td className="px-4 py-3">固定费用</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">PayJoin</td>
                                            <td className="px-4 py-3">P2P 直接</td>
                                            <td className="px-4 py-3 text-amber-500">2</td>
                                            <td className="px-4 py-3">无额外费用</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Building className="w-5 h-5 text-blue-500" />
                                        Wasabi Wallet (WabiSabi)
                                    </h3>
                                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li>• 使用 WabiSabi 协议（2021年升级）</li>
                                        <li>• 支持可变金额输出</li>
                                        <li>• 大型匿名集，高隐私</li>
                                        <li>• 开源，Tor 集成</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Users className="w-5 h-5 text-purple-500" />
                                        JoinMarket
                                    </h3>
                                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li>• 完全去中心化，无协调者</li>
                                        <li>• 做市商提供流动性并赚取费用</li>
                                        <li>• 接受者免费混币</li>
                                        <li>• 技术门槛较高</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Shuffle className="w-5 h-5 text-green-500" />
                                        Whirlpool
                                    </h3>
                                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li>• Samourai Wallet 开发</li>
                                        <li>• 固定 5 人一组混币</li>
                                        <li>• 支持无限免费重混</li>
                                        <li>• 移动端友好</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <ArrowRight className="w-5 h-5 text-amber-500" />
                                        PayJoin (P2EP)
                                    </h3>
                                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li>• 支付时同时混币</li>
                                        <li>• 只需 2 方参与</li>
                                        <li>• 看起来像普通支付</li>
                                        <li>• 破坏链上分析启发式</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                隐私分析与最佳实践
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                    <AlertTriangle className="w-5 h-5" />
                                    常见隐私泄露风险
                                </h3>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>地址重用</strong>：混币后使用同一地址接收多笔资金</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>合并 UTXO</strong>：将混币后的多个输出合并使用</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>找零关联</strong>：非标准金额的找零暴露身份</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <XCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>时间关联</strong>：立即花费混币后的资金</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                    <Shield className="w-5 h-5" />
                                    最佳实践
                                </h3>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-green-300' : 'text-green-800'}`}>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>多轮混币</strong>：增加匿名集，提高追踪难度</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>使用 Tor</strong>：隐藏 IP 地址，防止网络层追踪</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>等待时间</strong>：混币后等待一段时间再使用</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>分开使用</strong>：每个混币输出单独使用</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                        <span><strong>避免 KYC 交易所</strong>：不要将混币后的资金发送到需要实名的平台</span>
                                    </li>
                                </ul>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    匿名集计算
                                </h3>
                                <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white border border-slate-200'}`}>
                                    <div className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                        <div className="text-purple-500">// 单轮 CoinJoin</div>
                                        <div>匿名集 = 参与者数量 = n</div>
                                        <div className="mt-2 text-purple-500">// 多轮 CoinJoin</div>
                                        <div>累积匿名集 ≈ n₁ × n₂ × ... × nₖ</div>
                                        <div className="mt-2 text-purple-500">// 示例：3轮，每轮5人</div>
                                        <div>匿名集 ≈ 5 × 5 × 5 = 125</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                    法律与合规提示
                                </h3>
                                <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                                    CoinJoin 是合法的隐私工具，类似于使用现金。但部分司法管辖区可能对混币有特定规定，
                                    部分交易所可能拒绝接受混币后的资金。使用前请了解当地法规。
                                </p>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div>
                            {quizData ? (
                                <Quiz quizData={quizData} />
                            ) : (
                                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    测验数据加载中...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CoinJoinDemo;
