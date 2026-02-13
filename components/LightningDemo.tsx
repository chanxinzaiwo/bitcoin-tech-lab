
import React, { useState } from 'react';
import {
    Flashlight, Lock, Unlock, ArrowRightLeft, Zap, Coins, Clock, ArrowRight,
    Network, Shield, AlertTriangle, CheckCircle, XCircle, Hash,
    Route, Users, Server, Wallet, TrendingUp, Timer, Globe,
    ChevronRight, Info, Target, Repeat, Link2, Award
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';
import Quiz from './Quiz';
import { lightningQuiz } from '../data/quizData';

const LightningDemo = () => {
    const { isDarkMode } = useLab();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('demo');

    const tabs = [
        { id: 'demo', label: '通道演示' },
        { id: 'htlc', label: 'HTLC 原理' },
        { id: 'routing', label: '路由机制' },
        { id: 'compare', label: '优劣对比' },
        { id: 'quiz', label: '测验' },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="h-16 flex items-center gap-2">
                        <div className="bg-yellow-500 text-white p-1.5 rounded-full">
                            <Flashlight className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-lg sm:text-xl tracking-tight hidden sm:block">闪电网络 (Layer 2)</span>
                        <span className="font-bold text-lg tracking-tight sm:hidden">闪电网络</span>
                    </div>
                    {/* Desktop Menu */}
                    <div className="hidden md:flex space-x-1 -mt-2 pb-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                    activeTab === tab.id
                                        ? isDarkMode ? 'bg-yellow-500/20 text-yellow-400' : 'bg-yellow-50 text-yellow-700'
                                        : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} scrollbar-hide`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-block mr-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                                activeTab === tab.id
                                    ? isDarkMode ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                    : isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8">
                {activeTab === 'demo' && <ChannelDemoSection isDarkMode={isDarkMode} toast={toast} />}
                {activeTab === 'htlc' && <HTLCSection isDarkMode={isDarkMode} />}
                {activeTab === 'routing' && <RoutingSection isDarkMode={isDarkMode} />}
                {activeTab === 'compare' && <CompareSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>

            <footer className={`max-w-6xl mx-auto px-4 py-6 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm`}>
                <p>闪电网络让比特币成为真正的日常支付工具，实现即时、低成本的微支付。</p>
            </footer>
        </div>
    );
};

// Channel Demo Section
const ChannelDemoSection = ({ isDarkMode, toast }: { isDarkMode: boolean; toast: any }) => {
    const [balanceAlice, setBalanceAlice] = useState(5000);
    const [balanceBob, setBalanceBob] = useState(5000);
    const [isChannelOpen, setIsChannelOpen] = useState(false);
    const [txCount, setTxCount] = useState(0);

    const openChannel = () => {
        setIsChannelOpen(true);
        setTxCount(1);
    };

    const sendPayment = (direction: 'AB' | 'BA', amount: number) => {
        if (!isChannelOpen) return;
        if (direction === 'AB' && balanceAlice >= amount) {
            setBalanceAlice(prev => prev - amount);
            setBalanceBob(prev => prev + amount);
            setTxCount(prev => prev + 1);
        } else if (direction === 'BA' && balanceBob >= amount) {
            setBalanceBob(prev => prev - amount);
            setBalanceAlice(prev => prev + amount);
            setTxCount(prev => prev + 1);
        }
    };

    const closeChannel = () => {
        setIsChannelOpen(false);
        setTxCount(prev => prev + 1);
        toast.success('通道已关闭', `最终结算: Alice ${balanceAlice} sat, Bob ${balanceBob} sat 上链`);
    };

    const reset = () => {
        setBalanceAlice(5000);
        setBalanceBob(5000);
        setIsChannelOpen(false);
        setTxCount(0);
    };

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Intro */}
            <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
                <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                    <Zap className="w-8 h-8" /> 链下极速支付
                </h2>
                <p className="text-yellow-100 text-lg leading-relaxed max-w-3xl">
                    如果每次买咖啡都要等 10 分钟确认，比特币无法成为现金。
                    闪电网络允许双方建立一个"支付通道"，在链下进行百万次交易，只有在开启和关闭通道时才需要上链。
                </p>
            </div>

            {/* Channel Visualization */}
            <div className={`p-4 sm:p-8 rounded-2xl sm:rounded-3xl border-2 transition-all shadow-lg ${isChannelOpen ? 'border-yellow-500 bg-yellow-500/5' : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')}`}>
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
                    <div className="text-center">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg border-4 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}>A</div>
                        <div className="mt-2 font-bold text-sm sm:text-base">Alice</div>
                        <div className="font-mono text-xs sm:text-sm opacity-70">{isChannelOpen ? balanceAlice : 5000} sats</div>
                    </div>

                    {/* The Channel Pipe */}
                    <div className={`w-full sm:flex-1 mx-0 sm:mx-8 relative h-10 sm:h-12 ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-200 border-slate-300'} rounded-full overflow-hidden shadow-inner border`}>
                        {!isChannelOpen ? (
                            <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-xs sm:text-sm font-bold`}>
                                通道未开启
                            </div>
                        ) : (
                            <div className="flex h-full transition-all duration-500 ease-out">
                                <div className="h-full bg-blue-500 flex items-center justify-end pr-1 sm:pr-2 text-white/50 text-[10px] sm:text-xs font-bold" style={{width: `${(balanceAlice/10000)*100}%`}}>
                                    <span className="hidden sm:inline">Alice</span>
                                </div>
                                <div className="h-full bg-emerald-500 flex items-center pl-1 sm:pl-2 text-white/50 text-[10px] sm:text-xs font-bold" style={{width: `${(balanceBob/10000)*100}%`}}>
                                    <span className="hidden sm:inline">Bob</span>
                                </div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-yellow-400 p-1 rounded-full shadow-lg border-2 border-white z-10">
                                    <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-900" />
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl sm:text-2xl shadow-lg border-4 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}>B</div>
                        <div className="mt-2 font-bold text-sm sm:text-base">Bob</div>
                        <div className="font-mono text-xs sm:text-sm opacity-70">{isChannelOpen ? balanceBob : 5000} sats</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    {!isChannelOpen ? (
                        <button onClick={openChannel} className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-transform active:scale-95">
                            <Lock className="w-5 h-5" /> 开启通道 (2-of-2 多签)
                        </button>
                    ) : (
                        <div className="space-y-4 w-full max-w-md">
                            <div className="grid grid-cols-2 gap-4">
                                <button onClick={() => sendPayment('AB', 1000)} className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95">
                                    Alice Pay 1000 <ArrowRight className="w-4 h-4"/>
                                </button>
                                <button onClick={() => sendPayment('BA', 1000)} className="bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 active:scale-95">
                                    <ArrowRight className="w-4 h-4 rotate-180"/> Bob Pay 1000
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button onClick={closeChannel} className={`flex-1 border-2 ${isDarkMode ? 'border-slate-600 hover:bg-slate-800 text-slate-400' : 'border-slate-300 hover:bg-slate-100 text-slate-500'} py-2 rounded-lg font-bold text-sm transition-colors`}>
                                    关闭通道 (Settlement)
                                </button>
                                <button onClick={reset} className={`px-4 py-2 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
                                    重置
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Stats */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase`}>链上交易数</div>
                        <div className="text-xl font-bold font-mono">{isChannelOpen ? '1' : txCount > 0 ? '2' : '0'}</div>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase`}>链下状态更新</div>
                        <div className="text-xl font-bold font-mono text-yellow-500">{txCount}</div>
                    </div>
                    <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase`}>节省交易费</div>
                        <div className="text-xl font-bold font-mono text-green-500">{(txCount > 2 ? txCount - 2 : 0) * 200} vB</div>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    支付通道工作原理
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">1</div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>开启通道</h4>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            双方将资金锁入一个 2-of-2 多签地址，创建一笔链上"Funding Transaction"。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">2</div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>链下支付</h4>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            每次支付只需交换签名，更新"承诺交易"中的余额分配，无需上链。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">3</div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>关闭通道</h4>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            任一方可随时广播最新状态上链，按最终余额分配资金。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// HTLC Section
const HTLCSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [step, setStep] = useState(0);

    const htlcSteps = [
        {
            title: '1. Alice 生成秘密',
            desc: 'Alice 生成一个随机数 R（preimage），计算其哈希 H = Hash(R)',
            alice: '生成 R, 计算 H',
            bob: '等待...',
            carol: '等待...',
        },
        {
            title: '2. Alice 发送 HTLC 给 Bob',
            desc: 'Alice 创建 HTLC：如果 Bob 能在 T1 时间内提供 R，则获得 1000 sats',
            alice: 'HTLC: H, T1, 1000 sat →',
            bob: '收到 HTLC',
            carol: '等待...',
        },
        {
            title: '3. Bob 发送 HTLC 给 Carol',
            desc: 'Bob 用相同的 H 创建 HTLC 给 Carol，但时间更短 (T2 < T1)',
            alice: '等待 R...',
            bob: 'HTLC: H, T2, 1000 sat →',
            carol: '收到 HTLC',
        },
        {
            title: '4. Carol 揭示秘密 R',
            desc: 'Carol（最终收款人）知道 R，向 Bob 揭示以获得资金',
            alice: '等待 R...',
            bob: '← R',
            carol: '揭示 R, 获得 1000 sat',
        },
        {
            title: '5. Bob 向 Alice 揭示 R',
            desc: 'Bob 现在知道 R，向 Alice 揭示以获得资金',
            alice: '← R, Bob 获得 1000 sat',
            bob: '揭示 R',
            carol: '已完成',
        },
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                        <Hash className="w-6 h-6 text-purple-500" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            HTLC - 哈希时间锁合约
                        </h2>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            Hash Time-Locked Contract 是闪电网络的核心原语，它实现了跨多跳的原子支付。
                            要么所有参与者都能获得资金，要么所有资金都退回原处。
                        </p>
                    </div>
                </div>
            </div>

            {/* HTLC Explanation */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className={`rounded-xl p-5 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Hash className="w-5 h-5 text-purple-500" /> 哈希锁 (Hash Lock)
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        资金被锁定，只有知道秘密原像 R 的人才能解锁。验证方式：Hash(R) = H
                    </p>
                    <div className={`mt-3 p-3 rounded-lg font-mono text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                        OP_HASH160 {'<'}H{'>'} OP_EQUALVERIFY
                    </div>
                </div>
                <div className={`rounded-xl p-5 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Clock className="w-5 h-5 text-cyan-500" /> 时间锁 (Time Lock)
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        如果超过时限 T 仍未揭示 R，发送方可以取回资金。防止资金永久锁定。
                    </p>
                    <div className={`mt-3 p-3 rounded-lg font-mono text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-700'}`}>
                        {'<'}T{'>'} OP_CHECKLOCKTIMEVERIFY
                    </div>
                </div>
            </div>

            {/* Interactive HTLC Demo */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    多跳支付演示：Alice → Bob → Carol
                </h3>

                {/* Progress */}
                <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
                    {htlcSteps.map((s, i) => (
                        <div key={i} className="flex items-center">
                            <button
                                onClick={() => setStep(i)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                                    i === step
                                        ? 'bg-purple-500 text-white'
                                        : i < step
                                        ? 'bg-green-500 text-white'
                                        : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                                }`}
                            >
                                {i < step ? <CheckCircle className="w-4 h-4" /> : i + 1}
                            </button>
                            {i < htlcSteps.length - 1 && (
                                <div className={`w-8 md:w-16 h-0.5 ${i < step ? 'bg-green-500' : isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Current Step */}
                <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                        {htlcSteps[step].title}
                    </h4>
                    <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                        {htlcSteps[step].desc}
                    </p>
                </div>

                {/* Participants */}
                <div className="grid grid-cols-3 gap-4">
                    <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">A</div>
                        <div className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>Alice</div>
                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{htlcSteps[step].alice}</div>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">B</div>
                        <div className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Bob (路由)</div>
                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{htlcSteps[step].bob}</div>
                    </div>
                    <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                        <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-2">C</div>
                        <div className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Carol</div>
                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{htlcSteps[step].carol}</div>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex justify-center gap-4 mt-6">
                    <button
                        onClick={() => setStep(Math.max(0, step - 1))}
                        disabled={step === 0}
                        className={`px-4 py-2 rounded-lg font-bold ${
                            step === 0
                                ? isDarkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : isDarkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                    >
                        上一步
                    </button>
                    <button
                        onClick={() => setStep(Math.min(htlcSteps.length - 1, step + 1))}
                        disabled={step === htlcSteps.length - 1}
                        className={`px-4 py-2 rounded-lg font-bold ${
                            step === htlcSteps.length - 1
                                ? isDarkMode ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-purple-500 text-white hover:bg-purple-600'
                        }`}
                    >
                        下一步
                    </button>
                </div>
            </div>

            {/* Key Properties */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    HTLC 关键特性
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="w-5 h-5 text-green-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>原子性</span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            整条支付路径要么全部成功，要么全部失败。不会出现中间节点扣留资金的情况。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Shield className="w-5 h-5 text-blue-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>免信任</span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            中间路由节点无法窃取资金，因为他们不知道秘密 R，只能在收到 R 后转发。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Timer className="w-5 h-5 text-amber-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>时间递减</span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            每一跳的时间锁递减，确保上游节点有足够时间在下游节点之前取回资金。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <Repeat className="w-5 h-5 text-purple-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>可组合</span>
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            HTLC 可以串联任意数量的跳数，实现复杂的支付路由。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Routing Section
const RoutingSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                        <Route className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                        <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            闪电网络路由
                        </h2>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            你不需要与每个人都建立直接通道。通过路由，资金可以在网络中"跳跃"到达任何人。
                        </p>
                    </div>
                </div>
            </div>

            {/* Network Topology */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    网络拓扑结构
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                    <div className={`p-5 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-500'}`} />
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>普通用户</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            只与少数节点建立通道，依赖路由进行支付。
                        </p>
                    </div>
                    <div className={`p-5 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <Server className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>路由节点</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            连接多个通道，转发支付赚取手续费。
                        </p>
                    </div>
                    <div className={`p-5 rounded-xl text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <Globe className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>枢纽节点</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            高度连接的大型节点，提供网络骨干。
                        </p>
                    </div>
                </div>
            </div>

            {/* Routing Algorithm */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    路由算法
                </h3>
                <div className="space-y-4">
                    <div className={`p-4 rounded-xl border-l-4 border-cyan-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>源路由 (Source Routing)</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            发送方计算完整路径，使用洋葱加密包装每一跳的信息。中间节点只知道上一跳和下一跳。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl border-l-4 border-purple-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>洋葱路由 (Onion Routing)</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            每个节点只能剥开属于自己的一层"洋葱"，无法看到完整路径，保护隐私。
                        </p>
                    </div>
                    <div className={`p-4 rounded-xl border-l-4 border-amber-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>多路径支付 (MPP)</h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            大额支付可拆分成多个小额，通过不同路径并行发送，提高成功率。
                        </p>
                    </div>
                </div>
            </div>

            {/* Routing Fees */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    路由费用结构
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>费用组成</h4>
                        <div className="space-y-2">
                            <div className={`p-3 rounded-lg flex justify-between ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>基础费用 (Base Fee)</span>
                                <span className="font-mono text-sm text-cyan-500">1-10 sat</span>
                            </div>
                            <div className={`p-3 rounded-lg flex justify-between ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>比例费用 (Fee Rate)</span>
                                <span className="font-mono text-sm text-cyan-500">0.0001-0.001%</span>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>费用计算示例</h4>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                发送 100,000 sats，经过 3 跳：
                            </p>
                            <div className={`font-mono text-sm mt-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                总费用 = 3 × (1 + 100,000 × 0.0001%)<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;= 3 × (1 + 0.1) = 3.3 sat
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Channel Liquidity */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-start gap-3">
                    <AlertTriangle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                    <div>
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                            流动性挑战
                        </h4>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            支付只能沿着有足够余额的方向流动。如果 A → B 通道中 A 侧余额不足，
                            支付将失败。这就是为什么需要"平衡"通道 — 通过循环支付或购买入站流动性。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Comparison Section
const CompareSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const comparisons = [
        { aspect: '确认时间', onchain: '10-60 分钟', lightning: '< 1 秒', winner: 'lightning' },
        { aspect: '交易费用', onchain: '1-100+ sat/vB', lightning: '< 1 sat', winner: 'lightning' },
        { aspect: '吞吐量', onchain: '~7 TPS', lightning: '百万+ TPS', winner: 'lightning' },
        { aspect: '最小金额', onchain: '~546 sat (粉尘限制)', lightning: '1 sat', winner: 'lightning' },
        { aspect: '安全性', onchain: '链上确认', lightning: '依赖监控', winner: 'onchain' },
        { aspect: '隐私性', onchain: '链上公开', lightning: '洋葱路由', winner: 'lightning' },
        { aspect: '可用性', onchain: '始终可用', lightning: '需要在线', winner: 'onchain' },
        { aspect: '资金效率', onchain: '无锁定', lightning: '需锁定流动性', winner: 'onchain' },
    ];

    const advantages = [
        { icon: Zap, title: '即时支付', desc: '毫秒级确认，适合日常小额支付' },
        { icon: Coins, title: '超低费用', desc: '微支付成为可能，1 sat 也能发送' },
        { icon: TrendingUp, title: '高吞吐', desc: '理论上无上限的交易处理能力' },
        { icon: Shield, title: '隐私增强', desc: '洋葱路由保护支付路径' },
    ];

    const disadvantages = [
        { icon: Wallet, title: '流动性锁定', desc: '资金需要预先锁入通道' },
        { icon: Server, title: '需要在线', desc: '接收支付需要节点在线' },
        { icon: AlertTriangle, title: '通道管理', desc: '需要监控欺诈和平衡流动性' },
        { icon: Link2, title: '路由失败', desc: '大额支付可能找不到路径' },
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    链上 vs 闪电网络
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    闪电网络不是要取代链上交易，而是作为补充。大额结算和长期存储用链上，日常支付用闪电。
                </p>
            </div>

            {/* Comparison Table */}
            <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
                            <tr>
                                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>对比项</th>
                                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>链上 (Layer 1)</th>
                                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>闪电网络 (Layer 2)</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisons.map((row, index) => (
                                <tr key={row.aspect} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <td className={`px-4 py-3 font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {row.aspect}
                                    </td>
                                    <td className={`px-4 py-3 ${row.winner === 'onchain' ? 'text-green-500 font-bold' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {row.onchain}
                                        {row.winner === 'onchain' && <CheckCircle className="w-4 h-4 inline ml-1" />}
                                    </td>
                                    <td className={`px-4 py-3 ${row.winner === 'lightning' ? 'text-yellow-500 font-bold' : isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {row.lightning}
                                        {row.winner === 'lightning' && <Zap className="w-4 h-4 inline ml-1" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Advantages */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <CheckCircle className="w-5 h-5 text-green-500" /> 闪电网络优势
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {advantages.map((item, index) => (
                        <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                            <div className="flex items-center gap-3">
                                <item.icon className="w-6 h-6 text-green-500" />
                                <div>
                                    <h4 className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>{item.title}</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Disadvantages */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <AlertTriangle className="w-5 h-5 text-amber-500" /> 挑战与局限
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    {disadvantages.map((item, index) => (
                        <div key={index} className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                            <div className="flex items-center gap-3">
                                <item.icon className="w-6 h-6 text-amber-500" />
                                <div>
                                    <h4 className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>{item.title}</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Use Cases */}
            <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    使用场景建议
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`}>
                            <Zap className="w-5 h-5" /> 适合闪电网络
                        </h4>
                        <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-yellow-500" /> 日常小额消费（咖啡、打赏）</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-yellow-500" /> 流媒体按秒付费</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-yellow-500" /> 游戏内微交易</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-yellow-500" /> 高频交易对冲</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-yellow-500" /> 即时跨境汇款</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-600'}`}>
                            <Link2 className="w-5 h-5" /> 适合链上交易
                        </h4>
                        <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-orange-500" /> 大额价值存储</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-orange-500" /> 冷钱包长期持有</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-orange-500" /> 开启/关闭闪电通道</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-orange-500" /> 需要链上证明的交易</li>
                            <li className="flex items-center gap-2"><ChevronRight className="w-4 h-4 text-orange-500" /> 接收方不在线时</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Future */}
            <div className={`rounded-2xl p-6 border-2 ${isDarkMode ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-cyan-50 border-cyan-200'}`}>
                <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'}`}>
                        <TrendingUp className="w-6 h-6 text-cyan-500" />
                    </div>
                    <div>
                        <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                            闪电网络发展趋势
                        </h4>
                        <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            <li><strong>Taproot 通道:</strong> 更小的交易体积，更好的隐私</li>
                            <li><strong>BOLT 12:</strong> 可重复使用的支付请求 (Offers)</li>
                            <li><strong>双向资金通道:</strong> 开通道时双方都可注入资金</li>
                            <li><strong>Splicing:</strong> 在不关闭通道的情况下增减容量</li>
                            <li><strong>LSP:</strong> 闪电服务提供商简化普通用户体验</li>
                        </ul>
                    </div>
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
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100'}`}>
                    <Award className="w-8 h-8 text-yellow-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    闪电网络知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对闪电网络的理解
                </p>
            </div>
            <Quiz quizData={lightningQuiz} />
        </div>
    );
};

export default LightningDemo;
