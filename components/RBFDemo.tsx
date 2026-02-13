
import React, { useState, useEffect, useRef } from 'react';
import { TrendingUp, Layers, Clock, AlertTriangle, ArrowUp, RefreshCw, Send, Database, Pickaxe, Zap, CheckCircle2, Flame, AlertCircle, Gauge, MoreHorizontal } from 'lucide-react';
import { useLab } from '../store/LabContext';

interface MempoolTx {
    id: string;
    feeRate: number; // sat/vB
    size: number; // vByte
    isUser: boolean;
    status: 'pending' | 'confirmed' | 'dropped';
    timestamp: number;
    rbfCount: number; // How many times replaced
}

const BLOCK_CAPACITY = 5; // Reduced for better visual clarity on mobile
const MAX_MEMPOOL_SIZE = 15;

const RBFDemo = () => {
    const { isDarkMode } = useLab();
    const [mempool, setMempool] = useState<MempoolTx[]>([]);
    const [lastBlock, setLastBlock] = useState<MempoolTx[]>([]);
    const [miningProgress, setMiningProgress] = useState(0);
    const [userFeeRate, setUserFeeRate] = useState(1);
    const [networkLoad, setNetworkLoad] = useState<'low' | 'high'>('low');
    const [minFeeToEnter, setMinFeeToEnter] = useState(1);
    
    // NPC generator reference
    const npcInterval = useRef<any>(null);

    // --- 1. NPC Traffic Generator ---
    useEffect(() => {
        const intervalTime = networkLoad === 'high' ? 800 : 2500;
        
        npcInterval.current = setInterval(() => {
            setMempool(prev => {
                // If mempool is full, drop lowest fee txs (simulating mempool purge)
                let currentPool = [...prev];
                if (currentPool.length >= MAX_MEMPOOL_SIZE) {
                    // Sort ascending to find victims
                    currentPool.sort((a, b) => a.feeRate - b.feeRate);
                    // Remove lowest ONLY if it's not the user (for better UX, keep user around to show they are stuck)
                    // Or realistically remove user too. Let's keep user for frustration factor but visual clarity.
                    const victimIndex = currentPool.findIndex(tx => !tx.isUser);
                    if (victimIndex !== -1) {
                        currentPool.splice(victimIndex, 1);
                    } else {
                        return prev; // Only user txs left? rare case, stop adding.
                    }
                }

                const baseFee = networkLoad === 'high' ? 12 : 1;
                const variance = networkLoad === 'high' ? 25 : 5;
                
                const newTx: MempoolTx = {
                    id: Math.random().toString(36).substring(2, 6).toUpperCase(),
                    feeRate: Math.max(1, Math.floor(Math.random() * variance) + baseFee),
                    size: 200,
                    isUser: false,
                    status: 'pending',
                    timestamp: Date.now(),
                    rbfCount: 0
                };
                
                // Add and Resort descending
                return [...currentPool, newTx].sort((a, b) => b.feeRate - a.feeRate || a.timestamp - b.timestamp);
            });
        }, intervalTime);

        return () => clearInterval(npcInterval.current);
    }, [networkLoad]);

    // --- 2. Mining Logic ---
    useEffect(() => {
        const mineInterval = setInterval(() => {
            setMiningProgress(prev => {
                if (prev >= 100) {
                    // MINE BLOCK
                    setMempool(currentPool => {
                        const pending = currentPool.filter(tx => tx.status === 'pending');
                        // Sort by Fee Rate Descending
                        pending.sort((a, b) => b.feeRate - a.feeRate);

                        const toMine = pending.slice(0, BLOCK_CAPACITY);
                        const toMineIds = new Set(toMine.map(t => t.id));
                        
                        if (toMine.length > 0) {
                            setLastBlock(toMine.map(t => ({...t, status: 'confirmed'})));
                        }

                        // Remove mined txs from mempool
                        return currentPool.filter(tx => !toMineIds.has(tx.id));
                    });
                    return 0;
                }
                // Mining speed varies slightly
                return prev + (networkLoad === 'high' ? 0.8 : 1.2); 
            });
        }, 50);

        return () => clearInterval(mineInterval);
    }, [networkLoad]);

    // --- 3. Dynamic Fee Estimation ---
    useEffect(() => {
        // Calculate the fee of the transaction at the "edge" of the block
        // Sort current mempool
        const sorted = [...mempool].sort((a,b) => b.feeRate - a.feeRate);
        if (sorted.length >= BLOCK_CAPACITY) {
            setMinFeeToEnter(sorted[BLOCK_CAPACITY - 1].feeRate + 1);
        } else {
            setMinFeeToEnter(1);
        }
    }, [mempool]);

    // --- Actions ---
    const sendTransaction = () => {
        // Remove any existing user tx first (simplified flow)
        setMempool(prev => prev.filter(t => !t.isUser));

        const newTx: MempoolTx = {
            id: 'MY-TX',
            feeRate: userFeeRate,
            size: 200,
            isUser: true,
            status: 'pending',
            timestamp: Date.now(),
            rbfCount: 0
        };
        setMempool(prev => [...prev, newTx].sort((a, b) => b.feeRate - a.feeRate || a.timestamp - b.timestamp));
    };

    const boostTransaction = (oldTx: MempoolTx) => {
        // RBF requires: Fee > OldFee (usually needs to pay for own size + replaced size, simplified here)
        // We boost to minFee + random buffer to ensure jump
        const boostAmount = Math.max(minFeeToEnter - oldTx.feeRate + 2, 5); 
        const newRate = oldTx.feeRate + boostAmount;
        
        const newTx: MempoolTx = {
            ...oldTx,
            feeRate: newRate,
            rbfCount: oldTx.rbfCount + 1,
            timestamp: Date.now() // RBF bumps timestamp effectively in sorting usually
        };
        
        setMempool(prev => {
            const others = prev.filter(t => t.id !== oldTx.id);
            return [...others, newTx].sort((a, b) => b.feeRate - a.feeRate || a.timestamp - b.timestamp);
        });
    };

    const sortedMempool = [...mempool].sort((a,b) => b.feeRate - a.feeRate);
    const userTx = sortedMempool.find(t => t.isUser);
    const userTxPosition = sortedMempool.findIndex(t => t.isUser);
    const isInNextBlock = userTxPosition !== -1 && userTxPosition < BLOCK_CAPACITY;

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-lime-500 text-white p-1.5 rounded-full">
                        <TrendingUp className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">RBF 与 内存池竞价</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
                
                {/* Dashboard Header */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 bg-gradient-to-br from-lime-600 to-green-700 rounded-2xl p-6 text-white shadow-xl flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-2 flex items-center gap-2">
                                <Layers className="w-6 h-6" /> 内存池机制 (Mempool)
                            </h2>
                            <p className="text-lime-100 text-sm leading-relaxed max-w-2xl">
                                区块空间是稀缺商品。矿工也是理性的商人，他们会优先打包出价（Sat/vB）最高的交易。
                                当网络拥堵时，低价交易会被“挤”出公交车。
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3 text-xs font-bold">
                            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
                                <Gauge className="w-4 h-4"/> 建议费率: {minFeeToEnter} sat/vB
                            </div>
                            <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-1 border border-white/20">
                                <Database className="w-4 h-4"/> 区块容量: {BLOCK_CAPACITY} Txs
                            </div>
                        </div>
                    </div>

                    <div className={`p-6 rounded-2xl border flex flex-col justify-center gap-4 shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <div className="flex justify-between items-center">
                            <span className="font-bold text-sm text-slate-500 flex items-center gap-2">
                                <Flame className={`w-4 h-4 ${networkLoad === 'high' ? 'text-red-500' : 'text-slate-400'}`} />
                                网络负载
                            </span>
                            <span className={`text-xs px-2 py-1 rounded font-bold uppercase ${networkLoad === 'high' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                {networkLoad === 'high' ? 'High / 拥堵' : 'Low / 空闲'}
                            </span>
                        </div>
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                            <button 
                                onClick={() => setNetworkLoad('low')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${networkLoad === 'low' ? 'bg-white dark:bg-slate-700 shadow text-green-600' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                空闲 (Low)
                            </button>
                            <button 
                                onClick={() => setNetworkLoad('high')}
                                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${networkLoad === 'high' ? 'bg-white dark:bg-slate-700 shadow text-red-500' : 'text-slate-400 hover:text-slate-600'}`}
                            >
                                拥堵 (High)
                            </button>
                        </div>
                        <div className="text-[10px] text-slate-400 text-center">
                            * 拥堵模式下 NPC 会疯狂发送高价交易
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: User Controls */}
                    <div className={`lg:col-span-4 space-y-6`}>
                        <div className={`p-6 rounded-2xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className="font-bold text-lg flex items-center gap-2 mb-4">
                                <Zap className="w-5 h-5 text-orange-500" /> 发送交易
                            </h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                                        <span>设置费率 (sat/vB)</span>
                                        <span className={userFeeRate >= minFeeToEnter ? 'text-green-500' : 'text-red-500'}>
                                            {userFeeRate >= minFeeToEnter ? '有望入块' : '费率过低'}
                                        </span>
                                    </div>
                                    <input 
                                        type="range" min="1" max="50" value={userFeeRate} 
                                        onChange={(e) => setUserFeeRate(Number(e.target.value))}
                                        className={`w-full h-2 rounded-lg appearance-none cursor-pointer ${userFeeRate >= minFeeToEnter ? 'accent-green-500 bg-green-100' : 'accent-red-500 bg-red-100'}`}
                                    />
                                    <div className="mt-2 flex justify-between items-center">
                                        <div className="font-mono text-2xl font-bold">{userFeeRate}</div>
                                        <button 
                                            onClick={() => setUserFeeRate(minFeeToEnter + 2)}
                                            className="text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded transition-colors"
                                        >
                                            自动设为 {minFeeToEnter + 2}
                                        </button>
                                    </div>
                                </div>

                                {!userTx ? (
                                    <button 
                                        onClick={sendTransaction}
                                        className="w-full py-3 bg-lime-600 hover:bg-lime-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-lg shadow-lime-500/20"
                                    >
                                        <Send className="w-4 h-4" /> 发送交易
                                    </button>
                                ) : (
                                    <div className={`p-4 rounded-xl border-2 ${isInNextBlock ? 'border-green-500 bg-green-50/10' : 'border-red-500 bg-red-50/10'}`}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase opacity-70">交易状态</span>
                                            {isInNextBlock ? 
                                                <span className="text-xs font-bold text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> 即将打包</span> :
                                                <span className="text-xs font-bold text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> 排队中...</span>
                                            }
                                        </div>
                                        <div className="font-mono text-sm mb-4">
                                            当前排名: <span className="font-bold text-lg">#{userTxPosition + 1}</span>
                                        </div>
                                        
                                        {!isInNextBlock && (
                                            <button 
                                                onClick={() => boostTransaction(userTx)}
                                                className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 animate-pulse shadow-orange-500/20 shadow-lg"
                                            >
                                                <ArrowUp className="w-4 h-4" /> 
                                                RBF 加速 (+{Math.max(minFeeToEnter - userTx.feeRate + 2, 5)} sats)
                                            </button>
                                        )}
                                        {isInNextBlock && (
                                            <div className="text-xs text-center text-green-600 font-medium">
                                                坐稳了，等待矿工出块！
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex gap-4 text-xs text-slate-500 px-2 justify-center">
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div> 我
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-slate-400"></div> 别人
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-green-500"></div> 必选
                            </div>
                            <div className="flex items-center gap-1">
                                <div className="w-2 h-2 rounded-full bg-red-500"></div> 滞留
                            </div>
                        </div>
                    </div>

                    {/* Center: The Visual Stack */}
                    <div className="lg:col-span-5">
                        <div className="flex justify-between items-end mb-2">
                            <h3 className="font-bold flex items-center gap-2">
                                <Database className="w-5 h-5 text-indigo-500" /> 
                                内存池队列 ({mempool.length})
                            </h3>
                        </div>

                        <div className={`relative min-h-[500px] rounded-2xl border-2 dark:border-slate-800 p-2 space-y-1 transition-colors ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            
                            {/* The "Bus" Container Visual */}
                            <div className="absolute top-0 left-0 right-0 h-[340px] bg-green-500/5 border-b-2 border-green-500/30 rounded-t-xl pointer-events-none z-0 flex items-start justify-end p-2">
                                <div className="flex items-center gap-2 bg-green-100 text-green-800 px-2 py-1 rounded text-[10px] font-bold shadow-sm">
                                    <CheckCircle2 className="w-3 h-3" />
                                    下个区块 (Capacity: {BLOCK_CAPACITY})
                                </div>
                            </div>

                            {/* Empty State */}
                            {mempool.length === 0 && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                    <Clock className="w-12 h-12 mb-2 opacity-20"/>
                                    <span className="text-sm">内存池空空如也...</span>
                                </div>
                            )}

                            {/* Transaction List */}
                            <div className="relative z-10 space-y-2 pb-10">
                                {sortedMempool.map((tx, index) => {
                                    const inBlock = index < BLOCK_CAPACITY;
                                    return (
                                        <div 
                                            key={tx.id}
                                            className={`
                                                relative flex items-center justify-between p-3 rounded-xl border-2 transition-all duration-500 ease-out
                                                ${tx.isUser 
                                                    ? 'bg-blue-50 border-blue-500 scale-[1.03] shadow-lg z-20' 
                                                    : inBlock 
                                                        ? (isDarkMode ? 'bg-slate-800 border-green-500/30' : 'bg-white border-green-200')
                                                        : (isDarkMode ? 'bg-slate-900 border-slate-800 opacity-60' : 'bg-slate-100 border-slate-200 opacity-60')
                                                }
                                            `}
                                            style={{
                                                top: `${index * 0}px` // For potential future absolute positioning
                                            }}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] text-white shadow-sm ${tx.isUser ? 'bg-blue-500' : 'bg-slate-400'}`}>
                                                    {tx.isUser ? 'ME' : 'NPC'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-xs font-mono font-bold ${tx.isUser ? 'text-blue-600' : 'text-slate-500'}`}>
                                                        {tx.id}
                                                        {tx.rbfCount > 0 && <span className="ml-1 text-[8px] bg-orange-100 text-orange-600 px-1 rounded">RBF x{tx.rbfCount}</span>}
                                                    </span>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-3">
                                                <div className={`text-sm font-black font-mono ${
                                                    tx.feeRate > 40 ? 'text-red-500' : 
                                                    tx.feeRate > 20 ? 'text-orange-500' : 
                                                    'text-green-600'
                                                }`}>
                                                    {tx.feeRate}
                                                </div>
                                                <div className="text-[10px] text-slate-400 font-bold uppercase w-8 text-right">sat/vB</div>
                                            </div>

                                            {/* Rank Indicator */}
                                            <div className="absolute -left-3 top-1/2 -translate-y-1/2 text-[9px] font-bold text-slate-300 w-4 text-right">
                                                {index + 1}
                                            </div>
                                        </div>
                                    );
                                })}
                                
                                {sortedMempool.length > BLOCK_CAPACITY && (
                                    <div className="flex justify-center pt-2">
                                        <MoreHorizontal className="text-slate-300 w-6 h-6 animate-pulse" />
                                    </div>
                                )}
                            </div>

                            {/* Backlog Line Visual */}
                            {mempool.length >= BLOCK_CAPACITY && (
                                <div className="absolute left-0 right-0 border-t-2 border-red-400 border-dashed z-20 pointer-events-none" style={{ top: `${BLOCK_CAPACITY * 70}px` }}>
                                    <div className="absolute right-2 -top-3 bg-red-500 text-white text-[9px] px-2 rounded-full font-bold shadow-sm">
                                        滞留线 (Backlog)
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right: Miner & Blockchain */}
                    <div className="lg:col-span-3 space-y-6">
                        
                        {/* Miner */}
                        <div className={`p-5 rounded-2xl border text-center relative overflow-hidden shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            {miningProgress > 95 && (
                                <div className="absolute inset-0 bg-yellow-400/20 animate-pulse z-0"></div>
                            )}
                            <div className="relative z-10">
                                <Pickaxe className={`w-10 h-10 mx-auto mb-3 transition-transform ${miningProgress > 0 ? 'animate-bounce' : ''} ${miningProgress > 90 ? 'text-green-500' : 'text-slate-400'}`} />
                                <h3 className="font-bold text-sm mb-2 text-slate-500">下个区块倒计时</h3>
                                <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                                    <div 
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-75 ease-linear"
                                        style={{ width: `${miningProgress}%` }}
                                    ></div>
                                </div>
                                <div className="mt-2 text-[10px] text-slate-400 font-mono">
                                    Target: Top {BLOCK_CAPACITY} txs
                                </div>
                            </div>
                        </div>

                        {/* Last Block */}
                        <div className="flex-1">
                            <h3 className="font-bold flex items-center gap-2 mb-4 text-sm text-slate-500">
                                <Clock className="w-4 h-4" /> 区块链 (History)
                            </h3>
                            <div className={`p-4 rounded-2xl border min-h-[300px] ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                {lastBlock.length === 0 ? (
                                    <div className="text-center text-slate-400 text-xs py-10 opacity-50">
                                        Waiting for block #840001...
                                    </div>
                                ) : (
                                    <div className="space-y-3 animate-in fade-in slide-in-from-top-4">
                                        <div className="text-center text-xs font-bold text-green-700 bg-green-100 border border-green-200 rounded py-1 mb-2">
                                            Block #840001 Found!
                                        </div>
                                        {lastBlock.map(tx => (
                                            <div key={tx.id} className={`flex justify-between items-center text-xs border-b pb-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} ${tx.isUser ? 'bg-blue-500/10 p-1 rounded' : ''}`}>
                                                <span className={`font-mono ${tx.isUser ? 'text-blue-500 font-bold' : 'text-slate-500'}`}>{tx.id}</span>
                                                <span className="font-bold text-slate-400">{tx.feeRate} sat</span>
                                            </div>
                                        ))}
                                        <div className="pt-2 text-center text-[10px] text-slate-400">
                                            Total Fees: {lastBlock.reduce((acc, t) => acc + t.feeRate * t.size, 0).toLocaleString()} sats
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                </div>
            </main>
        </div>
    );
};

export default RBFDemo;
