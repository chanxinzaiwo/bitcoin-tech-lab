// Achievement System Data
import { getItem, setItem, STORAGE_KEYS } from '../utils/storage';

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'quiz' | 'exploration' | 'mastery' | 'special';
    requirement: AchievementRequirement;
    points: number;
    rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface AchievementRequirement {
    type: 'quiz_complete' | 'quiz_score' | 'module_visit' | 'quiz_streak' | 'total_quizzes' | 'perfect_score';
    moduleId?: string;
    count?: number;
    score?: number;
}

export interface UserAchievement {
    achievementId: string;
    unlockedAt: number;
}

export interface UserProgress {
    achievements: UserAchievement[];
    quizHistory: QuizHistoryEntry[];
    moduleVisits: Record<string, number>;
    totalPoints: number;
}

export interface QuizHistoryEntry {
    moduleId: string;
    score: number;
    total: number;
    completedAt: number;
}

// Achievement definitions
export const achievements: Achievement[] = [
    // Quiz Completion Achievements
    {
        id: 'ecc_quiz_complete',
        title: 'ECC 入门者',
        description: '完成椭圆曲线密码学测验',
        icon: '🔐',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'ecc' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'hd_wallet_quiz_complete',
        title: 'HD 钱包学徒',
        description: '完成 HD 钱包测验',
        icon: '🌳',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'hdwallet' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'utxo_quiz_complete',
        title: 'UTXO 理解者',
        description: '完成 UTXO 模型测验',
        icon: '💰',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'utxo' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'script_quiz_complete',
        title: '脚本探索者',
        description: '完成比特币脚本测验',
        icon: '📜',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'script' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'lightning_quiz_complete',
        title: '闪电新手',
        description: '完成闪电网络测验',
        icon: '⚡',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'lightning' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'segwit_quiz_complete',
        title: 'SegWit 学习者',
        description: '完成隔离见证测验',
        icon: '📦',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'segwit' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'taproot_quiz_complete',
        title: 'Taproot 探险家',
        description: '完成 Taproot 测验',
        icon: '🌿',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'taproot' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'consensus_quiz_complete',
        title: '共识理解者',
        description: '完成共识机制测验',
        icon: '🤝',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'consensus' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'mining_quiz_complete',
        title: '矿工学徒',
        description: '完成挖矿经济学测验',
        icon: '⛏️',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'mining' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'pow_quiz_complete',
        title: 'PoW 理解者',
        description: '完成工作量证明测验',
        icon: '🔨',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'pow' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'address_quiz_complete',
        title: '地址专家',
        description: '完成比特币地址测验',
        icon: '📍',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'address' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'mempool_quiz_complete',
        title: '内存池观察者',
        description: '完成内存池测验',
        icon: '🏊',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'mempool' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'p2p_quiz_complete',
        title: 'P2P 网络学徒',
        description: '完成P2P网络测验',
        icon: '🌐',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'p2p' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'rbf_quiz_complete',
        title: 'RBF 掌握者',
        description: '完成手续费替换测验',
        icon: '🔄',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'rbf' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'fork_quiz_complete',
        title: '分叉理解者',
        description: '完成分叉机制测验',
        icon: '🍴',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'fork' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'schnorr_quiz_complete',
        title: 'Schnorr 学习者',
        description: '完成Schnorr签名测验',
        icon: '✍️',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'schnorr' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'spv_quiz_complete',
        title: 'SPV 理解者',
        description: '完成简单支付验证测验',
        icon: '📱',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'spv' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'cold_quiz_complete',
        title: '冷存储专家',
        description: '完成冷钱包测验',
        icon: '🧊',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'cold' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'privacy_quiz_complete',
        title: '隐私守护者',
        description: '完成隐私技术测验',
        icon: '🕵️',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'privacy' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'history_quiz_complete',
        title: '比特币历史学家',
        description: '完成比特币历史测验',
        icon: '📜',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'history' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'fullnode_quiz_complete',
        title: '全节点运营者',
        description: '完成全节点测验',
        icon: '🖥️',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'fullnode' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'lamport_quiz_complete',
        title: 'Lamport 签名学徒',
        description: '完成Lamport签名测验',
        icon: '🔏',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'lamport' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'quantum_quiz_complete',
        title: '量子计算探索者',
        description: '完成量子计算测验',
        icon: '⚛️',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'quantum' },
        points: 10,
        rarity: 'common'
    },
    {
        id: 'attack51_quiz_complete',
        title: '51%攻击分析师',
        description: '完成51%攻击测验',
        icon: '⚠️',
        category: 'quiz',
        requirement: { type: 'quiz_complete', moduleId: 'attack51' },
        points: 10,
        rarity: 'common'
    },

    // Perfect Score Achievements
    {
        id: 'ecc_perfect',
        title: 'ECC 大师',
        description: 'ECC 测验满分通过',
        icon: '🏆',
        category: 'mastery',
        requirement: { type: 'perfect_score', moduleId: 'ecc' },
        points: 50,
        rarity: 'rare'
    },
    {
        id: 'hd_wallet_perfect',
        title: 'HD 钱包专家',
        description: 'HD 钱包测验满分通过',
        icon: '🏆',
        category: 'mastery',
        requirement: { type: 'perfect_score', moduleId: 'hdwallet' },
        points: 50,
        rarity: 'rare'
    },
    {
        id: 'utxo_perfect',
        title: 'UTXO 专家',
        description: 'UTXO 测验满分通过',
        icon: '🏆',
        category: 'mastery',
        requirement: { type: 'perfect_score', moduleId: 'utxo' },
        points: 50,
        rarity: 'rare'
    },
    {
        id: 'script_perfect',
        title: '脚本大师',
        description: '比特币脚本测验满分通过',
        icon: '🏆',
        category: 'mastery',
        requirement: { type: 'perfect_score', moduleId: 'script' },
        points: 50,
        rarity: 'rare'
    },
    {
        id: 'lightning_perfect',
        title: '闪电大师',
        description: '闪电网络测验满分通过',
        icon: '🏆',
        category: 'mastery',
        requirement: { type: 'perfect_score', moduleId: 'lightning' },
        points: 50,
        rarity: 'rare'
    },

    // Milestone Achievements
    {
        id: 'first_quiz',
        title: '学习启程',
        description: '完成第一个测验',
        icon: '🎯',
        category: 'exploration',
        requirement: { type: 'total_quizzes', count: 1 },
        points: 20,
        rarity: 'common'
    },
    {
        id: 'five_quizzes',
        title: '求知若渴',
        description: '完成 5 个测验',
        icon: '📚',
        category: 'exploration',
        requirement: { type: 'total_quizzes', count: 5 },
        points: 50,
        rarity: 'uncommon'
    },
    {
        id: 'ten_quizzes',
        title: '知识积累者',
        description: '完成 10 个测验',
        icon: '📖',
        category: 'exploration',
        requirement: { type: 'total_quizzes', count: 10 },
        points: 80,
        rarity: 'uncommon'
    },
    {
        id: 'fifteen_quizzes',
        title: '学习达人',
        description: '完成 15 个测验',
        icon: '🏅',
        category: 'exploration',
        requirement: { type: 'total_quizzes', count: 15 },
        points: 120,
        rarity: 'rare'
    },
    {
        id: 'twenty_quizzes',
        title: '比特币专家',
        description: '完成 20 个测验',
        icon: '🥇',
        category: 'mastery',
        requirement: { type: 'total_quizzes', count: 20 },
        points: 150,
        rarity: 'epic'
    },
    {
        id: 'all_quizzes',
        title: '比特币学者',
        description: '完成所有 24 个模块的测验',
        icon: '🎓',
        category: 'mastery',
        requirement: { type: 'total_quizzes', count: 24 },
        points: 300,
        rarity: 'legendary'
    },

    // Special Achievements
    {
        id: 'perfect_streak_3',
        title: '连胜达人',
        description: '连续 3 次测验获得 80% 以上',
        icon: '🔥',
        category: 'special',
        requirement: { type: 'quiz_streak', count: 3, score: 80 },
        points: 100,
        rarity: 'rare'
    },
    {
        id: 'crypto_master',
        title: '密码学大师',
        description: 'ECC、HD钱包、脚本测验均满分',
        icon: '👑',
        category: 'mastery',
        requirement: { type: 'quiz_score', count: 3, score: 100 },
        points: 300,
        rarity: 'legendary'
    },
];

// Default progress state
const DEFAULT_PROGRESS: UserProgress = {
    achievements: [],
    quizHistory: [],
    moduleVisits: {},
    totalPoints: 0
};

// Load user progress from localStorage with robust error handling
export const loadUserProgress = (): UserProgress => {
    const result = getItem<UserProgress>(STORAGE_KEYS.PROGRESS, DEFAULT_PROGRESS);

    if (!result.success && result.error) {
        // Log error for debugging but don't crash the app
        console.warn('[Progress] Storage error:', result.error.message);

        // If there was a parse error, the data might be corrupted
        // We return the default and the user's progress will be reset
        if (result.error.type === 'json_parse_error') {
            console.warn('[Progress] Corrupted progress data detected, resetting to default');
        }
    }

    // Validate the loaded data structure
    const progress = result.data ?? DEFAULT_PROGRESS;
    return validateProgressData(progress);
};

// Validate and repair progress data structure
const validateProgressData = (data: unknown): UserProgress => {
    if (!data || typeof data !== 'object') {
        return { ...DEFAULT_PROGRESS };
    }

    const progress = data as Partial<UserProgress>;

    return {
        achievements: Array.isArray(progress.achievements) ? progress.achievements : [],
        quizHistory: Array.isArray(progress.quizHistory)
            ? progress.quizHistory.filter(isValidQuizEntry)
            : [],
        moduleVisits: typeof progress.moduleVisits === 'object' && progress.moduleVisits !== null
            ? progress.moduleVisits
            : {},
        totalPoints: typeof progress.totalPoints === 'number' && !isNaN(progress.totalPoints)
            ? progress.totalPoints
            : 0
    };
};

// Type guard for quiz history entries
const isValidQuizEntry = (entry: unknown): entry is QuizHistoryEntry => {
    if (!entry || typeof entry !== 'object') return false;
    const e = entry as Partial<QuizHistoryEntry>;
    return (
        typeof e.moduleId === 'string' &&
        typeof e.score === 'number' &&
        typeof e.total === 'number' &&
        typeof e.completedAt === 'number'
    );
};

// Save user progress to localStorage with robust error handling
export const saveUserProgress = (progress: UserProgress): boolean => {
    const result = setItem(STORAGE_KEYS.PROGRESS, progress);

    if (!result.success && result.error) {
        console.error('[Progress] Failed to save progress:', result.error.message);

        // If quota exceeded, try to notify the user
        if (result.error.type === 'quota_exceeded') {
            console.warn('[Progress] Storage quota exceeded. Progress saved to memory only.');
        }

        return false;
    }

    return true;
};

// Record quiz completion and check for achievements
export const recordQuizCompletion = (
    moduleId: string,
    score: number,
    total: number
): { newAchievements: Achievement[]; progress: UserProgress } => {
    const progress = loadUserProgress();
    const newAchievements: Achievement[] = [];

    // Add to quiz history
    progress.quizHistory.push({
        moduleId,
        score,
        total,
        completedAt: Date.now()
    });

    // Check for new achievements
    for (const achievement of achievements) {
        // Skip if already unlocked
        if (progress.achievements.some(a => a.achievementId === achievement.id)) {
            continue;
        }

        let earned = false;

        switch (achievement.requirement.type) {
            case 'quiz_complete':
                if (achievement.requirement.moduleId === moduleId) {
                    earned = true;
                }
                break;

            case 'perfect_score':
                if (achievement.requirement.moduleId === moduleId && score === total) {
                    earned = true;
                }
                break;

            case 'total_quizzes': {
                const uniqueModules = new Set(progress.quizHistory.map(h => h.moduleId));
                if (uniqueModules.size >= (achievement.requirement.count || 0)) {
                    earned = true;
                }
                break;
            }

            case 'quiz_streak': {
                const requiredCount = achievement.requirement.count || 3;
                const requiredScore = achievement.requirement.score || 80;
                const recentQuizzes = progress.quizHistory.slice(-requiredCount);
                if (recentQuizzes.length >= requiredCount) {
                    const allHighScore = recentQuizzes.every(
                        q => (q.score / q.total) * 100 >= requiredScore
                    );
                    if (allHighScore) {
                        earned = true;
                    }
                }
                break;
            }
        }

        if (earned) {
            progress.achievements.push({
                achievementId: achievement.id,
                unlockedAt: Date.now()
            });
            progress.totalPoints += achievement.points;
            newAchievements.push(achievement);
        }
    }

    saveUserProgress(progress);

    return { newAchievements, progress };
};

// Get achievement by ID
export const getAchievementById = (id: string): Achievement | undefined => {
    return achievements.find(a => a.id === id);
};

// Get all unlocked achievements for a user
export const getUnlockedAchievements = (): Achievement[] => {
    const progress = loadUserProgress();
    return progress.achievements
        .map(ua => getAchievementById(ua.achievementId))
        .filter((a): a is Achievement => a !== undefined);
};

// Calculate overall progress percentage
export const calculateOverallProgress = (totalModules: number = 24): number => {
    const progress = loadUserProgress();
    const uniqueModulesCompleted = new Set(progress.quizHistory.map(h => h.moduleId));
    return Math.round((uniqueModulesCompleted.size / totalModules) * 100);
};

// Get rarity color
export const getRarityColor = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
        case 'common':
            return 'text-slate-400';
        case 'uncommon':
            return 'text-green-500';
        case 'rare':
            return 'text-blue-500';
        case 'epic':
            return 'text-purple-500';
        case 'legendary':
            return 'text-amber-500';
        default:
            return 'text-slate-400';
    }
};

export const getRarityBgColor = (rarity: Achievement['rarity'], isDarkMode: boolean): string => {
    switch (rarity) {
        case 'common':
            return isDarkMode ? 'bg-slate-800' : 'bg-slate-100';
        case 'uncommon':
            return isDarkMode ? 'bg-green-900/30' : 'bg-green-50';
        case 'rare':
            return isDarkMode ? 'bg-blue-900/30' : 'bg-blue-50';
        case 'epic':
            return isDarkMode ? 'bg-purple-900/30' : 'bg-purple-50';
        case 'legendary':
            return isDarkMode ? 'bg-amber-900/30' : 'bg-amber-50';
        default:
            return isDarkMode ? 'bg-slate-800' : 'bg-slate-100';
    }
};

export const getRarityLabel = (rarity: Achievement['rarity']): string => {
    switch (rarity) {
        case 'common': return '普通';
        case 'uncommon': return '稀有';
        case 'rare': return '精良';
        case 'epic': return '史诗';
        case 'legendary': return '传说';
        default: return '普通';
    }
};
