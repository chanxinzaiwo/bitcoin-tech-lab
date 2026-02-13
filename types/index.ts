// ========================================
// Core Bitcoin Types
// ========================================

export interface KeyPair {
  privateKey: string;
  publicKey: string;
  address: string;
  label?: string;
}

export interface UTXO {
  id: string;
  amount: number;
  ownerAddress: string;
  color?: string;
  time?: number;
  scriptPubKey?: string;
}

export interface Transaction {
  id: string;
  inputs: TransactionInput[];
  outputs: TransactionOutput[];
  fee: number;
  timestamp: number;
  status: TransactionStatus;
  version?: number;
  lockTime?: number;
}

export interface TransactionInput {
  utxoId: string;
  scriptSig?: string;
  witness?: string[];
  sequence?: number;
}

export interface TransactionOutput {
  address: string;
  amount: number;
  scriptPubKey?: string;
}

export type TransactionStatus = 'pending' | 'mempool' | 'confirmed' | 'failed';

export interface Block {
  id: number;
  hash: string;
  prevHash: string;
  merkleRoot: string;
  nonce: number;
  difficulty: number;
  transactions: Transaction[];
  timestamp: number;
  version?: number;
  size?: number;
}

// ========================================
// Lab State Types
// ========================================

export interface LabState {
  identity: KeyPair | null;
  wallet: UTXO[];
  mempool: Transaction[];
  blockchain: Block[];
  difficulty: number;
}

// ========================================
// UI Component Types
// ========================================

export interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface TabItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

// ========================================
// Quiz Types
// ========================================

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  moduleId: string;
  score: number;
  totalQuestions: number;
  completedAt: number;
}

// ========================================
// Achievement Types
// ========================================

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
  unlockedAt?: number;
}

export type AchievementCondition =
  | { type: 'modules_visited'; count: number }
  | { type: 'quiz_perfect'; moduleId: string }
  | { type: 'streak'; days: number }
  | { type: 'all_modules' };

// ========================================
// Learning Progress Types
// ========================================

export interface ModuleProgress {
  moduleId: string;
  visitedAt: number;
  completedAt?: number;
  quizScore?: number;
  timeSpent?: number;
}

export interface LearningStats {
  totalModulesVisited: number;
  totalModulesCompleted: number;
  totalQuizzesPassed: number;
  averageQuizScore: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
}

// ========================================
// Utility Types
// ========================================

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type Nullable<T> = T | null;

export type AsyncState<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
};
