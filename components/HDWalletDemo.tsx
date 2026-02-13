import React, { useState, useEffect } from 'react';
import { TreeDeciduous, RefreshCw, ArrowRight, ArrowDown, Database, Network, ShieldCheck, BookOpen, Shield, AlertTriangle, Lock, Key, Copy, Check, FileText, Layers, Zap, Globe, Eye, EyeOff, Clock, Award } from 'lucide-react';
import { computeSHA256 } from '../utils/crypto-math';
import { useLab } from '../store/LabContext';
import { wordlist } from '../utils/hd-logic';
import { useToast } from './Toast';
import Quiz from './Quiz';
import { hdWalletQuiz } from '../data/quizData';

const HDWalletDemo = () => {
    const { isDarkMode, setIdentity } = useLab();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('demo');
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [seed, setSeed] = useState("");
    const [masterKey, setMasterKey] = useState("");
    const [derivedAccounts, setDerivedAccounts] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [pathType, setPathType] = useState('bip44'); // bip44 (legacy), bip84 (segwit)

    const tabs = [
        { id: 'demo', label: '生成演示' },
        { id: 'bips', label: 'BIP 标准' },
        { id: 'backup', label: '备份与恢复' },
        { id: 'quiz', label: '测验' },
    ];

    // Generate new wallet
    const generate = async () => {
        setIsGenerating(true);
        // 1. Generate Entropy (Random words)
        const newWords = [];
        for(let i=0; i<12; i++) {
            newWords.push(wordlist[Math.floor(Math.random() * wordlist.length)]);
        }
        setMnemonic(newWords);

        // 2. Generate Seed (Simplified PBKDF2 sim)
        const mnemonicStr = newWords.join(" ");
        const seedHash = await computeSHA256(mnemonicStr + "mnemonic" + "optional_passphrase");
        // Simulate 512-bit seed by doubling hash
        const fullSeed = seedHash.hex + seedHash.hex.split('').reverse().join(''); 
        setSeed(fullSeed);

        // 3. Master Key (Simulated HMAC-SHA512)
        const master = await computeSHA256(fullSeed + "Bitcoin seed");
        setMasterKey("xprv" + master.hex.substring(0, 32) + "..."); // Fake xprv format

        // 4. Derive Children
        const children = [];
        for(let i=0; i<3; i++) {
            const path = pathType === 'bip44' ? `m/44'/0'/0'/0/${i}` : `m/84'/0'/0'/0/${i}`;
            const childHash = await computeSHA256(master.hex + i);
            const addrPrefix = pathType === 'bip44' ? '1' : 'bc1q';
            const addrBody = childHash.hex.substring(0, pathType === 'bip44' ? 32 : 38);
            children.push({
                index: i,
                path: path,
                priv: "L" + childHash.hex.substring(0, 30) + "...",
                pub: "03" + childHash.hex.substring(0, 30) + "...",
                addr: addrPrefix + addrBody + "..."
            });
        }
        setDerivedAccounts(children);
        setIsGenerating(false);
    };

    useEffect(() => {
        generate();
    }, [pathType]);

    const saveAccount = (acc: any) => {
        setIdentity({
            privateKey: acc.priv,
            publicKey: acc.pub,
            address: acc.addr,
            label: `HD Account #${acc.index} (${pathType})`
        });
        toast.success('账户已保存', `Account #${acc.index} 已添加到全局钱包`);
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Header */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                                <TreeDeciduous className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>HD 钱包</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>HD Wallet</span>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Mobile Menu */}
                <div className={`md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} scrollbar-hide`}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-block mr-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                    : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 active:bg-slate-700' : 'bg-white text-slate-600 border-slate-300 active:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
                {activeTab === 'demo' && <DemoSection
                    isDarkMode={isDarkMode}
                    mnemonic={mnemonic}
                    seed={seed}
                    masterKey={masterKey}
                    derivedAccounts={derivedAccounts}
                    isGenerating={isGenerating}
                    pathType={pathType}
                    setPathType={setPathType}
                    generate={generate}
                    saveAccount={saveAccount}
                />}
                {activeTab === 'bips' && <BIPStandardsSection isDarkMode={isDarkMode} />}
                {activeTab === 'backup' && <BackupRecoverySection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// Demo Section (Original content extracted)
interface DemoSectionProps {
    isDarkMode: boolean;
    mnemonic: string[];
    seed: string;
    masterKey: string;
    derivedAccounts: any[];
    isGenerating: boolean;
    pathType: string;
    setPathType: (type: string) => void;
    generate: () => void;
    saveAccount: (acc: any) => void;
}

const DemoSection = ({ isDarkMode, mnemonic, seed, masterKey, derivedAccounts, isGenerating, pathType, setPathType, generate, saveAccount }: DemoSectionProps) => (
    <>
        {/* Intro Section */}
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Database className="w-8 h-8" /> 一颗种子，无限森林
            </h2>
            <p className="text-emerald-100 text-lg leading-relaxed max-w-3xl">
                你不需要备份成百上千个私钥。分层确定性钱包 (HD Wallet) 允许你通过<strong>12个助记词</strong>（种子），
                按树状结构推导出无限个子私钥和地址。
            </p>
        </div>

                {/* 1. Mnemonic Generation */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-100 text-emerald-700 p-2 rounded-lg font-bold">Step 1</div>
                            <h3 className="text-lg font-bold">生成助记词 (BIP-39)</h3>
                        </div>
                        <button 
                            onClick={generate}
                            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-lg active:scale-95"
                        >
                            <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin' : ''}`} />
                            重新生成
                        </button>
                    </div>

                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-4">
                        {mnemonic.map((word, idx) => (
                            <div key={idx} className={`relative p-3 rounded-lg border flex items-center gap-3 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                <span className="absolute -top-2 -left-2 w-5 h-5 bg-slate-200 text-slate-600 rounded-full flex items-center justify-center text-[10px] font-bold border border-white shadow-sm">
                                    {idx + 1}
                                </span>
                                <span className={`font-mono font-bold text-center w-full ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    {word}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-slate-500">
                        * 这些词是从 2048 个标准单词表中随机选取的。它们代表了 128 位的随机熵。
                    </p>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                    <ArrowDown className="w-8 h-8 text-slate-300 animate-bounce" />
                </div>

                {/* 2. Seed & Master Key */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center gap-2 mb-6">
                        <div className="bg-blue-100 text-blue-700 p-2 rounded-lg font-bold">Step 2</div>
                        <h3 className="text-lg font-bold">计算种子 & 主私钥 (Root)</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Seed (512-bit)</label>
                            <div className={`font-mono text-xs break-all p-3 rounded border mt-1 ${isDarkMode ? 'bg-black border-slate-700 text-blue-400' : 'bg-slate-100 border-slate-300 text-blue-700'}`}>
                                {seed}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-1">PBKDF2(Mnemonic + Salt) 2048 rounds</div>
                        </div>
                        <div className="flex justify-center">
                            <ArrowDown className="w-4 h-4 text-slate-300" />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-slate-500">Master Extended Private Key (xprv)</label>
                            <div className={`font-mono text-xs break-all p-3 rounded border mt-1 ${isDarkMode ? 'bg-black border-slate-700 text-purple-400' : 'bg-slate-100 border-slate-300 text-purple-700'}`}>
                                {masterKey}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Arrow Connector */}
                <div className="flex justify-center">
                    <ArrowDown className="w-8 h-8 text-slate-300 animate-bounce" />
                </div>

                {/* 3. Derivation Tree */}
                <div className={`p-6 rounded-2xl border shadow-lg ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-6">
                        <div className="flex items-center gap-2">
                            <div className="bg-purple-100 text-purple-700 p-2 rounded-lg font-bold">Step 3</div>
                            <h3 className="text-lg font-bold">路径派生 (Derivation)</h3>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                            <button 
                                onClick={() => setPathType('bip44')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${pathType === 'bip44' ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-500'}`}
                            >
                                BIP44 (Legacy)
                            </button>
                            <button 
                                onClick={() => setPathType('bip84')}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${pathType === 'bip84' ? 'bg-white dark:bg-slate-700 shadow text-purple-600' : 'text-slate-500'}`}
                            >
                                BIP84 (SegWit)
                            </button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {derivedAccounts.map((acc) => (
                            <div key={acc.index} className={`flex flex-col md:flex-row items-center gap-4 p-4 rounded-xl border transition-all hover:scale-[1.01] ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-purple-500' : 'bg-slate-50 border-slate-200 hover:border-purple-300'}`}>
                                <div className="flex flex-col items-center min-w-[80px]">
                                    <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                                        #{acc.index}
                                    </div>
                                </div>
                                <div className="flex-1 space-y-1 w-full overflow-hidden">
                                    <div className="flex items-center gap-2">
                                        <Network className="w-3 h-3 text-slate-400" />
                                        <span className="text-xs font-mono text-slate-500">{acc.path}</span>
                                    </div>
                                    <div className={`font-mono font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                        {acc.addr}
                                    </div>
                                    <div className="text-xs text-slate-500 truncate">Priv: {acc.priv}</div>
                                </div>
                                <button 
                                    onClick={() => saveAccount(acc)}
                                    className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-emerald-500 hover:text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors whitespace-nowrap"
                                >
                                    <ShieldCheck className="w-4 h-4" /> 使用此地址
                                </button>
                            </div>
                        ))}
                    </div>
                    
                    <div className={`mt-4 p-4 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} rounded-xl text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <p><strong>路径说明 (m / 44' / 0' / 0' / 0 / 0):</strong></p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-xs">
                            <li><strong>44':</strong> 提案编号 (BIP44)</li>
                            <li><strong>0':</strong> 币种 (Bitcoin)</li>
                            <li><strong>0':</strong> 账户索引 (Account 0)</li>
                            <li><strong>0:</strong> 链类型 (0=外部接收, 1=内部找零)</li>
                            <li><strong>0:</strong> 地址索引 (第几个地址)</li>
                        </ul>
                    </div>
                </div>
    </>
);

// BIP Standards Section
const BIPStandardsSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const bips = [
        {
            number: 'BIP-32',
            title: '分层确定性钱包',
            year: 2012,
            description: '定义了从单个种子派生无限个密钥对的数学方法。使用扩展密钥(xprv/xpub)实现树状派生结构。',
            features: ['主密钥派生', '扩展密钥格式', '硬化派生 vs 普通派生', '无限子密钥'],
            color: 'blue'
        },
        {
            number: 'BIP-39',
            title: '助记词标准',
            year: 2013,
            description: '将随机熵编码为人类可读的单词序列。标准词库包含2048个精心挑选的英文单词。',
            features: ['12/15/18/21/24个单词', '2048词库', 'PBKDF2密钥派生', '可选密码短语'],
            color: 'emerald'
        },
        {
            number: 'BIP-44',
            title: '多币种路径标准',
            year: 2014,
            description: '规范化的派生路径格式，支持多币种、多账户、找零地址等场景。',
            features: ['m/44\'/coin\'/account\'/change/index', '多币种支持', '账户隔离', 'Legacy地址'],
            color: 'purple'
        },
        {
            number: 'BIP-49',
            title: 'P2SH-P2WPKH路径',
            year: 2016,
            description: '为兼容性SegWit地址(3开头)定义专用派生路径，使用m/49\'作为purpose。',
            features: ['m/49\'/coin\'/...', '3...地址格式', '向后兼容SegWit', '过渡方案'],
            color: 'amber'
        },
        {
            number: 'BIP-84',
            title: 'Native SegWit路径',
            year: 2017,
            description: '为原生SegWit地址(bc1q开头)定义派生路径，使用m/84\'作为purpose。',
            features: ['m/84\'/coin\'/...', 'bc1q...地址', '最低手续费', '推荐使用'],
            color: 'cyan'
        },
        {
            number: 'BIP-86',
            title: 'Taproot路径',
            year: 2021,
            description: '为Taproot地址(bc1p开头)定义派生路径，使用m/86\'作为purpose。',
            features: ['m/86\'/coin\'/...', 'bc1p...地址', 'Schnorr签名', '最高隐私'],
            color: 'pink'
        }
    ];

    const pathExamples = [
        { path: "m/44'/0'/0'/0/0", desc: '第一个Legacy接收地址', addr: '1...' },
        { path: "m/44'/0'/0'/1/0", desc: '第一个Legacy找零地址', addr: '1...' },
        { path: "m/49'/0'/0'/0/0", desc: '第一个Nested SegWit地址', addr: '3...' },
        { path: "m/84'/0'/0'/0/0", desc: '第一个Native SegWit地址', addr: 'bc1q...' },
        { path: "m/86'/0'/0'/0/0", desc: '第一个Taproot地址', addr: 'bc1p...' },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    BIP 标准详解
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    HD钱包涉及的关键Bitcoin改进提案
                </p>
            </div>

            {/* BIP Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bips.map((bip, index) => (
                    <div key={index} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border overflow-hidden`}>
                        <div className={`p-4 ${
                            bip.color === 'blue' ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50' :
                            bip.color === 'emerald' ? isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50' :
                            bip.color === 'purple' ? isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50' :
                            bip.color === 'amber' ? isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50' :
                            bip.color === 'cyan' ? isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-50' :
                            isDarkMode ? 'bg-pink-500/20' : 'bg-pink-50'
                        }`}>
                            <div className="flex items-center justify-between">
                                <span className={`text-lg font-bold ${
                                    bip.color === 'blue' ? 'text-blue-500' :
                                    bip.color === 'emerald' ? 'text-emerald-500' :
                                    bip.color === 'purple' ? 'text-purple-500' :
                                    bip.color === 'amber' ? 'text-amber-500' :
                                    bip.color === 'cyan' ? 'text-cyan-500' :
                                    'text-pink-500'
                                }`}>{bip.number}</span>
                                <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{bip.year}</span>
                            </div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mt-1`}>{bip.title}</h4>
                        </div>
                        <div className="p-4">
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-3`}>{bip.description}</p>
                            <div className="flex flex-wrap gap-1">
                                {bip.features.map((feature, i) => (
                                    <span key={i} className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                        {feature}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Path Examples */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Layers className="w-5 h-5 text-emerald-500" />
                    派生路径示例
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                <th className="text-left py-2 px-3">路径</th>
                                <th className="text-left py-2 px-3">说明</th>
                                <th className="text-left py-2 px-3">地址格式</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pathExamples.map((item, index) => (
                                <tr key={index} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <td className={`py-2 px-3 font-mono text-xs ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>{item.path}</td>
                                    <td className={`py-2 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.desc}</td>
                                    <td className={`py-2 px-3 font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{item.addr}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Derivation Tree Visualization */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <TreeDeciduous className="w-5 h-5 text-emerald-500" />
                    派生树结构
                </h3>
                <div className={`font-mono text-xs ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'} p-4 rounded-lg overflow-x-auto`}>
                    <pre className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
{`Master (m)
├── 44' (BIP44 Legacy)
│   └── 0' (Bitcoin)
│       └── 0' (Account 0)
│           ├── 0 (External) ── 0, 1, 2, ... (Addresses)
│           └── 1 (Internal) ── 0, 1, 2, ... (Change)
├── 49' (BIP49 Nested SegWit)
│   └── 0' (Bitcoin)
│       └── ...
├── 84' (BIP84 Native SegWit)
│   └── 0' (Bitcoin)
│       └── ...
└── 86' (BIP86 Taproot)
    └── 0' (Bitcoin)
        └── ...`}
                    </pre>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-3`}>
                    <strong>注：</strong> 带有 ' (撇号) 的层级使用硬化派生，只能通过主私钥推导。没有撇号的层级可以通过xpub推导。
                </p>
            </div>
        </div>
    );
};

// Backup & Recovery Section
const BackupRecoverySection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [showMnemonic, setShowMnemonic] = useState(false);
    const [copied, setCopied] = useState(false);

    const exampleMnemonic = "abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about";

    const handleCopy = () => {
        navigator.clipboard.writeText(exampleMnemonic);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const backupMethods = [
        {
            icon: FileText,
            title: '纸质备份',
            description: '将助记词手写在纸上，存放在防火防水的安全位置。',
            pros: ['无电子设备风险', '成本低'],
            cons: ['易受物理损坏', '可能被他人看到'],
            color: 'amber'
        },
        {
            icon: Shield,
            title: '金属备份',
            description: '使用金属助记词板，可抵抗火灾和水灾。',
            pros: ['极端环境耐久', '不易损坏'],
            cons: ['成本较高', '仍需物理安全'],
            color: 'blue'
        },
        {
            icon: Key,
            title: '分割备份',
            description: '使用Shamir秘密分享(SSS)将助记词分成多份。',
            pros: ['单份丢失不影响', '安全性更高'],
            cons: ['恢复需多份', '设置复杂'],
            color: 'purple'
        },
    ];

    const securityTips = [
        { icon: Eye, text: '永远不要拍照或截图保存助记词', type: 'danger' },
        { icon: Globe, text: '永远不要在网上输入或传输助记词', type: 'danger' },
        { icon: Lock, text: '考虑使用密码短语(25th word)增加保护', type: 'tip' },
        { icon: Clock, text: '定期检查备份是否完好可读', type: 'tip' },
        { icon: Database, text: '在多个安全地点保存备份副本', type: 'tip' },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    备份与恢复
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    正确备份助记词是保护资产的最重要步骤
                </p>
            </div>

            {/* Warning Banner */}
            <div className={`${isDarkMode ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200'} rounded-xl p-6 border`}>
                <div className="flex items-start gap-4">
                    <AlertTriangle className="w-8 h-8 text-red-500 shrink-0" />
                    <div>
                        <h3 className={`font-bold ${isDarkMode ? 'text-red-300' : 'text-red-800'} mb-2`}>
                            助记词 = 完全控制权
                        </h3>
                        <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-700'}`}>
                            任何获得你助记词的人都可以完全控制你的所有资产。助记词一旦泄露，没有任何方法可以阻止资金被转移。
                            请像对待银行保险柜密码一样对待你的助记词。
                        </p>
                    </div>
                </div>
            </div>

            {/* Example Mnemonic (for education) */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <BookOpen className="w-5 h-5 text-emerald-500" />
                    示例助记词（仅供学习）
                </h3>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>BIP-39 测试向量 #1</span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowMnemonic(!showMnemonic)}
                                className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                            >
                                {showMnemonic ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                                onClick={handleCopy}
                                className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className={`font-mono text-sm ${showMnemonic ? '' : 'blur-sm select-none'} ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        {exampleMnemonic}
                    </div>
                </div>
                <p className={`text-xs ${isDarkMode ? 'text-amber-400' : 'text-amber-600'} mt-2 flex items-center gap-1`}>
                    <AlertTriangle className="w-3 h-3" />
                    这是公开的测试助记词，永远不要在真实钱包中使用！
                </p>
            </div>

            {/* Backup Methods */}
            <div className="grid md:grid-cols-3 gap-6">
                {backupMethods.map((method, index) => {
                    const Icon = method.icon;
                    return (
                        <div key={index} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                            <div className={`w-12 h-12 rounded-lg ${
                                method.color === 'amber' ? isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100' :
                                method.color === 'blue' ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100' :
                                isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'
                            } flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${
                                    method.color === 'amber' ? 'text-amber-500' :
                                    method.color === 'blue' ? 'text-blue-500' :
                                    'text-purple-500'
                                }`} />
                            </div>
                            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{method.title}</h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>{method.description}</p>
                            <div className="space-y-2">
                                <div>
                                    <span className="text-xs text-green-500 font-bold">优点：</span>
                                    <ul className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {method.pros.map((pro, i) => (
                                            <li key={i}>• {pro}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <span className="text-xs text-red-500 font-bold">缺点：</span>
                                    <ul className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        {method.cons.map((con, i) => (
                                            <li key={i}>• {con}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Security Tips */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Shield className="w-5 h-5 text-emerald-500" />
                    安全提示
                </h3>
                <div className="space-y-3">
                    {securityTips.map((tip, index) => {
                        const Icon = tip.icon;
                        return (
                            <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                                tip.type === 'danger'
                                    ? isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
                                    : isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
                            }`}>
                                <Icon className={`w-5 h-5 ${tip.type === 'danger' ? 'text-red-500' : 'text-emerald-500'}`} />
                                <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{tip.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recovery Process */}
            <div className={`${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'} mb-4 flex items-center gap-2`}>
                    <RefreshCw className="w-5 h-5" />
                    恢复流程
                </h3>
                <div className="grid sm:grid-cols-4 gap-4">
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 text-center`}>
                        <div className="text-2xl font-bold text-emerald-500 mb-2">1</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>准备助记词</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>找到你的12/24词备份</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 text-center`}>
                        <div className="text-2xl font-bold text-emerald-500 mb-2">2</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>选择钱包软件</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>支持BIP39的钱包</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 text-center`}>
                        <div className="text-2xl font-bold text-emerald-500 mb-2">3</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>导入恢复</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>按顺序输入所有单词</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4 text-center`}>
                        <div className="text-2xl font-bold text-emerald-500 mb-2">4</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>验证地址</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>确认派生出相同地址</div>
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
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
                    <Award className="w-8 h-8 text-emerald-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    HD 钱包知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对分层确定性钱包的理解
                </p>
            </div>
            <Quiz quizData={hdWalletQuiz} />
        </div>
    );
};

export default HDWalletDemo;
