import React, { useState, useEffect, useMemo } from 'react';
import { Clock, Lock, Unlock, Calendar, Hash, ArrowRight, Info, Play, Pause, RotateCcw, CheckCircle2, XCircle, AlertTriangle, Timer, Hourglass, CalendarClock, Blocks, Gift, Shield, Users } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { timeLockQuiz } from '../data/quizData';

// --- Types ---

interface TimeLockConfig {
    type: 'blockHeight' | 'timestamp';
    value: number;
    currentBlock: number;
    currentTime: number;
}

// --- Main Component ---

const TimeLockDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'nLockTime', label: 'nLockTime' },
        { id: 'cltv', label: 'CLTV' },
        { id: 'csv', label: 'CSV' },
        { id: 'usecases', label: '应用场景' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-cyan-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-cyan-600 text-white p-1.5 rounded-full">
                                <Clock className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>时间锁</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TimeLock</span>
                        </div>
                        <div className="flex space-x-1 overflow-x-auto">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-cyan-500/10 text-cyan-500'
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

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection isDarkMode={isDarkMode} changeTab={setActiveTab} />}
                {activeTab === 'nLockTime' && <NLockTimeSection isDarkMode={isDarkMode} />}
                {activeTab === 'cltv' && <CLTVSection isDarkMode={isDarkMode} />}
                {activeTab === 'csv' && <CSVSection isDarkMode={isDarkMode} />}
                {activeTab === 'usecases' && <UseCasesSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

// --- Intro Section ---

const IntroSection: React.FC<{ isDarkMode: boolean; changeTab: (tab: string) => void }> = ({ isDarkMode, changeTab }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-cyan-600 to-teal-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">时间锁：让比特币等待</h1>
            <p className="text-cyan-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                时间锁让你可以创建在未来某个时间点之前无法花费的交易。
                这是实现支付通道、原子交换、遗产规划等高级功能的基础。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">3 种类型</div>
                    <div className="text-sm text-cyan-200">nLockTime / CLTV / CSV</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">BIP-65</div>
                    <div className="text-sm text-cyan-200">CLTV 软分叉 (2015)</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">BIP-68/112</div>
                    <div className="text-sm text-cyan-200">CSV 相对时间锁 (2016)</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('nLockTime')}
                className="mt-8 bg-white text-cyan-700 hover:bg-cyan-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                探索时间锁类型 <ArrowRight className="h-5 w-5" />
            </button>
        </div>

        {/* Three Types Overview */}
        <div className="grid md:grid-cols-3 gap-6">
            <Card isDarkMode={isDarkMode} title="nLockTime" icon={<Calendar className="h-8 w-8 text-cyan-500" />}>
                交易级时间锁。设置后，整个交易在指定时间/区块之前无法被矿工打包。
                <span className={`block mt-2 text-xs ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>位置：交易字段</span>
            </Card>
            <Card isDarkMode={isDarkMode} title="CLTV (OP_CHECKLOCKTIMEVERIFY)" icon={<Lock className="h-8 w-8 text-cyan-500" />}>
                脚本级绝对时间锁。锁定 UTXO 直到特定的区块高度或时间戳。
                <span className={`block mt-2 text-xs ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>位置：锁定脚本</span>
            </Card>
            <Card isDarkMode={isDarkMode} title="CSV (OP_CHECKSEQUENCEVERIFY)" icon={<Timer className="h-8 w-8 text-cyan-500" />}>
                脚本级相对时间锁。锁定 UTXO 直到被创建后经过一定时间/区块数。
                <span className={`block mt-2 text-xs ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>位置：锁定脚本</span>
            </Card>
        </div>

        {/* Comparison Table */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                时间锁类型对比
            </h2>
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>
                            <th className="text-left py-2 pr-4">特性</th>
                            <th className="text-left py-2 px-4">nLockTime</th>
                            <th className="text-left py-2 px-4">CLTV</th>
                            <th className="text-left py-2 px-4">CSV</th>
                        </tr>
                    </thead>
                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className="py-3 pr-4 font-medium">锁定类型</td>
                            <td className="py-3 px-4">绝对</td>
                            <td className="py-3 px-4">绝对</td>
                            <td className="py-3 px-4">相对</td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className="py-3 pr-4 font-medium">作用范围</td>
                            <td className="py-3 px-4">整个交易</td>
                            <td className="py-3 px-4">单个输出</td>
                            <td className="py-3 px-4">单个输出</td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className="py-3 pr-4 font-medium">实现位置</td>
                            <td className="py-3 px-4">交易字段</td>
                            <td className="py-3 px-4">脚本操作码</td>
                            <td className="py-3 px-4">脚本操作码</td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className="py-3 pr-4 font-medium">引入时间</td>
                            <td className="py-3 px-4">创世</td>
                            <td className="py-3 px-4">BIP-65 (2015)</td>
                            <td className="py-3 px-4">BIP-68/112 (2016)</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);

// --- nLockTime Section ---

const NLockTimeSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [lockType, setLockType] = useState<'block' | 'time'>('block');
    const [lockValue, setLockValue] = useState(850000);
    const [currentBlock, setCurrentBlock] = useState(848500);
    const [isSimulating, setIsSimulating] = useState(false);

    const currentTime = useMemo(() => Math.floor(Date.now() / 1000), []);
    const lockTimestamp = lockType === 'time' ? lockValue : 0;

    const isLocked = lockType === 'block'
        ? currentBlock < lockValue
        : currentTime < lockValue;

    const blocksRemaining = lockType === 'block' ? Math.max(0, lockValue - currentBlock) : 0;
    const timeRemaining = lockType === 'time' ? Math.max(0, lockValue - currentTime) : 0;

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSimulating && lockType === 'block' && currentBlock < lockValue) {
            interval = setInterval(() => {
                setCurrentBlock(prev => Math.min(prev + 1, lockValue));
            }, 500);
        }
        return () => clearInterval(interval);
    }, [isSimulating, lockType, lockValue, currentBlock]);

    const resetSimulation = () => {
        setCurrentBlock(848500);
        setIsSimulating(false);
    };

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Calendar className="w-6 h-6 text-cyan-500" />
                    nLockTime 交易时间锁
                </h2>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    nLockTime 是交易结构中的一个 4 字节字段，用于指定交易可以被打包的最早时间。
                    值小于 500,000,000 被解释为区块高度，否则解释为 Unix 时间戳。
                </p>

                {/* Lock Type Selector */}
                <div className="flex gap-4 mb-6">
                    <button
                        onClick={() => { setLockType('block'); setLockValue(850000); }}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                            lockType === 'block'
                                ? 'bg-cyan-600 text-white'
                                : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                        <Blocks className="w-5 h-5 inline mr-2" />
                        区块高度锁
                    </button>
                    <button
                        onClick={() => { setLockType('time'); setLockValue(currentTime + 3600); }}
                        className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                            lockType === 'time'
                                ? 'bg-cyan-600 text-white'
                                : isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'
                        }`}
                    >
                        <CalendarClock className="w-5 h-5 inline mr-2" />
                        时间戳锁
                    </button>
                </div>

                {/* Configuration */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                nLockTime 值
                            </label>
                            <input
                                type="number"
                                value={lockValue}
                                onChange={(e) => setLockValue(parseInt(e.target.value) || 0)}
                                className={`w-full mt-2 px-4 py-3 rounded-lg font-mono ${
                                    isDarkMode
                                        ? 'bg-slate-900 border-slate-700 text-white'
                                        : 'bg-white border-slate-200 text-slate-900'
                                } border`}
                            />
                            <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                {lockType === 'block'
                                    ? `解释为区块高度 (< 500,000,000)`
                                    : `解释为 Unix 时间戳 (≥ 500,000,000)`
                                }
                            </p>
                        </div>
                        <div>
                            <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                当前 {lockType === 'block' ? '区块高度' : '时间'}
                            </label>
                            <div className={`mt-2 px-4 py-3 rounded-lg font-mono ${isDarkMode ? 'bg-slate-900 text-cyan-400' : 'bg-white text-cyan-600'} border ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                {lockType === 'block' ? currentBlock : new Date(currentTime * 1000).toLocaleString()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Simulation */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex items-center justify-between mb-6">
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        时间锁模拟
                    </h3>
                    <div className="flex gap-2">
                        {lockType === 'block' && (
                            <>
                                <button
                                    onClick={() => setIsSimulating(!isSimulating)}
                                    disabled={!isLocked}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                                        !isLocked
                                            ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                            : isSimulating
                                                ? 'bg-amber-600 text-white'
                                                : 'bg-cyan-600 text-white hover:bg-cyan-700'
                                    }`}
                                >
                                    {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    {isSimulating ? '暂停' : '模拟出块'}
                                </button>
                                <button
                                    onClick={resetSimulation}
                                    className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Progress */}
                {lockType === 'block' && (
                    <div className="mb-6">
                        <div className="flex justify-between text-sm mb-2">
                            <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>进度</span>
                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                {currentBlock} / {lockValue}
                            </span>
                        </div>
                        <div className={`h-4 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                            <div
                                className={`h-full transition-all duration-300 ${isLocked ? 'bg-amber-500' : 'bg-green-500'}`}
                                style={{ width: `${Math.min(100, (currentBlock / lockValue) * 100)}%` }}
                            />
                        </div>
                        <div className={`text-sm mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                            {isLocked ? `还需 ${blocksRemaining} 个区块 (~${Math.round(blocksRemaining * 10 / 60)} 小时)` : '时间锁已解除'}
                        </div>
                    </div>
                )}

                {/* Lock Status */}
                <div className={`p-6 rounded-xl text-center ${
                    isLocked
                        ? isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'
                        : isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                }`}>
                    {isLocked ? (
                        <>
                            <Lock className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                交易已锁定
                            </h4>
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                                矿工会拒绝将此交易打包进区块
                            </p>
                        </>
                    ) : (
                        <>
                            <Unlock className="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                交易可花费
                            </h4>
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                                时间锁已解除，交易可以被打包
                            </p>
                        </>
                    )}
                </div>

                {/* Transaction Structure */}
                <div className={`mt-6 p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>交易结构</div>
                    <pre className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>
{`{
  "version": 2,
  "inputs": [...],
  "outputs": [...],
  "locktime": ${lockValue}  // nLockTime
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
};

// --- CLTV Section ---

const CLTVSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [targetBlock, setTargetBlock] = useState(900000);
    const [currentBlock, setCurrentBlock] = useState(848500);

    const isLocked = currentBlock < targetBlock;

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Lock className="w-6 h-6 text-cyan-500" />
                    OP_CHECKLOCKTIMEVERIFY (CLTV)
                </h2>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    CLTV 是一个脚本操作码，它检查交易的 nLockTime 是否达到指定值。
                    如果未达到，脚本执行失败，交易无效。这允许在脚本层面实现时间锁。
                </p>

                {/* Script Example */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>CLTV 锁定脚本示例</div>
                    <pre className={`font-mono text-sm ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
{`<locktime>
OP_CHECKLOCKTIMEVERIFY
OP_DROP
<pubkey>
OP_CHECKSIG`}
                    </pre>
                </div>
            </div>

            {/* Interactive Demo */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    CLTV 脚本验证模拟
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            CLTV 锁定区块
                        </label>
                        <input
                            type="number"
                            value={targetBlock}
                            onChange={(e) => setTargetBlock(parseInt(e.target.value) || 0)}
                            className={`w-full mt-2 px-4 py-3 rounded-lg font-mono ${
                                isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                            } border`}
                        />
                    </div>
                    <div>
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            交易 nLockTime
                        </label>
                        <input
                            type="number"
                            value={currentBlock}
                            onChange={(e) => setCurrentBlock(parseInt(e.target.value) || 0)}
                            className={`w-full mt-2 px-4 py-3 rounded-lg font-mono ${
                                isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                            } border`}
                        />
                    </div>
                </div>

                {/* Verification Result */}
                <div className={`p-4 rounded-xl ${
                    isLocked
                        ? isDarkMode ? 'bg-red-900/30 border border-red-700' : 'bg-red-50 border border-red-200'
                        : isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                }`}>
                    <div className="flex items-center gap-3">
                        {isLocked ? (
                            <XCircle className="w-8 h-8 text-red-500" />
                        ) : (
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        )}
                        <div>
                            <div className={`font-bold ${isLocked ? isDarkMode ? 'text-red-300' : 'text-red-700' : isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                {isLocked ? 'OP_CHECKLOCKTIMEVERIFY 失败' : 'OP_CHECKLOCKTIMEVERIFY 通过'}
                            </div>
                            <div className={`text-sm ${isLocked ? isDarkMode ? 'text-red-200' : 'text-red-600' : isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                                {isLocked
                                    ? `nLockTime (${currentBlock}) < CLTV (${targetBlock})，脚本验证失败`
                                    : `nLockTime (${currentBlock}) ≥ CLTV (${targetBlock})，脚本验证通过`
                                }
                            </div>
                        </div>
                    </div>
                </div>

                {/* Execution Flow */}
                <div className={`mt-6 p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <h4 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        脚本执行流程
                    </h4>
                    <div className="space-y-2 text-sm font-mono">
                        {[
                            { op: `PUSH ${targetBlock}`, desc: '将锁定区块压入栈', status: 'done' },
                            { op: 'OP_CHECKLOCKTIMEVERIFY', desc: `检查 nLockTime ≥ ${targetBlock}`, status: isLocked ? 'fail' : 'done' },
                            { op: 'OP_DROP', desc: '从栈中移除锁定区块', status: isLocked ? 'skip' : 'done' },
                            { op: 'PUSH <pubkey>', desc: '压入公钥', status: isLocked ? 'skip' : 'done' },
                            { op: 'OP_CHECKSIG', desc: '验证签名', status: isLocked ? 'skip' : 'done' }
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                                    step.status === 'done' ? 'bg-green-500 text-white' :
                                    step.status === 'fail' ? 'bg-red-500 text-white' :
                                    isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                                }`}>
                                    {step.status === 'done' ? '✓' : step.status === 'fail' ? '✗' : '-'}
                                </div>
                                <span className={isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}>{step.op}</span>
                                <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>// {step.desc}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- CSV Section ---

const CSVSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [relativeBlocks, setRelativeBlocks] = useState(144); // ~1 day
    const [blocksSinceCreation, setBlocksSinceCreation] = useState(50);
    const [isSimulating, setIsSimulating] = useState(false);

    const isLocked = blocksSinceCreation < relativeBlocks;
    const blocksRemaining = Math.max(0, relativeBlocks - blocksSinceCreation);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSimulating && isLocked) {
            interval = setInterval(() => {
                setBlocksSinceCreation(prev => Math.min(prev + 1, relativeBlocks));
            }, 200);
        }
        return () => clearInterval(interval);
    }, [isSimulating, isLocked, relativeBlocks]);

    return (
        <div className="space-y-6 animate-in fade-in">
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    <Timer className="w-6 h-6 text-cyan-500" />
                    OP_CHECKSEQUENCEVERIFY (CSV)
                </h2>
                <p className={`text-sm mb-6 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    CSV 实现相对时间锁——锁定期从 UTXO 被创建时开始计算，而非绝对的区块高度。
                    这对于闪电网络的 HTLC 和支付通道至关重要。
                </p>

                {/* Script Example */}
                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className={`text-xs mb-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>CSV 锁定脚本示例</div>
                    <pre className={`font-mono text-sm ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
{`<relative_blocks>
OP_CHECKSEQUENCEVERIFY
OP_DROP
<pubkey>
OP_CHECKSIG`}
                    </pre>
                </div>
            </div>

            {/* Interactive Demo */}
            <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    相对时间锁模拟
                </h3>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div>
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            CSV 锁定区块数
                        </label>
                        <input
                            type="number"
                            value={relativeBlocks}
                            onChange={(e) => setRelativeBlocks(parseInt(e.target.value) || 0)}
                            className={`w-full mt-2 px-4 py-3 rounded-lg font-mono ${
                                isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-white'
                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                            } border`}
                        />
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            ≈ {Math.round(relativeBlocks * 10 / 60)} 小时
                        </p>
                    </div>
                    <div>
                        <label className={`text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            UTXO 创建后经过的区块
                        </label>
                        <div className={`mt-2 px-4 py-3 rounded-lg font-mono text-2xl ${isDarkMode ? 'bg-slate-800 text-cyan-400' : 'bg-slate-50 text-cyan-600'}`}>
                            {blocksSinceCreation}
                        </div>
                    </div>
                </div>

                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                        <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>等待进度</span>
                        <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                            {blocksSinceCreation} / {relativeBlocks} 区块
                        </span>
                    </div>
                    <div className={`h-4 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                        <div
                            className={`h-full transition-all ${isLocked ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min(100, (blocksSinceCreation / relativeBlocks) * 100)}%` }}
                        />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex gap-3 mb-6">
                    <button
                        onClick={() => setIsSimulating(!isSimulating)}
                        disabled={!isLocked}
                        className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                            !isLocked
                                ? 'bg-slate-600 text-slate-400 cursor-not-allowed'
                                : isSimulating
                                    ? 'bg-amber-600 text-white'
                                    : 'bg-cyan-600 text-white hover:bg-cyan-700'
                        }`}
                    >
                        {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        {isSimulating ? '暂停' : '模拟时间流逝'}
                    </button>
                    <button
                        onClick={() => { setBlocksSinceCreation(0); setIsSimulating(false); }}
                        className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-600'}`}
                    >
                        <RotateCcw className="w-4 h-4" />
                    </button>
                </div>

                {/* Status */}
                <div className={`p-6 rounded-xl text-center ${
                    isLocked
                        ? isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'
                        : isDarkMode ? 'bg-green-900/30 border border-green-700' : 'bg-green-50 border border-green-200'
                }`}>
                    {isLocked ? (
                        <>
                            <Hourglass className="w-16 h-16 mx-auto mb-4 text-amber-500" />
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-700'}`}>
                                UTXO 仍在等待期
                            </h4>
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                                还需等待 {blocksRemaining} 个区块才能花费
                            </p>
                        </>
                    ) : (
                        <>
                            <Unlock className="w-16 h-16 mx-auto mb-4 text-green-500" />
                            <h4 className={`text-xl font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                CSV 时间锁已解除
                            </h4>
                            <p className={`text-sm mt-2 ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                                UTXO 现在可以被花费
                            </p>
                        </>
                    )}
                </div>
            </div>

            {/* CSV vs CLTV */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-cyan-900/30 border border-cyan-700' : 'bg-cyan-50 border border-cyan-200'}`}>
                <div className="flex items-start gap-3">
                    <Info className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`} />
                    <div>
                        <div className={`font-bold ${isDarkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>CSV vs CLTV</div>
                        <p className={`text-sm mt-1 ${isDarkMode ? 'text-cyan-200' : 'text-cyan-700'}`}>
                            CLTV 使用绝对时间（"2025年1月1日后可用"），CSV 使用相对时间（"创建后等待144个区块"）。
                            CSV 对于不知道交易何时会被确认的场景特别有用，如闪电网络通道。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Use Cases Section ---

const UseCasesSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in">
        <div className="bg-gradient-to-br from-teal-600 to-cyan-700 rounded-2xl p-8 text-white shadow-xl">
            <h1 className="text-3xl font-bold mb-4 flex items-center gap-3">
                <Gift className="w-8 h-8" /> 时间锁应用场景
            </h1>
            <p className="text-teal-50 text-lg leading-relaxed max-w-3xl">
                时间锁不仅仅是技术特性，它是构建复杂金融合约的基础。
                从遗产规划到闪电网络，时间锁无处不在。
            </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            {[
                {
                    icon: Gift,
                    title: '遗产规划',
                    config: 'CLTV',
                    color: 'purple',
                    description: '创建在你去世后一定时间才能解锁的交易，确保资产传承给继承人。',
                    example: 'CLTV 锁定到 2030 年，届时子女可以使用备份密钥取款'
                },
                {
                    icon: Shield,
                    title: '安全保险库',
                    config: 'CSV',
                    color: 'blue',
                    description: '热钱包可以立即花费，但如果被黑客攻击，冷钱包有 24 小时反应时间。',
                    example: 'CSV 144 区块延迟，给你时间发现并阻止未授权交易'
                },
                {
                    icon: Users,
                    title: '闪电网络 HTLC',
                    config: 'CSV + CLTV',
                    color: 'amber',
                    description: '支付通道使用时间锁确保在对方不配合时可以取回资金。',
                    example: '如果 Bob 不响应，Alice 可以在超时后单方面关闭通道'
                },
                {
                    icon: Clock,
                    title: '定期支付',
                    config: 'CLTV',
                    color: 'green',
                    description: '创建未来不同时间解锁的多笔交易，实现定期支付计划。',
                    example: '每月解锁一定金额，实现工资或订阅支付'
                }
            ].map((useCase) => {
                const Icon = useCase.icon;
                return (
                    <div
                        key={useCase.title}
                        className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
                    >
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-xl bg-${useCase.color}-500/10`}>
                                <Icon className={`w-6 h-6 text-${useCase.color}-500`} />
                            </div>
                            <div>
                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{useCase.title}</h3>
                                <span className={`text-xs font-mono ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>{useCase.config}</span>
                            </div>
                        </div>
                        <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            {useCase.description}
                        </p>
                        <div className={`p-3 rounded-lg text-sm ${isDarkMode ? 'bg-slate-800 text-slate-300' : 'bg-slate-50 text-slate-600'}`}>
                            <span className={`font-medium ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>示例：</span> {useCase.example}
                        </div>
                    </div>
                );
            })}
        </div>

        {/* Atomic Swaps */}
        <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <ArrowRight className="w-5 h-5 text-cyan-500" />
                原子交换 (Atomic Swap)
            </h3>
            <p className={`text-sm mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                时间锁是实现跨链原子交换的关键。通过 HTLC（哈希时间锁合约），双方可以在无需信任的情况下交换不同链上的资产。
            </p>
            <div className="grid md:grid-cols-4 gap-4">
                {[
                    { step: '1', title: 'Alice 锁定 BTC', desc: 'HTLC: 知道密钥可取款，或超时退回' },
                    { step: '2', title: 'Bob 锁定 LTC', desc: '使用相同哈希锁，更短的超时时间' },
                    { step: '3', title: 'Alice 取款 LTC', desc: '揭示密钥获取 LTC' },
                    { step: '4', title: 'Bob 取款 BTC', desc: '使用已揭示的密钥获取 BTC' }
                ].map((item) => (
                    <div key={item.step} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                        <div className="w-8 h-8 rounded-full bg-cyan-500 text-white flex items-center justify-center font-bold mb-2">
                            {item.step}
                        </div>
                        <h4 className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.title}</h4>
                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</p>
                    </div>
                ))}
            </div>
        </div>

        {/* Warning */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-900/30 border border-amber-700' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                    <div className={`font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>使用注意事项</div>
                    <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-700'}`}>
                        <li>• 时间锁一旦设置无法撤销，请仔细规划</li>
                        <li>• 使用区块高度比时间戳更可预测</li>
                        <li>• 确保备份好所有必需的密钥和脚本</li>
                        <li>• 测试时先用小额或测试网验证</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- Quiz Section ---

const QuizSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="animate-in fade-in">
        <Quiz quizData={timeLockQuiz} />
    </div>
);

// --- Card Component ---

const Card: React.FC<{ isDarkMode: boolean; title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ isDarkMode, title, icon, children }) => (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
    </div>
);

export default TimeLockDemo;
