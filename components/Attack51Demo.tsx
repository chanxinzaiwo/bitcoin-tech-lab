
import React, { useState, useEffect } from 'react';
import { Skull, AlertTriangle, ShieldCheck, Zap, RefreshCw, DollarSign, Clock, Shield, Info, TrendingDown, History, Layers, ArrowRight, Check, X } from 'lucide-react';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';

interface Block {
    id: number;
    miner: 'public' | 'attacker';
    hash: string;
    confirmations?: number;
}

interface AttackType {
    name: string;
    description: string;
    difficulty: 'medium' | 'high' | 'extreme';
    example: string;
}

interface HistoricalAttack {
    coin: string;
    date: string;
    cost: string;
    stolen: string;
    outcome: string;
}

const Attack51Demo = () => {
    const { isDarkMode } = useLab();
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'simulation' | 'cost' | 'defense' | 'history'>('simulation');
    const [publicChain, setPublicChain] = useState<Block[]>([]);
    const [secretChain, setSecretChain] = useState<Block[]>([]);
    const [isAttacking, setIsAttacking] = useState(false);
    const [success, setSuccess] = useState(false);
    const [publicHashrate, setPublicHashrate] = useState(100);
    const [attackerHashrate, setAttackerHashrate] = useState(110);
    const [confirmationsRequired, setConfirmationsRequired] = useState(6);
    const [targetAmount, setTargetAmount] = useState(100);

    useEffect(() => {
        reset();
    }, []);

    const reset = () => {
        const genesis = { id: 0, miner: 'public' as const, hash: '0000abc...', confirmations: 100 };
        setPublicChain([genesis]);
        setSecretChain([genesis]);
        setIsAttacking(false);
        setSuccess(false);
    };

    useEffect(() => {
        if (!isAttacking) return;

        const interval = setInterval(() => {
            if (Math.random() < publicHashrate / 1000) {
                setPublicChain(prev => [...prev, {
                    id: prev.length,
                    miner: 'public',
                    hash: Math.random().toString(36).substring(7)
                }]);
            }
            if (Math.random() < attackerHashrate / 1000) {
                setSecretChain(prev => [...prev, {
                    id: prev.length,
                    miner: 'attacker',
                    hash: Math.random().toString(36).substring(7)
                }]);
            }
        }, 100);

        return () => clearInterval(interval);
    }, [isAttacking, publicHashrate, attackerHashrate]);

    const broadcastAttack = () => {
        setIsAttacking(false);
        if (secretChain.length > publicChain.length) {
            setSuccess(true);
            setPublicChain(secretChain);
        } else {
            toast.error('攻击失败', '你的链没有诚实链长，网络拒绝了你的重组请求');
        }
    };

    const attackTypes: AttackType[] = [
        {
            name: '双花攻击 (Double Spend)',
            description: '攻击者先用比特币购买商品/服务，等待确认后立即使用秘密链撤销交易，把币"花两次"',
            difficulty: 'high',
            example: '2018年 Bitcoin Gold 遭受双花攻击，损失约 1800 万美元'
        },
        {
            name: '交易审查 (Censorship)',
            description: '拒绝打包特定地址的交易，虽然其他矿工可以打包，但攻击者可以重组这些区块',
            difficulty: 'extreme',
            example: '需要持续保持 51% 算力才能有效审查'
        },
        {
            name: '空区块攻击 (Empty Block)',
            description: '只挖空区块不打包任何交易，瘫痪网络交易处理能力',
            difficulty: 'medium',
            example: '理论攻击，实际中会损失交易费收入'
        }
    ];

    const historicalAttacks: HistoricalAttack[] = [
        { coin: 'Ethereum Classic (ETC)', date: '2019年1月', cost: '~$5,000', stolen: '$1.1M', outcome: '交易所紧急提高确认数' },
        { coin: 'Bitcoin Gold (BTG)', date: '2018年5月', cost: '~$70,000', stolen: '$18M', outcome: '多家交易所下架' },
        { coin: 'Verge (XVG)', date: '2018年4月', cost: '~$1,000', stolen: '$1.75M', outcome: '算法漏洞被利用' },
        { coin: 'Bitcoin SV (BSV)', date: '2021年8月', cost: '~$20,000', stolen: '未知', outcome: '发生100区块深度重组' }
    ];

    // Estimated cost calculation (simplified model)
    const calculateAttackCost = () => {
        const btcNetworkHashrate = 500; // EH/s (Exahash)
        const costPerEH = 100000; // USD per hour per EH (very rough estimate)
        const blocksNeeded = confirmationsRequired + 1;
        const hoursNeeded = (blocksNeeded * 10) / 60; // 10 min per block
        const hashratNeeded = (btcNetworkHashrate * 0.51);
        return Math.round(hashratNeeded * costPerEH * hoursNeeded);
    };

    const tabs = [
        { id: 'simulation', label: '攻击模拟', icon: Skull },
        { id: 'cost', label: '成本分析', icon: DollarSign },
        { id: 'defense', label: '防范措施', icon: Shield },
        { id: 'history', label: '历史案例', icon: History }
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'} backdrop-blur-md`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-red-600 text-white p-1.5 rounded-full">
                        <Skull className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">51% 攻击模拟器</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">

                {/* Intro */}
                <div className="bg-gradient-to-br from-red-600 to-orange-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <Zap className="w-8 h-8" /> 算力战争：理解比特币最大的理论威胁
                    </h2>
                    <p className="text-red-100 text-lg leading-relaxed max-w-4xl">
                        51% 攻击是指攻击者掌握超过全网一半的算力，可以秘密挖掘更长的链来重组区块链历史。
                        这是比特币安全模型中最重要的理论攻击向量，理解它有助于理解为什么比特币需要等待多个确认。
                    </p>
                    <div className="mt-6 grid md:grid-cols-3 gap-4">
                        <div className="bg-white/10 rounded-xl p-4">
                            <div className="text-3xl font-bold">51%</div>
                            <div className="text-sm text-red-200">最小攻击算力占比</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <div className="text-3xl font-bold">~$25B</div>
                            <div className="text-sm text-red-200">攻击比特币理论成本</div>
                        </div>
                        <div className="bg-white/10 rounded-xl p-4">
                            <div className="text-3xl font-bold">0次</div>
                            <div className="text-sm text-red-200">比特币成功遭受51%攻击次数</div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className={`flex gap-2 p-1 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                    {tabs.map(tab => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-red-600 text-white shadow-lg'
                                        : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-white'
                                }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                            </button>
                        );
                    })}
                </div>

                {/* Simulation Tab */}
                {activeTab === 'simulation' && (
                    <div className="space-y-8">
                        {/* Attack Types */}
                        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                攻击类型
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {attackTypes.map((type, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                                                type.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-500' :
                                                type.difficulty === 'high' ? 'bg-orange-500/20 text-orange-500' :
                                                'bg-red-500/20 text-red-500'
                                            }`}>
                                                {type.difficulty === 'medium' ? '中等' : type.difficulty === 'high' ? '高难度' : '极难'}
                                            </span>
                                        </div>
                                        <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{type.name}</h4>
                                        <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{type.description}</p>
                                        <div className={`text-xs p-2 rounded-lg ${isDarkMode ? 'bg-slate-900 text-slate-500' : 'bg-white text-slate-500'}`}>
                                            <Info className="w-3 h-3 inline mr-1" />
                                            {type.example}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className={`grid md:grid-cols-4 gap-6 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">诚实算力</label>
                                <input
                                    type="range" min="10" max="200" value={publicHashrate}
                                    onChange={(e) => setPublicHashrate(Number(e.target.value))}
                                    className="w-full accent-emerald-500"
                                />
                                <div className="text-emerald-500 font-mono">{publicHashrate} TH/s</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">攻击算力</label>
                                <input
                                    type="range" min="10" max="200" value={attackerHashrate}
                                    onChange={(e) => setAttackerHashrate(Number(e.target.value))}
                                    className="w-full accent-red-500"
                                />
                                <div className="text-red-500 font-mono">{attackerHashrate} TH/s</div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-slate-500">算力占比</label>
                                <div className={`text-2xl font-bold ${attackerHashrate / (publicHashrate + attackerHashrate) > 0.5 ? 'text-red-500' : 'text-emerald-500'}`}>
                                    {Math.round((attackerHashrate / (publicHashrate + attackerHashrate)) * 100)}%
                                </div>
                                <div className={`text-xs ${attackerHashrate > publicHashrate ? 'text-red-500' : 'text-slate-500'}`}>
                                    {attackerHashrate > publicHashrate ? '⚠️ 攻击者占优势' : '诚实矿工占优势'}
                                </div>
                            </div>
                            <div className="flex flex-col gap-2 justify-center">
                                {!isAttacking && !success && (
                                    <button onClick={() => setIsAttacking(true)} className="bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-bold shadow-lg transition-transform active:scale-95">
                                        开始秘密挖矿
                                    </button>
                                )}
                                {isAttacking && (
                                    <button onClick={broadcastAttack} className="bg-slate-800 hover:bg-slate-700 text-white py-2 rounded-lg font-bold shadow-lg animate-pulse">
                                        广播攻击链
                                    </button>
                                )}
                                <button onClick={reset} className="text-slate-500 hover:text-slate-400 text-sm flex items-center justify-center gap-1">
                                    <RefreshCw className="w-3 h-3" /> 重置
                                </button>
                            </div>
                        </div>

                        {/* Visualization */}
                        <div className="space-y-6 relative">
                            {/* Public Chain */}
                            <div className="relative">
                                <div className="flex items-center gap-2 mb-2 text-emerald-500 font-bold uppercase tracking-wider text-sm">
                                    <ShieldCheck className="w-4 h-4" /> 诚实公链 ({publicChain.length} 区块)
                                </div>
                                <div className={`h-24 rounded-xl border-2 border-dashed flex items-center px-4 overflow-x-auto gap-2 custom-scrollbar ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-200 bg-slate-50'}`}>
                                    {publicChain.map((blk) => (
                                        <div key={blk.id} className="min-w-[60px] h-16 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold shadow-md relative group shrink-0">
                                            #{blk.id}
                                            {blk.id > 0 && <div className="absolute -left-3 w-4 h-0.5 bg-emerald-300"></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Secret Chain */}
                            <div className={`relative transition-all duration-500 ${isAttacking ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                                <div className="flex items-center gap-2 mb-2 text-red-500 font-bold uppercase tracking-wider text-sm">
                                    <Skull className="w-4 h-4" /> 影子链 ({secretChain.length} 区块)
                                </div>
                                <div className={`h-24 rounded-xl border-2 border-dashed border-red-900/30 flex items-center px-4 overflow-x-auto gap-2 custom-scrollbar ${isDarkMode ? 'bg-red-950/20' : 'bg-red-50'}`}>
                                    {secretChain.map((blk) => (
                                        <div key={blk.id} className={`min-w-[60px] h-16 rounded-lg flex items-center justify-center text-white font-bold shadow-md relative shrink-0 transition-all ${blk.miner === 'public' ? 'bg-emerald-500 opacity-50' : 'bg-red-600'}`}>
                                            #{blk.id}
                                            {blk.id > 0 && <div className="absolute -left-3 w-4 h-0.5 bg-slate-400"></div>}
                                        </div>
                                    ))}
                                </div>

                                <div className="absolute top-1/2 right-4 -translate-y-1/2">
                                    <div className={`px-4 py-2 rounded-full font-bold text-sm ${secretChain.length > publicChain.length ? 'bg-red-500 text-white animate-bounce' : 'bg-slate-700 text-slate-400'}`}>
                                        {secretChain.length > publicChain.length ? '攻击链更长！可重组' : secretChain.length === publicChain.length ? '长度相同' : '攻击链较短'}
                                    </div>
                                </div>
                            </div>

                            {/* Success Overlay */}
                            {success && (
                                <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center z-50 animate-in fade-in rounded-2xl">
                                    <div className="bg-red-600 text-white p-8 rounded-3xl shadow-2xl text-center">
                                        <AlertTriangle className="w-16 h-16 mx-auto mb-4" />
                                        <h2 className="text-3xl font-black uppercase mb-2">51% 攻击成功</h2>
                                        <p className="text-red-100 max-w-md mx-auto mb-6">
                                            全网节点已接受你的影子链。诚实矿工的区块已被孤立。
                                        </p>
                                        <button onClick={reset} className="bg-white text-red-600 px-8 py-3 rounded-full font-bold hover:bg-red-50 transition-colors">
                                            重置模拟
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Explanation */}
                        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                攻击原理说明
                            </h3>
                            <div className="grid md:grid-cols-4 gap-4">
                                {[
                                    { step: 1, title: '发起交易', desc: '攻击者向交易所发送比特币换取法币/其他币' },
                                    { step: 2, title: '等待确认', desc: '等待交易获得足够确认，交易所放款' },
                                    { step: 3, title: '秘密挖矿', desc: '用优势算力挖掘一条不包含该交易的链' },
                                    { step: 4, title: '链重组', desc: '广播更长的链，原交易被撤销，币回到攻击者手中' }
                                ].map((item, i) => (
                                    <div key={i} className="relative">
                                        <div className={`absolute -top-3 -left-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${isDarkMode ? 'bg-red-600 text-white' : 'bg-red-500 text-white'}`}>
                                            {item.step}
                                        </div>
                                        <div className={`p-4 pt-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                            <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                        {i < 3 && <ArrowRight className={`absolute top-1/2 -right-3 w-6 h-6 ${isDarkMode ? 'text-slate-700' : 'text-slate-300'} hidden md:block`} />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Cost Tab */}
                {activeTab === 'cost' && (
                    <div className="space-y-6">
                        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <DollarSign className="inline w-6 h-6 mr-2 text-red-500" />
                                攻击成本估算器
                            </h3>

                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="text-sm font-bold text-slate-500 mb-2 block">交易确认数要求</label>
                                        <input
                                            type="range" min="1" max="100" value={confirmationsRequired}
                                            onChange={(e) => setConfirmationsRequired(Number(e.target.value))}
                                            className="w-full accent-red-500"
                                        />
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{confirmationsRequired} 个确认</span>
                                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>≈ {Math.round(confirmationsRequired * 10)} 分钟</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-sm font-bold text-slate-500 mb-2 block">目标金额 (BTC)</label>
                                        <input
                                            type="range" min="1" max="10000" value={targetAmount}
                                            onChange={(e) => setTargetAmount(Number(e.target.value))}
                                            className="w-full accent-orange-500"
                                        />
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>{targetAmount} BTC</span>
                                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>≈ ${(targetAmount * 100000).toLocaleString()}</span>
                                        </div>
                                    </div>

                                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="text-sm text-slate-500 mb-1">估算攻击成本</div>
                                        <div className="text-3xl font-bold text-red-500">
                                            ${calculateAttackCost().toLocaleString()}
                                        </div>
                                        <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            基于当前网络算力约 500 EH/s 估算
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-red-950/30 border border-red-900/30' : 'bg-red-50 border border-red-200'}`}>
                                    <h4 className="font-bold text-red-500 mb-4">为什么攻击比特币不划算？</h4>
                                    <ul className="space-y-3 text-sm">
                                        {[
                                            '需要购买或租赁大量专业矿机 (ASIC)',
                                            '电力成本巨大，需持续支付',
                                            '成功攻击会导致比特币价格暴跌',
                                            '攻击者持有的 BTC 也会贬值',
                                            '可能面临法律追究和制裁',
                                            '诚实挖矿收益更稳定可观'
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <TrendingDown className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Cost Comparison Table */}
                        <div className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="p-6 border-b border-slate-200 dark:border-slate-800">
                                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    不同确认数的安全等级
                                </h3>
                            </div>
                            <table className="w-full">
                                <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
                                    <tr>
                                        <th className="text-left p-4 text-sm font-bold">确认数</th>
                                        <th className="text-left p-4 text-sm font-bold">等待时间</th>
                                        <th className="text-left p-4 text-sm font-bold">攻击成本</th>
                                        <th className="text-left p-4 text-sm font-bold">适用场景</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        { confs: 1, time: '~10分钟', cost: '~$20M', use: '小额零售支付' },
                                        { confs: 3, time: '~30分钟', cost: '~$60M', use: '中等金额交易' },
                                        { confs: 6, time: '~1小时', cost: '~$120M', use: '大额交易 (标准)' },
                                        { confs: 12, time: '~2小时', cost: '~$240M', use: '超大额 / 交易所' },
                                        { confs: 100, time: '~17小时', cost: '~$2B', use: '极端安全场景' }
                                    ].map((row, i) => (
                                        <tr key={i} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                                            <td className="p-4 font-mono font-bold">{row.confs}</td>
                                            <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{row.time}</td>
                                            <td className="p-4 text-red-500 font-bold">{row.cost}</td>
                                            <td className={`p-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{row.use}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Defense Tab */}
                {activeTab === 'defense' && (
                    <div className="space-y-6">
                        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Shield className="inline w-6 h-6 mr-2 text-emerald-500" />
                                比特币如何防范 51% 攻击？
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: '经济激励对齐',
                                        desc: '矿工投入大量资金购买矿机和支付电费，攻击会导致币价暴跌，损害自身利益',
                                        icon: DollarSign,
                                        color: 'emerald'
                                    },
                                    {
                                        title: '算力分散',
                                        desc: '全球数千个矿池和个人矿工分散算力，单一实体难以控制 51%',
                                        icon: Layers,
                                        color: 'blue'
                                    },
                                    {
                                        title: '确认数机制',
                                        desc: '等待更多确认使攻击成本指数级增加，大额交易应等待 6+ 确认',
                                        icon: Clock,
                                        color: 'amber'
                                    },
                                    {
                                        title: '透明度与监控',
                                        desc: '链上活动公开透明，异常算力变化和链重组会被社区快速发现',
                                        icon: ShieldCheck,
                                        color: 'purple'
                                    }
                                ].map((item, i) => {
                                    const Icon = item.icon;
                                    return (
                                        <div key={i} className={`p-6 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                                                item.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-500' :
                                                item.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                                                item.color === 'amber' ? 'bg-amber-500/20 text-amber-500' :
                                                'bg-purple-500/20 text-purple-500'
                                            }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Best Practices */}
                        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                交易所和商家最佳实践
                            </h3>
                            <div className="grid md:grid-cols-3 gap-4">
                                {[
                                    { check: true, text: '大额充值等待 6+ 确认' },
                                    { check: true, text: '监控网络算力波动' },
                                    { check: true, text: '设置提款延迟期' },
                                    { check: true, text: '实施 KYC 验证' },
                                    { check: true, text: '监控异常交易模式' },
                                    { check: true, text: '保持链下流动性' },
                                    { check: false, text: '接受 0 确认交易' },
                                    { check: false, text: '仅依赖单一确认' },
                                    { check: false, text: '忽略网络状态监控' }
                                ].map((item, i) => (
                                    <div key={i} className={`flex items-center gap-2 p-3 rounded-lg ${
                                        item.check
                                            ? isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50'
                                            : isDarkMode ? 'bg-red-500/10' : 'bg-red-50'
                                    }`}>
                                        {item.check ? (
                                            <Check className="w-5 h-5 text-emerald-500 shrink-0" />
                                        ) : (
                                            <X className="w-5 h-5 text-red-500 shrink-0" />
                                        )}
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* History Tab */}
                {activeTab === 'history' && (
                    <div className="space-y-6">
                        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`text-xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <History className="inline w-6 h-6 mr-2 text-amber-500" />
                                历史上的 51% 攻击事件
                            </h3>
                            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                比特币从未遭受成功的 51% 攻击，但其他算力较低的币种多次被攻击
                            </p>

                            <div className="space-y-4">
                                {historicalAttacks.map((attack, i) => (
                                    <div key={i} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                                        <div className="flex flex-wrap items-center gap-4 mb-3">
                                            <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{attack.coin}</h4>
                                            <span className={`text-xs px-2 py-1 rounded-full ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-700'}`}>
                                                {attack.date}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4 text-sm">
                                            <div>
                                                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>攻击成本</div>
                                                <div className="font-bold text-amber-500">{attack.cost}</div>
                                            </div>
                                            <div>
                                                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>损失金额</div>
                                                <div className="font-bold text-red-500">{attack.stolen}</div>
                                            </div>
                                            <div>
                                                <div className={`text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>后果</div>
                                                <div className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{attack.outcome}</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Why Bitcoin is Safe */}
                        <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-emerald-950/30 border border-emerald-900/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                            <h3 className="text-lg font-bold text-emerald-500 mb-4 flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5" />
                                为什么比特币至今未被攻击成功？
                            </h3>
                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                                {[
                                    '全网算力超过 500 EH/s，是其他币种的数千倍',
                                    '专业 ASIC 矿机难以获取和部署',
                                    '攻击成本远超可能收益',
                                    '全球监管和法律威慑',
                                    '社区警惕性高，异常会被快速发现',
                                    '矿工有强烈的经济激励保护网络'
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-2">
                                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
};

export default Attack51Demo;
