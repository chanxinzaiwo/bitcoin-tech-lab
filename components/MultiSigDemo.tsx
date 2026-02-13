import React, { useState, useMemo } from 'react';
import { Users, Key, Lock, Unlock, Shield, CheckCircle2, XCircle, ArrowRight, Info, Plus, Trash2, UserCheck, Building2, Briefcase, AlertTriangle, Clock, Settings, Eye } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { multiSigQuiz } from '../data/quizData';

// --- Types ---

interface Signer {
    id: string;
    name: string;
    publicKey: string;
    hasSigned: boolean;
    color: string;
}

interface MultiSigWallet {
    m: number; // required signatures
    n: number; // total signers
    signers: Signer[];
    address: string;
}

// --- Utility Functions ---

const generatePublicKey = (): string => {
    const chars = '0123456789abcdef';
    let result = '02'; // compressed public key prefix
    for (let i = 0; i < 64; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateMultiSigAddress = (m: number, n: number): string => {
    // P2SH address starts with '3'
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = '3';
    for (let i = 0; i < 33; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const signerColors = [
    { bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100', dark: 'bg-blue-900/50' },
    { bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100', dark: 'bg-purple-900/50' },
    { bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-100', dark: 'bg-green-900/50' },
    { bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-100', dark: 'bg-orange-900/50' },
    { bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-100', dark: 'bg-pink-900/50' },
    { bg: 'bg-cyan-500', text: 'text-cyan-500', light: 'bg-cyan-100', dark: 'bg-cyan-900/50' },
];

// --- Main Component ---

const MultiSigDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'builder', label: '创建钱包' },
        { id: 'signing', label: '签名流程' },
        { id: 'usecases', label: '应用场景' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-indigo-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 text-white p-1.5 rounded-full">
                                <Users className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>多签钱包</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MultiSig</span>
                        </div>
                        <div className="flex space-x-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-indigo-500/10 text-indigo-500'
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
                {activeTab === 'builder' && <WalletBuilder isDarkMode={isDarkMode} />}
                {activeTab === 'signing' && <SigningDemo isDarkMode={isDarkMode} />}
                {activeTab === 'usecases' && <UseCasesSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// --- Intro Section ---

const IntroSection: React.FC<{ isDarkMode: boolean; changeTab: (tab: string) => void }> = ({ isDarkMode, changeTab }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">多重签名：共识的力量</h1>
            <p className="text-indigo-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                多签钱包要求多个私钥共同签名才能花费比特币，消除了单点故障风险。
                无论是企业资金管理、家庭信托还是个人备份，多签都提供了更高的安全性。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">M-of-N</div>
                    <div className="text-sm text-indigo-200">灵活的签名门槛</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">2009</div>
                    <div className="text-sm text-indigo-200">比特币原生支持</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">P2SH</div>
                    <div className="text-sm text-indigo-200">标准地址格式</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('builder')}
                className="mt-8 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                创建多签钱包 <ArrowRight className="h-5 w-5" />
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card isDarkMode={isDarkMode} title="消除单点故障" icon={<Shield className="h-8 w-8 text-indigo-500" />}>
                即使一个私钥丢失或被盗，资金仍然安全。2-of-3 多签意味着你可以丢失任意一个密钥而不丢失资金。
            </Card>
            <Card isDarkMode={isDarkMode} title="共同管理" icon={<Users className="h-8 w-8 text-indigo-500" />}>
                公司财务、DAO 资金库、家庭信托都可以用多签实现多方共管，确保任何交易都需要多人同意。
            </Card>
            <Card isDarkMode={isDarkMode} title="灵活门槛" icon={<Settings className="h-8 w-8 text-indigo-500" />}>
                从 2-of-3 到 5-of-7，你可以根据需求设置任意 M-of-N 组合，平衡安全性与便利性。
            </Card>
        </div>

        {/* How It Works */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                多签钱包如何工作？
            </h2>
            <div className="space-y-4">
                {[
                    { step: '1', title: '收集公钥', desc: '所有参与者生成自己的密钥对，并共享公钥' },
                    { step: '2', title: '创建脚本', desc: '将所有公钥和门槛值 (M-of-N) 编码到赎回脚本中' },
                    { step: '3', title: '生成地址', desc: '对脚本哈希后生成 P2SH 地址（以 3 开头）' },
                    { step: '4', title: '花费资金', desc: '需要收集 M 个有效签名才能解锁并花费资金' }
                ].map((item) => (
                    <div key={item.step} className={`flex items-start gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {item.step}
                        </div>
                        <div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Common Configurations */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                常见多签配置
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                {[
                    { config: '2-of-3', name: '标准安全', desc: '最常见的配置，兼顾安全与便利', icon: UserCheck },
                    { config: '3-of-5', name: '企业级', desc: '适合公司财务，需要多人审批', icon: Building2 },
                    { config: '2-of-2', name: '双重控制', desc: '夫妻共管或业务伙伴共同签署', icon: Users }
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <div key={item.config} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <Icon className="w-6 h-6 text-indigo-500" />
                                <span className={`font-bold text-lg ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{item.config}</span>
                            </div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</h4>
                            <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    </div>
);

// --- Wallet Builder Section ---

const WalletBuilder: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [m, setM] = useState(2);
    const [n, setN] = useState(3);
    const [signers, setSigners] = useState<Signer[]>(() =>
        Array.from({ length: 3 }, (_, i) => ({
            id: `signer-${i}`,
            name: `签名者 ${i + 1}`,
            publicKey: generatePublicKey(),
            hasSigned: false,
            color: signerColors[i % signerColors.length].bg
        }))
    );
    const [walletCreated, setWalletCreated] = useState(false);

    const walletAddress = useMemo(() => generateMultiSigAddress(m, n), [m, n, signers.length]);

    const updateN = (newN: number) => {
        if (newN < 1 || newN > 6) return;
        setN(newN);
        if (m > newN) setM(newN);

        if (newN > signers.length) {
            const newSigners = [...signers];
            for (let i = signers.length; i < newN; i++) {
                newSigners.push({
                    id: `signer-${Date.now()}-${i}`,
                    name: `签名者 ${i + 1}`,
                    publicKey: generatePublicKey(),
                    hasSigned: false,
                    color: signerColors[i % signerColors.length].bg
                });
            }
            setSigners(newSigners);
        } else if (newN < signers.length) {
            setSigners(signers.slice(0, newN));
        }
        setWalletCreated(false);
    };

    const updateSignerName = (id: string, name: string) => {
        setSigners(signers.map(s => s.id === id ? { ...s, name } : s));
    };

    const regenerateKey = (id: string) => {
        setSigners(signers.map(s => s.id === id ? { ...s, publicKey: generatePublicKey() } : s));
        setWalletCreated(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Settings className="w-6 h-6 text-indigo-500" />
                    配置多签钱包
                </h2>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    设置签名门槛和参与者数量。M-of-N 表示需要 N 个签名者中的 M 个签名才能花费资金。
                </p>

                {/* M-of-N Selector */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            需要签名数 (M)
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => m > 1 && setM(m - 1)}
                                disabled={m <= 1}
                                className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                                    m <= 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                            >
                                -
                            </button>
                            <div className={`flex-1 text-center text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {m}
                            </div>
                            <button
                                onClick={() => m < n && setM(m + 1)}
                                disabled={m >= n}
                                className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                                    m >= n
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                            >
                                +
                            </button>
                        </div>
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                            总签名者数 (N)
                        </label>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => updateN(n - 1)}
                                disabled={n <= 1}
                                className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                                    n <= 1
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                            >
                                -
                            </button>
                            <div className={`flex-1 text-center text-2xl font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                {n}
                            </div>
                            <button
                                onClick={() => updateN(n + 1)}
                                disabled={n >= 6}
                                className={`w-10 h-10 rounded-lg font-bold transition-colors ${
                                    n >= 6
                                        ? 'opacity-50 cursor-not-allowed'
                                        : isDarkMode ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>

                {/* Visual M-of-N Display */}
                <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-indigo-900/30 border border-indigo-700' : 'bg-indigo-50 border border-indigo-200'}`}>
                    <span className={`text-3xl font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-600'}`}>
                        {m}-of-{n}
                    </span>
                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'}`}>
                        需要 {n} 个签名者中的 {m} 个签名才能花费资金
                    </p>
                </div>
            </div>

            {/* Signers List */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    签名者公钥
                </h3>
                <div className="space-y-3">
                    {signers.map((signer, index) => (
                        <div
                            key={signer.id}
                            className={`flex items-center gap-3 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                        >
                            <div className={`w-10 h-10 rounded-full ${signer.color} text-white flex items-center justify-center font-bold`}>
                                {index + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                                <input
                                    type="text"
                                    value={signer.name}
                                    onChange={(e) => updateSignerName(signer.id, e.target.value)}
                                    className={`w-full bg-transparent font-medium border-none focus:outline-none ${isDarkMode ? 'text-white' : 'text-slate-900'}`}
                                />
                                <div className={`text-xs font-mono truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {signer.publicKey}
                                </div>
                            </div>
                            <button
                                onClick={() => regenerateKey(signer.id)}
                                className={`p-2 rounded-lg transition-colors ${isDarkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
                                title="重新生成公钥"
                            >
                                <Key className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Create Wallet Button */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <button
                    onClick={() => setWalletCreated(true)}
                    className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-semibold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <Lock className="w-5 h-5" />
                    创建 {m}-of-{n} 多签钱包
                </button>

                {walletCreated && (
                    <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>钱包创建成功！</span>
                        </div>
                        <div className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                            <span className="font-medium">P2SH 地址:</span>
                            <code className={`block mt-1 p-2 rounded font-mono text-sm break-all ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                {walletAddress}
                            </code>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Signing Demo Section ---

const SigningDemo: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [signers, setSigners] = useState<Signer[]>([
        { id: '1', name: 'Alice (CEO)', publicKey: generatePublicKey(), hasSigned: false, color: signerColors[0].bg },
        { id: '2', name: 'Bob (CFO)', publicKey: generatePublicKey(), hasSigned: false, color: signerColors[1].bg },
        { id: '3', name: 'Carol (CTO)', publicKey: generatePublicKey(), hasSigned: false, color: signerColors[2].bg },
    ]);
    const [transactionStatus, setTransactionStatus] = useState<'pending' | 'ready' | 'broadcast'>('pending');

    const m = 2; // Required signatures
    const n = 3; // Total signers
    const signedCount = signers.filter(s => s.hasSigned).length;

    const toggleSign = (id: string) => {
        setSigners(signers.map(s =>
            s.id === id ? { ...s, hasSigned: !s.hasSigned } : s
        ));
    };

    const resetDemo = () => {
        setSigners(signers.map(s => ({ ...s, hasSigned: false })));
        setTransactionStatus('pending');
    };

    const broadcastTransaction = () => {
        if (signedCount >= m) {
            setTransactionStatus('broadcast');
        }
    };

    // Update status based on signatures
    React.useEffect(() => {
        if (signedCount >= m && transactionStatus === 'pending') {
            setTransactionStatus('ready');
        } else if (signedCount < m && transactionStatus === 'ready') {
            setTransactionStatus('pending');
        }
    }, [signedCount, m, transactionStatus]);

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Transaction Info */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Briefcase className="w-6 h-6 text-indigo-500" />
                    模拟交易签名
                </h2>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>交易类型</div>
                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>转账 2.5 BTC</div>
                        </div>
                        <div>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>接收地址</div>
                            <div className={`font-mono text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>bc1q...xyz</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Signature Progress */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-4">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        签名进度
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        transactionStatus === 'broadcast'
                            ? 'bg-green-600 text-white'
                            : transactionStatus === 'ready'
                                ? 'bg-indigo-600 text-white'
                                : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                    }`}>
                        {signedCount}/{m} 签名
                    </div>
                </div>

                {/* Progress Bar */}
                <div className={`h-3 rounded-full overflow-hidden mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    <div
                        className={`h-full transition-all duration-500 ${
                            signedCount >= m ? 'bg-green-500' : 'bg-indigo-500'
                        }`}
                        style={{ width: `${(signedCount / m) * 100}%` }}
                    />
                </div>

                {/* Signers */}
                <div className="space-y-3">
                    {signers.map((signer, index) => (
                        <div
                            key={signer.id}
                            className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                                signer.hasSigned
                                    ? isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                                    : isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                            }`}
                        >
                            <div className={`w-12 h-12 rounded-full ${signer.color} text-white flex items-center justify-center`}>
                                {signer.hasSigned ? (
                                    <CheckCircle2 className="w-6 h-6" />
                                ) : (
                                    <span className="font-bold">{index + 1}</span>
                                )}
                            </div>
                            <div className="flex-1">
                                <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {signer.name}
                                </div>
                                <div className={`text-sm ${signer.hasSigned ? 'text-green-500' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {signer.hasSigned ? '已签名' : '等待签名'}
                                </div>
                            </div>
                            <button
                                onClick={() => toggleSign(signer.id)}
                                disabled={transactionStatus === 'broadcast'}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                                    transactionStatus === 'broadcast'
                                        ? 'opacity-50 cursor-not-allowed bg-slate-600 text-white'
                                        : signer.hasSigned
                                            ? 'bg-red-500 text-white hover:bg-red-600'
                                            : 'bg-indigo-600 text-white hover:bg-indigo-700'
                                }`}
                            >
                                {signer.hasSigned ? '撤销签名' : '签名'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transaction Status */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                {transactionStatus === 'broadcast' ? (
                    <div className={`p-6 rounded-xl text-center ${isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                            交易已广播！
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                            使用 {signedCount} 个签名成功广播交易
                        </p>
                        <button
                            onClick={resetDemo}
                            className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                            重新演示
                        </button>
                    </div>
                ) : transactionStatus === 'ready' ? (
                    <div className="text-center">
                        <Unlock className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            签名门槛已达到！
                        </h3>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            已收集 {signedCount}/{m} 个必需签名，交易可以广播
                        </p>
                        <button
                            onClick={broadcastTransaction}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                        >
                            广播交易
                        </button>
                    </div>
                ) : (
                    <div className="text-center">
                        <Lock className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            等待更多签名
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            还需要 {m - signedCount} 个签名才能广播交易
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Use Cases Section ---

const UseCasesSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in">
        <div className="bg-gradient-to-br from-violet-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Eye className="w-8 h-8" /> 多签应用场景
            </h1>
            <p className="text-violet-50 text-lg leading-relaxed max-w-3xl">
                多签钱包不仅仅是技术特性，更是解决实际问题的工具。
                从个人安全备份到企业资金管理，多签都有广泛的应用。
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {[
                {
                    icon: UserCheck,
                    title: '个人安全备份',
                    config: '2-of-3',
                    color: 'blue',
                    description: '将三个密钥分别存放在家中、银行保险箱和朋友处。即使丢失一个，仍可恢复资金。',
                    pros: ['防止单点故障', '方便继承规划', '抵御物理威胁']
                },
                {
                    icon: Building2,
                    title: '企业资金管理',
                    config: '3-of-5',
                    color: 'purple',
                    description: 'CEO、CFO、CTO、董事会成员和外部审计各持一把密钥，重大支出需多人审批。',
                    pros: ['内部控制', '审计追踪', '防止内部欺诈']
                },
                {
                    icon: Users,
                    title: '家庭信托',
                    config: '2-of-3',
                    color: 'green',
                    description: '父母和成年子女共同管理家庭比特币资产，确保资产传承顺利。',
                    pros: ['代际传承', '共同决策', '紧急情况保障']
                },
                {
                    icon: Briefcase,
                    title: '托管服务',
                    config: '2-of-3',
                    color: 'orange',
                    description: '用户、托管方和第三方仲裁者各持一把密钥。日常由用户+托管方签名，争议时仲裁者介入。',
                    pros: ['用户保留控制权', '服务商无法独自转移资金', '有争议解决机制']
                }
            ].map((useCase) => {
                const Icon = useCase.icon;
                return (
                    <div
                        key={useCase.title}
                        className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl bg-${useCase.color}-500/10`}>
                                <Icon className={`w-6 h-6 text-${useCase.color}-500`} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{useCase.title}</h3>
                                <span className={`text-sm font-mono ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>{useCase.config}</span>
                            </div>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {useCase.description}
                        </p>
                        <div className="space-y-2">
                            {useCase.pros.map((pro, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
                                    <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{pro}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Timelock Integration */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Clock className="w-5 h-5 text-indigo-500" />
                与时间锁结合
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                多签可以与时间锁（Timelock）结合，实现更复杂的控制逻辑。
            </p>
            <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>降级多签</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        正常情况下需要 2-of-3 签名，但如果超过 6 个月未动，仅需 1 把密钥即可恢复（用于继承）。
                    </p>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>紧急撤销</h4>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        日常交易需要 2-of-3，但紧急情况下使用备份密钥可在 24 小时后单独花费。
                    </p>
                </div>
            </div>
        </div>

        {/* Security Considerations */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                    <div className={`font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>安全注意事项</div>
                    <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                        <li>• 确保每个密钥由不同的人或在不同地点保管</li>
                        <li>• 测试恢复流程，确保紧急情况下能够使用</li>
                        <li>• 记录签名者信息，但不要存放在同一位置</li>
                        <li>• 考虑使用不同厂商的硬件钱包来存储不同密钥</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- Quiz Section ---

const QuizSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="animate-in fade-in">
        <Quiz quizData={multiSigQuiz} />
    </div>
);

// --- Card Component ---

const Card: React.FC<{ isDarkMode: boolean; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ isDarkMode, title, icon, children }) => (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
    </div>
);

export default MultiSigDemo;
