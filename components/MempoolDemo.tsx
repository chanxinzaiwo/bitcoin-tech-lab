import React, { useState, useEffect, useCallback } from 'react';
import {
    Layers, Clock, TrendingUp, ArrowRight, Zap, AlertCircle,
    RefreshCw, DollarSign, Package, Activity, Filter, Play, Pause
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';

// Types
interface MempoolTransaction {
    id: string;
    hash: string;
    size: number; // vBytes
    fee: number; // satoshis
    feeRate: number; // sat/vB
    inputs: number;
    outputs: number;
    timestamp: number;
    status: 'pending' | 'confirming' | 'confirmed' | 'replaced';
    rbfEnabled: boolean;
}

interface Block {
    height: number;
    transactions: MempoolTransaction[];
    totalFees: number;
    minFeeRate: number;
}

const MempoolDemo = () => {
    const { isDarkMode } = useLab();
    const toast = useToast();

    // State
    const [mempool, setMempool] = useState<MempoolTransaction[]>([]);
    const [blocks, setBlocks] = useState<Block[]>([]);
    const [isSimulating, setIsSimulating] = useState(false);
    const [blockInterval, setBlockInterval] = useState(10000); // 10 seconds for demo
    const [selectedTx, setSelectedTx] = useState<MempoolTransaction | null>(null);
    const [userTx, setUserTx] = useState<MempoolTransaction | null>(null);
    const [userFeeRate, setUserFeeRate] = useState(10);
    const [showRbfDemo, setShowRbfDemo] = useState(false);

    // Fee rate buckets for visualization
    const feeRateBuckets = [
        { min: 100, label: '高优先级', color: 'bg-red-500' },
        { min: 50, label: '中优先级', color: 'bg-orange-500' },
        { min: 20, label: '低优先级', color: 'bg-yellow-500' },
        { min: 1, label: '经济型', color: 'bg-green-500' },
    ];

    // Generate random transaction
    const generateTransaction = useCallback((): MempoolTransaction => {
        const size = Math.floor(Math.random() * 500) + 150; // 150-650 vBytes
        const feeRate = Math.floor(Math.random() * 150) + 1; // 1-150 sat/vB
        return {
            id: Math.random().toString(36).substring(2, 10),
            hash: Math.random().toString(36).substring(2, 18),
            size,
            fee: size * feeRate,
            feeRate,
            inputs: Math.floor(Math.random() * 3) + 1,
            outputs: Math.floor(Math.random() * 3) + 1,
            timestamp: Date.now(),
            status: 'pending',
            rbfEnabled: Math.random() > 0.5,
        };
    }, []);

    // Initialize mempool
    useEffect(() => {
        const initialTxs = Array.from({ length: 50 }, generateTransaction);
        setMempool(initialTxs);
    }, [generateTransaction]);

    // Simulation loop - add new transactions
    useEffect(() => {
        if (!isSimulating) return;

        const addTxInterval = setInterval(() => {
            setMempool(prev => {
                const newTx = generateTransaction();
                return [...prev, newTx].slice(-200); // Keep max 200 txs
            });
        }, 500);

        return () => clearInterval(addTxInterval);
    }, [isSimulating, generateTransaction]);

    // Block mining simulation
    useEffect(() => {
        if (!isSimulating) return;

        const mineBlock = setInterval(() => {
            setMempool(prev => {
                // Sort by fee rate (highest first)
                const sorted = [...prev].sort((a, b) => b.feeRate - a.feeRate);

                // Take transactions that fit in ~1MB block (simplified)
                let blockSize = 0;
                const maxBlockSize = 1000000; // 1 MB
                const blockTxs: MempoolTransaction[] = [];
                const remaining: MempoolTransaction[] = [];

                for (const tx of sorted) {
                    if (blockSize + tx.size <= maxBlockSize && blockTxs.length < 2000) {
                        blockTxs.push({ ...tx, status: 'confirmed' });
                        blockSize += tx.size;
                    } else {
                        remaining.push(tx);
                    }
                }

                if (blockTxs.length > 0) {
                    const newBlock: Block = {
                        height: blocks.length + 800000,
                        transactions: blockTxs,
                        totalFees: blockTxs.reduce((sum, tx) => sum + tx.fee, 0),
                        minFeeRate: Math.min(...blockTxs.map(tx => tx.feeRate)),
                    };

                    setBlocks(prev => [...prev.slice(-5), newBlock]);

                    // Check if user's tx was confirmed
                    if (userTx && blockTxs.some(tx => tx.id === userTx.id)) {
                        toast.success('交易已确认！', `你的交易已被打包到区块 #${newBlock.height}`);
                        setUserTx(null);
                    }
                }

                return remaining;
            });
        }, blockInterval);

        return () => clearInterval(mineBlock);
    }, [isSimulating, blockInterval, blocks.length, userTx, toast]);

    // Submit user transaction
    const submitUserTx = () => {
        const tx: MempoolTransaction = {
            id: 'user-' + Date.now(),
            hash: 'user' + Math.random().toString(36).substring(2, 14),
            size: 250,
            fee: 250 * userFeeRate,
            feeRate: userFeeRate,
            inputs: 1,
            outputs: 2,
            timestamp: Date.now(),
            status: 'pending',
            rbfEnabled: true,
        };
        setUserTx(tx);
        setMempool(prev => [...prev, tx]);
        toast.info('交易已广播', '你的交易已进入内存池，等待矿工打包');
    };

    // RBF - Replace By Fee
    const replaceByFee = () => {
        if (!userTx) return;

        const newFeeRate = userFeeRate + 20;
        setUserFeeRate(newFeeRate);

        setMempool(prev => {
            const filtered = prev.filter(tx => tx.id !== userTx.id);
            const newTx: MempoolTransaction = {
                ...userTx,
                id: 'user-rbf-' + Date.now(),
                fee: 250 * newFeeRate,
                feeRate: newFeeRate,
                status: 'pending',
            };
            setUserTx(newTx);
            return [...filtered, newTx];
        });

        toast.success('RBF 成功', `手续费已提高到 ${newFeeRate} sat/vB`);
    };

    // Get fee rate distribution
    const getFeeDistribution = () => {
        const distribution = feeRateBuckets.map(bucket => ({
            ...bucket,
            count: mempool.filter(tx => tx.feeRate >= bucket.min &&
                (bucket.min === 100 || tx.feeRate < feeRateBuckets[feeRateBuckets.indexOf(bucket) - 1]?.min || bucket.min === 100)
            ).length,
        }));
        return distribution;
    };

    // Calculate estimated confirmation time
    const getEstimatedBlocks = (feeRate: number): string => {
        const position = mempool.filter(tx => tx.feeRate > feeRate).length;
        const blocksNeeded = Math.ceil(position / 2000) + 1;
        if (blocksNeeded <= 1) return '下一区块';
        if (blocksNeeded <= 3) return `约 ${blocksNeeded} 个区块`;
        if (blocksNeeded <= 6) return '约 1 小时';
        return '可能需要较长时间';
    };

    // Stats
    const avgFeeRate = mempool.length > 0
        ? Math.round(mempool.reduce((sum, tx) => sum + tx.feeRate, 0) / mempool.length)
        : 0;
    const totalSize = mempool.reduce((sum, tx) => sum + tx.size, 0);

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Navigation */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-purple-600 text-white p-1.5 rounded-full">
                        <Layers className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">内存池 (Mempool) 演示</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">

                {/* Intro */}
                <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <Activity className="w-8 h-8" /> 比特币内存池
                    </h2>
                    <p className="text-purple-100 text-lg leading-relaxed max-w-3xl">
                        内存池是未确认交易的"等候室"。当你广播一笔交易时，它首先进入节点的内存池，
                        矿工从中选择手续费率最高的交易打包到区块中。理解内存池可以帮助你选择合适的手续费。
                    </p>
                </div>

                {/* Control Panel */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => setIsSimulating(!isSimulating)}
                                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                                    isSimulating
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : 'bg-purple-600 hover:bg-purple-700 text-white'
                                }`}
                            >
                                {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                {isSimulating ? '暂停模拟' : '开始模拟'}
                            </button>
                            <button
                                onClick={() => {
                                    setMempool(Array.from({ length: 50 }, generateTransaction));
                                    setBlocks([]);
                                    setUserTx(null);
                                }}
                                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-colors ${
                                    isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                            >
                                <RefreshCw className="w-4 h-4" /> 重置
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6 text-sm">
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {mempool.length}
                                </div>
                                <div className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>待确认交易</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {avgFeeRate}
                                </div>
                                <div className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>平均费率 sat/vB</div>
                            </div>
                            <div className="text-center">
                                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {(totalSize / 1000000).toFixed(2)}
                                </div>
                                <div className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>总大小 MB</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Grid */}
                <div className="grid lg:grid-cols-3 gap-6">

                    {/* Mempool Visualization */}
                    <div className={`lg:col-span-2 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <Package className="w-5 h-5 text-purple-500" /> 内存池交易
                        </h3>

                        {/* Fee Rate Distribution Bar */}
                        <div className="mb-4">
                            <div className="flex h-8 rounded-lg overflow-hidden">
                                {feeRateBuckets.map((bucket, i) => {
                                    const count = mempool.filter(tx => {
                                        if (i === 0) return tx.feeRate >= bucket.min;
                                        return tx.feeRate >= bucket.min && tx.feeRate < feeRateBuckets[i - 1].min;
                                    }).length;
                                    const percentage = mempool.length > 0 ? (count / mempool.length) * 100 : 0;
                                    return (
                                        <div
                                            key={bucket.label}
                                            className={`${bucket.color} flex items-center justify-center text-xs font-bold text-white transition-all duration-300`}
                                            style={{ width: `${Math.max(percentage, 5)}%` }}
                                            title={`${bucket.label}: ${count} 笔`}
                                        >
                                            {count > 0 && count}
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex justify-between mt-2 text-xs">
                                {feeRateBuckets.map(bucket => (
                                    <span key={bucket.label} className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
                                        {bucket.label} (≥{bucket.min})
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Transaction Grid */}
                        <div className="grid grid-cols-10 gap-1 max-h-[300px] overflow-y-auto p-2">
                            {mempool.slice(0, 100).map(tx => {
                                const isUserTx = userTx?.id === tx.id;
                                let bgColor = 'bg-slate-600';
                                if (tx.feeRate >= 100) bgColor = 'bg-red-500';
                                else if (tx.feeRate >= 50) bgColor = 'bg-orange-500';
                                else if (tx.feeRate >= 20) bgColor = 'bg-yellow-500';
                                else bgColor = 'bg-green-500';

                                return (
                                    <div
                                        key={tx.id}
                                        onClick={() => setSelectedTx(tx)}
                                        className={`w-full aspect-square rounded cursor-pointer transition-all hover:scale-110 ${bgColor} ${
                                            isUserTx ? 'ring-2 ring-white animate-pulse' : ''
                                        } ${selectedTx?.id === tx.id ? 'ring-2 ring-blue-500' : ''}`}
                                        title={`${tx.feeRate} sat/vB`}
                                    />
                                );
                            })}
                        </div>

                        {mempool.length > 100 && (
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                显示前 100 笔交易（共 {mempool.length} 笔）
                            </p>
                        )}
                    </div>

                    {/* Right Panel */}
                    <div className="space-y-6">
                        {/* User Transaction Panel */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Zap className="w-5 h-5 text-yellow-500" /> 发送交易
                            </h3>

                            {!userTx ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            手续费率 (sat/vB)
                                        </label>
                                        <input
                                            type="range"
                                            min="1"
                                            max="150"
                                            value={userFeeRate}
                                            onChange={(e) => setUserFeeRate(Number(e.target.value))}
                                            className="w-full mt-2 accent-purple-500"
                                        />
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>1</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {userFeeRate} sat/vB
                                            </span>
                                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>150</span>
                                        </div>
                                    </div>

                                    <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>预估手续费</span>
                                            <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {(250 * userFeeRate).toLocaleString()} sats
                                            </span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>预估确认</span>
                                            <span className={`font-medium ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>
                                                {getEstimatedBlocks(userFeeRate)}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={submitUserTx}
                                        disabled={!isSimulating}
                                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
                                    >
                                        广播交易
                                    </button>
                                    {!isSimulating && (
                                        <p className={`text-xs text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            请先开始模拟
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <div className={`p-4 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-purple-500/50 bg-purple-500/10' : 'border-purple-500/50 bg-purple-50'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Clock className="w-4 h-4 text-purple-500 animate-spin" />
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                等待确认中...
                                            </span>
                                        </div>
                                        <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <p>费率: {userTx.feeRate} sat/vB</p>
                                            <p>费用: {userTx.fee.toLocaleString()} sats</p>
                                            <p>队列位置: #{mempool.filter(tx => tx.feeRate > userTx.feeRate).length + 1}</p>
                                        </div>
                                    </div>

                                    <button
                                        onClick={replaceByFee}
                                        className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        <TrendingUp className="w-4 h-4" /> RBF 提高手续费
                                    </button>
                                    <p className={`text-xs text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        Replace-By-Fee: 用更高费率的新交易替换旧交易
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Selected Transaction Details */}
                        {selectedTx && (
                            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    交易详情
                                </h3>
                                <div className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <p><span className="font-medium">Hash:</span> {selectedTx.hash}...</p>
                                    <p><span className="font-medium">大小:</span> {selectedTx.size} vBytes</p>
                                    <p><span className="font-medium">费率:</span> {selectedTx.feeRate} sat/vB</p>
                                    <p><span className="font-medium">总费用:</span> {selectedTx.fee.toLocaleString()} sats</p>
                                    <p><span className="font-medium">输入:</span> {selectedTx.inputs}</p>
                                    <p><span className="font-medium">输出:</span> {selectedTx.outputs}</p>
                                    <p><span className="font-medium">RBF:</span> {selectedTx.rbfEnabled ? '已启用' : '未启用'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Blocks */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Package className="w-5 h-5 text-emerald-500" /> 最近区块
                    </h3>

                    {blocks.length === 0 ? (
                        <p className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                            等待第一个区块被挖出...
                        </p>
                    ) : (
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {blocks.map((block, i) => (
                                <div
                                    key={block.height}
                                    className={`flex-shrink-0 w-48 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                                            <Package className="w-4 h-4 text-white" />
                                        </div>
                                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            #{block.height}
                                        </span>
                                    </div>
                                    <div className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <p>{block.transactions.length} 笔交易</p>
                                        <p>{(block.totalFees / 100000000).toFixed(4)} BTC 费用</p>
                                        <p>最低费率: {block.minFeeRate} sat/vB</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Educational Content */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <AlertCircle className="w-5 h-5 text-blue-500" /> 内存池知识点
                    </h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div>
                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                费用市场机制
                            </h4>
                            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• 矿工按费率（sat/vB）而非总费用排序交易</li>
                                <li>• 费率 = 总手续费 ÷ 交易大小（虚拟字节）</li>
                                <li>• 区块空间有限，高费率交易优先打包</li>
                                <li>• 网络拥堵时，低费率交易可能等待数小时甚至数天</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                交易加速方法
                            </h4>
                            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• <strong>RBF (Replace-By-Fee):</strong> 用更高费率的新交易替换旧交易</li>
                                <li>• <strong>CPFP (Child-Pays-For-Parent):</strong> 创建花费该交易输出的子交易，用高费率"拉"父交易</li>
                                <li>• RBF 需要交易启用 RBF 标志（大多数钱包默认启用）</li>
                                <li>• CPFP 需要你能花费该交易的某个输出</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                费率选择建议
                            </h4>
                            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• <strong>紧急交易:</strong> 参考当前最高费率区间</li>
                                <li>• <strong>1小时内确认:</strong> 中等费率</li>
                                <li>• <strong>不着急:</strong> 可以选择低费率，等待网络空闲</li>
                                <li>• 建议使用 mempool.space 查看实时费率</li>
                            </ul>
                        </div>

                        <div>
                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                内存池特点
                            </h4>
                            <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• 每个节点的内存池可能不同（交易传播有延迟）</li>
                                <li>• 默认内存池大小上限 300MB</li>
                                <li>• 超过上限时，最低费率交易会被清除</li>
                                <li>• 未确认交易默认 2 周后过期</li>
                            </ul>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default MempoolDemo;
