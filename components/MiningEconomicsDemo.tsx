import React, { useState, useEffect } from 'react';
import {
    Pickaxe, TrendingDown, TrendingUp, Clock, DollarSign,
    Zap, BarChart3, Calculator, AlertTriangle, RefreshCw,
    Play, Pause, ChevronRight, Info, Award
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import { useToast } from './Toast';
import Quiz from './Quiz';
import { miningQuiz } from '../data/quizData';

// Types
interface HalvingEvent {
    number: number;
    blockHeight: number;
    date: string;
    reward: number;
    totalMined: number;
}

interface DifficultyEpoch {
    epochNumber: number;
    startBlock: number;
    difficulty: number;
    expectedTime: number; // in minutes
    actualTime: number;
    adjustment: number; // percentage
}

const MiningEconomicsDemo = () => {
    const { isDarkMode } = useLab();
    const toast = useToast();

    // State
    const [activeTab, setActiveTab] = useState<'halving' | 'difficulty' | 'economics' | 'quiz'>('halving');
    const [simulationSpeed, setSimulationSpeed] = useState(1);
    const [isSimulating, setIsSimulating] = useState(false);

    // Halving simulation state
    const [currentBlock, setCurrentBlock] = useState(840000);
    const [currentReward, setCurrentReward] = useState(3.125);
    const [totalSupply, setTotalSupply] = useState(19687500);

    // Difficulty simulation state
    const [networkHashrate, setNetworkHashrate] = useState(500); // EH/s
    const [currentDifficulty, setCurrentDifficulty] = useState(80);
    const [blockTimes, setBlockTimes] = useState<number[]>([]);
    const [difficultyHistory, setDifficultyHistory] = useState<DifficultyEpoch[]>([]);

    // Economics calculator state
    const [hashrate, setHashrate] = useState(100); // TH/s
    const [powerConsumption, setPowerConsumption] = useState(3000); // Watts
    const [electricityCost, setElectricityCost] = useState(0.1); // $/kWh
    const [btcPrice, setBtcPrice] = useState(60000); // USD

    // Halving data
    const halvingEvents: HalvingEvent[] = [
        { number: 0, blockHeight: 0, date: '2009-01-03', reward: 50, totalMined: 0 },
        { number: 1, blockHeight: 210000, date: '2012-11-28', reward: 25, totalMined: 10500000 },
        { number: 2, blockHeight: 420000, date: '2016-07-09', reward: 12.5, totalMined: 15750000 },
        { number: 3, blockHeight: 630000, date: '2020-05-11', reward: 6.25, totalMined: 18375000 },
        { number: 4, blockHeight: 840000, date: '2024-04-20', reward: 3.125, totalMined: 19687500 },
        { number: 5, blockHeight: 1050000, date: '~2028', reward: 1.5625, totalMined: 20343750 },
        { number: 6, blockHeight: 1260000, date: '~2032', reward: 0.78125, totalMined: 20671875 },
    ];

    // Block simulation
    useEffect(() => {
        if (!isSimulating) return;

        const interval = setInterval(() => {
            setCurrentBlock(prev => {
                const newBlock = prev + 1;
                const halvingIndex = Math.floor(newBlock / 210000);
                const newReward = 50 / Math.pow(2, halvingIndex);

                if (newBlock % 210000 === 0) {
                    toast.success('减半事件！', `区块奖励减少到 ${newReward} BTC`);
                    setCurrentReward(newReward);
                }

                setTotalSupply(s => s + newReward);

                // Simulate block time variation
                const baseTime = 10; // 10 minutes target
                const randomTime = baseTime + (Math.random() - 0.5) * 4;
                setBlockTimes(prev => [...prev.slice(-100), randomTime]);

                return newBlock;
            });
        }, 1000 / simulationSpeed);

        return () => clearInterval(interval);
    }, [isSimulating, simulationSpeed, toast]);

    // Calculate mining profitability
    const calculateProfitability = () => {
        const networkHashrateH = networkHashrate * 1e18; // EH/s to H/s
        const minerHashrateH = hashrate * 1e12; // TH/s to H/s

        // Probability of finding block
        const blocksPerDay = 144;
        const dailyBtcReward = blocksPerDay * currentReward;

        // Miner's share of network
        const minerShare = minerHashrateH / networkHashrateH;
        const dailyBtcEarned = dailyBtcReward * minerShare;

        // Costs
        const dailyPowerKwh = (powerConsumption * 24) / 1000;
        const dailyCost = dailyPowerKwh * electricityCost;

        // Revenue
        const dailyRevenue = dailyBtcEarned * btcPrice;
        const dailyProfit = dailyRevenue - dailyCost;

        return {
            dailyBtcEarned,
            dailyRevenue,
            dailyCost,
            dailyProfit,
            breakEvenPrice: dailyCost / dailyBtcEarned,
        };
    };

    const profitability = calculateProfitability();

    // Calculate progress to next halving
    const blocksToNextHalving = 210000 - (currentBlock % 210000);
    const progressToHalving = ((currentBlock % 210000) / 210000) * 100;

    // Average block time from simulation
    const avgBlockTime = blockTimes.length > 0
        ? blockTimes.reduce((a, b) => a + b, 0) / blockTimes.length
        : 10;

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Navigation */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-amber-500 text-white p-1.5 rounded-full">
                        <Pickaxe className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">挖矿经济学</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">

                {/* Intro */}
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <Pickaxe className="w-8 h-8" /> 比特币挖矿经济学
                    </h2>
                    <p className="text-amber-100 text-lg leading-relaxed max-w-3xl">
                        比特币挖矿是一场算力竞赛与经济博弈的结合。理解减半周期、难度调整机制和挖矿收益计算，
                        有助于你理解比特币的货币政策和网络安全模型。
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-2">
                    {[
                        { id: 'halving', label: '减半周期', icon: TrendingDown },
                        { id: 'difficulty', label: '难度调整', icon: BarChart3 },
                        { id: 'economics', label: '收益计算', icon: Calculator },
                        { id: 'quiz', label: '测验', icon: Award },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                                activeTab === tab.id
                                    ? 'bg-amber-500 text-white'
                                    : isDarkMode
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                            }`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Halving Tab */}
                {activeTab === 'halving' && (
                    <div className="space-y-6">
                        {/* Controls */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => setIsSimulating(!isSimulating)}
                                        className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
                                            isSimulating
                                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                                        }`}
                                    >
                                        {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        {isSimulating ? '暂停' : '开始模拟'}
                                    </button>
                                    <div className="flex items-center gap-2">
                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>速度:</span>
                                        <select
                                            value={simulationSpeed}
                                            onChange={(e) => setSimulationSpeed(Number(e.target.value))}
                                            className={`px-3 py-1.5 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                                        >
                                            <option value={1}>1x</option>
                                            <option value={5}>5x</option>
                                            <option value={10}>10x</option>
                                            <option value={50}>50x</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Live Stats */}
                                <div className="flex gap-6">
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {currentBlock.toLocaleString()}
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>当前区块</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold text-amber-500`}>
                                            {currentReward} BTC
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>区块奖励</div>
                                    </div>
                                    <div className="text-center">
                                        <div className={`text-2xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            {(totalSupply / 1000000).toFixed(2)}M
                                        </div>
                                        <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>已挖出 BTC</div>
                                    </div>
                                </div>
                            </div>

                            {/* Progress to next halving */}
                            <div className="mt-6">
                                <div className="flex justify-between mb-2">
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        距下次减半还有 {blocksToNextHalving.toLocaleString()} 个区块
                                    </span>
                                    <span className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {progressToHalving.toFixed(1)}%
                                    </span>
                                </div>
                                <div className={`h-4 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-300"
                                        style={{ width: `${progressToHalving}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Halving Timeline */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                比特币减半时间线
                            </h3>

                            <div className="relative">
                                {/* Timeline line */}
                                <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

                                <div className="space-y-6">
                                    {halvingEvents.map((event, i) => {
                                        const isPast = event.blockHeight <= currentBlock;
                                        const isCurrent = i === Math.floor(currentBlock / 210000);

                                        return (
                                            <div key={event.number} className="relative flex items-start gap-4 pl-12">
                                                <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                                    isCurrent
                                                        ? 'bg-amber-500 text-white ring-4 ring-amber-500/30'
                                                        : isPast
                                                        ? 'bg-emerald-500 text-white'
                                                        : isDarkMode
                                                        ? 'bg-slate-700 text-slate-400'
                                                        : 'bg-slate-300 text-slate-600'
                                                }`}>
                                                    {event.number}
                                                </div>

                                                <div className={`flex-1 p-4 rounded-xl ${
                                                    isCurrent
                                                        ? isDarkMode ? 'bg-amber-500/20 border border-amber-500/50' : 'bg-amber-50 border border-amber-200'
                                                        : isDarkMode ? 'bg-slate-800' : 'bg-slate-100'
                                                }`}>
                                                    <div className="flex flex-wrap justify-between gap-2 mb-2">
                                                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            区块 #{event.blockHeight.toLocaleString()}
                                                        </span>
                                                        <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                            {event.date}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4 text-sm">
                                                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                                            奖励: <span className="font-mono text-amber-500">{event.reward} BTC</span>
                                                        </span>
                                                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                                            累计: <span className="font-mono">{(event.totalMined / 1000000).toFixed(2)}M BTC</span>
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* Supply Chart */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                供应曲线
                            </h3>
                            <div className="h-48 flex items-end gap-1">
                                {halvingEvents.map((event, i) => {
                                    const height = (event.totalMined / 21000000) * 100;
                                    const isActive = i === Math.floor(currentBlock / 210000);
                                    return (
                                        <div key={i} className="flex-1 flex flex-col items-center">
                                            <div
                                                className={`w-full rounded-t transition-all ${
                                                    isActive ? 'bg-amber-500' : 'bg-emerald-500'
                                                }`}
                                                style={{ height: `${height}%` }}
                                            />
                                            <span className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                {event.date.slice(0, 4)}
                                            </span>
                                        </div>
                                    );
                                })}
                                <div className="flex-1 flex flex-col items-center">
                                    <div className="w-full h-full rounded-t bg-slate-600 opacity-30" />
                                    <span className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        2140
                                    </span>
                                </div>
                            </div>
                            <div className="flex justify-between mt-4">
                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    当前供应: {(totalSupply / 1000000).toFixed(4)}M BTC
                                </span>
                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    最大供应: 21M BTC ({((totalSupply / 21000000) * 100).toFixed(2)}% 已挖出)
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Difficulty Tab */}
                {activeTab === 'difficulty' && (
                    <div className="space-y-6">
                        {/* Difficulty Explanation */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <BarChart3 className="w-5 h-5 text-amber-500" /> 难度调整机制
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        工作原理
                                    </h4>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 比特币目标是每 10 分钟产生一个区块</li>
                                        <li>• 每 2016 个区块（约 2 周）调整一次难度</li>
                                        <li>• 如果出块太快，难度上调；太慢则下调</li>
                                        <li>• 单次调整幅度最大 ±300%</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        调整公式
                                    </h4>
                                    <div className={`p-4 rounded-xl font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <p className="mb-2">新难度 = 旧难度 × (实际时间 / 预期时间)</p>
                                        <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                            预期时间 = 2016 × 10 分钟 = 20160 分钟 = 2 周
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Simulator */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                难度调整模拟器
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            网络算力 (EH/s)
                                        </label>
                                        <input
                                            type="range"
                                            min="100"
                                            max="1000"
                                            value={networkHashrate}
                                            onChange={(e) => setNetworkHashrate(Number(e.target.value))}
                                            className="w-full accent-amber-500"
                                        />
                                        <div className="flex justify-between mt-1">
                                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>100 EH/s</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{networkHashrate} EH/s</span>
                                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>1000 EH/s</span>
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            当前难度 (T)
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="200"
                                            value={currentDifficulty}
                                            onChange={(e) => setCurrentDifficulty(Number(e.target.value))}
                                            className="w-full accent-amber-500"
                                        />
                                        <div className="flex justify-between mt-1">
                                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>10 T</span>
                                            <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{currentDifficulty} T</span>
                                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>200 T</span>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        模拟结果
                                    </h4>
                                    {(() => {
                                        const expectedBlockTime = 10;
                                        const actualBlockTime = (currentDifficulty * 10) / (networkHashrate / 50);
                                        const adjustment = ((expectedBlockTime / actualBlockTime) - 1) * 100;

                                        return (
                                            <div className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <p>
                                                    预期出块时间: <span className="font-mono text-emerald-500">10 分钟</span>
                                                </p>
                                                <p>
                                                    实际出块时间: <span className={`font-mono ${actualBlockTime > 10 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {actualBlockTime.toFixed(1)} 分钟
                                                    </span>
                                                </p>
                                                <p>
                                                    下次调整: <span className={`font-bold ${adjustment > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {adjustment > 0 ? '+' : ''}{adjustment.toFixed(1)}%
                                                    </span>
                                                </p>
                                                <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                    {adjustment > 0 ? '难度将上调，出块会变慢' : '难度将下调，出块会变快'}
                                                </p>
                                            </div>
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>

                        {/* Historical Context */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                难度调整的意义
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Clock className="w-8 h-8 text-amber-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        稳定出块
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        无论全网算力如何变化，平均 10 分钟一个区块的节奏保持稳定
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <TrendingDown className="w-8 h-8 text-amber-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        可预测发行
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        减半每 ~4 年发生一次，总供应量和发行速度可预测
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <Zap className="w-8 h-8 text-amber-500 mb-2" />
                                    <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        抗算力突变
                                    </h4>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        即使大量矿工下线，网络也能在 2 周内自动调整恢复
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Economics Tab */}
                {activeTab === 'economics' && (
                    <div className="space-y-6">
                        {/* Calculator */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <Calculator className="w-5 h-5 text-amber-500" /> 挖矿收益计算器
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Inputs */}
                                <div className="space-y-4">
                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            你的算力 (TH/s)
                                        </label>
                                        <input
                                            type="number"
                                            value={hashrate}
                                            onChange={(e) => setHashrate(Number(e.target.value))}
                                            className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            功耗 (瓦特)
                                        </label>
                                        <input
                                            type="number"
                                            value={powerConsumption}
                                            onChange={(e) => setPowerConsumption(Number(e.target.value))}
                                            className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            电费 ($/kWh)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={electricityCost}
                                            onChange={(e) => setElectricityCost(Number(e.target.value))}
                                            className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            BTC 价格 ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={btcPrice}
                                            onChange={(e) => setBtcPrice(Number(e.target.value))}
                                            className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                                        />
                                    </div>

                                    <div>
                                        <label className={`text-sm font-medium block mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            全网算力 (EH/s)
                                        </label>
                                        <input
                                            type="number"
                                            value={networkHashrate}
                                            onChange={(e) => setNetworkHashrate(Number(e.target.value))}
                                            className={`w-full px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}
                                        />
                                    </div>
                                </div>

                                {/* Results */}
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        每日收益
                                    </h4>

                                    <div className="space-y-4">
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>挖矿收入:</span>
                                            <span className={`font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {profitability.dailyBtcEarned.toFixed(8)} BTC
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>折合美元:</span>
                                            <span className="font-mono text-emerald-500">
                                                ${profitability.dailyRevenue.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>电费成本:</span>
                                            <span className="font-mono text-red-500">
                                                -${profitability.dailyCost.toFixed(2)}
                                            </span>
                                        </div>

                                        <div className={`border-t pt-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-300'}`}>
                                            <div className="flex justify-between">
                                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>净利润:</span>
                                                <span className={`font-bold font-mono text-xl ${profitability.dailyProfit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                    ${profitability.dailyProfit.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                盈亏平衡 BTC 价格:
                                            </p>
                                            <p className={`font-mono font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                ${profitability.breakEvenPrice.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mining Game Theory */}
                        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                            <h3 className={`font-bold text-lg mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                <AlertTriangle className="w-5 h-5 text-amber-500" /> 矿工博弈论
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        为什么矿工不作恶？
                                    </h4>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• <strong>经济激励:</strong> 诚实挖矿是最稳定的收入来源</li>
                                        <li>• <strong>设备投资:</strong> 矿机是专用硬件，只能挖比特币</li>
                                        <li>• <strong>网络效应:</strong> 攻击成功会导致币价崩盘，矿工损失更大</li>
                                        <li>• <strong>声誉风险:</strong> 矿池作恶会失去矿工信任</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        减半后的影响
                                    </h4>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 区块奖励减半，矿工收入减少 50%</li>
                                        <li>• 低效矿机被淘汰，算力短期下降</li>
                                        <li>• 交易手续费占比增加</li>
                                        <li>• 历史上每次减半后都伴随价格上涨</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        矿池集中化风险
                                    </h4>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 大型矿池可能控制较大比例算力</li>
                                        <li>• Stratum V2 协议让矿工自选交易</li>
                                        <li>• 矿工可随时切换矿池</li>
                                        <li>• 去中心化矿池方案正在发展</li>
                                    </ul>
                                </div>

                                <div>
                                    <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        能源消耗争议
                                    </h4>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 比特币挖矿年耗电约 100-150 TWh</li>
                                        <li>• 约 50% 使用可再生能源</li>
                                        <li>• 消耗否则浪费的能源（弃风弃水）</li>
                                        <li>• 能源使用效率持续提升</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quiz Tab */}
                {activeTab === 'quiz' && (
                    <div className="space-y-6 animate-in fade-in duration-500">
                        <div className="text-center mb-8">
                            <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'}`}>
                                <Award className="w-8 h-8 text-amber-500" />
                            </div>
                            <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                                挖矿经济学知识测验
                            </h2>
                            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                测试你对挖矿经济学的理解
                            </p>
                        </div>
                        <Quiz quizData={miningQuiz} />
                    </div>
                )}

            </main>
        </div>
    );
};

export default MiningEconomicsDemo;
