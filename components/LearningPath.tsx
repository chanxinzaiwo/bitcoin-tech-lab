import React from 'react';
import {
    BookOpen, CheckCircle, Circle, Lock, ArrowRight,
    GraduationCap, Star, Zap, Shield, Wallet, Network,
    Scaling, Server, Clock
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import { View } from '../config/navigation';

interface LearningPathProps {
    onViewChange: (view: View) => void;
    onClose: () => void;
}

interface Module {
    id: View;
    title: string;
    duration: string;
    description: string;
}

interface Level {
    title: string;
    description: string;
    icon: any;
    color: string;
    modules: Module[];
}

const LearningPath: React.FC<LearningPathProps> = ({ onViewChange, onClose }) => {
    const { isDarkMode, visitedModules } = useLab();

    const levels: Level[] = [
        {
            title: '入门篇',
            description: '理解比特币的基础概念',
            icon: BookOpen,
            color: 'emerald',
            modules: [
                { id: 'ecc', title: 'ECC 加密原理', duration: '15分钟', description: '了解公钥密码学基础' },
                { id: 'address', title: '地址生成', duration: '10分钟', description: '从公钥到比特币地址' },
                { id: 'utxo', title: 'UTXO 模型', duration: '15分钟', description: '理解比特币的"余额"概念' },
                { id: 'p2p', title: 'P2P 网络', duration: '10分钟', description: '交易如何传播' },
                { id: 'pow', title: 'PoW 挖矿', duration: '15分钟', description: '工作量证明基础' },
            ],
        },
        {
            title: '基础篇',
            description: '深入交易和钱包机制',
            icon: Wallet,
            color: 'blue',
            modules: [
                { id: 'hdwallet', title: 'HD 钱包', duration: '20分钟', description: 'BIP32/39 分层确定性钱包' },
                { id: 'script', title: '脚本引擎', duration: '25分钟', description: 'Bitcoin Script 虚拟机' },
                { id: 'mempool', title: '内存池', duration: '15分钟', description: '交易等待区与费用市场' },
                { id: 'rbf', title: 'RBF 竞价', duration: '10分钟', description: '手续费替换机制' },
                { id: 'mining', title: '挖矿经济学', duration: '20分钟', description: '减半、难度调整、收益' },
            ],
        },
        {
            title: '进阶篇',
            description: '共识机制与网络安全',
            icon: Network,
            color: 'amber',
            modules: [
                { id: 'consensus', title: '共识机制', duration: '20分钟', description: 'Nakamoto 共识详解' },
                { id: 'fork', title: '软硬分叉', duration: '15分钟', description: '协议升级的两种方式' },
                { id: 'attack51', title: '51% 攻击', duration: '15分钟', description: '双花攻击原理与防范' },
                { id: 'fullnode', title: '全节点', duration: '20分钟', description: '为什么要运行全节点' },
                { id: 'spv', title: 'SPV 轻节点', duration: '10分钟', description: '轻钱包的权衡' },
            ],
        },
        {
            title: '专家篇',
            description: '现代协议升级与二层方案',
            icon: Scaling,
            color: 'purple',
            modules: [
                { id: 'segwit', title: '隔离见证', duration: '25分钟', description: 'SegWit 升级详解' },
                { id: 'schnorr', title: 'Schnorr 签名', duration: '20分钟', description: '签名聚合与批量验证' },
                { id: 'taproot', title: 'Taproot', duration: '30分钟', description: 'MAST 与智能合约隐私' },
                { id: 'lightning', title: '闪电网络', duration: '30分钟', description: '支付通道与路由' },
                { id: 'privacy', title: '隐私技术', duration: '25分钟', description: 'CoinJoin、PayJoin、Silent Payments' },
            ],
        },
        {
            title: '前沿篇',
            description: '量子计算与未来发展',
            icon: Zap,
            color: 'cyan',
            modules: [
                { id: 'history', title: '比特币历史', duration: '20分钟', description: '重大事件时间线' },
                { id: 'quantum', title: '量子计算威胁', duration: '15分钟', description: 'Shor 算法与 ECC' },
                { id: 'lamport', title: 'Lamport 签名', duration: '15分钟', description: '后量子密码学方案' },
                { id: 'cold', title: '冷钱包', duration: '15分钟', description: '安全存储最佳实践' },
            ],
        },
    ];

    const isModuleCompleted = (moduleId: View) => visitedModules.includes(moduleId);

    const getLevelProgress = (level: Level) => {
        const completed = level.modules.filter(m => isModuleCompleted(m.id)).length;
        return { completed, total: level.modules.length };
    };

    const getColorClasses = (color: string) => {
        const colors: Record<string, { bg: string; border: string; text: string; light: string }> = {
            emerald: {
                bg: isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50',
                border: 'border-emerald-500',
                text: 'text-emerald-500',
                light: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50/50',
            },
            blue: {
                bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50',
                border: 'border-blue-500',
                text: 'text-blue-500',
                light: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50/50',
            },
            amber: {
                bg: isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50',
                border: 'border-amber-500',
                text: 'text-amber-500',
                light: isDarkMode ? 'bg-amber-500/10' : 'bg-amber-50/50',
            },
            purple: {
                bg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50',
                border: 'border-purple-500',
                text: 'text-purple-500',
                light: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50/50',
            },
            cyan: {
                bg: isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-50',
                border: 'border-cyan-500',
                text: 'text-cyan-500',
                light: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50/50',
            },
        };
        return colors[color] || colors.emerald;
    };

    const totalModules = levels.reduce((sum, l) => sum + l.modules.length, 0);
    const completedModules = levels.reduce((sum, l) =>
        sum + l.modules.filter(m => isModuleCompleted(m.id)).length, 0);

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" onClick={onClose}>
            <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur-sm`}>
                <div
                    className="max-w-4xl mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                            <GraduationCap className="w-5 h-5" />
                            <span className="font-bold">学习路径</span>
                        </div>
                        <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            系统学习比特币技术
                        </h2>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            从入门到专家，循序渐进掌握比特币核心技术
                        </p>

                        {/* Overall Progress */}
                        <div className="mt-6 max-w-md mx-auto">
                            <div className="flex justify-between text-sm mb-2">
                                <span className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>总体进度</span>
                                <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {completedModules}/{totalModules} 模块
                                </span>
                            </div>
                            <div className={`h-3 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                <div
                                    className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500"
                                    style={{ width: `${(completedModules / totalModules) * 100}%` }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Levels */}
                    <div className="space-y-6">
                        {levels.map((level, levelIndex) => {
                            const colors = getColorClasses(level.color);
                            const progress = getLevelProgress(level);
                            const Icon = level.icon;
                            const isLevelComplete = progress.completed === progress.total;

                            return (
                                <div
                                    key={level.title}
                                    className={`rounded-2xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                                >
                                    {/* Level Header */}
                                    <div className={`p-6 ${colors.light}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors.bg}`}>
                                                    <Icon className={`w-6 h-6 ${colors.text}`} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            {level.title}
                                                        </h3>
                                                        {isLevelComplete && (
                                                            <span className="px-2 py-0.5 bg-emerald-500 text-white text-xs rounded-full font-bold">
                                                                已完成
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        {level.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className={`text-2xl font-bold ${colors.text}`}>
                                                    {progress.completed}/{progress.total}
                                                </div>
                                                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                    已完成
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Modules Grid */}
                                    <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {level.modules.map((module, moduleIndex) => {
                                            const isCompleted = isModuleCompleted(module.id);

                                            return (
                                                <button
                                                    key={module.id}
                                                    onClick={() => {
                                                        onViewChange(module.id);
                                                        onClose();
                                                    }}
                                                    className={`text-left p-4 rounded-xl border transition-all hover:scale-[1.02] ${
                                                        isCompleted
                                                            ? isDarkMode
                                                                ? 'bg-emerald-500/10 border-emerald-500/30'
                                                                : 'bg-emerald-50 border-emerald-200'
                                                            : isDarkMode
                                                            ? 'bg-slate-800 border-slate-700 hover:border-slate-600'
                                                            : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                                    }`}
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                                                            isCompleted
                                                                ? 'bg-emerald-500 text-white'
                                                                : isDarkMode
                                                                ? 'bg-slate-700 text-slate-400'
                                                                : 'bg-slate-200 text-slate-500'
                                                        }`}>
                                                            {isCompleted ? (
                                                                <CheckCircle className="w-4 h-4" />
                                                            ) : (
                                                                <span className="text-xs font-bold">{moduleIndex + 1}</span>
                                                            )}
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className={`font-bold truncate ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                                {module.title}
                                                            </h4>
                                                            <p className={`text-xs truncate ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                                {module.description}
                                                            </p>
                                                            <div className={`flex items-center gap-1 mt-1 text-xs ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`}>
                                                                <Clock className="w-3 h-3" />
                                                                {module.duration}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Close Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={onClose}
                            className={`px-8 py-3 rounded-xl font-bold transition-colors ${
                                isDarkMode
                                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                            }`}
                        >
                            关闭
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LearningPath;
