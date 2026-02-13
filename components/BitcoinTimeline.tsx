import React from 'react';
import { Clock, Zap, GitMerge, Shield, Layers, Rocket, Wallet, Pizza, Scale } from 'lucide-react';

interface TimelineEvent {
    date: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    highlight?: boolean;
}

const events: TimelineEvent[] = [
    {
        date: '2008-10-31',
        title: '白皮书发布',
        description: '中本聪发布《Bitcoin: A Peer-to-Peer Electronic Cash System》白皮书',
        icon: Rocket,
        color: 'orange',
        highlight: true,
    },
    {
        date: '2009-01-03',
        title: '创世区块',
        description: '中本聪挖出第一个比特币区块，包含著名的报纸标题引用',
        icon: Layers,
        color: 'yellow',
        highlight: true,
    },
    {
        date: '2010-05-22',
        title: '比特币披萨日',
        description: 'Laszlo Hanyecz 用 10,000 BTC 购买两个披萨，首次实物交易',
        icon: Pizza,
        color: 'red',
    },
    {
        date: '2012-11-28',
        title: '第一次减半',
        description: '区块奖励从 50 BTC 降至 25 BTC',
        icon: Scale,
        color: 'blue',
        highlight: true,
    },
    {
        date: '2016-07-09',
        title: '第二次减半',
        description: '区块奖励从 25 BTC 降至 12.5 BTC',
        icon: Scale,
        color: 'blue',
    },
    {
        date: '2017-08-24',
        title: 'SegWit 激活',
        description: '隔离见证正式激活，解决交易延展性问题',
        icon: GitMerge,
        color: 'cyan',
        highlight: true,
    },
    {
        date: '2020-05-11',
        title: '第三次减半',
        description: '区块奖励从 12.5 BTC 降至 6.25 BTC',
        icon: Scale,
        color: 'blue',
    },
    {
        date: '2021-11-14',
        title: 'Taproot 激活',
        description: '引入 Schnorr 签名和 MAST，增强隐私和智能合约能力',
        icon: Shield,
        color: 'purple',
        highlight: true,
    },
    {
        date: '2024-04-20',
        title: '第四次减半',
        description: '区块奖励从 6.25 BTC 降至 3.125 BTC',
        icon: Scale,
        color: 'blue',
        highlight: true,
    },
];

interface BitcoinTimelineProps {
    isDarkMode: boolean;
}

const BitcoinTimeline: React.FC<BitcoinTimelineProps> = ({ isDarkMode }) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
        orange: {
            bg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100',
            text: 'text-orange-500',
            border: isDarkMode ? 'border-orange-500/30' : 'border-orange-200',
        },
        yellow: {
            bg: isDarkMode ? 'bg-yellow-500/20' : 'bg-yellow-100',
            text: 'text-yellow-500',
            border: isDarkMode ? 'border-yellow-500/30' : 'border-yellow-200',
        },
        red: {
            bg: isDarkMode ? 'bg-red-500/20' : 'bg-red-100',
            text: 'text-red-500',
            border: isDarkMode ? 'border-red-500/30' : 'border-red-200',
        },
        blue: {
            bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100',
            text: 'text-blue-500',
            border: isDarkMode ? 'border-blue-500/30' : 'border-blue-200',
        },
        cyan: {
            bg: isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100',
            text: 'text-cyan-500',
            border: isDarkMode ? 'border-cyan-500/30' : 'border-cyan-200',
        },
        purple: {
            bg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100',
            text: 'text-purple-500',
            border: isDarkMode ? 'border-purple-500/30' : 'border-purple-200',
        },
    };

    return (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'}`}>
                    <Clock className="w-5 h-5 text-orange-500" />
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>比特币历史</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>重大里程碑事件</p>
                </div>
            </div>

            <div className="relative">
                {/* Timeline line */}
                <div className={`absolute left-[19px] top-0 bottom-0 w-px ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`} />

                <div className="space-y-4">
                    {events.map((event, index) => {
                        const Icon = event.icon;
                        const colors = colorMap[event.color];

                        return (
                            <div key={index} className="relative pl-12">
                                {/* Dot */}
                                <div className={`absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg} border ${colors.border}`}>
                                    <Icon className={`w-5 h-5 ${colors.text}`} />
                                </div>

                                {/* Content */}
                                <div className={`p-4 rounded-xl border transition-colors ${
                                    event.highlight
                                        ? `${colors.bg} ${colors.border}`
                                        : isDarkMode ? 'bg-slate-800/50 border-slate-800' : 'bg-slate-50 border-slate-200'
                                }`}>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`text-xs font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {event.date}
                                        </span>
                                        {event.highlight && (
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${colors.bg} ${colors.text} border ${colors.border}`}>
                                                重要
                                            </span>
                                        )}
                                    </div>
                                    <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {event.title}
                                    </h4>
                                    <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        {event.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default BitcoinTimeline;
