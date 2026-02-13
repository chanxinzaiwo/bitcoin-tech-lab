import React, { useState, useEffect } from 'react';
import { Repeat, Lock, Unlock, Clock, CheckCircle, XCircle, AlertTriangle, ArrowRightLeft, Link2, Shield, Zap, Globe, Building, Eye, EyeOff } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const AtomicSwapDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'htlc', label: 'HTLC 机制' },
        { id: 'workflow', label: '交换流程' },
        { id: 'interactive', label: '交互演示' },
        { id: 'comparison', label: '方案对比' },
        { id: 'quiz', label: '测验' }
    ];

    // Interactive swap simulation state
    const [swapState, setSwapState] = useState<'idle' | 'secret_generated' | 'alice_locked' | 'bob_locked' | 'bob_claimed' | 'alice_claimed' | 'timeout_refund'>('idle');
    const [secret, setSecret] = useState('');
    const [secretHash, setSecretHash] = useState('');
    const [aliceLockTime, setAliceLockTime] = useState(48);
    const [bobLockTime, setBobLockTime] = useState(24);
    const [timeElapsed, setTimeElapsed] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(false);

    // Generate random secret
    const generateSecret = () => {
        const randomBytes = new Uint8Array(32);
        crypto.getRandomValues(randomBytes);
        const secretHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
        setSecret(secretHex);
        // Simulate SHA256 hash (simplified)
        const hashBytes = new Uint8Array(32);
        crypto.getRandomValues(hashBytes);
        setSecretHash(Array.from(hashBytes).map(b => b.toString(16).padStart(2, '0')).join(''));
        setSwapState('secret_generated');
        setTimeElapsed(0);
    };

    // Reset simulation
    const resetSimulation = () => {
        setSwapState('idle');
        setSecret('');
        setSecretHash('');
        setTimeElapsed(0);
        setIsAutoPlaying(false);
    };

    // Auto-play simulation
    useEffect(() => {
        if (!isAutoPlaying) return;

        const steps: Array<{ state: typeof swapState; delay: number }> = [
            { state: 'secret_generated', delay: 1500 },
            { state: 'alice_locked', delay: 2000 },
            { state: 'bob_locked', delay: 2000 },
            { state: 'bob_claimed', delay: 2000 },
            { state: 'alice_claimed', delay: 2000 },
        ];

        const currentIndex = steps.findIndex(s => s.state === swapState);
        if (currentIndex < steps.length - 1) {
            const timer = setTimeout(() => {
                if (swapState === 'idle') {
                    generateSecret();
                } else {
                    setSwapState(steps[currentIndex + 1].state);
                }
            }, steps[currentIndex]?.delay || 1500);
            return () => clearTimeout(timer);
        } else {
            setIsAutoPlaying(false);
        }
    }, [isAutoPlaying, swapState]);

    const quizData = getQuizByModule('atomicswap');

    return (
        <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className={`rounded-2xl p-6 mb-6 border ${isDarkMode ? 'bg-gradient-to-r from-purple-900/30 to-pink-900/30 border-purple-800/50' : 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100'}`}>
                            <Repeat className="w-8 h-8 text-purple-500" />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                原子交换 (Atomic Swaps)
                            </h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                无需信任的跨链资产交换
                            </p>
                        </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        原子交换允许两方在不同区块链之间直接交换加密货币，无需中间人或中心化交易所。
                        交换要么完全成功（双方都得到对方的币），要么完全失败（双方保留原有的币），不存在中间状态。
                    </p>
                </div>

                {/* Tabs */}
                <div className={`flex flex-wrap gap-2 mb-6 p-2 rounded-xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-purple-500 text-white'
                                : isDarkMode
                                    ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className={`rounded-2xl border p-6 ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-white border-slate-200'}`}>
                    {activeTab === 'intro' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                什么是原子交换？
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                                <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                    <strong>"原子性"</strong> 指的是交易的不可分割性：交换要么完整执行，要么完全不执行。
                                    这保证了即使交换双方互不信任，也不会有任何一方被欺骗。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Shield className="w-5 h-5 text-green-500" />
                                        核心优势
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>无需信任</strong>：不依赖任何第三方</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>去中心化</strong>：无需中心化交易所</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>资金安全</strong>：保持对私钥的控制</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>原子保证</strong>：交换不可能部分完成</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <AlertTriangle className="w-5 h-5 text-amber-500" />
                                        面临的挑战
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>链兼容性</strong>：需要双方链支持相同的哈希函数</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>时间锁限制</strong>：需要等待确认时间</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>流动性</strong>：需要找到匹配的交易对手</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <XCircle className="w-4 h-4 text-red-500 mt-1 flex-shrink-0" />
                                            <span><strong>隐私</strong>：链上数据可被关联</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    历史背景
                                </h3>
                                <div className={`space-y-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <p>
                                        原子交换的概念最早由 Tier Nolan 在 2013 年在 Bitcointalk 论坛上提出。
                                        2017 年，首次成功的链上原子交换在 Litecoin 和 Decred 之间完成。
                                    </p>
                                    <div className="flex flex-wrap gap-4 mt-4">
                                        <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className="text-sm text-slate-500">2013</span>
                                            <p className="font-medium">概念提出</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className="text-sm text-slate-500">2017</span>
                                            <p className="font-medium">首次链上实现</p>
                                        </div>
                                        <div className={`px-4 py-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className="text-sm text-slate-500">2018+</span>
                                            <p className="font-medium">闪电网络原子交换</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'htlc' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                HTLC：原子交换的核心机制
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                    <strong>HTLC (Hash Time-Locked Contract)</strong> 哈希时间锁定合约是实现原子交换的关键技术。
                                    它结合了哈希锁和时间锁，确保交换的原子性。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Lock className="w-5 h-5 text-purple-500" />
                                        哈希锁 (Hashlock)
                                    </h3>
                                    <div className={`space-y-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <p>资金被锁定，只有知道秘密原像的人才能解锁。</p>
                                        <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                            <div className="text-purple-500">// 秘密 (Secret)</div>
                                            <div>S = random_256_bits</div>
                                            <div className="mt-2 text-purple-500">// 哈希 (Hash)</div>
                                            <div>H = SHA256(S)</div>
                                            <div className="mt-2 text-purple-500">// 解锁条件</div>
                                            <div>提供 x 使得 SHA256(x) == H</div>
                                        </div>
                                    </div>
                                </div>

                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Clock className="w-5 h-5 text-amber-500" />
                                        时间锁 (Timelock)
                                    </h3>
                                    <div className={`space-y-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <p>如果在规定时间内没有使用秘密解锁，资金可以退回给发送者。</p>
                                        <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                                            <div className="text-amber-500">// 时间锁设置</div>
                                            <div>Alice: locktime = 48 小时</div>
                                            <div>Bob: locktime = 24 小时</div>
                                            <div className="mt-2 text-amber-500">// 退款条件</div>
                                            <div>若超时，原始发送者可取回资金</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    HTLC 脚本结构
                                </h3>
                                <div className={`p-4 rounded-lg font-mono text-sm overflow-x-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white border border-slate-200'}`}>
                                    <pre className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>
{`OP_IF
    # 哈希锁分支 - 用秘密解锁
    OP_SHA256 <hash> OP_EQUALVERIFY
    <receiver_pubkey> OP_CHECKSIG
OP_ELSE
    # 时间锁分支 - 超时退款
    <locktime> OP_CHECKLOCKTIMEVERIFY OP_DROP
    <sender_pubkey> OP_CHECKSIG
OP_ENDIF`}
                                    </pre>
                                </div>
                                <div className={`mt-4 grid md:grid-cols-2 gap-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <div className="flex items-start gap-2">
                                        <Unlock className="w-5 h-5 text-green-500 mt-0.5" />
                                        <div>
                                            <strong>正常路径</strong>：接收者提供秘密 + 签名
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Clock className="w-5 h-5 text-amber-500 mt-0.5" />
                                        <div>
                                            <strong>退款路径</strong>：超时后发送者可取回
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl border-2 border-dashed ${isDarkMode ? 'border-purple-500/50' : 'border-purple-300'}`}>
                                <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    <AlertTriangle className="w-5 h-5 text-amber-500" />
                                    为什么时间锁必须不对称？
                                </h3>
                                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    Alice 的时间锁（48小时）必须比 Bob 的（24小时）更长。这确保了：
                                </p>
                                <ul className={`mt-3 space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <li>• Bob 有足够时间在看到秘密后取走 Alice 锁定的资金</li>
                                    <li>• 如果 Bob 不配合，Alice 可以等待退款</li>
                                    <li>• 避免 Alice 在 Bob 取款前就退款的风险</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'workflow' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                原子交换完整流程
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                                <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                    假设 Alice 想用 1 BTC 换取 Bob 的 50 LTC。以下是完整的交换流程：
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        step: 1,
                                        title: 'Alice 生成秘密',
                                        icon: <Lock className="w-5 h-5" />,
                                        color: 'purple',
                                        content: 'Alice 生成一个随机秘密 S，并计算其哈希值 H = SHA256(S)。她只将 H 分享给 Bob，保密 S。'
                                    },
                                    {
                                        step: 2,
                                        title: 'Alice 在比特币链锁定资金',
                                        icon: <Lock className="w-5 h-5" />,
                                        color: 'orange',
                                        content: 'Alice 创建一个 HTLC，锁定 1 BTC。解锁条件：提供秘密 S（给 Bob）或 48 小时后退款（给 Alice）。'
                                    },
                                    {
                                        step: 3,
                                        title: 'Bob 在莱特币链锁定资金',
                                        icon: <Lock className="w-5 h-5" />,
                                        color: 'blue',
                                        content: 'Bob 看到 Alice 的交易确认后，创建一个使用相同哈希 H 的 HTLC，锁定 50 LTC。时间锁设为 24 小时。'
                                    },
                                    {
                                        step: 4,
                                        title: 'Alice 取走莱特币',
                                        icon: <Unlock className="w-5 h-5" />,
                                        color: 'green',
                                        content: 'Alice 使用秘密 S 解锁 Bob 的 HTLC，取走 50 LTC。此时秘密 S 在莱特币链上公开。'
                                    },
                                    {
                                        step: 5,
                                        title: 'Bob 取走比特币',
                                        icon: <Unlock className="w-5 h-5" />,
                                        color: 'green',
                                        content: 'Bob 从莱特币链上看到秘密 S，使用它解锁 Alice 的 HTLC，取走 1 BTC。交换完成！'
                                    }
                                ].map((item) => (
                                    <div key={item.step} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${item.color === 'purple' ? 'bg-purple-500/20 text-purple-500' :
                                                    item.color === 'orange' ? 'bg-orange-500/20 text-orange-500' :
                                                        item.color === 'blue' ? 'bg-blue-500/20 text-blue-500' :
                                                            'bg-green-500/20 text-green-500'
                                                }`}>
                                                {item.icon}
                                            </div>
                                            <div>
                                                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    步骤 {item.step}: {item.title}
                                                </h3>
                                                <p className={`mt-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {item.content}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-red-500/10 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                    <AlertTriangle className="w-5 h-5" />
                                    失败场景：超时退款
                                </h3>
                                <ul className={`space-y-2 ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                                    <li>• 如果 Bob 没有创建他的 HTLC，Alice 等待 48 小时后取回她的 BTC</li>
                                    <li>• 如果 Alice 没有取走 LTC，Bob 等待 24 小时后取回他的 LTC</li>
                                    <li>• 无论哪种情况，双方都不会损失资金</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                交互式原子交换演示
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                    模拟 Alice (BTC) 和 Bob (LTC) 之间的原子交换过程。点击按钮逐步执行，或使用自动播放查看完整流程。
                                </p>
                            </div>

                            {/* Control buttons */}
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => {
                                        resetSimulation();
                                        setIsAutoPlaying(true);
                                        generateSecret();
                                    }}
                                    disabled={isAutoPlaying}
                                    className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${isAutoPlaying
                                            ? 'bg-slate-500 text-slate-300 cursor-not-allowed'
                                            : 'bg-purple-500 text-white hover:bg-purple-600'
                                        }`}
                                >
                                    <Zap className="w-4 h-4" />
                                    自动播放
                                </button>
                                <button
                                    onClick={resetSimulation}
                                    className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'}`}
                                >
                                    重置
                                </button>
                            </div>

                            {/* Visualization */}
                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Alice's side */}
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-orange-500/10 border-orange-500/30' : 'bg-orange-50 border-orange-200'}`}>
                                    <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                                        <span className="text-2xl">👩</span> Alice (持有 BTC)
                                    </h3>

                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>秘密 (Secret)</div>
                                            <div className={`font-mono text-xs mt-1 break-all ${secret ? (isDarkMode ? 'text-green-400' : 'text-green-600') : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                                                {secret ? secret.slice(0, 32) + '...' : '等待生成...'}
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>BTC HTLC 状态</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {swapState === 'idle' || swapState === 'secret_generated' ? (
                                                    <><XCircle className="w-4 h-4 text-slate-400" /><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>未创建</span></>
                                                ) : swapState === 'alice_claimed' ? (
                                                    <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-500">Bob 已取走</span></>
                                                ) : (
                                                    <><Lock className="w-4 h-4 text-orange-500" /><span className="text-orange-500">已锁定 1 BTC</span></>
                                                )}
                                            </div>
                                        </div>

                                        {swapState === 'idle' && (
                                            <button
                                                onClick={generateSecret}
                                                className="w-full py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
                                            >
                                                1. 生成秘密
                                            </button>
                                        )}

                                        {swapState === 'secret_generated' && (
                                            <button
                                                onClick={() => setSwapState('alice_locked')}
                                                className="w-full py-2 rounded-lg bg-orange-500 text-white font-medium hover:bg-orange-600"
                                            >
                                                2. 创建 BTC HTLC
                                            </button>
                                        )}

                                        {swapState === 'bob_locked' && (
                                            <button
                                                onClick={() => setSwapState('bob_claimed')}
                                                className="w-full py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
                                            >
                                                4. 使用秘密取走 LTC
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Bob's side */}
                                <div className={`p-4 rounded-xl border ${isDarkMode ? 'bg-blue-500/10 border-blue-500/30' : 'bg-blue-50 border-blue-200'}`}>
                                    <h3 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                                        <span className="text-2xl">👨</span> Bob (持有 LTC)
                                    </h3>

                                    <div className="space-y-3">
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>哈希 (Hash)</div>
                                            <div className={`font-mono text-xs mt-1 break-all ${secretHash ? (isDarkMode ? 'text-blue-400' : 'text-blue-600') : (isDarkMode ? 'text-slate-600' : 'text-slate-400')}`}>
                                                {secretHash ? secretHash.slice(0, 32) + '...' : '等待 Alice 分享...'}
                                            </div>
                                        </div>

                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>LTC HTLC 状态</div>
                                            <div className="flex items-center gap-2 mt-1">
                                                {['idle', 'secret_generated', 'alice_locked'].includes(swapState) ? (
                                                    <><XCircle className="w-4 h-4 text-slate-400" /><span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>未创建</span></>
                                                ) : swapState === 'bob_claimed' || swapState === 'alice_claimed' ? (
                                                    <><CheckCircle className="w-4 h-4 text-green-500" /><span className="text-green-500">Alice 已取走</span></>
                                                ) : (
                                                    <><Lock className="w-4 h-4 text-blue-500" /><span className="text-blue-500">已锁定 50 LTC</span></>
                                                )}
                                            </div>
                                        </div>

                                        {swapState === 'alice_locked' && (
                                            <button
                                                onClick={() => setSwapState('bob_locked')}
                                                className="w-full py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
                                            >
                                                3. 创建 LTC HTLC
                                            </button>
                                        )}

                                        {swapState === 'bob_claimed' && (
                                            <button
                                                onClick={() => setSwapState('alice_claimed')}
                                                className="w-full py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
                                            >
                                                5. 从链上提取秘密，取走 BTC
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Status indicator */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <div className="flex items-center justify-between">
                                    <span className={`font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>交换状态</span>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${swapState === 'alice_claimed'
                                            ? 'bg-green-500/20 text-green-500'
                                            : swapState === 'idle'
                                                ? 'bg-slate-500/20 text-slate-400'
                                                : 'bg-purple-500/20 text-purple-500'
                                        }`}>
                                        {swapState === 'idle' && '等待开始'}
                                        {swapState === 'secret_generated' && '秘密已生成'}
                                        {swapState === 'alice_locked' && 'BTC 已锁定'}
                                        {swapState === 'bob_locked' && 'LTC 已锁定'}
                                        {swapState === 'bob_claimed' && 'Alice 取走 LTC'}
                                        {swapState === 'alice_claimed' && '交换完成！'}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                <div className={`mt-3 h-2 rounded-full overflow-hidden ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                    <div
                                        className="h-full bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-500"
                                        style={{
                                            width: `${['idle', 'secret_generated', 'alice_locked', 'bob_locked', 'bob_claimed', 'alice_claimed'].indexOf(swapState) * 20}%`
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'comparison' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                原子交换方案对比
                            </h2>

                            <div className="overflow-x-auto">
                                <table className={`w-full ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <thead>
                                        <tr className={isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                            <th className="px-4 py-3 text-left font-medium">特性</th>
                                            <th className="px-4 py-3 text-left font-medium">链上 HTLC</th>
                                            <th className="px-4 py-3 text-left font-medium">闪电网络</th>
                                            <th className="px-4 py-3 text-left font-medium">适配器签名</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-700">
                                        <tr>
                                            <td className="px-4 py-3 font-medium">速度</td>
                                            <td className="px-4 py-3">
                                                <span className="text-amber-500">慢（需等待确认）</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-green-500">快（秒级）</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-amber-500">慢（链上交易）</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">费用</td>
                                            <td className="px-4 py-3">
                                                <span className="text-red-500">高（多笔链上交易）</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-green-500">低（链下）</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-amber-500">中等</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">隐私性</td>
                                            <td className="px-4 py-3">
                                                <span className="text-red-500">差（相同哈希可关联）</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-amber-500">中等</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-green-500">好（看起来像普通交易）</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">前提条件</td>
                                            <td className="px-4 py-3">双链支持相同哈希函数</td>
                                            <td className="px-4 py-3">双方需有通道</td>
                                            <td className="px-4 py-3">双链支持 Schnorr</td>
                                        </tr>
                                        <tr>
                                            <td className="px-4 py-3 font-medium">复杂度</td>
                                            <td className="px-4 py-3">
                                                <span className="text-green-500">简单</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-amber-500">中等</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className="text-red-500">复杂</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Link2 className="w-5 h-5 text-purple-500" />
                                        链上 HTLC
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        最基础的原子交换方式，适合不频繁的大额交换。需要等待双链确认。
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Zap className="w-5 h-5 text-amber-500" />
                                        闪电网络交换
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        利用支付通道实现即时交换，但需要双方预先建立通道并锁定资金。
                                    </p>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <EyeOff className="w-5 h-5 text-green-500" />
                                        适配器签名
                                    </h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        最新的隐私保护方案，交易在链上看起来像普通转账，无法识别为交换。
                                    </p>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                    实际应用
                                </h3>
                                <div className={`grid md:grid-cols-2 gap-4 ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>
                                    <div className="flex items-start gap-2">
                                        <Building className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong>去中心化交易所 (DEX)</strong>
                                            <p className="text-sm mt-1">如 Bisq、Komodo DEX 使用原子交换</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Globe className="w-5 h-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong>跨链桥</strong>
                                            <p className="text-sm mt-1">连接不同区块链的资产转移</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'quiz' && (
                        <div>
                            {quizData ? (
                                <Quiz quizData={quizData} />
                            ) : (
                                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    测验数据加载中...
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AtomicSwapDemo;
