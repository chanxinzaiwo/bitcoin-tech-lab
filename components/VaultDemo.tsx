import React, { useState } from 'react';
import { Shield, Lock, Unlock, Clock, AlertTriangle, Info, ChevronRight, Key, ArrowRight, Timer, Ban, Check, Play, Pause, RotateCcw, Layers, Eye, Zap, Users, FileText, Wallet, ArrowDown, ArrowUp } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { vaultQuiz } from '../data/quizData';

type TabType = 'intro' | 'mechanism' | 'opcodes' | 'simulator' | 'comparison' | 'quiz';

// 模拟的 Vault 状态
interface VaultState {
    status: 'locked' | 'unvaulting' | 'withdrawn' | 'clawed_back';
    balance: number;
    unvaultStartBlock: number | null;
    currentBlock: number;
    targetAddress: string;
    clawbackAddress: string;
}

const VaultDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'mechanism', label: '工作机制' },
        { id: 'opcodes', label: 'OP_VAULT' },
        { id: 'simulator', label: '交互模拟' },
        { id: 'comparison', label: '方案对比' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-emerald-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                                <Shield className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vault 保险库</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vault</span>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <div className={`md:hidden border-t ${isDarkMode ? 'border-slate-800 bg-slate-800/50' : 'border-slate-100 bg-slate-50'}`}>
                <div className="grid grid-cols-3 gap-1 p-2">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as TabType)}
                            className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
                                activeTab === tab.id
                                    ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'
                                    : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            <span className="leading-tight text-center">{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection isDarkMode={isDarkMode} changeTab={setActiveTab} />}
                {activeTab === 'mechanism' && <MechanismSection isDarkMode={isDarkMode} />}
                {activeTab === 'opcodes' && <OpcodesSection isDarkMode={isDarkMode} />}
                {activeTab === 'simulator' && <SimulatorSection isDarkMode={isDarkMode} />}
                {activeTab === 'comparison' && <ComparisonSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <Quiz quizData={vaultQuiz} />}
            </main>
        </div>
    );
};

// --- Intro Section ---
const IntroSection: React.FC<{ isDarkMode: boolean; changeTab: (tab: TabType) => void }> = ({ isDarkMode, changeTab }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Vault：比特币的保险库</h1>
            <p className="text-emerald-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                Vault 是一种高级的比特币保管方案，通过时间延迟和撤回机制，
                即使私钥被盗，也能在一定时间内阻止资金被转移。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">BIP-345</div>
                    <div className="text-sm text-emerald-200">OP_VAULT 提案</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">时间窗口</div>
                    <div className="text-sm text-emerald-200">取款前的观察期</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">紧急撤回</div>
                    <div className="text-sm text-emerald-200">Clawback 机制</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('mechanism')}
                className="mt-8 bg-white text-emerald-700 hover:bg-emerald-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                了解工作机制 <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        {/* 为什么需要 Vault */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                为什么需要 Vault？
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                        <h3 className={`font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>传统钱包的问题</h3>
                    </div>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500">✗</span>
                            私钥一旦泄露，资金立即可被转移
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500">✗</span>
                            热钱包面临黑客攻击风险
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500">✗</span>
                            没有"反悔"或撤销的机会
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-red-500">✗</span>
                            内部人员攻击难以防范
                        </li>
                    </ul>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <div className="flex items-center gap-2 mb-3">
                        <Shield className="w-5 h-5 text-emerald-500" />
                        <h3 className={`font-bold ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>Vault 的解决方案</h3>
                    </div>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            强制时间延迟，提供反应窗口
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            紧急撤回到安全地址
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            即使私钥泄露也有补救机会
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-emerald-500">✓</span>
                            监控系统可自动触发保护
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        {/* 核心概念 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                核心概念
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Lock className="w-8 h-8 text-emerald-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>锁定状态</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        资金安全存储在 Vault 中，只能通过启动取款流程来花费
                    </p>
                </div>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Timer className="w-8 h-8 text-amber-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>解锁期</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        取款需要等待一定时间（如 144 个区块 ≈ 1 天），期间可以取消
                    </p>
                </div>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Ban className="w-8 h-8 text-red-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>紧急撤回</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        发现异常时，可立即将资金转移到预设的安全地址
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- Mechanism Section ---
const MechanismSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [step, setStep] = useState(0);

    const steps = [
        {
            title: '1. 创建 Vault',
            desc: '将 BTC 发送到 Vault 脚本地址',
            icon: Shield,
            color: 'emerald'
        },
        {
            title: '2. 发起取款',
            desc: '提交取款请求，开始等待期',
            icon: Unlock,
            color: 'amber'
        },
        {
            title: '3. 等待期',
            desc: '时间锁强制等待（如 1 天）',
            icon: Clock,
            color: 'blue'
        },
        {
            title: '4A. 完成取款',
            desc: '等待期结束，资金转到目标地址',
            icon: Check,
            color: 'green'
        },
        {
            title: '4B. 紧急撤回',
            desc: '发现异常，立即转到安全地址',
            icon: Ban,
            color: 'red'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Vault 工作流程
                </h2>

                {/* 流程图 */}
                <div className="relative mb-8">
                    <div className="flex flex-wrap justify-center gap-4">
                        {steps.map((s, i) => {
                            const Icon = s.icon;
                            const colorMap: Record<string, string> = {
                                emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
                                amber: 'bg-amber-500/20 text-amber-400 border-amber-500/50',
                                blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
                                green: 'bg-green-500/20 text-green-400 border-green-500/50',
                                red: 'bg-red-500/20 text-red-400 border-red-500/50'
                            };
                            return (
                                <div
                                    key={i}
                                    onClick={() => setStep(i)}
                                    className={`cursor-pointer p-4 rounded-xl border-2 transition-all ${
                                        step === i
                                            ? colorMap[s.color]
                                            : isDarkMode ? 'bg-slate-800 border-slate-700 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                                    }`}
                                    style={{ minWidth: '140px' }}
                                >
                                    <Icon className={`w-8 h-8 mx-auto mb-2 ${step === i ? '' : 'text-slate-400'}`} />
                                    <div className={`text-sm font-bold text-center ${step === i ? '' : isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        {s.title}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* 步骤详情 */}
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        {steps[step].title}
                    </h3>
                    <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        {steps[step].desc}
                    </p>

                    {step === 0 && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                用户创建一个特殊的比特币脚本，包含：
                            </p>
                            <ul className={`mt-2 space-y-1 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                <li>• <strong>热密钥</strong>：日常操作使用</li>
                                <li>• <strong>冷密钥</strong>：紧急撤回使用（离线保存）</li>
                                <li>• <strong>时间锁参数</strong>：等待期长度</li>
                                <li>• <strong>目标地址模板</strong>：允许的取款地址</li>
                            </ul>
                        </div>
                    )}

                    {step === 1 && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                使用热密钥签名发起取款请求：
                            </p>
                            <div className={`mt-3 p-3 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-800 text-emerald-400' : 'bg-slate-100 text-emerald-700'}`}>
                                <div>OP_VAULT_TRIGGER</div>
                                <div className="mt-1 text-slate-500">// 触发解锁流程</div>
                                <div className="mt-1 text-slate-500">// 指定目标地址和金额</div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                资金进入"中间状态"，必须等待指定时间：
                            </p>
                            <div className="mt-3 grid grid-cols-2 gap-3">
                                <div className={`p-3 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>典型等待期</div>
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>144 区块</div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>≈ 24 小时</div>
                                </div>
                                <div className={`p-3 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>监控要求</div>
                                    <div className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>24/7</div>
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>持续监控链上状态</div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                正常情况下，等待期结束后完成取款：
                            </p>
                            <div className={`mt-3 p-3 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-800 text-green-400' : 'bg-slate-100 text-green-700'}`}>
                                <div>OP_VAULT_FINALIZE</div>
                                <div className="mt-1 text-slate-500">// 确认时间锁已满足</div>
                                <div className="mt-1 text-slate-500">// 资金转移到预设地址</div>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                发现异常（如私钥泄露），使用冷密钥紧急撤回：
                            </p>
                            <div className={`mt-3 p-3 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-800 text-red-400' : 'bg-slate-100 text-red-700'}`}>
                                <div>OP_VAULT_RECOVER</div>
                                <div className="mt-1 text-slate-500">// 使用冷密钥签名</div>
                                <div className="mt-1 text-slate-500">// 立即转移到安全地址</div>
                                <div className="mt-1 text-slate-500">// 无需等待时间锁</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* 安全模型 */}
            <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    安全模型
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <Key className="w-5 h-5 text-amber-500" />
                            密钥分离
                        </h3>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className="space-y-3">
                                <div className={`p-3 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>热密钥</span>
                                    </div>
                                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        在线存储，用于发起取款
                                    </p>
                                </div>
                                <div className={`p-3 rounded border ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                                        <span className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>冷密钥</span>
                                    </div>
                                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        离线存储，仅用于紧急撤回
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            <Eye className="w-5 h-5 text-emerald-500" />
                            监控系统
                        </h3>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                                    监控所有 Vault 相关交易
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                                    检测未授权的取款请求
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                                    自动触发紧急撤回
                                </li>
                                <li className="flex items-start gap-2">
                                    <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                                    多渠道报警通知
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Opcodes Section ---
const OpcodesSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                BIP-345: OP_VAULT 提案
            </h2>
            <p className={`mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                由 James O'Beirne 提出的软分叉提案，为比特币原生引入 Vault 功能。
            </p>

            {/* 新操作码 */}
            <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-emerald-900/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <code className="px-2 py-1 rounded bg-emerald-500/20">OP_VAULT</code>
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        创建 Vault 的核心操作码，定义：
                    </p>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <li>• 取款延迟时间（区块数）</li>
                        <li>• 允许的取款脚本模板</li>
                        <li>• 紧急撤回脚本</li>
                    </ul>
                </div>
                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-blue-900/20 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        <code className="px-2 py-1 rounded bg-blue-500/20">OP_VAULT_RECOVER</code>
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        紧急撤回操作码，用于：
                    </p>
                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        <li>• 取消正在进行的取款</li>
                        <li>• 将资金转移到安全地址</li>
                        <li>• 无需等待时间锁</li>
                    </ul>
                </div>
            </div>

            {/* 脚本示例 */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Vault 脚本结构
                </h3>
                <div className={`font-mono text-sm p-4 rounded-lg overflow-x-auto ${isDarkMode ? 'bg-slate-900 text-emerald-400' : 'bg-white text-emerald-700'}`}>
                    <pre>{`# Vault 锁定脚本
<recovery_pubkey>        # 紧急撤回公钥
<delay>                  # 时间锁延迟（区块数）
<target_script_hash>     # 允许的取款脚本哈希
OP_VAULT                 # 创建 Vault

# 取款触发（需要等待）
<trigger_data>
<hot_signature>
# 创建一个新的 UTXO，带有 CSV 时间锁

# 紧急撤回（立即执行）
<recovery_signature>
OP_VAULT_RECOVER
# 立即转移到预设的安全地址`}</pre>
                </div>
            </div>
        </div>

        {/* 现有方案对比 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                实现方式对比
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                            <th className="text-left p-3">方案</th>
                            <th className="text-left p-3">可用性</th>
                            <th className="text-left p-3">效率</th>
                            <th className="text-left p-3">灵活性</th>
                        </tr>
                    </thead>
                    <tbody className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">OP_VAULT (BIP-345)</td>
                            <td className="p-3"><span className="text-amber-500">提案中</span></td>
                            <td className="p-3"><span className="text-emerald-500">高效</span></td>
                            <td className="p-3"><span className="text-emerald-500">原生支持</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">Pre-signed 方案</td>
                            <td className="p-3"><span className="text-emerald-500">现在可用</span></td>
                            <td className="p-3"><span className="text-amber-500">中等</span></td>
                            <td className="p-3"><span className="text-amber-500">有限</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">CTV Vault</td>
                            <td className="p-3"><span className="text-amber-500">需 CTV 激活</span></td>
                            <td className="p-3"><span className="text-emerald-500">高效</span></td>
                            <td className="p-3"><span className="text-amber-500">中等</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* 信息提示 */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
            <div className="flex items-start gap-3">
                <Info className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>当前状态</h4>
                    <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        BIP-345 仍在讨论中，尚未被比特币核心采纳。目前可以通过预签名交易和时间锁组合来模拟 Vault 功能，
                        但不如原生操作码高效和灵活。
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- Simulator Section ---
const SimulatorSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [vault, setVault] = useState<VaultState>({
        status: 'locked',
        balance: 1.5,
        unvaultStartBlock: null,
        currentBlock: 800000,
        targetAddress: 'bc1q...target',
        clawbackAddress: 'bc1q...safe'
    });
    const [isSimulating, setIsSimulating] = useState(false);
    const DELAY_BLOCKS = 144; // 约 1 天

    const startUnvault = () => {
        setVault(prev => ({
            ...prev,
            status: 'unvaulting',
            unvaultStartBlock: prev.currentBlock
        }));
    };

    const clawback = () => {
        setVault(prev => ({
            ...prev,
            status: 'clawed_back',
            unvaultStartBlock: null
        }));
    };

    const finalizeWithdraw = () => {
        if (vault.unvaultStartBlock && vault.currentBlock >= vault.unvaultStartBlock + DELAY_BLOCKS) {
            setVault(prev => ({
                ...prev,
                status: 'withdrawn',
                balance: 0
            }));
        }
    };

    const advanceBlock = () => {
        setVault(prev => ({
            ...prev,
            currentBlock: prev.currentBlock + 1
        }));
    };

    const advanceBlocks = (n: number) => {
        setVault(prev => ({
            ...prev,
            currentBlock: prev.currentBlock + n
        }));
    };

    const reset = () => {
        setVault({
            status: 'locked',
            balance: 1.5,
            unvaultStartBlock: null,
            currentBlock: 800000,
            targetAddress: 'bc1q...target',
            clawbackAddress: 'bc1q...safe'
        });
    };

    const blocksRemaining = vault.unvaultStartBlock
        ? Math.max(0, DELAY_BLOCKS - (vault.currentBlock - vault.unvaultStartBlock))
        : DELAY_BLOCKS;

    const progress = vault.unvaultStartBlock
        ? Math.min(100, ((vault.currentBlock - vault.unvaultStartBlock) / DELAY_BLOCKS) * 100)
        : 0;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Vault 交互模拟器
                </h2>

                {/* 状态面板 */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>Vault 余额</div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            {vault.balance} BTC
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>当前区块</div>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            #{vault.currentBlock.toLocaleString()}
                        </div>
                    </div>
                    <div className={`p-4 rounded-xl ${
                        vault.status === 'locked' ? (isDarkMode ? 'bg-emerald-900/30' : 'bg-emerald-100') :
                        vault.status === 'unvaulting' ? (isDarkMode ? 'bg-amber-900/30' : 'bg-amber-100') :
                        vault.status === 'withdrawn' ? (isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100') :
                        (isDarkMode ? 'bg-red-900/30' : 'bg-red-100')
                    }`}>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>状态</div>
                        <div className={`text-2xl font-bold ${
                            vault.status === 'locked' ? 'text-emerald-500' :
                            vault.status === 'unvaulting' ? 'text-amber-500' :
                            vault.status === 'withdrawn' ? 'text-blue-500' :
                            'text-red-500'
                        }`}>
                            {vault.status === 'locked' ? '已锁定' :
                             vault.status === 'unvaulting' ? '解锁中' :
                             vault.status === 'withdrawn' ? '已取款' : '已撤回'}
                        </div>
                    </div>
                </div>

                {/* 进度条（仅在解锁中显示） */}
                {vault.status === 'unvaulting' && (
                    <div className={`p-4 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                        <div className="flex justify-between mb-2">
                            <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                解锁进度
                            </span>
                            <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                还需 {blocksRemaining} 区块 (≈ {Math.ceil(blocksRemaining * 10 / 60)} 小时)
                            </span>
                        </div>
                        <div className={`h-4 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                            <div
                                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-300"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex justify-between mt-2 text-xs">
                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
                                开始: #{vault.unvaultStartBlock?.toLocaleString()}
                            </span>
                            <span className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>
                                完成: #{((vault.unvaultStartBlock || 0) + DELAY_BLOCKS).toLocaleString()}
                            </span>
                        </div>
                    </div>
                )}

                {/* 操作按钮 */}
                <div className="flex flex-wrap gap-3 mb-6">
                    {vault.status === 'locked' && (
                        <button
                            onClick={startUnvault}
                            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                        >
                            <Unlock className="w-4 h-4" />
                            发起取款
                        </button>
                    )}

                    {vault.status === 'unvaulting' && (
                        <>
                            <button
                                onClick={clawback}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                            >
                                <Ban className="w-4 h-4" />
                                紧急撤回
                            </button>
                            <button
                                onClick={finalizeWithdraw}
                                disabled={blocksRemaining > 0}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                                    blocksRemaining > 0
                                        ? 'bg-slate-600 cursor-not-allowed text-slate-400'
                                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                                }`}
                            >
                                <Check className="w-4 h-4" />
                                完成取款
                            </button>
                        </>
                    )}

                    <div className="flex-1" />

                    <button
                        onClick={advanceBlock}
                        disabled={vault.status === 'withdrawn' || vault.status === 'clawed_back'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            vault.status === 'withdrawn' || vault.status === 'clawed_back'
                                ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                                : isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                    >
                        <ArrowRight className="w-4 h-4" />
                        +1 区块
                    </button>
                    <button
                        onClick={() => advanceBlocks(10)}
                        disabled={vault.status === 'withdrawn' || vault.status === 'clawed_back'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            vault.status === 'withdrawn' || vault.status === 'clawed_back'
                                ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                                : isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                    >
                        +10 区块
                    </button>
                    <button
                        onClick={() => advanceBlocks(50)}
                        disabled={vault.status === 'withdrawn' || vault.status === 'clawed_back'}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                            vault.status === 'withdrawn' || vault.status === 'clawed_back'
                                ? 'bg-slate-700 cursor-not-allowed text-slate-500'
                                : isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                        }`}
                    >
                        +50 区块
                    </button>
                    <button
                        onClick={reset}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600 text-white' : 'bg-slate-200 hover:bg-slate-300 text-slate-900'}`}
                    >
                        <RotateCcw className="w-4 h-4" />
                        重置
                    </button>
                </div>

                {/* 结果显示 */}
                {(vault.status === 'withdrawn' || vault.status === 'clawed_back') && (
                    <div className={`p-4 rounded-xl ${
                        vault.status === 'withdrawn'
                            ? (isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200')
                            : (isDarkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200')
                    }`}>
                        <div className="flex items-center gap-3">
                            {vault.status === 'withdrawn' ? (
                                <>
                                    <Check className="w-6 h-6 text-blue-500" />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                                            取款成功
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            1.5 BTC 已转移到 {vault.targetAddress}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <Ban className="w-6 h-6 text-red-500" />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                            紧急撤回成功
                                        </h4>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            1.5 BTC 已转移到安全地址 {vault.clawbackAddress}
                                        </p>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* 使用说明 */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                    模拟操作说明
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>1. 点击 "发起取款" 开始解锁流程</li>
                    <li>2. 使用 "+区块" 按钮模拟时间流逝</li>
                    <li>3. 等待 144 区块后可以 "完成取款"</li>
                    <li>4. 在等待期间随时可以 "紧急撤回"</li>
                </ul>
            </div>
        </div>
    );
};

// --- Comparison Section ---
const ComparisonSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Vault vs 其他保管方案
            </h2>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                            <th className="text-left p-3">特性</th>
                            <th className="text-center p-3">Vault</th>
                            <th className="text-center p-3">多签钱包</th>
                            <th className="text-center p-3">时间锁</th>
                            <th className="text-center p-3">托管服务</th>
                        </tr>
                    </thead>
                    <tbody className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">私钥泄露保护</td>
                            <td className="p-3 text-center"><span className="text-emerald-500">✓ 有反应时间</span></td>
                            <td className="p-3 text-center"><span className="text-amber-500">部分</span></td>
                            <td className="p-3 text-center"><span className="text-red-500">✗</span></td>
                            <td className="p-3 text-center"><span className="text-amber-500">取决于托管方</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">紧急撤回</td>
                            <td className="p-3 text-center"><span className="text-emerald-500">✓ 立即</span></td>
                            <td className="p-3 text-center"><span className="text-red-500">✗</span></td>
                            <td className="p-3 text-center"><span className="text-red-500">✗</span></td>
                            <td className="p-3 text-center"><span className="text-amber-500">需联系客服</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">自主保管</td>
                            <td className="p-3 text-center"><span className="text-emerald-500">✓ 完全</span></td>
                            <td className="p-3 text-center"><span className="text-emerald-500">✓ 完全</span></td>
                            <td className="p-3 text-center"><span className="text-emerald-500">✓ 完全</span></td>
                            <td className="p-3 text-center"><span className="text-red-500">✗ 第三方</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">设置复杂度</td>
                            <td className="p-3 text-center"><span className="text-amber-500">中等</span></td>
                            <td className="p-3 text-center"><span className="text-amber-500">中等</span></td>
                            <td className="p-3 text-center"><span className="text-emerald-500">简单</span></td>
                            <td className="p-3 text-center"><span className="text-emerald-500">简单</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                            <td className="p-3 font-medium">链上成本</td>
                            <td className="p-3 text-center"><span className="text-amber-500">中等</span></td>
                            <td className="p-3 text-center"><span className="text-amber-500">较高</span></td>
                            <td className="p-3 text-center"><span className="text-emerald-500">低</span></td>
                            <td className="p-3 text-center"><span className="text-emerald-500">低</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        {/* 使用场景 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                适用场景
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        <Check className="w-5 h-5" />
                        推荐使用
                    </h3>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li>• 大额长期持有的冷存储</li>
                        <li>• 机构级别的资产保管</li>
                        <li>• 交易所热钱包保护</li>
                        <li>• 遗产规划和继承安排</li>
                    </ul>
                </div>
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                        <AlertTriangle className="w-5 h-5" />
                        注意事项
                    </h3>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li>• 需要可靠的链上监控系统</li>
                        <li>• 冷密钥必须安全保管</li>
                        <li>• 不适合高频交易场景</li>
                        <li>• 需要理解时间锁机制</li>
                    </ul>
                </div>
            </div>
        </div>

        {/* 未来展望 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                未来展望
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Zap className="w-8 h-8 text-yellow-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        OP_VAULT 激活
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        如果 BIP-345 被采纳，将大大简化 Vault 的实现
                    </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Layers className="w-8 h-8 text-purple-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        与多签结合
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Vault + 多签可提供更强的安全保障
                    </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <Users className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        标准化
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        钱包和服务商可能会提供标准化的 Vault 功能
                    </p>
                </div>
            </div>
        </div>
    </div>
);

export default VaultDemo;
