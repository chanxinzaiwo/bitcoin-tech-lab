
import React, { useState } from 'react';
import { Split, GitMerge, AlertTriangle, CheckCircle2, XCircle, ArrowRight, Server } from 'lucide-react';
import { useLab } from '../store/LabContext';

const ForkDemo = () => {
    const { isDarkMode } = useLab();
    const [tab, setTab] = useState<'soft' | 'hard'>('soft');
    const [blocks, setBlocks] = useState([
        { id: 1, size: 0.8, validOld: true, validNew: true, name: 'Standard' },
    ]);
    const [forkHappened, setForkHappened] = useState(false);

    // Reset
    const reset = () => {
        setBlocks([{ id: 1, size: 0.8, validOld: true, validNew: true, name: 'Standard' }]);
        setForkHappened(false);
    };

    const mineBlock = (type: 'legacy' | 'new_rule' | 'bad') => {
        setBlocks(prev => {
            const last = prev[prev.length - 1];
            let newBlock;
            if (tab === 'soft') {
                // Soft Fork: New rule is stricter (e.g., < 0.5MB). Old limit < 1MB.
                if (type === 'legacy') {
                    // 0.8MB. Valid for Old (Yes < 1). Invalid for New (No < 0.5).
                    newBlock = { id: last.id + 1, size: 0.8, validOld: true, validNew: false, name: 'Legacy (0.8MB)' };
                } else {
                    // 0.4MB. Valid for Old (Yes < 1). Valid for New (Yes < 0.5).
                    newBlock = { id: last.id + 1, size: 0.4, validOld: true, validNew: true, name: 'Strict (0.4MB)' };
                }
            } else {
                // Hard Fork: New rule is looser (e.g., < 2MB). Old limit < 1MB.
                if (type === 'legacy') {
                    // 0.8MB. Valid for both.
                    newBlock = { id: last.id + 1, size: 0.8, validOld: true, validNew: true, name: 'Legacy (0.8MB)' };
                } else {
                    // 1.5MB. Invalid for Old (No < 1). Valid for New (Yes < 2).
                    newBlock = { id: last.id + 1, size: 1.5, validOld: false, validNew: true, name: 'Big (1.5MB)' };
                }
            }
            
            // Check for fork
            if (tab === 'soft') {
               // In soft fork, if majority miners upgrade, legacy blocks eventually get orphaned.
               // Here we just show compatibility.
            } else {
                if (!newBlock.validOld) setForkHappened(true);
            }
            
            return [...prev, newBlock];
        });
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-indigo-500 text-white p-1.5 rounded-full">
                        <Split className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">区块链分叉 (Forks)</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
                
                {/* Intro */}
                <div className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <GitMerge className="w-8 h-8" /> 升级共识规则
                    </h2>
                    <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl">
                        当区块链需要升级规则时（例如扩容或修复漏洞），旧节点和新节点之间会发生什么？
                        是平滑过渡（软分叉），还是网络分裂（硬分叉）？
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center">
                    <div className="flex bg-slate-200 dark:bg-slate-800 p-1 rounded-xl">
                        <button 
                            onClick={() => { setTab('soft'); reset(); }}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'soft' ? 'bg-white dark:bg-slate-600 shadow text-indigo-600 dark:text-white' : 'text-slate-500'}`}
                        >
                            软分叉 (Soft Fork)
                        </button>
                        <button 
                            onClick={() => { setTab('hard'); reset(); }}
                            className={`px-6 py-2 rounded-lg font-bold transition-all ${tab === 'hard' ? 'bg-white dark:bg-slate-600 shadow text-red-500 dark:text-white' : 'text-slate-500'}`}
                        >
                            硬分叉 (Hard Fork)
                        </button>
                    </div>
                </div>

                {/* Simulation Area */}
                <div className="grid lg:grid-cols-3 gap-8">
                    
                    {/* Controls */}
                    <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                        <h3 className="font-bold text-lg mb-4">
                            {tab === 'soft' ? '规则收紧 (Stricter)' : '规则放宽 (Looser)'}
                        </h3>
                        
                        <div className="space-y-4 mb-6 text-sm">
                            <div className="flex justify-between p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                <span>Old Rule:</span>
                                <span className="font-mono font-bold">Block &lt; 1MB</span>
                            </div>
                            <div className={`flex justify-between p-2 rounded ${tab === 'soft' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                <span>New Rule:</span>
                                <span className="font-mono font-bold">
                                    {tab === 'soft' ? 'Block < 0.5MB' : 'Block < 2.0MB'}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button 
                                onClick={() => mineBlock('legacy')}
                                className="w-full py-3 border-2 border-slate-300 rounded-xl font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            >
                                挖旧格式区块 (0.8MB)
                            </button>
                            <button 
                                onClick={() => mineBlock('new_rule')}
                                className={`w-full py-3 text-white rounded-xl font-bold shadow-lg transition-transform active:scale-95 ${tab === 'soft' ? 'bg-green-600 hover:bg-green-500' : 'bg-red-600 hover:bg-red-500'}`}
                            >
                                挖新格式区块 ({tab === 'soft' ? '0.4MB' : '1.5MB'})
                            </button>
                            <button onClick={reset} className="w-full py-2 text-slate-400 text-sm hover:text-slate-500 mt-4">
                                重置链
                            </button>
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="lg:col-span-2 space-y-6">
                        
                        {/* Old Nodes View */}
                        <div className={`p-4 rounded-xl border-l-4 border-slate-400 ${isDarkMode ? 'bg-slate-900 border-y border-r border-slate-800' : 'bg-white border-y border-r border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Server className="w-5 h-5 text-slate-500" />
                                <span className="font-bold text-slate-500">旧节点 (未升级)</span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {blocks.map((b, i) => (
                                    <div key={i} className={`flex-shrink-0 w-20 h-20 rounded-lg flex flex-col items-center justify-center text-xs border-2 ${
                                        b.validOld 
                                            ? 'border-slate-400 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' 
                                            : 'border-red-500 bg-red-50 text-red-500 opacity-50'
                                    }`}>
                                        <div className="font-bold">#{b.id}</div>
                                        <div>{b.size}MB</div>
                                        {!b.validOld && <XCircle className="w-4 h-4 mt-1" />}
                                    </div>
                                ))}
                            </div>
                            {!blocks[blocks.length-1].validOld && (
                                <div className="text-red-500 text-xs mt-2 font-bold flex items-center gap-1">
                                    <AlertTriangle className="w-3 h-3"/> 拒绝新区块！链停止同步。
                                </div>
                            )}
                        </div>

                        {/* New Nodes View */}
                        <div className={`p-4 rounded-xl border-l-4 ${tab === 'soft' ? 'border-green-500' : 'border-red-500'} ${isDarkMode ? 'bg-slate-900 border-y border-r border-slate-800' : 'bg-white border-y border-r border-slate-200'}`}>
                            <div className="flex items-center gap-2 mb-3">
                                <Server className={`w-5 h-5 ${tab === 'soft' ? 'text-green-500' : 'text-red-500'}`} />
                                <span className={`font-bold ${tab === 'soft' ? 'text-green-600' : 'text-red-600'}`}>
                                    新节点 (已升级)
                                </span>
                            </div>
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {blocks.map((b, i) => (
                                    <div key={i} className={`flex-shrink-0 w-20 h-20 rounded-lg flex flex-col items-center justify-center text-xs border-2 ${
                                        b.validNew 
                                            ? (tab === 'soft' ? 'border-green-500 bg-green-50 text-green-700' : 'border-red-500 bg-red-50 text-red-700') 
                                            : 'border-slate-300 bg-slate-100 text-slate-400 opacity-50'
                                    }`}>
                                        <div className="font-bold">#{b.id}</div>
                                        <div>{b.size}MB</div>
                                        {!b.validNew && <XCircle className="w-4 h-4 mt-1" />}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Result Analysis */}
                        <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h4 className="font-bold mb-2">结果分析:</h4>
                            {tab === 'soft' ? (
                                <p className="text-sm text-slate-500">
                                    <strong>向前兼容 (Backward Compatible)：</strong> 旧节点认为新规则产生的区块（0.4MB）依然合法（因为 0.4 {'<'} 1）。
                                    只要新算力占多数，旧节点会跟随新链，网络不会分裂。这就是为什么 SegWit 是软分叉。
                                </p>
                            ) : (
                                <p className="text-sm text-slate-500">
                                    <strong>不兼容 (Incompatible)：</strong> 新规则产生的区块（1.5MB）被旧节点直接视为非法（{'>'}1MB）。
                                    旧节点会停留在最后一个旧块上，或者分叉出一条自己的小区块链。网络永久分裂（如 BTC vs BCH）。
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
};

export default ForkDemo;
