import React, { useState, useEffect } from 'react';
import { KeyRound, Users, Shield, Lock, Unlock, CheckCircle, XCircle, AlertTriangle, Share2, Combine, Zap, Building, Wallet, Globe, EyeOff } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const ThresholdSigDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'shamir', label: '秘密分享' },
        { id: 'musig', label: 'MuSig 协议' },
        { id: 'frost', label: 'FROST 协议' },
        { id: 'usecases', label: '应用场景' },
        { id: 'quiz', label: '测验' }
    ];

    // Shamir Secret Sharing Demo State
    const [shamirSecret, setShamirSecret] = useState(42);
    const [shamirThreshold, setShamirThreshold] = useState(2);
    const [shamirTotal, setShamirTotal] = useState(3);
    const [shamirShares, setShamirShares] = useState<{ x: number; y: number }[]>([]);
    const [selectedShares, setSelectedShares] = useState<number[]>([]);
    const [reconstructedSecret, setReconstructedSecret] = useState<number | null>(null);

    // MuSig Demo State
    const [musigParticipants, setMusigParticipants] = useState(3);
    const [musigStep, setMusigStep] = useState(0);
    const [musigNonces, setMusigNonces] = useState<string[]>([]);
    const [musigPartialSigs, setMusigPartialSigs] = useState<string[]>([]);
    const [musigAggregatedSig, setMusigAggregatedSig] = useState('');

    // FROST Demo State
    const [frostThreshold, setFrostThreshold] = useState(2);
    const [frostTotal, setFrostTotal] = useState(3);
    const [frostStep, setFrostStep] = useState(0);
    const [frostSigners, setFrostSigners] = useState<number[]>([]);
    const [frostCommitments, setFrostCommitments] = useState<string[]>([]);
    const [frostSignature, setFrostSignature] = useState('');

    // Simple polynomial for demo (mod 97 for simplicity)
    const PRIME = 97;

    const generateShamirShares = () => {
        // Generate random coefficients for polynomial
        const coefficients = [shamirSecret % PRIME];
        for (let i = 1; i < shamirThreshold; i++) {
            coefficients.push(Math.floor(Math.random() * PRIME));
        }

        // Generate shares
        const shares: { x: number; y: number }[] = [];
        for (let x = 1; x <= shamirTotal; x++) {
            let y = 0;
            for (let i = 0; i < coefficients.length; i++) {
                y += coefficients[i] * Math.pow(x, i);
            }
            shares.push({ x, y: y % PRIME });
        }

        setShamirShares(shares);
        setSelectedShares([]);
        setReconstructedSecret(null);
    };

    const toggleShareSelection = (index: number) => {
        setSelectedShares(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            }
            return [...prev, index];
        });
        setReconstructedSecret(null);
    };

    // Lagrange interpolation for reconstruction
    const reconstructSecret = () => {
        if (selectedShares.length < shamirThreshold) {
            return;
        }

        const selected = selectedShares.map(i => shamirShares[i]);
        let secret = 0;

        for (let i = 0; i < selected.length; i++) {
            let numerator = 1;
            let denominator = 1;

            for (let j = 0; j < selected.length; j++) {
                if (i !== j) {
                    numerator *= (0 - selected[j].x);
                    denominator *= (selected[i].x - selected[j].x);
                }
            }

            // Simple modular arithmetic (not fully correct but good for demo)
            let lagrange = (numerator / denominator) * selected[i].y;
            secret += lagrange;
        }

        // Take positive modulo
        secret = ((secret % PRIME) + PRIME) % PRIME;
        setReconstructedSecret(Math.round(secret));
    };

    // MuSig simulation
    const runMusigStep = () => {
        if (musigStep === 0) {
            // Round 1: Generate nonces
            const nonces = [];
            for (let i = 0; i < musigParticipants; i++) {
                nonces.push(`R${i + 1}: ${Math.random().toString(16).slice(2, 10)}`);
            }
            setMusigNonces(nonces);
            setMusigStep(1);
        } else if (musigStep === 1) {
            // Round 2: Generate partial signatures
            const partials = [];
            for (let i = 0; i < musigParticipants; i++) {
                partials.push(`s${i + 1}: ${Math.random().toString(16).slice(2, 10)}`);
            }
            setMusigPartialSigs(partials);
            setMusigStep(2);
        } else if (musigStep === 2) {
            // Aggregate signature
            setMusigAggregatedSig(`σ: ${Math.random().toString(16).slice(2, 18)}`);
            setMusigStep(3);
        }
    };

    const resetMusig = () => {
        setMusigStep(0);
        setMusigNonces([]);
        setMusigPartialSigs([]);
        setMusigAggregatedSig('');
    };

    // FROST simulation
    const toggleFrostSigner = (index: number) => {
        setFrostSigners(prev => {
            if (prev.includes(index)) {
                return prev.filter(i => i !== index);
            }
            if (prev.length < frostThreshold) {
                return [...prev, index];
            }
            return prev;
        });
    };

    const runFrostStep = () => {
        if (frostStep === 0 && frostSigners.length >= frostThreshold) {
            // Generate commitments
            const commitments = frostSigners.map(i =>
                `(D${i + 1}, E${i + 1}): ${Math.random().toString(16).slice(2, 8)}`
            );
            setFrostCommitments(commitments);
            setFrostStep(1);
        } else if (frostStep === 1) {
            // Generate threshold signature
            setFrostSignature(`σ: ${Math.random().toString(16).slice(2, 18)}`);
            setFrostStep(2);
        }
    };

    const resetFrost = () => {
        setFrostStep(0);
        setFrostSigners([]);
        setFrostCommitments([]);
        setFrostSignature('');
    };

    useEffect(() => {
        generateShamirShares();
    }, [shamirSecret, shamirThreshold, shamirTotal]);

    const quizData = getQuizByModule('threshold');

    return (
        <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-4">
                        <KeyRound className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        门限签名
                    </h1>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Threshold Signatures - 分布式密钥管理与协作签名
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
                                    ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg'
                                    : isDarkMode
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={`rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6`}>

                    {/* Intro Tab */}
                    {activeTab === 'intro' && (
                        <div className="space-y-6">
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                                    什么是门限签名？
                                </h3>
                                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                                    门限签名（Threshold Signature）是一种密码学方案，允许一组 n 个参与者中的任意 t 个（t ≤ n）
                                    协作生成有效签名。与传统多签不同，门限签名在链上只显示为单个签名，提供更好的隐私性和效率。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Users className="w-5 h-5 text-purple-500" />
                                        多签 vs 门限签名
                                    </h4>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>传统多签 (MultiSig)</p>
                                            <ul className={`text-sm mt-1 space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <li>• 链上显示多个独立签名</li>
                                                <li>• 暴露参与者数量和门限</li>
                                                <li>• 交易体积随签名数增加</li>
                                            </ul>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50'}`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>门限签名 (Threshold)</p>
                                            <ul className={`text-sm mt-1 space-y-1 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                                                <li>• 链上只有单个聚合签名</li>
                                                <li>• 外部无法区分单签/多签</li>
                                                <li>• 固定大小，更高效</li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Shield className="w-5 h-5 text-indigo-500" />
                                        核心技术
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            { name: 'Shamir 秘密分享', desc: '将秘密分成多个份额' },
                                            { name: 'MuSig / MuSig2', desc: 'Schnorr 多签聚合' },
                                            { name: 'FROST', desc: '灵活的门限 Schnorr' },
                                            { name: 'DKG', desc: '分布式密钥生成' },
                                        ].map((tech, i) => (
                                            <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{tech.name}</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{tech.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    门限签名流程
                                </h4>
                                <div className="flex flex-wrap items-center justify-center gap-3">
                                    {[
                                        { icon: Share2, label: '密钥分发', color: 'purple' },
                                        { icon: Users, label: '参与者选择', color: 'indigo' },
                                        { icon: Lock, label: '承诺交换', color: 'blue' },
                                        { icon: Combine, label: '签名聚合', color: 'cyan' },
                                        { icon: CheckCircle, label: '验证完成', color: 'green' },
                                    ].map((step, i) => (
                                        <React.Fragment key={i}>
                                            <div className={`flex flex-col items-center p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <step.icon className={`w-6 h-6 mb-1 text-${step.color}-500`} />
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step.label}</span>
                                            </div>
                                            {i < 4 && <span className={`${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>→</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'}`}>
                                <p className={`text-sm ${isDarkMode ? 'text-indigo-300' : 'text-indigo-700'}`}>
                                    <strong>比特币中的应用：</strong>Taproot 升级引入的 Schnorr 签名使得门限签名在比特币上成为可能。
                                    MuSig2 和 FROST 协议允许多方协作生成单个有效签名，与普通交易无法区分。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Shamir Tab */}
                    {activeTab === 'shamir' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-700'}`}>
                                    Shamir 秘密分享 (SSS)
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-purple-200' : 'text-purple-600'}`}>
                                    使用多项式插值将秘密分成多个份额，只有达到门限数量的份额才能重建原始秘密。
                                    基于拉格朗日插值定理：t 个点可以唯一确定一个 t-1 次多项式。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        参数设置
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                秘密值 (0-96)
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max="96"
                                                value={shamirSecret}
                                                onChange={(e) => setShamirSecret(Math.min(96, Math.max(0, parseInt(e.target.value) || 0)))}
                                                className={`w-full px-3 py-2 rounded-lg border ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-white border-slate-300'}`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                门限 (t) - 重建所需份额数
                                            </label>
                                            <input
                                                type="range"
                                                min="2"
                                                max={shamirTotal}
                                                value={shamirThreshold}
                                                onChange={(e) => setShamirThreshold(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="text-center font-mono text-purple-500">{shamirThreshold}</div>
                                        </div>
                                        <div>
                                            <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                总份额数 (n)
                                            </label>
                                            <input
                                                type="range"
                                                min={shamirThreshold}
                                                max="5"
                                                value={shamirTotal}
                                                onChange={(e) => setShamirTotal(parseInt(e.target.value))}
                                                className="w-full"
                                            />
                                            <div className="text-center font-mono text-indigo-500">{shamirTotal}</div>
                                        </div>
                                        <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {shamirThreshold}-of-{shamirTotal} 方案
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        份额 (点击选择)
                                    </h4>
                                    <div className="space-y-2 mb-4">
                                        {shamirShares.map((share, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleShareSelection(i)}
                                                className={`w-full p-3 rounded-lg flex items-center justify-between transition-all ${
                                                    selectedShares.includes(i)
                                                        ? isDarkMode
                                                            ? 'bg-purple-600 text-white'
                                                            : 'bg-purple-500 text-white'
                                                        : isDarkMode
                                                            ? 'bg-slate-700 hover:bg-slate-600'
                                                            : 'bg-white hover:bg-slate-100'
                                                }`}
                                            >
                                                <span className="font-mono">
                                                    份额 #{i + 1}: (x={share.x}, y={share.y})
                                                </span>
                                                {selectedShares.includes(i) ? (
                                                    <CheckCircle className="w-5 h-5" />
                                                ) : (
                                                    <div className={`w-5 h-5 rounded-full border-2 ${isDarkMode ? 'border-slate-500' : 'border-slate-300'}`} />
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            已选择: {selectedShares.length} / {shamirThreshold} 所需
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    秘密重建
                                </h4>
                                <div className="flex flex-wrap gap-4 items-center">
                                    <button
                                        onClick={reconstructSecret}
                                        disabled={selectedShares.length < shamirThreshold}
                                        className={`px-6 py-3 rounded-lg font-medium transition-all ${
                                            selectedShares.length >= shamirThreshold
                                                ? 'bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:shadow-lg'
                                                : isDarkMode
                                                    ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                                                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        }`}
                                    >
                                        重建秘密
                                    </button>
                                    {reconstructedSecret !== null && (
                                        <div className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                                            reconstructedSecret === shamirSecret % PRIME
                                                ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                                                : isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {reconstructedSecret === shamirSecret % PRIME ? (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>成功！重建值: {reconstructedSecret}</span>
                                                </>
                                            ) : (
                                                <>
                                                    <XCircle className="w-5 h-5" />
                                                    <span>重建值: {reconstructedSecret} (不匹配)</span>
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {selectedShares.length < shamirThreshold && (
                                    <p className={`mt-3 text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                        <AlertTriangle className="w-4 h-4 inline mr-1" />
                                        需要至少 {shamirThreshold} 个份额才能重建秘密
                                    </p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* MuSig Tab */}
                    {activeTab === 'musig' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-700'}`}>
                                    MuSig2 协议
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`}>
                                    MuSig2 是一种 n-of-n 多签方案，所有参与者必须协作才能生成有效签名。
                                    它只需要两轮通信，签名结果与普通 Schnorr 签名无法区分。
                                </p>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        参与者数量
                                    </h4>
                                    <div className="flex items-center gap-2">
                                        {[2, 3, 4, 5].map(n => (
                                            <button
                                                key={n}
                                                onClick={() => {
                                                    setMusigParticipants(n);
                                                    resetMusig();
                                                }}
                                                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                                                    musigParticipants === n
                                                        ? 'bg-indigo-500 text-white'
                                                        : isDarkMode
                                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                            : 'bg-white text-slate-600 hover:bg-slate-100'
                                                }`}
                                            >
                                                {n}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                    <span className={`font-mono ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                        {musigParticipants}-of-{musigParticipants} MuSig2
                                    </span>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    签名流程模拟
                                </h4>

                                {/* Step indicators */}
                                <div className="flex items-center justify-between mb-6">
                                    {['密钥聚合', '第一轮: Nonce', '第二轮: 部分签名', '聚合签名'].map((step, i) => (
                                        <div key={i} className="flex flex-col items-center flex-1">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                                                i <= musigStep
                                                    ? 'bg-indigo-500 text-white'
                                                    : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                                            }`}>
                                                {i < musigStep ? <CheckCircle className="w-4 h-4" /> : i + 1}
                                            </div>
                                            <span className={`text-xs text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {step}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Current step content */}
                                <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                    {musigStep === 0 && (
                                        <div className="text-center">
                                            <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                                准备 {musigParticipants} 个参与者的公钥进行聚合
                                            </p>
                                            <div className="flex justify-center gap-2 mt-3">
                                                {Array.from({ length: musigParticipants }, (_, i) => (
                                                    <div key={i} className={`px-3 py-1 rounded text-sm font-mono ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                        P{i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {musigStep === 1 && (
                                        <div>
                                            <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                第一轮: Nonce 承诺
                                            </h5>
                                            <div className="space-y-1">
                                                {musigNonces.map((nonce, i) => (
                                                    <div key={i} className={`font-mono text-sm p-2 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                        {nonce}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {musigStep === 2 && (
                                        <div>
                                            <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                第二轮: 部分签名
                                            </h5>
                                            <div className="space-y-1">
                                                {musigPartialSigs.map((sig, i) => (
                                                    <div key={i} className={`font-mono text-sm p-2 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                        {sig}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {musigStep === 3 && (
                                        <div className="text-center">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                聚合签名完成！
                                            </p>
                                            <div className={`font-mono text-sm p-3 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                {musigAggregatedSig}
                                            </div>
                                            <p className={`text-sm mt-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                这个签名与普通 Schnorr 签名在链上无法区分
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={runMusigStep}
                                        disabled={musigStep >= 3}
                                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                            musigStep < 3
                                                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg'
                                                : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                                        }`}
                                    >
                                        {musigStep === 0 ? '开始签名' : musigStep < 3 ? '下一步' : '完成'}
                                    </button>
                                    <button
                                        onClick={resetMusig}
                                        className={`px-4 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        重置
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* FROST Tab */}
                    {activeTab === 'frost' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                                    FROST 协议
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-cyan-200' : 'text-cyan-600'}`}>
                                    FROST (Flexible Round-Optimized Schnorr Threshold) 是一种 t-of-n 门限签名方案。
                                    与 MuSig 不同，FROST 只需要门限数量的参与者即可生成有效签名，更加灵活。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        门限设置
                                    </h4>
                                    <div className="space-y-4">
                                        <div>
                                            <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                门限 (t)
                                            </label>
                                            <input
                                                type="range"
                                                min="2"
                                                max={frostTotal}
                                                value={frostThreshold}
                                                onChange={(e) => {
                                                    setFrostThreshold(parseInt(e.target.value));
                                                    resetFrost();
                                                }}
                                                className="w-full"
                                            />
                                            <div className="text-center font-mono text-cyan-500">{frostThreshold}</div>
                                        </div>
                                        <div>
                                            <label className={`block text-sm mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                总参与者 (n)
                                            </label>
                                            <input
                                                type="range"
                                                min={frostThreshold}
                                                max="5"
                                                value={frostTotal}
                                                onChange={(e) => {
                                                    setFrostTotal(parseInt(e.target.value));
                                                    resetFrost();
                                                }}
                                                className="w-full"
                                            />
                                            <div className="text-center font-mono text-blue-500">{frostTotal}</div>
                                        </div>
                                        <div className={`p-3 rounded-lg text-center ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={`font-mono text-lg ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                                                {frostThreshold}-of-{frostTotal} FROST
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        选择签名者 ({frostSigners.length}/{frostThreshold})
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2">
                                        {Array.from({ length: frostTotal }, (_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => toggleFrostSigner(i)}
                                                disabled={frostStep > 0}
                                                className={`p-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                                    frostSigners.includes(i)
                                                        ? 'bg-cyan-500 text-white'
                                                        : isDarkMode
                                                            ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                            : 'bg-white text-slate-600 hover:bg-slate-100'
                                                } ${frostStep > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                <Users className="w-4 h-4" />
                                                参与者 {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    签名流程
                                </h4>

                                {/* Step content */}
                                <div className={`p-4 rounded-lg mb-4 min-h-[120px] ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                    {frostStep === 0 && frostSigners.length < frostThreshold && (
                                        <div className="text-center">
                                            <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-amber-400' : 'text-amber-500'}`} />
                                            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                                请选择至少 {frostThreshold} 个签名者
                                            </p>
                                        </div>
                                    )}
                                    {frostStep === 0 && frostSigners.length >= frostThreshold && (
                                        <div className="text-center">
                                            <Users className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
                                            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                                已选择 {frostSigners.length} 个签名者，可以开始签名
                                            </p>
                                            <div className="flex justify-center gap-2 mt-3">
                                                {frostSigners.sort((a, b) => a - b).map(i => (
                                                    <div key={i} className="px-3 py-1 rounded bg-cyan-500 text-white text-sm font-mono">
                                                        P{i + 1}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {frostStep === 1 && (
                                        <div>
                                            <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                第一轮: 签名承诺
                                            </h5>
                                            <div className="space-y-1">
                                                {frostCommitments.map((c, i) => (
                                                    <div key={i} className={`font-mono text-sm p-2 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                        {c}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {frostStep === 2 && (
                                        <div className="text-center">
                                            <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
                                            <p className={`font-medium mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                门限签名完成！
                                            </p>
                                            <div className={`font-mono text-sm p-3 rounded ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                {frostSignature}
                                            </div>
                                            <p className={`text-sm mt-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                仅用 {frostSigners.length}/{frostTotal} 个参与者生成了有效签名
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={runFrostStep}
                                        disabled={frostSigners.length < frostThreshold || frostStep >= 2}
                                        className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                            frostSigners.length >= frostThreshold && frostStep < 2
                                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:shadow-lg'
                                                : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                                        }`}
                                    >
                                        {frostStep === 0 ? '开始签名' : frostStep < 2 ? '生成签名' : '完成'}
                                    </button>
                                    <button
                                        onClick={resetFrost}
                                        className={`px-4 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                    >
                                        重置
                                    </button>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/20' : 'bg-blue-50 border border-blue-200'}`}>
                                <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                                    FROST vs MuSig2
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className={`font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>FROST</p>
                                        <ul className={`mt-1 space-y-1 ${isDarkMode ? 'text-blue-200' : 'text-blue-600'}`}>
                                            <li>• t-of-n 门限签名</li>
                                            <li>• 参与者可离线</li>
                                            <li>• 需要 DKG 预处理</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <p className={`font-medium ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'}`}>MuSig2</p>
                                        <ul className={`mt-1 space-y-1 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-600'}`}>
                                            <li>• n-of-n 多签</li>
                                            <li>• 所有参与者必须在线</li>
                                            <li>• 设置更简单</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Use Cases Tab */}
                    {activeTab === 'usecases' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                            <Building className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            机构资产托管
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        交易所和托管机构使用门限签名保护大额资产，分散风险。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 密钥分散在多个安全设施</li>
                                            <li>• 单点故障不会导致资金丢失</li>
                                            <li>• 审计友好的签名流程</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                                            <Wallet className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            隐私增强钱包
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        用户自托管方案，多设备备份且不暴露钱包类型。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 手机 + 硬件钱包 + 云备份</li>
                                            <li>• 链上看起来像普通单签</li>
                                            <li>• 丢失一个设备仍可恢复</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            闪电网络通道
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        优化闪电网络的链上足迹和隐私性。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 2-of-2 通道开启更高效</li>
                                            <li>• 关闭交易更小更便宜</li>
                                            <li>• 无法区分通道与普通交易</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            跨链桥接
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        去中心化跨链桥使用门限签名管理锁定资产。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 多个独立验证节点</li>
                                            <li>• 无单一信任点</li>
                                            <li>• 动态参与者轮换</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-indigo-900/30 border border-purple-500/20' : 'bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    门限签名的优势
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <Shield className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>安全性</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            私钥永不完整存在于任何地方
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <EyeOff className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-indigo-400' : 'text-indigo-500'}`} />
                                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>隐私性</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            链上与单签交易无法区分
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Zap className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-500'}`} />
                                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>效率</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            固定大小签名，更低手续费
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                            注意事项
                                        </h4>
                                        <ul className={`text-sm mt-1 space-y-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                                            <li>• 门限签名需要参与者之间的协调，可能增加操作复杂性</li>
                                            <li>• DKG（分布式密钥生成）阶段需要安全的通信通道</li>
                                            <li>• 需要防范恶意参与者的攻击，如提交无效份额</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Tab */}
                    {activeTab === 'quiz' && quizData && (
                        <Quiz quizData={quizData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ThresholdSigDemo;
