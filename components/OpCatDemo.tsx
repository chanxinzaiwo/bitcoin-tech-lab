import React, { useState } from 'react';
import { Link2, Code, Zap, AlertTriangle, Info, ChevronRight, Check, Play, RotateCcw, Layers, Shield, Lock, Unlock, GitBranch, FileText, Hash, ArrowRight, Clock, Cpu } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { opcatQuiz } from '../data/quizData';

type TabType = 'intro' | 'history' | 'mechanism' | 'usecases' | 'simulator' | 'quiz';

const OpCatDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'history', label: '历史背景' },
        { id: 'mechanism', label: '工作机制' },
        { id: 'usecases', label: '应用场景' },
        { id: 'simulator', label: '交互模拟' },
        { id: 'quiz', label: '测验' }
    ];

    return (
        <div className={`font-sans selection:bg-orange-100 min-h-screen transition-colors ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 backdrop-blur-md ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-orange-600 text-white p-1.5 rounded-full">
                                <Link2 className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>OP_CAT</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>OP_CAT</span>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                                        activeTab === tab.id
                                            ? 'bg-orange-500/10 text-orange-500'
                                            : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                                    }`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Mobile Menu - Grid Layout */}
                <div className={`md:hidden border-t ${isDarkMode ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
                    <div className="grid grid-cols-3 gap-1 p-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg text-xs font-medium transition-all min-h-[44px] ${
                                    activeTab === tab.id
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : isDarkMode
                                            ? 'bg-slate-800/50 text-slate-300 active:bg-slate-700'
                                            : 'bg-white text-slate-600 border border-slate-200 active:bg-slate-100'
                                }`}
                            >
                                <span className="leading-tight text-center">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection isDarkMode={isDarkMode} changeTab={setActiveTab} />}
                {activeTab === 'history' && <HistorySection isDarkMode={isDarkMode} />}
                {activeTab === 'mechanism' && <MechanismSection isDarkMode={isDarkMode} />}
                {activeTab === 'usecases' && <UseCasesSection isDarkMode={isDarkMode} />}
                {activeTab === 'simulator' && <SimulatorSection isDarkMode={isDarkMode} />}
                {activeTab === 'quiz' && <Quiz quizData={opcatQuiz} />}
            </main>
        </div>
    );
};

// --- Intro Section ---
const IntroSection: React.FC<{ isDarkMode: boolean; changeTab: (tab: TabType) => void }> = ({ isDarkMode, changeTab }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-orange-600 to-amber-700 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">OP_CAT：字节拼接操作码</h1>
            <p className="text-orange-50 text-lg md:text-xl max-w-2xl leading-relaxed">
                OP_CAT 是一个简单但强大的操作码，用于将两个堆栈元素拼接成一个。
                它曾在 2010 年被禁用，现在社区正在讨论重新激活它以解锁更多可编程性。
            </p>
            <div className="mt-8 grid md:grid-cols-3 gap-4">
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">BIP-347</div>
                    <div className="text-sm text-orange-200">OP_CAT 重新激活提案</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">0x7e</div>
                    <div className="text-sm text-orange-200">操作码十六进制值</div>
                </div>
                <div className="bg-white/10 rounded-xl p-4">
                    <div className="text-3xl font-bold">520 字节</div>
                    <div className="text-sm text-orange-200">提案中的最大结果长度</div>
                </div>
            </div>
            <button
                onClick={() => changeTab('history')}
                className="mt-8 bg-white text-orange-700 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
            >
                了解历史背景 <ChevronRight className="w-5 h-5" />
            </button>
        </div>

        {/* 什么是 OP_CAT */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                什么是 OP_CAT？
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        OP_CAT（concatenate，拼接）是比特币脚本中的一个操作码，功能非常简单：
                        从堆栈中弹出两个元素，将它们拼接成一个，然后推回堆栈。
                    </p>
                    <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800 text-orange-400' : 'bg-slate-100 text-orange-700'}`}>
                        <div className="mb-2">// 操作前堆栈</div>
                        <div>[ "Hello" ] [ "World" ]</div>
                        <div className="my-2 text-slate-500">OP_CAT</div>
                        <div className="mb-2">// 操作后堆栈</div>
                        <div>[ "HelloWorld" ]</div>
                    </div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-orange-900/20 border border-orange-500/30' : 'bg-orange-50 border border-orange-200'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-orange-400' : 'text-orange-700'}`}>
                        <AlertTriangle className="w-5 h-5" />
                        当前状态
                    </h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        OP_CAT 目前在比特币主网上是<strong>禁用的</strong>。它在 2010 年被中本聪禁用，
                        主要是出于对潜在 DoS 攻击的担忧。BIP-347 提案正在寻求通过软分叉重新激活它。
                    </p>
                </div>
            </div>
        </div>

        {/* 为什么重要 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                为什么 OP_CAT 如此重要？
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Code className="w-8 h-8 text-orange-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>增强可编程性</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        允许在脚本中动态构建数据，实现更复杂的智能合约逻辑
                    </p>
                </div>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Shield className="w-8 h-8 text-emerald-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Vault 实现</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        可以实现更简洁的 Vault 保险库，提供更好的资金保护
                    </p>
                </div>
                <div className={`p-4 rounded-lg border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                    <Layers className="w-8 h-8 text-blue-500 mb-3" />
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>树结构验证</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        支持在脚本中验证默克尔树证明，实现更高效的数据验证
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- History Section ---
const HistorySection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                OP_CAT 的历史
            </h2>

            {/* 时间线 */}
            <div className="relative">
                <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

                <div className="space-y-8">
                    {/* 2009 */}
                    <div className="relative pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-emerald-900/50 text-emerald-400' : 'bg-emerald-100 text-emerald-600'}`}>
                            <Check className="w-4 h-4" />
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>2009年1月</div>
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>比特币诞生</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                OP_CAT 作为原始脚本系统的一部分被包含在比特币中，操作码值为 0x7e。
                            </p>
                        </div>
                    </div>

                    {/* 2010 */}
                    <div className="relative pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-red-900/50 text-red-400' : 'bg-red-100 text-red-600'}`}>
                            <AlertTriangle className="w-4 h-4" />
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>2010年8月</div>
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>被禁用</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                中本聪在一次大规模脚本操作码禁用中移除了 OP_CAT。主要担忧是：
                            </p>
                            <ul className={`mt-2 text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                <li>• 内存耗尽攻击：反复拼接可能创建极大的堆栈元素</li>
                                <li>• 潜在的 DoS 向量：可能被用于消耗节点资源</li>
                            </ul>
                        </div>
                    </div>

                    {/* 2021 */}
                    <div className="relative pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-purple-900/50 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
                            <Zap className="w-4 h-4" />
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>2021年11月</div>
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Taproot 激活</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Taproot 引入了 Tapscript，为重新引入 OP_CAT 创造了更安全的环境。
                                Tapscript 已经有了 520 字节的堆栈元素大小限制。
                            </p>
                        </div>
                    </div>

                    {/* 2023 */}
                    <div className="relative pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-orange-900/50 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
                            <FileText className="w-4 h-4" />
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>2023年10月</div>
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>BIP-347 提案</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                Ethan Heilman 和 Armin Sabouri 提交了 BIP-347，
                                提议通过软分叉在 Tapscript 中重新激活 OP_CAT。
                            </p>
                        </div>
                    </div>

                    {/* 现在 */}
                    <div className="relative pl-12">
                        <div className={`absolute left-0 w-8 h-8 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                            <Clock className="w-4 h-4" />
                        </div>
                        <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <div className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>现在</div>
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>社区讨论中</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                比特币社区正在讨论 OP_CAT 的激活方式和时间表。
                                已经在 Signet 测试网上进行测试，开发者可以实验各种用例。
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 为什么现在安全 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                为什么现在重新激活是安全的？
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                    <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                        Tapscript 的保护
                    </h3>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            堆栈元素最大 520 字节
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            脚本大小有严格限制
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-emerald-500 mt-0.5" />
                            操作数计数限制
                        </li>
                    </ul>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                    <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                        BIP-347 的设计
                    </h3>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                            只在 Tapscript 中启用
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                            结果不能超过 520 字节
                        </li>
                        <li className="flex items-start gap-2">
                            <Check className="w-4 h-4 text-blue-500 mt-0.5" />
                            失败时整个脚本失败
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- Mechanism Section ---
const MechanismSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                OP_CAT 工作机制
            </h2>

            {/* 操作步骤 */}
            <div className={`p-6 rounded-xl mb-6 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    执行过程
                </h3>
                <div className="grid md:grid-cols-4 gap-4">
                    <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-orange-500 mb-2">1</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            弹出栈顶元素 B
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-orange-500 mb-2">2</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            弹出次栈顶元素 A
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-orange-500 mb-2">3</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            拼接为 A || B
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                        <div className="text-2xl font-bold text-orange-500 mb-2">4</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                            结果推入堆栈
                        </div>
                    </div>
                </div>
            </div>

            {/* 代码示例 */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    BIP-347 伪代码
                </h3>
                <div className={`font-mono text-sm p-4 rounded-lg overflow-x-auto ${isDarkMode ? 'bg-slate-900 text-orange-400' : 'bg-white text-orange-700'}`}>
                    <pre>{`case OP_CAT:
{
    // 检查堆栈至少有两个元素
    if (stack.size() < 2)
        return set_error(serror, SCRIPT_ERR_INVALID_STACK_OPERATION);

    // 获取两个操作数
    valtype& vch1 = stacktop(-2);  // A
    valtype& vch2 = stacktop(-1);  // B

    // 检查拼接后长度不超过 520 字节
    if (vch1.size() + vch2.size() > MAX_SCRIPT_ELEMENT_SIZE)
        return set_error(serror, SCRIPT_ERR_PUSH_SIZE);

    // 执行拼接：A || B
    vch1.insert(vch1.end(), vch2.begin(), vch2.end());

    // 弹出 B，栈顶现在是拼接结果
    stack.pop_back();
}
break;`}</pre>
                </div>
            </div>
        </div>

        {/* 与其他操作码的关系 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                与其他操作码的协同
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Hash className="w-5 h-5 text-blue-500" />
                        OP_SHA256 + OP_CAT
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        验证默克尔树证明：
                    </p>
                    <div className={`font-mono text-xs p-3 rounded ${isDarkMode ? 'bg-slate-900 text-blue-400' : 'bg-white text-blue-700'}`}>
                        <div>&lt;leaf&gt; &lt;sibling&gt;</div>
                        <div>OP_CAT OP_SHA256</div>
                        <div>&lt;expected_root&gt; OP_EQUAL</div>
                    </div>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        <Shield className="w-5 h-5 text-emerald-500" />
                        OP_CHECKSIG + OP_CAT
                    </h3>
                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        实现契约（Covenants）：
                    </p>
                    <div className={`font-mono text-xs p-3 rounded ${isDarkMode ? 'bg-slate-900 text-emerald-400' : 'bg-white text-emerald-700'}`}>
                        <div>// 重构交易数据</div>
                        <div>&lt;tx_part1&gt; &lt;tx_part2&gt;</div>
                        <div>OP_CAT</div>
                        <div>// 验证签名覆盖的数据</div>
                    </div>
                </div>
            </div>
        </div>

        {/* 限制 */}
        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
            <div className="flex items-start gap-3">
                <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                <div>
                    <h4 className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>重要限制</h4>
                    <ul className={`text-sm mt-2 space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        <li>• 结果长度不能超过 520 字节，否则脚本失败</li>
                        <li>• 只在 Tapscript 中可用，传统脚本仍然禁用</li>
                        <li>• 需要至少两个堆栈元素，否则脚本失败</li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
);

// --- Use Cases Section ---
const UseCasesSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                OP_CAT 的应用场景
            </h2>

            <div className="space-y-6">
                {/* Vault */}
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-emerald-900/50' : 'bg-emerald-100'}`}>
                            <Lock className="w-6 h-6 text-emerald-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Vault 保险库
                            </h3>
                            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                使用 OP_CAT 可以实现更简洁的 Vault，通过在脚本中验证交易结构来强制执行取款延迟。
                            </p>
                            <div className={`p-3 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-900 text-emerald-400' : 'bg-white text-emerald-700'}`}>
                                // 验证输出地址和时间锁<br/>
                                &lt;output_script_part1&gt; &lt;timelock&gt;<br/>
                                OP_CAT<br/>
                                &lt;expected_output&gt; OP_EQUAL
                            </div>
                        </div>
                    </div>
                </div>

                {/* 树签名 */}
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-blue-900/50' : 'bg-blue-100'}`}>
                            <GitBranch className="w-6 h-6 text-blue-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                树签名 (Tree Signatures)
                            </h3>
                            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                高效验证多重签名方案，将 log(n) 个签名验证压缩为一次验证。
                            </p>
                            <div className={`p-3 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-900 text-blue-400' : 'bg-white text-blue-700'}`}>
                                // 验证默克尔路径<br/>
                                &lt;leaf&gt; &lt;sibling1&gt; OP_CAT OP_SHA256<br/>
                                &lt;sibling2&gt; OP_CAT OP_SHA256<br/>
                                &lt;root&gt; OP_EQUALVERIFY
                            </div>
                        </div>
                    </div>
                </div>

                {/* STARK 验证 */}
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-purple-900/50' : 'bg-purple-100'}`}>
                            <Cpu className="w-6 h-6 text-purple-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                STARK 证明验证
                            </h3>
                            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                OP_CAT 是在比特币上验证 STARK 零知识证明的关键组件，可用于验证复杂的链下计算。
                            </p>
                            <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-700'}`}>
                                <Zap className="w-3 h-3" />
                                高级应用
                            </div>
                        </div>
                    </div>
                </div>

                {/* 比特币桥 */}
                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-orange-900/50' : 'bg-orange-100'}`}>
                            <Link2 className="w-6 h-6 text-orange-500" />
                        </div>
                        <div className="flex-1">
                            <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                去信任桥
                            </h3>
                            <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                通过验证其他链的区块头和默克尔证明，实现更去中心化的跨链桥。
                            </p>
                            <div className={`p-3 rounded font-mono text-xs ${isDarkMode ? 'bg-slate-900 text-orange-400' : 'bg-white text-orange-700'}`}>
                                // 验证其他链的交易包含证明<br/>
                                &lt;tx_hash&gt; &lt;merkle_path&gt;<br/>
                                // 使用 OP_CAT 重构根哈希
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* 更多可能性 */}
        <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                解锁的其他可能性
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Post-Quantum 签名</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        使用 Winternitz 或 Lamport 签名实现抗量子安全
                    </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>支付池</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        多方共享 UTXO，降低链上足迹
                    </p>
                </div>
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                    <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>非交互式通道</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        无需双方在线即可开启支付通道
                    </p>
                </div>
            </div>
        </div>
    </div>
);

// --- Simulator Section ---
const SimulatorSection: React.FC<{ isDarkMode: boolean }> = ({ isDarkMode }) => {
    const [stack, setStack] = useState<string[]>(['Hello', 'World']);
    const [input1, setInput1] = useState('Hello');
    const [input2, setInput2] = useState('World');
    const [result, setResult] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);

    const executeOpCat = () => {
        setError(null);
        setResult(null);

        if (stack.length < 2) {
            setError('错误：堆栈至少需要两个元素');
            return;
        }

        const b = stack[stack.length - 1];
        const a = stack[stack.length - 2];
        const concatenated = a + b;

        if (concatenated.length > 520) {
            setError(`错误：结果长度 ${concatenated.length} 超过 520 字节限制`);
            return;
        }

        const newStack = [...stack.slice(0, -2), concatenated];
        setStack(newStack);
        setResult(concatenated);
        setHistory([...history, `OP_CAT: "${a}" + "${b}" = "${concatenated}"`]);
    };

    const pushToStack = () => {
        if (input1.trim()) {
            setStack([...stack, input1.trim()]);
            setHistory([...history, `PUSH: "${input1.trim()}"`]);
            setInput1('');
        }
    };

    const reset = () => {
        setStack(['Hello', 'World']);
        setInput1('Hello');
        setInput2('World');
        setResult(null);
        setError(null);
        setHistory([]);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className={`rounded-xl p-6 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    OP_CAT 模拟器
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* 堆栈可视化 */}
                    <div>
                        <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            堆栈状态
                        </h3>
                        <div className={`p-4 rounded-xl min-h-[200px] ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            {stack.length === 0 ? (
                                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                    堆栈为空
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {[...stack].reverse().map((item, idx) => (
                                        <div
                                            key={idx}
                                            className={`p-3 rounded-lg font-mono text-sm flex justify-between items-center ${
                                                idx === 0
                                                    ? (isDarkMode ? 'bg-orange-900/30 border border-orange-500/50 text-orange-400' : 'bg-orange-100 border border-orange-300 text-orange-700')
                                                    : (isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700')
                                            }`}
                                        >
                                            <span>"{item}"</span>
                                            <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                {idx === 0 ? '栈顶' : `[${stack.length - 1 - idx}]`}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* 输入和操作 */}
                        <div className="mt-4 space-y-3">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input1}
                                    onChange={(e) => setInput1(e.target.value)}
                                    placeholder="输入数据"
                                    className={`flex-1 px-3 py-2 rounded-lg text-sm ${
                                        isDarkMode
                                            ? 'bg-slate-800 border border-slate-700 text-white'
                                            : 'bg-white border border-slate-200 text-slate-900'
                                    }`}
                                />
                                <button
                                    onClick={pushToStack}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                                >
                                    PUSH
                                </button>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={executeOpCat}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors"
                                >
                                    <Play className="w-4 h-4" />
                                    OP_CAT
                                </button>
                                <button
                                    onClick={reset}
                                    className={`px-4 py-2 rounded-lg transition-colors ${
                                        isDarkMode
                                            ? 'bg-slate-700 hover:bg-slate-600 text-white'
                                            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                                    }`}
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 执行历史和结果 */}
                    <div>
                        <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            执行结果
                        </h3>

                        {/* 错误显示 */}
                        {error && (
                            <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-red-900/20 border border-red-500/30' : 'bg-red-50 border border-red-200'}`}>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <span className={`font-medium ${isDarkMode ? 'text-red-400' : 'text-red-700'}`}>
                                        {error}
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* 成功结果 */}
                        {result && !error && (
                            <div className={`p-4 rounded-lg mb-4 ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Check className="w-5 h-5 text-emerald-500" />
                                    <span className={`font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                        拼接成功
                                    </span>
                                </div>
                                <div className={`font-mono text-sm p-2 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                    结果: "{result}"
                                </div>
                                <div className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    长度: {result.length} 字节
                                </div>
                            </div>
                        )}

                        {/* 执行历史 */}
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <h4 className={`font-medium mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                执行历史
                            </h4>
                            <div className="space-y-1 max-h-[200px] overflow-y-auto">
                                {history.length === 0 ? (
                                    <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                        暂无操作
                                    </div>
                                ) : (
                                    history.map((h, idx) => (
                                        <div
                                            key={idx}
                                            className={`text-xs font-mono py-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}
                                        >
                                            {idx + 1}. {h}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 使用说明 */}
            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-900/20 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>
                    操作说明
                </h3>
                <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                    <li>1. 使用 PUSH 按钮将数据推入堆栈</li>
                    <li>2. 点击 OP_CAT 执行拼接操作（需要至少两个元素）</li>
                    <li>3. 观察堆栈状态变化和执行结果</li>
                    <li>4. 尝试创建超过 520 字节的结果，观察错误处理</li>
                </ul>
            </div>
        </div>
    );
};

export default OpCatDemo;
