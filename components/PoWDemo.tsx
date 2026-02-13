
import React, { useState, useEffect } from 'react';
import { Pickaxe, RefreshCw, CheckCircle2, XCircle, ArrowRight, ArrowDown, Settings, Clock, Activity, Layers, Database, GitCommit, Plus, Minus, Zap, ChevronRight, Gauge } from 'lucide-react';
import { computeSHA256, computeMerkleTree } from '../utils/crypto-math';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';

// ... (Existing Imports and Interfaces)
interface BlockData {
    id: number;
    nonce: number;
    data: string;
    prev: string;
    hash: string;
}

// ... (Keep DifficultySelector, StatBadge, BlockCard, BlockStructureViz as they were, assume they are present in the file context)
// Re-implementing subcomponents to ensure the file is complete and correct.

const DifficultySelector = ({ value, onChange, disabled, isDarkMode }: { value: number, onChange: (v: number) => void, disabled?: boolean, isDarkMode: boolean }) => (
    <div className={`flex items-center gap-3 p-3 rounded-lg border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
        <div className={`flex items-center gap-2 font-bold text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            <Settings className="w-4 h-4" />
            <span>挖矿难度:</span>
        </div>
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(level => (
                <button
                    key={level}
                    onClick={() => onChange(level)}
                    disabled={disabled}
                    className={`w-8 h-8 rounded-md font-bold text-sm transition-all ${
                        value === level 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : (isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-100')
                    } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {level}
                </button>
            ))}
        </div>
        <div className="text-xs text-slate-500 ml-auto hidden sm:block">
            需匹配前 {value} 个零
        </div>
    </div>
);

const StatBadge = ({ icon: Icon, label, value, color, isDarkMode }: any) => (
    <div className="flex flex-col items-center p-2 min-w-[80px]">
        <div className={`flex items-center gap-1 text-xs font-bold ${color} mb-1`}>
            <Icon className="w-3 h-3" /> {label}
        </div>
        <div className={`text-sm font-mono font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>{value}</div>
    </div>
);

const BlockCard = ({ 
    id, data, nonce, prevHash, hash, difficulty,
    onDataChange, onNonceChange, onMine, isMining, miningStats, isChain = false, isDarkMode
}: any) => {
    const targetPrefix = "0".repeat(difficulty);
    const isValid = hash.startsWith(targetPrefix);

    return (
        <div className={`relative p-6 rounded-2xl border-2 transition-all duration-300 shadow-sm w-full max-w-lg mx-auto ${
            isValid 
            ? (isDarkMode ? 'bg-slate-900 border-emerald-900 ring-2 ring-emerald-900/50' : 'bg-white border-emerald-200 ring-2 ring-emerald-50') 
            : (isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200')
        }`}>
            <div className={`absolute top-0 left-0 w-full h-1.5 rounded-t-xl ${isValid ? 'bg-emerald-500' : 'bg-red-500'}`} />

            <div className="space-y-4 pt-2">
                <div className={`flex items-center justify-between border-b pb-3 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                    <h3 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        区块 #{id}
                    </h3>
                    {isValid ? (
                        <span className="flex items-center gap-1 text-xs font-bold bg-emerald-500/10 text-emerald-600 px-2 py-1 rounded-full border border-emerald-500/20">
                            <CheckCircle2 className="w-3 h-3" /> 有效
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-xs font-bold bg-red-500/10 text-red-600 px-2 py-1 rounded-full border border-red-500/20">
                            <XCircle className="w-3 h-3" /> 无效
                        </span>
                    )}
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">数据 (Data)</label>
                        <textarea 
                            value={data}
                            onChange={(e) => onDataChange(e.target.value)}
                            className={`w-full border rounded-lg p-3 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all h-20 resize-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            placeholder="输入交易数据..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">随机数 (Nonce)</label>
                            <input 
                                type="number"
                                value={nonce}
                                onChange={(e) => onNonceChange(parseInt(e.target.value) || 0)}
                                className={`w-full border rounded-lg p-2 text-sm font-mono focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            />
                        </div>
                        <div className="flex items-end">
                            <button
                                onClick={onMine}
                                disabled={isMining || isValid}
                                className={`w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${
                                    isMining ? 'bg-slate-100 text-slate-400 cursor-wait' :
                                    isValid ? 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default' :
                                    'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-500/30'
                                }`}
                            >
                                {isMining ? <RefreshCw className="w-4 h-4 animate-spin" /> : isValid ? <CheckCircle2 className="w-4 h-4" /> : <Pickaxe className="w-4 h-4" />}
                                {isMining ? '计算中...' : isValid ? '已挖出' : '开始挖矿'}
                            </button>
                        </div>
                    </div>

                    {isChain && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">前块哈希 (Prev Hash)</label>
                            <div className={`border rounded px-3 py-2 text-xs font-mono text-slate-500 truncate ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                {prevHash}
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 block">当前哈希 (Hash)</label>
                        <div className={`rounded-lg px-3 py-2 text-xs font-mono truncate transition-colors duration-300 border ${isValid ? (isDarkMode ? 'bg-emerald-950/30 text-emerald-500 border-emerald-900' : 'bg-emerald-50 text-emerald-700 border-emerald-200') : (isDarkMode ? 'bg-red-950/30 text-red-500 border-red-900' : 'bg-red-50 text-red-700 border-red-200')}`}>
                            <span className="font-bold">{hash.substring(0, difficulty)}</span>
                            <span className="opacity-70">{hash.substring(difficulty)}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1 text-right flex justify-end gap-2">
                             {miningStats && (
                                 <span className="font-mono text-orange-600">{miningStats.attempts} hashes in {miningStats.time}s ({miningStats.rate} H/s)</span>
                             )}
                             <span>Target: {difficulty} zeros</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const BlockStructureViz = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [txs, setTxs] = useState([
        { id: 1, from: "Coinbase", to: "Miner", amount: 3.125, isCoinbase: true },
        { id: 2, from: "Alice", to: "Bob", amount: 10.00 },
        { id: 3, from: "Charlie", to: "Dave", amount: 0.55 },
        { id: 4, from: "Eve", to: "Mallory", amount: 2.10 },
    ]);

    const [nonce, setNonce] = useState(8848);
    const [merkleRoot, setMerkleRoot] = useState("");
    const [headerHash, setHeaderHash] = useState("");
    const [merkleTree, setMerkleTree] = useState<string[][]>([]);
    const [showMerkle, setShowMerkle] = useState(false);
    
    // Constants
    const [version] = useState("0x20400000");
    const [prevHash] = useState("00000000000000000003b1...");
    const [bits] = useState("1d00ffff");
    const [timestamp, setTimestamp] = useState(1715000000);

    useEffect(() => {
        const txHashesPromises = txs.map(t => computeSHA256(JSON.stringify(t)).then(res => res.hex));
        Promise.all(txHashesPromises).then(hashes => {
            computeMerkleTree(hashes).then(tree => {
                setMerkleTree(tree);
                if(tree.length > 0 && tree[tree.length-1].length > 0) {
                    setMerkleRoot(tree[tree.length-1][0]);
                }
            });
        });
    }, [txs]);

    useEffect(() => {
        if (!merkleRoot) return;
        const headerData = version + prevHash + merkleRoot + timestamp + bits + nonce;
        computeSHA256(headerData).then(res => setHeaderHash(res.hex));
    }, [merkleRoot, nonce, timestamp]);

    const handleAmountChange = (id: number, delta: number) => {
        setTxs(prev => prev.map(t => 
            t.id === id ? { ...t, amount: Math.max(0, parseFloat((t.amount + delta).toFixed(3))) } : t
        ));
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div className={`p-6 rounded-xl border shadow-sm relative ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <Layers className="w-5 h-5 text-indigo-500" /> 区块结构剖析
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                        比特币区块分为“区块头”和“区块体”。<br/>
                        <strong>最关键的是：挖矿只计算区块头的哈希！</strong>
                        交易数据通过“默克尔根”被压缩进区块头。
                    </p>

                    <div className={`border-2 rounded-xl overflow-hidden ${isDarkMode ? 'border-indigo-900 bg-slate-950' : 'border-indigo-100 bg-slate-50'}`}>
                        <div className={`px-4 py-2 border-b flex justify-between items-center ${isDarkMode ? 'bg-indigo-900/20 border-indigo-900/50' : 'bg-indigo-50 border-indigo-100'}`}>
                            <span className="font-bold text-indigo-500 text-sm">区块头 (Block Header) - 80 Bytes</span>
                            <span className="text-[10px] text-indigo-500 uppercase">Input for SHA-256</span>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-3 text-xs font-mono">
                            <div className={`col-span-1 p-2 rounded border text-slate-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <span className="block text-[10px] font-bold text-slate-400">Version</span>
                                {version}
                            </div>
                            <div className={`col-span-1 p-2 rounded border text-slate-500 truncate ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <span className="block text-[10px] font-bold text-slate-400">Prev Hash</span>
                                {prevHash}
                            </div>
                            <div className={`col-span-2 p-2 rounded border animate-in fade-in transition-all ${isDarkMode ? 'bg-orange-900/20 border-orange-900/50 text-orange-400' : 'bg-orange-50 border-orange-200 text-orange-700'}`}>
                                <div className="flex items-center justify-between mb-1">
                                    <div className="flex items-center gap-1">
                                        <GitCommit className="w-3 h-3"/>
                                        <span className="block text-[10px] font-bold text-orange-500">Merkle Root (交易指纹)</span>
                                    </div>
                                    <button 
                                        onClick={() => setShowMerkle(!showMerkle)}
                                        className="text-[10px] underline hover:text-white"
                                    >
                                        {showMerkle ? '隐藏树' : '查看树'}
                                    </button>
                                </div>
                                <span className="truncate block">{merkleRoot}</span>
                            </div>
                            <div className={`col-span-1 p-2 rounded border text-slate-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <span className="block text-[10px] font-bold text-slate-400">Timestamp</span>
                                {timestamp}
                            </div>
                            <div className={`col-span-1 p-2 rounded border text-slate-500 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <span className="block text-[10px] font-bold text-slate-400">Bits (Difficulty)</span>
                                {bits}
                            </div>
                            <div className={`col-span-2 p-2 rounded border ${isDarkMode ? 'bg-indigo-900/20 border-indigo-900/50 text-indigo-400' : 'bg-indigo-50 border-indigo-200 text-indigo-700'}`}>
                                <span className="block text-[10px] font-bold text-indigo-500">Nonce (随机数)</span>
                                <div className="flex justify-between items-center">
                                    <span>{nonce}</span>
                                    <button onClick={() => setNonce(n => n+1)} className={`px-2 py-0.5 rounded text-[10px] transition-colors ${isDarkMode ? 'bg-indigo-900 hover:bg-indigo-800 text-white' : 'bg-indigo-100 hover:bg-indigo-200'}`}>
                                        +1
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center my-2">
                        <ArrowDown className="text-slate-500 w-6 h-6 animate-bounce" />
                    </div>

                    <div className={`p-4 rounded-xl font-mono text-xs break-all shadow-inner border ${isDarkMode ? 'bg-black/50 border-slate-800 text-green-400' : 'bg-slate-800 border-slate-700 text-green-400'}`}>
                        <div className="text-[10px] text-slate-500 mb-1">Block Hash (Double SHA-256)</div>
                        {headerHash}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                {showMerkle && (
                     <div className={`p-4 rounded-xl border shadow-sm animate-in slide-in-from-top-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h4 className="font-bold mb-3 text-sm flex items-center gap-2 text-slate-500">
                            <GitCommit className="w-4 h-4" /> Merkle Tree Visualization
                        </h4>
                        <div className="space-y-4 flex flex-col-reverse items-center overflow-x-auto pb-2">
                            {merkleTree.map((level, i) => (
                                <div key={i} className="flex gap-2 justify-center w-full">
                                    {level.map((hash, j) => (
                                        <div key={j} className={`p-1.5 rounded border text-[8px] font-mono truncate w-16 text-center transition-all ${
                                            i === merkleTree.length - 1 
                                                ? 'bg-orange-500 text-white border-orange-600 scale-110' 
                                                : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500')
                                        }`} title={hash}>
                                            {hash.substring(0, 4)}...
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="text-center text-[10px] text-slate-500 mt-2">
                            Bottom: Transactions (Hashed) &uarr; Top: Merkle Root
                        </div>
                    </div>
                )}

                <div className={`p-6 rounded-xl border shadow-sm h-full flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                        <Database className="w-5 h-5 text-slate-500" /> 区块体 (交易列表)
                    </h3>
                    
                    <div className="flex-1 overflow-y-auto max-h-[400px] space-y-2 mb-4 pr-2 custom-scrollbar">
                         {txs.map(tx => (
                             <div key={tx.id} className={`flex items-center justify-between p-3 rounded-lg border transition-colors group ${isDarkMode ? 'bg-slate-950 border-slate-800 hover:border-orange-900' : 'bg-slate-50 border-slate-100 hover:border-orange-200'}`}>
                                 <div className="flex-1 min-w-0 mr-4">
                                     <div className={`flex items-center gap-2 text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                         <span className="truncate">{tx.from}</span>
                                         <ArrowRight className="w-3 h-3 text-slate-500" />
                                         <span className="truncate">{tx.to}</span>
                                         {tx.isCoinbase && <span className="text-[10px] bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded-full border border-yellow-500/20">Reward</span>}
                                     </div>
                                 </div>
                                 <div className="flex items-center gap-3">
                                     <span className={`font-mono font-bold tabular-nums text-right w-20 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                         {tx.amount.toFixed(2)}
                                     </span>
                                     <div className="flex flex-col gap-1">
                                         <button 
                                            onClick={() => handleAmountChange(tx.id, 0.1)}
                                            className={`p-0.5 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-orange-900/30 hover:text-orange-400' : 'bg-white border-slate-200 hover:bg-orange-50 hover:text-orange-600'}`}
                                         >
                                             <Plus className="w-3 h-3" />
                                         </button>
                                         <button 
                                            onClick={() => handleAmountChange(tx.id, -0.1)}
                                            className={`p-0.5 rounded border transition-colors ${isDarkMode ? 'bg-slate-800 border-slate-700 hover:bg-orange-900/30 hover:text-orange-400' : 'bg-white border-slate-200 hover:bg-orange-50 hover:text-orange-600'}`}
                                         >
                                             <Minus className="w-3 h-3" />
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         ))}
                    </div>

                    <div className="mt-4 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20 text-xs text-orange-600 flex items-start gap-2">
                        <Activity className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <p>
                            <strong>实验：</strong> 点击列表中的 <Plus className="w-3 h-3 inline"/> 或 <Minus className="w-3 h-3 inline"/> 修改金额。
                            观察 Merkle Root 如何剧烈改变，进而导致 Block Hash 彻底改变。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Difficulty Adjustment Section ---
const DifficultySection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [epoch, setEpoch] = useState(1);
    const [difficulty, setDifficulty] = useState(10); // Arbitrary unit
    const [hashrate, setHashrate] = useState(10); // Matches difficulty initially
    const [blocks, setBlocks] = useState<{id: number, time: number}[]>([]);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    
    // Constants
    const TARGET_BLOCK_TIME = 1000; // 1 second for demo (representing 10 mins)
    const BLOCKS_PER_EPOCH = 10; // 10 blocks per epoch for demo (representing 2016)

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setTimeElapsed(prev => prev + 100);
            
            // Probability of mining a block = hashrate / difficulty
            // Adjusted for demo speed
            const miningProb = (hashrate / difficulty) * 0.1; 
            
            if (Math.random() < miningProb) {
                setBlocks(prev => {
                    const newBlock = { id: prev.length + 1, time: Date.now() };
                    const newBlocks = [...prev, newBlock];
                    
                    // Check Epoch
                    if (newBlocks.length % BLOCKS_PER_EPOCH === 0) {
                        // Adjust Difficulty
                        const epochStartBlock = newBlocks[newBlocks.length - BLOCKS_PER_EPOCH];
                        const actualTime = newBlock.time - epochStartBlock.time; // ms
                        const expectedTime = BLOCKS_PER_EPOCH * TARGET_BLOCK_TIME; // ms
                        // Cap adjustment (4x limit in Bitcoin, simplified here)
                        let ratio = expectedTime / actualTime;
                        ratio = Math.max(0.25, Math.min(4, ratio));
                        
                        setDifficulty(d => Math.max(1, Math.round(d * (1/ratio)))); 
                        setEpoch(e => e + 1);
                    }
                    return newBlocks;
                });
            }
        }, 100);
        return () => clearInterval(interval);
    }, [isRunning, hashrate, difficulty]);

    const getBlockColor = (timeTaken: number) => {
        // Ideal is 1000ms
        if (timeTaken < 500) return 'bg-red-500'; // Too fast
        if (timeTaken > 2000) return 'bg-blue-500'; // Too slow
        return 'bg-green-500'; // Good
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-purple-500" /> 难度调整模拟器
                </h3>
                <p className="text-sm text-slate-500 mb-6">
                    比特币每 2016 个区块（约2周）调整一次难度，以确保出块时间稳定在 10 分钟左右。
                    <br/><br/>
                    在此演示中：<br/>
                    - 目标出块时间 = 1秒<br/>
                    - 每个周期 = 10个区块
                </p>

                <div className="space-y-6">
                    <div>
                        <label className="text-xs font-bold uppercase text-slate-500 mb-2 block">全网算力 (Hashrate)</label>
                        <input 
                            type="range" min="5" max="100" value={hashrate}
                            onChange={(e) => setHashrate(Number(e.target.value))}
                            className="w-full accent-purple-500"
                        />
                        <div className="flex justify-between text-xs mt-1 font-mono">
                            <span>Low</span>
                            <span className="font-bold text-purple-500">{hashrate} PH/s</span>
                            <span>High</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-xs text-slate-500 mb-1">当前难度</div>
                            <div className="text-2xl font-mono font-bold">{difficulty}</div>
                        </div>
                        <div className={`p-4 rounded-xl border text-center ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                            <div className="text-xs text-slate-500 mb-1">当前周期 (Epoch)</div>
                            <div className="text-2xl font-mono font-bold text-purple-500">#{epoch}</div>
                        </div>
                    </div>

                    <button 
                        onClick={() => setIsRunning(!isRunning)}
                        className={`w-full py-3 rounded-xl font-bold transition-all ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
                    >
                        {isRunning ? '停止模拟' : '开始模拟'}
                    </button>
                </div>
            </div>

            <div className={`p-6 rounded-2xl border min-h-[400px] flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-slate-500" /> 出块历史
                </h3>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-2 max-h-[350px]">
                    {blocks.length === 0 && <div className="text-center text-slate-500 mt-10">等待出块...</div>}
                    {blocks.slice().reverse().map((block, i) => {
                        const prevBlock = blocks[blocks.length - 1 - i - 1];
                        const timeTaken = prevBlock ? block.time - prevBlock.time : 1000;
                        const isEpochStart = (block.id - 1) % BLOCKS_PER_EPOCH === 0;

                        return (
                            <React.Fragment key={block.id}>
                                {isEpochStart && block.id > 1 && (
                                    <div className="flex items-center gap-2 my-2 opacity-50">
                                        <div className="h-px bg-slate-500 flex-1"></div>
                                        <div className="text-[10px] font-bold uppercase">Difficulty Adjustment</div>
                                        <div className="h-px bg-slate-500 flex-1"></div>
                                    </div>
                                )}
                                <div className={`flex justify-between items-center p-3 rounded-lg border ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-100'}`}>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${getBlockColor(timeTaken)}`}></div>
                                        <span className="font-mono font-bold text-sm">#{block.id}</span>
                                    </div>
                                    <div className="text-xs font-mono">
                                        耗时: <span className={timeTaken < 500 ? 'text-red-500 font-bold' : timeTaken > 2000 ? 'text-blue-500 font-bold' : 'text-green-500'}>
                                            {(timeTaken / 1000).toFixed(1)}s
                                        </span>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
                
                <div className="mt-4 flex gap-4 text-[10px] justify-center text-slate-500">
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div> &lt; 0.5s (太快)</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> ~ 1.0s (完美)</div>
                    <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> &gt; 2.0s (太慢)</div>
                </div>
            </div>
        </div>
    );
};

const PoWDemo = () => {
    const [activeTab, setActiveTab] = useState('hash');
    const [difficulty, setDifficulty] = useState(3);
    const [hashInput, setHashInput] = useState("Bitcoin");
    const [hashResult, setHashResult] = useState({ hex: "", binary: "" });
    const [blockData, setBlockData] = useState("Alice pays Bob 10 BTC");
    const [blockNonce, setBlockHashNonce] = useState(0);
    const [blockHash, setBlockHash] = useState("");
    const [isMiningBlock, setIsMiningBlock] = useState(false);
    const [blockStats, setBlockStats] = useState<{attempts: number, time: number, rate: number} | null>(null);
    const { isDarkMode } = useLab();
    const toast = useToast();

    const [chain, setChain] = useState<BlockData[]>([
        { id: 1, nonce: 12345, data: "创世区块 (Genesis)", hash: "", prev: "0".repeat(64) },
        { id: 2, nonce: 67890, data: "Tx: Alice -> Bob 5 BTC", hash: "", prev: "" },
        { id: 3, nonce: 54321, data: "Tx: Bob -> Charlie 2 BTC", hash: "", prev: "" }
    ]);
    const [miningIndex, setMiningIndex] = useState<number | null>(null);
    const [chainStats, setChainStats] = useState<any>({});

    useEffect(() => { computeSHA256(hashInput).then(setHashResult); }, [hashInput]);

    useEffect(() => {
        const input = `1${blockNonce}${blockData}`;
        computeSHA256(input).then(res => setBlockHash(res.hex));
    }, [blockData, blockNonce]);

    const mineBlock = async () => {
        setIsMiningBlock(true);
        setBlockStats(null);
        let nonce = blockNonce;
        let hash = "";
        const startTime = Date.now();
        const startNonce = nonce;
        const targetPrefix = "0".repeat(difficulty);
        
        const loop = async () => {
            const batchSize = 1000;
            for(let i=0; i<batchSize; i++) {
                nonce++;
                const res = await computeSHA256(`1${nonce}${blockData}`);
                hash = res.hex;
                if (hash.startsWith(targetPrefix)) break;
            }
            const now = Date.now();
            setBlockHashNonce(nonce);
            if (hash.startsWith(targetPrefix)) {
                setIsMiningBlock(false);
                const duration = (now - startTime) / 1000;
                const attempts = nonce - startNonce;
                setBlockStats({ attempts, time: parseFloat(duration.toFixed(3)), rate: Math.round(attempts / (duration || 0.001)) });
            } else if (now - startTime > 20000) {
                setIsMiningBlock(false);
                toast.warning('挖矿超时', '请降低难度后重试');
            } else {
                requestAnimationFrame(loop);
            }
        };
        loop();
    };

    useEffect(() => {
        const updateChain = async () => {
            const newChain = [...chain];
            let changed = false;
            const h1 = (await computeSHA256(`${newChain[0].id}${newChain[0].nonce}${newChain[0].data}${newChain[0].prev}`)).hex;
            if(h1 !== newChain[0].hash) { newChain[0].hash = h1; changed = true; }
            newChain[1].prev = newChain[0].hash;
            const h2 = (await computeSHA256(`${newChain[1].id}${newChain[1].nonce}${newChain[1].data}${newChain[1].prev}`)).hex;
            if(h2 !== newChain[1].hash) { newChain[1].hash = h2; changed = true; }
            newChain[2].prev = newChain[1].hash;
            const h3 = (await computeSHA256(`${newChain[2].id}${newChain[2].nonce}${newChain[2].data}${newChain[2].prev}`)).hex;
            if(h3 !== newChain[2].hash) { newChain[2].hash = h3; changed = true; }
            if(changed) setChain(newChain);
        };
        updateChain();
    }, [chain[0].nonce, chain[0].data, chain[1].nonce, chain[1].data, chain[2].nonce, chain[2].data]);

    const mineChainBlock = (index: number) => {
        setMiningIndex(index);
        let nonce = chain[index].nonce;
        const block = chain[index];
        const startTime = Date.now();
        const startNonce = nonce;
        const targetPrefix = "0".repeat(difficulty);
        const loop = async () => {
            const batchSize = 500;
            for(let i=0; i<batchSize; i++) {
                nonce++;
                const res = await computeSHA256(`${block.id}${nonce}${block.data}${block.prev}`);
                if (res.hex.startsWith(targetPrefix)) {
                    const newChain = [...chain];
                    newChain[index].nonce = nonce;
                    setChain(newChain);
                    const now = Date.now();
                    const duration = (now - startTime) / 1000;
                    const attempts = nonce - startNonce;
                    setChainStats({ ...chainStats, [index]: { attempts, time: parseFloat(duration.toFixed(3)), rate: Math.round(attempts / (duration || 0.001))}});
                    setMiningIndex(null);
                    return;
                }
            }
            const newChain = [...chain];
            newChain[index].nonce = nonce;
            setChain(newChain);
            if (Date.now() - startTime > 30000) { setMiningIndex(null); toast.warning('挖矿超时', '请降低难度后重试'); } else { requestAnimationFrame(loop); }
        };
        loop();
    };

    return (
        <div className={`font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
             <nav className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <div className="bg-orange-500 text-white p-1.5 rounded-full">
                            <Pickaxe className="h-6 w-6" />
                        </div>
                        <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>工作量证明</span>
                        <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>PoW</span>
                    </div>
                    <div className="flex space-x-1">
                        {[
                            { id: 'hash', label: '1. 哈希函数' },
                            { id: 'structure', label: '2. 区块结构' },
                            { id: 'mine', label: '3. 挖矿演示' },
                            { id: 'chain', label: '4. 区块链' },
                            { id: 'difficulty', label: '5. 难度调整' },
                        ].map((tab) => (
                            <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                activeTab === tab.id
                                ? 'bg-orange-500/10 text-orange-500'
                                : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                            }`}
                            >
                            {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                
                {activeTab === 'hash' && (
                    <div className="grid lg:grid-cols-2 gap-8 items-start">
                         <div className="space-y-6">
                            <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 text-white shadow-xl">
                                <h2 className="text-3xl font-bold mb-4">数字指纹 (SHA-256)</h2>
                                <p className="text-orange-100 text-lg leading-relaxed">
                                    比特币不存储你的文件，它只存储“指纹”。<br/>
                                    无论输入是一本小说还是一个字，哈希函数都会输出一个固定长度的乱码。
                                </p>
                            </div>

                            <div className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                    <Activity className="w-5 h-5 text-orange-500"/> 雪崩效应
                                </h3>
                                <div className="flex justify-center my-4">
                                    <div 
                                        className={`grid gap-0.5 p-1 rounded border ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}
                                        style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}
                                    >
                                        {hashResult.binary.split('').slice(0, 256).map((bit, i) => (
                                            <div 
                                                key={i} 
                                                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-[1px] transition-colors duration-200 ${bit === '1' ? 'bg-orange-500' : (isDarkMode ? 'bg-slate-900' : 'bg-white')}`} 
                                                title={`Bit ${i}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <label className={`text-sm font-bold mb-2 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>输入文本</label>
                            <textarea 
                                value={hashInput}
                                onChange={(e) => setHashInput(e.target.value)}
                                className={`w-full border rounded-lg p-4 font-mono text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 outline-none transition-colors h-32 resize-none ${isDarkMode ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'}`}
                            />
                            <div className="flex justify-center my-4">
                                <ArrowDown className="text-slate-500 w-6 h-6" />
                            </div>
                            <label className={`text-sm font-bold mb-2 block ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>输出哈希 (SHA-256)</label>
                            <div className={`rounded-lg p-4 font-mono text-sm break-all shadow-inner ${isDarkMode ? 'bg-black/50 text-green-400' : 'bg-slate-800 text-green-400'}`}>
                                {hashResult.hex}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'structure' && <BlockStructureViz isDarkMode={isDarkMode} />}

                {activeTab === 'mine' && (
                    <div className="max-w-3xl mx-auto space-y-6">
                        <div className={`p-6 rounded-xl border shadow-sm ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h2 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-900'}`}>挖矿模拟器 (PoW)</h2>
                            <DifficultySelector value={difficulty} onChange={setDifficulty} disabled={isMiningBlock} isDarkMode={isDarkMode} />
                        </div>

                        <BlockCard 
                            id={1} data={blockData} nonce={blockNonce} hash={blockHash} difficulty={difficulty}
                            onDataChange={setBlockData} onNonceChange={setBlockHashNonce} onMine={mineBlock}
                            isMining={isMiningBlock} miningStats={blockStats} isDarkMode={isDarkMode}
                        />

                        {blockStats && (
                             <div className={`grid grid-cols-3 gap-4 p-4 rounded-xl border shadow-sm animate-in slide-in-from-bottom-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                <StatBadge icon={RefreshCw} label="尝试次数" value={blockStats.attempts.toLocaleString()} color="text-slate-500" isDarkMode={isDarkMode} />
                                <StatBadge icon={Clock} label="耗时 (秒)" value={blockStats.time} color="text-orange-500" isDarkMode={isDarkMode} />
                                <StatBadge icon={Zap} label="算力 (H/s)" value={blockStats.rate.toLocaleString()} color="text-indigo-500" isDarkMode={isDarkMode} />
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'chain' && (
                    <div className="space-y-6">
                        <div className="flex flex-col gap-6 items-center">
                            {chain.map((block, idx) => {
                                const targetPrefix = "0".repeat(difficulty);
                                const isVisible = idx === 0 || chain[idx-1].hash.startsWith(targetPrefix);
                                if (!isVisible) return null;
                                return (
                                <React.Fragment key={block.id}>
                                    <div className="w-full max-w-xl animate-in slide-in-from-bottom-4 fade-in duration-700 fill-mode-backwards">
                                        <BlockCard 
                                            id={block.id} data={block.data} nonce={block.nonce} prevHash={block.prev} hash={block.hash} difficulty={difficulty}
                                            onDataChange={(val: string) => { const n=[...chain]; n[idx].data=val; setChain(n); }}
                                            onNonceChange={(val: number) => { const n=[...chain]; n[idx].nonce=val; setChain(n); }}
                                            onMine={() => mineChainBlock(idx)} isMining={miningIndex === idx} miningStats={chainStats[idx]} isChain={true} isDarkMode={isDarkMode}
                                        />
                                    </div>
                                    {idx < chain.length - 1 && block.hash.startsWith(targetPrefix) && (
                                        <ArrowDown className="w-8 h-8 text-slate-300" />
                                    )}
                                </React.Fragment>
                            )})}
                        </div>
                    </div>
                )}

                {activeTab === 'difficulty' && <DifficultySection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

export default PoWDemo;
