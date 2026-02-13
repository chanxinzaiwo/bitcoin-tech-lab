import React, { useState } from 'react';
import { GitBranch, Link, Shield, ArrowRight, ArrowLeftRight, Lock, Unlock, Zap, Server, AlertTriangle, CheckCircle, XCircle, Layers, Network, Clock, Coins } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const SidechainsDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    // Interactive peg simulation
    const [pegState, setPegState] = useState<'idle' | 'pegging_in' | 'locked' | 'pegging_out' | 'unlocked'>('idle');
    const [mainchainBTC, setMainchainBTC] = useState(10);
    const [sidechainBTC, setSidechainBTC] = useState(0);
    const [transferAmount, setTransferAmount] = useState(1);
    const [confirmations, setConfirmations] = useState(0);

    const pegIn = () => {
        if (mainchainBTC >= transferAmount) {
            setPegState('pegging_in');
            setConfirmations(0);
            const interval = setInterval(() => {
                setConfirmations(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setMainchainBTC(m => m - transferAmount);
                        setSidechainBTC(s => s + transferAmount);
                        setPegState('locked');
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        }
    };

    const pegOut = () => {
        if (sidechainBTC >= transferAmount) {
            setPegState('pegging_out');
            setConfirmations(0);
            const interval = setInterval(() => {
                setConfirmations(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setSidechainBTC(s => s - transferAmount);
                        setMainchainBTC(m => m + transferAmount);
                        setPegState('unlocked');
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        }
    };

    const resetSimulation = () => {
        setPegState('idle');
        setMainchainBTC(10);
        setSidechainBTC(0);
        setConfirmations(0);
    };

    const tabs = [
        { id: 'intro', label: '概念介绍' },
        { id: 'mechanism', label: '运作机制' },
        { id: 'interactive', label: '交互模拟' },
        { id: 'types', label: '侧链类型' },
        { id: 'projects', label: '知名项目' },
        { id: 'quiz', label: '知识测验' },
    ];

    const quizData = getQuizByModule('sidechains');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <GitBranch className="w-4 h-4" />
                        扩容技术
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Sidechains 侧链</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
                        侧链是与比特币主链平行运行的独立区块链，通过双向锚定实现资产在链间的安全转移，
                        为比特币带来更多功能和更高吞吐量
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
                                    ? 'bg-indigo-500 text-white'
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
                                        <GitBranch className="w-5 h-5 text-indigo-400" />
                                        什么是侧链？
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                                        侧链是一条独立的区块链，可以拥有自己的共识机制、区块参数和功能特性，
                                        但通过<strong>双向锚定 (Two-Way Peg)</strong> 与比特币主链连接。
                                        用户可以将 BTC "转移" 到侧链上使用，然后再转回主链。
                                    </p>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Link className="w-5 h-5 text-emerald-400" />
                                        双向锚定
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                                        双向锚定是连接主链和侧链的机制。当 BTC 转入侧链时，主链上的 BTC 被锁定，
                                        侧链上释放等量的代币；转出时反向操作。这确保了侧链代币始终由真实的 BTC 支撑。
                                    </p>
                                </div>
                            </div>

                            {/* Visual Diagram */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-500/20' : 'bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200'}`}>
                                <h3 className="text-xl font-bold mb-6 text-center">侧链架构示意图</h3>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                                    {/* Mainchain */}
                                    <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'} min-w-[200px]`}>
                                        <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center mx-auto mb-4">
                                            <Coins className="w-8 h-8 text-orange-400" />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">比特币主链</h4>
                                        <ul className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-left`}>
                                            <li>• PoW 共识</li>
                                            <li>• 10 分钟区块</li>
                                            <li>• 最高安全性</li>
                                            <li>• 有限吞吐量</li>
                                        </ul>
                                    </div>

                                    {/* Peg */}
                                    <div className="flex flex-col items-center gap-2">
                                        <ArrowLeftRight className="w-8 h-8 text-indigo-400" />
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>双向锚定</span>
                                    </div>

                                    {/* Sidechain */}
                                    <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'} min-w-[200px]`}>
                                        <div className="w-16 h-16 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-4">
                                            <GitBranch className="w-8 h-8 text-indigo-400" />
                                        </div>
                                        <h4 className="font-bold text-lg mb-2">侧链</h4>
                                        <ul className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-left`}>
                                            <li>• 自定义共识</li>
                                            <li>• 快速出块</li>
                                            <li>• 智能合约</li>
                                            <li>• 高吞吐量</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Why Sidechains */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">为什么需要侧链？</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            title: '扩展功能',
                                            desc: '添加主链不支持的功能，如复杂智能合约、隐私交易',
                                            icon: Layers,
                                            color: 'indigo'
                                        },
                                        {
                                            title: '提高性能',
                                            desc: '更快的区块时间、更高的吞吐量，减轻主链负担',
                                            icon: Zap,
                                            color: 'amber'
                                        },
                                        {
                                            title: '安全实验',
                                            desc: '在不影响主链的情况下测试新功能和协议升级',
                                            icon: Shield,
                                            color: 'emerald'
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 text-${item.color}-400 flex items-center justify-center mb-3`}>
                                                <item.icon className="w-5 h-5" />
                                            </div>
                                            <h4 className="font-bold mb-2">{item.title}</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'mechanism' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">双向锚定机制</h3>

                            {/* Peg-In Process */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4 text-emerald-400 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5" />
                                    Peg-In (主链 → 侧链)
                                </h4>
                                <div className="grid md:grid-cols-4 gap-4">
                                    {[
                                        { step: 1, title: '发送交易', desc: '用户将 BTC 发送到主链上的特殊锁定地址' },
                                        { step: 2, title: '等待确认', desc: '等待足够的区块确认 (通常 100 个)' },
                                        { step: 3, title: 'SPV 证明', desc: '向侧链提交交易存在的 SPV 证明' },
                                        { step: 4, title: '释放代币', desc: '侧链验证后释放等量的侧链代币' },
                                    ].map((item, i) => (
                                        <div key={i} className="text-center">
                                            <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center font-bold ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                                                {item.step}
                                            </div>
                                            <h5 className="font-bold mb-1">{item.title}</h5>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Peg-Out Process */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4 text-amber-400 flex items-center gap-2">
                                    <ArrowRight className="w-5 h-5 rotate-180" />
                                    Peg-Out (侧链 → 主链)
                                </h4>
                                <div className="grid md:grid-cols-4 gap-4">
                                    {[
                                        { step: 1, title: '销毁代币', desc: '在侧链上销毁侧链代币' },
                                        { step: 2, title: '生成证明', desc: '侧链生成销毁交易的证明' },
                                        { step: 3, title: '提交主链', desc: '将证明提交给主链的锁定合约' },
                                        { step: 4, title: '解锁 BTC', desc: '主链验证后释放锁定的 BTC' },
                                    ].map((item, i) => (
                                        <div key={i} className="text-center">
                                            <div className={`w-10 h-10 rounded-full mx-auto mb-3 flex items-center justify-center font-bold ${isDarkMode ? 'bg-amber-900/50 text-amber-400' : 'bg-amber-100 text-amber-600'}`}>
                                                {item.step}
                                            </div>
                                            <h5 className="font-bold mb-1">{item.title}</h5>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Security Considerations */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
                                    <AlertTriangle className="w-5 h-5" />
                                    安全考虑
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="font-bold mb-2">挑战</h5>
                                        <ul className="space-y-2 text-sm">
                                            {[
                                                '主链无法验证侧链状态',
                                                '需要可信的联邦或预言机',
                                                'Peg-out 可能被审查',
                                                '侧链安全性可能低于主链',
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <XCircle className="w-4 h-4 text-rose-400" />
                                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-bold mb-2">缓解措施</h5>
                                        <ul className="space-y-2 text-sm">
                                            {[
                                                '多签联邦增加安全性',
                                                '长确认期减少风险',
                                                '紧急恢复机制',
                                                '渐进式去中心化',
                                            ].map((item, i) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">Peg 模拟器</h3>
                                <button
                                    onClick={resetSimulation}
                                    className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
                                >
                                    重置
                                </button>
                            </div>

                            {/* Balance Display */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <Coins className="w-5 h-5 text-orange-400" />
                                            比特币主链
                                        </h4>
                                        <span className="text-2xl font-bold text-orange-400">{mainchainBTC} BTC</span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        可用余额
                                    </p>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-indigo-900/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="font-bold flex items-center gap-2">
                                            <GitBranch className="w-5 h-5 text-indigo-400" />
                                            侧链
                                        </h4>
                                        <span className="text-2xl font-bold text-indigo-400">{sidechainBTC} sBTC</span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        可用余额
                                    </p>
                                </div>
                            </div>

                            {/* Transfer Controls */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <label className="block font-bold mb-2">转移数量</label>
                                <input
                                    type="range"
                                    min="1"
                                    max="5"
                                    value={transferAmount}
                                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                                    className="w-full mb-2"
                                />
                                <div className="text-center text-2xl font-bold">{transferAmount} BTC</div>
                            </div>

                            {/* Progress */}
                            {(pegState === 'pegging_in' || pegState === 'pegging_out') && (
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span>{pegState === 'pegging_in' ? 'Peg-In 进行中...' : 'Peg-Out 进行中...'}</span>
                                        <span>{confirmations}%</span>
                                    </div>
                                    <div className={`h-4 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}>
                                        <div
                                            className={`h-full transition-all duration-200 ${pegState === 'pegging_in' ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                            style={{ width: `${confirmations}%` }}
                                        />
                                    </div>
                                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        等待区块确认...
                                    </p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <button
                                    onClick={pegIn}
                                    disabled={pegState !== 'idle' && pegState !== 'locked' && pegState !== 'unlocked' || mainchainBTC < transferAmount}
                                    className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                                        mainchainBTC >= transferAmount && (pegState === 'idle' || pegState === 'locked' || pegState === 'unlocked')
                                            ? 'bg-emerald-500 hover:bg-emerald-600 text-white'
                                            : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-300 text-slate-500'
                                    }`}
                                >
                                    <Lock className="w-5 h-5" />
                                    Peg-In (锁定到侧链)
                                </button>
                                <button
                                    onClick={pegOut}
                                    disabled={pegState !== 'idle' && pegState !== 'locked' && pegState !== 'unlocked' || sidechainBTC < transferAmount}
                                    className={`py-4 rounded-xl font-bold flex items-center justify-center gap-2 ${
                                        sidechainBTC >= transferAmount && (pegState === 'idle' || pegState === 'locked' || pegState === 'unlocked')
                                            ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                            : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-300 text-slate-500'
                                    }`}
                                >
                                    <Unlock className="w-5 h-5" />
                                    Peg-Out (解锁回主链)
                                </button>
                            </div>

                            {/* Status Messages */}
                            {pegState === 'locked' && (
                                <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                    <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                                    <p className="font-bold">Peg-In 完成！</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        BTC 已锁定，侧链代币已释放
                                    </p>
                                </div>
                            )}

                            {pegState === 'unlocked' && (
                                <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-amber-900/30 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                    <CheckCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                                    <p className="font-bold">Peg-Out 完成！</p>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        侧链代币已销毁，BTC 已解锁
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'types' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">侧链类型</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        name: '联邦侧链',
                                        type: 'Federated Sidechain',
                                        color: 'indigo',
                                        desc: '由一组受信任的联邦成员控制双向锚定',
                                        pros: ['实现简单', '快速确认', '已被验证'],
                                        cons: ['需要信任联邦', '可能被审查', '中心化风险'],
                                        example: 'Liquid Network'
                                    },
                                    {
                                        name: '驱动链',
                                        type: 'Drivechain',
                                        color: 'emerald',
                                        desc: '利用矿工共识来管理双向锚定',
                                        pros: ['无需联邦信任', '矿工激励对齐', '更去中心化'],
                                        cons: ['需要软分叉', '矿工可能串通', '较长延迟'],
                                        example: 'BIP 300/301'
                                    },
                                    {
                                        name: 'SPV 证明侧链',
                                        type: 'SPV Proof Sidechain',
                                        desc: '使用 SPV 证明验证跨链交易',
                                        color: 'amber',
                                        pros: ['理论上最安全', '完全去信任'],
                                        cons: ['比特币不支持', '需要重大升级', '复杂度高'],
                                        example: '原始侧链白皮书提案'
                                    },
                                    {
                                        name: '智能合约侧链',
                                        type: 'Smart Contract Sidechain',
                                        desc: '专注于提供智能合约功能',
                                        color: 'violet',
                                        pros: ['功能丰富', 'EVM 兼容', 'DeFi 支持'],
                                        cons: ['安全假设不同', '可能有漏洞', '复杂性高'],
                                        example: 'RSK, Stacks'
                                    },
                                ].map((type, i) => (
                                    <div key={i} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`px-2 py-0.5 rounded text-xs bg-${type.color}-500/20 text-${type.color}-400`}>
                                                {type.type}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">{type.name}</h4>
                                        <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{type.desc}</p>

                                        <div className="grid grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <span className="text-sm font-bold text-emerald-400 block mb-1">优点</span>
                                                <ul className="text-sm space-y-1">
                                                    {type.pros.map((p, j) => (
                                                        <li key={j} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>• {p}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                            <div>
                                                <span className="text-sm font-bold text-rose-400 block mb-1">缺点</span>
                                                <ul className="text-sm space-y-1">
                                                    {type.cons.map((c, j) => (
                                                        <li key={j} className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>• {c}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <div className={`p-2 rounded text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            <span className="text-slate-500">示例: </span>
                                            <span className={`text-${type.color}-400`}>{type.example}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'projects' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">知名侧链项目</h3>

                            <div className="space-y-6">
                                {[
                                    {
                                        name: 'Liquid Network',
                                        type: '联邦侧链',
                                        color: 'blue',
                                        icon: Network,
                                        desc: '由 Blockstream 开发的交易所联盟侧链，专注于快速结算和隐私交易',
                                        features: [
                                            '1 分钟区块时间',
                                            '保密交易 (CT)',
                                            '资产发行',
                                            '15+ 联邦成员',
                                        ],
                                        stats: { tvl: '~3500 BTC', blocks: '~1 min', federation: '15 members' }
                                    },
                                    {
                                        name: 'RSK (Rootstock)',
                                        type: '合并挖矿侧链',
                                        color: 'emerald',
                                        icon: Server,
                                        desc: '比特币上的智能合约平台，与以太坊虚拟机 (EVM) 兼容',
                                        features: [
                                            'EVM 兼容',
                                            '合并挖矿安全',
                                            'DeFi 应用',
                                            '联邦托管',
                                        ],
                                        stats: { tvl: '~2000 BTC', blocks: '30 sec', hashrate: '50%+ BTC' }
                                    },
                                    {
                                        name: 'Stacks',
                                        type: 'Layer 1.5',
                                        color: 'violet',
                                        icon: Layers,
                                        desc: '独特的 PoX 共识，让 BTC 持有者获得收益，支持智能合约',
                                        features: [
                                            'Clarity 智能合约',
                                            'PoX 共识机制',
                                            'STX 原生代币',
                                            'NFT 生态',
                                        ],
                                        stats: { tvl: '~5000 BTC', blocks: '10 min', token: 'STX' }
                                    },
                                ].map((project, i) => (
                                    <div key={i} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex flex-col md:flex-row md:items-start gap-6">
                                            <div className={`w-16 h-16 rounded-xl bg-${project.color}-500/20 flex items-center justify-center shrink-0`}>
                                                <project.icon className={`w-8 h-8 text-${project.color}-400`} />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <h4 className="text-xl font-bold">{project.name}</h4>
                                                    <span className={`px-2 py-0.5 rounded text-xs bg-${project.color}-500/20 text-${project.color}-400`}>
                                                        {project.type}
                                                    </span>
                                                </div>
                                                <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {project.desc}
                                                </p>
                                                <div className="flex flex-wrap gap-2 mb-4">
                                                    {project.features.map((f, j) => (
                                                        <span key={j} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                            {f}
                                                        </span>
                                                    ))}
                                                </div>
                                                <div className="grid grid-cols-3 gap-4">
                                                    {Object.entries(project.stats).map(([key, value], j) => (
                                                        <div key={j} className={`p-2 rounded text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                            <div className={`text-lg font-bold text-${project.color}-400`}>{value}</div>
                                                            <div className="text-xs text-slate-500 capitalize">{key.replace('_', ' ')}</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Comparison Note */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-indigo-900/20 border border-indigo-500/30' : 'bg-indigo-50 border border-indigo-200'}`}>
                                <h4 className="font-bold mb-3">侧链 vs 闪电网络</h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="font-bold text-indigo-400">侧链</span>
                                        <ul className={`mt-2 space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 独立的区块链</li>
                                            <li>• 可添加任意功能</li>
                                            <li>• 需要信任假设</li>
                                            <li>• 链上结算</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <span className="font-bold text-amber-400">闪电网络</span>
                                        <ul className={`mt-2 space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 支付通道网络</li>
                                            <li>• 专注于支付</li>
                                            <li>• 无需信任第三方</li>
                                            <li>• 链下交易</li>
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

export default SidechainsDemo;
