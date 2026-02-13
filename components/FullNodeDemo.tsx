import React, { useState, useEffect } from 'react';
import {
    Server, Shield, Download, CheckCircle, Clock, HardDrive,
    Wifi, Eye, Lock, Users, AlertCircle, Play, Pause, RefreshCw
} from 'lucide-react';
import { useLab } from '../store/LabContext';

const FullNodeDemo = () => {
    const { isDarkMode } = useLab();

    const [activeTab, setActiveTab] = useState<'why' | 'sync' | 'verify'>('why');
    const [isSyncing, setIsSyncing] = useState(false);
    const [syncProgress, setSyncProgress] = useState(0);
    const [blocksVerified, setBlocksVerified] = useState(0);
    const [currentPhase, setCurrentPhase] = useState<'headers' | 'blocks' | 'verify'>('headers');

    // Sync simulation
    useEffect(() => {
        if (!isSyncing) return;

        const interval = setInterval(() => {
            setSyncProgress(prev => {
                if (prev >= 100) {
                    setIsSyncing(false);
                    return 100;
                }

                // Update phase based on progress
                if (prev < 10) setCurrentPhase('headers');
                else if (prev < 90) setCurrentPhase('blocks');
                else setCurrentPhase('verify');

                setBlocksVerified(Math.floor((prev / 100) * 840000));
                return prev + 0.5;
            });
        }, 100);

        return () => clearInterval(interval);
    }, [isSyncing]);

    const resetSync = () => {
        setSyncProgress(0);
        setBlocksVerified(0);
        setCurrentPhase('headers');
        setIsSyncing(false);
    };

    const nodeTypes = [
        {
            name: 'Bitcoin Core',
            desc: '官方参考实现，功能最完整',
            disk: '~600 GB',
            ram: '2 GB+',
            features: ['完整验证', 'RPC 接口', '钱包功能'],
        },
        {
            name: 'Bitcoin Core (Pruned)',
            desc: '修剪模式，只保留最近区块',
            disk: '~10 GB',
            ram: '2 GB+',
            features: ['完整验证', '节省空间', '无历史查询'],
        },
        {
            name: 'btcd',
            desc: 'Go 语言实现，适合开发',
            disk: '~600 GB',
            ram: '2 GB+',
            features: ['完整验证', 'Go API', '无钱包'],
        },
        {
            name: 'Umbrel / RaspiBlitz',
            desc: '一体化节点解决方案',
            disk: '~1 TB',
            ram: '4 GB+',
            features: ['图形界面', '闪电网络', '应用商店'],
        },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Navigation */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-cyan-600 text-white p-1.5 rounded-full">
                        <Server className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">运行全节点</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">

                {/* Intro */}
                <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <Server className="w-8 h-8" /> 比特币全节点
                    </h2>
                    <p className="text-cyan-100 text-lg leading-relaxed max-w-3xl">
                        全节点是比特币网络的骨干。它独立验证每一笔交易和每一个区块，不依赖任何第三方。
                        运行全节点是参与比特币网络、保护自己隐私的最佳方式。
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap gap-2">
                    {[
                        { id: 'why', label: '为什么运行', icon: Shield },
                        { id: 'sync', label: '同步过程', icon: Download },
                        { id: 'verify', label: '验证规则', icon: CheckCircle },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-cyan-500 text-white'
                                    : isDarkMode
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Why Tab */}
                {activeTab === 'why' && (
                    <div className="space-y-6">
                        {/* Benefits */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                运行全节点的好处
                            </h3>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Shield className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        自主验证
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        独立验证所有交易，无需信任任何第三方。"Don't trust, verify"
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Eye className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        完全隐私
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        无需向外部服务器查询你的地址余额，保护财务隐私
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Users className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        支持网络
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        为其他节点和 SPV 钱包提供数据，增强网络去中心化
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Lock className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        规则执行
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        参与共识规则的执行，拒绝任何违规区块
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Wifi className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        闪电网络
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        运行闪电网络节点需要全节点作为基础
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Clock className="w-8 h-8 text-cyan-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        即时确认
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        第一时间收到新区块，验证你的交易
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Node Types */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                节点软件选择
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                {nodeTypes.map((node, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-slate-50'}`}>
                                        <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {node.name}
                                        </h4>
                                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            {node.desc}
                                        </p>
                                        <div className="flex flex-wrap gap-4 text-xs mb-2">
                                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
                                                <HardDrive className="w-3 h-3 inline mr-1" />
                                                {node.disk}
                                            </span>
                                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
                                                RAM: {node.ram}
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {node.features.map((f, j) => (
                                                <span key={j} className={`px-2 py-0.5 rounded-full text-xs ${isDarkMode ? 'bg-cyan-500/20 text-cyan-400' : 'bg-cyan-100 text-cyan-700'}`}>
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Full Node vs SPV */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                全节点 vs SPV 钱包
                            </h3>

                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                            <th className="text-left p-2">特性</th>
                                            <th className="text-center p-2">全节点</th>
                                            <th className="text-center p-2">SPV 钱包</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                        <tr className={isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'}>
                                            <td className="p-2">验证方式</td>
                                            <td className="text-center p-2">
                                                <span className="text-emerald-500">完整验证所有规则</span>
                                            </td>
                                            <td className="text-center p-2">
                                                <span className="text-yellow-500">只验证区块头</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'}>
                                            <td className="p-2">隐私性</td>
                                            <td className="text-center p-2">
                                                <span className="text-emerald-500">高（本地查询）</span>
                                            </td>
                                            <td className="text-center p-2">
                                                <span className="text-red-500">低（暴露地址）</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'}>
                                            <td className="p-2">信任要求</td>
                                            <td className="text-center p-2">
                                                <span className="text-emerald-500">无需信任</span>
                                            </td>
                                            <td className="text-center p-2">
                                                <span className="text-yellow-500">信任连接的节点</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'}>
                                            <td className="p-2">存储需求</td>
                                            <td className="text-center p-2">
                                                <span className="text-yellow-500">~600 GB</span>
                                            </td>
                                            <td className="text-center p-2">
                                                <span className="text-emerald-500">~100 MB</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-200'}>
                                            <td className="p-2">初始同步</td>
                                            <td className="text-center p-2">
                                                <span className="text-yellow-500">数小时到数天</span>
                                            </td>
                                            <td className="text-center p-2">
                                                <span className="text-emerald-500">几分钟</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sync Tab */}
                {activeTab === 'sync' && (
                    <div className="space-y-6">
                        {/* Sync Simulation */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Download className="w-5 h-5 text-cyan-500" /> 初始区块下载 (IBD) 模拟
                            </h3>

                            <div className="flex gap-4 mb-6">
                                <button
                                    onClick={() => setIsSyncing(!isSyncing)}
                                    disabled={syncProgress >= 100}
                                    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                                        isSyncing
                                            ? 'bg-red-500 hover:bg-red-600 text-white'
                                            : 'bg-cyan-500 hover:bg-cyan-600 text-white'
                                    } disabled:opacity-50`}
                                >
                                    {isSyncing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isSyncing ? '暂停' : syncProgress >= 100 ? '已完成' : '开始同步'}
                                </button>
                                <button
                                    onClick={resetSync}
                                    className={`px-4 py-2.5 rounded-xl font-medium ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'}`}
                                >
                                    <RefreshCw className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Progress */}
                            <div className="space-y-4">
                                {/* Phase indicator */}
                                <div className="flex justify-between mb-2">
                                    {['headers', 'blocks', 'verify'].map((phase, i) => (
                                        <div key={phase} className="flex items-center gap-2">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                currentPhase === phase
                                                    ? 'bg-cyan-500 text-white'
                                                    : syncProgress > (i === 0 ? 10 : i === 1 ? 90 : 100)
                                                    ? 'bg-emerald-500 text-white'
                                                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                                {i + 1}
                                            </div>
                                            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                {phase === 'headers' ? '下载区块头' : phase === 'blocks' ? '下载区块' : '验证完成'}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                {/* Progress bar */}
                                <div className={`h-6 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 transition-all duration-300 flex items-center justify-center"
                                        style={{ width: `${syncProgress}%` }}
                                    >
                                        {syncProgress > 10 && (
                                            <span className="text-white text-xs font-bold">
                                                {syncProgress.toFixed(1)}%
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {blocksVerified.toLocaleString()}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            已验证区块
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {((syncProgress / 100) * 600).toFixed(0)}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            已下载 GB
                                        </div>
                                    </div>
                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {((blocksVerified / 840000) * 900000000).toFixed(0)}
                                        </div>
                                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            已验证交易
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sync Process Explanation */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                同步过程详解
                            </h3>

                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        1. 下载区块头 (~50 MB)
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        首先下载所有区块头（每个 80 字节），验证工作量证明链，找到最长有效链。
                                        这一步很快，几分钟即可完成。
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        2. 下载完整区块 (~600 GB)
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        按顺序下载每个区块的完整数据，包括所有交易。这是最耗时的部分，
                                        取决于网络带宽和存储速度。可以从多个节点并行下载。
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        3. 验证每笔交易
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        对每笔交易执行完整验证：检查签名、确认 UTXO 存在且未花费、
                                        验证脚本执行结果、检查金额不超支。这一步 CPU 密集。
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        4. 构建 UTXO 集
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        维护当前所有未花费输出的集合（约 5GB）。这个集合用于快速验证新交易，
                                        是节点运行时最重要的数据结构。
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <AlertCircle className="w-5 h-5 text-cyan-500" /> 加速同步技巧
                            </h3>

                            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• 使用 SSD 而非 HDD，可将同步时间从数天缩短到数小时</li>
                                <li>• 增加 dbcache 参数（如 -dbcache=4000）使用更多内存加速验证</li>
                                <li>• 使用 assumevalid 参数跳过旧区块的签名验证（默认启用）</li>
                                <li>• 确保网络带宽充足，避免成为瓶颈</li>
                                <li>• 使用有线网络连接，比 WiFi 更稳定</li>
                                <li>• 考虑使用 Pruned 模式，只需约 10GB 存储空间</li>
                            </ul>
                        </div>
                    </div>
                )}

                {/* Verify Tab */}
                {activeTab === 'verify' && (
                    <div className="space-y-6">
                        {/* Verification Rules */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <CheckCircle className="w-5 h-5 text-cyan-500" /> 全节点验证的规则
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 text-emerald-500`}>区块级验证</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 区块哈希满足难度目标</li>
                                        <li>• 时间戳在合理范围内</li>
                                        <li>• 区块大小不超过限制</li>
                                        <li>• 默克尔根与交易列表匹配</li>
                                        <li>• Coinbase 奖励不超过允许值</li>
                                        <li>• 正确引用前一区块</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 text-emerald-500`}>交易级验证</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 所有输入的 UTXO 存在且未花费</li>
                                        <li>• 输入总额 ≥ 输出总额</li>
                                        <li>• 所有签名有效</li>
                                        <li>• 脚本执行成功</li>
                                        <li>• 交易格式正确</li>
                                        <li>• 时间锁已解锁（如有）</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 text-emerald-500`}>共识规则</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 遵循最重链（最多累积工作量）</li>
                                        <li>• 难度每 2016 块调整一次</li>
                                        <li>• 遵循软分叉激活规则</li>
                                        <li>• SegWit 交易格式正确</li>
                                        <li>• Taproot 验证规则（如有）</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-2 text-emerald-500`}>网络规则</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 交易不在黑名单中</li>
                                        <li>• 费率满足最低要求</li>
                                        <li>• 交易大小在限制内</li>
                                        <li>• 不是双花交易</li>
                                        <li>• 遵循标准交易规则</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Why This Matters */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                为什么验证很重要？
                            </h3>

                            <div className="space-y-4">
                                <div className={`p-4 rounded-xl bg-red-500/10 border border-red-500/30`}>
                                    <h4 className="font-bold mb-2 text-red-500">如果不验证...</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 恶意节点可能给你发送假交易</li>
                                        <li>• 你可能接受无效的区块</li>
                                        <li>• 矿工可能偷偷增发比特币</li>
                                        <li>• 你无法确定收到的币是真的</li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30`}>
                                    <h4 className="font-bold mb-2 text-emerald-500">运行全节点后...</h4>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 你亲自验证了每一笔交易</li>
                                        <li>• 你确信 2100 万上限被遵守</li>
                                        <li>• 你参与了共识规则的执行</li>
                                        <li>• 你是比特币网络的一部分</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* UASF Story */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                用户激活软分叉 (UASF) 的故事
                            </h3>

                            <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                2017 年，矿工拒绝激活 SegWit。社区发起 UASF（BIP-148），全节点用户宣布：
                                从某一天起，我们的节点将拒绝不支持 SegWit 的区块。
                            </p>
                            <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                面对用户的决心，矿工最终妥协，SegWit 成功激活。这证明了：
                            </p>
                            <div className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-50'}`}>
                                <p className={`font-bold text-lg ${isDarkMode ? 'text-cyan-400' : 'text-cyan-700'}`}>
                                    "运行全节点的用户，才是比特币的最终裁决者"
                                </p>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default FullNodeDemo;
