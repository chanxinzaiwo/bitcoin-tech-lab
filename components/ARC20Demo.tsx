import React, { useState } from 'react';
import { Atom, Hash, ArrowRight, Info, AlertTriangle, Layers, Code, Search, Check, Copy, Zap, Box, Settings, Send, Coins, Database, Play, RefreshCw, Shield } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { arc20Quiz } from '../data/quizData';

type TabType = 'intro' | 'protocol' | 'atomicals' | 'comparison' | 'simulator' | 'quiz';

const ARC20Demo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    // ARC20 模拟器状态
    const [tokenTicker, setTokenTicker] = useState<string>('ATOM');
    const [maxSupply, setMaxSupply] = useState<number>(21000000);
    const [mintAmount, setMintAmount] = useState<number>(1000);
    const [mintHeight, setMintHeight] = useState<number>(0);
    const [bitwork, setBitwork] = useState<string>('7777');
    const [copied, setCopied] = useState(false);

    // 模拟铸造状态
    const [isMinting, setIsMinting] = useState(false);
    const [mintStep, setMintStep] = useState<number>(0);
    const [hashAttempts, setHashAttempts] = useState<number>(0);

    // 模拟 Atomical ID
    const generateAtomicalId = (ticker: string) => {
        const hash = ticker.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `${Math.abs(hash).toString(16).padStart(64, '0')}i0`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 模拟 Bitwork 挖矿过程
    const simulateMinting = () => {
        setIsMinting(true);
        setMintStep(0);
        setHashAttempts(0);

        let attempts = 0;
        const interval = setInterval(() => {
            attempts += Math.floor(Math.random() * 1000) + 500;
            setHashAttempts(attempts);
        }, 100);

        const steps = [1, 2, 3, 4];
        steps.forEach((step, index) => {
            setTimeout(() => {
                setMintStep(step);
                if (step === 4) {
                    clearInterval(interval);
                    setIsMinting(false);
                }
            }, (index + 1) * 1500);
        });
    };

    const tabs = [
        { id: 'intro', label: '简介', icon: Info },
        { id: 'atomicals', label: 'Atomicals 协议', icon: Atom },
        { id: 'protocol', label: 'ARC20 机制', icon: Code },
        { id: 'comparison', label: '方案对比', icon: Layers },
        { id: 'simulator', label: 'ARC20 模拟器', icon: Search },
        { id: 'quiz', label: '测验', icon: Check },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-violet-900/30 via-purple-900/20 to-indigo-900/30' : 'bg-gradient-to-r from-violet-100 via-purple-50 to-indigo-100'} py-12 px-6`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-violet-500/20' : 'bg-violet-500/10'}`}>
                            <Atom className="w-8 h-8 text-violet-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">ARC20 代币标准</h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                基于 Atomicals 协议的比特币原生代币
                            </p>
                        </div>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="hidden md:flex flex-wrap gap-2 mt-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-violet-500 text-white'
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

                    {/* Mobile Tabs */}
                    <div className={`md:hidden mt-6 border-t pt-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="grid grid-cols-3 gap-1.5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-medium transition-all min-h-[52px] ${
                                        activeTab === tab.id
                                            ? 'bg-violet-500 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-800 text-slate-300'
                                                : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                                >
                                    <tab.icon className={`w-4 h-4 mb-0.5 ${activeTab === tab.id ? '' : 'opacity-70'}`} />
                                    <span className="leading-tight text-center">{tab.label}</span>
                                </button>
                            ))}
                        </div>
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
                                <Atom className="w-5 h-5 text-violet-500" />
                                什么是 ARC20？
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                ARC20 是基于 Atomicals 协议的同质化代币标准，于 2023 年 9 月在比特币主网上线。
                                与 BRC-20 和 Runes 不同，ARC20 代币的每单位直接对应 1 聪（satoshi），
                                无需依赖索引器来追踪余额，实现了真正的"染色聪"概念。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-violet-500/20 flex items-center justify-center mb-3">
                                        <Coins className="w-5 h-5 text-violet-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">1 Token = 1 Satoshi</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        代币数量等于 UTXO 中的聪数量，无需复杂的余额计算
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center mb-3">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">Bitwork 挖矿</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        通过 CPU 工作量证明铸造代币，实现公平分发
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center mb-3">
                                        <Database className="w-5 h-5 text-indigo-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">无需索引器</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        余额直接由 UTXO 中的聪数表示，可被任何比特币节点验证
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 发展历程 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">发展历程</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-violet-500/20 flex items-center justify-center">
                                            <span className="text-violet-400 font-bold text-sm">1</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-violet-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2023年9月 - Atomicals 协议发布</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Atomicals 协议在比特币主网上线，引入 ARC20 代币标准
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-purple-400 font-bold text-sm">2</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-purple-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2023年10月 - ATOM 代币铸造</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            首个 ARC20 代币 ATOM 开始铸造，采用 Bitwork 挖矿机制
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                                            <span className="text-indigo-400 font-bold text-sm">3</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">2024年至今 - 生态发展</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            更多项目采用 ARC20 标准，生态系统持续壮大
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 核心特性 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-violet-500" />
                                核心特性
                            </h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-violet-400 mb-3">染色聪 (Colored Satoshis)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        ARC20 代币是被"染色"的聪。当你持有 1000 个 ARC20 代币时，
                                        你实际上持有的是 1000 聪的 UTXO，这些聪被标记为特定代币。
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-purple-400 mb-3">直接合并与拆分</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        多个相同代币的 UTXO 可以直接合并，一个 UTXO 也可以拆分成多个输出，
                                        操作方式与普通比特币交易完全相同。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Atomicals 协议 */}
                {activeTab === 'atomicals' && (
                    <div className="space-y-8">
                        {/* 协议概述 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Atom className="w-5 h-5 text-violet-500" />
                                Atomicals 协议
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Atomicals 是一个在比特币上创建数字对象（Digital Objects）的协议。
                                它支持创建 NFT（Non-Fungible Tokens）、FT（Fungible Tokens/ARC20）和 Realms（域名系统）。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg border-l-4 border-violet-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-violet-400 mb-2">NFT (非同质化)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        独一无二的数字艺术品和收藏品，类似于 Ordinals 铭文
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-purple-400 mb-2">ARC20 (同质化)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        可互换的代币，1 代币 = 1 聪，天然可分割
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-indigo-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-indigo-400 mb-2">Realms (域名)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        比特币原生域名系统，支持子域名和数据存储
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Atomical ID */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">Atomical ID 标识系统</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                每个 Atomical 由铸造交易的 txid 和输出索引唯一标识。
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-violet-400 mb-2">Atomical ID 格式</h3>
                                    <code className="text-xs bg-slate-900 px-2 py-1 rounded break-all block mt-2">
                                        {`<txid>i<output_index>`}
                                    </code>
                                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        例如：abc123...def456i0
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-purple-400 mb-2">Atomical Number</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        按铸造顺序的全局编号，从 0 开始递增
                                    </p>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded mt-2 inline-block">
                                        Atomical #12345
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* Commit-Reveal */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">Commit-Reveal 铸造机制</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Atomicals 使用两阶段提交来防止铸造被抢跑：
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-violet-500/20 flex items-center justify-center">
                                            <span className="text-violet-400 font-bold">1</span>
                                        </div>
                                        <h3 className="font-bold">Commit 交易</h3>
                                    </div>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 创建包含 payload 哈希的输出</li>
                                        <li>• Payload 内容此时不公开</li>
                                        <li>• 可选：执行 Bitwork 挖矿</li>
                                    </ul>
                                </div>

                                <ArrowRight className="w-8 h-8 text-slate-500 shrink-0 rotate-90 md:rotate-0" />

                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                                            <span className="text-purple-400 font-bold">2</span>
                                        </div>
                                        <h3 className="font-bold">Reveal 交易</h3>
                                    </div>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 花费 Commit 输出</li>
                                        <li>• 在见证数据中揭示 payload</li>
                                        <li>• Atomical 正式创建</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 数据存储 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-violet-500" />
                                数据存储方式
                            </h2>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`Atomicals Envelope (信封结构):
├── 存储在 Taproot 见证数据中
├── 格式：OP_FALSE OP_IF ... OP_ENDIF
├── 协议标识：atom
└── Payload (CBOR 编码)
    ├── op: "dmt" / "ft" / "nft" / ...
    ├── args: {
    │     ticker: "ATOM",
    │     bitworkc: "7777",
    │     mint_amount: 1000,
    │     ...
    │   }
    └── data: <optional file data>`}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* ARC20 机制 */}
                {activeTab === 'protocol' && (
                    <div className="space-y-8">
                        {/* Bitwork 挖矿 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-violet-500" />
                                Bitwork 工作量证明
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Bitwork 是 Atomicals 独创的 CPU 挖矿机制。铸造者需要找到满足特定前缀条件的交易 ID，
                                类似于比特币挖矿但难度较低，确保公平分发。
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-4">Bitwork 类型</h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">bitworkc</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-violet-500/20 text-violet-400' : 'bg-violet-100 text-violet-700'}`}>
                                                    Commit
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Commit 交易 txid 必须以指定前缀开头
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">bitworkr</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                                    Reveal
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Reveal 交易 txid 必须以指定前缀开头（可选）
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-4">难度示例</h3>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <code className="text-violet-400">7777</code>
                                                <span>~65,536 次尝试</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <code className="text-purple-400">77777</code>
                                                <span>~1,048,576 次尝试</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <code className="text-indigo-400">777777</code>
                                                <span>~16,777,216 次尝试</span>
                                            </div>
                                        </div>
                                        <p className={`text-xs mt-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            每增加一个字符，难度增加约 16 倍
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 代币部署 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-violet-500" />
                                代币部署参数
                            </h2>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`{
  "op": "dft",           // 部署同质化代币
  "args": {
    "ticker": "ATOM",    // 代币符号 (1-5 字符)
    "max_supply": 21000000,  // 最大供应量
    "mint_amount": 1000,     // 每次铸造数量
    "mint_height": 0,        // 开始铸造区块高度
    "max_mints": 21000,      // 最大铸造次数
    "bitworkc": "7777",      // Commit Bitwork 前缀
    "bitworkr": null         // Reveal Bitwork (可选)
  }
}`}
                                </pre>
                            </div>
                        </div>

                        {/* 转账机制 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Send className="w-5 h-5 text-violet-500" />
                                转账规则
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                ARC20 转账遵循简单的 UTXO 规则：代币数量 = 输出聪数量。
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 items-center mb-6">
                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">输入</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>UTXO (5000 sats)</span>
                                            <span className="text-violet-400">= 5000 ATOM</span>
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="w-8 h-8 text-slate-500 shrink-0 rotate-90 md:rotate-0" />

                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">输出</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="text-green-400">Output 0 (3000 sats) = 3000 ATOM</div>
                                        <div className="text-blue-400">Output 1 (2000 sats) = 2000 ATOM</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                <div className="flex gap-2">
                                    <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                            无需特殊协议指令
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                            普通的比特币交易就能完成 ARC20 转账，钱包只需正确处理 UTXO 即可。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 注意事项 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                注意事项
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <span className="text-red-400">•</span>
                                    <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <strong>粉尘限制：</strong>ARC20 代币数量受比特币粉尘限制约束（通常最小 546 sats）
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-red-400">•</span>
                                    <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <strong>钱包兼容性：</strong>需要使用支持 Atomicals 的钱包，普通钱包可能意外花费代币
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-red-400">•</span>
                                    <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <strong>找零处理：</strong>交易找零会创建新的代币 UTXO，需要正确管理
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 方案对比 */}
                {activeTab === 'comparison' && (
                    <div className="space-y-8">
                        {/* ARC20 vs 其他标准 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">比特币代币标准对比</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                                            <th className="text-left py-3 px-4">特性</th>
                                            <th className="text-left py-3 px-4">ARC20</th>
                                            <th className="text-left py-3 px-4">BRC-20</th>
                                            <th className="text-left py-3 px-4">Runes</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">数据存储</td>
                                            <td className="py-3 px-4">Taproot 见证</td>
                                            <td className="py-3 px-4">Ordinals 铭文</td>
                                            <td className="py-3 px-4">OP_RETURN</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">余额模型</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">1 Token = 1 Sat</span>
                                            </td>
                                            <td className="py-3 px-4">索引器追踪</td>
                                            <td className="py-3 px-4">UTXO 绑定</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">铸造机制</td>
                                            <td className="py-3 px-4">
                                                <span className="text-violet-400">Bitwork PoW</span>
                                            </td>
                                            <td className="py-3 px-4">先到先得</td>
                                            <td className="py-3 px-4">Open Mint</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">转账效率</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">普通 BTC 交易</span>
                                            </td>
                                            <td className="py-3 px-4">需 2 笔交易</td>
                                            <td className="py-3 px-4">1 笔交易</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">需要索引器</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">仅查询（非验证）</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">必须</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">必须</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">最小单位</td>
                                            <td className="py-3 px-4">1 sat (~546)</td>
                                            <td className="py-3 px-4">可配置</td>
                                            <td className="py-3 px-4">可配置</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 优势与劣势 */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                <h3 className="font-bold text-green-400 mb-4">ARC20 优势</h3>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>真正的 UTXO 原生代币，验证简单</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>Bitwork 挖矿确保公平分发</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>转账只需普通比特币交易</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>代币余额一目了然（=聪数）</span>
                                    </li>
                                </ul>
                            </div>
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                                <h3 className="font-bold text-orange-400 mb-4">ARC20 劣势</h3>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>受比特币粉尘限制约束</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>代币符号仅 1-5 字符</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>需要专用钱包支持</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>铸造需要 CPU 计算资源</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 生态系统 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">ARC20 生态系统</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-violet-400 mb-3">钱包支持</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• Wizz Wallet</li>
                                        <li>• Atomicals Wallet</li>
                                        <li>• UniSat (部分)</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-purple-400 mb-3">交易市场</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• Atomicals Market</li>
                                        <li>• SatsX</li>
                                        <li>• Bitatom</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-indigo-400 mb-3">工具</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• atomicals-js CLI</li>
                                        <li>• Atomicals 浏览器</li>
                                        <li>• ElectrumX 索引器</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ARC20 模拟器 */}
                {activeTab === 'simulator' && (
                    <div className="space-y-8">
                        {/* 铸造模拟器 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Atom className="w-5 h-5 text-violet-500" />
                                ARC20 铸造模拟器
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                配置代币参数，模拟 Bitwork 挖矿铸造过程：
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            代币符号 (Ticker)
                                        </label>
                                        <input
                                            type="text"
                                            value={tokenTicker}
                                            onChange={(e) => setTokenTicker(e.target.value.toUpperCase().slice(0, 5))}
                                            className={`w-full px-4 py-3 rounded-lg font-mono ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                                            placeholder="ATOM"
                                            maxLength={5}
                                        />
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            1-5 个大写字母
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                铸造数量
                                            </label>
                                            <input
                                                type="number"
                                                value={mintAmount}
                                                onChange={(e) => setMintAmount(parseInt(e.target.value) || 0)}
                                                min={546}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                总供应量
                                            </label>
                                            <input
                                                type="number"
                                                value={maxSupply}
                                                onChange={(e) => setMaxSupply(parseInt(e.target.value) || 0)}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            Bitwork 前缀
                                        </label>
                                        <input
                                            type="text"
                                            value={bitwork}
                                            onChange={(e) => setBitwork(e.target.value.replace(/[^0-9a-f]/gi, '').slice(0, 8))}
                                            className={`w-full px-4 py-3 rounded-lg font-mono ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-violet-500 focus:border-transparent`}
                                            placeholder="7777"
                                        />
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            预估难度: ~{Math.pow(16, bitwork.length).toLocaleString()} 次尝试
                                        </p>
                                    </div>

                                    <button
                                        onClick={simulateMinting}
                                        disabled={isMinting || !tokenTicker}
                                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                            isMinting || !tokenTicker
                                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                : 'bg-violet-500 text-white hover:bg-violet-600'
                                        }`}
                                    >
                                        {isMinting ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                挖矿中... ({hashAttempts.toLocaleString()} 次)
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5" />
                                                模拟 Bitwork 挖矿
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* 代币预览 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">代币信息</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-violet-500/20 flex items-center justify-center">
                                                    <Atom className="w-6 h-6 text-violet-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-violet-400 text-lg">{tokenTicker || 'TICKER'}</p>
                                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        ARC20 Token
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>每次铸造：</span>
                                                    <span className="font-mono ml-1">{mintAmount.toLocaleString()} sats</span>
                                                </div>
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>总供应：</span>
                                                    <span className="font-mono ml-1">{maxSupply.toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 挖矿步骤 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">Bitwork 挖矿流程</h3>
                                        <div className="space-y-3">
                                            <div className={`flex items-center gap-3 p-2 rounded ${mintStep >= 1 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    mintStep >= 1 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {mintStep >= 1 ? <Check className="w-4 h-4" /> : '1'}
                                                </div>
                                                <span className={`text-sm ${mintStep >= 1 ? 'text-green-400' : ''}`}>
                                                    寻找满足 Bitwork 的 txid...
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${mintStep >= 2 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    mintStep >= 2 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {mintStep >= 2 ? <Check className="w-4 h-4" /> : '2'}
                                                </div>
                                                <span className={`text-sm ${mintStep >= 2 ? 'text-green-400' : ''}`}>
                                                    广播 Commit 交易
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${mintStep >= 3 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    mintStep >= 3 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {mintStep >= 3 ? <Check className="w-4 h-4" /> : '3'}
                                                </div>
                                                <span className={`text-sm ${mintStep >= 3 ? 'text-green-400' : ''}`}>
                                                    广播 Reveal 交易
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${mintStep >= 4 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    mintStep >= 4 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {mintStep >= 4 ? <Check className="w-4 h-4" /> : '4'}
                                                </div>
                                                <span className={`text-sm ${mintStep >= 4 ? 'text-green-400' : ''}`}>
                                                    铸造成功！获得 {mintAmount} {tokenTicker}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 生成的 Atomical */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">生成的 Atomical</h2>
                                <button
                                    onClick={() => copyToClipboard(generateAtomicalId(tokenTicker))}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                                    }`}
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    {copied ? '已复制' : '复制 ID'}
                                </button>
                            </div>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} overflow-x-auto`}>
                                <pre>
{`{
  "atomical_id": "${generateAtomicalId(tokenTicker)}",
  "type": "FT",
  "subtype": "decentralized",
  "$ticker": "${tokenTicker}",
  "$max_supply": ${maxSupply},
  "$mint_amount": ${mintAmount},
  "$bitworkc": "${bitwork}",
  "$max_mints": ${Math.floor(maxSupply / mintAmount)},
  "mint_data": {
    "fields": {
      "args": {
        "mint_ticker": "${tokenTicker}",
        "nonce": ${Math.floor(Math.random() * 1000000)},
        "time": ${Math.floor(Date.now() / 1000)}
      }
    }
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* 测验 */}
                {activeTab === 'quiz' && (
                    <Quiz quizData={arc20Quiz} />
                )}
            </div>
        </div>
    );
};

export default ARC20Demo;
