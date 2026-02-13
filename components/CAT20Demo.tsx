import React, { useState } from 'react';
import { Cat, Hash, ArrowRight, Info, AlertTriangle, Layers, Code, Search, Check, Copy, Zap, Box, Settings, Send, Coins, Database, Play, RefreshCw, Shield, Link2 } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { cat20Quiz } from '../data/quizData';

type TabType = 'intro' | 'opcat' | 'protocol' | 'comparison' | 'simulator' | 'quiz';

const CAT20Demo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    // CAT20 模拟器状态
    const [tokenName, setTokenName] = useState<string>('CAT');
    const [tokenSymbol, setTokenSymbol] = useState<string>('CAT');
    const [maxSupply, setMaxSupply] = useState<number>(21000000);
    const [mintLimit, setMintLimit] = useState<number>(5);
    const [premine, setPremine] = useState<number>(0);
    const [copied, setCopied] = useState(false);

    // 模拟部署状态
    const [isDeploying, setIsDeploying] = useState(false);
    const [deployStep, setDeployStep] = useState<number>(0);

    // 模拟 CAT20 Token ID
    const generateTokenId = (name: string) => {
        const hash = name.split('').reduce((a, b) => {
            a = ((a << 5) - a) + b.charCodeAt(0);
            return a & a;
        }, 0);
        return `${Math.abs(hash).toString(16).padStart(64, '0')}_0`;
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // 模拟部署过程
    const simulateDeploy = () => {
        setIsDeploying(true);
        setDeployStep(0);

        const steps = [1, 2, 3, 4, 5];
        steps.forEach((step, index) => {
            setTimeout(() => {
                setDeployStep(step);
                if (step === 5) {
                    setIsDeploying(false);
                }
            }, (index + 1) * 1200);
        });
    };

    const tabs = [
        { id: 'intro', label: '简介', icon: Info },
        { id: 'opcat', label: 'OP_CAT 基础', icon: Link2 },
        { id: 'protocol', label: 'CAT20 机制', icon: Code },
        { id: 'comparison', label: '方案对比', icon: Layers },
        { id: 'simulator', label: 'CAT20 模拟器', icon: Search },
        { id: 'quiz', label: '测验', icon: Check },
    ];

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            {/* Header */}
            <div className={`${isDarkMode ? 'bg-gradient-to-r from-cyan-900/30 via-teal-900/20 to-emerald-900/30' : 'bg-gradient-to-r from-cyan-100 via-teal-50 to-emerald-100'} py-12 px-6`}>
                <div className="max-w-6xl mx-auto">
                    <div className="flex items-center gap-4 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-500/10'}`}>
                            <Cat className="w-8 h-8 text-cyan-500" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">CAT20 代币协议</h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                基于 OP_CAT 的 Fractal Bitcoin 代币标准
                            </p>
                        </div>
                    </div>

                    {/* Desktop Tabs */}
                    <div className="hidden md:flex flex-wrap gap-2 mt-8">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as TabType)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-cyan-500 text-white'
                                        : isDarkMode
                                            ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                            : 'bg-white text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Tabs */}
                    <div className={`md:hidden mt-6 border-t pt-4 ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <div className="grid grid-cols-3 gap-1.5">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`flex flex-col items-center justify-center p-2 rounded-lg text-[10px] font-medium transition-all min-h-[52px] ${
                                        activeTab === tab.id
                                            ? 'bg-cyan-500 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-800 text-slate-300'
                                                : 'bg-white text-slate-600 border border-slate-200'
                                    }`}
                                >
                                    <tab.icon className={`w-4 h-4 mb-0.5 ${activeTab === tab.id ? '' : 'opacity-70'}`} />
                                    <span className="leading-tight text-center">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-8">
                {/* 简介 */}
                {activeTab === 'intro' && (
                    <div className="space-y-8">
                        {/* 核心概念 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Cat className="w-5 h-5 text-cyan-500" />
                                什么是 CAT20？
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                CAT20 是在 Fractal Bitcoin 上运行的代币协议，利用已激活的 OP_CAT 操作码实现智能合约功能。
                                Fractal Bitcoin 是比特币的分形扩展层，与比特币主网共享安全性，但拥有更快的出块时间和更多的脚本功能。
                            </p>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center mb-3">
                                        <Link2 className="w-5 h-5 text-cyan-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">OP_CAT 驱动</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        利用 OP_CAT 实现数据拼接和状态验证
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-teal-500/20 flex items-center justify-center mb-3">
                                        <Shield className="w-5 h-5 text-teal-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">链上验证</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        代币规则直接由脚本验证，无需信任索引器
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center mb-3">
                                        <Zap className="w-5 h-5 text-emerald-400" />
                                    </div>
                                    <h3 className="font-bold mb-2">Fractal Bitcoin</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        比特币分形扩展层，30秒出块
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Fractal Bitcoin */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Box className="w-5 h-5 text-cyan-500" />
                                Fractal Bitcoin 简介
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                Fractal Bitcoin 是一个递归扩展比特币的解决方案，由 UniSat 团队开发。
                                它在保持与比特币核心代码兼容的同时，启用了更多操作码（如 OP_CAT）并加快了出块速度。
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-cyan-400 mb-3">核心特性</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 与比特币核心代码 100% 兼容</li>
                                        <li>• 30 秒出块时间（vs BTC 10分钟）</li>
                                        <li>• 启用 OP_CAT 等操作码</li>
                                        <li>• 使用 FB（Fractal Bitcoin）作为原生代币</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-teal-400 mb-3">与 BTC 主网的关系</h3>
                                    <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• 可通过桥接资产跨链</li>
                                        <li>• 联合挖矿共享安全性</li>
                                        <li>• 作为比特币的实验层</li>
                                        <li>• 支持相同的钱包和工具</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 发展历程 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">发展历程</h2>
                            <div className="space-y-4">
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                            <span className="text-cyan-400 font-bold text-sm">1</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-cyan-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2024年9月 - Fractal Bitcoin 主网上线</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            Fractal Bitcoin 主网启动，OP_CAT 操作码被激活
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center">
                                            <span className="text-teal-400 font-bold text-sm">2</span>
                                        </div>
                                        <div className="flex-1 w-0.5 bg-teal-500/20 my-2"></div>
                                    </div>
                                    <div className="pb-6">
                                        <h3 className="font-bold">2024年9月 - CAT 协议发布</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            基于 OP_CAT 的 CAT 协议发布，支持 CAT20 和 CAT721
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="flex flex-col items-center">
                                        <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                            <span className="text-emerald-400 font-bold text-sm">3</span>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="font-bold">2024年至今 - 生态发展</h3>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            CAT20 代币生态快速发展，成为 Fractal 主要代币标准
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* OP_CAT 基础 */}
                {activeTab === 'opcat' && (
                    <div className="space-y-8">
                        {/* OP_CAT 介绍 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Link2 className="w-5 h-5 text-cyan-500" />
                                OP_CAT 操作码
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                OP_CAT（Concatenate）是一个将两个堆栈元素拼接在一起的操作码。
                                虽然功能简单，但它能解锁许多高级脚本功能，是实现链上智能合约的关键。
                            </p>

                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`OP_CAT 操作：

堆栈状态：
  栈顶 → [element2]
         [element1]

执行 OP_CAT 后：
  栈顶 → [element1 || element2]

示例：
  [0x1234] [0x5678] OP_CAT
  → [0x12345678]`}
                                </pre>
                            </div>
                        </div>

                        {/* OP_CAT 的能力 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">OP_CAT 解锁的能力</h2>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg border-l-4 border-cyan-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-cyan-400 mb-2">状态承诺验证</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        通过拼接数据并验证哈希，实现链上状态的完整性检查
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-teal-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-teal-400 mb-2">默克尔证明</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        构建和验证默克尔路径，实现高效的数据验证
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-emerald-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-emerald-400 mb-2">Covenant 合约</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        约束交易输出的格式和目标，实现复杂的花费条件
                                    </p>
                                </div>
                                <div className={`p-4 rounded-lg border-l-4 border-green-500 ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">动态脚本生成</h3>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        在运行时构建脚本片段，实现更灵活的合约逻辑
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CAT Protocol 如何使用 OP_CAT */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">CAT Protocol 如何使用 OP_CAT</h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                CAT Protocol 利用 OP_CAT 实现代币状态的链上验证：
                            </p>

                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`CAT20 状态验证流程：

1. 构建状态承诺
   state = CAT(token_id, owner, amount)
   commitment = HASH256(state)

2. 转账时验证
   - 输入状态：CAT(token_id, sender, input_amount)
   - 输出状态：CAT(token_id, receiver, output_amount)
   - 验证：input_amount >= output_amount

3. 脚本验证
   <sig> <pubkey> <new_state>
   OP_DUP OP_HASH256 <expected_commitment> OP_EQUALVERIFY
   OP_CAT OP_HASH256 <next_commitment> OP_EQUAL`}
                                </pre>
                            </div>

                            <div className={`mt-4 p-4 rounded-lg ${isDarkMode ? 'bg-cyan-500/10 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
                                <div className="flex gap-2">
                                    <Info className="w-5 h-5 text-cyan-500 shrink-0 mt-0.5" />
                                    <p className={`text-sm ${isDarkMode ? 'text-cyan-200' : 'text-cyan-800'}`}>
                                        OP_CAT 让脚本能够验证复杂的状态转换，而无需依赖链下索引器。
                                        所有代币规则都由比特币脚本本身强制执行。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CAT20 机制 */}
                {activeTab === 'protocol' && (
                    <div className="space-y-8">
                        {/* 代币结构 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Code className="w-5 h-5 text-cyan-500" />
                                CAT20 代币结构
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                CAT20 代币由智能合约管理，使用 UTXO 模型存储代币状态。
                            </p>

                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`CAT20 Token UTXO:

Output Script (P2TR):
├── Internal Key: Token Contract Pubkey
└── Script Path:
    ├── Transfer Script (转账逻辑)
    ├── Mint Script (铸造逻辑)
    └── Burn Script (销毁逻辑)

Token State (存储在 Witness):
{
  "tokenId": "abc123...",
  "owner": "bc1p...",
  "amount": 1000,
  "lockedUntil": 0
}`}
                                </pre>
                            </div>
                        </div>

                        {/* 部署流程 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Settings className="w-5 h-5 text-cyan-500" />
                                代币部署参数
                            </h2>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <pre className="overflow-x-auto">
{`{
  "name": "Example Token",      // 代币名称
  "symbol": "EXT",              // 代币符号
  "max": 21000000,              // 最大供应量
  "limit": 5,                   // 每次铸造限制
  "premine": 0,                 // 预挖数量
  "decimals": 8,                // 小数位数

  // 可选参数
  "mintHeight": {
    "start": 100000,            // 开始铸造区块
    "end": null                 // 结束铸造区块
  },
  "metadata": {
    "description": "...",
    "website": "...",
    "logo": "..."
  }
}`}
                                </pre>
                            </div>
                        </div>

                        {/* 铸造与转账 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Coins className="w-5 h-5 text-cyan-500" />
                                铸造与转账
                            </h2>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <h3 className="font-bold mb-4 text-cyan-400">铸造 (Mint)</h3>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <li>1. 调用合约的 mint 方法</li>
                                            <li>2. 验证铸造数量不超过 limit</li>
                                            <li>3. 验证总供应量不超过 max</li>
                                            <li>4. 创建新的代币 UTXO</li>
                                            <li>5. 更新合约状态</li>
                                        </ul>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-bold mb-4 text-teal-400">转账 (Transfer)</h3>
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <ul className={`text-sm space-y-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            <li>1. 花费包含代币的 UTXO</li>
                                            <li>2. 提供有效签名</li>
                                            <li>3. 验证输出金额 ≤ 输入金额</li>
                                            <li>4. 创建新的代币 UTXO</li>
                                            <li>5. 多余代币可找零</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 合约验证 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Shield className="w-5 h-5 text-cyan-500" />
                                链上验证机制
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                CAT20 的核心优势是所有规则都由比特币脚本验证：
                            </p>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                    <h3 className="font-bold text-green-400 mb-2">脚本验证的规则</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                        <li>✓ 代币总量不超过最大供应</li>
                                        <li>✓ 每次铸造不超过限制</li>
                                        <li>✓ 转账金额不超过余额</li>
                                        <li>✓ 只有所有者能花费代币</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-slate-400 mb-2">与其他方案的区别</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• BRC-20/Runes: 索引器验证</li>
                                        <li>• ARC20: UTXO 结构验证</li>
                                        <li>• CAT20: 脚本逻辑验证</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* 注意事项 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <AlertTriangle className="w-5 h-5 text-orange-500" />
                                注意事项
                            </h2>
                            <div className="space-y-3">
                                <div className="flex gap-2">
                                    <span className="text-orange-400">•</span>
                                    <p className={`text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                                        <strong>仅限 Fractal Bitcoin：</strong>CAT20 目前只能在 Fractal Bitcoin 上使用，因为比特币主网尚未激活 OP_CAT
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-orange-400">•</span>
                                    <p className={`text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                                        <strong>Gas 费用：</strong>复杂的脚本验证需要更多的见证数据，可能增加交易费用
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <span className="text-orange-400">•</span>
                                    <p className={`text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                                        <strong>钱包支持：</strong>需要使用支持 CAT Protocol 的钱包来管理代币
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* 方案对比 */}
                {activeTab === 'comparison' && (
                    <div className="space-y-8">
                        {/* 对比表格 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">比特币代币方案对比</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead>
                                        <tr className={isDarkMode ? 'border-b border-slate-700' : 'border-b border-slate-200'}>
                                            <th className="text-left py-3 px-4">特性</th>
                                            <th className="text-left py-3 px-4">CAT20</th>
                                            <th className="text-left py-3 px-4">Runes</th>
                                            <th className="text-left py-3 px-4">ARC20</th>
                                        </tr>
                                    </thead>
                                    <tbody className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">运行网络</td>
                                            <td className="py-3 px-4">
                                                <span className="text-cyan-400">Fractal Bitcoin</span>
                                            </td>
                                            <td className="py-3 px-4">Bitcoin 主网</td>
                                            <td className="py-3 px-4">Bitcoin 主网</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">验证方式</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">脚本验证</span>
                                            </td>
                                            <td className="py-3 px-4">索引器验证</td>
                                            <td className="py-3 px-4">UTXO 结构</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">核心技术</td>
                                            <td className="py-3 px-4">
                                                <span className="text-cyan-400">OP_CAT</span>
                                            </td>
                                            <td className="py-3 px-4">OP_RETURN</td>
                                            <td className="py-3 px-4">Taproot Witness</td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">智能合约</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">支持</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">有限</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">不支持</span>
                                            </td>
                                        </tr>
                                        <tr className={isDarkMode ? 'border-b border-slate-800' : 'border-b border-slate-100'}>
                                            <td className="py-3 px-4 font-medium">出块速度</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">30 秒</span>
                                            </td>
                                            <td className="py-3 px-4">10 分钟</td>
                                            <td className="py-3 px-4">10 分钟</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 px-4 font-medium">需要索引器</td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">仅查询</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-orange-400">验证必须</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="text-green-400">仅查询</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* 优劣势 */}
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                <h3 className="font-bold text-green-400 mb-4">CAT20 优势</h3>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-green-200' : 'text-green-800'}`}>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>真正的链上智能合约验证</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>无需信任第三方索引器</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>快速确认（30秒出块）</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <Check className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>可扩展的合约逻辑</span>
                                    </li>
                                </ul>
                            </div>
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-orange-500/10 border border-orange-500/20' : 'bg-orange-50 border border-orange-200'}`}>
                                <h3 className="font-bold text-orange-400 mb-4">CAT20 劣势</h3>
                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-orange-200' : 'text-orange-800'}`}>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>不在比特币主网上运行</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>Fractal 安全性低于 BTC</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>脚本复杂度增加费用</span>
                                    </li>
                                    <li className="flex gap-2">
                                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                        <span>生态相对较新</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        {/* 生态系统 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4">CAT20 生态系统</h2>
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-cyan-400 mb-3">钱包支持</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• UniSat Wallet</li>
                                        <li>• OKX Wallet</li>
                                        <li>• Wizz Wallet</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-teal-400 mb-3">交易市场</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• UniSat Marketplace</li>
                                        <li>• CAT Market</li>
                                        <li>• Fractal DEX</li>
                                    </ul>
                                </div>
                                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h3 className="font-bold text-emerald-400 mb-3">开发工具</h3>
                                    <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        <li>• CAT Protocol SDK</li>
                                        <li>• Fractal Explorer</li>
                                        <li>• cat-cli</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* CAT20 模拟器 */}
                {activeTab === 'simulator' && (
                    <div className="space-y-8">
                        {/* 部署模拟器 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <Cat className="w-5 h-5 text-cyan-500" />
                                CAT20 代币部署模拟器
                            </h2>
                            <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>
                                配置代币参数，模拟在 Fractal Bitcoin 上部署 CAT20 代币：
                            </p>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            代币名称
                                        </label>
                                        <input
                                            type="text"
                                            value={tokenName}
                                            onChange={(e) => setTokenName(e.target.value)}
                                            className={`w-full px-4 py-3 rounded-lg ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                                            placeholder="My Token"
                                        />
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            代币符号
                                        </label>
                                        <input
                                            type="text"
                                            value={tokenSymbol}
                                            onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                                            className={`w-full px-4 py-3 rounded-lg font-mono ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                                            placeholder="CAT"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                最大供应量
                                            </label>
                                            <input
                                                type="number"
                                                value={maxSupply}
                                                onChange={(e) => setMaxSupply(parseInt(e.target.value) || 0)}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                                            />
                                        </div>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                铸造限制
                                            </label>
                                            <input
                                                type="number"
                                                value={mintLimit}
                                                onChange={(e) => setMintLimit(parseInt(e.target.value) || 0)}
                                                min={1}
                                                className={`w-full px-4 py-3 rounded-lg ${
                                                    isDarkMode
                                                        ? 'bg-slate-800 border-slate-700 text-white'
                                                        : 'bg-slate-50 border-slate-200 text-slate-900'
                                                } border focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className={`block text-sm font-medium mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            预挖数量
                                        </label>
                                        <input
                                            type="number"
                                            value={premine}
                                            onChange={(e) => setPremine(parseInt(e.target.value) || 0)}
                                            min={0}
                                            max={maxSupply}
                                            className={`w-full px-4 py-3 rounded-lg ${
                                                isDarkMode
                                                    ? 'bg-slate-800 border-slate-700 text-white'
                                                    : 'bg-slate-50 border-slate-200 text-slate-900'
                                            } border focus:ring-2 focus:ring-cyan-500 focus:border-transparent`}
                                        />
                                    </div>

                                    <button
                                        onClick={simulateDeploy}
                                        disabled={isDeploying || !tokenName || !tokenSymbol}
                                        className={`w-full py-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                                            isDeploying || !tokenName || !tokenSymbol
                                                ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                                : 'bg-cyan-500 text-white hover:bg-cyan-600'
                                        }`}
                                    >
                                        {isDeploying ? (
                                            <>
                                                <RefreshCw className="w-5 h-5 animate-spin" />
                                                部署中...
                                            </>
                                        ) : (
                                            <>
                                                <Play className="w-5 h-5" />
                                                模拟部署
                                            </>
                                        )}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {/* 代币预览 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">代币预览</h3>
                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                                    <Cat className="w-6 h-6 text-cyan-400" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-cyan-400 text-lg">{tokenName || 'Token Name'}</p>
                                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                        ${tokenSymbol || 'SYMBOL'}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>最大供应：</span>
                                                    <span className="font-mono ml-1">{maxSupply.toLocaleString()}</span>
                                                </div>
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>铸造限制：</span>
                                                    <span className="font-mono ml-1">{mintLimit}</span>
                                                </div>
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>预挖：</span>
                                                    <span className="font-mono ml-1">{premine.toLocaleString()}</span>
                                                </div>
                                                <div>
                                                    <span className={isDarkMode ? 'text-slate-400' : 'text-slate-500'}>可铸造：</span>
                                                    <span className="font-mono ml-1">{(maxSupply - premine).toLocaleString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 部署步骤 */}
                                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                        <h3 className="font-bold mb-3">部署流程</h3>
                                        <div className="space-y-3">
                                            <div className={`flex items-center gap-3 p-2 rounded ${deployStep >= 1 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    deployStep >= 1 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {deployStep >= 1 ? <Check className="w-4 h-4" /> : '1'}
                                                </div>
                                                <span className={`text-sm ${deployStep >= 1 ? 'text-green-400' : ''}`}>
                                                    编译合约脚本
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${deployStep >= 2 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    deployStep >= 2 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {deployStep >= 2 ? <Check className="w-4 h-4" /> : '2'}
                                                </div>
                                                <span className={`text-sm ${deployStep >= 2 ? 'text-green-400' : ''}`}>
                                                    生成 Token ID
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${deployStep >= 3 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    deployStep >= 3 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {deployStep >= 3 ? <Check className="w-4 h-4" /> : '3'}
                                                </div>
                                                <span className={`text-sm ${deployStep >= 3 ? 'text-green-400' : ''}`}>
                                                    构建部署交易
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${deployStep >= 4 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    deployStep >= 4 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {deployStep >= 4 ? <Check className="w-4 h-4" /> : '4'}
                                                </div>
                                                <span className={`text-sm ${deployStep >= 4 ? 'text-green-400' : ''}`}>
                                                    广播到 Fractal 网络
                                                </span>
                                            </div>
                                            <div className={`flex items-center gap-3 p-2 rounded ${deployStep >= 5 ? 'bg-green-500/20' : ''}`}>
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                                    deployStep >= 5 ? 'bg-green-500 text-white' : isDarkMode ? 'bg-slate-700' : 'bg-slate-300'
                                                }`}>
                                                    {deployStep >= 5 ? <Check className="w-4 h-4" /> : '5'}
                                                </div>
                                                <span className={`text-sm ${deployStep >= 5 ? 'text-green-400' : ''}`}>
                                                    部署成功！代币已上线
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 生成的合约 */}
                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-bold">代币合约信息</h2>
                                <button
                                    onClick={() => copyToClipboard(generateTokenId(tokenSymbol))}
                                    className={`flex items-center gap-1 px-3 py-1.5 rounded text-sm ${
                                        isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-slate-100 hover:bg-slate-200'
                                    }`}
                                >
                                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                    {copied ? '已复制' : '复制 ID'}
                                </button>
                            </div>
                            <div className={`p-4 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'} overflow-x-auto`}>
                                <pre>
{`{
  "protocol": "CAT20",
  "network": "fractal-mainnet",
  "tokenId": "${generateTokenId(tokenSymbol)}",
  "info": {
    "name": "${tokenName}",
    "symbol": "${tokenSymbol}",
    "decimals": 8
  },
  "supply": {
    "max": ${maxSupply},
    "premine": ${premine},
    "mintable": ${maxSupply - premine},
    "limit": ${mintLimit}
  },
  "contract": {
    "type": "P2TR",
    "scriptHash": "${generateTokenId(tokenName).slice(0, 40)}...",
    "features": ["mint", "transfer", "burn"]
  },
  "meta": {
    "deployHeight": ${Math.floor(Math.random() * 100000) + 100000},
    "deployTime": ${Math.floor(Date.now() / 1000)}
  }
}`}
                                </pre>
                            </div>
                        </div>
                    </div>
                )}

                {/* 测验 */}
                {activeTab === 'quiz' && (
                    <Quiz quizData={cat20Quiz} />
                )}
            </div>
        </div>
    );
};

export default CAT20Demo;
