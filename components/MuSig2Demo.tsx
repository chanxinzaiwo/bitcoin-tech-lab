import React, { useState } from 'react';
import { Users, Key, Shield, CheckCircle, XCircle, Zap, Lock, Unlock, ArrowRight, RefreshCw, Share2, Combine, Eye, EyeOff } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const MuSig2Demo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    // Interactive MuSig2 simulation state
    const [participants, setParticipants] = useState([
        { id: 1, name: 'Alice', privateKey: 'a1b2c3...', publicKey: 'P1', nonce: '', partialSig: '', committed: false },
        { id: 2, name: 'Bob', privateKey: 'd4e5f6...', publicKey: 'P2', nonce: '', partialSig: '', committed: false },
        { id: 3, name: 'Carol', privateKey: 'g7h8i9...', publicKey: 'P3', nonce: '', partialSig: '', committed: false },
    ]);
    const [currentStep, setCurrentStep] = useState(0);
    const [aggregatedPubKey, setAggregatedPubKey] = useState('');
    const [aggregatedNonce, setAggregatedNonce] = useState('');
    const [finalSignature, setFinalSignature] = useState('');
    const [message, setMessage] = useState('Transfer 1 BTC to address bc1q...');
    const [showPrivateKeys, setShowPrivateKeys] = useState(false);

    const steps = [
        { name: '密钥聚合', desc: '聚合所有参与者的公钥' },
        { name: '生成 Nonce', desc: '每个参与者生成随机 nonce' },
        { name: '聚合 Nonce', desc: '合并所有 nonce 值' },
        { name: '部分签名', desc: '每人生成部分签名' },
        { name: '聚合签名', desc: '合并为最终签名' },
    ];

    const generateRandomHex = (length: number) => {
        const chars = '0123456789abcdef';
        return Array.from({ length }, () => chars[Math.floor(Math.random() * 16)]).join('');
    };

    const executeStep = () => {
        switch (currentStep) {
            case 0: // Key Aggregation
                const aggKey = 'P_agg = ' + generateRandomHex(16) + '...';
                setAggregatedPubKey(aggKey);
                setCurrentStep(1);
                break;
            case 1: // Generate Nonces
                setParticipants(prev => prev.map(p => ({
                    ...p,
                    nonce: 'R' + p.id + ' = ' + generateRandomHex(12) + '...',
                    committed: true
                })));
                setCurrentStep(2);
                break;
            case 2: // Aggregate Nonces
                const aggNonce = 'R_agg = ' + generateRandomHex(16) + '...';
                setAggregatedNonce(aggNonce);
                setCurrentStep(3);
                break;
            case 3: // Partial Signatures
                setParticipants(prev => prev.map(p => ({
                    ...p,
                    partialSig: 's' + p.id + ' = ' + generateRandomHex(12) + '...'
                })));
                setCurrentStep(4);
                break;
            case 4: // Final Signature
                const finalSig = '(R_agg, s_agg) = (' + generateRandomHex(16) + '..., ' + generateRandomHex(16) + '...)';
                setFinalSignature(finalSig);
                setCurrentStep(5);
                break;
        }
    };

    const resetSimulation = () => {
        setCurrentStep(0);
        setAggregatedPubKey('');
        setAggregatedNonce('');
        setFinalSignature('');
        setParticipants(prev => prev.map(p => ({
            ...p,
            nonce: '',
            partialSig: '',
            committed: false
        })));
    };

    const tabs = [
        { id: 'intro', label: '概念介绍' },
        { id: 'protocol', label: '协议流程' },
        { id: 'interactive', label: '交互模拟' },
        { id: 'comparison', label: '方案对比' },
        { id: 'applications', label: '应用场景' },
        { id: 'quiz', label: '知识测验' },
    ];

    const quizData = getQuizByModule('musig2');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Users className="w-4 h-4" />
                        高级签名技术
                    </div>
                    <h1 className="text-4xl font-bold mb-4">MuSig2 多方聚合签名</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
                        MuSig2 是一种先进的多方 Schnorr 签名聚合协议，允许多个参与者共同创建一个看起来像单签名的签名，
                        提供更高的隐私性和更低的交易费用
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
                                    ? 'bg-violet-500 text-white'
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
                                        <Shield className="w-5 h-5 text-violet-400" />
                                        什么是 MuSig2？
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                                        MuSig2 是 MuSig 协议的改进版本，由 Blockstream 研究团队开发。
                                        它是一个<strong>两轮</strong>的多方 Schnorr 签名协议，
                                        允许 n 个参与者共同创建一个有效的 Schnorr 签名，
                                        而这个签名在链上看起来与普通的单人签名完全相同。
                                    </p>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-amber-400" />
                                        核心优势
                                    </h3>
                                    <ul className="space-y-3">
                                        {[
                                            { title: '隐私性', desc: '外部观察者无法区分多签和单签' },
                                            { title: '效率', desc: '签名大小与单签相同，节省链上空间' },
                                            { title: '安全性', desc: '抗 Rogue Key 攻击，无需密钥证明' },
                                            { title: '简洁', desc: '只需两轮通信，减少交互复杂度' },
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                                                <div>
                                                    <span className="font-semibold">{item.title}：</span>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{item.desc}</span>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Visual Comparison */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/20' : 'bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200'}`}>
                                <h3 className="text-xl font-bold mb-6 text-center">传统多签 vs MuSig2</h3>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="text-center">
                                        <h4 className="font-bold mb-4 text-rose-400">传统 2-of-3 多签</h4>
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'} font-mono text-sm`}>
                                            <div className="text-slate-500 mb-2">链上脚本:</div>
                                            <div className="text-left">
                                                <div>OP_2</div>
                                                <div className="text-rose-400">&lt;PubKey1&gt;</div>
                                                <div className="text-rose-400">&lt;PubKey2&gt;</div>
                                                <div className="text-rose-400">&lt;PubKey3&gt;</div>
                                                <div>OP_3</div>
                                                <div>OP_CHECKMULTISIG</div>
                                            </div>
                                            <div className="mt-4 text-slate-500">
                                                签名数据: ~140 bytes
                                            </div>
                                        </div>
                                        <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            暴露参与者数量和公钥
                                        </p>
                                    </div>

                                    <div className="text-center">
                                        <h4 className="font-bold mb-4 text-emerald-400">MuSig2 聚合签名</h4>
                                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'} font-mono text-sm`}>
                                            <div className="text-slate-500 mb-2">链上脚本:</div>
                                            <div className="text-left">
                                                <div className="text-emerald-400">&lt;AggregatedPubKey&gt;</div>
                                                <div>OP_CHECKSIG</div>
                                            </div>
                                            <div className="mt-4 text-slate-500">
                                                签名数据: ~64 bytes
                                            </div>
                                        </div>
                                        <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            与单签名完全相同
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Key Concepts */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">核心概念</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            title: '公钥聚合',
                                            desc: '将所有参与者的公钥数学聚合为一个单一的聚合公钥',
                                            icon: Combine,
                                            color: 'violet'
                                        },
                                        {
                                            title: 'Nonce 承诺',
                                            desc: '每个参与者生成随机 nonce 并交换承诺，防止恶意操纵',
                                            icon: Lock,
                                            color: 'blue'
                                        },
                                        {
                                            title: '部分签名聚合',
                                            desc: '每个参与者的部分签名组合成一个完整的 Schnorr 签名',
                                            icon: Share2,
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

                    {activeTab === 'protocol' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">MuSig2 协议流程</h3>

                            {/* Protocol Steps */}
                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-blue-500 to-emerald-500"></div>

                                {[
                                    {
                                        step: 1,
                                        title: '密钥设置阶段',
                                        color: 'violet',
                                        details: [
                                            '每个参与者 i 拥有私钥 xᵢ 和公钥 Pᵢ = xᵢ·G',
                                            '所有公钥被收集: L = {P₁, P₂, ..., Pₙ}',
                                            '计算聚合公钥: P = Σ(aᵢ·Pᵢ)，其中 aᵢ = H(L, Pᵢ)',
                                            '聚合系数 aᵢ 防止 Rogue Key 攻击',
                                        ],
                                        formula: 'P_agg = Σ H(L, Pᵢ) · Pᵢ'
                                    },
                                    {
                                        step: 2,
                                        title: '第一轮：Nonce 生成与交换',
                                        color: 'blue',
                                        details: [
                                            '每个参与者生成两个随机 nonce: rᵢ,₁ 和 rᵢ,₂',
                                            '计算 nonce 公钥: Rᵢ,₁ = rᵢ,₁·G, Rᵢ,₂ = rᵢ,₂·G',
                                            '广播 (Rᵢ,₁, Rᵢ,₂) 给所有参与者',
                                            '这些 nonce 可以提前预生成，减少交互',
                                        ],
                                        formula: 'Rᵢ = (Rᵢ,₁, Rᵢ,₂)'
                                    },
                                    {
                                        step: 3,
                                        title: 'Nonce 聚合',
                                        color: 'cyan',
                                        details: [
                                            '计算挑战值 b = H(P_agg, {Rᵢ}, m)',
                                            '聚合第一组 nonce: R₁ = Σ Rᵢ,₁',
                                            '聚合第二组 nonce: R₂ = Σ Rᵢ,₂',
                                            '最终聚合 nonce: R = R₁ + b·R₂',
                                        ],
                                        formula: 'R = Σ Rᵢ,₁ + b · Σ Rᵢ,₂'
                                    },
                                    {
                                        step: 4,
                                        title: '第二轮：部分签名',
                                        color: 'amber',
                                        details: [
                                            '计算消息挑战: c = H(R, P_agg, m)',
                                            '每个参与者计算部分签名: sᵢ = rᵢ,₁ + b·rᵢ,₂ + c·aᵢ·xᵢ',
                                            '广播部分签名 sᵢ',
                                            '验证每个部分签名的正确性',
                                        ],
                                        formula: 'sᵢ = rᵢ,₁ + b·rᵢ,₂ + c·aᵢ·xᵢ'
                                    },
                                    {
                                        step: 5,
                                        title: '签名聚合',
                                        color: 'emerald',
                                        details: [
                                            '聚合所有部分签名: s = Σ sᵢ',
                                            '最终签名: σ = (R, s)',
                                            '这是一个标准的 Schnorr 签名',
                                            '可以用聚合公钥 P_agg 验证',
                                        ],
                                        formula: 'σ = (R, s = Σ sᵢ)'
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-16 pb-8">
                                        <div className={`absolute left-4 w-5 h-5 rounded-full bg-${item.color}-500 border-4 ${isDarkMode ? 'border-slate-900' : 'border-white'}`}></div>
                                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold bg-${item.color}-500/20 text-${item.color}-400`}>
                                                    步骤 {item.step}
                                                </span>
                                                <h4 className="text-lg font-bold">{item.title}</h4>
                                            </div>
                                            <ul className="space-y-2 mb-4">
                                                {item.details.map((detail, j) => (
                                                    <li key={j} className={`flex items-start gap-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                        <span className="text-slate-500">•</span>
                                                        {detail}
                                                    </li>
                                                ))}
                                            </ul>
                                            <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                <span className="text-slate-500">公式: </span>
                                                <span className={`text-${item.color}-400`}>{item.formula}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Security Note */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h4 className="font-bold mb-3 flex items-center gap-2 text-amber-400">
                                    <Shield className="w-5 h-5" />
                                    安全性说明
                                </h4>
                                <ul className="space-y-2 text-sm">
                                    <li className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <strong>Rogue Key 攻击防护：</strong>通过密钥聚合系数 aᵢ = H(L, Pᵢ) 防止攻击者操纵聚合公钥
                                    </li>
                                    <li className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <strong>双 Nonce 设计：</strong>使用两个 nonce 允许预计算，同时保持安全性
                                    </li>
                                    <li className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <strong>Nonce 重用风险：</strong>绝对不能重复使用同一个 nonce，否则私钥会泄露
                                    </li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold">MuSig2 签名模拟</h3>
                                <button
                                    onClick={resetSimulation}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-200 hover:bg-slate-300'}`}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    重置
                                </button>
                            </div>

                            {/* Message Input */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <label className="block text-sm font-medium mb-2">待签名消息</label>
                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg font-mono ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border`}
                                />
                            </div>

                            {/* Progress Steps */}
                            <div className="flex items-center justify-between mb-6 overflow-x-auto pb-2">
                                {steps.map((step, i) => (
                                    <div key={i} className="flex items-center">
                                        <div className={`flex flex-col items-center ${i <= currentStep ? 'text-violet-400' : 'text-slate-500'}`}>
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                                                i < currentStep ? 'bg-violet-500 text-white' :
                                                i === currentStep ? 'bg-violet-500/20 border-2 border-violet-500' :
                                                isDarkMode ? 'bg-slate-800' : 'bg-slate-200'
                                            }`}>
                                                {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                                            </div>
                                            <span className="text-xs mt-1 whitespace-nowrap">{step.name}</span>
                                        </div>
                                        {i < steps.length - 1 && (
                                            <div className={`w-8 h-0.5 mx-1 ${i < currentStep ? 'bg-violet-500' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Participants */}
                            <div className="grid md:grid-cols-3 gap-4">
                                {participants.map((p) => (
                                    <div key={p.id} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className={`w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center`}>
                                                <Users className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <span className="font-bold">{p.name}</span>
                                        </div>

                                        <div className="space-y-2 text-sm font-mono">
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={() => setShowPrivateKeys(!showPrivateKeys)}
                                                    className="p-1 rounded hover:bg-slate-700"
                                                >
                                                    {showPrivateKeys ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                                                </button>
                                                <span className="text-slate-500">私钥:</span>
                                                <span className={showPrivateKeys ? 'text-rose-400' : 'text-slate-600'}>
                                                    {showPrivateKeys ? p.privateKey : '••••••'}
                                                </span>
                                            </div>
                                            <div>
                                                <span className="text-slate-500">公钥:</span>
                                                <span className="text-emerald-400 ml-2">{p.publicKey}</span>
                                            </div>
                                            {p.nonce && (
                                                <div>
                                                    <span className="text-slate-500">Nonce:</span>
                                                    <span className="text-blue-400 ml-2">{p.nonce}</span>
                                                </div>
                                            )}
                                            {p.partialSig && (
                                                <div>
                                                    <span className="text-slate-500">部分签名:</span>
                                                    <span className="text-amber-400 ml-2">{p.partialSig}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Aggregated Values */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-violet-900/30 to-purple-900/30 border border-violet-500/20' : 'bg-gradient-to-r from-violet-100 to-purple-100 border border-violet-200'}`}>
                                <h4 className="font-bold mb-4">聚合结果</h4>
                                <div className="grid md:grid-cols-3 gap-4 font-mono text-sm">
                                    <div>
                                        <span className="text-slate-500 block mb-1">聚合公钥</span>
                                        <span className={`${aggregatedPubKey ? 'text-violet-400' : 'text-slate-600'}`}>
                                            {aggregatedPubKey || '等待聚合...'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-1">聚合 Nonce</span>
                                        <span className={`${aggregatedNonce ? 'text-blue-400' : 'text-slate-600'}`}>
                                            {aggregatedNonce || '等待聚合...'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 block mb-1">最终签名</span>
                                        <span className={`${finalSignature ? 'text-emerald-400' : 'text-slate-600'}`}>
                                            {finalSignature || '等待生成...'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Action Button */}
                            {currentStep < 5 && (
                                <button
                                    onClick={executeStep}
                                    className="w-full py-4 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-bold flex items-center justify-center gap-2"
                                >
                                    执行: {steps[currentStep].name}
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            )}

                            {currentStep === 5 && (
                                <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                                    <h4 className="text-xl font-bold mb-2">签名完成！</h4>
                                    <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        3 个参与者成功创建了一个聚合签名，在链上看起来与单签名完全相同
                                    </p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">多签方案对比</h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                            <th className="px-4 py-3 text-left">特性</th>
                                            <th className="px-4 py-3 text-left">传统多签</th>
                                            <th className="px-4 py-3 text-left">MuSig (v1)</th>
                                            <th className="px-4 py-3 text-left">MuSig2</th>
                                            <th className="px-4 py-3 text-left">FROST</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}>
                                        {[
                                            { feature: '签名大小', trad: '~140 bytes', v1: '64 bytes', v2: '64 bytes', frost: '64 bytes' },
                                            { feature: '通信轮数', trad: '1', v1: '3', v2: '2', frost: '2' },
                                            { feature: '链上隐私', trad: '差', v1: '优秀', v2: '优秀', frost: '优秀' },
                                            { feature: '门限支持', trad: 'n-of-m', v1: 'n-of-n', v2: 'n-of-n', frost: 't-of-n' },
                                            { feature: '预计算 Nonce', trad: 'N/A', v1: '否', v2: '是', frost: '是' },
                                            { feature: '抗 Rogue Key', trad: 'N/A', v1: '需要 PoP', v2: '内置', frost: '内置' },
                                            { feature: '签名类型', trad: 'ECDSA', v1: 'Schnorr', v2: 'Schnorr', frost: 'Schnorr' },
                                        ].map((row, i) => (
                                            <tr key={i} className={isDarkMode ? 'border-slate-700' : 'border-slate-200'}>
                                                <td className="px-4 py-3 font-medium">{row.feature}</td>
                                                <td className="px-4 py-3 text-rose-400">{row.trad}</td>
                                                <td className="px-4 py-3 text-amber-400">{row.v1}</td>
                                                <td className="px-4 py-3 text-emerald-400">{row.v2}</td>
                                                <td className="px-4 py-3 text-violet-400">{row.frost}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Detailed Comparisons */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className="font-bold mb-4 text-amber-400">MuSig vs MuSig2</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                                            <div>
                                                <span className="font-medium">MuSig (v1) 需要 3 轮通信</span>
                                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    第一轮交换 nonce 承诺，增加了延迟
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <div>
                                                <span className="font-medium">MuSig2 只需 2 轮</span>
                                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    使用双 nonce 设计，允许预计算
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className="font-bold mb-4 text-violet-400">MuSig2 vs FROST</h4>
                                    <ul className="space-y-3">
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                                            <div>
                                                <span className="font-medium">MuSig2: 所有人必须参与</span>
                                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    n-of-n 模式，更简单但灵活性低
                                                </p>
                                            </div>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-5 h-5 text-violet-400 shrink-0" />
                                            <div>
                                                <span className="font-medium">FROST: 支持门限签名</span>
                                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    t-of-n 模式，部分参与者即可签名
                                                </p>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">应用场景</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: '交易所冷钱包',
                                        icon: Lock,
                                        color: 'blue',
                                        desc: '多个管理员共同控制大额资金，单一私钥泄露不会导致资产损失',
                                        benefits: ['消除单点故障', '审计简单', '链上成本低']
                                    },
                                    {
                                        title: '闪电网络通道',
                                        icon: Zap,
                                        color: 'amber',
                                        desc: '双方协作创建通道交易，使用 MuSig2 可以减少见证数据大小',
                                        benefits: ['降低链上费用', '提高隐私性', '简化通道管理']
                                    },
                                    {
                                        title: 'Taproot 多签',
                                        icon: Shield,
                                        color: 'violet',
                                        desc: '在 Taproot 地址的 keypath 中使用 MuSig2，实现完美隐私的多签',
                                        benefits: ['与单签完全相同', '节省区块空间', '保护参与者隐私']
                                    },
                                    {
                                        title: 'DAO 治理',
                                        icon: Users,
                                        color: 'emerald',
                                        desc: '去中心化组织的资金管理，多个委员会成员共同授权',
                                        benefits: ['去中心化控制', '透明审计', '防止单方作恶']
                                    },
                                ].map((app, i) => (
                                    <div key={i} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className={`w-12 h-12 rounded-xl bg-${app.color}-500/20 text-${app.color}-400 flex items-center justify-center mb-4`}>
                                            <app.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">{app.title}</h4>
                                        <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{app.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {app.benefits.map((b, j) => (
                                                <span key={j} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                    {b}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Real World Example */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-violet-900/30 to-blue-900/30 border border-violet-500/20' : 'bg-gradient-to-r from-violet-100 to-blue-100 border border-violet-200'}`}>
                                <h4 className="font-bold mb-4">实际案例：交易所冷钱包</h4>
                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                    <div className="text-center">
                                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'} mb-2`}>
                                            <Users className="w-8 h-8 mx-auto text-violet-400 mb-2" />
                                            <div className="font-bold">3 位管理员</div>
                                        </div>
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            CEO, CTO, CFO
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'} mb-2`}>
                                            <Key className="w-8 h-8 mx-auto text-emerald-400 mb-2" />
                                            <div className="font-bold">1 个聚合公钥</div>
                                        </div>
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            bc1p...xyz
                                        </span>
                                    </div>
                                    <div className="text-center">
                                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-white'} mb-2`}>
                                            <Shield className="w-8 h-8 mx-auto text-blue-400 mb-2" />
                                            <div className="font-bold">链上隐私</div>
                                        </div>
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            无法识别多签
                                        </span>
                                    </div>
                                </div>
                                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                    当需要提币时，3 位管理员各自使用自己的私钥生成部分签名，
                                    然后聚合成一个完整的 Schnorr 签名。外部观察者只能看到一个普通的单签名交易，
                                    无法知道这实际上需要 3 人共同授权。
                                </p>
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

export default MuSig2Demo;
