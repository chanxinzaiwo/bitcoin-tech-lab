import React, { useState, useEffect } from 'react';
import { Link2, Lock, Unlock, Key, ArrowRight, CheckCircle, XCircle, AlertTriangle, Zap, RefreshCw, Eye, EyeOff, Shuffle, FileKey, Shield, ArrowLeftRight } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const AdaptorSigDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'mechanism', label: '工作机制' },
        { id: 'demo', label: '交互演示' },
        { id: 'atomic', label: '原子交换' },
        { id: 'usecases', label: '应用场景' },
        { id: 'quiz', label: '测验' }
    ];

    // Demo state
    const [demoStep, setDemoStep] = useState(0);
    const [secretValue, setSecretValue] = useState('');
    const [adaptorPoint, setAdaptorPoint] = useState('');
    const [preSig, setPreSig] = useState('');
    const [completeSig, setCompleteSig] = useState('');
    const [extractedSecret, setExtractedSecret] = useState('');

    // Atomic swap state
    const [swapStep, setSwapStep] = useState(0);
    const [aliceSecret, setAliceSecret] = useState('');
    const [aliceAdaptorPoint, setAliceAdaptorPoint] = useState('');
    const [bobPreSig, setBobPreSig] = useState('');
    const [alicePreSig, setAlicePreSig] = useState('');
    const [aliceCompleteSig, setAliceCompleteSig] = useState('');
    const [bobExtractedSecret, setBobExtractedSecret] = useState('');
    const [bobCompleteSig, setBobCompleteSig] = useState('');

    // Generate random hex string
    const randomHex = (length: number) => {
        return Array.from({ length }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    };

    // Demo flow
    const runDemoStep = () => {
        if (demoStep === 0) {
            // Generate secret and adaptor point
            const secret = randomHex(8);
            setSecretValue(secret);
            setAdaptorPoint(`T = ${randomHex(16)}`);
            setDemoStep(1);
        } else if (demoStep === 1) {
            // Generate pre-signature (adaptor signature)
            setPreSig(`s' = ${randomHex(16)}`);
            setDemoStep(2);
        } else if (demoStep === 2) {
            // Complete signature with secret
            setCompleteSig(`s = ${randomHex(16)}`);
            setDemoStep(3);
        } else if (demoStep === 3) {
            // Extract secret from signatures
            setExtractedSecret(secretValue);
            setDemoStep(4);
        }
    };

    const resetDemo = () => {
        setDemoStep(0);
        setSecretValue('');
        setAdaptorPoint('');
        setPreSig('');
        setCompleteSig('');
        setExtractedSecret('');
    };

    // Atomic swap flow
    const runSwapStep = () => {
        if (swapStep === 0) {
            // Alice generates secret and adaptor point
            const secret = randomHex(8);
            setAliceSecret(secret);
            setAliceAdaptorPoint(`T = ${randomHex(16)}`);
            setSwapStep(1);
        } else if (swapStep === 1) {
            // Bob creates adaptor signature for his transaction
            setBobPreSig(`s'_bob = ${randomHex(16)}`);
            setSwapStep(2);
        } else if (swapStep === 2) {
            // Alice creates adaptor signature for her transaction
            setAlicePreSig(`s'_alice = ${randomHex(16)}`);
            setSwapStep(3);
        } else if (swapStep === 3) {
            // Alice completes her signature (revealing secret on-chain)
            setAliceCompleteSig(`s_alice = ${randomHex(16)}`);
            setSwapStep(4);
        } else if (swapStep === 4) {
            // Bob extracts secret and completes his signature
            setBobExtractedSecret(aliceSecret);
            setBobCompleteSig(`s_bob = ${randomHex(16)}`);
            setSwapStep(5);
        }
    };

    const resetSwap = () => {
        setSwapStep(0);
        setAliceSecret('');
        setAliceAdaptorPoint('');
        setBobPreSig('');
        setAlicePreSig('');
        setAliceCompleteSig('');
        setBobExtractedSecret('');
        setBobCompleteSig('');
    };

    const quizData = getQuizByModule('adaptor');

    return (
        <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 mb-4">
                        <Link2 className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        适配器签名
                    </h1>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Adaptor Signatures - 条件签名与无信任原子交换
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
                                    ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
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
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'}`}>
                                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                                    什么是适配器签名？
                                </h3>
                                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                                    适配器签名（Adaptor Signature）是一种密码学构造，允许创建一个"不完整"的签名，
                                    只有知道某个秘密值才能将其转换为有效签名。当这个有效签名被公开后，
                                    任何人都可以从中提取出那个秘密值。这种特性使得无信任的原子交换成为可能。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Key className="w-5 h-5 text-rose-500" />
                                        核心概念
                                    </h4>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>秘密值 (Secret)</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                一个私有标量值 t，用于"锁定"签名
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>适配点 (Adaptor Point)</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                T = t·G，秘密值对应的公开椭圆曲线点
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>预签名 (Pre-signature)</p>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                s' = s - t，不完整的签名值
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Shield className="w-5 h-5 text-pink-500" />
                                        关键特性
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            { title: '条件性', desc: '签名的有效性取决于秘密的揭示' },
                                            { title: '可提取', desc: '从完整签名可以提取出秘密值' },
                                            { title: '原子性', desc: '签名发布和秘密揭示同时发生' },
                                            { title: '无信任', desc: '不需要可信第三方参与' },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    适配器签名 vs HTLC
                                </h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                                            适配器签名
                                        </h5>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 链上看起来像普通交易</li>
                                            <li>• 更小的交易体积</li>
                                            <li>• 更好的隐私性</li>
                                            <li>• 需要 Schnorr 签名支持</li>
                                        </ul>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <h5 className={`font-medium mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            HTLC (哈希时间锁)
                                        </h5>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 需要特殊脚本</li>
                                            <li>• 交易体积更大</li>
                                            <li>• 可识别为原子交换</li>
                                            <li>• 兼容现有比特币</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-pink-500/10 border border-pink-500/20' : 'bg-pink-50 border border-pink-200'}`}>
                                <p className={`text-sm ${isDarkMode ? 'text-pink-300' : 'text-pink-700'}`}>
                                    <strong>比特币应用：</strong>Taproot 升级引入的 Schnorr 签名使适配器签名在比特币上变得实用。
                                    它可以用于实现更隐私的闪电网络支付、跨链原子交换，以及各种条件支付场景。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Mechanism Tab */}
                    {activeTab === 'mechanism' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                                    Schnorr 适配器签名数学原理
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-rose-200' : 'text-rose-600'}`}>
                                    基于 Schnorr 签名的线性特性，适配器签名可以将签名与一个秘密值绑定。
                                </p>
                            </div>

                            <div className="space-y-4">
                                {/* Step 1 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">1</div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            生成秘密和适配点
                                        </h4>
                                    </div>
                                    <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700'}`}>
                                        <p>t ← 随机标量（秘密值）</p>
                                        <p>T = t · G （适配点，公开）</p>
                                    </div>
                                    <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Alice 生成一个秘密值 t，并计算对应的椭圆曲线点 T。T 是公开的，但 t 保密。
                                    </p>
                                </div>

                                {/* Step 2 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">2</div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            创建预签名（Adaptor Signature）
                                        </h4>
                                    </div>
                                    <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700'}`}>
                                        <p>k ← 随机 nonce</p>
                                        <p>R' = k · G + T （调整后的 nonce 点）</p>
                                        <p>e = H(R' || P || m) （挑战值）</p>
                                        <p>s' = k + e · x （预签名）</p>
                                    </div>
                                    <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Bob 创建一个"不完整"的签名 (R', s')，它本身无效，但可以验证其正确构造。
                                    </p>
                                </div>

                                {/* Step 3 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">3</div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            完成签名
                                        </h4>
                                    </div>
                                    <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700'}`}>
                                        <p>s = s' + t （添加秘密值）</p>
                                        <p>R = R' - T = k · G （真正的 nonce 点）</p>
                                        <p>签名 (R, s) 现在是有效的</p>
                                    </div>
                                    <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        知道秘密 t 的人可以将预签名转换为有效签名。
                                    </p>
                                </div>

                                {/* Step 4 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">4</div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            提取秘密
                                        </h4>
                                    </div>
                                    <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700'}`}>
                                        <p>t = s - s' （从两个签名差值提取秘密）</p>
                                    </div>
                                    <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        任何知道预签名 s' 并看到完整签名 s 的人都可以计算出秘密值 t。
                                        这就是原子交换的关键：签名发布自动揭示秘密！
                                    </p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                            安全性说明
                                        </h4>
                                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                                            预签名的验证很重要：接收方必须验证预签名确实是用正确的适配点 T 创建的，
                                            否则可能收到一个无法用已知秘密完成的无效预签名。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Demo Tab */}
                    {activeTab === 'demo' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-rose-400' : 'text-rose-700'}`}>
                                    适配器签名流程演示
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-rose-200' : 'text-rose-600'}`}>
                                    观察秘密值如何"锁定"签名，以及如何通过完整签名提取秘密。
                                </p>
                            </div>

                            {/* Progress indicator */}
                            <div className="flex items-center justify-between mb-6">
                                {['生成秘密', '创建预签名', '完成签名', '提取秘密'].map((step, i) => (
                                    <div key={i} className="flex flex-col items-center flex-1">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                                            i < demoStep
                                                ? 'bg-green-500 text-white'
                                                : i === demoStep
                                                    ? 'bg-rose-500 text-white'
                                                    : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                                        }`}>
                                            {i < demoStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                                        </div>
                                        <span className={`text-xs text-center ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {step}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Demo content */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Left panel - Current step */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        当前步骤
                                    </h4>
                                    <div className={`p-4 rounded-lg min-h-[150px] ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        {demoStep === 0 && (
                                            <div className="text-center py-6">
                                                <Key className={`w-12 h-12 mx-auto mb-3 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                                                <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                                    点击"下一步"生成秘密值和适配点
                                                </p>
                                            </div>
                                        )}
                                        {demoStep === 1 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Lock className="w-5 h-5 text-rose-500" />
                                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                        秘密值已生成
                                                    </span>
                                                </div>
                                                <div className={`p-2 rounded font-mono text-sm mb-2 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                    t = {secretValue}
                                                </div>
                                                <div className={`p-2 rounded font-mono text-sm ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                    {adaptorPoint}
                                                </div>
                                                <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    T 是公开的，t 保持秘密
                                                </p>
                                            </div>
                                        )}
                                        {demoStep === 2 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <FileKey className="w-5 h-5 text-amber-500" />
                                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                        预签名已创建
                                                    </span>
                                                </div>
                                                <div className={`p-2 rounded font-mono text-sm ${isDarkMode ? 'bg-slate-600' : 'bg-slate-100'}`}>
                                                    {preSig}
                                                </div>
                                                <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    预签名本身无效，但可以验证其正确构造
                                                </p>
                                            </div>
                                        )}
                                        {demoStep === 3 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CheckCircle className="w-5 h-5 text-green-500" />
                                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                        签名已完成
                                                    </span>
                                                </div>
                                                <div className={`p-2 rounded font-mono text-sm ${isDarkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                                                    {completeSig}
                                                </div>
                                                <p className={`mt-3 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    使用秘密 t 完成签名，现在是有效的 Schnorr 签名
                                                </p>
                                            </div>
                                        )}
                                        {demoStep === 4 && (
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Eye className="w-5 h-5 text-purple-500" />
                                                    <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                        秘密已提取
                                                    </span>
                                                </div>
                                                <div className={`p-2 rounded font-mono text-sm ${isDarkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                                                    t = s - s' = {extractedSecret}
                                                </div>
                                                <p className={`mt-3 text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                                    成功从签名差值中提取出秘密！
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Right panel - State */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        当前状态
                                    </h4>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>秘密 (t)</span>
                                            <span className={`font-mono text-sm ${secretValue ? (isDarkMode ? 'text-rose-400' : 'text-rose-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                                {secretValue || '未生成'}
                                            </span>
                                        </div>
                                        <div className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>适配点 (T)</span>
                                            <span className={`font-mono text-xs ${adaptorPoint ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                                {adaptorPoint || '未生成'}
                                            </span>
                                        </div>
                                        <div className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>预签名 (s')</span>
                                            <span className={`font-mono text-xs ${preSig ? (isDarkMode ? 'text-amber-400' : 'text-amber-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                                {preSig || '未创建'}
                                            </span>
                                        </div>
                                        <div className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>完整签名 (s)</span>
                                            <span className={`font-mono text-xs ${completeSig ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-slate-500' : 'text-slate-400')}`}>
                                                {completeSig || '未完成'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="flex gap-3">
                                <button
                                    onClick={runDemoStep}
                                    disabled={demoStep >= 4}
                                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                        demoStep < 4
                                            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg'
                                            : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                                    }`}
                                >
                                    {demoStep === 0 ? '开始' : demoStep < 4 ? '下一步' : '完成'}
                                </button>
                                <button
                                    onClick={resetDemo}
                                    className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    重置
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Atomic Swap Tab */}
                    {activeTab === 'atomic' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-pink-500/10 border border-pink-500/20' : 'bg-pink-50 border border-pink-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-700'}`}>
                                    无脚本原子交换 (Scriptless Atomic Swap)
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-pink-200' : 'text-pink-600'}`}>
                                    使用适配器签名，Alice 和 Bob 可以在不需要 HTLC 脚本的情况下安全地交换资产。
                                </p>
                            </div>

                            {/* Swap visualization */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="grid md:grid-cols-3 gap-4 mb-6">
                                    {/* Alice */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-rose-900/20 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'}`}>
                                        <h5 className={`font-bold text-center mb-2 ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>
                                            Alice (BTC)
                                        </h5>
                                        <div className={`text-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            想用 1 BTC 换 LTC
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex items-center justify-center">
                                        <ArrowLeftRight className={`w-8 h-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                    </div>

                                    {/* Bob */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                        <h5 className={`font-bold text-center mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                                            Bob (LTC)
                                        </h5>
                                        <div className={`text-center text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            想用 LTC 换 1 BTC
                                        </div>
                                    </div>
                                </div>

                                {/* Steps */}
                                <div className="space-y-3">
                                    {[
                                        { step: 1, title: 'Alice 生成秘密', desc: '创建秘密 t 和适配点 T', actor: 'alice', done: swapStep >= 1 },
                                        { step: 2, title: 'Bob 创建预签名', desc: 'Bob 用 T 创建 LTC 交易的预签名', actor: 'bob', done: swapStep >= 2 },
                                        { step: 3, title: 'Alice 创建预签名', desc: 'Alice 用 T 创建 BTC 交易的预签名', actor: 'alice', done: swapStep >= 3 },
                                        { step: 4, title: 'Alice 发布 BTC 交易', desc: 'Alice 用 t 完成签名，揭示秘密', actor: 'alice', done: swapStep >= 4 },
                                        { step: 5, title: 'Bob 提取秘密', desc: 'Bob 从链上提取 t，完成 LTC 交易', actor: 'bob', done: swapStep >= 5 },
                                    ].map((item) => (
                                        <div key={item.step} className={`p-3 rounded-lg flex items-center gap-4 transition-all ${
                                            item.done
                                                ? isDarkMode ? 'bg-green-900/20 border border-green-500/30' : 'bg-green-50 border border-green-200'
                                                : swapStep === item.step - 1
                                                    ? isDarkMode ? 'bg-rose-900/20 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'
                                                    : isDarkMode ? 'bg-slate-700' : 'bg-white'
                                        }`}>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                item.done
                                                    ? 'bg-green-500 text-white'
                                                    : swapStep === item.step - 1
                                                        ? 'bg-rose-500 text-white'
                                                        : isDarkMode ? 'bg-slate-600 text-slate-400' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                                {item.done ? <CheckCircle className="w-4 h-4" /> : item.step}
                                            </div>
                                            <div className="flex-1">
                                                <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                                    {item.title}
                                                </p>
                                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {item.desc}
                                                </p>
                                            </div>
                                            <div className={`px-2 py-1 rounded text-xs font-medium ${
                                                item.actor === 'alice'
                                                    ? isDarkMode ? 'bg-rose-500/20 text-rose-400' : 'bg-rose-100 text-rose-600'
                                                    : isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                                {item.actor === 'alice' ? 'Alice' : 'Bob'}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Current state */}
                            {swapStep > 0 && (
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        当前数据
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-4">
                                        {aliceSecret && (
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Alice 的秘密:</span>
                                                <p className={`font-mono text-sm ${isDarkMode ? 'text-rose-400' : 'text-rose-600'}`}>{aliceSecret}</p>
                                            </div>
                                        )}
                                        {aliceAdaptorPoint && (
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>适配点:</span>
                                                <p className={`font-mono text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>{aliceAdaptorPoint}</p>
                                            </div>
                                        )}
                                        {bobPreSig && (
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bob 的预签名:</span>
                                                <p className={`font-mono text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{bobPreSig}</p>
                                            </div>
                                        )}
                                        {alicePreSig && (
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Alice 的预签名:</span>
                                                <p className={`font-mono text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{alicePreSig}</p>
                                            </div>
                                        )}
                                        {aliceCompleteSig && (
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'}`}>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Alice 的完整签名:</span>
                                                <p className={`font-mono text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{aliceCompleteSig}</p>
                                            </div>
                                        )}
                                        {bobExtractedSecret && (
                                            <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900/20' : 'bg-purple-50'}`}>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Bob 提取的秘密:</span>
                                                <p className={`font-mono text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{bobExtractedSecret}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {swapStep >= 5 && (
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                        <div>
                                            <h4 className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                原子交换完成！
                                            </h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                                                Alice 获得了 LTC，Bob 获得了 BTC。交换是原子的——要么双方都成功，要么都不成功。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Controls */}
                            <div className="flex gap-3">
                                <button
                                    onClick={runSwapStep}
                                    disabled={swapStep >= 5}
                                    className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                                        swapStep < 5
                                            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:shadow-lg'
                                            : isDarkMode ? 'bg-slate-700 text-slate-500' : 'bg-slate-200 text-slate-400'
                                    }`}
                                >
                                    {swapStep === 0 ? '开始交换' : swapStep < 5 ? '下一步' : '完成'}
                                </button>
                                <button
                                    onClick={resetSwap}
                                    className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    重置
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Use Cases Tab */}
                    {activeTab === 'usecases' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
                                            <Shuffle className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            跨链原子交换
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        无需中心化交易所，直接在不同区块链之间交换资产。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• BTC ↔ LTC 直接交换</li>
                                            <li>• 无需信任第三方</li>
                                            <li>• 比 HTLC 更隐私</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                            <Zap className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            闪电网络 PTLCs
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        用 Point Time Locked Contracts 替代 HTLC，增强隐私。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 每跳使用不同的适配点</li>
                                            <li>• 路径隐私更好</li>
                                            <li>• 防止关联支付</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                                            <EyeOff className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            隐私支付证明
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        支付完成自动揭示秘密，作为支付证明。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 不需要发票/收据</li>
                                            <li>• 加密的支付凭证</li>
                                            <li>• 链上无法识别</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                                            <RefreshCw className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            DLC (离散日志合约)
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        与预言机结合，实现链上金融合约。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 赌注/期权合约</li>
                                            <li>• 预言机发布适配点</li>
                                            <li>• 结果自动结算</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-rose-900/30 to-pink-900/30 border border-rose-500/20' : 'bg-gradient-to-r from-rose-50 to-pink-50 border border-rose-200'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    适配器签名的优势
                                </h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <EyeOff className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-rose-400' : 'text-rose-500'}`} />
                                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>隐私性</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            链上看起来像普通交易
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Zap className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-pink-400' : 'text-pink-500'}`} />
                                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>效率</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            更小的交易体积
                                        </p>
                                    </div>
                                    <div className="text-center">
                                        <Shield className={`w-8 h-8 mx-auto mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-500'}`} />
                                        <p className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>无信任</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            无需可信第三方
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                            当前限制
                                        </h4>
                                        <ul className={`text-sm mt-1 space-y-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                                            <li>• 需要 Schnorr 签名支持（Taproot 已提供）</li>
                                            <li>• 交互复杂度高于 HTLC</li>
                                            <li>• 生态系统支持仍在发展中</li>
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

export default AdaptorSigDemo;
