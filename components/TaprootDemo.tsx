
import React, { useState, useEffect } from 'react';
import { Workflow, GitBranch, Eye, EyeOff, Lock, Key, CheckCircle, ArrowDown, FileCode, Shield, Hash, ArrowRight, ChevronRight, CornerDownRight, Scroll, LayoutList, Layers, ShieldCheck, Plus, Scale, DollarSign, User, Gavel, Baby, HelpCircle, X, ChevronLeft, Box, Fingerprint, Scissors, RefreshCcw, Combine, Terminal, FileSignature, Info, Award } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { taprootQuiz } from '../data/quizData';

const TaprootDemo = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '故事模式', fullLabel: '小白故事模式' },
        { id: 'demo', label: '技术模式', fullLabel: '极客技术模式' },
        { id: 'usecases', label: '应用场景', fullLabel: '实际应用场景' },
        { id: 'quiz', label: '测验', fullLabel: '知识测验' }
    ];

    return (
        <div className={`font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-purple-600 text-white p-1.5 rounded-full">
                                <Workflow className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Taproot & MAST</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>MAST</span>
                        </div>
                        <div className="flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-purple-500/10 text-purple-500'
                                            : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
                                    }`}
                                >
                                    <span className="hidden sm:inline">{tab.fullLabel}</span>
                                    <span className="sm:hidden">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <StoryView isDarkMode={isDarkMode} onChangeTab={() => setActiveTab('demo')} />}
                {activeTab === 'demo' && <InteractiveView isDarkMode={isDarkMode} />}
                {activeTab === 'usecases' && <UseCasesView isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// --- Tab 1: Beginner Story Mode (Revamped Wizard) ---
const StoryView = ({ isDarkMode, onChangeTab }: { isDarkMode: boolean, onChangeTab: () => void }) => {
    const [step, setStep] = useState(0);

    const steps = [
        { title: "场景", desc: "富翁的规则" },
        { title: "旧账本", desc: "隐私泄露" },
        { title: "魔法I", desc: "哈希压缩" },
        { title: "魔法II", desc: "折叠成树" },
        { title: "取款", desc: "默克尔证明" },
        { title: "总结", desc: "Taproot优势" }
    ];

    const nextStep = () => setStep(s => Math.min(s + 1, steps.length - 1));
    const prevStep = () => setStep(s => Math.max(s - 1, 0));

    // --- Step Components ---

    // Step 0: Scenario
    const ScenarioStep = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">第一幕：富翁的秘密合约</h2>
                <p className="text-slate-500">一位比特币富翁将 100 BTC 存入了一个智能合约，并设定了 3 种取款条件。</p>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
                <RuleCard 
                    icon={User} label="规则 A (常用)" 
                    desc="爸爸亲自签名" color="bg-blue-100 text-blue-700 border-blue-200"
                    detail="平时爸爸想花钱时使用。"
                />
                <RuleCard 
                    icon={Baby} label="规则 B (备用)" 
                    desc="儿子满18岁签名" color="bg-orange-100 text-orange-700 border-orange-200"
                    detail="如果爸爸不在了，儿子成年后可取。"
                />
                <RuleCard 
                    icon={Gavel} label="规则 C (紧急)" 
                    desc="律师 + 妈妈多签" color="bg-red-100 text-red-700 border-red-200"
                    detail="特殊紧急情况下的备份方案。"
                />
            </div>
            <div className="bg-slate-100 p-4 rounded-xl text-center text-slate-600 text-sm">
                现在，富翁想买一杯咖啡（触发 <strong>规则 A</strong>）。<br/>
                在区块链上，他需要向世界展示什么？
            </div>
        </div>
    );

    // Step 1: Legacy Problem
    const LegacyStep = () => (
        <div className="space-y-6 animate-in slide-in-from-right duration-500">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-2 text-red-600 flex items-center justify-center gap-2">
                    <Scroll className="w-6 h-6"/> 第二幕：旧方式的尴尬 (Legacy)
                </h2>
                <p className="text-slate-500">就像一张必须全部展开的长卷轴。</p>
            </div>

            <div className="relative max-w-md mx-auto bg-[#fffbeb] border-2 border-slate-300 rounded-lg p-6 shadow-xl transform rotate-1">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-3 py-1 rounded-full text-xs font-bold shadow">
                    上链数据 (Script)
                </div>
                
                <div className="space-y-4 opacity-100 transition-opacity">
                    <div className="flex items-center gap-3 p-3 bg-white border-2 border-green-500 rounded-lg shadow-sm">
                        <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                        <div>
                            <div className="font-bold text-slate-800">1. IF (爸爸签名) ✅</div>
                            <div className="text-xs text-slate-500">执行中...</div>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-3 p-3 bg-slate-100 border border-slate-200 rounded-lg opacity-60">
                        <Eye className="w-6 h-6 text-red-500 flex-shrink-0 animate-pulse" />
                        <div>
                            <div className="font-bold text-slate-500">2. ELSE IF (儿子 {'>'} 18岁)</div>
                            <div className="text-xs text-red-500 font-bold">未使用但已暴露！</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-3 bg-slate-100 border border-slate-200 rounded-lg opacity-60">
                        <Eye className="w-6 h-6 text-red-500 flex-shrink-0 animate-pulse" />
                        <div>
                            <div className="font-bold text-slate-500">3. ELSE (律师 + 妈妈)</div>
                            <div className="text-xs text-red-500 font-bold">未使用但已暴露！</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-sm text-red-800 flex gap-3 items-start">
                <EyeOff className="w-5 h-5 flex-shrink-0 mt-0.5"/>
                <div>
                    <strong>隐私灾难：</strong> 
                    全世界都知道了你有儿子和律师的备用方案。这不仅泄露隐私，而且数据量大，手续费昂贵。
                </div>
            </div>
        </div>
    );

    // Step 2: Hashing (The Magic Trick 1)
    const HashingStep = () => {
        const [hashed, setHashed] = useState(false);

        return (
            <div className="space-y-8 animate-in slide-in-from-right duration-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2 text-purple-600 flex items-center justify-center gap-2">
                        <Fingerprint className="w-6 h-6"/> 魔法 I：哈希 (Hash)
                    </h2>
                    <p className="text-slate-500">为了保护隐私，我们首先要把规则变成“指纹”。</p>
                </div>

                <div className="flex flex-col items-center gap-8">
                    <div className="grid md:grid-cols-3 gap-4 w-full">
                        {[
                            { label: "规则 A", content: "爸爸签名...", color: "blue", hash: "H(A)" },
                            { label: "规则 B", content: "儿子满18岁...", color: "orange", hash: "H(B)" },
                            { label: "规则 C", content: "律师+妈妈...", color: "red", hash: "H(C)" }
                        ].map((rule, i) => (
                            <div key={i} className={`relative p-4 rounded-xl border-2 transition-all duration-700 flex flex-col items-center justify-center h-32 ${hashed ? 'bg-slate-800 border-slate-700' : `bg-${rule.color}-50 border-${rule.color}-200`}`}>
                                {hashed ? (
                                    <div className="animate-in zoom-in duration-300 text-center">
                                        <Fingerprint className="w-8 h-8 text-white mx-auto mb-2"/>
                                        <div className="font-mono font-bold text-white text-lg">{rule.hash}</div>
                                        <div className="text-[10px] text-slate-400">内容已隐藏</div>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className={`font-bold text-${rule.color}-700`}>{rule.label}</div>
                                        <div className="text-xs text-slate-500 mt-1">{rule.content}</div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => setHashed(!hashed)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 transition-transform active:scale-95"
                    >
                        {hashed ? <RefreshCcw className="w-4 h-4"/> : <Scissors className="w-4 h-4"/>}
                        {hashed ? "重置演示" : "施展哈希魔法"}
                    </button>

                    {hashed && (
                        <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-sm text-purple-800 animate-in fade-in slide-in-from-bottom-2 text-center max-w-2xl">
                            <strong>发生了什么？</strong><br/>
                            原本冗长的规则被压缩成了短短的哈希值。除了持有原始规则的人，没人知道这些哈希代表什么。
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Step 3: Tree Building (The Magic Trick 2)
    const TreeBuilderStep = () => {
        const [stage, setStage] = useState(0); // 0: Start, 1: H(BC) created, 2: Root created
        const [isAnimating, setIsAnimating] = useState(false);

        // Define exact positions to align static nodes and flying particles
        const pos = {
            a: { left: '20%', top: '340px' },
            b: { left: '60%', top: '340px' },
            c: { left: '80%', top: '340px' },
            bc: { left: '70%', top: '220px' },
            root: { left: '45%', top: '80px' }
        };

        const runStage1 = () => {
            setIsAnimating(true);
            setTimeout(() => {
                setStage(1);
                setIsAnimating(false);
            }, 1000);
        };

        const runStage2 = () => {
            setIsAnimating(true);
            setTimeout(() => {
                setStage(2);
                setIsAnimating(false);
            }, 1000);
        };

        const reset = () => { setStage(0); setIsAnimating(false); };

        return (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2 text-purple-600 flex items-center justify-center gap-2">
                        <GitBranch className="w-6 h-6"/> 魔法 II：折叠成树 (MAST)
                    </h2>
                    <p className="text-slate-500">如何把三个指纹变成一个？我们需要像搭建金字塔一样，层层向上哈希。</p>
                </div>

                <div className="relative h-[400px] border-b border-slate-200 bg-slate-50 rounded-2xl overflow-hidden shadow-inner flex flex-col justify-end pb-8">
                    
                    {/* Connecting Lines SVG Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {/* Lines for Stage 1 (B+C -> H(BC)) */}
                        <path 
                            d="M 60% 340 L 70% 220" 
                            className={`transition-all duration-700 ${stage >= 1 ? 'stroke-purple-300' : 'stroke-transparent'}`}
                            strokeWidth="3" fill="none"
                        />
                        <path 
                            d="M 80% 340 L 70% 220" 
                            className={`transition-all duration-700 ${stage >= 1 ? 'stroke-purple-300' : 'stroke-transparent'}`}
                            strokeWidth="3" fill="none"
                        />

                        {/* Lines for Stage 2 (A + H(BC) -> Root) */}
                        <path 
                            d="M 20% 340 L 45% 80" 
                            className={`transition-all duration-700 ${stage >= 2 ? 'stroke-slate-400' : 'stroke-transparent'}`}
                            strokeWidth="3" fill="none"
                        />
                        <path 
                            d="M 70% 200 L 45% 80" 
                            className={`transition-all duration-700 ${stage >= 2 ? 'stroke-slate-400' : 'stroke-transparent'}`}
                            strokeWidth="3" fill="none"
                        />
                    </svg>

                    {/* Flying Particles Animation Layer */}
                    {isAnimating && stage === 0 && (
                        <>
                            <HashParticle start={pos.b} end={pos.bc} color="bg-orange-500" />
                            <HashParticle start={pos.c} end={pos.bc} color="bg-red-500" delay={50} />
                        </>
                    )}
                    {isAnimating && stage === 1 && (
                        <>
                            <HashParticle start={pos.a} end={pos.root} color="bg-blue-500" />
                            <HashParticle start={pos.bc} end={pos.root} color="bg-purple-500" delay={50} />
                        </>
                    )}

                    {/* Nodes Layer */}
                    
                    {/* Root Node */}
                    <div className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20 ${stage >= 2 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ left: pos.root.left, top: pos.root.top }}>
                        <div className="flex flex-col items-center">
                            <div className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold shadow-xl border-4 border-purple-500 flex items-center gap-2 animate-[bounce-in_0.5s]">
                                <Lock className="w-4 h-4 text-purple-400"/> Merkle Root
                            </div>
                            <div className="text-[10px] bg-white px-2 rounded border border-slate-200 mt-1 shadow-sm text-slate-500">Hash( H(A) + H(BC) )</div>
                        </div>
                    </div>

                    {/* Intermediate Node H(BC) */}
                    <div className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 z-20 ${stage >= 1 ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`} style={{ left: pos.bc.left, top: pos.bc.top }}>
                        <div className="flex flex-col items-center">
                            <div className="w-24 h-12 bg-purple-100 border-2 border-purple-400 rounded-lg flex items-center justify-center font-bold text-purple-800 shadow-md animate-[bounce-in_0.5s]">
                                H(B+C)
                            </div>
                        </div>
                    </div>

                    {/* Leaf Nodes (Always visible) */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500" style={{ left: pos.a.left, top: pos.a.top }}>
                        <NodeCard label="H(A)" color="blue" sub="爸爸" active={true} />
                    </div>
                    
                    <div className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${stage >= 1 ? 'opacity-50 scale-90 grayscale' : 'opacity-100'}`} style={{ left: pos.b.left, top: pos.b.top }}>
                        <NodeCard label="H(B)" color="orange" sub="儿子" active={true} />
                    </div>

                    <div className={`absolute -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${stage >= 1 ? 'opacity-50 scale-90 grayscale' : 'opacity-100'}`} style={{ left: pos.c.left, top: pos.c.top }}>
                        <NodeCard label="H(C)" color="red" sub="律师" active={true} />
                    </div>

                </div>

                {/* Controls */}
                <div className="flex flex-col items-center gap-4">
                    <div className="flex gap-4">
                        {stage === 0 && (
                            <button onClick={runStage1} disabled={isAnimating} className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce disabled:opacity-50 disabled:animate-none">
                                <Combine className="w-5 h-5"/> 第一步：合并右侧分支 (B+C)
                            </button>
                        )}
                        {stage === 1 && (
                            <button onClick={runStage2} disabled={isAnimating} className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3 rounded-full font-bold shadow-lg flex items-center gap-2 animate-bounce disabled:opacity-50 disabled:animate-none">
                                <ArrowRight className="w-5 h-5"/> 第二步：计算最终根哈希
                            </button>
                        )}
                        {stage === 2 && (
                            <button onClick={reset} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-600 px-6 py-2 rounded-full font-bold flex items-center gap-2">
                                <RefreshCcw className="w-4 h-4"/> 重置演示
                            </button>
                        )}
                    </div>
                    
                    {/* Explainer Text */}
                    <div className="h-12 text-sm text-slate-500 text-center max-w-lg transition-all duration-300">
                        {isAnimating ? (
                            <span className="text-purple-600 font-bold animate-pulse">正在执行哈希运算 (SHA-256)...</span>
                        ) : (
                            <>
                                {stage === 0 && "我们有三个哈希指纹。首先，我们将较少使用的备用规则（B和C）合并起来。"}
                                {stage === 1 && "B和C的指纹被组合并哈希，生成了 H(BC)。现在我们把它看作一个整体。"}
                                {stage === 2 && "最后，将常用的规则A与右侧的整体 H(BC) 合并，得到了唯一的 Merkle Root。这就是要写在区块链上的那个锁。"}
                            </>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    // Step 4: Spending (Verification)
    const SpendingStep = () => {
        // Positions matching TreeBuilderStep roughly
        const pos = {
            a: { left: '20%', top: '340px' },
            b: { left: '60%', top: '340px' },
            c: { left: '80%', top: '340px' },
            bc: { left: '70%', top: '220px' },
            root: { left: '45%', top: '80px' }
        };

        return (
            <div className="space-y-6 animate-in slide-in-from-right duration-500">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2 text-green-600 flex items-center justify-center gap-2">
                        <ShieldCheck className="w-6 h-6"/> 见证时刻：默克尔证明
                    </h2>
                    <p className="text-slate-500">
                        当富翁使用 <strong>规则 A</strong> 花钱时，他只需要向区块链展示 <span className="text-blue-600 font-bold">蓝色部分</span> 和 <span className="text-purple-600 font-bold">紫色部分</span>。
                    </p>
                </div>

                <div className="relative h-[400px] border-b border-slate-200 bg-slate-50 rounded-2xl overflow-hidden shadow-inner">
                    
                    {/* Connecting Lines SVG Layer */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                        {/* Path from A to Root */}
                        <path d="M 20% 340 L 45% 80" className="stroke-green-500 stroke-[3px]" strokeDasharray="6 6" fill="none" />
                        
                        {/* Path from BC to Root */}
                        <path d="M 70% 220 L 45% 80" className="stroke-green-500 stroke-[3px]" strokeDasharray="6 6" fill="none" />

                        {/* Hidden paths B & C */}
                        <path d="M 60% 340 L 70% 220" className="stroke-slate-300 stroke-[1px]" strokeDasharray="2 2" fill="none" />
                        <path d="M 80% 340 L 70% 220" className="stroke-slate-300 stroke-[1px]" strokeDasharray="2 2" fill="none" />
                    </svg>

                    {/* 1. Revealed Rule A */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: pos.a.left, top: pos.a.top }}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-blue-100 border-2 border-blue-500 text-blue-700 px-4 py-3 rounded-xl font-bold shadow-lg animate-bounce-subtle">
                                <div className="flex items-center gap-2 text-sm"><FileCode className="w-4 h-4"/> 规则 A</div>
                                <div className="text-[9px] opacity-70">明文脚本</div>
                            </div>
                            <div className="bg-white border border-green-500 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                提交的数据 1
                            </div>
                        </div>
                    </div>

                    {/* 2. Provided Proof H(BC) */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: pos.bc.left, top: pos.bc.top }}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-purple-100 border-2 border-purple-500 text-purple-700 px-4 py-3 rounded-xl font-bold shadow-lg">
                                <div className="flex items-center gap-2 text-sm"><Hash className="w-4 h-4"/> H(BC)</div>
                                <div className="text-[9px] opacity-70">哈希值</div>
                            </div>
                            <div className="bg-white border border-green-500 text-green-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                                提交的数据 2
                            </div>
                        </div>
                    </div>

                    {/* 3. On-chain Root */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 z-20" style={{ left: pos.root.left, top: pos.root.top }}>
                        <div className="flex flex-col items-center gap-2">
                            <div className="bg-slate-800 text-white px-5 py-3 rounded-xl font-bold shadow-xl border-2 border-slate-600">
                                <div className="flex items-center gap-2 text-sm"><Lock className="w-4 h-4"/> Merkle Root</div>
                            </div>
                            <div className="bg-green-100 text-green-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-green-200">
                                验证目标
                            </div>
                        </div>
                    </div>

                    {/* Hidden Leaves */}
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 opacity-30 grayscale" style={{ left: pos.b.left, top: pos.b.top }}>
                        <div className="border-2 border-slate-300 bg-slate-100 px-3 py-2 rounded-lg text-xs font-bold text-slate-400">
                            规则 B
                        </div>
                    </div>
                    <div className="absolute -translate-x-1/2 -translate-y-1/2 opacity-30 grayscale" style={{ left: pos.c.left, top: pos.c.top }}>
                        <div className="border-2 border-slate-300 bg-slate-100 px-3 py-2 rounded-lg text-xs font-bold text-slate-400">
                            规则 C
                        </div>
                    </div>

                    {/* Verification Animation / Logic */}
                    <div className="absolute top-[160px] left-[35%] bg-white/90 backdrop-blur p-2 rounded-lg border border-slate-200 text-[10px] text-slate-500 shadow-sm">
                        验证过程：<br/>
                        Hash( <strong>A</strong> + <strong>H(BC)</strong> ) == <strong>Root</strong> ?
                    </div>

                </div>

                <div className="bg-green-50 border border-green-200 p-4 rounded-xl text-sm text-green-800 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                        <strong>隐私奇迹：</strong><br/>
                        区块链只看到了灰色的 <span className="font-mono bg-purple-100 px-1 rounded text-purple-700">H(BC)</span>。
                        它完全不知道这个哈希背后藏着几个规则（B和C），也不知道它们的内容。<br/>
                        这就实现了：<strong>未执行的合约分支，永远不会上链。</strong>
                    </div>
                </div>
            </div>
        );
    };

    // Step 5: Summary
    const SummaryStep = () => (
        <div className="space-y-8 animate-in slide-in-from-right duration-500">
            <div className="text-center">
                <h2 className="text-2xl font-bold mb-4">最终对比</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-slate-100 rounded-2xl border border-slate-200 opacity-70">
                    <h3 className="font-bold text-slate-600 mb-4 flex items-center gap-2">
                        <X className="w-5 h-5 text-red-500"/> 旧方式 (Legacy)
                    </h3>
                    <ul className="space-y-3 text-sm text-slate-600">
                        <li className="flex gap-2"><span className="text-red-500">❌</span> 只要花钱，就得公开所有备用计划。</li>
                        <li className="flex gap-2"><span className="text-red-500">❌</span> 脚本越大，手续费越贵。</li>
                        <li className="flex gap-2"><span className="text-red-500">❌</span> 隐私极差。</li>
                    </ul>
                </div>

                <div className="p-6 bg-purple-50 rounded-2xl border-2 border-purple-200 shadow-md">
                    <h3 className="font-bold text-purple-700 mb-4 flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500"/> Taproot (MAST)
                    </h3>
                    <ul className="space-y-3 text-sm text-purple-800">
                        <li className="flex gap-2"><span className="text-green-500">✅</span> 只公开用到的那一条规则。</li>
                        <li className="flex gap-2"><span className="text-green-500">✅</span> 其他分支只提供一个哈希值 (32字节)，极省空间。</li>
                        <li className="flex gap-2"><span className="text-green-500">✅</span> 复杂的智能合约看起来和普通转账一模一样。</li>
                    </ul>
                </div>
            </div>

            <div className="flex justify-center pt-4">
                <button
                    onClick={onChangeTab}
                    className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 shadow-xl"
                >
                    <FileCode className="w-5 h-5" /> 
                    <span>我已经懂了，让我看看代码实现</span>
                </button>
            </div>
        </div>
    );

    // --- Main Wizard Layout ---
    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Progress Bar */}
            <div className="flex items-center justify-between mb-8 px-4 overflow-x-auto pb-4 md:pb-0">
                {steps.map((s, i) => (
                    <div key={i} className={`flex flex-col items-center gap-2 relative z-10 min-w-[60px] ${i <= step ? 'opacity-100' : 'opacity-40'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                            i === step ? 'bg-purple-600 text-white scale-110 shadow-lg ring-4 ring-purple-100' : 
                            i < step ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'
                        }`}>
                            {i < step ? <CheckCircle className="w-5 h-5"/> : i + 1}
                        </div>
                        <span className="text-[10px] font-bold md:block text-center whitespace-nowrap">{s.title}</span>
                    </div>
                ))}
            </div>

            {/* Content Card */}
            <div className={`bg-white rounded-3xl p-8 shadow-xl border min-h-[450px] flex flex-col justify-between relative overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                
                {/* Step Content */}
                <div className="mb-8">
                    {step === 0 && <ScenarioStep />}
                    {step === 1 && <LegacyStep />}
                    {step === 2 && <HashingStep />}
                    {step === 3 && <TreeBuilderStep />}
                    {step === 4 && <SpendingStep />}
                    {step === 5 && <SummaryStep />}
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center border-t border-slate-100 pt-6 mt-auto">
                    <button 
                        onClick={prevStep}
                        disabled={step === 0}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-slate-500 hover:bg-slate-100 disabled:opacity-30 disabled:hover:bg-transparent font-medium transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4"/> 上一步
                    </button>

                    <div className="text-xs text-slate-400 font-mono">
                        Step {step + 1} / {steps.length}
                    </div>

                    <button 
                        onClick={nextStep}
                        disabled={step === steps.length - 1}
                        className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold shadow-lg transition-all ${step === steps.length - 1 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700 text-white hover:translate-x-1'}`}
                    >
                        {step === steps.length - 1 ? '完成' : '下一步'} <ChevronRight className="w-4 h-4"/>
                    </button>
                </div>
            </div>
        </div>
    );
};

const RuleCard = ({ icon: Icon, label, desc, color, detail }: any) => (
    <div className={`p-4 rounded-xl border-2 flex flex-col items-center text-center ${color} bg-opacity-10 border-opacity-20`}>
        <div className={`p-2 rounded-full mb-2 bg-white bg-opacity-50`}>
            <Icon className="w-6 h-6" />
        </div>
        <div className="font-bold text-sm mb-1">{label}</div>
        <div className="text-xs opacity-90 mb-2">{desc}</div>
        <div className="text-[10px] leading-tight opacity-70">{detail}</div>
    </div>
);

const NodeCard = ({ label, sub, active, highlight, color = "slate", x = 0 }: any) => {
    const colorStyles: any = {
        slate: 'bg-white border-slate-300 text-slate-500',
        blue: 'bg-blue-50 border-blue-400 text-blue-700',
        orange: 'bg-orange-50 border-orange-400 text-orange-700',
        red: 'bg-red-50 border-red-400 text-red-700',
        purple: 'bg-purple-50 border-purple-400 text-purple-700',
    };

    const style = colorStyles[color] || colorStyles.slate;

    return (
        <div 
            className={`w-24 h-14 rounded-xl border-2 flex flex-col items-center justify-center shadow-sm transition-all duration-500 z-10
                ${active ? `opacity-100 scale-100` : 'opacity-0 scale-50'}
                ${highlight ? 'ring-4 ring-purple-100 scale-110 z-20' : ''}
                ${style}
            `}
            style={{ transform: active && x ? `translateX(${x}px)` : undefined }}
        >
            <div className="font-bold text-xs">{label}</div>
            {sub && <div className="text-[9px] opacity-80">{sub}</div>}
        </div>
    );
};

const HashParticle = ({ start, end, color, delay = 0 }: any) => {
    const [style, setStyle] = useState<any>({ 
        left: start.left, 
        top: start.top, 
        opacity: 0,
        transform: 'translate(-50%, -50%) scale(0.5)'
    });

    useEffect(() => {
        // Appear
        requestAnimationFrame(() => {
            setStyle((s: any) => ({ ...s, opacity: 1, transform: 'translate(-50%, -50%) scale(1)' }));
            // Move
            setTimeout(() => {
                setStyle({ 
                    left: end.left, 
                    top: end.top, 
                    opacity: 1, 
                    transform: 'translate(-50%, -50%) scale(0.5)' // Shrink into target
                });
            }, 100);
        });
    }, []);

    return (
        <div 
            className={`absolute w-8 h-8 rounded-full ${color} text-white flex items-center justify-center shadow-xl z-50 transition-all duration-1000 ease-in-out border-2 border-white`}
            style={style}
        >
            <Hash className="w-4 h-4" />
        </div>
    );
};

// --- Tab 2: Interactive Demo (Technical View - Previously InteractiveView) ---
// Updated: Completely revamped to show Commit/Reveal flows clearly.
const InteractiveView = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [path, setPath] = useState<string | null>(null);
    // Verification steps state: 0=Initial, 1=InputData, 2=ProofCalc, 3=VerifyQ
    const [verifyStep, setVerifyStep] = useState(0);

    // Reset verification when path changes
    useEffect(() => {
        setVerifyStep(0);
    }, [path]);

    // Mock Scripts
    const scripts = [
        { id: 's1', label: '脚本 A', desc: '公司多签 (2-of-3)', content: 'OP_2 <Pub1> <Pub2> <Pub3> OP_3 OP_CHECKMULTISIG', hash: 'H(A)', color: 'amber' },
        { id: 's2', label: '脚本 B', desc: '30天时间锁', content: '<30d> OP_CSV OP_DROP <PubUser> OP_CHECKSIG', hash: 'H(B)', color: 'blue' },
        { id: 's3', label: '脚本 C', desc: '紧急备份钥匙', content: '<PubBackup> OP_CHECKSIG', hash: 'H(C)', color: 'rose' },
    ];

    const runVerification = () => {
        let current = 0;
        const next = () => {
            current++;
            setVerifyStep(current);
            if (current < 3) setTimeout(next, 1000);
        };
        next();
    };

    return (
        <div className="grid lg:grid-cols-12 gap-8 items-start animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* --- Left: The Tree Structure (Visual Selector) --- */}
            <div className={`lg:col-span-7 rounded-3xl border-2 p-8 relative min-h-[600px] flex flex-col items-center transition-colors duration-300 select-none ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: `radial-gradient(${isDarkMode ? '#475569' : '#cbd5e1'} 1px, transparent 1px)`, backgroundSize: '20px 20px'}}></div>

                {/* --- Root Level (Q) --- */}
                <div className="relative z-10 w-full flex flex-col items-center">
                    <div 
                        onClick={() => setPath(null)}
                        className={`cursor-pointer px-6 py-3 rounded-2xl border-2 shadow-lg flex items-center gap-3 mb-2 transition-all hover:scale-105 ${!path ? 'border-purple-500 bg-purple-50 text-purple-900 ring-4 ring-purple-500/10' : (isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-white border-slate-300 opacity-60')}`}
                    >
                        <Lock className="w-5 h-5 text-purple-600" />
                        <div>
                            <div className="text-[10px] font-bold uppercase tracking-widest opacity-60">Taproot Output</div>
                            <div className="font-mono font-bold text-sm">Pubkey Q</div>
                        </div>
                    </div>
                    {/* Formula Hint */}
                    <div className={`text-[10px] font-mono mb-8 transition-colors ${!path ? 'text-purple-600 font-bold' : 'text-slate-400'}`}>
                        Q = P + Hash(P||MerkleRoot)G
                    </div>
                </div>

                {/* --- Connecting Lines (SVG) --- */}
                <svg className="absolute top-[80px] left-0 w-full h-[450px] pointer-events-none z-0 overflow-visible">
                    {/* Root Split */}
                    <path d="M 50% 10 C 50% 50, 20% 50, 20% 80" stroke={path === 'key' ? '#10b981' : '#cbd5e1'} strokeWidth={path === 'key' ? 3 : 1} fill="none" className="transition-all duration-500" />
                    <path d="M 50% 10 C 50% 50, 80% 50, 80% 80" stroke={path?.startsWith('s') ? '#f59e0b' : '#cbd5e1'} strokeWidth={path?.startsWith('s') ? 3 : 1} fill="none" className="transition-all duration-500" />

                    {/* Merkle Tree Structure */}
                    {/* Root -> H(AB) & H(C) */}
                    <path d="M 80% 130 C 80% 160, 65% 160, 65% 200" stroke={path === 's1' || path === 's2' ? '#f59e0b' : '#cbd5e1'} strokeWidth={path === 's1' || path === 's2' ? 3 : 1} fill="none" />
                    <path d="M 80% 130 C 80% 160, 95% 160, 95% 280" stroke={path === 's3' ? '#f59e0b' : '#cbd5e1'} strokeWidth={path === 's3' ? 3 : 1} fill="none" />

                    {/* H(AB) -> A & B */}
                    <path d="M 65% 250 C 65% 280, 50% 280, 50% 320" stroke={path === 's1' ? '#f59e0b' : '#cbd5e1'} strokeWidth={path === 's1' ? 3 : 1} fill="none" />
                    <path d="M 65% 250 C 65% 280, 80% 280, 80% 320" stroke={path === 's2' ? '#f59e0b' : '#cbd5e1'} strokeWidth={path === 's2' ? 3 : 1} fill="none" />
                </svg>

                {/* --- Level 2: Key Path vs Merkle Root --- */}
                <div className="w-full flex justify-between px-4 md:px-16 mb-16 relative z-10">
                    {/* Key Path Node */}
                    <button 
                        onClick={() => setPath('key')}
                        className={`w-36 p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all hover:-translate-y-1 ${path === 'key' ? 'bg-emerald-50 border-emerald-500 shadow-lg' : (isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200')}`}
                    >
                        <div className={`p-2 rounded-full ${path === 'key' ? 'bg-emerald-500 text-white' : 'bg-slate-200 text-slate-500'}`}><Key className="w-5 h-5" /></div>
                        <div className="text-center">
                            <div className="text-xs font-bold">Key Path</div>
                            <div className="text-[9px] opacity-60">P (Default)</div>
                        </div>
                    </button>

                    {/* Merkle Root Node */}
                    <div className={`w-40 p-3 rounded-xl border-2 border-dashed flex flex-col items-center gap-2 transition-all ${path?.startsWith('s') ? 'bg-amber-50 border-amber-500 text-amber-900' : (isDarkMode ? 'bg-slate-800/50 border-slate-700 text-slate-500' : 'bg-white/50 border-slate-300 text-slate-400')}`}>
                        <div className="p-2 rounded-full bg-slate-200 text-slate-500"><GitBranch className="w-5 h-5" /></div>
                        <div className="text-center">
                            <div className="text-xs font-bold">Merkle Root</div>
                            <div className="text-[9px] opacity-60">Hash(H_AB || H_C)</div>
                        </div>
                    </div>
                </div>

                {/* --- Level 3 & 4: Merkle Tree Nodes --- */}
                <div className="w-full pl-[35%] pr-4 relative z-10 flex flex-col items-center">
                    
                    {/* Intermediate Node H(AB) */}
                    <div className={`absolute top-0 left-[35%] -translate-x-1/2 p-2 rounded-lg border text-xs font-mono font-bold transition-all ${path === 's1' || path === 's2' ? 'bg-white border-amber-500 text-amber-600 shadow-md scale-110 z-20' : (isDarkMode ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-slate-100 border-slate-300 text-slate-400')}`}>
                        Hash(A||B)
                    </div>

                    {/* Leaves */}
                    <div className="mt-28 w-full flex justify-between gap-2">
                        {/* Script A */}
                        <LeafNode 
                            script={scripts[0]} 
                            active={path === 's1'} 
                            isProof={path === 's2'} 
                            onClick={() => setPath('s1')} 
                            isDarkMode={isDarkMode}
                        />
                        {/* Script B */}
                        <LeafNode 
                            script={scripts[1]} 
                            active={path === 's2'} 
                            isProof={path === 's1'} 
                            onClick={() => setPath('s2')} 
                            isDarkMode={isDarkMode}
                        />
                        {/* Script C */}
                        <LeafNode 
                            script={scripts[2]} 
                            active={path === 's3'} 
                            isProof={path === 's1' || path === 's2'} 
                            onClick={() => setPath('s3')} 
                            isDarkMode={isDarkMode}
                        />
                    </div>
                </div>

                {!path && (
                    <div className="absolute bottom-10 bg-slate-900/90 text-white px-6 py-2 rounded-full text-sm font-bold animate-bounce shadow-lg pointer-events-none">
                        点击任意节点，查看详情
                    </div>
                )}
            </div>

            {/* --- Right: Verification Panel (Dynamic) --- */}
            <div className={`lg:col-span-5 space-y-6 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                
                <div className={`p-6 rounded-3xl border shadow-sm min-h-[600px] flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    
                    {/* --- CASE 1: COMMIT MODE (Default) --- */}
                    {!path && (
                        <div className="animate-in fade-in space-y-6 flex-1">
                            <h3 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                <Box className="w-5 h-5 text-purple-500"/> Phase 1: 构造锁 (Commit)
                            </h3>
                            <p className="text-sm opacity-80">
                                Taproot 将复杂的脚本树“隐藏”在一个看似普通的公钥中。这个过程叫 <strong>Tweaking (公钥调整)</strong>。
                            </p>

                            <div className={`p-4 rounded-xl border space-y-4 ${isDarkMode ? 'bg-black/30 border-purple-500/30' : 'bg-slate-50 border-purple-100'}`}>
                                <div className="text-xs font-bold uppercase tracking-wider text-purple-500">Taproot 输出公式</div>
                                <div className={`font-mono text-lg font-bold text-center py-2 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                    Q = P + Hash(P || Root)G
                                </div>
                                
                                {/* Detailed Definition List */}
                                <div className="space-y-3 pt-2">
                                    <DefinitionCard 
                                        term="Q" 
                                        meaning="最终链上公钥 (Public Key)"
                                        desc="对外界可见的唯一标识。看起来和普通公钥一模一样，没人知道它背后藏着脚本树。"
                                        color="text-purple-600"
                                        bgColor={isDarkMode ? "bg-purple-900/20" : "bg-purple-50"}
                                    />
                                    <DefinitionCard 
                                        term="P" 
                                        meaning="内部公钥 (Internal Key)"
                                        desc="用户原本的公钥。如果不需要执行脚本（默认路径），用户可以直接用 P 对应的私钥进行签名。"
                                        color="text-blue-500"
                                        bgColor={isDarkMode ? "bg-blue-900/20" : "bg-blue-50"}
                                    />
                                    <DefinitionCard 
                                        term="Hash(...)G" 
                                        meaning="调整值 (The Tweak)"
                                        desc="这是把脚本树根 (Root) 转换成的一个“偏移量”。"
                                        subDesc="Hash(...) 是个数字，乘以 G (生成元) 后变成曲线上的一个点。把这个点加到 P 上，就得到了 Q。"
                                        color="text-orange-500"
                                        bgColor={isDarkMode ? "bg-orange-900/20" : "bg-orange-50"}
                                    />
                                    <div className={`text-[10px] p-2 rounded flex items-start gap-2 opacity-80 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <Info className="w-3 h-3 mt-0.5 flex-shrink-0" />
                                        <span>
                                            <strong>G (Generator Point):</strong> 椭圆曲线上的一个固定基准点。所有公钥本质上都是 私钥 × G。这里用它把哈希值（数字）转化成点，以便与 P（点）相加。
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 flex flex-col justify-center items-center gap-4 text-sm text-slate-500 mt-4">
                                <div className="animate-bounce">
                                    <ArrowDown className="w-6 h-6"/>
                                </div>
                                <p className="text-center max-w-xs text-xs">
                                    点击左侧底部的任意<strong>脚本节点</strong>，<br/>
                                    模拟花费过程 (Reveal Phase)。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* --- CASE 2: KEY PATH SPEND --- */}
                    {path === 'key' && (
                        <div className="animate-in fade-in slide-in-from-left-4 space-y-6">
                            <h3 className="font-bold text-lg flex items-center gap-2 text-emerald-600">
                                <Key className="w-5 h-5"/> Key Path Spending
                            </h3>
                            <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 p-4 rounded-xl">
                                <p className="text-sm opacity-90">
                                    这是最高效的路径。不需要任何脚本，也不需要任何哈希证明。
                                    只需要对 Q 进行签名即可。
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">提交的数据 (Witness)</div>
                                <div className={`p-3 rounded-lg border font-mono text-xs flex items-center gap-2 ${isDarkMode ? 'bg-black/30 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
                                    <FileSignature className="w-4 h-4"/> &lt;Signature_of_Q&gt;
                                </div>
                            </div>
                            <div className="flex items-start gap-3 text-sm bg-slate-50 dark:bg-slate-800 p-4 rounded-xl">
                                <EyeOff className="w-5 h-5 text-slate-400 mt-0.5" />
                                <div>
                                    <strong>完全隐私：</strong> 外界根本不知道这笔钱背后还藏着复杂的脚本树（Script A/B/C）。看起来就像普通转账。
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- CASE 3: SCRIPT PATH SPEND (The Full Verification Flow) --- */}
                    {path && path.startsWith('s') && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 flex flex-col h-full">
                            <div className={`flex items-center justify-between mb-4 pb-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                <h3 className={`font-bold text-lg flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                                    <ShieldCheck className="w-5 h-5 text-indigo-500" /> 
                                    Phase 2: 解锁验证 (Reveal)
                                </h3>
                                <button 
                                    onClick={runVerification} 
                                    disabled={verifyStep > 0}
                                    className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-full font-bold transition-colors disabled:opacity-50"
                                >
                                    {verifyStep === 0 ? '开始验证' : '验证中...'}
                                </button>
                            </div>

                            <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                                {/* STEP 1: INPUT DATA */}
                                <div className={`transition-all duration-500 ${verifyStep >= 1 ? 'opacity-100' : 'opacity-50 blur-[1px]'}`}>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${verifyStep >= 1 ? 'bg-green-500' : 'bg-slate-300'}`}>1</div>
                                        检查输入数据 (Witness Stack)
                                    </div>
                                    <div className={`p-3 rounded-xl border space-y-2 text-xs font-mono ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded">
                                            <FileCode className="w-4 h-4 text-blue-500"/> 
                                            <span>脚本: {scripts.find(s=>s.id===path)?.content}</span>
                                        </div>
                                        <div className="flex items-center gap-2 p-2 bg-white/5 rounded border border-dashed border-slate-500/30">
                                            <Box className="w-4 h-4 text-purple-500"/>
                                            <span>控制块 (Control Block): P + MerklePath</span>
                                        </div>
                                    </div>
                                </div>

                                {/* STEP 2: REBUILD ROOT */}
                                <div className={`transition-all duration-500 ${verifyStep >= 2 ? 'opacity-100' : 'opacity-30 blur-[1px]'}`}>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${verifyStep >= 2 ? 'bg-green-500' : 'bg-slate-300'}`}>2</div>
                                        重建默克尔根 (Rebuild Root)
                                    </div>
                                    <div className="pl-4 border-l-2 border-slate-200 ml-3 space-y-2 py-2">
                                        <div className="flex items-center gap-2 text-xs">
                                            <Hash className="w-3 h-3 text-slate-400"/>
                                            <span>Hash(Script) = LeafHash</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Combine className="w-3 h-3 text-slate-400"/>
                                            <span>Hash(Leaf + Path) = <span className="font-bold text-purple-600">Calculated Root</span></span>
                                        </div>
                                    </div>
                                </div>

                                {/* STEP 3: CHECK COMMITMENT */}
                                <div className={`transition-all duration-500 ${verifyStep >= 3 ? 'opacity-100' : 'opacity-30 blur-[1px]'}`}>
                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500 mb-2">
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs text-white ${verifyStep >= 3 ? 'bg-green-500' : 'bg-slate-300'}`}>3</div>
                                        验证承诺 (Verify Tweak)
                                    </div>
                                    <div className={`p-4 rounded-xl border text-center ${verifyStep >= 3 ? 'bg-green-50 border-green-200' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="text-xs text-slate-500 mb-2">Check: P + Hash(P||Root)G == Q ?</div>
                                        {verifyStep >= 3 && (
                                            <div className="flex items-center justify-center gap-2 text-green-700 font-bold animate-in zoom-in">
                                                <CheckCircle className="w-5 h-5"/> 匹配成功！资金解锁。
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
};

const DefinitionCard = ({ term, meaning, desc, subDesc, color, bgColor }: any) => (
    <div className={`flex items-start gap-3 p-2 rounded-lg ${bgColor}`}>
        <div className={`font-mono font-bold ${color} mt-0.5 whitespace-nowrap min-w-[30px]`}>{term}</div>
        <div>
            <div className={`font-bold text-xs ${color}`}>{meaning}</div>
            <div className="text-[10px] opacity-80 leading-relaxed">{desc}</div>
            {subDesc && <div className="text-[9px] opacity-60 mt-1 italic">{subDesc}</div>}
        </div>
    </div>
);

const LeafNode = ({ script, active, isProof, onClick, isDarkMode }: any) => {
    // Styles based on state
    let bgClass = isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200';
    let textClass = isDarkMode ? 'text-slate-500' : 'text-slate-600';
    let scaleClass = 'scale-100';
    let opacityClass = 'opacity-100';

    if (active) {
        bgClass = `bg-${script.color}-50 border-${script.color}-500 shadow-lg`;
        textClass = `text-${script.color}-700`;
        scaleClass = 'scale-105';
    } else if (isProof) {
        bgClass = isDarkMode ? 'bg-slate-900 border-slate-600' : 'bg-slate-100 border-slate-300';
        textClass = 'text-slate-400';
        // scaleClass = 'scale-95';
    } else {
        opacityClass = 'opacity-50';
    }

    return (
        <button 
            onClick={onClick}
            className={`flex-1 p-2 md:p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all duration-300 ${bgClass} ${scaleClass} ${opacityClass} hover:opacity-100 hover:scale-105`}
        >
            <div className={`p-1.5 rounded-full ${active ? `bg-${script.color}-500 text-white` : 'bg-slate-200 text-slate-500'}`}>
                {isProof ? <Hash className="w-4 h-4" /> : <FileCode className="w-4 h-4" />}
            </div>
            <div className="text-center min-w-0 w-full">
                <div className={`text-xs font-bold truncate ${textClass}`}>{script.label}</div>
                <div className="text-[9px] opacity-70 truncate hidden md:block">{active ? 'Revealed' : isProof ? 'Hash Only' : script.desc}</div>
            </div>
        </button>
    );
};

const ProofItem = ({ label, value, desc }: any) => (
    <div className="flex items-center justify-between text-xs group">
        <div className="flex items-center gap-2">
            <CornerDownRight className="w-3 h-3 text-slate-400"/>
            <span className="font-bold text-slate-500">{label}:</span>
            <span className="font-mono font-bold bg-slate-200 dark:bg-slate-700 px-1 rounded text-slate-600 dark:text-slate-300">{value}</span>
        </div>
        <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">{desc}</span>
    </div>
);

// --- Tab 3: Use Cases View ---
const UseCasesView = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const useCases = [
        {
            title: '闪电网络通道',
            icon: '⚡',
            color: 'amber',
            description: '闪电网络的支付通道可以使用 Taproot 来隐藏通道的存在。正常关闭通道时看起来像普通转账。',
            benefits: ['通道关闭更便宜', '通道隐私更好', '非合作关闭时才暴露脚本']
        },
        {
            title: '多签钱包',
            icon: '👥',
            color: 'blue',
            description: '公司财务的 3-of-5 多签钱包，日常使用时可以通过密钥聚合直接签名，看起来像单签交易。',
            benefits: ['手续费与单签相同', '无法从链上识别为多签', '紧急恢复脚本保持隐藏']
        },
        {
            title: 'DLC (离散对数合约)',
            icon: '📊',
            color: 'emerald',
            description: '基于预言机的金融合约。多种结算条件都隐藏在 MAST 树中，只有实际发生的结果会上链。',
            benefits: ['支持复杂的条件结算', '隐私保护', '链上数据最小化']
        },
        {
            title: '原子交换',
            icon: '🔄',
            color: 'purple',
            description: '跨链原子交换可以使用 Taproot 实现更高效的交易。成功交换时看起来像普通支付。',
            benefits: ['降低交换成本', '提高交换隐私', '超时退款条件隐藏']
        },
        {
            title: '继承/遗嘱',
            icon: '📜',
            color: 'rose',
            description: '设置时间锁定的继承条件。正常情况下持有人自己签名，去世后继承人可在一定时间后取款。',
            benefits: ['继承规则保持私密', '正常使用不暴露继承人', '灵活的时间锁设置']
        },
        {
            title: 'Ordinals/NFT',
            icon: '🖼️',
            color: 'cyan',
            description: 'Ordinals 协议利用 Taproot 的见证空间存储任意数据，实现比特币上的 NFT 和数字资产。',
            benefits: ['利用 Taproot 空间优势', '更低的数据存储成本', '新的比特币用例']
        }
    ];

    const comparisons = [
        { feature: '普通交易外观', legacy: false, segwit: false, taproot: true },
        { feature: '隐藏未用脚本', legacy: false, segwit: false, taproot: true },
        { feature: '密钥聚合', legacy: false, segwit: false, taproot: true },
        { feature: 'Schnorr 签名', legacy: false, segwit: false, taproot: true },
        { feature: '批量验证', legacy: false, segwit: false, taproot: true },
        { feature: '见证折扣', legacy: false, segwit: true, taproot: true },
        { feature: '修复延展性', legacy: false, segwit: true, taproot: true }
    ];

    const stats = [
        { label: 'Taproot 激活时间', value: '2021.11', desc: '区块 709,632' },
        { label: '当前采用率', value: '~20%', desc: '持续增长中' },
        { label: '单签节省', value: '~15%', desc: '对比 SegWit' },
        { label: '复杂脚本节省', value: '~50%+', desc: '得益于 MAST' }
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Header */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-8 text-white shadow-xl">
                <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                    <Workflow className="w-8 h-8" /> Taproot 实际应用场景
                </h1>
                <p className="text-purple-100 text-lg leading-relaxed max-w-3xl">
                    Taproot 不仅是技术升级，更是比特币智能合约能力的重大飞跃。它让复杂的条件支付看起来像普通转账，同时大幅降低成本。
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <div key={i} className={`p-4 rounded-xl text-center ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                        <div className="text-2xl font-bold text-purple-500">{stat.value}</div>
                        <div className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{stat.label}</div>
                        <div className="text-xs text-slate-500">{stat.desc}</div>
                    </div>
                ))}
            </div>

            {/* Use Cases Grid */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    典型应用场景
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {useCases.map((uc, i) => (
                        <div key={i} className={`p-4 rounded-xl border transition-all hover:scale-[1.02] ${isDarkMode ? 'bg-slate-800/50 border-slate-700 hover:border-purple-500/50' : 'bg-slate-50 border-slate-200 hover:border-purple-300'}`}>
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{uc.icon}</span>
                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{uc.title}</h3>
                            </div>
                            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{uc.description}</p>
                            <ul className="space-y-1">
                                {uc.benefits.map((benefit, j) => (
                                    <li key={j} className="flex items-center gap-2 text-xs">
                                        <CheckCircle className={`w-3 h-3 text-${uc.color}-500`} />
                                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            {/* Comparison Table */}
            <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                    <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        与 Legacy、SegWit 对比
                    </h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
                            <tr>
                                <th className="text-left p-4 font-bold">特性</th>
                                <th className="text-center p-4 font-bold">Legacy</th>
                                <th className="text-center p-4 font-bold">SegWit</th>
                                <th className="text-center p-4 font-bold text-purple-500">Taproot</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comparisons.map((row, i) => (
                                <tr key={i} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                    <td className="p-4">{row.feature}</td>
                                    <td className="p-4 text-center">
                                        {row.legacy ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                                    </td>
                                    <td className="p-4 text-center">
                                        {row.segwit ? <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                                    </td>
                                    <td className="p-4 text-center">
                                        {row.taproot ? <CheckCircle className="w-5 h-5 text-purple-500 mx-auto" /> : <X className="w-5 h-5 text-slate-300 mx-auto" />}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Why Taproot Matters */}
            <div className={`p-6 rounded-2xl ${isDarkMode ? 'bg-purple-950/30 border border-purple-900' : 'bg-purple-50 border border-purple-200'}`}>
                <h3 className="font-bold text-purple-500 mb-4 flex items-center gap-2">
                    <Info className="w-5 h-5" />
                    为什么 Taproot 很重要？
                </h3>
                <div className="grid md:grid-cols-2 gap-6 text-sm">
                    <div>
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>对用户</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>更低的交易费用，尤其是复杂交易</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>更好的隐私保护，交易类型难以区分</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>更灵活的智能合约功能</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>对生态系统</h4>
                        <ul className="space-y-2">
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>增强闪电网络的效率和隐私</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>为新协议（如 Ordinals）提供基础</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>提高整体网络容量和效率</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quiz Section
const QuizSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                    <Award className="w-8 h-8 text-purple-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    Taproot 知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对 Taproot 升级的理解
                </p>
            </div>
            <Quiz quizData={taprootQuiz} />
        </div>
    );
};

export default TaprootDemo;
