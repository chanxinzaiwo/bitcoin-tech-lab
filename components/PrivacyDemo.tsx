import React, { useState } from 'react';
import {
    Eye, EyeOff, Shield, Shuffle, Users, AlertTriangle,
    ArrowRight, Check, X, RefreshCw, Fingerprint, Link2
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';

// Types
interface UTXO {
    id: string;
    address: string;
    amount: number;
    owner: string;
    color: string;
}

interface CoinJoinRound {
    inputs: UTXO[];
    outputs: UTXO[];
    status: 'waiting' | 'mixing' | 'complete';
}

const PrivacyDemo = () => {
    const { isDarkMode } = useLab();
    const toast = useToast();

    const [activeTab, setActiveTab] = useState<'problem' | 'coinjoin' | 'payjoin' | 'silent'>('problem');
    const [coinJoinRound, setCoinJoinRound] = useState<CoinJoinRound | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    // Privacy problem visualization
    const [showTracking, setShowTracking] = useState(false);

    // Sample transactions for visualization
    const sampleHistory = [
        { from: 'Exchange (KYC)', to: 'bc1q...xyz1', amount: 1.0, label: '提币' },
        { from: 'bc1q...xyz1', to: 'bc1q...xyz2', amount: 0.8, label: '转移' },
        { from: 'bc1q...xyz2', to: 'Merchant', amount: 0.3, label: '购物' },
        { from: 'bc1q...xyz2', to: 'bc1q...xyz3', amount: 0.5, label: '找零' },
    ];

    // CoinJoin simulation
    const participants = [
        { id: 'alice', name: 'Alice', color: 'bg-red-500' },
        { id: 'bob', name: 'Bob', color: 'bg-blue-500' },
        { id: 'charlie', name: 'Charlie', color: 'bg-green-500' },
        { id: 'diana', name: 'Diana', color: 'bg-purple-500' },
    ];

    const startCoinJoin = () => {
        const inputs: UTXO[] = participants.map((p, i) => ({
            id: `input-${i}`,
            address: `bc1q...${p.id.slice(0, 3)}`,
            amount: 0.1,
            owner: p.name,
            color: p.color,
        }));

        setCoinJoinRound({
            inputs,
            outputs: [],
            status: 'waiting',
        });

        setIsAnimating(true);

        // Animation sequence
        setTimeout(() => {
            setCoinJoinRound(prev => prev ? { ...prev, status: 'mixing' } : null);
        }, 1000);

        setTimeout(() => {
            // Create shuffled outputs (all same amount, new addresses)
            const shuffledOutputs: UTXO[] = [...participants]
                .sort(() => Math.random() - 0.5)
                .map((p, i) => ({
                    id: `output-${i}`,
                    address: `bc1q...new${i}`,
                    amount: 0.1,
                    owner: '???',
                    color: 'bg-slate-500',
                }));

            setCoinJoinRound({
                inputs,
                outputs: shuffledOutputs,
                status: 'complete',
            });
            setIsAnimating(false);
            toast.success('CoinJoin 完成', '外部观察者无法确定哪个输出属于谁');
        }, 3000);
    };

    const resetCoinJoin = () => {
        setCoinJoinRound(null);
        setIsAnimating(false);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Navigation */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-violet-600 text-white p-1.5 rounded-full">
                        <EyeOff className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">比特币隐私技术</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">

                {/* Intro */}
                <div className="bg-gradient-to-br from-violet-600 to-fuchsia-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <Shield className="w-8 h-8" /> 比特币隐私
                    </h2>
                    <p className="text-violet-100 text-lg leading-relaxed max-w-3xl">
                        比特币是假名系统，不是匿名系统。所有交易永久记录在区块链上，可被追踪分析。
                        了解隐私技术可以帮助你保护财务隐私，这是一项基本权利。
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'problem', label: '隐私问题', icon: Eye },
                        { id: 'coinjoin', label: 'CoinJoin', icon: Shuffle },
                        { id: 'payjoin', label: 'PayJoin', icon: Users },
                        { id: 'silent', label: 'Silent Payments', icon: Fingerprint },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-violet-500 text-white'
                                    : isDarkMode
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Problem Tab */}
                {activeTab === 'problem' && (
                    <div className="space-y-6">
                        {/* Chain Analysis Demo */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Link2 className="w-5 h-5 text-violet-500" /> 链上追踪演示
                            </h3>

                            <button
                                onClick={() => setShowTracking(!showTracking)}
                                className={`mb-4 px-4 py-2 rounded-xl font-medium transition-all ${
                                    showTracking
                                        ? 'bg-red-500 text-white'
                                        : 'bg-violet-500 text-white'
                                }`}
                            >
                                {showTracking ? '隐藏追踪视图' : '显示追踪视图'}
                            </button>

                            <div className="space-y-3">
                                {sampleHistory.map((tx, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-mono text-sm ${showTracking && tx.from.includes('KYC') ? 'text-red-500 font-bold' : ''}`}>
                                                        {tx.from}
                                                    </span>
                                                    <ArrowRight className="w-4 h-4 text-slate-500" />
                                                    <span className={`font-mono text-sm ${showTracking ? 'text-red-500' : ''}`}>
                                                        {tx.to}
                                                    </span>
                                                </div>
                                                <span className={`font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {tx.amount} BTC
                                                </span>
                                            </div>
                                            <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                {tx.label}
                                            </div>
                                        </div>
                                        {showTracking && (
                                            <div className="w-20 text-center">
                                                <span className="px-2 py-1 bg-red-500 text-white text-xs rounded-full">
                                                    已关联
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {showTracking && (
                                <div className={`mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30`}>
                                    <p className="text-red-500 text-sm">
                                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                                        链分析公司可以追踪从交易所提币后的所有交易，关联你的真实身份。
                                        购买记录、持币量、交易对手都可能被暴露。
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Privacy Leaks */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                常见隐私泄露
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {[
                                    {
                                        title: '地址重用',
                                        desc: '多次使用同一地址收款，所有交易历史都被关联',
                                        risk: 'high',
                                    },
                                    {
                                        title: '找零地址关联',
                                        desc: '找零回到自己的地址，暴露了哪个输出是找零',
                                        risk: 'high',
                                    },
                                    {
                                        title: 'KYC 交易所',
                                        desc: '从实名交易所提币，你的身份已与地址绑定',
                                        risk: 'high',
                                    },
                                    {
                                        title: '输入合并',
                                        desc: '多个 UTXO 在同一交易中使用，暴露它们属于同一人',
                                        risk: 'medium',
                                    },
                                    {
                                        title: '时间分析',
                                        desc: '交易时间可能暴露你的时区和生活习惯',
                                        risk: 'low',
                                    },
                                    {
                                        title: '金额分析',
                                        desc: '特定金额的交易可能被关联到特定商家或服务',
                                        risk: 'medium',
                                    },
                                ].map((item, i) => (
                                    <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {item.title}
                                            </h4>
                                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                                item.risk === 'high' ? 'bg-red-500 text-white' :
                                                item.risk === 'medium' ? 'bg-yellow-500 text-black' :
                                                'bg-green-500 text-white'
                                            }`}>
                                                {item.risk === 'high' ? '高风险' : item.risk === 'medium' ? '中风险' : '低风险'}
                                            </span>
                                        </div>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {item.desc}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* CoinJoin Tab */}
                {activeTab === 'coinjoin' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Shuffle className="w-5 h-5 text-violet-500" /> CoinJoin 原理
                            </h3>

                            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                CoinJoin 是多人联合构造一笔交易，将多个输入混合后输出等额的比特币到不同地址。
                                外部观察者无法确定哪个输入对应哪个输出。
                            </p>

                            {/* Controls */}
                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={startCoinJoin}
                                    disabled={isAnimating || coinJoinRound !== null}
                                    className="px-6 py-2.5 bg-violet-500 hover:bg-violet-600 disabled:bg-slate-600 text-white rounded-xl font-bold transition-colors"
                                >
                                    开始 CoinJoin
                                </button>
                                <button
                                    onClick={resetCoinJoin}
                                    className={`px-4 py-2.5 rounded-xl font-medium ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Visualization */}
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Inputs */}
                                <div>
                                    <h4 className={`font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        输入 (Inputs)
                                    </h4>
                                    <div className="space-y-2">
                                        {(coinJoinRound?.inputs || participants.map((p, i) => ({
                                            id: `preview-${i}`,
                                            address: `bc1q...${p.id.slice(0, 3)}`,
                                            amount: 0.1,
                                            owner: p.name,
                                            color: p.color,
                                        }))).map((utxo, i) => (
                                            <div
                                                key={utxo.id}
                                                className={`p-3 rounded-lg ${utxo.color} text-white transition-all ${
                                                    coinJoinRound?.status === 'mixing' ? 'animate-pulse scale-95' : ''
                                                }`}
                                            >
                                                <div className="font-mono text-sm">{utxo.address}</div>
                                                <div className="flex justify-between mt-1">
                                                    <span className="text-xs opacity-75">{utxo.owner}</span>
                                                    <span className="font-bold">{utxo.amount} BTC</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mixing */}
                                <div className="flex items-center justify-center">
                                    <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
                                        coinJoinRound?.status === 'mixing'
                                            ? 'bg-violet-500 animate-spin'
                                            : coinJoinRound?.status === 'complete'
                                            ? 'bg-emerald-500'
                                            : isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                                    }`}>
                                        {coinJoinRound?.status === 'complete' ? (
                                            <Check className="w-10 h-10 text-white" />
                                        ) : (
                                            <Shuffle className={`w-10 h-10 ${coinJoinRound?.status === 'mixing' ? 'text-white' : isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                        )}
                                    </div>
                                </div>

                                {/* Outputs */}
                                <div>
                                    <h4 className={`font-bold mb-3 text-center ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        输出 (Outputs)
                                    </h4>
                                    <div className="space-y-2">
                                        {coinJoinRound?.outputs.length ? (
                                            coinJoinRound.outputs.map((utxo, i) => (
                                                <div
                                                    key={utxo.id}
                                                    className={`p-3 rounded-lg ${utxo.color} text-white animate-in fade-in`}
                                                >
                                                    <div className="font-mono text-sm">{utxo.address}</div>
                                                    <div className="flex justify-between mt-1">
                                                        <span className="text-xs opacity-75">{utxo.owner}</span>
                                                        <span className="font-bold">{utxo.amount} BTC</span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className={`p-8 rounded-lg border-2 border-dashed text-center ${isDarkMode ? 'border-slate-700 text-slate-500' : 'border-slate-300 text-slate-400'}`}>
                                                等待混合...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {coinJoinRound?.status === 'complete' && (
                                <div className={`mt-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30`}>
                                    <p className="text-emerald-500 text-sm">
                                        <Check className="w-4 h-4 inline mr-1" />
                                        所有输出金额相同（0.1 BTC），外部观察者只能看到 4 个输入和 4 个输出，
                                        无法确定哪个输出属于哪个参与者。这就是 CoinJoin 的匿名集 = 4。
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* CoinJoin Implementations */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                CoinJoin 实现
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Wasabi Wallet
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        使用 WabiSabi 协议，支持不等额 CoinJoin，匿名集可达数百
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        JoinMarket
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        去中心化的做市商模式，提供流动性可赚取手续费
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        Whirlpool (Samourai)
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        固定面额混合，配合 Stonewall 等技术提供更强隐私
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* PayJoin Tab */}
                {activeTab === 'payjoin' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Users className="w-5 h-5 text-violet-500" /> PayJoin (P2EP)
                            </h3>

                            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                PayJoin 让收款方也贡献一个输入，打破"所有输入属于同一人"的假设。
                                看起来像普通交易，但分析假设被破坏。
                            </p>

                            {/* Comparison */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Normal Transaction */}
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-3 text-red-500`}>普通交易</h4>
                                    <div className="space-y-2 mb-4">
                                        <div className={`p-2 rounded bg-blue-500 text-white text-sm`}>
                                            Alice 输入: 1.0 BTC
                                        </div>
                                    </div>
                                    <div className="text-center my-2">
                                        <ArrowRight className="w-6 h-6 mx-auto text-slate-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className={`p-2 rounded bg-green-500 text-white text-sm`}>
                                            Bob 收款: 0.3 BTC
                                        </div>
                                        <div className={`p-2 rounded bg-blue-500 text-white text-sm`}>
                                            Alice 找零: 0.7 BTC
                                        </div>
                                    </div>
                                    <p className={`text-xs mt-3 text-red-500`}>
                                        分析者知道: 1 个输入 → 2 个输出，找零属于 Alice
                                    </p>
                                </div>

                                {/* PayJoin Transaction */}
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-3 text-emerald-500`}>PayJoin 交易</h4>
                                    <div className="space-y-2 mb-4">
                                        <div className={`p-2 rounded bg-blue-500 text-white text-sm`}>
                                            Alice 输入: 1.0 BTC
                                        </div>
                                        <div className={`p-2 rounded bg-green-500 text-white text-sm`}>
                                            Bob 输入: 0.5 BTC
                                        </div>
                                    </div>
                                    <div className="text-center my-2">
                                        <ArrowRight className="w-6 h-6 mx-auto text-slate-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <div className={`p-2 rounded bg-green-500 text-white text-sm`}>
                                            Bob 收款: 0.8 BTC
                                        </div>
                                        <div className={`p-2 rounded bg-blue-500 text-white text-sm`}>
                                            Alice 找零: 0.7 BTC
                                        </div>
                                    </div>
                                    <p className={`text-xs mt-3 text-emerald-500`}>
                                        分析者看到: 2 个输入 → 2 个输出，无法确定谁是付款方
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                PayJoin 优势
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Check className="w-6 h-6 text-emerald-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        隐蔽性强
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        看起来像普通交易，不会被标记为"隐私交易"
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Check className="w-6 h-6 text-emerald-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        UTXO 整合
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        收款方可以顺便整合 UTXO，节省未来手续费
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Check className="w-6 h-6 text-emerald-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        无额外费用
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        交易大小与普通交易相当，不增加手续费
                                    </p>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Check className="w-6 h-6 text-emerald-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        BIP-78 标准
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        已有标准化协议，多个钱包支持
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Silent Payments Tab */}
                {activeTab === 'silent' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Fingerprint className="w-5 h-5 text-violet-500" /> Silent Payments
                            </h3>

                            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Silent Payments 允许你发布一个静态地址，但每次收款都会生成唯一的链上地址，
                                无法被关联。就像给每个付款人一个独立的收款地址，但只需管理一个密钥。
                            </p>

                            {/* How it works */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} mb-6`}>
                                <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    工作原理
                                </h4>
                                <div className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            1
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                Bob 发布静态地址 (sp1...)
                                            </p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                这是一个特殊格式的地址，可以公开分享
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            2
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                Alice 想付款给 Bob
                                            </p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                钱包用 Bob 的静态地址 + Alice 的输入私钥计算出唯一的收款地址
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            3
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                Alice 发送到计算出的地址
                                            </p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                链上地址是普通的 Taproot 地址，没有任何特殊标记
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center text-white font-bold shrink-0">
                                            4
                                        </div>
                                        <div>
                                            <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                Bob 扫描区块链
                                            </p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Bob 的钱包检查每笔交易，用私钥计算是否是发给自己的
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Comparison */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-red-500/30 bg-red-500/10' : 'border-red-200 bg-red-50'}`}>
                                    <h4 className="font-bold mb-2 text-red-500">普通地址</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 地址重用暴露交易历史</li>
                                        <li>• 每次收款需要新地址</li>
                                        <li>• 需要与付款人互动</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-yellow-500/30 bg-yellow-500/10' : 'border-yellow-200 bg-yellow-50'}`}>
                                    <h4 className="font-bold mb-2 text-yellow-600">HD 钱包</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 可生成无限新地址</li>
                                        <li>• 但需要在线生成新地址</li>
                                        <li>• 仍需与付款人互动</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'border-emerald-500/30 bg-emerald-500/10' : 'border-emerald-200 bg-emerald-50'}`}>
                                    <h4 className="font-bold mb-2 text-emerald-500">Silent Payments</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 静态地址，无限唯一收款</li>
                                        <li>• 无需互动</li>
                                        <li>• 链上完全不可关联</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                BIP-352 状态
                            </h3>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Silent Payments (BIP-352) 是一个相对较新的提案，正在被多个钱包实现中。
                                它需要 Taproot 支持，是比特币隐私的重要进步。主要挑战是接收方需要扫描
                                所有区块的交易，对轻钱包不太友好，但可以通过专用服务器或全节点解决。
                            </p>
                        </div>
                    </div>
                )}

                {/* Best Practices */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        隐私最佳实践
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                基础措施
                            </h4>
                            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• 每次收款使用新地址</li>
                                <li>• 使用支持 Tor 的钱包</li>
                                <li>• 避免合并不同来源的 UTXO</li>
                                <li>• 使用 SegWit/Taproot 地址</li>
                            </ul>
                        </div>
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                进阶措施
                            </h4>
                            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• 使用 CoinJoin 混合资金</li>
                                <li>• 运行自己的全节点</li>
                                <li>• 使用 PayJoin 收款</li>
                                <li>• 考虑使用闪电网络</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default PrivacyDemo;
