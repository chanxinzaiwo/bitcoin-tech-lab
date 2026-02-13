import React, { useState, useEffect } from 'react';
import { Trophy, Star, Lock, ChevronRight, Award, Target, Zap, Crown, Medal, TrendingUp, BookOpen } from 'lucide-react';
import { useLab } from '../store/LabContext';
import {
    Achievement,
    UserProgress,
    loadUserProgress,
    achievements,
    getAchievementById,
    getRarityColor,
    getRarityBgColor,
    getRarityLabel,
    calculateOverallProgress
} from '../data/achievementsData';

const Achievements = () => {
    const { isDarkMode } = useLab();
    const [activeTab, setActiveTab] = useState<'overview' | 'achievements' | 'stats'>('overview');
    const [progress, setProgress] = useState<UserProgress | null>(null);

    useEffect(() => {
        setProgress(loadUserProgress());
    }, []);

    if (!progress) {
        return (
            <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} flex items-center justify-center`}>
                <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
            </div>
        );
    }

    const unlockedAchievements = progress.achievements
        .map(ua => ({ ...getAchievementById(ua.achievementId)!, unlockedAt: ua.unlockedAt }))
        .filter(a => a.id);

    const lockedAchievements = achievements.filter(
        a => !progress.achievements.some(ua => ua.achievementId === a.id)
    );

    const overallProgress = calculateOverallProgress();
    const uniqueModulesCompleted = new Set(progress.quizHistory.map(h => h.moduleId)).size;

    // Calculate stats
    const totalQuizzesTaken = progress.quizHistory.length;
    const perfectScores = progress.quizHistory.filter(q => q.score === q.total).length;
    const averageScore = progress.quizHistory.length > 0
        ? Math.round((progress.quizHistory.reduce((sum, q) => sum + (q.score / q.total) * 100, 0) / progress.quizHistory.length))
        : 0;

    const tabs = [
        { id: 'overview', label: '概览', icon: Target },
        { id: 'achievements', label: '成就', icon: Trophy },
        { id: 'stats', label: '统计', icon: TrendingUp },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Header */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-amber-500 text-white p-1.5 rounded-full">
                            <Trophy className="h-6 w-6" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">学习成就</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`flex items-center gap-1 px-3 py-1 rounded-full ${isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700'}`}>
                            <Star className="w-4 h-4" />
                            <span className="font-bold">{progress.totalPoints}</span>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Tab Navigation */}
            <div className={`border-b ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white/50 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex gap-2 py-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                                        activeTab === tab.id
                                            ? 'bg-amber-500 text-white'
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
                {activeTab === 'overview' && (
                    <OverviewSection
                        isDarkMode={isDarkMode}
                        progress={progress}
                        overallProgress={overallProgress}
                        uniqueModulesCompleted={uniqueModulesCompleted}
                        unlockedAchievements={unlockedAchievements}
                        lockedAchievements={lockedAchievements}
                    />
                )}
                {activeTab === 'achievements' && (
                    <AchievementsSection
                        isDarkMode={isDarkMode}
                        unlockedAchievements={unlockedAchievements}
                        lockedAchievements={lockedAchievements}
                    />
                )}
                {activeTab === 'stats' && (
                    <StatsSection
                        isDarkMode={isDarkMode}
                        progress={progress}
                        totalQuizzesTaken={totalQuizzesTaken}
                        perfectScores={perfectScores}
                        averageScore={averageScore}
                        uniqueModulesCompleted={uniqueModulesCompleted}
                    />
                )}
            </main>
        </div>
    );
};

// Overview Section
interface OverviewSectionProps {
    isDarkMode: boolean;
    progress: UserProgress;
    overallProgress: number;
    uniqueModulesCompleted: number;
    unlockedAchievements: (Achievement & { unlockedAt: number })[];
    lockedAchievements: Achievement[];
}

const OverviewSection = ({ isDarkMode, progress, overallProgress, uniqueModulesCompleted, unlockedAchievements, lockedAchievements }: OverviewSectionProps) => (
    <div className="space-y-8 animate-in fade-in">
        {/* Hero Stats */}
        <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-8 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                <Crown className="w-8 h-8" /> 学习进度
            </h2>
            <p className="text-amber-100 text-lg mb-6">
                继续学习，解锁更多成就，成为比特币技术专家！
            </p>

            {/* Progress Bar */}
            <div className="space-y-2">
                <div className="flex justify-between text-sm">
                    <span>总体进度</span>
                    <span className="font-bold">{overallProgress}%</span>
                </div>
                <div className="h-4 bg-black/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white/90 rounded-full transition-all duration-500"
                        style={{ width: `${overallProgress}%` }}
                    />
                </div>
                <div className="text-sm text-amber-100">
                    已完成 {uniqueModulesCompleted} / 9 个模块测验
                </div>
            </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard
                isDarkMode={isDarkMode}
                icon={<Trophy className="w-6 h-6 text-amber-500" />}
                value={unlockedAchievements.length}
                label="已解锁成就"
                color="amber"
            />
            <StatCard
                isDarkMode={isDarkMode}
                icon={<Star className="w-6 h-6 text-yellow-500" />}
                value={progress.totalPoints}
                label="总积分"
                color="yellow"
            />
            <StatCard
                isDarkMode={isDarkMode}
                icon={<BookOpen className="w-6 h-6 text-blue-500" />}
                value={progress.quizHistory.length}
                label="测验次数"
                color="blue"
            />
            <StatCard
                isDarkMode={isDarkMode}
                icon={<Medal className="w-6 h-6 text-purple-500" />}
                value={progress.quizHistory.filter(q => q.score === q.total).length}
                label="满分次数"
                color="purple"
            />
        </div>

        {/* Recent Achievements */}
        {unlockedAchievements.length > 0 && (
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    最近获得的成就
                </h3>
                <div className="grid gap-3">
                    {unlockedAchievements
                        .sort((a, b) => b.unlockedAt - a.unlockedAt)
                        .slice(0, 3)
                        .map((achievement) => (
                            <AchievementCard
                                key={achievement.id}
                                achievement={achievement}
                                isDarkMode={isDarkMode}
                                unlocked
                                unlockedAt={achievement.unlockedAt}
                            />
                        ))}
                </div>
            </div>
        )}

        {/* Next Achievement to Unlock */}
        {lockedAchievements.length > 0 && (
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    下一个目标
                </h3>
                <AchievementCard
                    achievement={lockedAchievements[0]}
                    isDarkMode={isDarkMode}
                    unlocked={false}
                />
            </div>
        )}
    </div>
);

// Achievements Section
interface AchievementsSectionProps {
    isDarkMode: boolean;
    unlockedAchievements: (Achievement & { unlockedAt: number })[];
    lockedAchievements: Achievement[];
}

const AchievementsSection = ({ isDarkMode, unlockedAchievements, lockedAchievements }: AchievementsSectionProps) => {
    const categories = [
        { id: 'quiz', label: '测验成就', icon: BookOpen },
        { id: 'mastery', label: '精通成就', icon: Crown },
        { id: 'exploration', label: '探索成就', icon: Target },
        { id: 'special', label: '特殊成就', icon: Zap },
    ];

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Progress Summary */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            成就进度
                        </h3>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            已解锁 {unlockedAchievements.length} / {achievements.length} 个成就
                        </p>
                    </div>
                    <div className={`text-3xl font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                        {Math.round((unlockedAchievements.length / achievements.length) * 100)}%
                    </div>
                </div>
                <div className="mt-4 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-amber-500 rounded-full transition-all duration-500"
                        style={{ width: `${(unlockedAchievements.length / achievements.length) * 100}%` }}
                    />
                </div>
            </div>

            {/* Achievements by Category */}
            {categories.map((category) => {
                const Icon = category.icon;
                const categoryAchievements = achievements.filter(a => a.category === category.id);
                const unlockedInCategory = unlockedAchievements.filter(a => a.category === category.id);

                return (
                    <div key={category.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`} />
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                {category.label}
                            </h3>
                            <span className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                ({unlockedInCategory.length}/{categoryAchievements.length})
                            </span>
                        </div>
                        <div className="grid gap-3">
                            {categoryAchievements.map((achievement) => {
                                const isUnlocked = unlockedAchievements.some(a => a.id === achievement.id);
                                const unlockedData = unlockedAchievements.find(a => a.id === achievement.id);
                                return (
                                    <AchievementCard
                                        key={achievement.id}
                                        achievement={achievement}
                                        isDarkMode={isDarkMode}
                                        unlocked={isUnlocked}
                                        unlockedAt={unlockedData?.unlockedAt}
                                    />
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

// Stats Section
interface StatsSectionProps {
    isDarkMode: boolean;
    progress: UserProgress;
    totalQuizzesTaken: number;
    perfectScores: number;
    averageScore: number;
    uniqueModulesCompleted: number;
}

const StatsSection = ({ isDarkMode, progress, totalQuizzesTaken, perfectScores, averageScore, uniqueModulesCompleted }: StatsSectionProps) => {
    const moduleNames: Record<string, string> = {
        'ecc': 'ECC 密码学',
        'hd-wallet': 'HD 钱包',
        'utxo': 'UTXO 模型',
        'script': '比特币脚本',
        'lightning': '闪电网络',
        'segwit': '隔离见证',
        'taproot': 'Taproot',
        'consensus': '共识机制',
        'mining': '挖矿经济学',
    };

    // Get best score for each module
    const moduleScores: Record<string, { best: number; total: number; attempts: number }> = {};
    progress.quizHistory.forEach(entry => {
        if (!moduleScores[entry.moduleId]) {
            moduleScores[entry.moduleId] = { best: 0, total: entry.total, attempts: 0 };
        }
        moduleScores[entry.moduleId].attempts++;
        if (entry.score > moduleScores[entry.moduleId].best) {
            moduleScores[entry.moduleId].best = entry.score;
        }
    });

    return (
        <div className="space-y-8 animate-in fade-in">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                    isDarkMode={isDarkMode}
                    icon={<BookOpen className="w-6 h-6 text-blue-500" />}
                    value={totalQuizzesTaken}
                    label="总测验次数"
                    color="blue"
                />
                <StatCard
                    isDarkMode={isDarkMode}
                    icon={<Target className="w-6 h-6 text-green-500" />}
                    value={uniqueModulesCompleted}
                    label="完成模块数"
                    color="green"
                />
                <StatCard
                    isDarkMode={isDarkMode}
                    icon={<Medal className="w-6 h-6 text-amber-500" />}
                    value={perfectScores}
                    label="满分次数"
                    color="amber"
                />
                <StatCard
                    isDarkMode={isDarkMode}
                    icon={<TrendingUp className="w-6 h-6 text-purple-500" />}
                    value={`${averageScore}%`}
                    label="平均得分"
                    color="purple"
                />
            </div>

            {/* Module Performance */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    各模块表现
                </h3>
                <div className="space-y-4">
                    {Object.entries(moduleNames).map(([moduleId, name]) => {
                        const score = moduleScores[moduleId];
                        const percentage = score ? Math.round((score.best / score.total) * 100) : 0;
                        const completed = !!score;

                        return (
                            <div key={moduleId} className="space-y-1">
                                <div className="flex items-center justify-between text-sm">
                                    <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{name}</span>
                                    <span className={`font-mono ${completed ? (isDarkMode ? 'text-white' : 'text-slate-900') : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                                        {completed ? `${score.best}/${score.total} (${percentage}%)` : '未完成'}
                                    </span>
                                </div>
                                <div className={`h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                    <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                            percentage === 100 ? 'bg-green-500' :
                                            percentage >= 80 ? 'bg-blue-500' :
                                            percentage >= 60 ? 'bg-amber-500' :
                                            percentage > 0 ? 'bg-red-500' : 'bg-transparent'
                                        }`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Quiz History */}
            {progress.quizHistory.length > 0 && (
                <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                    <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        最近测验记录
                    </h3>
                    <div className="space-y-2 max-h-64 overflow-y-auto">
                        {progress.quizHistory
                            .sort((a, b) => b.completedAt - a.completedAt)
                            .slice(0, 10)
                            .map((entry, index) => {
                                const percentage = Math.round((entry.score / entry.total) * 100);
                                return (
                                    <div
                                        key={index}
                                        className={`flex items-center justify-between p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}
                                    >
                                        <div>
                                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                {moduleNames[entry.moduleId] || entry.moduleId}
                                            </div>
                                            <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                {new Date(entry.completedAt).toLocaleDateString('zh-CN', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </div>
                                        </div>
                                        <div className={`text-lg font-bold ${
                                            percentage === 100 ? 'text-green-500' :
                                            percentage >= 80 ? 'text-blue-500' :
                                            percentage >= 60 ? 'text-amber-500' : 'text-red-500'
                                        }`}>
                                            {entry.score}/{entry.total}
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </div>
            )}
        </div>
    );
};

// Stat Card Component
interface StatCardProps {
    isDarkMode: boolean;
    icon: React.ReactNode;
    value: number | string;
    label: string;
    color: string;
}

const StatCard = ({ isDarkMode, icon, value, label, color }: StatCardProps) => (
    <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-4 border`}>
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${isDarkMode ? `bg-${color}-500/20` : `bg-${color}-100`}`}>
                {icon}
            </div>
            <div>
                <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{value}</div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{label}</div>
            </div>
        </div>
    </div>
);

// Achievement Card Component
interface AchievementCardProps {
    achievement: Achievement;
    isDarkMode: boolean;
    unlocked: boolean;
    unlockedAt?: number;
}

const AchievementCard = ({ achievement, isDarkMode, unlocked, unlockedAt }: AchievementCardProps) => (
    <div
        className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
            unlocked
                ? getRarityBgColor(achievement.rarity, isDarkMode) + ' ' + (isDarkMode ? 'border-slate-700' : 'border-slate-200')
                : isDarkMode ? 'bg-slate-900/50 border-slate-800 opacity-60' : 'bg-slate-100/50 border-slate-200 opacity-60'
        }`}
    >
        <div className={`text-3xl ${!unlocked && 'grayscale opacity-50'}`}>
            {unlocked ? achievement.icon : <Lock className="w-8 h-8 text-slate-400" />}
        </div>
        <div className="flex-1">
            <div className="flex items-center gap-2">
                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} ${!unlocked && 'opacity-70'}`}>
                    {achievement.title}
                </h4>
                <span className={`text-xs px-2 py-0.5 rounded-full ${getRarityColor(achievement.rarity)} ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                    {getRarityLabel(achievement.rarity)}
                </span>
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} ${!unlocked && 'opacity-70'}`}>
                {achievement.description}
            </p>
            {unlockedAt && (
                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {new Date(unlockedAt).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })} 解锁
                </p>
            )}
        </div>
        <div className={`flex items-center gap-1 ${unlocked ? 'text-amber-500' : 'text-slate-500'}`}>
            <Star className="w-4 h-4" />
            <span className="font-bold">{achievement.points}</span>
        </div>
    </div>
);

export default Achievements;
