import React, { useState } from 'react';
import { Code, Shield, CheckCircle, XCircle, Zap, Lock, ArrowRight, FileCode, GitBranch, AlertTriangle, Layers, Play, RefreshCw } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const MiniscriptDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    // Interactive compiler state
    const [policyInput, setPolicyInput] = useState('and(pk(A),or(pk(B),after(1000)))');
    const [compiledScript, setCompiledScript] = useState('');
    const [scriptAnalysis, setScriptAnalysis] = useState<{
        type: string;
        witnesses: string[];
        maxWitnessSize: number;
        conditions: string[];
    } | null>(null);

    const [selectedExample, setSelectedExample] = useState(0);

    const examples = [
        {
            name: '简单 2-of-2',
            policy: 'and(pk(Alice),pk(Bob))',
            desc: 'Alice 和 Bob 都必须签名',
            miniscript: 'and_v(v:pk(Alice),pk(Bob))',
            script: 'OP_DUP OP_HASH160 <Alice_hash> OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_DUP OP_HASH160 <Bob_hash> OP_EQUALVERIFY OP_CHECKSIG'
        },
        {
            name: '时间锁备份',
            policy: 'or(pk(Alice),and(pk(Bob),after(1000)))',
            desc: 'Alice 可随时花费，或 Bob 在 1000 区块后',
            miniscript: 'or_d(pk(Alice),and_v(v:pk(Bob),after(1000)))',
            script: 'OP_DUP OP_HASH160 <Alice_hash> OP_EQUALVERIFY OP_CHECKSIG OP_IFDUP OP_NOTIF <1000> OP_CHECKLOCKTIMEVERIFY OP_DROP OP_DUP OP_HASH160 <Bob_hash> OP_EQUALVERIFY OP_CHECKSIG OP_ENDIF'
        },
        {
            name: '2-of-3 门限',
            policy: 'thresh(2,pk(A),pk(B),pk(C))',
            desc: '任意两人签名即可',
            miniscript: 'thresh(2,pk(A),s:pk(B),s:pk(C))',
            script: 'OP_DUP OP_HASH160 <A_hash> OP_EQUALVERIFY OP_CHECKSIG OP_SWAP OP_DUP OP_HASH160 <B_hash> OP_EQUALVERIFY OP_CHECKSIG OP_ADD OP_SWAP OP_DUP OP_HASH160 <C_hash> OP_EQUALVERIFY OP_CHECKSIG OP_ADD 2 OP_EQUAL'
        },
        {
            name: '哈希锁定',
            policy: 'and(pk(Alice),sha256(H))',
            desc: 'Alice 签名 + 提供原像',
            miniscript: 'and_v(v:pk(Alice),sha256(H))',
            script: 'OP_DUP OP_HASH160 <Alice_hash> OP_EQUALVERIFY OP_CHECKSIGVERIFY OP_SHA256 <H> OP_EQUAL'
        },
        {
            name: '复杂保险柜',
            policy: 'or(and(pk(Hot),sha256(H)),and(pk(Cold),after(144)))',
            desc: '热钱包+密码 或 冷钱包+时间锁',
            miniscript: 'or_d(and_v(v:pk(Hot),sha256(H)),and_v(v:pk(Cold),after(144)))',
            script: '...(complex script)...'
        },
    ];

    const compilePolicy = () => {
        const example = examples.find(e => e.policy === policyInput);
        if (example) {
            setCompiledScript(example.miniscript);
            setScriptAnalysis({
                type: example.name,
                witnesses: ['signature', 'pubkey'],
                maxWitnessSize: 73,
                conditions: example.desc.split('，')
            });
        } else {
            setCompiledScript('custom_miniscript(' + policyInput + ')');
            setScriptAnalysis({
                type: '自定义策略',
                witnesses: ['...'],
                maxWitnessSize: 0,
                conditions: ['自定义条件']
            });
        }
    };

    const tabs = [
        { id: 'intro', label: '概念介绍' },
        { id: 'syntax', label: '语法详解' },
        { id: 'compiler', label: '策略编译器' },
        { id: 'analysis', label: '脚本分析' },
        { id: 'applications', label: '实际应用' },
        { id: 'quiz', label: '知识测验' },
    ];

    const quizData = getQuizByModule('miniscript');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Code className="w-4 h-4" />
                        智能合约
                    </div>
                    <h1 className="text-4xl font-bold mb-4">Miniscript 策略脚本</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
                        Miniscript 是一种结构化的比特币脚本编写语言，让复杂的花费条件变得可组合、可分析、可验证
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                activeTab === tab.id
                                    ? 'bg-cyan-500 text-white'
                                    : isDarkMode
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={`rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6`}>
                    {activeTab === 'intro' && (
                        <div className="space-y-8">
                            {/* What is Miniscript */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <FileCode className="w-5 h-5 text-cyan-400" />
                                        什么是 Miniscript？
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed mb-4`}>
                                        Miniscript 由 Pieter Wuille、Andrew Poelstra 等人开发，是比特币脚本的一个子集，
                                        提供了一种<strong>结构化的方式</strong>来表达花费条件。
                                    </p>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                                        它不是新的脚本语言，而是现有比特币脚本的一种<strong>可分析表示</strong>，
                                        让钱包软件能够自动推理脚本的属性。
                                    </p>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Layers className="w-5 h-5 text-amber-400" />
                                        三层抽象
                                    </h3>
                                    <div className="space-y-4">
                                        {[
                                            { name: 'Policy (策略)', desc: '高层次的花费条件描述', color: 'emerald', example: 'or(pk(A),and(pk(B),after(100)))' },
                                            { name: 'Miniscript', desc: '结构化的中间表示', color: 'cyan', example: 'or_d(pk(A),and_v(v:pk(B),after(100)))' },
                                            { name: 'Bitcoin Script', desc: '实际执行的脚本', color: 'amber', example: 'OP_DUP OP_HASH160 ...' },
                                        ].map((layer, i) => (
                                            <div key={i} className={`p-3 rounded-lg border-l-4 border-${layer.color}-500 ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                <div className={`font-bold text-${layer.color}-400`}>{layer.name}</div>
                                                <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{layer.desc}</div>
                                                <code className="text-xs text-slate-500 block mt-1">{layer.example}</code>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Problems Solved */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">解决的问题</h3>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            problem: '脚本不可读',
                                            solution: 'Miniscript 提供人类可读的语义',
                                            icon: Code,
                                            color: 'rose'
                                        },
                                        {
                                            problem: '难以分析',
                                            solution: '自动推导见证大小、花费条件',
                                            icon: GitBranch,
                                            color: 'amber'
                                        },
                                        {
                                            problem: '不可组合',
                                            solution: '模块化组件可任意组合',
                                            icon: Layers,
                                            color: 'emerald'
                                        },
                                    ].map((item, i) => (
                                        <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className={`w-10 h-10 rounded-lg bg-${item.color}-500/20 flex items-center justify-center`}>
                                                    <item.icon className={`w-5 h-5 text-${item.color}-400`} />
                                                </div>
                                            </div>
                                            <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                                                <XCircle className="w-4 h-4 inline text-rose-400 mr-1" />
                                                {item.problem}
                                            </div>
                                            <div className={`text-sm font-medium`}>
                                                <CheckCircle className="w-4 h-4 inline text-emerald-400 mr-1" />
                                                {item.solution}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Key Features */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20' : 'bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200'}`}>
                                <h3 className="text-xl font-bold mb-4">核心特性</h3>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { title: '可分析性', desc: '自动计算最大见证大小、所有可能的花费路径' },
                                        { title: '可组合性', desc: '基本片段可以任意嵌套组合' },
                                        { title: '可验证性', desc: '钱包可以验证脚本是否符合预期策略' },
                                        { title: '可签名性', desc: '确定满足脚本所需的签名和数据' },
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <CheckCircle className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                                            <div>
                                                <span className="font-bold">{item.title}</span>
                                                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'syntax' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">Miniscript 语法详解</h3>

                            {/* Policy Language */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4 text-emerald-400">Policy 语言 (高层)</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>
                                                <th className="px-4 py-2 text-left">表达式</th>
                                                <th className="px-4 py-2 text-left">含义</th>
                                                <th className="px-4 py-2 text-left">示例</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                                            {[
                                                { expr: 'pk(KEY)', mean: '需要 KEY 的签名', example: 'pk(Alice)' },
                                                { expr: 'and(X,Y)', mean: 'X 和 Y 都必须满足', example: 'and(pk(A),pk(B))' },
                                                { expr: 'or(X,Y)', mean: 'X 或 Y 满足其一', example: 'or(pk(A),pk(B))' },
                                                { expr: 'thresh(k,X,Y,...)', mean: '至少 k 个满足', example: 'thresh(2,pk(A),pk(B),pk(C))' },
                                                { expr: 'after(N)', mean: '区块高度 >= N', example: 'after(100000)' },
                                                { expr: 'older(N)', mean: '输入年龄 >= N', example: 'older(144)' },
                                                { expr: 'sha256(H)', mean: 'SHA256 原像', example: 'sha256(abcd...)' },
                                                { expr: 'hash256(H)', mean: '双重 SHA256 原像', example: 'hash256(efgh...)' },
                                            ].map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 font-mono text-cyan-400">{row.expr}</td>
                                                    <td className="px-4 py-2">{row.mean}</td>
                                                    <td className="px-4 py-2 font-mono text-slate-500">{row.example}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            {/* Miniscript Fragments */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4 text-cyan-400">Miniscript 片段 (中层)</h4>
                                <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    Miniscript 使用类型系统确保脚本的正确性。每个片段有特定的输入输出类型。
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        { name: 'pk(KEY)', type: 'B', desc: '基本公钥检查' },
                                        { name: 'and_v(X,Y)', type: 'V,B→B', desc: 'X 验证后执行 Y' },
                                        { name: 'or_d(X,Y)', type: 'B,B→B', desc: 'X 失败则尝试 Y' },
                                        { name: 'or_c(X,Y)', type: 'B,V→B', desc: 'X 成功则跳过 Y' },
                                        { name: 'thresh(k,...)', type: 'B*→B', desc: 'k-of-n 门限' },
                                        { name: 'after(N)', type: '→B', desc: '绝对时间锁' },
                                    ].map((frag, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            <div className="flex items-center justify-between mb-1">
                                                <code className="text-cyan-400">{frag.name}</code>
                                                <span className={`text-xs px-2 py-0.5 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}>
                                                    {frag.type}
                                                </span>
                                            </div>
                                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{frag.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Type System */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
                                    <AlertTriangle className="w-5 h-5" />
                                    类型系统
                                </h4>
                                <div className="grid md:grid-cols-4 gap-4 text-sm">
                                    {[
                                        { type: 'B', name: 'Base', desc: '基本表达式，消耗并产生栈元素' },
                                        { type: 'V', name: 'Verify', desc: '验证表达式，失败则终止' },
                                        { type: 'K', name: 'Key', desc: '将公钥放到栈上' },
                                        { type: 'W', name: 'Wrapped', desc: '包装表达式，用于嵌套' },
                                    ].map((t, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            <div className="font-mono text-2xl text-amber-400 mb-1">{t.type}</div>
                                            <div className="font-bold text-sm">{t.name}</div>
                                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{t.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'compiler' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold mb-6">策略编译器</h3>

                            {/* Example Selector */}
                            <div className="flex flex-wrap gap-2 mb-4">
                                {examples.map((ex, i) => (
                                    <button
                                        key={i}
                                        onClick={() => {
                                            setSelectedExample(i);
                                            setPolicyInput(ex.policy);
                                            setCompiledScript('');
                                            setScriptAnalysis(null);
                                        }}
                                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                                            selectedExample === i
                                                ? 'bg-cyan-500 text-white'
                                                : isDarkMode
                                                    ? 'bg-slate-800 hover:bg-slate-700'
                                                    : 'bg-slate-200 hover:bg-slate-300'
                                        }`}
                                    >
                                        {ex.name}
                                    </button>
                                ))}
                            </div>

                            {/* Input */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <label className="block font-bold mb-2">Policy 输入</label>
                                <textarea
                                    value={policyInput}
                                    onChange={(e) => setPolicyInput(e.target.value)}
                                    className={`w-full h-24 px-4 py-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border`}
                                    placeholder="输入 Policy 表达式..."
                                />
                                <p className={`mt-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {examples[selectedExample]?.desc}
                                </p>
                            </div>

                            {/* Compile Button */}
                            <button
                                onClick={compilePolicy}
                                className="w-full py-4 rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white font-bold flex items-center justify-center gap-2"
                            >
                                <Play className="w-5 h-5" />
                                编译为 Miniscript
                            </button>

                            {/* Output */}
                            {compiledScript && (
                                <div className="space-y-4">
                                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <label className="block font-bold mb-2 text-cyan-400">Miniscript 输出</label>
                                        <code className={`block p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            {compiledScript}
                                        </code>
                                    </div>

                                    <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <label className="block font-bold mb-2 text-amber-400">Bitcoin Script</label>
                                        <code className={`block p-4 rounded-lg font-mono text-xs overflow-x-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            {examples[selectedExample]?.script}
                                        </code>
                                    </div>

                                    {scriptAnalysis && (
                                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-900/30 to-emerald-900/30 border border-cyan-500/20' : 'bg-gradient-to-r from-cyan-100 to-emerald-100 border border-cyan-200'}`}>
                                            <label className="block font-bold mb-4 text-emerald-400">脚本分析</label>
                                            <div className="grid md:grid-cols-3 gap-4">
                                                <div>
                                                    <span className="text-sm text-slate-500">类型</span>
                                                    <div className="font-bold">{scriptAnalysis.type}</div>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-slate-500">最大见证大小</span>
                                                    <div className="font-bold">{scriptAnalysis.maxWitnessSize || '~73'} bytes</div>
                                                </div>
                                                <div>
                                                    <span className="text-sm text-slate-500">需要的数据</span>
                                                    <div className="font-bold">{scriptAnalysis.witnesses.join(', ')}</div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'analysis' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">脚本分析能力</h3>

                            {/* What Can Be Analyzed */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                                        可分析内容
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            '所有可能的花费路径',
                                            '每条路径需要的签名和数据',
                                            '最大和最小见证大小',
                                            '时间锁要求',
                                            '脚本是否格式正确',
                                            '费用估算',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h4 className="font-bold mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5 text-amber-400" />
                                        实际应用
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            '钱包自动选择最优花费路径',
                                            '准确预估交易费用',
                                            '验证收到的脚本是否安全',
                                            '生成签名请求',
                                            '多方协作签名',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-amber-400"></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Spending Path Analysis */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-900/30 to-purple-900/30 border border-cyan-500/20' : 'bg-gradient-to-r from-cyan-100 to-purple-100 border border-cyan-200'}`}>
                                <h4 className="font-bold mb-4">花费路径分析示例</h4>
                                <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    策略: <code className="text-cyan-400">or(pk(Alice),and(pk(Bob),after(1000)))</code>
                                </p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-400">路径 1</span>
                                            <span className="font-bold">Alice 签名</span>
                                        </div>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <li>需要: Alice 的签名</li>
                                            <li>时间锁: 无</li>
                                            <li>见证大小: ~73 bytes</li>
                                        </ul>
                                    </div>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="px-2 py-0.5 rounded text-xs bg-amber-500/20 text-amber-400">路径 2</span>
                                            <span className="font-bold">Bob + 时间锁</span>
                                        </div>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <li>需要: Bob 的签名</li>
                                            <li>时间锁: 区块 1000 后</li>
                                            <li>见证大小: ~73 bytes</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Witness Size Estimation */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4">见证大小估算</h4>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={isDarkMode ? 'bg-slate-900' : 'bg-white'}>
                                                <th className="px-4 py-2 text-left">元素</th>
                                                <th className="px-4 py-2 text-left">大小</th>
                                                <th className="px-4 py-2 text-left">说明</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                                            {[
                                                { elem: 'ECDSA 签名', size: '72-73 bytes', note: '低 r 值可减少' },
                                                { elem: 'Schnorr 签名', size: '64 bytes', note: '固定大小' },
                                                { elem: '压缩公钥', size: '33 bytes', note: '02/03 前缀' },
                                                { elem: 'x-only 公钥', size: '32 bytes', note: 'Taproot 使用' },
                                                { elem: 'SHA256 原像', size: '32 bytes', note: '256 位' },
                                            ].map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-2 font-mono text-cyan-400">{row.elem}</td>
                                                    <td className="px-4 py-2">{row.size}</td>
                                                    <td className={`px-4 py-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{row.note}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">实际应用</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {[
                                    {
                                        title: 'Bitcoin Core',
                                        icon: Shield,
                                        color: 'amber',
                                        desc: 'Bitcoin Core 钱包使用 Miniscript 进行描述符推理',
                                        features: ['输出描述符', '地址导入', '签名协调']
                                    },
                                    {
                                        title: 'Liana Wallet',
                                        icon: Lock,
                                        color: 'emerald',
                                        desc: '专门为 Miniscript 设计的钱包，支持复杂策略',
                                        features: ['时间锁恢复', '多签管理', '策略可视化']
                                    },
                                    {
                                        title: 'Lightning Network',
                                        icon: Zap,
                                        color: 'amber',
                                        desc: '闪电网络通道使用复杂的 Miniscript 脚本',
                                        features: ['HTLC 条件', '撤销机制', '强制关闭']
                                    },
                                    {
                                        title: 'DLC (离散日志合约)',
                                        icon: FileCode,
                                        color: 'violet',
                                        desc: '预言机合约使用 Miniscript 定义结算条件',
                                        features: ['条件支付', '预言机签名', '超时退款']
                                    },
                                ].map((app, i) => (
                                    <div key={i} className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className={`w-12 h-12 rounded-xl bg-${app.color}-500/20 text-${app.color}-400 flex items-center justify-center mb-4`}>
                                            <app.icon className="w-6 h-6" />
                                        </div>
                                        <h4 className="text-lg font-bold mb-2">{app.title}</h4>
                                        <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{app.desc}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {app.features.map((f, j) => (
                                                <span key={j} className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}>
                                                    {f}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Output Descriptors */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/20' : 'bg-gradient-to-r from-cyan-100 to-blue-100 border border-cyan-200'}`}>
                                <h4 className="font-bold mb-4">输出描述符 (Output Descriptors)</h4>
                                <p className={`mb-4 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                    Miniscript 与输出描述符结合使用，提供完整的钱包导入/导出能力：
                                </p>
                                <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'} overflow-x-auto`}>
                                    <div className="text-slate-500 mb-2"># P2WSH 多签描述符</div>
                                    <div className="text-cyan-400">
                                        wsh(and_v(v:pk([fingerprint/84'/0'/0']xpub.../0/*),pk([fingerprint2/84'/0'/0']xpub2.../0/*)))
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
                                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                    测验数据加载中...
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MiniscriptDemo;
