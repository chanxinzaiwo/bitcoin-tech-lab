import React, { useState } from 'react';
import { Wallet, ArrowRight, ArrowDown, Plus, Trash2, Banknote, AlertCircle, CheckCircle, Coins, ArrowLeftRight, RefreshCcw, Flame, Lock, Unlock, GripVertical, Code, X, ChevronDown, ChevronUp, Sliders, ShieldAlert, MousePointerClick, History, Zap, Loader2, Play, Users, Clock, Hash, FileCode, Award, Shield, Database } from 'lucide-react';
import ScriptExecutionDemo from './BitcoinScript/UTXODemo';
import { useLab } from '../store/LabContext';
import { UTXO } from '../types';
import { useToast } from './Toast';
import Quiz from './Quiz';
import { utxoQuiz } from '../data/quizData';

const UTXODemo = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    return (
        <div className={`font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
             <nav className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-blue-600 text-white p-1.5 rounded-full">
                                <Wallet className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>UTXO 模型</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>UTXO</span>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            {[
                                { id: 'intro', label: '原理介绍' },
                                { id: 'compare', label: '模型对比' },
                                { id: 'script', label: '脚本验证' },
                                { id: 'demo', label: '交易工坊' },
                                { id: 'quiz', label: '测验' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-blue-500/10 text-blue-500'
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
                    {[
                        { id: 'intro', label: '原理介绍' },
                        { id: 'compare', label: '模型对比' },
                        { id: 'script', label: '脚本验证' },
                        { id: 'demo', label: '交易工坊' },
                        { id: 'quiz', label: '测验' }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`inline-block mr-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-sm'
                                    : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 active:bg-slate-700' : 'bg-white text-slate-600 border-slate-300 active:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection changeTab={setActiveTab} isDarkMode={isDarkMode} />}
                {activeTab === 'compare' && <CompareSection isDarkMode={isDarkMode} />}
                {activeTab === 'script' && <ScriptExecutionDemo />}
                {activeTab === 'demo' && <InteractiveSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

const IntroSection = ({ changeTab, isDarkMode }: { changeTab: (tab: string) => void, isDarkMode: boolean }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                 <Wallet className="w-64 h-64" />
             </div>
            <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">比特币没有“账户余额”</h1>
                <p className="text-blue-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                    你的银行账户里有一个数字代表余额。但比特币不同，它只有“未花费的交易输出” (UTXO)。<br/>
                    你的钱包余额，其实是区块链上无数零散 UTXO 的总和，就像存钱罐里的一堆硬币。
                </p>
                <div className="mt-8 flex gap-4">
                    <button
                        onClick={() => changeTab('script')}
                        className="bg-white text-blue-800 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                    >
                        先看解锁原理 <FileCode className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => changeTab('demo')}
                        className="bg-blue-700/50 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2 backdrop-blur-sm border border-blue-400/30"
                    >
                        进入交易工坊 <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card title="金币熔铸" icon={<Flame className="h-8 w-8 text-blue-500" />} isDarkMode={isDarkMode}>
                每次转账，你必须把输入的 UTXO（比如 5 BTC）扔进熔炉“销毁”，然后重新铸造出新的 UTXO：一个给收款人（1 BTC），一个作为找零给自己（3.999 BTC）。
            </Card>
            <Card title="智能选币" icon={<MousePointerClick className="h-8 w-8 text-blue-500" />} isDarkMode={isDarkMode}>
                钱包会自动决定“拿哪块金子去花”。是优先花旧的（FIFO），还是优先花大的？不同的策略会影响你的隐私和手续费。
            </Card>
            <Card title="隐私保护" icon={<ShieldAlert className="h-8 w-8 text-blue-500" />} isDarkMode={isDarkMode}>
                因为找零会生成新的 UTXO，现代钱包通常会把找零发送到一个全新的地址。如果复用旧地址，你的所有交易历史将被关联起来。
            </Card>
        </div>
    </div>
);

const Card = ({ title, icon, children, isDarkMode }: any) => (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
    </div>
);

// --- Interactive Demo Types & Logic ---

interface OutputItem {
    id: string;
    address: string;
    amount: number;
}

interface TxRecord {
    id: string;
    inputs: UTXO[];
    outputs: OutputItem[];
    change: number;
    fee: number;
    size: number;
    time: number;
    status: 'confirmed';
}

// vByte Constants
const INPUT_SIZE = 148;
const OUTPUT_SIZE = 34;
const OVERHEAD = 10;

const InteractiveSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    // --- Global State ---
    const { wallet: globalWallet, addUTXO, removeUTXO, broadcastTransaction, identity } = useLab();
    const toast = useToast();
    
    // Transaction Builder State
    const [inputs, setInputs] = useState<UTXO[]>([]);
    const [outputs, setOutputs] = useState<OutputItem[]>([
        { id: 'out_0', address: '1BobAddress...', amount: 0.1 }
    ]);
    
    const [feeRate, setFeeRate] = useState(20); // sats/vByte
    const [reuseChange, setReuseChange] = useState(false);
    const [showRaw, setShowRaw] = useState(false);
    const [txState, setTxState] = useState<'idle' | 'broadcasting' | 'confirmed'>('idle');
    const [history, setHistory] = useState<TxRecord[]>([]);

    // Computed Values
    const vBytes = (inputs.length * INPUT_SIZE) + (outputs.length * OUTPUT_SIZE) + (inputs.length > 0 ? OUTPUT_SIZE : 0) + OVERHEAD; // + change output approx
    const feeBTC = (vBytes * feeRate) / 100000000;
    const totalInput = inputs.reduce((sum, item) => sum + item.amount, 0);
    const totalOutput = outputs.reduce((sum, item) => sum + item.amount, 0);
    const change = totalInput - totalOutput - feeBTC;
    
    // Validations
    const isValid = change >= 0 && inputs.length > 0;
    const isDustChange = change > 0 && change < 0.00000546; // Dust threshold

    // --- Output Actions ---
    const addOutput = () => {
        if (outputs.length >= 5) return;
        const id = `out_${Math.random().toString(36).substr(2, 4)}`;
        const names = ['Alice', 'Charlie', 'Dave', 'Eve', 'Frank'];
        // Pick a name not currently used if possible
        const nextName = names[outputs.length % names.length];
        
        setOutputs([...outputs, { 
            id, 
            address: `1${nextName}Address...`, 
            amount: 0.0 
        }]);
    };

    const removeOutput = (id: string) => {
        setOutputs(outputs.filter(o => o.id !== id));
    };

    const updateOutputAmount = (id: string, val: number) => {
        setOutputs(outputs.map(o => o.id === id ? { ...o, amount: val } : o));
    };
    
    const distributeEvenly = () => {
        if (inputs.length === 0) return;
        const available = totalInput - feeBTC;
        if (available <= 0) return;
        const perPerson = Math.floor((available / outputs.length) * 100000) / 100000;
        setOutputs(outputs.map(o => ({ ...o, amount: perPerson })));
    };

    // --- Coin Selection Algorithms ---
    const autoSelectCoins = (strategy: 'FIFO' | 'BIG' | 'TARGET') => {
        const allAvailable = [...globalWallet, ...inputs];
        
        // Sort based on strategy
        let sorted = [...allAvailable];
        if (strategy === 'FIFO') {
            sorted.sort((a, b) => (a.time || 0) - (b.time || 0));
        } else if (strategy === 'BIG') {
            sorted.sort((a, b) => b.amount - a.amount);
        } else if (strategy === 'TARGET') {
            sorted.sort((a, b) => {
                const diffA = Math.abs(a.amount - totalOutput);
                const diffB = Math.abs(b.amount - totalOutput);
                return diffA - diffB;
            });
        }

        const selected: UTXO[] = [];
        let currentSum = 0;
        let estimatedFee = 0;

        for (const coin of sorted) {
            selected.push(coin);
            currentSum += coin.amount;
            
            // Re-calc fee with new input count
            const currentVBytes = (selected.length * INPUT_SIZE) + (outputs.length * OUTPUT_SIZE) + OUTPUT_SIZE + OVERHEAD;
            estimatedFee = (currentVBytes * feeRate) / 100000000;
            
            if (currentSum >= totalOutput + estimatedFee) break;
        }

        if (currentSum < totalOutput + estimatedFee) {
            toast.error('资金不足', '无法满足目标金额 + 手续费');
            return;
        }

        // Update state
        setInputs(selected);
        // We don't remove from global wallet *yet*, only on broadcast.
        // But for UI dragging logic, we need to know what's selected. 
        // The dragging logic below handles local removal.
        // For auto-select, we need to ensure the `wallet` rendered on the left doesn't show selected inputs.
        // The component renders `globalWallet` minus `inputs`.
    };

    // --- Drag & Drop ---
    const handleDragStart = (e: React.DragEvent, utxoId: string, source: 'wallet' | 'input') => {
        e.dataTransfer.setData('utxoId', utxoId);
        e.dataTransfer.setData('source', source);
    };

    const handleDropOnInput = (e: React.DragEvent) => {
        e.preventDefault();
        const utxoId = e.dataTransfer.getData('utxoId');
        const source = e.dataTransfer.getData('source');
        if (source === 'wallet') {
            const utxo = globalWallet.find(u => u.id === utxoId);
            if (utxo) {
                // removeUTXO(utxoId); // Don't remove from global store yet!
                setInputs(prev => [...prev, utxo]);
            }
        }
    };

    const handleDropOnWallet = (e: React.DragEvent) => {
        e.preventDefault();
        const utxoId = e.dataTransfer.getData('utxoId');
        const source = e.dataTransfer.getData('source');
        if (source === 'input') {
            const utxo = inputs.find(u => u.id === utxoId);
            if (utxo) {
                setInputs(prev => prev.filter(u => u.id !== utxoId));
                // It implicitly goes back to wallet list because it's still in globalWallet
            }
        }
    };

    // Filtered Wallet for Display
    const displayedWallet = globalWallet.filter(u => !inputs.find(i => i.id === u.id));

    // --- Broadcast ---
    const broadcastTx = () => {
        if (!isValid) return;
        setTxState('broadcasting');

        const newTxId = `tx_${Math.random().toString(36).substr(2, 6)}`;
        const timestamp = Date.now();

        setTimeout(() => {
            setTxState('confirmed');
            
            // Create History Record
            const newTxRecord: TxRecord = {
                id: newTxId,
                inputs: [...inputs],
                outputs: [...outputs],
                change: parseFloat(change.toFixed(6)),
                fee: parseFloat(feeBTC.toFixed(6)),
                size: vBytes,
                time: timestamp,
                status: 'confirmed'
            };
            setHistory(prev => [newTxRecord, ...prev]);

            // Broadcast to Global Mempool/Context
            broadcastTransaction({
                id: newTxId,
                inputs: inputs.map(i => ({ utxoId: i.id })),
                outputs: outputs.map(o => ({ address: o.address, amount: o.amount })),
                fee: parseFloat(feeBTC.toFixed(6)),
                timestamp: timestamp,
                status: 'mempool'
            });

            // Cleanup after animation
            setTimeout(() => {
                setInputs([]);
                
                if (change > 0 && !isDustChange) {
                    const newUtxo: UTXO = {
                        id: `utxo_chg_${Math.random().toString(36).substr(2, 4)}`,
                        amount: parseFloat(change.toFixed(6)),
                        ownerAddress: identity?.address || 'ChangeAddress',
                        color: 'bg-blue-100 border-blue-300 text-blue-800',
                        time: Date.now()
                    };
                    addUTXO(newUtxo);
                }
                setTxState('idle');
            }, 2000);
        }, 2000);
    };

    // --- Raw JSON ---
    const rawTx = {
        version: 2,
        vin: inputs.map(i => ({ txid: `hash_${i.id}`, vout: 0 })),
        vout: [
            ...outputs.map(o => ({ value: o.amount, scriptPubKey: `OP_DUP ... ${o.address} ...` })),
            ...(change > 0 ? [{ value: parseFloat(change.toFixed(6)), type: 'change' }] : [])
        ]
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* 1. Wallet (Left) */}
            <div className="lg:col-span-3 flex flex-col gap-4 h-[650px] sticky top-24">
                {/* Strategies */}
                <div className={`p-4 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-3 flex items-center gap-2">
                        <MousePointerClick className="w-3 h-3" /> 自动选币策略
                    </h3>
                    <div className="grid grid-cols-1 gap-2">
                        {['FIFO (先进先出)', 'Largest First (大额优先)', 'Target (凑整优先)'].map((label, idx) => (
                            <button 
                                key={idx}
                                onClick={() => autoSelectCoins(['FIFO', 'BIG', 'TARGET'][idx] as any)} 
                                className={`px-3 py-2 text-xs font-bold rounded border text-left flex justify-between group transition-colors ${
                                    isDarkMode 
                                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white' 
                                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                                }`}
                            >
                                <span>{label}</span>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    {idx===0 && <History className="w-3 h-3"/>}
                                    {idx===1 && <ArrowDown className="w-3 h-3"/>}
                                    {idx===2 && <CheckCircle className="w-3 h-3"/>}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                <div className={`p-4 rounded-2xl shadow-sm border flex-1 flex flex-col min-h-0 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        <Banknote className="w-5 h-5 text-slate-500" /> 我的钱包
                    </h2>
                    {identity && (
                         <div className="text-[10px] bg-emerald-500/10 text-emerald-500 p-2 rounded mb-2 font-mono truncate border border-emerald-500/20">
                             {identity.address}
                         </div>
                    )}
                    <div 
                        onDrop={handleDropOnWallet} 
                        onDragOver={(e) => e.preventDefault()}
                        className={`flex-1 space-y-3 overflow-y-auto p-2 -m-2 rounded-xl transition-colors border-2 border-dashed custom-scrollbar ${isDarkMode ? 'hover:bg-slate-800/50 hover:border-slate-700 border-transparent' : 'hover:bg-slate-50 hover:border-slate-200 border-transparent'}`}
                    >
                        {displayedWallet.length === 0 && inputs.length === 0 ? (
                            <div className="text-center text-slate-500 mt-10 text-sm">钱包空了 (在地址生成页创建新身份)</div>
                        ) : displayedWallet.length === 0 ? (
                            <div className="text-center text-slate-500 mt-10 text-sm">UTXO 已全部放入交易</div>
                        ) : (
                            displayedWallet.map(u => (
                                <DraggableUTXO key={u.id} utxo={u} source="wallet" onDragStart={handleDragStart} feeRate={feeRate} isDarkMode={isDarkMode} />
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* 2. Transaction Builder (Center/Right) */}
            <div className="lg:col-span-9 space-y-6">
                
                {/* Visual Builder */}
                <div className="bg-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
                    
                    {/* Background Animation for Broadcasting */}
                    {txState === 'broadcasting' && (
                        <div className="absolute inset-0 bg-slate-900/80 z-20 flex flex-col items-center justify-center backdrop-blur-sm animate-in fade-in duration-300">
                             <div className="relative">
                                <div className="absolute inset-0 bg-blue-500/30 blur-xl rounded-full animate-pulse"></div>
                                <Loader2 className="w-16 h-16 text-blue-400 animate-spin relative z-10" />
                             </div>
                             <h3 className="text-2xl font-bold mt-6 text-white">正在广播到 P2P 网络...</h3>
                             <p className="text-slate-400 mt-2">验证签名 • 传播到内存池 • 等待矿工打包</p>
                        </div>
                    )}

                    {txState === 'confirmed' && (
                        <div className="absolute inset-0 bg-emerald-900/90 z-20 flex flex-col items-center justify-center backdrop-blur-sm animate-in zoom-in duration-300">
                             <div className="w-20 h-20 bg-emerald-500 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/50">
                                <CheckCircle className="w-10 h-10 text-white" />
                             </div>
                             <h3 className="text-3xl font-bold text-white">交易已确认！</h3>
                             <p className="text-emerald-200 mt-2">找零已生成新 UTXO 返回钱包</p>
                        </div>
                    )}

                    <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <Flame className="w-64 h-64" />
                    </div>

                    <div className="relative z-10 grid md:grid-cols-2 gap-12 items-stretch">
                        
                        {/* INPUTS */}
                        <div className="flex flex-col h-full">
                            <div className="flex items-center gap-2 mb-4 text-orange-300 font-bold uppercase tracking-wider text-sm">
                                <Flame className="w-4 h-4" /> Inputs (原料熔炉)
                            </div>
                            <div 
                                onDrop={handleDropOnInput} 
                                onDragOver={(e) => e.preventDefault()}
                                className={`flex-1 bg-slate-900/50 border-2 border-dashed ${inputs.length > 0 ? 'border-orange-500/50 bg-orange-900/10' : 'border-slate-600'} rounded-2xl p-4 min-h-[250px] transition-all`}
                            >
                                {inputs.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-slate-500 text-sm italic">
                                        <ArrowDown className="w-6 h-6 mb-2 opacity-50" />
                                        从左侧拖入 UTXO
                                    </div>
                                ) : (
                                    <div className="space-y-3">
                                        {inputs.map(u => (
                                            <DraggableUTXO key={u.id} utxo={u} source="input" onDragStart={handleDragStart} feeRate={feeRate} isDarkMode={isDarkMode} />
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mt-4 flex justify-between items-center text-sm font-mono text-orange-200">
                                <span>总输入:</span>
                                <span className="text-xl font-bold">{totalInput.toFixed(5)} BTC</span>
                            </div>
                        </div>

                        {/* OUTPUTS */}
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-blue-300 font-bold uppercase tracking-wider text-sm">
                                    <Coins className="w-4 h-4" /> Outputs (接收方)
                                </div>
                                <div className="flex items-center gap-2">
                                     <button onClick={distributeEvenly} className="text-[10px] bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded text-slate-300 transition-colors">
                                        Max/均分
                                     </button>
                                     <button onClick={addOutput} className="text-[10px] bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-white transition-colors flex items-center gap-1">
                                        <Plus className="w-3 h-3"/> 添加
                                     </button>
                                </div>
                            </div>
                            
                            <div className="flex-1 space-y-4">
                                {/* Recipients List */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                                    <div className="flex justify-between text-xs text-slate-400 mb-2">
                                        <span className="flex items-center gap-1"><Users className="w-3 h-3"/> 接收方列表</span>
                                        <span className="font-mono text-white">{outputs.length} 人</span>
                                    </div>
                                    
                                    <div className="space-y-3 max-h-[200px] overflow-y-auto custom-scrollbar pr-1">
                                        {outputs.map((out) => (
                                            <div key={out.id} className="bg-slate-800 p-2 rounded border border-slate-700 text-sm space-y-2">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center text-[10px] font-bold">
                                                            {out.address.substr(1,1)}
                                                        </div>
                                                        <div className="truncate text-slate-400 text-xs w-24">{out.address}</div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                         <input 
                                                            type="number" step="0.01"
                                                            value={out.amount}
                                                            onChange={(e) => updateOutputAmount(out.id, parseFloat(e.target.value))}
                                                            className="w-20 bg-transparent text-right font-mono font-bold text-white border-b border-slate-600 focus:border-blue-500 outline-none"
                                                        />
                                                        {outputs.length > 1 && (
                                                            <button onClick={() => removeOutput(out.id)} className="text-slate-600 hover:text-red-400">
                                                                <X className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                {/* Amount Slider */}
                                                <div className="flex items-center gap-2">
                                                    <input 
                                                        type="range" 
                                                        min="0" 
                                                        max={Math.max(totalInput, 1.0)} 
                                                        step="0.01"
                                                        value={out.amount} 
                                                        onChange={(e) => updateOutputAmount(out.id, parseFloat(e.target.value))}
                                                        className="w-full accent-blue-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {outputs.length < 5 && (
                                        <button onClick={addOutput} className="w-full mt-3 py-2 border border-dashed border-slate-600 text-slate-500 text-xs rounded hover:bg-slate-800 hover:text-slate-300 transition-colors flex items-center justify-center gap-1">
                                            <Plus className="w-3 h-3" /> 添加接收人
                                        </button>
                                    )}
                                </div>

                                {/* Fee & Change Control Panel */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="text-xs text-slate-400">体积 (Size)</div>
                                            <div className="font-mono text-sm">~{vBytes} vB</div>
                                        </div>
                                        <div className="space-y-1 text-right">
                                            <div className="text-xs text-slate-400">矿工费 (Fee)</div>
                                            <div className="font-mono text-sm">{feeBTC.toFixed(6)} BTC</div>
                                        </div>
                                    </div>
                                    
                                    <input 
                                        type="range" min="1" max="100" 
                                        value={feeRate} onChange={(e) => setFeeRate(parseInt(e.target.value))}
                                        className="w-full accent-orange-500 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer"
                                        title={`Fee Rate: ${feeRate} sat/vB`}
                                    />
                                    <div className="text-[10px] text-center text-slate-500">{feeRate} sats/vByte</div>

                                    <div className="border-t border-slate-700/50 pt-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className={change < 0 ? "text-red-400 text-sm" : "text-green-400 text-sm"}>找零 (Change)</span>
                                            <span className={`font-mono font-bold text-lg ${change < 0 ? "text-red-400" : "text-green-400"}`}>
                                                {change.toFixed(5)}
                                            </span>
                                        </div>

                                        {change > 0 && (
                                            <div className={`flex items-start gap-2 p-2 rounded-lg text-xs transition-colors cursor-pointer ${reuseChange ? 'bg-red-500/10 border border-red-500/30' : 'bg-slate-800 hover:bg-slate-700'}`} onClick={() => setReuseChange(!reuseChange)}>
                                                <div className={`w-8 h-4 rounded-full relative transition-colors mt-0.5 flex-shrink-0 ${reuseChange ? 'bg-red-500' : 'bg-slate-600'}`}>
                                                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${reuseChange ? 'left-4.5' : 'left-0.5'}`} />
                                                </div>
                                                <div className="flex-1 select-none">
                                                    <span className={reuseChange ? 'text-red-400 font-bold' : 'text-slate-400'}>
                                                        {reuseChange ? '警告：地址复用开启' : '隐私模式：使用新地址'}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {change < 0 && <div className="text-red-400 text-xs mt-2"><AlertCircle className="w-3 h-3 inline mr-1"/> 输入不足</div>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-700 flex flex-col md:flex-row gap-4 items-center justify-between relative z-10">
                        <button 
                            onClick={() => setShowRaw(!showRaw)}
                            className="text-slate-400 hover:text-white text-sm flex items-center gap-2"
                        >
                            <Code className="w-4 h-4" />
                            {showRaw ? '隐藏底层数据' : '查看 Raw Transaction'}
                            {showRaw ? <ChevronUp className="w-3 h-3"/> : <ChevronDown className="w-3 h-3"/>}
                        </button>

                        <button 
                            onClick={broadcastTx}
                            disabled={!isValid || txState !== 'idle'}
                            className={`w-full md:w-auto px-12 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg ${
                                isValid 
                                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/50' 
                                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                            }`}
                        >
                            广播交易 (Broadcast)
                        </button>
                    </div>
                </div>

                {/* Raw JSON View */}
                {showRaw && (
                    <div className={`p-6 rounded-2xl border animate-in slide-in-from-top-4 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <pre className="font-mono text-xs text-green-400 overflow-x-auto bg-black p-4 rounded-xl border border-slate-700/50">
                            {JSON.stringify(rawTx, null, 2)}
                        </pre>
                    </div>
                )}

                {/* Transaction History (Blockchain Explorer) */}
                <div className="space-y-4">
                    <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        <History className="w-5 h-5 text-slate-500"/> 最近广播的交易 (Blockchain Ledger)
                    </h3>
                    
                    {history.length === 0 ? (
                        <div className={`text-center py-10 rounded-xl border border-dashed ${isDarkMode ? 'bg-slate-900 border-slate-800 text-slate-600' : 'bg-slate-100 border-slate-200 text-slate-400'}`}>
                            暂无交易记录
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {history.map((tx) => (
                                <div key={tx.id} className={`p-4 rounded-xl border shadow-sm animate-in slide-in-from-top-2 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    <div className={`flex justify-between items-center mb-3 border-b pb-2 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <div className="flex items-center gap-2">
                                            <span className="bg-green-500/10 text-green-500 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase border border-green-500/20">Confirmed</span>
                                            <span className="font-mono text-xs text-slate-500">{tx.id}</span>
                                        </div>
                                        <div className="text-xs text-slate-500">
                                            {new Date(tx.time).toLocaleTimeString()}
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-12 gap-4 items-center text-sm">
                                        {/* Inputs */}
                                        <div className="md:col-span-5 space-y-1">
                                            {tx.inputs.map(i => (
                                                <div key={i.id} className="flex justify-between text-red-500 bg-red-500/5 px-2 py-1 rounded border border-red-500/10">
                                                    <span className="font-mono text-xs opacity-70 truncate w-20">{i.id}</span>
                                                    <span className="font-mono font-bold">-{i.amount.toFixed(4)} BTC</span>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Arrow */}
                                        <div className="md:col-span-1 flex justify-center text-slate-300">
                                            <ArrowRight className="w-5 h-5" />
                                        </div>

                                        {/* Outputs */}
                                        <div className="md:col-span-5 space-y-1">
                                            {tx.outputs.map(o => (
                                                <div key={o.id} className="flex justify-between text-green-500 bg-green-500/5 px-2 py-1 rounded border border-green-500/10">
                                                    <span className="font-mono text-xs opacity-70 truncate w-20">{o.address}</span>
                                                    <span className="font-mono font-bold">+{o.amount.toFixed(4)} BTC</span>
                                                </div>
                                            ))}
                                            {tx.change > 0 && (
                                                <div className="flex justify-between text-blue-500 bg-blue-500/5 px-2 py-1 rounded border border-blue-500/10">
                                                    <span className="text-xs">Change (You)</span>
                                                    <span className="font-mono font-bold">+{tx.change.toFixed(4)} BTC</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className={`mt-3 pt-2 border-t flex justify-between text-xs text-slate-500 ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                        <div>Size: <span className="font-mono">{tx.size} vB</span></div>
                                        <div>Fee: <span className={`font-mono font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-700'}`}>{tx.fee} BTC</span></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Define props interface
interface DraggableUTXOProps {
    utxo: UTXO;
    source: 'wallet' | 'input';
    onDragStart: (e: React.DragEvent, utxoId: string, source: 'wallet' | 'input') => void;
    feeRate: number;
    isDarkMode: boolean;
}

const DraggableUTXO: React.FC<DraggableUTXOProps> = ({ utxo, source, onDragStart, feeRate, isDarkMode }) => {
    // Cost to spend 1 input ~ 148 bytes.
    const spendCost = (148 * feeRate) / 100000000;
    const isDust = utxo.amount < spendCost;
    
    // Parse color string to adapt to dark mode (a bit hacky but works for the demo data structure)
    // We assume colors are like 'bg-emerald-100 ... text-emerald-800'
    const colorClass = utxo.color || 'bg-slate-100 border-slate-300 text-slate-600';
    
    return (
        <div 
            draggable 
            onDragStart={(e) => onDragStart(e, utxo.id, source)}
            className={`
                group relative p-3 rounded-xl border cursor-grab active:cursor-grabbing transition-all hover:-translate-y-1 hover:shadow-md select-none
                ${source === 'wallet' 
                    ? (isDarkMode ? 'bg-slate-900 border-slate-700 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-50') 
                    : `bg-slate-800 border-slate-600 hover:border-orange-400 text-white`
                }
                ${isDust && source === 'wallet' ? 'opacity-70' : ''}
            `}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="cursor-grab text-slate-400 group-hover:text-slate-500">
                        <GripVertical className="w-4 h-4" />
                    </div>
                    <div>
                        <div className={`text-xs font-mono mb-0.5 ${source === 'wallet' ? 'text-slate-500' : 'text-slate-400'}`}>
                            {utxo.id}
                        </div>
                        <div className={`font-bold font-mono ${source === 'wallet' ? (isDarkMode ? 'text-slate-200' : 'text-slate-800') : 'text-orange-200'}`}>
                            {utxo.amount.toFixed(5)} BTC
                        </div>
                    </div>
                </div>
                <div className={source === 'wallet' ? 'text-slate-400' : 'text-orange-500'}>
                    {source === 'wallet' ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
                </div>
            </div>
            
            {/* Dust Warning */}
            {isDust && (
                <div className="absolute top-1 right-1">
                     <div className="bg-red-500/10 text-red-500 p-1 rounded-full" title={`手续费 (${spendCost.toFixed(6)}) 高于价值，属于粉尘`}>
                        <Zap className="w-3 h-3" />
                     </div>
                </div>
            )}

            {/* Colored Tag */}
            <div className={`absolute left-0 top-3 bottom-3 w-1 rounded-r ${utxo.color ? utxo.color.split(' ')[0].replace('bg-', 'bg-').replace('100', '500') : 'bg-slate-500'}`}></div>
        </div>
    );
}

// Compare Section - UTXO vs Account Model
const CompareSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const comparisons = [
        {
            aspect: '余额表示',
            utxo: '零散的"硬币"集合，余额是所有UTXO的总和',
            account: '单一数字，直接存储余额值',
        },
        {
            aspect: '转账方式',
            utxo: '销毁输入UTXO，创建新的输出UTXO',
            account: '直接修改发送方和接收方的余额数字',
        },
        {
            aspect: '找零处理',
            utxo: '必须显式创建找零输出到新地址',
            account: '自动计算，无需额外操作',
        },
        {
            aspect: '并发处理',
            utxo: '天然支持，不同UTXO可并行花费',
            account: '需要处理nonce或锁，防止重放攻击',
        },
        {
            aspect: '隐私性',
            utxo: '每次交易可使用新地址，难以关联',
            account: '单一地址易被追踪所有历史交易',
        },
        {
            aspect: '状态存储',
            utxo: '只需存储未花费输出，已花费的可丢弃',
            account: '必须维护所有账户的当前状态',
        },
        {
            aspect: '验证复杂度',
            utxo: '验证输入是否存在且未花费',
            account: '验证余额充足且nonce正确',
        },
        {
            aspect: '智能合约',
            utxo: '基于脚本，功能有限但安全',
            account: '图灵完备，功能强大但复杂',
        }
    ];

    const utxoAdvantages = [
        { icon: Shield, title: '更高隐私', desc: '每笔交易可生成新地址，难以追踪资金流向' },
        { icon: Zap, title: '并行验证', desc: '不同UTXO的交易可以并行验证，提高吞吐量' },
        { icon: Lock, title: '简单安全', desc: '脚本模型简单，减少攻击面' },
        { icon: Database, title: '轻量存储', desc: '只需保存UTXO集，无需完整历史' },
    ];

    const accountAdvantages = [
        { icon: Users, title: '直观易懂', desc: '类似银行账户，用户容易理解' },
        { icon: Code, title: '智能合约', desc: '支持复杂的状态转换和合约逻辑' },
        { icon: ArrowLeftRight, title: '简单转账', desc: '无需管理UTXO，转账逻辑简单' },
        { icon: Hash, title: '确定性高', desc: '交易结果可预测，便于开发' },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    UTXO vs 账户模型
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    比特币和以太坊代表了两种不同的记账哲学
                </p>
            </div>

            {/* Visual Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* UTXO Model */}
                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                        <Coins className="w-4 h-4" />
                        <span className="font-bold text-sm">UTXO 模型</span>
                    </div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>比特币、莱特币、BCH</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                        像存钱罐里的硬币，花钱时取出硬币，找零变成新硬币。
                    </p>

                    {/* Visual Representation */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} mb-4`}>
                        <div className="text-xs text-center mb-2 text-slate-500">Alice 的钱包 (3.5 BTC)</div>
                        <div className="flex flex-wrap gap-2 justify-center">
                            <div className={`px-3 py-2 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-blue-100 text-blue-700 border-blue-200'} border`}>
                                2.0 BTC
                            </div>
                            <div className={`px-3 py-2 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-emerald-100 text-emerald-700 border-emerald-200'} border`}>
                                1.0 BTC
                            </div>
                            <div className={`px-3 py-2 rounded-lg text-sm font-bold ${isDarkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'} border`}>
                                0.5 BTC
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {utxoAdvantages.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-blue-500" />
                                    <div>
                                        <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.title}: </span>
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{item.desc}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Account Model */}
                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full mb-4 ${isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                        <Database className="w-4 h-4" />
                        <span className="font-bold text-sm">账户模型</span>
                    </div>
                    <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>以太坊、Solana、EOS</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                        像银行账户，有一个余额数字，转账直接加减。
                    </p>

                    {/* Visual Representation */}
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'} mb-4`}>
                        <div className="text-xs text-center mb-2 text-slate-500">Alice 的账户</div>
                        <div className="text-center">
                            <div className={`inline-block px-6 py-3 rounded-lg text-xl font-bold ${isDarkMode ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' : 'bg-purple-100 text-purple-700 border-purple-200'} border`}>
                                Balance: 3.5 ETH
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        {accountAdvantages.map((item, i) => {
                            const Icon = item.icon;
                            return (
                                <div key={i} className="flex items-center gap-3">
                                    <Icon className="w-4 h-4 text-purple-500" />
                                    <div>
                                        <span className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.title}: </span>
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{item.desc}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Detailed Comparison Table */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border overflow-x-auto`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <ArrowLeftRight className="w-5 h-5 text-blue-500" />
                    详细对比
                </h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            <th className="text-left py-2 px-3 w-1/5">方面</th>
                            <th className="text-left py-2 px-3 w-2/5">
                                <span className="text-blue-500">UTXO 模型</span>
                            </th>
                            <th className="text-left py-2 px-3 w-2/5">
                                <span className="text-purple-500">账户模型</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {comparisons.map((item, index) => (
                            <tr key={index} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                <td className={`py-3 px-3 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.aspect}</td>
                                <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.utxo}</td>
                                <td className={`py-3 px-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.account}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Transaction Flow Example */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Play className="w-5 h-5 text-blue-500" />
                    转账流程对比：Alice 给 Bob 转 1 BTC/ETH
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'} border`}>
                        <h4 className={`font-bold ${isDarkMode ? 'text-blue-300' : 'text-blue-800'} mb-3`}>UTXO 模型 (比特币)</h4>
                        <ol className={`text-sm space-y-2 ${isDarkMode ? 'text-blue-200' : 'text-blue-700'}`}>
                            <li>1. Alice 选择一个 2 BTC 的 UTXO 作为输入</li>
                            <li>2. 创建输出1: Bob 1 BTC (新 UTXO)</li>
                            <li>3. 创建输出2: Alice 0.999 BTC (找零 UTXO)</li>
                            <li>4. 0.001 BTC 作为矿工费</li>
                            <li>5. 原 2 BTC UTXO 被标记为已花费</li>
                        </ol>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-purple-500/10 border-purple-500/30' : 'bg-purple-50 border-purple-200'} border`}>
                        <h4 className={`font-bold ${isDarkMode ? 'text-purple-300' : 'text-purple-800'} mb-3`}>账户模型 (以太坊)</h4>
                        <ol className={`text-sm space-y-2 ${isDarkMode ? 'text-purple-200' : 'text-purple-700'}`}>
                            <li>1. 检查 Alice 余额 {'>='} 1 ETH + gas</li>
                            <li>2. Alice 余额 {'-='} 1 ETH + gas</li>
                            <li>3. Bob 余额 {'+='} 1 ETH</li>
                            <li>4. Alice nonce {'+='} 1</li>
                            <li>5. 更新全局状态树</li>
                        </ol>
                    </div>
                </div>
            </div>

            {/* Why Bitcoin chose UTXO */}
            <div className={`${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'} mb-3 flex items-center gap-2`}>
                    <CheckCircle className="w-5 h-5" />
                    为什么比特币选择 UTXO？
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'} mb-4`}>
                    中本聪设计比特币时，UTXO模型被选择是因为它更适合去中心化的价值存储：
                </p>
                <ul className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'} space-y-2 list-disc list-inside`}>
                    <li><strong>简单可验证：</strong> 每笔交易只需验证输入UTXO是否存在且未被花费</li>
                    <li><strong>天然防双花：</strong> UTXO只能被花费一次，花费后立即从集合中移除</li>
                    <li><strong>高度并行：</strong> 不同UTXO的交易可以完全独立验证</li>
                    <li><strong>隐私友好：</strong> 每次交易生成新地址，增加追踪难度</li>
                </ul>
            </div>
        </div>
    );
};

// Quiz Section
const QuizSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <Award className="w-8 h-8 text-blue-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    UTXO 知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对 UTXO 模型的理解
                </p>
            </div>
            <Quiz quizData={utxoQuiz} />
        </div>
    );
};

export default UTXODemo;