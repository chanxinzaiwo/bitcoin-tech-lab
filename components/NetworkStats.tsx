import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Clock, TrendingUp, Layers, Zap, RefreshCw } from 'lucide-react';

interface NetworkData {
    blockHeight: number;
    difficulty: string;
    hashRate: string;
    mempoolSize: number;
    avgFee: number;
    nextHalving: number;
    blocksUntilHalving: number;
}

const NetworkStats: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [data, setData] = useState<NetworkData | null>(null);
    const [loading, setLoading] = useState(true);
    const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0 });

    // Simulated network data (in production, fetch from API)
    useEffect(() => {
        const simulateData = () => {
            // Next halving is around April 2028 (block 1,050,000)
            const currentBlock = 878500 + Math.floor(Math.random() * 100);
            const halvingBlock = 1050000;
            const blocksLeft = halvingBlock - currentBlock;

            setData({
                blockHeight: currentBlock,
                difficulty: '110.45 T',
                hashRate: '756.2 EH/s',
                mempoolSize: Math.floor(15000 + Math.random() * 10000),
                avgFee: Math.floor(5 + Math.random() * 20),
                nextHalving: halvingBlock,
                blocksUntilHalving: blocksLeft,
            });
            setLoading(false);
        };

        simulateData();
        const interval = setInterval(simulateData, 60000); // Update every minute
        return () => clearInterval(interval);
    }, []);

    // Countdown timer
    useEffect(() => {
        if (!data) return;

        const calculateCountdown = () => {
            // Approximate: 10 minutes per block
            const minutesLeft = data.blocksUntilHalving * 10;
            const totalSeconds = minutesLeft * 60;

            const days = Math.floor(totalSeconds / 86400);
            const hours = Math.floor((totalSeconds % 86400) / 3600);
            const minutes = Math.floor((totalSeconds % 3600) / 60);

            setCountdown({ days, hours, minutes });
        };

        calculateCountdown();
        const interval = setInterval(calculateCountdown, 60000);
        return () => clearInterval(interval);
    }, [data]);

    if (loading) {
        return (
            <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-center gap-2 text-slate-500">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>加载网络数据...</span>
                </div>
            </div>
        );
    }

    return (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Activity className="w-5 h-5 text-emerald-500" />
                    比特币网络实时状态
                </h3>
                <span className="flex items-center gap-1 text-xs text-emerald-500">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    实时
                </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                <StatCard
                    icon={Layers}
                    label="区块高度"
                    value={data!.blockHeight.toLocaleString()}
                    color="text-blue-500"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    icon={Cpu}
                    label="全网算力"
                    value={data!.hashRate}
                    color="text-orange-500"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    icon={TrendingUp}
                    label="挖矿难度"
                    value={data!.difficulty}
                    color="text-purple-500"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    icon={Clock}
                    label="内存池交易"
                    value={data!.mempoolSize.toLocaleString()}
                    color="text-cyan-500"
                    isDarkMode={isDarkMode}
                />
                <StatCard
                    icon={Zap}
                    label="平均手续费"
                    value={`${data!.avgFee} sat/vB`}
                    color="text-yellow-500"
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Halving Countdown */}
            <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-orange-50 border-orange-200'}`}>
                <div className="flex items-center justify-between mb-3">
                    <span className="text-sm font-bold text-orange-500">下次减半倒计时</span>
                    <span className="text-xs text-slate-500">区块 #{data!.nextHalving.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-center gap-4">
                    <CountdownUnit value={countdown.days} label="天" isDarkMode={isDarkMode} />
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>:</span>
                    <CountdownUnit value={countdown.hours} label="时" isDarkMode={isDarkMode} />
                    <span className={`text-2xl font-bold ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>:</span>
                    <CountdownUnit value={countdown.minutes} label="分" isDarkMode={isDarkMode} />
                </div>
                <div className="text-center mt-3 text-xs text-slate-500">
                    剩余 {data!.blocksUntilHalving.toLocaleString()} 个区块 | 奖励将从 3.125 BTC 降至 1.5625 BTC
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon: Icon, label, value, color, isDarkMode }: any) => (
    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className={`flex items-center gap-1 text-xs mb-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
            <Icon className={`w-3 h-3 ${color}`} />
            {label}
        </div>
        <div className={`font-bold font-mono text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {value}
        </div>
    </div>
);

const CountdownUnit = ({ value, label, isDarkMode }: { value: number; label: string; isDarkMode: boolean }) => (
    <div className="text-center">
        <div className={`text-3xl sm:text-4xl font-bold font-mono ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            {String(value).padStart(2, '0')}
        </div>
        <div className="text-xs text-slate-500">{label}</div>
    </div>
);

export default NetworkStats;
