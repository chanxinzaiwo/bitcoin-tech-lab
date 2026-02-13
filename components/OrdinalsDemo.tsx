import React, { useState } from 'react';
import { Gem, FileImage, Hash, ArrowRight, Info, AlertTriangle, Layers, Database, Code, Search, Check, Copy, ChevronRight, Zap, Box } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { ordinalsQuiz } from '../data/quizData';

type TabType = 'intro' | 'ordinals' | 'inscriptions' | 'technical' | 'explorer' | 'quiz';

const OrdinalsDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    // 铭文模拟器状态
    const [inscriptionContent, setInscriptionContent] = useState<string>('Hello, Ordinals!');
    const [contentType, setContentType] = useState<'text' | 'image' | 'json'>('text');
    const [selectedSat, setSelectedSat] = useState<number>(1000000);
    const [copied, setCopied] = useState(false);

    // 模拟 Ordinal 编号
    const generateOrdinalNumber = (sat: number) => {
        return sat.toString();
    };

    // 模拟铭文 ID
    const generateInscriptionId = (content: string) => {
        const hash = content.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `${Math.abs(hash).toString(16).padStart(64, '0')}i0`;
    };

    // 稀有度等级
    const getRarityLevel = (sat: number) => {
        const blockHeight = Math.floor(sat / 50 * 100000000);
        const positionInBlock = sat % 100000000;

        if (positionInBlock === 0 && blockHeight % 210000 === 0) return { level: 'mythic', label: '神话', color: 'text-purple-400', bg: 'bg-purple-500/20' };
        if (positionInBlock === 0 && blockHeight % 2016 === 0) return { level: 'epic', label: '史诗', color: 'text-pink-400', bg: 'bg-pink-500/20' };
        if (positionInBlock === 0) return { level: 'rare', label: '稀有', color: 'text-blue-400', bg: 'bg-blue-500/20' };
        if (positionInBlock < 1000) return { level: 'uncommon', label: '不常见', color: 'text-green-400', bg: 'bg-green-500/20' };
        return { level: 'common', label: '普通', color: 'text-slate-400', bg: 'bg-slate-500/20' };
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const tabs = [
        { id: 'intro', label: '简介', icon: Info },
        { id: 'ordinals', label: 'Ordinals 理论', icon: Hash },
        { id: 'inscriptions', label: '铭文机制', icon: FileImage },
        { id: 'technical', label: '技术实现', icon: Code },
        { id: 'explorer', label: '铭文模拟器', icon: Search },
        { id: 'quiz', label: '测验', icon: Check },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-amber-900/30 via-orange-900/20 to-yellow-900/30' : 'bg-gradient-to-r from-amber-100 via-orange-50 to-yellow-100'} py-12 px-6`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-500/10'}`}>
                            <Gem className="w-8 h-8 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Ordinals 与铭文</h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                比特币原生数字艺术品与 NFT
                            </p>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex flex-wrap gap-2 mt-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-amber-500 text-white'
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
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* 简介 */}
                {activeTab === 'intro' && (
                    <div className="space-y-8">
                        {/* 核心概念 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Gem className="w-5 h-5 text-amber-500" />
                                什么是 Ordinals？
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Ordinals 是一个为比特币最小单位聪（Satoshi）编号的协议，使每个聪都拥有独特的身份。
                                通过这种编号系统，我们可以在比特币区块链上追踪单个聪，并在其上附加任意数据，
                                创造出比特币原生的数字艺术品和 NFT。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center mb-3">
                                        <Hash className="w-5 h-5 text-amber-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">Ordinal 编号</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        每个聪按照被挖出的顺序获得唯一编号，从 0 开始递增
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                                        <FileImage className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">铭文 (Inscriptions)</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        将任意数据（图片、文本、代码）刻录到特定聪上
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-3">
                                        <Gem className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">稀有度</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        基于挖出时间和区块位置，聪具有不同稀有度等级
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 历史背景 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">发展历程</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <span className="text-amber-400 font-bold text-sm">1</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-amber-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2023年1月 - Ordinals 协议发布</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Casey Rodarmor 发布 Ordinals 协议，引入聪编号理论
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
                                        <h3 className="font-bold">2023年2月 - 首个铭文</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            第一个铭文被创建，开启比特币 NFT 时代
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                            <span className="text-yellow-400 font-bold text-sm">3</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">2023年3月 - BRC-20 代币标准</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            基于 Ordinals 的 BRC-20 代币标准诞生，引发代币热潮
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 与以太坊 NFT 对比 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">Ordinals vs 以太坊 NFT</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                                            <th className="text-left py-3 px-4">特性</th>
                                            <th className="text-left py-3 px-4">Ordinals 铭文</th>
                                            <th className="text-left py-3 px-4">以太坊 NFT</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">数据存储</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">链上完全存储</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">通常链下存储 (IPFS)</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">智能合约</td>
                                            <td className="py-3 px-4">不需要</td>
                                            <td className="py-3 px-4">需要 ERC-721/1155</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">不可变性</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">完全不可变</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">元数据可修改</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">版税</td>
                                            <td className="py-3 px-4">无原生支持</td>
                                            <td className="py-3 px-4">合约可强制执行</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">安全性</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">比特币级别安全</span>
                                            </td>
                                            <td className="py-3 px-4">以太坊级别安全</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Ordinals 理论 */}
                {activeTab === 'ordinals' && (
                    <div className="space-y-8">
                        {/* 聪编号系统 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Hash className="w-5 h-5 text-amber-500" />
                                聪 (Satoshi) 编号系统
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                比特币总量为 2100 万个，每个比特币可分为 1 亿聪。Ordinals 协议为每个聪分配一个唯一的序号，
                                从第一个被挖出的聪（编号 0）开始，按照时间顺序递增。
                            </p>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} mb-6`}>
                                <h3 className="font-bold mb-3">总聪数量计算</h3>
                                <div className="font-mono text-sm space-y-2">
                                    <p>21,000,000 BTC × 100,000,000 聪/BTC</p>
                                    <p className="text-amber-400">= 2,100,000,000,000,000 聪 (2.1 千万亿)</p>
                                </div>
                            </div>

                            {/* 编号表示法 */}
                            <h3 className="font-bold mb-4">编号表示方式</h3>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-bold text-amber-400 mb-2">整数表示法</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        简单的序号，从 0 开始
                                    </p>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded">1234567890</code>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-bold text-orange-400 mb-2">十进制表示法</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        区块高度.区块内偏移
                                    </p>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded">780000.500</code>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-bold text-yellow-400 mb-2">度数表示法</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        周期°区块′区块内″聪‴
                                    </p>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded">1°0′0″0‴</code>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-bold text-green-400 mb-2">名称表示法</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        基于 26 字母的编码
                                    </p>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded">satoshi</code>
                                </div>
                            </div>
                        </div>

                        {/* 稀有度系统 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Gem className="w-5 h-5 text-amber-500" />
                                稀有度等级
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                根据聪被挖出的时间点，Ordinals 定义了 6 个稀有度等级：
                            </p>

                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg border-l-4 border-slate-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-slate-400">Common (普通)</h3>
                                        <span className="text-xs px-2 py-1 rounded bg-slate-500/20 text-slate-400">
                                            ~2.1 千万亿
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        不是区块首个聪的任何聪
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-green-400">Uncommon (不常见)</h3>
                                        <span className="text-xs px-2 py-1 rounded bg-green-500/20 text-green-400">
                                            ~680 万
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        每个区块的第一个聪
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-blue-400">Rare (稀有)</h3>
                                        <span className="text-xs px-2 py-1 rounded bg-blue-500/20 text-blue-400">
                                            ~3437
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        每个难度调整周期（2016 区块）的第一个聪
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border-l-4 border-pink-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-pink-400">Epic (史诗)</h3>
                                        <span className="text-xs px-2 py-1 rounded bg-pink-500/20 text-pink-400">
                                            ~32
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        每个减半周期（210,000 区块）的第一个聪
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border-l-4 border-purple-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-purple-400">Legendary (传奇)</h3>
                                        <span className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                                            ~5
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        每个周期（减半周期 × 难度调整周期）的第一个聪
                                    </p>
                                </div>

                                <div className={`p-4 rounded-lg border-l-4 border-amber-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <h3 className="font-bold text-amber-400">Mythic (神话)</h3>
                                        <span className="text-xs px-2 py-1 rounded bg-amber-500/20 text-amber-400">
                                            1
                                        </span>
                                    </div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        创世区块的第一个聪（编号 0）
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 聪的转移 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">聪的追踪规则 (FIFO)</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                Ordinals 使用先进先出（FIFO）规则追踪聪的转移：
                            </p>

                            <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className="flex items-center gap-4 flex-wrap">
                                    <div className="text-center">
                                        <div className="text-sm text-slate-400 mb-1">输入</div>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-2 bg-amber-500/20 rounded text-amber-400 text-sm">
                                                [A, B, C]
                                            </div>
                                            <div className="px-3 py-2 bg-orange-500/20 rounded text-orange-400 text-sm">
                                                [D, E]
                                            </div>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-slate-500" />
                                    <div className="text-center">
                                        <div className="text-sm text-slate-400 mb-1">合并排序</div>
                                        <div className="px-3 py-2 bg-slate-700 rounded text-white text-sm">
                                            [A, B, C, D, E]
                                        </div>
                                    </div>
                                    <ArrowRight className="w-6 h-6 text-slate-500" />
                                    <div className="text-center">
                                        <div className="text-sm text-slate-400 mb-1">输出</div>
                                        <div className="flex gap-2">
                                            <div className="px-3 py-2 bg-green-500/20 rounded text-green-400 text-sm">
                                                [A, B]
                                            </div>
                                            <div className="px-3 py-2 bg-blue-500/20 rounded text-blue-400 text-sm">
                                                [C, D, E]
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 铭文机制 */}
                {activeTab === 'inscriptions' && (
                    <div className="space-y-8">
                        {/* 铭文概述 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FileImage className="w-5 h-5 text-amber-500" />
                                什么是铭文？
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                铭文是附加在特定聪上的任意数据。通过 Taproot 升级引入的见证数据空间，
                                我们可以将图片、文本、HTML、音频等任何数据永久存储在比特币区块链上。
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">支持的内容类型</h3>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-400" />
                                            <span>图片 (PNG, JPEG, GIF, SVG, WebP)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-400" />
                                            <span>文本 (Plain, HTML, Markdown)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-400" />
                                            <span>音频 (MP3, WAV)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-400" />
                                            <span>视频 (MP4, WebM)</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Check className="w-4 h-4 text-green-400" />
                                            <span>JSON (用于 BRC-20 代币)</span>
                                        </div>
                                    </div>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-3">大小限制</h3>
                                    <div className="space-y-3">
                                        <div>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span>单个铭文</span>
                                                <span className="text-amber-400">~4MB</span>
                                            </div>
                                            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                                                <div className="h-full bg-amber-500 rounded-full" style={{ width: '100%' }}></div>
                                            </div>
                                        </div>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            理论上限为区块大小（约 4MB），但实际受交易费用和网络拥堵影响
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 铭文结构 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">铭文数据结构</h2>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`OP_FALSE
OP_IF
  OP_PUSH "ord"              // 标识符
  OP_PUSH 1                  // 内容类型标签
  OP_PUSH "image/png"        // MIME 类型
  OP_PUSH 0                  // 分隔符
  OP_PUSH <image_data>       // 实际内容
OP_ENDIF`}
                                </pre>
                            </div>
                            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className="flex gap-2">
                                    <Info className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                                    <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
                                        铭文数据存储在 Taproot 脚本路径的见证数据中，利用 SegWit 折扣，
                                        存储成本约为普通交易数据的 1/4。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 铭文 ID */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">铭文标识</h2>
                            <div className="space-y-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-amber-400 mb-2">铭文 ID</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        交易 ID + 输出索引
                                    </p>
                                    <code className="text-xs bg-slate-900 px-2 py-1 rounded break-all">
                                        6fb976ab49dcec017f1e201e84395983204ae1a7c2abf7ced0a85d692e442799i0
                                    </code>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-orange-400 mb-2">铭文编号</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        按创建顺序的序号
                                    </p>
                                    <code className="text-sm bg-slate-900 px-2 py-1 rounded">
                                        Inscription #1234567
                                    </code>
                                </div>
                            </div>
                        </div>

                        {/* BRC-20 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-yellow-500" />
                                BRC-20 代币标准
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                BRC-20 是基于 Ordinals 铭文的实验性代币标准，通过 JSON 铭文实现代币的部署、铸造和转账。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">部署 (Deploy)</h3>
                                    <pre className="text-xs bg-slate-900 p-2 rounded overflow-x-auto">
{`{
  "p": "brc-20",
  "op": "deploy",
  "tick": "ordi",
  "max": "21000000",
  "lim": "1000"
}`}
                                    </pre>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-blue-400 mb-2">铸造 (Mint)</h3>
                                    <pre className="text-xs bg-slate-900 p-2 rounded overflow-x-auto">
{`{
  "p": "brc-20",
  "op": "mint",
  "tick": "ordi",
  "amt": "1000"
}`}
                                    </pre>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-orange-400 mb-2">转账 (Transfer)</h3>
                                    <pre className="text-xs bg-slate-900 p-2 rounded overflow-x-auto">
{`{
  "p": "brc-20",
  "op": "transfer",
  "tick": "ordi",
  "amt": "100"
}`}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 技术实现 */}
                {activeTab === 'technical' && (
                    <div className="space-y-8">
                        {/* Taproot 与铭文 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-amber-500" />
                                Taproot 与铭文
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                铭文利用 Taproot 升级的脚本路径花费功能，将数据存储在见证区域：
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-3">为什么使用 Taproot？</h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Check className="w-4 h-4 text-green-400" />
                                                <span className="font-medium">见证折扣</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                见证数据只计算 1/4 权重，降低存储成本
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Check className="w-4 h-4 text-green-400" />
                                                <span className="font-medium">脚本隐藏</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                未使用的脚本路径不上链，节省空间
                                            </p>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <Check className="w-4 h-4 text-green-400" />
                                                <span className="font-medium">无限制脚本大小</span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                脚本路径没有 10KB 限制
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-3">铭文交易结构</h3>
                                    <div className={`p-4 rounded-lg font-mono text-xs ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <pre className="overflow-x-auto">
{`Transaction:
├── Input (Commit TX Output)
│   └── Witness:
│       ├── Signature
│       ├── Script:
│       │   ├── OP_FALSE OP_IF
│       │   ├── "ord"
│       │   ├── content-type
│       │   ├── content-data
│       │   └── OP_ENDIF
│       └── Control Block
└── Output (P2TR)`}
                                        </pre>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 两阶段提交 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">两阶段提交 (Commit-Reveal)</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                铭文创建需要两笔交易，这是为了确保铭文内容的安全性和不可抢跑：
                            </p>

                            <div className="flex flex-col md:flex-row gap-4 items-center">
                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center">
                                            <span className="text-amber-400 font-bold">1</span>
                                        </div>
                                        <h3 className="font-bold">Commit 交易</h3>
                                    </div>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 创建 P2TR 输出</li>
                                        <li>• 包含铭文脚本的哈希承诺</li>
                                        <li>• 铭文内容此时不可见</li>
                                    </ul>
                                </div>

                                <ArrowRight className="w-8 h-8 text-slate-500 shrink-0 rotate-90 md:rotate-0" />

                                <div className={`flex-1 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                            <span className="text-orange-400 font-bold">2</span>
                                        </div>
                                        <h3 className="font-bold">Reveal 交易</h3>
                                    </div>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 花费 Commit 输出</li>
                                        <li>• 在见证中揭示铭文内容</li>
                                        <li>• 铭文正式上链</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 索引器 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Database className="w-5 h-5 text-amber-500" />
                                Ordinals 索引器
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-4`}>
                                由于比特币协议本身不理解 Ordinals，需要专门的索引器来追踪聪的编号和铭文：
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-amber-400 mb-2">ord 索引器</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                        官方 Rust 实现的索引器
                                    </p>
                                    <code className="text-xs bg-slate-900 px-2 py-1 rounded">
                                        ord index update
                                    </code>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-orange-400 mb-2">功能</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 追踪所有聪的位置</li>
                                        <li>• 解析铭文内容</li>
                                        <li>• 提供 API 查询</li>
                                        <li>• 创建新铭文</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 注意事项 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/20' : 'bg-red-50 border border-red-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500" />
                                技术注意事项
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                                    <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <strong>铭文可能丢失：</strong>如果包含铭文的 UTXO 被作为手续费花费，铭文将永久丢失
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                                    <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <strong>钱包兼容性：</strong>普通比特币钱包可能无法正确识别和保护铭文
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <ChevronRight className="w-4 h-4 text-red-400 shrink-0 mt-1" />
                                    <p className={`text-sm ${isDarkMode ? 'text-red-200' : 'text-red-800'}`}>
                                        <strong>手续费波动：</strong>网络拥堵时创建铭文的成本可能非常高
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 铭文模拟器 */}
                {activeTab === 'explorer' && (
                    <div className="space-y-8">
                        {/* 创建铭文模拟 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <FileImage className="w-5 h-5 text-amber-500" />
                                铭文创建模拟器
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                模拟创建一个铭文，了解铭文的结构和内容：
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            内容类型
                                        </label>
                                        <div className="flex gap-2">
                                            {(['text', 'image', 'json'] as const).map((type) => (
                                                <button
                                                    key={type}
                                                    onClick={() => setContentType(type)}
                                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                                        contentType === type
                                                            ? 'bg-amber-500 text-white'
                                                            : isDarkMode
                                                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                    }`}
                                                >
                                                    {type === 'text' ? '文本' : type === 'image' ? '图片' : 'JSON'}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            铭文内容
                                        </label>
                                        <textarea
                                            value={inscriptionContent}
                                            onChange={(e) => setInscriptionContent(e.target.value)}
                                            className={`w-full h-32 px-4 py-3 rounded-lg font-mono text-sm ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                                            placeholder={contentType === 'json' ? '{"p":"brc-20","op":"deploy"...}' : '输入铭文内容...'}
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            目标聪编号
                                        </label>
                                        <input
                                            type="number"
                                            value={selectedSat}
                                            onChange={(e) => setSelectedSat(parseInt(e.target.value) || 0)}
                                            className={`w-full px-4 py-3 rounded-lg font-mono ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-amber-500 focus:border-transparent`}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {/* 生成的铭文信息 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">铭文预览</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    铭文 ID
                                                </span>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <code className="text-xs bg-slate-900 px-2 py-1 rounded text-amber-400 break-all flex-1">
                                                        {generateInscriptionId(inscriptionContent)}
                                                    </code>
                                                    <button
                                                        onClick={() => copyToClipboard(generateInscriptionId(inscriptionContent))}
                                                        className="p-1 rounded hover:bg-slate-700"
                                                    >
                                                        {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                                    </button>
                                                </div>
                                            </div>
                                            <div>
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    MIME 类型
                                                </span>
                                                <p className="text-sm mt-1">
                                                    {contentType === 'text' ? 'text/plain' : contentType === 'image' ? 'image/png' : 'application/json'}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    内容大小
                                                </span>
                                                <p className="text-sm mt-1">
                                                    {new Blob([inscriptionContent]).size} bytes
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 聪信息 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">目标聪信息</h3>
                                        <div className="space-y-3">
                                            <div>
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    Ordinal 编号
                                                </span>
                                                <p className="text-sm mt-1 font-mono">
                                                    {generateOrdinalNumber(selectedSat)}
                                                </p>
                                            </div>
                                            <div>
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    稀有度
                                                </span>
                                                <div className="mt-1">
                                                    {(() => {
                                                        const rarity = getRarityLevel(selectedSat);
                                                        return (
                                                            <span className={`text-sm px-2 py-1 rounded ${rarity.bg} ${rarity.color}`}>
                                                                {rarity.label}
                                                            </span>
                                                        );
                                                    })()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 生成的脚本 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">生成的铭文脚本</h2>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} overflow-x-auto`}>
                                <pre>
{`OP_FALSE
OP_IF
  OP_PUSH "ord"
  OP_PUSH 0x01
  OP_PUSH "${contentType === 'text' ? 'text/plain' : contentType === 'image' ? 'image/png' : 'application/json'}"
  OP_PUSH 0x00
  OP_PUSH "${inscriptionContent.slice(0, 50)}${inscriptionContent.length > 50 ? '...' : ''}"
OP_ENDIF
OP_PUSH <pubkey>
OP_CHECKSIG`}
                                </pre>
                            </div>
                        </div>

                        {/* 费用估算 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Layers className="w-5 h-5 text-amber-500" />
                                费用估算
                            </h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="text-sm text-slate-400 mb-1">内容数据大小</h3>
                                    <p className="text-2xl font-bold text-amber-400">
                                        {new Blob([inscriptionContent]).size} <span className="text-sm">bytes</span>
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="text-sm text-slate-400 mb-1">预估交易大小</h3>
                                    <p className="text-2xl font-bold text-orange-400">
                                        {Math.ceil((new Blob([inscriptionContent]).size + 150) / 4)} <span className="text-sm">vbytes</span>
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="text-sm text-slate-400 mb-1">预估费用 (20 sat/vB)</h3>
                                    <p className="text-2xl font-bold text-yellow-400">
                                        {Math.ceil((new Blob([inscriptionContent]).size + 150) / 4) * 20} <span className="text-sm">sats</span>
                                    </p>
                                </div>
                            </div>
                            <p className={`mt-4 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                * 实际费用取决于当前网络费率和交易大小
                            </p>
                        </div>
                    </div>
                )}

                {/* 测验 */}
                {activeTab === 'quiz' && (
                    <Quiz quizData={ordinalsQuiz} />
                )}
            </div>
        </div>
    );
};

export default OrdinalsDemo;
