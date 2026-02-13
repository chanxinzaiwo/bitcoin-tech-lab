import React, { useState, useMemo } from 'react';
import { ArrowRight, ArrowDown, Plus, Trash2, CheckCircle2, AlertCircle, Info, Send, FileText, Lock, Unlock, PenTool, Eye, Coins, Calculator, Hash, Key } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { transactionQuiz } from '../data/quizData';

// --- Types ---

interface UTXO {
    txid: string;
    vout: number;
    amount: number; // in satoshis
    address: string;
    scriptPubKey: string;
}

interface TxInput {
    id: string;
    utxo: UTXO;
    scriptSig: string;
    signed: boolean;
}

interface TxOutput {
    id: string;
    address: string;
    amount: number; // in satoshis
}

// --- Utility Functions ---

const generateTxid = (): string => {
    const chars = '0123456789abcdef';
    let result = '';
    for (let i = 0; i < 64; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const generateAddress = (prefix: string = '1'): string => {
    const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
    let result = prefix;
    for (let i = 0; i < 33; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

const formatSatoshis = (sats: number): string => {
    if (sats >= 100000000) {
        return (sats / 100000000).toFixed(8) + ' BTC';
    } else if (sats >= 1000) {
        return (sats / 1000).toFixed(3) + ' mBTC';
    }
    return sats + ' sats';
};

const satsToBTC = (sats: number): string => {
    return (sats / 100000000).toFixed(8);
};

// --- Main Component ---

const TransactionDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '交易结构' },
        { id: 'builder', label: '构建交易' },
        { id: 'signing', label: '签名过程' },
        { id: 'decode', label: '解析交易' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-amber-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-amber-600 text-white p-1.5 rounded-full">
                                <Send className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>交易构建</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Transaction</span>
                        </div>
                        <div className="flex space-x-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-amber-500/10 text-amber-500'
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection isDarkMode={isDarkMode} changeTab={setActiveTab} />}
                {activeTab === 'builder' && <TransactionBuilder isDarkMode={isDarkMode} />}
                {activeTab === 'signing' && <SigningSection isDarkMode={isDarkMode} />}
                {activeTab === 'decode' && <DecodeSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// --- Intro Section ---

const IntroSection: React.FC<{ isDarkMode: boolean; changeTab: (tab: string) => void }> = ({ isDarkMode, changeTab }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-amber-600 to-orange-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">比特币交易：价值转移的核心</h1>
            <p className="text-amber-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                比特币交易不是简单的"从 A 转到 B"，而是消费旧的 UTXO 并创建新的 UTXO。
                理解交易结构是掌握比特币技术的关键。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">~250 字节</div>
                    <div className="text-sm text-amber-200">典型交易大小</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">输入 → 输出</div>
                    <div className="text-sm text-amber-200">UTXO 转换模型</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">~10 分钟</div>
                    <div className="text-sm text-amber-200">首次确认时间</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('builder')}
                className="mt-8 bg-white text-amber-700 hover:bg-amber-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                开始构建交易 <ArrowRight className="h-5 w-5" />
            </button>
        </div>

        {/* Transaction Structure */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                交易结构
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-900/20 border border-red-800' : 'bg-red-50 border border-red-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        <ArrowRight className="w-5 h-5" /> 输入 (Inputs)
                    </h3>
                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-red-200' : 'text-red-600'}`}>
                        <li className="flex items-start gap-2">
                            <span className="font-mono bg-red-500/20 px-1.5 rounded">txid</span>
                            <span>引用之前交易的哈希</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-mono bg-red-500/20 px-1.5 rounded">vout</span>
                            <span>之前交易的输出索引</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-mono bg-red-500/20 px-1.5 rounded">scriptSig</span>
                            <span>解锁脚本（签名+公钥）</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-mono bg-red-500/20 px-1.5 rounded">sequence</span>
                            <span>序列号（用于 RBF/时间锁）</span>
                        </li>
                    </ul>
                </div>

                {/* Outputs */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-900/20 border border-green-800' : 'bg-green-50 border border-green-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <ArrowDown className="w-5 h-5" /> 输出 (Outputs)
                    </h3>
                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                        <li className="flex items-start gap-2">
                            <span className="font-mono bg-green-500/20 px-1.5 rounded">value</span>
                            <span>金额（以 satoshis 为单位）</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="font-mono bg-green-500/20 px-1.5 rounded">scriptPubKey</span>
                            <span>锁定脚本（定义花费条件）</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* Visual Flow */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                交易流程
            </h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {[
                    { icon: Coins, title: '选择 UTXO', desc: '选择要花费的未使用输出' },
                    { icon: Calculator, title: '计算金额', desc: '设置输出金额和找零' },
                    { icon: PenTool, title: '签名', desc: '用私钥签名每个输入' },
                    { icon: Send, title: '广播', desc: '发送到比特币网络' }
                ].map((step, i) => (
                    <React.Fragment key={step.title}>
                        <div className={`flex flex-col items-center text-center p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <step.icon className="w-8 h-8 text-amber-500 mb-2" />
                            <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{step.title}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{step.desc}</div>
                        </div>
                        {i < 3 && (
                            <ArrowRight className={`w-6 h-6 hidden md:block ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                        )}
                    </React.Fragment>
                ))}
            </div>
        </div>

        {/* Key Concepts */}
        <div className="grid md:grid-cols-3 gap-6">
            <Card isDarkMode={isDarkMode} title="UTXO 模型" icon={<Coins className="h-8 w-8 text-amber-500" />}>
                比特币没有"账户余额"概念。每笔交易消费之前的输出（UTXO），并创建新的输出。你的"余额"是所有可花费 UTXO 的总和。
            </Card>
            <Card isDarkMode={isDarkMode} title="找零机制" icon={<Calculator className="h-8 w-8 text-amber-500" />}>
                UTXO 必须完整花费。如果你有 1 BTC 的 UTXO 但只想发送 0.3 BTC，需要创建一个 0.7 BTC 的找零输出返回给自己。
            </Card>
            <Card isDarkMode={isDarkMode} title="手续费" icon={<Hash className="h-8 w-8 text-amber-500" />}>
                手续费 = 输入总额 - 输出总额。矿工收取这个差额。手续费越高，交易被确认越快。
            </Card>
        </div>
    </div>
);

// --- Transaction Builder Section ---

const TransactionBuilder: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [availableUTXOs] = useState<UTXO[]>([
        { txid: generateTxid(), vout: 0, amount: 50000000, address: generateAddress(), scriptPubKey: 'OP_DUP OP_HASH160 ... OP_EQUALVERIFY OP_CHECKSIG' },
        { txid: generateTxid(), vout: 1, amount: 25000000, address: generateAddress(), scriptPubKey: 'OP_DUP OP_HASH160 ... OP_EQUALVERIFY OP_CHECKSIG' },
        { txid: generateTxid(), vout: 0, amount: 10000000, address: generateAddress(), scriptPubKey: 'OP_DUP OP_HASH160 ... OP_EQUALVERIFY OP_CHECKSIG' },
    ]);

    const [inputs, setInputs] = useState<TxInput[]>([]);
    const [outputs, setOutputs] = useState<TxOutput[]>([
        { id: '1', address: '', amount: 0 }
    ]);
    const [feeRate, setFeeRate] = useState(10); // sats/vB

    const totalInput = useMemo(() => inputs.reduce((sum, i) => sum + i.utxo.amount, 0), [inputs]);
    const totalOutput = useMemo(() => outputs.reduce((sum, o) => sum + o.amount, 0), [outputs]);
    const estimatedSize = useMemo(() => 10 + inputs.length * 148 + outputs.length * 34, [inputs.length, outputs.length]);
    const estimatedFee = estimatedSize * feeRate;
    const change = totalInput - totalOutput - estimatedFee;

    const addInput = (utxo: UTXO) => {
        if (inputs.some(i => i.utxo.txid === utxo.txid && i.utxo.vout === utxo.vout)) return;
        setInputs([...inputs, {
            id: `${utxo.txid}:${utxo.vout}`,
            utxo,
            scriptSig: '',
            signed: false
        }]);
    };

    const removeInput = (id: string) => {
        setInputs(inputs.filter(i => i.id !== id));
    };

    const addOutput = () => {
        setOutputs([...outputs, { id: Date.now().toString(), address: '', amount: 0 }]);
    };

    const removeOutput = (id: string) => {
        if (outputs.length <= 1) return;
        setOutputs(outputs.filter(o => o.id !== id));
    };

    const updateOutput = (id: string, field: 'address' | 'amount', value: string | number) => {
        setOutputs(outputs.map(o => o.id === id ? { ...o, [field]: value } : o));
    };

    const isValid = inputs.length > 0 && outputs.length > 0 && totalOutput > 0 && change >= 0;

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Available UTXOs */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Coins className="w-6 h-6 text-amber-500" />
                    可用 UTXO
                </h2>
                <div className="space-y-2">
                    {availableUTXOs.map((utxo) => {
                        const isSelected = inputs.some(i => i.utxo.txid === utxo.txid && i.utxo.vout === utxo.vout);
                        return (
                            <div
                                key={`${utxo.txid}:${utxo.vout}`}
                                className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                                    isSelected
                                        ? isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-300'
                                        : isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-50 hover:bg-slate-100'
                                }`}
                                onClick={() => isSelected ? removeInput(`${utxo.txid}:${utxo.vout}`) : addInput(utxo)}
                            >
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${isSelected ? 'bg-amber-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    {isSelected && <CheckCircle2 className="w-4 h-4" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className={`font-mono text-xs truncate ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        {utxo.txid.slice(0, 16)}...:{utxo.vout}
                                    </div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        {utxo.address.slice(0, 20)}...
                                    </div>
                                </div>
                                <div className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                    {formatSatoshis(utxo.amount)}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Transaction Builder */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* Inputs */}
                <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-red-900/10 border-red-900' : 'bg-red-50 border-red-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                        <ArrowRight className="w-5 h-5" />
                        输入 ({inputs.length})
                    </h3>
                    {inputs.length === 0 ? (
                        <p className={`text-sm ${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>
                            点击上方 UTXO 添加输入
                        </p>
                    ) : (
                        <div className="space-y-2">
                            {inputs.map((input) => (
                                <div key={input.id} className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-mono text-xs truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            {input.utxo.txid.slice(0, 12)}...
                                        </div>
                                        <div className={`text-sm font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                            {formatSatoshis(input.utxo.amount)}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => removeInput(input.id)}
                                        className="p-1 text-red-500 hover:bg-red-100 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-red-800' : 'border-red-200'}`}>
                        <div className="flex justify-between">
                            <span className={`font-medium ${isDarkMode ? 'text-red-300' : 'text-red-600'}`}>输入总额</span>
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatSatoshis(totalInput)}</span>
                        </div>
                    </div>
                </div>

                {/* Outputs */}
                <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-green-900/10 border-green-900' : 'bg-green-50 border-green-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                        <ArrowDown className="w-5 h-5" />
                        输出 ({outputs.length})
                    </h3>
                    <div className="space-y-3">
                        {outputs.map((output, index) => (
                            <div key={output.id} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className={`text-xs font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                        输出 #{index + 1}
                                    </span>
                                    {outputs.length > 1 && (
                                        <button
                                            onClick={() => removeOutput(output.id)}
                                            className="ml-auto p-1 text-red-500 hover:bg-red-100 rounded"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                <input
                                    type="text"
                                    placeholder="接收地址"
                                    value={output.address}
                                    onChange={(e) => updateOutput(output.id, 'address', e.target.value)}
                                    className={`w-full px-3 py-2 rounded-lg text-sm font-mono mb-2 ${
                                        isDarkMode
                                            ? 'bg-slate-900 border-slate-700 text-white'
                                            : 'bg-slate-50 border-slate-200 text-slate-900'
                                    } border`}
                                />
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        placeholder="金额 (sats)"
                                        value={output.amount || ''}
                                        onChange={(e) => updateOutput(output.id, 'amount', parseInt(e.target.value) || 0)}
                                        className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                                            isDarkMode
                                                ? 'bg-slate-900 border-slate-700 text-white'
                                                : 'bg-slate-50 border-slate-200 text-slate-900'
                                        } border`}
                                    />
                                    <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>sats</span>
                                </div>
                            </div>
                        ))}
                    </div>
                    <button
                        onClick={addOutput}
                        className={`mt-3 w-full py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 ${
                            isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-white text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                        <Plus className="w-4 h-4" /> 添加输出
                    </button>
                    <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-green-800' : 'border-green-200'}`}>
                        <div className="flex justify-between">
                            <span className={`font-medium ${isDarkMode ? 'text-green-300' : 'text-green-600'}`}>输出总额</span>
                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{formatSatoshis(totalOutput)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Fee & Summary */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    交易摘要
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-4">
                            <label className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>费率</label>
                            <input
                                type="range"
                                min="1"
                                max="100"
                                value={feeRate}
                                onChange={(e) => setFeeRate(parseInt(e.target.value))}
                                className="flex-1"
                            />
                            <span className={`font-mono text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                {feeRate} sat/vB
                            </span>
                        </div>
                        <div className={`flex justify-between text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>预估大小</span>
                            <span>{estimatedSize} vBytes</span>
                        </div>
                        <div className={`flex justify-between text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            <span>预估手续费</span>
                            <span>{formatSatoshis(estimatedFee)}</span>
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl ${change >= 0 ? isDarkMode ? 'bg-green-900/20' : 'bg-green-50' : isDarkMode ? 'bg-red-900/20' : 'bg-red-50'}`}>
                        <div className={`text-sm mb-2 ${change >= 0 ? isDarkMode ? 'text-green-300' : 'text-green-600' : isDarkMode ? 'text-red-300' : 'text-red-600'}`}>
                            找零金额
                        </div>
                        <div className={`text-2xl font-bold ${change >= 0 ? isDarkMode ? 'text-green-400' : 'text-green-700' : isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                            {formatSatoshis(Math.abs(change))}
                        </div>
                        {change < 0 && (
                            <div className={`text-xs mt-1 ${isDarkMode ? 'text-red-300' : 'text-red-500'}`}>
                                输入不足，需要更多 UTXO
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Validation */}
            <div className={`p-4 rounded-xl ${isValid ? isDarkMode ? 'bg-green-900/20 border border-green-700' : 'bg-green-50 border border-green-200' : isDarkMode ? 'bg-amber-900/20 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center gap-2">
                    {isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-amber-500" />
                    )}
                    <span className={`font-medium ${isValid ? isDarkMode ? 'text-green-300' : 'text-green-700' : isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                        {isValid ? '交易有效，可以进行签名' : '请选择输入并设置有效的输出'}
                    </span>
                </div>
            </div>
        </div>
    );
};

// --- Signing Section ---

const SigningSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [step, setStep] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);

    const steps = [
        {
            title: '1. 构建签名消息',
            desc: '将交易数据序列化，并对输入应用 SIGHASH 标志',
            code: 'msg = SHA256(SHA256(tx_data + SIGHASH_ALL))'
        },
        {
            title: '2. 生成签名',
            desc: '使用私钥对消息进行 ECDSA 签名',
            code: 'sig = ECDSA_sign(private_key, msg)'
        },
        {
            title: '3. 构建 scriptSig',
            desc: '将签名和公钥组合成解锁脚本',
            code: 'scriptSig = <sig> <pubkey>'
        },
        {
            title: '4. 验证签名',
            desc: '节点验证签名是否与公钥和交易数据匹配',
            code: 'ECDSA_verify(pubkey, msg, sig) == true'
        }
    ];

    const animate = () => {
        setStep(0);
        setIsAnimating(true);
        let current = 0;
        const interval = setInterval(() => {
            current++;
            setStep(current);
            if (current >= steps.length) {
                clearInterval(interval);
                setIsAnimating(false);
            }
        }, 1500);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-xl font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <PenTool className="w-6 h-6 text-amber-500" />
                        交易签名流程
                    </h2>
                    <button
                        onClick={animate}
                        disabled={isAnimating}
                        className={`px-4 py-2 rounded-lg font-medium ${
                            isAnimating
                                ? isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                                : 'bg-amber-600 text-white hover:bg-amber-700'
                        }`}
                    >
                        {isAnimating ? '签名中...' : '演示签名'}
                    </button>
                </div>

                <div className="space-y-4">
                    {steps.map((s, i) => (
                        <div
                            key={i}
                            className={`p-4 rounded-xl transition-all duration-500 ${
                                step > i
                                    ? isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                                    : step === i
                                        ? isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'
                                        : isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                            }`}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    step > i
                                        ? 'bg-green-500 text-white'
                                        : step === i
                                            ? 'bg-amber-500 text-white animate-pulse'
                                            : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {step > i ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                                </div>
                                <div className="flex-1">
                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{s.title}</h4>
                                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{s.desc}</p>
                                    <code className={`block mt-2 p-2 rounded text-xs font-mono ${isDarkMode ? 'bg-slate-900 text-amber-400' : 'bg-white text-amber-600'}`}>
                                        {s.code}
                                    </code>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {step >= steps.length && (
                    <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'}`}>
                        <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-6 h-6 text-green-500" />
                            <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                签名完成！交易可以广播了
                            </span>
                        </div>
                    </div>
                )}
            </div>

            {/* SIGHASH Types */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    SIGHASH 类型
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    {[
                        { type: 'SIGHASH_ALL', desc: '签名所有输入和输出（最常用）', hex: '0x01' },
                        { type: 'SIGHASH_NONE', desc: '签名所有输入，不签名输出', hex: '0x02' },
                        { type: 'SIGHASH_SINGLE', desc: '签名所有输入和对应索引的输出', hex: '0x03' }
                    ].map((item) => (
                        <div key={item.type} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className="flex items-center gap-2 mb-2">
                                <code className={`font-mono text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>{item.type}</code>
                                <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>{item.hex}</span>
                            </div>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// --- Decode Section ---

const DecodeSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [rawTx, setRawTx] = useState('0100000001c997a5e56e104102fa209c6a852dd90660a20b2d9c352423edce25857fcd3704000000004847304402204e45e16932b8af514961a1d3a1a25fdf3f4f7732e9d624c6c61548ab5fb8cd410220181522ec8eca07de4860a4acdd12909d831cc56cbbac4622082221a8768d1d0901ffffffff0200ca9a3b00000000434104ae1a62fe09c5f51b13905f07f06b99a2f7159b2225f374cd378d71302fa28414e7aab37397f554a7df5f142c21c1b7303b8a0626f1baded5c72a704f7e6cd84cac00286bee0000000043410411db93e1dcdb8a016b49840f8c53bc1eb68a382e97b1482ecad7b148a6909a5cb2e0eaddfb84ccf9744464f82e160bfa9b8b64f9d4c03f999b8643f656b412a3ac00000000');

    const decodedTx = useMemo(() => {
        // Simplified transaction decoding for demo
        try {
            const version = rawTx.slice(0, 8);
            const inputCount = rawTx.slice(8, 10);
            // ... more parsing would go here
            return {
                version: parseInt(version.match(/../g)?.reverse().join('') || '0', 16),
                inputCount: parseInt(inputCount, 16),
                size: rawTx.length / 2,
                valid: rawTx.length > 100 && /^[0-9a-fA-F]+$/.test(rawTx)
            };
        } catch {
            return null;
        }
    }, [rawTx]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Eye className="w-6 h-6 text-amber-500" />
                    交易解析器
                </h2>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    输入原始交易十六进制数据，查看解析结果。
                </p>
                <textarea
                    value={rawTx}
                    onChange={(e) => setRawTx(e.target.value)}
                    rows={4}
                    className={`w-full px-4 py-3 rounded-lg font-mono text-xs ${
                        isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-slate-300'
                            : 'bg-slate-50 border-slate-200 text-slate-700'
                    } border`}
                    placeholder="输入原始交易数据..."
                />
            </div>

            {decodedTx && (
                <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        解析结果
                    </h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>版本</div>
                            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{decodedTx.version}</div>
                        </div>
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>输入数量</div>
                            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{decodedTx.inputCount}</div>
                        </div>
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>交易大小</div>
                            <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{decodedTx.size} bytes</div>
                        </div>
                        <div className={`p-4 rounded-xl ${decodedTx.valid ? isDarkMode ? 'bg-green-900/30' : 'bg-green-50' : isDarkMode ? 'bg-red-900/30' : 'bg-red-50'}`}>
                            <div className={`text-sm ${decodedTx.valid ? isDarkMode ? 'text-green-300' : 'text-green-600' : isDarkMode ? 'text-red-300' : 'text-red-600'}`}>格式验证</div>
                            <div className={`text-xl font-bold ${decodedTx.valid ? isDarkMode ? 'text-green-400' : 'text-green-700' : isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                {decodedTx.valid ? '有效' : '无效'}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Transaction Fields Reference */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    交易字段参考
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                                <th className="text-left py-2">字段</th>
                                <th className="text-left py-2">大小</th>
                                <th className="text-left py-2">说明</th>
                            </tr>
                        </thead>
                        <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                            {[
                                { field: 'version', size: '4 bytes', desc: '交易版本号' },
                                { field: 'input count', size: '1-9 bytes', desc: '输入数量（VarInt）' },
                                { field: 'inputs', size: '可变', desc: '输入列表' },
                                { field: 'output count', size: '1-9 bytes', desc: '输出数量（VarInt）' },
                                { field: 'outputs', size: '可变', desc: '输出列表' },
                                { field: 'locktime', size: '4 bytes', desc: '锁定时间' }
                            ].map((row) => (
                                <tr key={row.field} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <td className="py-2 font-mono text-amber-500">{row.field}</td>
                                    <td className="py-2">{row.size}</td>
                                    <td className="py-2">{row.desc}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// --- Quiz Section ---

const QuizSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="animate-in fade-in">
        <Quiz quizData={transactionQuiz} />
    </div>
);

// --- Card Component ---

const Card: React.FC<{ isDarkMode: boolean; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ isDarkMode, title, icon, children }) => (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
    </div>
);

export default TransactionDemo;
