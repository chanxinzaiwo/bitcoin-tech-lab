import React, { useState } from 'react';
import { Flame, Hash, ArrowRight, Info, AlertTriangle, Layers, Code, Search, Check, Copy, Zap, Box, Settings, Send, Coins, FileText, Play, Pause, RefreshCw } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { runesQuiz } from '../data/quizData';

type TabType = 'intro' | 'protocol' | 'etching' | 'comparison' | 'simulator' | 'quiz';

const RunesDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    // 符文模拟器状态
    const [runeName, setRuneName] = useState<string>('HELLO•RUNES');
    const [runeSymbol, setRuneSymbol] = useState<string>('⚡');
    const [divisibility, setDivisibility] = useState<number>(0);
    const [premine, setPremine] = useState<number>(0);
    const [maxSupply, setMaxSupply] = useState<number>(21000000);
    const [mintAmount, setMintAmount] = useState<number>(1000);
    const [mintCap, setMintCap] = useState<number>(21000);
    const [copied, setCopied] = useState(false);

    // 模拟操作状态
    const [etchingStep, setEtchingStep] = useState<number>(0);
    const [isEtching, setIsEtching] = useState(false);

    // 模拟 Rune ID
    const generateRuneId = (name: string) => {
        const hash = name.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        const blockHeight = 840000 + Math.abs(hash % 10000);
        const txIndex = Math.abs(hash % 100);
        return `${blockHeight}:${txIndex}`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 模拟蚀刻过程
    const simulateEtching = () => {
        setIsEtching(true);
        setEtchingStep(0);

        const steps = [1, 2, 3, 4];
        steps.forEach((step, index) => {
            setTimeout(() => {
                setEtchingStep(step);
                if (step === 4) {
                    setIsEtching(false);
                }
            }, (index + 1) * 1000);
        });
    };

    const tabs = [
        { id: 'intro', label: '简介', icon: Info },
        { id: 'protocol', label: '协议原理', icon: Code },
        { id: 'etching', label: '蚀刻与铸造', icon: Flame },
        { id: 'comparison', label: '方案对比', icon: Layers },
        { id: 'simulator', label: '符文模拟器', icon: Search },
        { id: 'quiz', label: '测验', icon: Check },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-rose-900/30 via-red-900/20 to-orange-900/30' : 'bg-gradient-to-r from-rose-100 via-red-50 to-orange-100'} py-12 px-6`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-rose-500/20' : 'bg-rose-500/10'}`}>
                            <Flame className="w-8 h-8 text-rose-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Bitcoin Runes 符文协议</h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                比特币原生同质化代币标准
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
                                        ? 'bg-rose-500 text-white'
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
                                            ? 'bg-rose-500 text-white'
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
                                <Flame className="w-5 h-5 text-rose-500" />
                                什么是 Runes 符文协议？
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Runes 是由 Casey Rodarmor（Ordinals 协议创始人）于 2024 年 4 月比特币减半时推出的同质化代币协议。
                                与 BRC-20 不同，Runes 不依赖铭文机制，而是直接利用比特币的 OP_RETURN 输出来存储代币数据，
                                实现了更高效、更简洁的代币标准。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-rose-500/20 flex items-center justify-center mb-3">
                                        <Zap className="w-5 h-5 text-rose-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">高效存储</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        使用 OP_RETURN 直接存储数据，不占用 UTXO 集合
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                                        <Coins className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">UTXO 原生</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        代币余额直接绑定到 UTXO，无需索引器追踪所有权
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
                                        <Settings className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">灵活配置</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        支持可分割性、预挖、铸造上限等多种参数配置
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
                                        <div className="w-10 h-10 rounded-full bg-rose-500/20 flex items-center justify-center">
                                            <span className="text-rose-400 font-bold text-sm">1</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-rose-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2023年9月 - Runes 协议构想</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Casey Rodarmor 发布 Runes 协议提案，旨在解决 BRC-20 的效率问题
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center">
                                            <span className="text-orange-400 font-bold text-sm">2</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-orange-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2024年4月20日 - 正式上线</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            在比特币第四次减半区块（840,000）正式激活 Runes 协议
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <span className="text-amber-400 font-bold text-sm">3</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">2024年至今 - 生态发展</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            众多项目采用 Runes 标准，成为比特币同质化代币的主流选择
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Runes 命名规则 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-rose-500" />
                                符文命名规则
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Runes 采用独特的命名系统，使用大写字母 A-Z，并可以用间隔符（•）分隔以提高可读性。
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-rose-400 mb-3">命名规则</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 只能使用大写字母 A-Z</li>
                                        <li>• 可使用间隔符 • 分隔（可选）</li>
                                        <li>• 最短 1 个字符，最长 26 个字符</li>
                                        <li>• 名称解锁遵循时间表</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-orange-400 mb-3">名称解锁机制</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 区块 840,000：≥13 字符可用</li>
                                        <li>• 每 ~4 个月：最小长度减 1</li>
                                        <li>• 约 4 年后：1 字符名称解锁</li>
                                        <li>• 先到先得，不可重复</li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h3 className="font-bold mb-2">命名示例</h3>
                                <div className="flex flex-wrap gap-2">
                                    <code className="text-sm bg-slate-900 px-3 py-1 rounded text-rose-400">UNCOMMON•GOODS</code>
                                    <code className="text-sm bg-slate-900 px-3 py-1 rounded text-orange-400">SATOSHI•NAKAMOTO</code>
                                    <code className="text-sm bg-slate-900 px-3 py-1 rounded text-amber-400">DOG•GO•TO•THE•MOON</code>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 协议原理 */}
                {activeTab === 'protocol' && (
                    <div className="space-y-8">
                        {/* OP_RETURN 存储 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-rose-500" />
                                OP_RETURN 数据存储
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Runes 协议使用比特币交易的 OP_RETURN 输出来存储协议数据。OP_RETURN 是一种可证明不可花费的输出，
                                允许在区块链上嵌入最多 80 字节的任意数据。
                            </p>

                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`OP_RETURN OP_13
<encoded_runestone>

Runestone 结构:
├── Magic Number: OP_13 (标识 Runes 协议)
├── Etching (蚀刻新符文)
│   ├── Name: 符文名称
│   ├── Symbol: 符号（1-4字节 Unicode）
│   ├── Divisibility: 小数位数 (0-38)
│   ├── Premine: 预挖数量
│   ├── Terms: 铸造条款
│   │   ├── Amount: 每次铸造数量
│   │   ├── Cap: 最大铸造次数
│   │   ├── HeightStart/End: 区块高度范围
│   │   └── OffsetStart/End: 相对偏移
│   └── Turbo: 是否启用 Turbo 模式
├── Mint: 铸造操作
│   └── Rune ID: 目标符文
├── Edicts: 转账指令列表
│   ├── ID: 符文 ID
│   ├── Amount: 数量
│   └── Output: 目标输出索引
└── Pointer: 默认输出索引`}
                                </pre>
                            </div>
                        </div>

                        {/* Rune ID */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">符文 ID (Rune ID)</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                每个符文由蚀刻时的区块高度和交易索引唯一标识，格式为 BLOCK:TX。
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-rose-400 mb-2">ID 格式</h3>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded">840000:1</code>
                                    <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        第 840,000 区块的第 2 笔交易蚀刻的符文
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-orange-400 mb-2">Delta 编码</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        为节省空间，Rune ID 使用 delta 编码，相邻 ID 只存储差值
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 变长整数编码 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">LEB128 变长整数编码</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Runes 使用 LEB128（Little Endian Base 128）编码来压缩整数，小数值只需 1 字节，大数值按需扩展。
                            </p>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h3 className="font-bold mb-3">编码示例</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-300'}>
                                                <th className="text-left py-2 px-3">十进制值</th>
                                                <th className="text-left py-2 px-3">LEB128 编码</th>
                                                <th className="text-left py-2 px-3">字节数</th>
                                            </tr>
                                        </thead>
                                        <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                            <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-200'}>
                                                <td className="py-2 px-3">127</td>
                                                <td className="py-2 px-3 font-mono">0x7F</td>
                                                <td className="py-2 px-3 text-green-400">1</td>
                                            </tr>
                                            <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-200'}>
                                                <td className="py-2 px-3">128</td>
                                                <td className="py-2 px-3 font-mono">0x80 0x01</td>
                                                <td className="py-2 px-3 text-amber-400">2</td>
                                            </tr>
                                            <tr>
                                                <td className="py-2 px-3">21000000</td>
                                                <td className="py-2 px-3 font-mono">0xC0 0xC4 0x07</td>
                                                <td className="py-2 px-3 text-orange-400">3</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* UTXO 绑定 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Box className="w-5 h-5 text-rose-500" />
                                符文与 UTXO 绑定
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Runes 的核心设计是将代币余额直接绑定到 UTXO。每个 UTXO 可以持有多种符文的余额，
                                当 UTXO 被花费时，必须通过 Edict 指令明确分配符文去向。
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">输入 UTXO</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between text-sm">
                                            <span>UTXO #1</span>
                                            <span className="text-rose-400">1000 RUNE•A</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span>UTXO #2</span>
                                            <span className="text-orange-400">500 RUNE•B</span>
                                        </div>
                                    </div>
                                </div>

                                <ArrowRight className="w-8 h-8 text-slate-500 shrink-0 rotate-90 md:rotate-0" />

                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">Edicts 分配</h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="text-green-400">→ Output 0: 600 RUNE•A</div>
                                        <div className="text-blue-400">→ Output 1: 400 RUNE•A</div>
                                        <div className="text-amber-400">→ Output 2: 500 RUNE•B</div>
                                    </div>
                                </div>
                            </div>

                            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className="flex gap-2">
                                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        未通过 Edict 明确分配的符文余额会根据 Pointer 字段发送到指定输出，
                                        如果没有设置 Pointer，则发送到第一个非 OP_RETURN 输出。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 蚀刻与铸造 */}
                {activeTab === 'etching' && (
                    <div className="space-y-8">
                        {/* 蚀刻过程 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Flame className="w-5 h-5 text-rose-500" />
                                蚀刻 (Etching) - 创建新符文
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                蚀刻是创建新符文的过程。创建者可以配置符文的各种属性，包括名称、符号、
                                可分割性、预挖数量以及公开铸造规则。
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-4">蚀刻参数</h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Divisibility</span>
                                                <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                    0-38
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                小数位数，0 表示不可分割，如同聪
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Premine</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                创建时分配给创建者的数量
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Symbol</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                Unicode 符号，如 ⚡ 🔥 ◆ 等
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-4">铸造条款 (Terms)</h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Amount</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                每次铸造获得的符文数量
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Cap</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                最大铸造次数（总供应 = Amount × Cap + Premine）
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium">Height/Offset</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                铸造开始和结束的区块条件
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 铸造过程 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Coins className="w-5 h-5 text-rose-500" />
                                铸造 (Minting) - 获取符文
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                如果符文设置了公开铸造条款，任何人都可以在条件满足时通过铸造交易获取符文。
                            </p>

                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`// 铸造交易结构
Transaction:
├── Input:
│   └── 任意 UTXO（用于支付手续费）
├── Output 0 (OP_RETURN):
│   └── Runestone {
│       mint: {
│         id: "840000:1"  // 目标符文 ID
│       }
│     }
└── Output 1 (P2TR/P2WPKH):
    └── 接收铸造的符文`}
                                </pre>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mt-6">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">成功铸造条件</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                        <li>✓ 符文存在且有铸造条款</li>
                                        <li>✓ 当前区块在铸造窗口内</li>
                                        <li>✓ 铸造次数未达上限</li>
                                        <li>✓ 交易格式正确</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                                    <h3 className="font-bold text-red-400 mb-2">铸造失败情况</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <li>✗ 符文不存在或无铸造条款</li>
                                        <li>✗ 不在铸造时间窗口</li>
                                        <li>✗ 铸造已达上限</li>
                                        <li>✗ Runestone 格式错误</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 转账机制 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Send className="w-5 h-5 text-rose-500" />
                                转账 (Transfer) - Edict 指令
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Runes 使用 Edict（法令）指令来转移符文。每个 Edict 指定符文 ID、数量和目标输出索引。
                            </p>

                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`// Edict 结构
Edict {
  id: RuneId,     // 符文 ID (BLOCK:TX)
  amount: u128,   // 转移数量
  output: u32     // 目标输出索引
}

// 批量转账示例
Runestone {
  edicts: [
    { id: "840000:1", amount: 1000, output: 0 },
    { id: "840000:1", amount: 500,  output: 1 },
    { id: "840123:5", amount: 200,  output: 0 }
  ]
}`}
                                </pre>
                            </div>

                            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-rose-500/10 border border-rose-500/20' : 'bg-rose-50 border border-rose-200'}`}>
                                <div className="flex gap-2">
                                    <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className={`text-sm font-medium ${isDarkMode ? 'text-rose-200' : 'text-rose-800'}`}>
                                            Cenotaph（衣冠冢）
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-rose-300' : 'text-rose-700'}`}>
                                            如果 Runestone 格式错误或包含无效操作，交易中的所有符文将被永久销毁。
                                            这是一种安全机制，防止意外的符文丢失被忽略。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 方案对比 */}
                {activeTab === 'comparison' && (
                    <div className="space-y-8">
                        {/* Runes vs BRC-20 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">Runes vs BRC-20</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                                            <th className="text-left py-3 px-4">特性</th>
                                            <th className="text-left py-3 px-4">Runes</th>
                                            <th className="text-left py-3 px-4">BRC-20</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">数据存储</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">OP_RETURN（不膨胀 UTXO）</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">Ordinals 铭文（见证数据）</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">余额追踪</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">UTXO 原生绑定</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">需要索引器追踪</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">转账效率</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">单笔交易完成</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">需要两笔交易（铭刻+转移）</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">批量转账</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">原生支持</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">不支持</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">代币名称</td>
                                            <td className="py-3 px-4">1-26 字符</td>
                                            <td className="py-3 px-4">4 字符固定</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">可分割性</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">可配置（0-38 位小数）</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">固定 18 位小数</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Runes vs Ordinals NFT */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">Runes vs Ordinals 铭文</h2>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-rose-400 mb-3 flex items-center gap-2">
                                        <Flame className="w-5 h-5" />
                                        Runes 符文
                                    </h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• <strong>同质化代币</strong> - 每单位可互换</li>
                                        <li>• 数据存储在 OP_RETURN</li>
                                        <li>• 适合货币、积分、治理代币</li>
                                        <li>• 余额可分割和合并</li>
                                        <li>• 协议内置铸造机制</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-amber-400 mb-3 flex items-center gap-2">
                                        <FileText className="w-5 h-5" />
                                        Ordinals 铭文
                                    </h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• <strong>非同质化代币</strong> - 每个独一无二</li>
                                        <li>• 数据存储在见证区域</li>
                                        <li>• 适合艺术品、收藏品、证书</li>
                                        <li>• 绑定到特定聪，不可分割</li>
                                        <li>• 支持任意内容类型</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 生态系统 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">Runes 生态系统</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-rose-400 mb-3">钱包支持</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• Xverse</li>
                                        <li>• OKX Wallet</li>
                                        <li>• UniSat</li>
                                        <li>• Leather</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-orange-400 mb-3">交易市场</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• Magic Eden</li>
                                        <li>• OKX NFT</li>
                                        <li>• UniSat Market</li>
                                        <li>• Ordinals Wallet</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-amber-400 mb-3">工具与浏览器</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• Ordiscan</li>
                                        <li>• RuneAlpha</li>
                                        <li>• ord 索引器</li>
                                        <li>• Runes.io</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 符文模拟器 */}
                {activeTab === 'simulator' && (
                    <div className="space-y-8">
                        {/* 蚀刻模拟器 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Flame className="w-5 h-5 text-rose-500" />
                                符文蚀刻模拟器
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                配置你的符文参数，模拟蚀刻过程：
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            符文名称
                                        </label>
                                        <input
                                            type="text"
                                            value={runeName}
                                            onChange={(e) => setRuneName(e.target.value.toUpperCase().replace(/[^A-Z•]/g, ''))}
                                            className={`w-full px-4 py-3 rounded-lg font-mono ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                                            placeholder="EXAMPLE•RUNE"
                                        />
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            只能使用 A-Z 和 • 分隔符
                                        </p>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            符号
                                        </label>
                                        <input
                                            type="text"
                                            value={runeSymbol}
                                            onChange={(e) => setRuneSymbol(e.target.value.slice(0, 4))}
                                            className={`w-full px-4 py-3 rounded-lg text-2xl ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                                            placeholder="⚡"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                小数位数
                                            </label>
                                            <input
                                                type="number"
                                                value={divisibility}
                                                onChange={(e) => setDivisibility(Math.min(38, Math.max(0, parseInt(e.target.value) || 0)))}
                                                min={0}
                                                max={38}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                预挖数量
                                            </label>
                                            <input
                                                type="number"
                                                value={premine}
                                                onChange={(e) => setPremine(parseInt(e.target.value) || 0)}
                                                min={0}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                每次铸造数量
                                            </label>
                                            <input
                                                type="number"
                                                value={mintAmount}
                                                onChange={(e) => setMintAmount(parseInt(e.target.value) || 0)}
                                                min={0}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                铸造上限次数
                                            </label>
                                            <input
                                                type="number"
                                                value={mintCap}
                                                onChange={(e) => setMintCap(parseInt(e.target.value) || 0)}
                                                min={0}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-rose-500 focus:border-transparent`}
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={simulateEtching}
                                        disabled={isEtching || !runeName}
                                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                            isEtching || !runeName
                                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                : 'bg-rose-500 text-white hover:bg-rose-600'
                                        }`}
                                    >
                                        {isEtching ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                蚀刻中...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5" />
                                                模拟蚀刻
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* 符文预览 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">符文预览</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <span className="text-4xl">{runeSymbol}</span>
                                                <div>
                                                    <p className="font-bold text-rose-400">{runeName || 'UNNAMED'}</p>
                                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        Rune ID: {generateRuneId(runeName)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>总供应：</span>
                                                    <span className="font-mono ml-1">
                                                        {(premine + mintAmount * mintCap).toLocaleString()}
                                                    </span>
                                                </div>
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>小数位：</span>
                                                    <span className="font-mono ml-1">{divisibility}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 蚀刻步骤 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">蚀刻流程</h3>
                                        <div className="space-y-3">
                                            <div className={`flex items-center gap-3 p-2 rounded ${etchingStep >= 1 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    etchingStep >= 1 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {etchingStep >= 1 ? <Check className="w-4 h-4" /> : '1'}
                                                </div>
                                                <span className={`text-sm ${etchingStep >= 1 ? 'text-green-400' : ''}`}>
                                                    构建 Runestone 数据
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${etchingStep >= 2 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    etchingStep >= 2 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {etchingStep >= 2 ? <Check className="w-4 h-4" /> : '2'}
                                                </div>
                                                <span className={`text-sm ${etchingStep >= 2 ? 'text-green-400' : ''}`}>
                                                    创建 OP_RETURN 输出
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${etchingStep >= 3 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    etchingStep >= 3 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {etchingStep >= 3 ? <Check className="w-4 h-4" /> : '3'}
                                                </div>
                                                <span className={`text-sm ${etchingStep >= 3 ? 'text-green-400' : ''}`}>
                                                    广播交易
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${etchingStep >= 4 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    etchingStep >= 4 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {etchingStep >= 4 ? <Check className="w-4 h-4" /> : '4'}
                                                </div>
                                                <span className={`text-sm ${etchingStep >= 4 ? 'text-green-400' : ''}`}>
                                                    符文蚀刻完成！
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 生成的 Runestone */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">生成的 Runestone</h2>
                                <button
                                    onClick={() => copyToClipboard(JSON.stringify({
                                        etching: {
                                            rune: runeName.replace(/•/g, ''),
                                            symbol: runeSymbol,
                                            divisibility,
                                            premine,
                                            terms: {
                                                amount: mintAmount,
                                                cap: mintCap
                                            }
                                        }
                                    }, null, 2))}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                                    }`}
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    {copied ? '已复制' : '复制'}
                                </button>
                            </div>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} overflow-x-auto`}>
                                <pre>
{`{
  "etching": {
    "rune": "${runeName.replace(/•/g, '')}",
    "spacers": ${(() => {
        let spacers = 0;
        const name = runeName;
        for (let i = 0; i < name.length; i++) {
            if (name[i] === '•') {
                spacers |= (1 << (i - name.slice(0, i).split('•').length));
            }
        }
        return spacers;
    })()},
    "symbol": "${runeSymbol}",
    "divisibility": ${divisibility},
    "premine": ${premine},
    "terms": {
      "amount": ${mintAmount},
      "cap": ${mintCap}
    }
  },
  "pointer": 1
}`}
                                </pre>
                            </div>
                        </div>

                        {/* 费用估算 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-rose-500" />
                                交易费用估算
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="text-sm text-slate-400 mb-1">Runestone 数据大小</h3>
                                    <p className="text-2xl font-bold text-rose-400">
                                        ~{Math.ceil(runeName.length * 1.5 + 20)} <span className="text-sm">bytes</span>
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="text-sm text-slate-400 mb-1">预估交易大小</h3>
                                    <p className="text-2xl font-bold text-orange-400">
                                        ~{150 + Math.ceil(runeName.length * 1.5 + 20)} <span className="text-sm">vbytes</span>
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="text-sm text-slate-400 mb-1">预估费用 (20 sat/vB)</h3>
                                    <p className="text-2xl font-bold text-amber-400">
                                        {(150 + Math.ceil(runeName.length * 1.5 + 20)) * 20} <span className="text-sm">sats</span>
                                    </p>
                                </div>
                            </div>
                            <p className={`mt-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                * 实际费用取决于当前网络费率、符文名称长度和配置参数
                            </p>
                        </div>
                    </div>
                )}

                {/* 测验 */}
                {activeTab === 'quiz' && (
                    <Quiz quizData={runesQuiz} />
                )}
            </div>
        </div>
    );
};

export default RunesDemo;
