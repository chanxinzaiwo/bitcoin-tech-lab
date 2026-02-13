import React, { useState, useEffect } from 'react';
import { Network, Send, Zap, Database, Server, Radio, Users, Share2, Globe, Activity } from 'lucide-react';

const P2PDemo = () => {
    const [activeTab, setActiveTab] = useState('intro');

    return (
        <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
             <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-indigo-600 text-white p-1.5 rounded-full">
                                <Network className="h-6 w-6" />
                            </div>
                            <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">P2P 网络</span>
                            <span className="font-bold text-lg tracking-tight text-slate-900 sm:hidden">P2P</span>
                        </div>
                        <div className="flex space-x-1">
                            {[{ id: 'intro', label: '原理介绍' }, { id: 'network', label: '广播模拟' }].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-indigo-50 text-indigo-700'
                                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
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
                {activeTab === 'intro' && <IntroSection changeTab={setActiveTab} />}
                {activeTab === 'network' && <NetworkSection />}
            </main>
        </div>
    );
};

const IntroSection = ({ changeTab }: { changeTab: (tab: string) => void }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">没有服务器的网络</h1>
            <p className="text-indigo-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                比特币没有“中央服务器”来处理交易。它是由遍布全球的数万台计算机（节点）组成的去中心化网络。<br/>
                这让它变得极难被关闭或审查。
            </p>
            <button
                onClick={() => changeTab('network')}
                className="mt-8 bg-white text-indigo-700 hover:bg-indigo-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                查看网络传播 <Share2 className="h-5 w-5" />
            </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card title="八卦协议 (Gossip)" icon={<Radio className="h-8 w-8 text-indigo-500" />}>
                节点之间通过类似“传八卦”的方式共享信息。当你发出一笔交易，你告诉身边的几个节点，它们再告诉它们的邻居，瞬间传遍全球。
            </Card>
            <Card title="内存池 (Mempool)" icon={<Database className="h-8 w-8 text-indigo-500" />}>
                在交易被矿工打包进区块之前，它们会暂存在每个节点的“内存池”中。这就像是一个待处理区的候车室。
            </Card>
            <Card title="全节点" icon={<Globe className="h-8 w-8 text-indigo-500" />}>
                任何人都可以运行全节点。它保存了比特币历史上的每一笔交易，并独立验证所有新数据的合法性。不信任，只验证。
            </Card>
        </div>
    </div>
);

const Card = ({ title, icon, children }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className="text-lg font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 leading-relaxed text-sm">{children}</p>
    </div>
);

interface Node {
    id: number;
    x: number;
    y: number;
    mempool: string[];
    isMining: boolean;
}

const NetworkSection = () => {
    // 5 Nodes in a pentagon shape
    const initialNodes: Node[] = [
        { id: 0, x: 50, y: 10, mempool: [], isMining: false },
        { id: 1, x: 90, y: 40, mempool: [], isMining: true }, // Miner
        { id: 2, x: 75, y: 90, mempool: [], isMining: false },
        { id: 3, x: 25, y: 90, mempool: [], isMining: false },
        { id: 4, x: 10, y: 40, mempool: [], isMining: true }, // Miner
    ];

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [flyingTxs, setFlyingTxs] = useState<{from: number, to: number, progress: number}[]>([]);
    
    // Connections (Adjacency List)
    const connections = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 2], [1, 4] // Mesh-ish
    ];

    const broadcastTx = () => {
        const txId = `Tx-${Math.floor(Math.random()*1000)}`;
        // Start from Node 0 (User's node)
        propagate(0, txId);
    };

    const propagate = (nodeId: number, txId: string) => {
        setNodes(prev => prev.map(n => n.id === nodeId && !n.mempool.includes(txId) 
            ? { ...n, mempool: [txId, ...n.mempool] } 
            : n
        ));

        const neighbors: number[] = [];
        connections.forEach(([a, b]) => {
            if (a === nodeId) neighbors.push(b);
            if (b === nodeId) neighbors.push(a);
        });

        neighbors.forEach(targetId => {
            setFlyingTxs(prev => [...prev, { from: nodeId, to: targetId, progress: 0 }]);
        });
    };

    // Animation Loop
    useEffect(() => {
        if (flyingTxs.length === 0) return;

        const interval = setInterval(() => {
            setFlyingTxs(prev => {
                const nextTxs: typeof flyingTxs = [];
                prev.forEach(tx => {
                    if (tx.progress < 1) {
                        nextTxs.push({ ...tx, progress: tx.progress + 0.05 });
                    } else {
                        setNodes(currentNodes => {
                            const targetNode = currentNodes.find(n => n.id === tx.to);
                            const sourceNode = currentNodes.find(n => n.id === tx.from);
                            const txContent = sourceNode?.mempool[0];

                            if (targetNode && txContent && !targetNode.mempool.includes(txContent)) {
                                setTimeout(() => propagate(tx.to, txContent), 100); 
                            }
                            return currentNodes;
                        });
                    }
                });
                return nextTxs;
            });
        }, 50);

        return () => clearInterval(interval);
    }, [flyingTxs.length]);

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* Visualization Canvas */}
            <div className="lg:col-span-2 bg-slate-50 rounded-3xl border border-slate-200 relative h-[500px] overflow-hidden shadow-inner">
                <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
                
                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {connections.map(([a, b], i) => {
                        const nA = nodes[a];
                        const nB = nodes[b];
                        return (
                            <line 
                                key={i} 
                                x1={`${nA.x}%`} y1={`${nA.y}%`} 
                                x2={`${nB.x}%`} y2={`${nB.y}%`} 
                                className="stroke-slate-300" 
                                strokeWidth="2" 
                            />
                        );
                    })}
                    {/* Flying Packets */}
                    {flyingTxs.map((tx, i) => {
                        const nA = nodes[tx.from];
                        const nB = nodes[tx.to];
                        const curX = nA.x + (nB.x - nA.x) * tx.progress;
                        const curY = nA.y + (nB.y - nA.y) * tx.progress;
                        return (
                            <circle key={i} cx={`${curX}%`} cy={`${curY}%`} r="6" className="fill-indigo-500 animate-ping" />
                        );
                    })}
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <div 
                        key={node.id}
                        className={`absolute w-16 h-16 -ml-8 -mt-8 rounded-full border-4 flex items-center justify-center transition-all duration-300 z-10 shadow-lg
                            ${node.mempool.length > 0 
                                ? 'bg-indigo-100 border-indigo-500 scale-110' 
                                : 'bg-white border-slate-300'
                            }`}
                        style={{ left: `${node.x}%`, top: `${node.y}%` }}
                    >
                        <div className="text-center">
                            {node.isMining ? <Database className="w-6 h-6 mx-auto text-amber-500"/> : <Server className="w-6 h-6 mx-auto text-slate-400"/>}
                        </div>
                        {/* Label */}
                        <div className="absolute -bottom-8 w-32 text-center text-xs font-bold text-slate-500 bg-white/80 px-2 py-0.5 rounded-full border border-slate-100">
                            {node.id === 0 ? "你的钱包" : node.isMining ? "矿工节点" : "全节点"}
                        </div>
                        {node.mempool.length > 0 && (
                            <div className="absolute -top-3 -right-3 w-6 h-6 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
                                {node.mempool.length}
                            </div>
                        )}
                    </div>
                ))}

                <div className="absolute bottom-6 left-6 right-6 flex justify-center z-20">
                    <button 
                        onClick={broadcastTx}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-3 rounded-full font-bold shadow-xl shadow-indigo-200 flex items-center gap-2 transition-transform active:scale-95"
                    >
                        <Radio className="w-5 h-5" /> 发起一笔新交易
                    </button>
                </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Activity className="w-5 h-5 text-indigo-500" /> 网络状态概览
                    </h3>
                    <div className="space-y-3">
                        {nodes.map(node => (
                            <div key={node.id} className="flex items-center justify-between text-sm bg-slate-50 p-3 rounded-lg border border-slate-100">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2.5 h-2.5 rounded-full ${node.mempool.length > 0 ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                    <span className="font-medium text-slate-700">Node {node.id}</span>
                                    {node.isMining && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold">Miner</span>}
                                </div>
                                <div className="font-mono text-slate-500 text-xs bg-white px-2 py-1 rounded border border-slate-200">
                                    {node.mempool.length > 0 ? `${node.mempool.length} txs` : 'Idle'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 text-sm text-indigo-900 leading-relaxed">
                    <h4 className="font-bold mb-2 flex items-center gap-2">
                        <Database className="w-4 h-4"/> 内存池 (Mempool)
                    </h4>
                    <p>
                        当你在图中看到节点变色并显示数字时，意味着交易已到达该节点的<strong>内存池</strong>。<br/><br/>
                        交易还没有上链！只有当黄色图标的<strong>矿工节点</strong>将这些交易打包进区块并算出哈希后，它们才算真正被确认。
                    </p>
                </div>
            </div>
        </div>
    );
};

export default P2PDemo;