import React, { useState } from 'react';
import { Globe, Info, Layers, Code, GitBranch, Zap, Check, ArrowRight, ExternalLink, TrendingUp, Shield, Coins, Network, Box, ChevronRight } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { ecosystemQuiz } from '../data/quizData';

type TabType = 'intro' | 'tokens' | 'scaling' | 'defi' | 'comparison' | 'quiz';

interface Protocol {
    name: string;
    year: string;
    tech: string;
    binding: string;
    issuance: string;
    features: string[];
    color: string;
}

interface ScalingProtocol {
    name: string;
    type: string;
    tps: string;
    confirmTime: string;
    security: string;
    status: string;
    color: string;
}

const EcosystemDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();
    const [selectedProtocol, setSelectedProtocol] = useState<string | null>(null);
    const [comparisonView, setComparisonView] = useState<'tokens' | 'scaling'>('tokens');

    const tokenProtocols: Protocol[] = [
        {
            name: 'Ordinals',
            year: '2023.1',
            tech: 'SegWit/Taproot',
            binding: '铭刻到聪',
            issuance: '铭刻 inscription',
            features: ['首个 NFT 协议', '数据完全上链', '开创铭文生态'],
            color: 'orange'
        },
        {
            name: 'BRC-20',
            year: '2023.3',
            tech: 'Ordinals',
            binding: 'JSON 铭文',
            issuance: 'deploy/mint',
            features: ['首个 FT 标准', '依赖索引器', '生态最大'],
            color: 'amber'
        },
        {
            name: 'Runes',
            year: '2024.4',
            tech: 'OP_RETURN',
            binding: '绑定 UTXO',
            issuance: 'etching 蚀刻',
            features: ['Casey 官方出品', '原生 UTXO 模型', '高效简洁'],
            color: 'rose'
        },
        {
            name: 'ARC-20',
            year: '2023.9',
            tech: 'Atomicals',
            binding: '1 token = 1 sat',
            issuance: 'Bitwork 挖矿',
            features: ['CPU 公平挖矿', '无预挖', '原子性'],
            color: 'violet'
        },
        {
            name: 'CAT-20',
            year: '2024',
            tech: 'OP_CAT + Fractal',
            binding: '智能合约验证',
            issuance: '合约部署',
            features: ['支持复杂逻辑', '30 秒出块', '可编程性强'],
            color: 'cyan'
        },
        {
            name: 'RGB',
            year: '2019+',
            tech: '客户端验证',
            binding: '链下状态',
            issuance: '资产发行',
            features: ['强隐私', '高可扩展', '闪电网络兼容'],
            color: 'emerald'
        },
        {
            name: 'Taproot Assets',
            year: '2023',
            tech: 'Taproot',
            binding: '稀疏默克尔树',
            issuance: '资产发行',
            features: ['Lightning Labs 出品', '闪电网络原生', '机构级'],
            color: 'blue'
        }
    ];

    const scalingProtocols: ScalingProtocol[] = [
        {
            name: '闪电网络',
            type: '状态通道',
            tps: '100万+',
            confirmTime: '秒级',
            security: '依赖主链',
            status: '成熟运行',
            color: 'yellow'
        },
        {
            name: 'Liquid',
            type: '联盟侧链',
            tps: '~1000',
            confirmTime: '2分钟',
            security: '联盟多签',
            status: 'Blockstream 运营',
            color: 'teal'
        },
        {
            name: 'RSK',
            type: '合并挖矿侧链',
            tps: '~300',
            confirmTime: '30秒',
            security: '矿工安全',
            status: 'EVM 兼容',
            color: 'green'
        },
        {
            name: 'Stacks',
            type: '智能合约层',
            tps: '~50',
            confirmTime: '10分钟',
            security: 'PoX 共识',
            status: 'Clarity 语言',
            color: 'purple'
        },
        {
            name: 'Fractal Bitcoin',
            type: '分形扩展',
            tps: '较高',
            confirmTime: '30秒',
            security: '继承主链',
            status: '支持 OP_CAT',
            color: 'cyan'
        },
        {
            name: 'BitVM',
            type: '计算层',
            tps: '-',
            confirmTime: '-',
            security: '欺诈证明',
            status: '开发中',
            color: 'pink'
        }
    ];

    const tabs = [
        { id: 'intro', label: '生态概览', icon: Info },
        { id: 'tokens', label: '代币协议', icon: Coins },
        { id: 'scaling', label: '扩容方案', icon: Zap },
        { id: 'defi', label: 'DeFi 应用', icon: TrendingUp },
        { id: 'comparison', label: '综合对比', icon: Layers },
        { id: 'quiz', label: '测验', icon: Check },
    ];

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; text: string; border: string; light: string }> = {
            orange: { bg: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', light: 'bg-orange-500/10' },
            amber: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500', light: 'bg-amber-500/10' },
            rose: { bg: 'bg-rose-500', text: 'text-rose-500', border: 'border-rose-500', light: 'bg-rose-500/10' },
            violet: { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500', light: 'bg-violet-500/10' },
            cyan: { bg: 'bg-cyan-500', text: 'text-cyan-500', border: 'border-cyan-500', light: 'bg-cyan-500/10' },
            emerald: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500', light: 'bg-emerald-500/10' },
            blue: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500', light: 'bg-blue-500/10' },
            yellow: { bg: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', light: 'bg-yellow-500/10' },
            teal: { bg: 'bg-teal-500', text: 'text-teal-500', border: 'border-teal-500', light: 'bg-teal-500/10' },
            green: { bg: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', light: 'bg-green-500/10' },
            purple: { bg: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', light: 'bg-purple-500/10' },
            pink: { bg: 'bg-pink-500', text: 'text-pink-500', border: 'border-pink-500', light: 'bg-pink-500/10' },
        };
        return colors[color] || colors.blue;
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-indigo-900/30 via-purple-900/20 to-pink-900/30' : 'bg-gradient-to-r from-indigo-100 via-purple-50 to-pink-100'} py-12 px-6`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-indigo-500/20' : 'bg-indigo-500/10'}`}>
                            <Globe className="w-8 h-8 text-indigo-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">比特币生态全景</h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                代币协议、扩容方案与 DeFi 应用对比
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
                                        ? 'bg-indigo-500 text-white'
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
                                            ? 'bg-indigo-500 text-white'
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
                {/* 生态概览 */}
                {activeTab === 'intro' && (
                    <div className="space-y-8">
                        {/* 概述 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Globe className="w-5 h-5 text-indigo-500" />
                                比特币生态系统
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                比特币生态正在经历前所未有的创新浪潮。从 2023 年 Ordinals 协议引爆铭文热潮开始，
                                各类代币协议、扩容方案和 DeFi 应用如雨后春笋般涌现，形成了丰富多元的生态格局。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center mb-3">
                                        <Coins className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <h3 className="font-semibold mb-2">代币协议</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        Ordinals、BRC-20、Runes、ARC-20、CAT-20 等多种代币标准
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-yellow-500/20 flex items-center justify-center mb-3">
                                        <Zap className="w-5 h-5 text-yellow-400" />
                                    </div>
                                    <h3 className="font-semibold mb-2">扩容方案</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        闪电网络、侧链、智能合约层等多层扩容架构
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                                        <TrendingUp className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-semibold mb-2">DeFi 应用</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        DEX、借贷、稳定币、跨链桥等金融基础设施
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 生态时间线 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-6">生态发展时间线</h2>
                            <div className="space-y-4">
                                {[
                                    { year: '2018', event: '闪电网络主网上线', color: 'yellow' },
                                    { year: '2019', event: 'RGB 协议提出', color: 'emerald' },
                                    { year: '2021', event: 'Taproot 升级激活', color: 'blue' },
                                    { year: '2023.1', event: 'Ordinals 协议发布', color: 'orange' },
                                    { year: '2023.3', event: 'BRC-20 标准诞生', color: 'amber' },
                                    { year: '2023.9', event: 'Atomicals/ARC-20 推出', color: 'violet' },
                                    { year: '2024.4', event: 'Runes 协议发布（减半同期）', color: 'rose' },
                                    { year: '2024', event: 'CAT-20 与 Fractal Bitcoin', color: 'cyan' },
                                ].map((item, index) => {
                                    const colors = getColorClasses(item.color);
                                    return (
                                        <div key={index} className="flex items-center gap-4">
                                            <div className={`w-20 text-right font-mono text-sm ${colors.text}`}>
                                                {item.year}
                                            </div>
                                            <div className={`w-3 h-3 rounded-full ${colors.bg}`} />
                                            <div className={`flex-1 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                                {item.event}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 快速导航 */}
                        <div className="grid md:grid-cols-2 gap-4">
                            <button
                                onClick={() => setActiveTab('tokens')}
                                className={`p-6 rounded-xl text-left transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border border-slate-800 hover:border-slate-700' : 'bg-white border border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">代币协议详解</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            深入了解 7 种主流代币协议的技术原理与特点
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-indigo-500" />
                                </div>
                            </button>
                            <button
                                onClick={() => setActiveTab('scaling')}
                                className={`p-6 rounded-xl text-left transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-900 border border-slate-800 hover:border-slate-700' : 'bg-white border border-slate-200 hover:border-slate-300'}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-lg font-bold mb-2">扩容方案对比</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            对比 6 种扩容方案的性能、安全性与适用场景
                                        </p>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-indigo-500" />
                                </div>
                            </button>
                        </div>
                    </div>
                )}

                {/* 代币协议 */}
                {activeTab === 'tokens' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-2">代币协议对比</h2>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                                点击卡片查看协议详情
                            </p>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {tokenProtocols.map((protocol) => {
                                    const colors = getColorClasses(protocol.color);
                                    const isSelected = selectedProtocol === protocol.name;
                                    return (
                                        <button
                                            key={protocol.name}
                                            onClick={() => setSelectedProtocol(isSelected ? null : protocol.name)}
                                            className={`p-4 rounded-xl text-left transition-all ${
                                                isSelected
                                                    ? `${colors.light} border-2 ${colors.border}`
                                                    : isDarkMode
                                                        ? 'bg-slate-800 border border-slate-700 hover:border-slate-600'
                                                        : 'bg-slate-50 border border-slate-200 hover:border-slate-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className={`w-10 h-10 rounded-lg ${colors.light} flex items-center justify-center`}>
                                                    <Coins className={`w-5 h-5 ${colors.text}`} />
                                                </div>
                                                <div>
                                                    <h3 className="font-bold">{protocol.name}</h3>
                                                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                        {protocol.year}
                                                    </p>
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="space-y-3 mt-4">
                                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                                        <div>
                                                            <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>技术基础：</span>
                                                            <span className="block font-mono">{protocol.tech}</span>
                                                        </div>
                                                        <div>
                                                            <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>代币绑定：</span>
                                                            <span className="block">{protocol.binding}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-sm">
                                                        <span className={`${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>发行方式：</span>
                                                        <span className="block">{protocol.issuance}</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5 mt-2">
                                                        {protocol.features.map((feature, i) => (
                                                            <span
                                                                key={i}
                                                                className={`px-2 py-1 rounded text-xs ${colors.light} ${colors.text}`}
                                                            >
                                                                {feature}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {!isSelected && (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {protocol.features.slice(0, 2).map((feature, i) => (
                                                        <span
                                                            key={i}
                                                            className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}
                                                        >
                                                            {feature}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 数据存储对比 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h3 className="text-lg font-bold mb-4">数据存储位置</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-semibold text-orange-500 mb-3">完全链上</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-orange-500" />
                                            Ordinals
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-amber-500" />
                                            BRC-20
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                                            ARC-20
                                        </li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-semibold text-blue-500 mb-3">部分链上</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                                            Runes
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-blue-500" />
                                            Taproot Assets
                                        </li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className="font-semibold text-emerald-500 mb-3">链下存储</h4>
                                    <ul className="space-y-2 text-sm">
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                            RGB
                                        </li>
                                        <li className="flex items-center gap-2">
                                            <div className="w-2 h-2 rounded-full bg-yellow-500" />
                                            闪电网络
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 选择建议 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-indigo-500/10 border border-indigo-500/20' : 'bg-indigo-50 border border-indigo-200'}`}>
                            <h3 className="text-lg font-bold mb-4 text-indigo-500">协议选择建议</h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                <div className="space-y-2">
                                    <p><strong>NFT/收藏品</strong> → Ordinals</p>
                                    <p><strong>可替代代币（生态大）</strong> → BRC-20</p>
                                    <p><strong>可替代代币（官方）</strong> → Runes</p>
                                    <p><strong>公平发射</strong> → ARC-20</p>
                                </div>
                                <div className="space-y-2">
                                    <p><strong>智能合约</strong> → CAT-20 / Stacks</p>
                                    <p><strong>隐私需求</strong> → RGB</p>
                                    <p><strong>闪电网络原生</strong> → Taproot Assets</p>
                                    <p><strong>机构合规</strong> → Liquid L-BTC</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 扩容方案 */}
                {activeTab === 'scaling' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-2">扩容方案对比</h2>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                                比特币二层与扩容技术全景
                            </p>

                            {/* 表格视图 */}
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <th className="px-4 py-3 text-left font-semibold">方案</th>
                                            <th className="px-4 py-3 text-left font-semibold">类型</th>
                                            <th className="px-4 py-3 text-left font-semibold">TPS</th>
                                            <th className="px-4 py-3 text-left font-semibold">确认时间</th>
                                            <th className="px-4 py-3 text-left font-semibold">安全性</th>
                                            <th className="px-4 py-3 text-left font-semibold">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scalingProtocols.map((protocol, index) => {
                                            const colors = getColorClasses(protocol.color);
                                            return (
                                                <tr
                                                    key={protocol.name}
                                                    className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} ${index % 2 === 0 ? '' : isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                                                >
                                                    <td className="px-4 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                                                            <span className="font-medium">{protocol.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-4 py-3">{protocol.type}</td>
                                                    <td className={`px-4 py-3 font-mono ${colors.text}`}>{protocol.tps}</td>
                                                    <td className="px-4 py-3">{protocol.confirmTime}</td>
                                                    <td className="px-4 py-3">{protocol.security}</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${colors.light} ${colors.text}`}>
                                                            {protocol.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 扩容技术分类 */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <Zap className="w-5 h-5 text-yellow-500" />
                                    链下方案
                                </h3>
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h4 className="font-semibold text-yellow-500 mb-2">闪电网络</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            基于支付通道的状态通道网络，支持即时支付和百万级 TPS，是目前最成熟的二层方案。
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h4 className="font-semibold text-emerald-500 mb-2">RGB 协议</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            客户端验证的智能合约系统，状态存储在链下，提供强隐私保护和高可扩展性。
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                    <GitBranch className="w-5 h-5 text-teal-500" />
                                    侧链方案
                                </h3>
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h4 className="font-semibold text-teal-500 mb-2">Liquid Network</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Blockstream 运营的联盟侧链，主要面向交易所和机构用户，支持 L-BTC 和资产发行。
                                        </p>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h4 className="font-semibold text-green-500 mb-2">RSK (Rootstock)</h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            通过合并挖矿保护的智能合约侧链，EVM 兼容，可运行以太坊 DApp。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 新兴方案 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h3 className="text-lg font-bold mb-4">新兴扩容技术</h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/20' : 'bg-purple-50 border border-purple-200'}`}>
                                    <h4 className="font-semibold text-purple-500 mb-2">Stacks</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        独立的智能合约层，使用 Clarity 语言，通过 PoX 共识锚定比特币安全性。
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
                                    <h4 className="font-semibold text-cyan-500 mb-2">Fractal Bitcoin</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        比特币的分形扩展层，完全继承主链代码，30 秒出块，支持 OP_CAT。
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-pink-500/10 border border-pink-500/20' : 'bg-pink-50 border border-pink-200'}`}>
                                    <h4 className="font-semibold text-pink-500 mb-2">BitVM</h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        基于欺诈证明的计算层，无需软分叉即可实现图灵完备计算，开发中。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* DeFi 应用 */}
                {activeTab === 'defi' && (
                    <div className="space-y-6">
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-2">比特币 DeFi 生态</h2>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-6`}>
                                去中心化金融应用与基础设施
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* DEX */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                                            <ArrowRight className="w-4 h-4 text-blue-500 rotate-90" />
                                        </div>
                                        去中心化交易所 (DEX)
                                    </h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Magic Eden</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>Ordinals/Runes</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">OKX Marketplace</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>多协议</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Alex (Stacks)</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>Stacks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 借贷 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                                        </div>
                                        借贷协议
                                    </h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Liquidium</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>Ordinals 抵押</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Zest Protocol</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>Stacks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 稳定币 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center">
                                            <Coins className="w-4 h-4 text-teal-500" />
                                        </div>
                                        锚定资产
                                    </h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">sBTC</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>Stacks 生态</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">RBTC</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600'}`}>RSK 生态</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">L-BTC</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-teal-500/20 text-teal-400' : 'bg-teal-100 text-teal-600'}`}>Liquid 生态</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* 钱包 */}
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold mb-4 flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                            <Shield className="w-4 h-4 text-amber-500" />
                                        </div>
                                        钱包与基础设施
                                    </h3>
                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Unisat Wallet</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>铭文钱包</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Xverse</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>多链钱包</span>
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Leather (Hiro)</span>
                                                <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>Stacks</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 跨链桥 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <Network className="w-5 h-5 text-indigo-500" />
                                跨链桥与封装 BTC
                            </h3>
                            <div className="grid md:grid-cols-4 gap-4">
                                {[
                                    { name: 'WBTC', desc: '以太坊上最大的封装 BTC', color: 'blue' },
                                    { name: 'tBTC', desc: '去中心化托管方案', color: 'purple' },
                                    { name: 'renBTC', desc: 'Ren 协议跨链资产', color: 'gray' },
                                    { name: 'cbBTC', desc: 'Coinbase 发行', color: 'cyan' },
                                ].map((item) => {
                                    const colors = getColorClasses(item.color);
                                    return (
                                        <div
                                            key={item.name}
                                            className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                                        >
                                            <h4 className={`font-semibold ${colors.text} mb-2`}>{item.name}</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {item.desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* 综合对比 */}
                {activeTab === 'comparison' && (
                    <div className="space-y-6">
                        {/* 切换按钮 */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setComparisonView('tokens')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    comparisonView === 'tokens'
                                        ? 'bg-indigo-500 text-white'
                                        : isDarkMode
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                代币协议对比
                            </button>
                            <button
                                onClick={() => setComparisonView('scaling')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    comparisonView === 'scaling'
                                        ? 'bg-indigo-500 text-white'
                                        : isDarkMode
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                扩容方案对比
                            </button>
                        </div>

                        {comparisonView === 'tokens' && (
                            <div className={`p-6 rounded-xl overflow-x-auto ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                                <h2 className="text-xl font-bold mb-4">代币协议综合对比</h2>
                                <table className="w-full text-sm min-w-[800px]">
                                    <thead>
                                        <tr className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <th className="px-3 py-3 text-left font-semibold">协议</th>
                                            <th className="px-3 py-3 text-left font-semibold">发布时间</th>
                                            <th className="px-3 py-3 text-left font-semibold">技术基础</th>
                                            <th className="px-3 py-3 text-left font-semibold">代币绑定</th>
                                            <th className="px-3 py-3 text-left font-semibold">发行方式</th>
                                            <th className="px-3 py-3 text-left font-semibold">主要特点</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tokenProtocols.map((protocol, index) => {
                                            const colors = getColorClasses(protocol.color);
                                            return (
                                                <tr
                                                    key={protocol.name}
                                                    className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} ${index % 2 === 0 ? '' : isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                                                >
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                                                            <span className="font-medium">{protocol.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3 font-mono text-xs">{protocol.year}</td>
                                                    <td className="px-3 py-3">{protocol.tech}</td>
                                                    <td className="px-3 py-3">{protocol.binding}</td>
                                                    <td className="px-3 py-3">{protocol.issuance}</td>
                                                    <td className="px-3 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${colors.light} ${colors.text}`}>
                                                            {protocol.features[0]}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {comparisonView === 'scaling' && (
                            <div className={`p-6 rounded-xl overflow-x-auto ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                                <h2 className="text-xl font-bold mb-4">扩容方案综合对比</h2>
                                <table className="w-full text-sm min-w-[700px]">
                                    <thead>
                                        <tr className={`${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <th className="px-3 py-3 text-left font-semibold">方案</th>
                                            <th className="px-3 py-3 text-left font-semibold">类型</th>
                                            <th className="px-3 py-3 text-left font-semibold">TPS</th>
                                            <th className="px-3 py-3 text-left font-semibold">确认时间</th>
                                            <th className="px-3 py-3 text-left font-semibold">安全模型</th>
                                            <th className="px-3 py-3 text-left font-semibold">状态</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scalingProtocols.map((protocol, index) => {
                                            const colors = getColorClasses(protocol.color);
                                            return (
                                                <tr
                                                    key={protocol.name}
                                                    className={`border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'} ${index % 2 === 0 ? '' : isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}
                                                >
                                                    <td className="px-3 py-3">
                                                        <div className="flex items-center gap-2">
                                                            <div className={`w-2 h-2 rounded-full ${colors.bg}`} />
                                                            <span className="font-medium">{protocol.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-3 py-3">{protocol.type}</td>
                                                    <td className={`px-3 py-3 font-mono ${colors.text}`}>{protocol.tps}</td>
                                                    <td className="px-3 py-3">{protocol.confirmTime}</td>
                                                    <td className="px-3 py-3">{protocol.security}</td>
                                                    <td className="px-3 py-3">
                                                        <span className={`px-2 py-1 rounded text-xs ${colors.light} ${colors.text}`}>
                                                            {protocol.status}
                                                        </span>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* 发展趋势 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h3 className="text-lg font-bold mb-4">生态发展趋势评估</h3>
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {[
                                    { name: 'Ordinals/BRC-20', activity: 5, dev: 5, community: 5, future: 3 },
                                    { name: 'Runes', activity: 4, dev: 5, community: 4, future: 4 },
                                    { name: 'ARC-20', activity: 3, dev: 4, community: 3, future: 3 },
                                    { name: 'Lightning', activity: 5, dev: 5, community: 4, future: 5 },
                                    { name: 'RGB', activity: 2, dev: 3, community: 2, future: 4 },
                                    { name: 'Stacks', activity: 3, dev: 4, community: 3, future: 3 },
                                ].map((item) => (
                                    <div
                                        key={item.name}
                                        className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                                    >
                                        <h4 className="font-semibold mb-3">{item.name}</h4>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>活跃度</span>
                                                <span>{'⭐'.repeat(item.activity)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>开发进度</span>
                                                <span>{'⭐'.repeat(item.dev)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>社区规模</span>
                                                <span>{'⭐'.repeat(item.community)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>长期前景</span>
                                                <span>{'⭐'.repeat(item.future)}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 测验 */}
                {activeTab === 'quiz' && (
                    <Quiz quizData={ecosystemQuiz} />
                )}
            </div>
        </div>
    );
};

export default EcosystemDemo;
