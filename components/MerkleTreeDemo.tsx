import React, { useState, useMemo, useCallback } from 'react';
import { GitBranch, Hash, Plus, Trash2, CheckCircle2, XCircle, ArrowRight, Info, Search, ShieldCheck, Zap, Database, Eye, RefreshCw } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { merkleTreeQuiz } from '../data/quizData';

// --- Utility Functions ---

// Simple SHA-256 simulation (for demo purposes, uses a deterministic hash-like function)
const simpleHash = (input: string): string => {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const char = input.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0');
    // Create a more realistic looking hash
    const expanded = hex + hex.split('').reverse().join('') + hex;
    return expanded.slice(0, 16);
};

// Double SHA-256 (Bitcoin style)
const doubleHash = (input: string): string => {
    return simpleHash(simpleHash(input));
};

// Combine two hashes (for Merkle tree)
const combineHashes = (left: string, right: string): string => {
    return doubleHash(left + right);
};

// --- Types ---

interface MerkleNode {
    hash: string;
    left?: MerkleNode;
    right?: MerkleNode;
    isLeaf: boolean;
    data?: string;
    index?: number;
}

interface Transaction {
    id: string;
    data: string;
    hash: string;
}

// --- Merkle Tree Builder ---

const buildMerkleTree = (transactions: Transaction[]): MerkleNode | null => {
    if (transactions.length === 0) return null;

    // Create leaf nodes
    let nodes: MerkleNode[] = transactions.map((tx, index) => ({
        hash: tx.hash,
        isLeaf: true,
        data: tx.data,
        index
    }));

    // If odd number of nodes, duplicate the last one
    while (nodes.length > 1) {
        const newLevel: MerkleNode[] = [];

        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i];
            const right = nodes[i + 1] || nodes[i]; // Duplicate if odd

            const parentHash = combineHashes(left.hash, right.hash);
            newLevel.push({
                hash: parentHash,
                left,
                right: nodes[i + 1] ? right : { ...right, hash: right.hash }, // Mark as duplicate
                isLeaf: false
            });
        }

        nodes = newLevel;
    }

    return nodes[0];
};

// Generate Merkle Proof
const getMerkleProof = (transactions: Transaction[], targetIndex: number): { hash: string; position: 'left' | 'right' }[] => {
    if (transactions.length === 0 || targetIndex >= transactions.length) return [];

    const proof: { hash: string; position: 'left' | 'right' }[] = [];
    let nodes = transactions.map(tx => tx.hash);
    let index = targetIndex;

    while (nodes.length > 1) {
        const newLevel: string[] = [];

        for (let i = 0; i < nodes.length; i += 2) {
            const left = nodes[i];
            const right = nodes[i + 1] || nodes[i];

            if (i === index || i + 1 === index) {
                if (i === index) {
                    proof.push({ hash: right, position: 'right' });
                } else {
                    proof.push({ hash: left, position: 'left' });
                }
            }

            newLevel.push(combineHashes(left, right));
        }

        index = Math.floor(index / 2);
        nodes = newLevel;
    }

    return proof;
};

// Verify Merkle Proof
const verifyMerkleProof = (leafHash: string, proof: { hash: string; position: 'left' | 'right' }[], rootHash: string): boolean => {
    let currentHash = leafHash;

    for (const step of proof) {
        if (step.position === 'left') {
            currentHash = combineHashes(step.hash, currentHash);
        } else {
            currentHash = combineHashes(currentHash, step.hash);
        }
    }

    return currentHash === rootHash;
};

// --- Main Component ---

const MerkleTreeDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'builder', label: '构建演示' },
        { id: 'proof', label: '验证证明' },
        { id: 'spv', label: 'SPV 应用' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-green-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-green-600 text-white p-1.5 rounded-full">
                                <GitBranch className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>默克尔树</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Merkle</span>
                        </div>
                        <div className="flex space-x-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-green-500/10 text-green-500'
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
                {activeTab === 'builder' && <TreeBuilder isDarkMode={isDarkMode} />}
                {activeTab === 'proof' && <ProofVerifier isDarkMode={isDarkMode} />}
                {activeTab === 'spv' && <SPVSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// --- Intro Section ---

const IntroSection: React.FC<{ isDarkMode: boolean; changeTab: (tab: string) => void }> = ({ isDarkMode, changeTab }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">默克尔树：区块链的数据指纹</h1>
            <p className="text-green-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                默克尔树是一种哈希树结构，可以高效地验证大量数据的完整性。
                比特币用它来组织区块中的所有交易，使得轻节点只需下载区块头就能验证交易存在性。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">32 字节</div>
                    <div className="text-sm text-green-200">默克尔根大小</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">O(log n)</div>
                    <div className="text-sm text-green-200">验证复杂度</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">~1979</div>
                    <div className="text-sm text-green-200">Ralph Merkle 发明</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('builder')}
                className="mt-8 bg-white text-green-700 hover:bg-green-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                开始构建默克尔树 <ArrowRight className="h-5 w-5" />
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card isDarkMode={isDarkMode} title="数据完整性" icon={<ShieldCheck className="h-8 w-8 text-green-500" />}>
                任何交易的改变都会导致默克尔根变化，这使得篡改变得不可能。根哈希就像整个区块交易的"数字指纹"。
            </Card>
            <Card isDarkMode={isDarkMode} title="高效验证" icon={<Zap className="h-8 w-8 text-green-500" />}>
                验证一笔交易只需要 log₂(n) 个哈希值。即使区块有 4000 笔交易，也只需约 12 个哈希即可验证。
            </Card>
            <Card isDarkMode={isDarkMode} title="SPV 支持" icon={<Database className="h-8 w-8 text-green-500" />}>
                简单支付验证（SPV）允许轻钱包无需下载完整区块链即可验证交易，这正是依靠默克尔证明实现的。
            </Card>
        </div>

        {/* How It Works */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                默克尔树如何工作？
            </h2>
            <div className="space-y-4">
                {[
                    { step: '1', title: '哈希叶节点', desc: '将每笔交易进行双重 SHA-256 哈希，得到叶节点' },
                    { step: '2', title: '两两配对', desc: '将相邻的两个哈希值拼接后再次哈希，形成父节点' },
                    { step: '3', title: '向上聚合', desc: '重复配对过程，直到只剩一个节点——默克尔根' },
                    { step: '4', title: '存入区块头', desc: '32 字节的默克尔根被存入区块头，代表所有交易' }
                ].map((item) => (
                    <div key={item.step} className={`flex items-start gap-4 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center font-bold flex-shrink-0">
                            {item.step}
                        </div>
                        <div>
                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Visual Diagram */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                结构示意图
            </h2>
            <div className="flex flex-col items-center space-y-4">
                {/* Root */}
                <div className="flex flex-col items-center">
                    <div className={`px-4 py-2 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-green-100 text-green-800 border border-green-300'}`}>
                        默克尔根 (Root)
                    </div>
                    <div className={`w-px h-6 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                </div>

                {/* Level 1 */}
                <div className="flex items-center gap-8">
                    <div className="flex flex-col items-center">
                        <div className={`px-3 py-1.5 rounded font-mono text-xs ${isDarkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                            Hash(AB)
                        </div>
                        <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className={`px-3 py-1.5 rounded font-mono text-xs ${isDarkMode ? 'bg-emerald-900/50 text-emerald-300' : 'bg-emerald-100 text-emerald-800'}`}>
                            Hash(CD)
                        </div>
                        <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                    </div>
                </div>

                {/* Level 2 (Leaves) */}
                <div className="flex items-center gap-4">
                    {['TxA', 'TxB', 'TxC', 'TxD'].map((tx, i) => (
                        <div key={tx} className={`px-3 py-1.5 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                            {tx}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- Tree Builder Section ---

const TreeBuilder: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([
        { id: '1', data: 'Alice → Bob: 1 BTC', hash: '' },
        { id: '2', data: 'Bob → Charlie: 0.5 BTC', hash: '' },
        { id: '3', data: 'Charlie → Dave: 0.3 BTC', hash: '' },
        { id: '4', data: 'Dave → Eve: 0.2 BTC', hash: '' },
    ]);
    const [newTxData, setNewTxData] = useState('');
    const [highlightedNode, setHighlightedNode] = useState<string | null>(null);

    // Calculate hashes for transactions
    const txWithHashes = useMemo(() =>
        transactions.map(tx => ({
            ...tx,
            hash: doubleHash(tx.data)
        })),
        [transactions]
    );

    const merkleTree = useMemo(() => buildMerkleTree(txWithHashes), [txWithHashes]);

    const addTransaction = () => {
        if (!newTxData.trim()) return;
        const newTx: Transaction = {
            id: Date.now().toString(),
            data: newTxData,
            hash: ''
        };
        setTransactions([...transactions, newTx]);
        setNewTxData('');
    };

    const removeTransaction = (id: string) => {
        if (transactions.length <= 1) return;
        setTransactions(transactions.filter(tx => tx.id !== id));
    };

    const renderTree = (node: MerkleNode | null, level: number = 0, isRoot: boolean = true): React.ReactNode => {
        if (!node) return null;

        const isHighlighted = highlightedNode === node.hash;
        const nodeColor = isRoot
            ? (isDarkMode ? 'bg-green-900/50 border-green-600 text-green-300' : 'bg-green-100 border-green-400 text-green-800')
            : node.isLeaf
                ? (isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-300 text-slate-700')
                : (isDarkMode ? 'bg-emerald-900/50 border-emerald-700 text-emerald-300' : 'bg-emerald-50 border-emerald-300 text-emerald-700');

        return (
            <div className="flex flex-col items-center">
                <div
                    className={`px-3 py-2 rounded-lg border font-mono text-xs cursor-pointer transition-all ${nodeColor} ${isHighlighted ? 'ring-2 ring-green-500 scale-105' : ''}`}
                    onMouseEnter={() => setHighlightedNode(node.hash)}
                    onMouseLeave={() => setHighlightedNode(null)}
                >
                    <div className="font-bold mb-1">
                        {isRoot ? '根' : node.isLeaf ? `叶 ${(node.index ?? 0) + 1}` : '节点'}
                    </div>
                    <div className="opacity-75">{node.hash.slice(0, 8)}...</div>
                    {node.isLeaf && node.data && (
                        <div className={`text-xs mt-1 truncate max-w-[120px] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {node.data}
                        </div>
                    )}
                </div>

                {(node.left || node.right) && (
                    <>
                        <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                        <div className="flex gap-4">
                            {node.left && (
                                <div className="flex flex-col items-center">
                                    <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                                    {renderTree(node.left, level + 1, false)}
                                </div>
                            )}
                            {node.right && (
                                <div className="flex flex-col items-center">
                                    <div className={`w-px h-4 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
                                    {renderTree(node.right, level + 1, false)}
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            {/* Header */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <GitBranch className="w-6 h-6 text-green-500" />
                    交互式默克尔树构建器
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    添加或删除交易，观察默克尔树如何实时变化。注意当任意交易改变时，根哈希也会完全改变。
                </p>
            </div>

            {/* Transaction List */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    交易列表 ({transactions.length})
                </h3>

                <div className="space-y-2 mb-4">
                    {txWithHashes.map((tx, index) => (
                        <div
                            key={tx.id}
                            className={`flex items-center gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                        >
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'}`}>
                                {index + 1}
                            </span>
                            <div className="flex-1">
                                <div className={`text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{tx.data}</div>
                                <div className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {tx.hash}
                                </div>
                            </div>
                            <button
                                onClick={() => removeTransaction(tx.id)}
                                disabled={transactions.length <= 1}
                                className={`p-2 rounded-lg transition-colors ${
                                    transactions.length <= 1
                                        ? 'opacity-30 cursor-not-allowed'
                                        : isDarkMode ? 'hover:bg-red-900/50 text-red-400' : 'hover:bg-red-50 text-red-500'
                                }`}
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>

                {/* Add Transaction */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newTxData}
                        onChange={(e) => setNewTxData(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTransaction()}
                        placeholder="输入新交易数据，如：Frank → Grace: 0.1 BTC"
                        className={`flex-1 px-4 py-2 rounded-lg border text-sm ${
                            isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400'
                        }`}
                    />
                    <button
                        onClick={addTransaction}
                        disabled={!newTxData.trim()}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                            newTxData.trim()
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                        }`}
                    >
                        <Plus className="w-4 h-4" />
                        添加
                    </button>
                </div>
            </div>

            {/* Merkle Tree Visualization */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        默克尔树结构
                    </h3>
                    {merkleTree && (
                        <div className={`px-3 py-1.5 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-100 text-green-700'}`}>
                            根: {merkleTree.hash}
                        </div>
                    )}
                </div>

                <div className="overflow-x-auto pb-4">
                    <div className="flex justify-center min-w-max py-4">
                        {renderTree(merkleTree)}
                    </div>
                </div>

                <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-start gap-2">
                        <Info className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            尝试添加或删除交易，观察整棵树的变化。如果交易数是奇数，最后一个交易会被复制一份来配对。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Proof Verifier Section ---

const ProofVerifier: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [transactions] = useState<Transaction[]>([
        { id: '1', data: 'Alice → Bob: 1 BTC', hash: '' },
        { id: '2', data: 'Bob → Charlie: 0.5 BTC', hash: '' },
        { id: '3', data: 'Charlie → Dave: 0.3 BTC', hash: '' },
        { id: '4', data: 'Dave → Eve: 0.2 BTC', hash: '' },
        { id: '5', data: 'Eve → Frank: 0.15 BTC', hash: '' },
        { id: '6', data: 'Frank → Grace: 0.1 BTC', hash: '' },
        { id: '7', data: 'Grace → Henry: 0.08 BTC', hash: '' },
        { id: '8', data: 'Henry → Ivy: 0.05 BTC', hash: '' },
    ]);

    const [selectedTxIndex, setSelectedTxIndex] = useState(0);
    const [verificationStep, setVerificationStep] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);

    const txWithHashes = useMemo(() =>
        transactions.map(tx => ({
            ...tx,
            hash: doubleHash(tx.data)
        })),
        [transactions]
    );

    const merkleTree = useMemo(() => buildMerkleTree(txWithHashes), [txWithHashes]);
    const proof = useMemo(() => getMerkleProof(txWithHashes, selectedTxIndex), [txWithHashes, selectedTxIndex]);

    const startVerification = useCallback(() => {
        setVerificationStep(0);
        setIsVerifying(true);

        let step = 0;
        const interval = setInterval(() => {
            step++;
            setVerificationStep(step);
            if (step >= proof.length + 1) {
                clearInterval(interval);
                setTimeout(() => setIsVerifying(false), 1000);
            }
        }, 800);
    }, [proof.length]);

    const isVerified = verificationStep > proof.length && merkleTree
        ? verifyMerkleProof(txWithHashes[selectedTxIndex].hash, proof, merkleTree.hash)
        : null;

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Search className="w-6 h-6 text-green-500" />
                    默克尔证明验证器
                </h2>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    选择一笔交易，观察如何使用默克尔证明验证其存在性。只需 log₂(n) 个哈希值即可完成验证。
                </p>
            </div>

            {/* Transaction Selector */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    选择要验证的交易
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {txWithHashes.map((tx, index) => (
                        <button
                            key={tx.id}
                            onClick={() => {
                                setSelectedTxIndex(index);
                                setVerificationStep(0);
                                setIsVerifying(false);
                            }}
                            className={`p-3 rounded-lg text-left transition-all ${
                                selectedTxIndex === index
                                    ? 'bg-green-600 text-white'
                                    : isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            <div className="text-xs font-bold mb-1">交易 #{index + 1}</div>
                            <div className="text-xs truncate">{tx.data}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Proof Visualization */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        默克尔证明路径
                    </h3>
                    <button
                        onClick={startVerification}
                        disabled={isVerifying}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors ${
                            isVerifying
                                ? isDarkMode ? 'bg-slate-800 text-slate-500' : 'bg-slate-100 text-slate-400'
                                : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                    >
                        <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
                        {isVerifying ? '验证中...' : '开始验证'}
                    </button>
                </div>

                {/* Proof Steps */}
                <div className="space-y-3">
                    {/* Starting hash */}
                    <div className={`flex items-center gap-3 p-4 rounded-lg ${
                        verificationStep >= 0
                            ? isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                            : isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                    }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isDarkMode ? 'bg-green-900 text-green-300' : 'bg-green-100 text-green-700'
                        }`}>
                            0
                        </div>
                        <div className="flex-1">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                目标交易哈希
                            </div>
                            <div className={`font-mono text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {txWithHashes[selectedTxIndex].hash}
                            </div>
                        </div>
                    </div>

                    {/* Proof steps */}
                    {proof.map((step, index) => (
                        <div key={index} className={`flex items-center gap-3 p-4 rounded-lg transition-all ${
                            verificationStep > index
                                ? isDarkMode ? 'bg-emerald-900/30 border border-emerald-700' : 'bg-emerald-50 border border-emerald-200'
                                : isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                        }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                verificationStep > index
                                    ? isDarkMode ? 'bg-emerald-900 text-emerald-300' : 'bg-emerald-100 text-emerald-700'
                                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                            }`}>
                                {index + 1}
                            </div>
                            <div className="flex-1">
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    与 {step.position === 'left' ? '左侧' : '右侧'} 兄弟节点合并
                                </div>
                                <div className={`font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    + {step.hash}
                                </div>
                            </div>
                            {verificationStep > index && (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                            )}
                        </div>
                    ))}

                    {/* Final result */}
                    <div className={`flex items-center gap-3 p-4 rounded-lg ${
                        isVerified === true
                            ? isDarkMode ? 'bg-green-900/50 border border-green-600' : 'bg-green-100 border border-green-300'
                            : isVerified === false
                                ? isDarkMode ? 'bg-red-900/50 border border-red-600' : 'bg-red-100 border border-red-300'
                                : isDarkMode ? 'bg-slate-800' : 'bg-slate-50'
                    }`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                            isVerified === true
                                ? 'bg-green-600 text-white'
                                : isVerified === false
                                    ? 'bg-red-600 text-white'
                                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {isVerified === true ? <CheckCircle2 className="w-5 h-5" /> : isVerified === false ? <XCircle className="w-5 h-5" /> : '?'}
                        </div>
                        <div className="flex-1">
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                与默克尔根比对
                            </div>
                            <div className={`font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {merkleTree?.hash}
                            </div>
                        </div>
                        {isVerified !== null && (
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                isVerified
                                    ? 'bg-green-600 text-white'
                                    : 'bg-red-600 text-white'
                            }`}>
                                {isVerified ? '验证通过' : '验证失败'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className={`mt-6 p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {transactions.length}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>总交易数</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {proof.length}
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>证明哈希数</div>
                        </div>
                        <div>
                            <div className={`text-2xl font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                                {Math.round((proof.length / transactions.length) * 100)}%
                            </div>
                            <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>数据节省</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- SPV Section ---

const SPVSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Eye className="w-8 h-8" /> SPV 简单支付验证
            </h1>
            <p className="text-cyan-50 text-lg leading-relaxed max-w-3xl">
                简单支付验证（SPV）让轻钱包无需下载完整区块链即可验证交易。
                通过默克尔证明，手机钱包只需约 80 字节的区块头加上少量哈希即可确认交易。
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Database className="w-5 h-5 text-cyan-500" />
                    全节点 vs SPV 节点
                </h3>
                <div className="space-y-4">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>全节点</div>
                        <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            <li>• 下载完整区块链 (~500+ GB)</li>
                            <li>• 验证所有交易和区块</li>
                            <li>• 完全无需信任第三方</li>
                            <li>• 需要大量存储和带宽</li>
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}>
                        <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>SPV 节点</div>
                        <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-cyan-300' : 'text-cyan-700'}`}>
                            <li>• 只下载区块头 (~50 MB)</li>
                            <li>• 使用默克尔证明验证交易</li>
                            <li>• 假设最长链有效（信任矿工）</li>
                            <li>• 适合移动设备和轻钱包</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Zap className="w-5 h-5 text-cyan-500" />
                    SPV 验证流程
                </h3>
                <div className="space-y-3">
                    {[
                        { step: '1', title: '获取区块头', desc: '从网络下载包含目标交易的区块头' },
                        { step: '2', title: '请求默克尔证明', desc: '向全节点请求交易的默克尔路径' },
                        { step: '3', title: '计算验证', desc: '使用证明路径计算默克尔根' },
                        { step: '4', title: '比对根哈希', desc: '与区块头中的默克尔根比对' },
                        { step: '5', title: '确认深度', desc: '检查区块后是否有足够的确认' }
                    ].map((item) => (
                        <div key={item.step} className={`flex items-start gap-3 p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className="w-6 h-6 rounded-full bg-cyan-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                                {item.step}
                            </div>
                            <div>
                                <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</div>
                                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Data Comparison */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                数据量对比（验证一笔交易）
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: '完整区块', size: '~1.5 MB', percent: 100, color: 'slate' },
                    { label: '区块头', size: '80 字节', percent: 0.005, color: 'cyan' },
                    { label: '默克尔证明', size: '~400 字节', percent: 0.03, color: 'green' },
                    { label: 'SPV 总计', size: '~500 字节', percent: 0.035, color: 'emerald' }
                ].map((item) => (
                    <div key={item.label} className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className={`text-2xl font-bold mb-1 ${
                            item.color === 'slate'
                                ? isDarkMode ? 'text-slate-400' : 'text-slate-600'
                                : isDarkMode ? `text-${item.color}-400` : `text-${item.color}-600`
                        }`}>
                            {item.size}
                        </div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{item.label}</div>
                        <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                            {item.percent < 1 ? `${item.percent}%` : '基准'}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* Security Note */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
                <Info className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                    <div className={`font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>安全注意事项</div>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                        SPV 节点信任最长链是有效的，这意味着如果攻击者控制了超过 50% 的算力，可以欺骗 SPV 节点。
                        对于大额交易，建议使用全节点或等待更多确认。
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- Quiz Section ---

const QuizSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="animate-in fade-in">
        <Quiz quizData={merkleTreeQuiz} />
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

export default MerkleTreeDemo;
