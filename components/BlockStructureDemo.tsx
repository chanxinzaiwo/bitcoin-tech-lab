import React, { useState, useEffect } from 'react';
import { Box, Layers, Hash, Clock, ArrowRight, CheckCircle, Database, FileText, Cpu, Link2, ChevronDown, ChevronUp, Zap, Award, TrendingUp } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

const BlockStructureDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '区块概览' },
        { id: 'header', label: '区块头' },
        { id: 'coinbase', label: 'Coinbase 交易' },
        { id: 'explorer', label: '区块浏览器' },
        { id: 'interactive', label: '交互演示' },
        { id: 'quiz', label: '测验' }
    ];

    // Interactive block explorer state
    const [selectedBlock, setSelectedBlock] = useState(0);
    const [expandedSection, setExpandedSection] = useState<string | null>('header');

    // Sample block data
    const sampleBlocks = [
        {
            height: 800000,
            hash: '00000000000000000002a7c4c1e48d76c5a37902165a270156b7a8d7280a5a83',
            prevHash: '000000000000000000027c42aa3e2f8c6f9c8a5b1d2e3f4a5b6c7d8e9f0a1b2c',
            merkleRoot: '4a5e1e4baab89f3a32518a88c31bc87f618f76673e2cc77ab2127b7afdeda33b',
            timestamp: 1687654321,
            bits: '17053894',
            nonce: 2083236893,
            version: 0x20000000,
            txCount: 2847,
            size: 1523456,
            weight: 3993421,
            reward: 6.25,
        },
        {
            height: 210000,
            hash: '000000000000048b95347e83192f69cf0366076336c639f9b7228e9ba171342e',
            prevHash: '00000000000001c2f3b4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
            merkleRoot: '5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6',
            timestamp: 1354116278,
            bits: '1a05db8b',
            nonce: 2504433986,
            version: 0x00000002,
            txCount: 462,
            size: 234567,
            weight: 893421,
            reward: 25,
        }
    ];

    const currentBlock = sampleBlocks[selectedBlock];

    const formatTimestamp = (ts: number) => {
        return new Date(ts * 1000).toLocaleString('zh-CN');
    };

    const formatHash = (hash: string, length: number = 16) => {
        return hash.slice(0, length) + '...' + hash.slice(-8);
    };

    const quizData = getQuizByModule('blockstructure');

    return (
        <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className={`rounded-2xl p-6 mb-6 border ${isDarkMode ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border-blue-800/50' : 'bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200'}`}>
                    <div className="flex items-center gap-3 mb-4">
                        <div className={`p-3 rounded-xl ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                            <Box className="w-8 h-8 text-blue-500" />
                        </div>
                        <div>
                            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                区块结构 (Block Structure)
                            </h1>
                            <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                比特币区块链的基本组成单元
                            </p>
                        </div>
                    </div>
                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        区块是比特币区块链的基本构建单元，每个区块包含区块头和交易列表。
                        区块头包含了关键的元数据，而交易列表以 Coinbase 交易开始，记录矿工奖励。
                    </p>
                </div>

                {/* Tabs */}
                <div className={`flex flex-wrap gap-2 mb-6 p-2 rounded-xl ${isDarkMode ? 'bg-slate-900/50' : 'bg-white'} border ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-blue-500 text-white'
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
                                区块的基本结构
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                    比特币区块由两部分组成：<strong>区块头 (Block Header)</strong> 和 <strong>交易列表 (Transaction List)</strong>。
                                    区块头固定为 80 字节，包含 6 个字段；交易列表包含该区块中的所有交易。
                                </p>
                            </div>

                            {/* Block structure visualization */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <div className="flex flex-col gap-4">
                                    {/* Block Header */}
                                    <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'border-blue-500/50 bg-blue-500/10' : 'border-blue-300 bg-blue-50'}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Layers className="w-5 h-5 text-blue-500" />
                                            <span className={`font-bold ${isDarkMode ? 'text-blue-400' : 'text-blue-700'}`}>区块头 (80 bytes)</span>
                                        </div>
                                        <div className="grid md:grid-cols-3 gap-3">
                                            {[
                                                { name: 'Version', size: '4 bytes', desc: '版本号' },
                                                { name: 'Previous Hash', size: '32 bytes', desc: '前一区块哈希' },
                                                { name: 'Merkle Root', size: '32 bytes', desc: '默克尔根' },
                                                { name: 'Timestamp', size: '4 bytes', desc: '时间戳' },
                                                { name: 'Bits', size: '4 bytes', desc: '难度目标' },
                                                { name: 'Nonce', size: '4 bytes', desc: '随机数' },
                                            ].map((field, idx) => (
                                                <div key={idx} className={`p-2 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{field.size}</div>
                                                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{field.name}</div>
                                                    <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{field.desc}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Arrow */}
                                    <div className="flex justify-center">
                                        <ArrowRight className={`w-6 h-6 rotate-90 ${isDarkMode ? 'text-slate-600' : 'text-slate-400'}`} />
                                    </div>

                                    {/* Transaction List */}
                                    <div className={`p-4 rounded-lg border-2 ${isDarkMode ? 'border-green-500/50 bg-green-500/10' : 'border-green-300 bg-green-50'}`}>
                                        <div className="flex items-center gap-2 mb-3">
                                            <FileText className="w-5 h-5 text-green-500" />
                                            <span className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>交易列表 (Variable size)</span>
                                        </div>
                                        <div className="grid md:grid-cols-4 gap-2">
                                            <div className={`p-3 rounded text-center ${isDarkMode ? 'bg-amber-500/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                                <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                                                <div className={`font-medium ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>Coinbase TX</div>
                                                <div className={`text-xs ${isDarkMode ? 'text-amber-300/70' : 'text-amber-600'}`}>矿工奖励</div>
                                            </div>
                                            {[1, 2, 3].map((tx) => (
                                                <div key={tx} className={`p-3 rounded text-center ${isDarkMode ? 'bg-slate-800' : 'bg-white'}`}>
                                                    <FileText className={`w-5 h-5 mx-auto mb-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
                                                    <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>TX #{tx}</div>
                                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>普通交易</div>
                                                </div>
                                            ))}
                                        </div>
                                        <div className={`text-center mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                            ... 更多交易 ...
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Database className="w-5 h-5 text-purple-500" />
                                        区块大小限制
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>传统限制</strong>：1 MB 区块大小</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>SegWit 后</strong>：4 MB 权重单位 (WU)</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>实际大小</strong>：约 1.5-2 MB</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Clock className="w-5 h-5 text-amber-500" />
                                        区块时间
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>目标时间</strong>：平均 10 分钟</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>难度调整</strong>：每 2016 个区块</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>调整周期</strong>：约两周一次</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'header' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                区块头详解
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-purple-500/10 border border-purple-500/30' : 'bg-purple-50 border border-purple-200'}`}>
                                <p className={`${isDarkMode ? 'text-purple-300' : 'text-purple-800'}`}>
                                    区块头是 PoW 挖矿的核心数据结构。矿工通过不断改变 nonce 值，对区块头进行哈希运算，
                                    直到找到满足难度目标的哈希值。
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        name: 'Version (版本)',
                                        size: '4 字节',
                                        icon: <Cpu className="w-5 h-5 text-blue-500" />,
                                        color: 'blue',
                                        description: '区块版本号，用于指示支持的协议特性。BIP9 使用版本位来进行软分叉信号。',
                                        example: '0x20000000 (表示支持 SegWit)'
                                    },
                                    {
                                        name: 'Previous Block Hash (前区块哈希)',
                                        size: '32 字节',
                                        icon: <Link2 className="w-5 h-5 text-green-500" />,
                                        color: 'green',
                                        description: '前一个区块头的双重 SHA256 哈希值。这是区块链"链"的关键——每个区块都引用前一个区块。',
                                        example: '00000000000000000002a7c4c1e48d76...'
                                    },
                                    {
                                        name: 'Merkle Root (默克尔根)',
                                        size: '32 字节',
                                        icon: <Hash className="w-5 h-5 text-purple-500" />,
                                        color: 'purple',
                                        description: '区块中所有交易构建的默克尔树的根哈希。可以高效验证交易是否包含在区块中。',
                                        example: '4a5e1e4baab89f3a32518a88c31bc87f...'
                                    },
                                    {
                                        name: 'Timestamp (时间戳)',
                                        size: '4 字节',
                                        icon: <Clock className="w-5 h-5 text-amber-500" />,
                                        color: 'amber',
                                        description: 'Unix 时间戳，表示矿工声称的区块创建时间。有一定的容忍范围，用于难度调整计算。',
                                        example: '1687654321 (2023-06-25 12:05:21)'
                                    },
                                    {
                                        name: 'Bits (难度目标)',
                                        size: '4 字节',
                                        icon: <TrendingUp className="w-5 h-5 text-red-500" />,
                                        color: 'red',
                                        description: '压缩格式的难度目标值。区块哈希必须小于这个目标值才能被接受。每 2016 个区块调整一次。',
                                        example: '0x17053894 → target: 0x00000...'
                                    },
                                    {
                                        name: 'Nonce (随机数)',
                                        size: '4 字节',
                                        icon: <Zap className="w-5 h-5 text-cyan-500" />,
                                        color: 'cyan',
                                        description: '矿工不断修改的值，用于产生不同的区块头哈希。当 nonce 用尽时，可以修改 coinbase 中的 extra nonce。',
                                        example: '2083236893'
                                    }
                                ].map((field, idx) => (
                                    <div key={idx} className={`p-4 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                        <div className="flex items-start gap-4">
                                            <div className={`p-2 rounded-lg ${isDarkMode ? `bg-${field.color}-500/20` : `bg-${field.color}-100`}`}>
                                                {field.icon}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {field.name}
                                                    </h3>
                                                    <span className={`px-2 py-0.5 rounded text-xs ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                                        {field.size}
                                                    </span>
                                                </div>
                                                <p className={`mb-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {field.description}
                                                </p>
                                                <div className={`font-mono text-sm p-2 rounded ${isDarkMode ? 'bg-slate-900 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                                    示例: {field.example}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                    区块哈希的计算
                                </h3>
                                <div className={`font-mono text-sm p-3 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                    <div className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
                                        block_hash = SHA256(SHA256(block_header))
                                    </div>
                                    <div className={`mt-2 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                        // 80 字节的区块头进行双重 SHA256 哈希
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'coinbase' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                Coinbase 交易详解
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                                    <strong>Coinbase 交易</strong>是每个区块的第一笔交易，也是唯一可以凭空创造比特币的交易。
                                    它用于支付矿工的区块奖励和收集的交易费用。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Award className="w-5 h-5 text-amber-500" />
                                        Coinbase 特殊性
                                    </h3>
                                    <ul className={`space-y-2 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>无输入</strong>：不引用任何前序交易</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>创造 BTC</strong>：唯一可生成新币的方式</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>100 区块锁定</strong>：需等待 100 个确认才能花费</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <CheckCircle className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                                            <span><strong>Extra Nonce</strong>：可用于扩展挖矿搜索空间</span>
                                        </li>
                                    </ul>
                                </div>

                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <h3 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <TrendingUp className="w-5 h-5 text-green-500" />
                                        奖励组成
                                    </h3>
                                    <div className={`space-y-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span>区块补贴</span>
                                                <span className="font-bold text-amber-500">6.25 BTC</span>
                                            </div>
                                            <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                每 210,000 区块减半一次
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex justify-between items-center">
                                                <span>交易费用</span>
                                                <span className="font-bold text-green-500">~0.5 BTC</span>
                                            </div>
                                            <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                随网络拥堵程度变化
                                            </div>
                                        </div>
                                        <div className={`p-3 rounded-lg border-2 border-dashed ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}>
                                            <div className="flex justify-between items-center">
                                                <span className="font-bold">总计</span>
                                                <span className="font-bold text-purple-500">~6.75 BTC</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <h3 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    Coinbase 交易结构
                                </h3>
                                <div className={`font-mono text-sm p-4 rounded-lg overflow-x-auto ${isDarkMode ? 'bg-slate-900' : 'bg-white border border-slate-200'}`}>
                                    <pre className={isDarkMode ? 'text-slate-300' : 'text-slate-800'}>
{`{
  "txid": "4a5e1e4baab89f3a32518a88c31bc87f...",
  "vin": [{
    "coinbase": "03a08601042f...",  // 包含区块高度、矿池标识、extra nonce
    "sequence": 0xffffffff
  }],
  "vout": [{
    "value": 6.25000000,            // 区块奖励
    "scriptPubKey": {
      "type": "witness_v0_keyhash",
      "address": "bc1q..."           // 矿工地址
    }
  }]
}`}
                                    </pre>
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/30' : 'bg-green-50 border border-green-200'}`}>
                                <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                    区块奖励减半历史
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className={`w-full ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                        <thead>
                                            <tr className={isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                                <th className="px-4 py-2 text-left">区块高度</th>
                                                <th className="px-4 py-2 text-left">年份</th>
                                                <th className="px-4 py-2 text-left">奖励</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                                            <tr>
                                                <td className="px-4 py-2">0 - 209,999</td>
                                                <td className="px-4 py-2">2009-2012</td>
                                                <td className="px-4 py-2 font-bold text-amber-500">50 BTC</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">210,000 - 419,999</td>
                                                <td className="px-4 py-2">2012-2016</td>
                                                <td className="px-4 py-2 font-bold text-amber-500">25 BTC</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">420,000 - 629,999</td>
                                                <td className="px-4 py-2">2016-2020</td>
                                                <td className="px-4 py-2 font-bold text-amber-500">12.5 BTC</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">630,000 - 839,999</td>
                                                <td className="px-4 py-2">2020-2024</td>
                                                <td className="px-4 py-2 font-bold text-amber-500">6.25 BTC</td>
                                            </tr>
                                            <tr>
                                                <td className="px-4 py-2">840,000+</td>
                                                <td className="px-4 py-2">2024+</td>
                                                <td className="px-4 py-2 font-bold text-amber-500">3.125 BTC</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'explorer' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                区块浏览器视图
                            </h2>

                            {/* Block selector */}
                            <div className="flex gap-3">
                                {sampleBlocks.map((block, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedBlock(idx)}
                                        className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedBlock === idx
                                            ? 'bg-blue-500 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                                            }`}
                                    >
                                        区块 #{block.height.toLocaleString()}
                                    </button>
                                ))}
                            </div>

                            {/* Block info cards */}
                            <div className="grid md:grid-cols-3 gap-4">
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>区块高度</div>
                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        #{currentBlock.height.toLocaleString()}
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>交易数量</div>
                                    <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {currentBlock.txCount.toLocaleString()}
                                    </div>
                                </div>
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                    <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>区块奖励</div>
                                    <div className={`text-2xl font-bold text-amber-500`}>
                                        {currentBlock.reward} BTC
                                    </div>
                                </div>
                            </div>

                            {/* Expandable sections */}
                            <div className="space-y-3">
                                {/* Block Header section */}
                                <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <button
                                        onClick={() => setExpandedSection(expandedSection === 'header' ? null : 'header')}
                                        className={`w-full p-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <span className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            <Layers className="w-5 h-5 text-blue-500" />
                                            区块头信息
                                        </span>
                                        {expandedSection === 'header' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                    {expandedSection === 'header' && (
                                        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                            <div className="grid gap-3">
                                                {[
                                                    { label: 'Block Hash', value: currentBlock.hash },
                                                    { label: 'Previous Hash', value: currentBlock.prevHash },
                                                    { label: 'Merkle Root', value: currentBlock.merkleRoot },
                                                    { label: 'Timestamp', value: formatTimestamp(currentBlock.timestamp) },
                                                    { label: 'Bits', value: currentBlock.bits },
                                                    { label: 'Nonce', value: currentBlock.nonce.toLocaleString() },
                                                    { label: 'Version', value: '0x' + currentBlock.version.toString(16) },
                                                ].map((item, idx) => (
                                                    <div key={idx} className={`flex flex-col md:flex-row md:items-center gap-1 md:gap-4 p-2 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                                        <span className={`font-medium w-36 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.label}</span>
                                                        <span className={`font-mono text-sm break-all ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                            {typeof item.value === 'string' && item.value.length > 40 ? formatHash(item.value, 24) : item.value}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Block Size section */}
                                <div className={`rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                                    <button
                                        onClick={() => setExpandedSection(expandedSection === 'size' ? null : 'size')}
                                        className={`w-full p-4 flex items-center justify-between ${isDarkMode ? 'hover:bg-slate-700/50' : 'hover:bg-slate-50'}`}
                                    >
                                        <span className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            <Database className="w-5 h-5 text-green-500" />
                                            区块大小信息
                                        </span>
                                        {expandedSection === 'size' ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                    {expandedSection === 'size' && (
                                        <div className={`p-4 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div className={`p-3 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                                    <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>区块大小</div>
                                                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {(currentBlock.size / 1024 / 1024).toFixed(2)} MB
                                                    </div>
                                                </div>
                                                <div className={`p-3 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                                    <div className={`text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>区块权重</div>
                                                    <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        {(currentBlock.weight / 1000000).toFixed(2)} MWU
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'interactive' && (
                        <div className="space-y-6">
                            <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                区块链结构可视化
                            </h2>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-blue-500/10 border border-blue-500/30' : 'bg-blue-50 border border-blue-200'}`}>
                                <p className={`${isDarkMode ? 'text-blue-300' : 'text-blue-800'}`}>
                                    每个区块通过 Previous Block Hash 字段链接到前一个区块，形成不可篡改的链式结构。
                                </p>
                            </div>

                            {/* Blockchain visualization */}
                            <div className="overflow-x-auto pb-4">
                                <div className="flex items-center gap-4 min-w-max">
                                    {[
                                        { height: 'N-2', hash: '000...a1b2', prev: '000...9e8f' },
                                        { height: 'N-1', hash: '000...c3d4', prev: '000...a1b2' },
                                        { height: 'N', hash: '000...e5f6', prev: '000...c3d4' },
                                    ].map((block, idx) => (
                                        <React.Fragment key={idx}>
                                            {idx > 0 && (
                                                <ArrowRight className={`w-8 h-8 flex-shrink-0 ${isDarkMode ? 'text-blue-500' : 'text-blue-400'}`} />
                                            )}
                                            <div className={`w-64 p-4 rounded-xl border-2 flex-shrink-0 ${isDarkMode ? 'bg-slate-800 border-blue-500/50' : 'bg-white border-blue-300'}`}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        区块 {block.height}
                                                    </span>
                                                    <Box className="w-5 h-5 text-blue-500" />
                                                </div>
                                                <div className="space-y-2">
                                                    <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Hash</div>
                                                        <div className={`font-mono text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>{block.hash}</div>
                                                    </div>
                                                    <div className={`p-2 rounded ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>Prev Hash</div>
                                                        <div className={`font-mono text-sm ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>{block.prev}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Hash linking explanation */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
                                <h3 className={`font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    为什么区块链不可篡改？
                                </h3>
                                <div className={`space-y-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                    <p>
                                        1. 每个区块的哈希值由其区块头内容决定，包括 Previous Hash
                                    </p>
                                    <p>
                                        2. 如果修改任意区块的交易，该区块的 Merkle Root 会改变
                                    </p>
                                    <p>
                                        3. Merkle Root 改变导致区块头改变，进而区块哈希改变
                                    </p>
                                    <p>
                                        4. 后续所有区块的 Previous Hash 都会失效，需要重新计算
                                    </p>
                                    <p>
                                        5. 重新计算需要巨大的算力（PoW），实际上不可行
                                    </p>
                                </div>
                            </div>

                            {/* Genesis block info */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h3 className={`font-bold mb-2 flex items-center gap-2 ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                    <Award className="w-5 h-5" />
                                    创世区块 (Genesis Block)
                                </h3>
                                <p className={`${isDarkMode ? 'text-amber-300' : 'text-amber-800'}`}>
                                    比特币的第一个区块（高度 0）由中本聪于 2009 年 1 月 3 日创建。
                                    其 Coinbase 交易包含了著名的文字：
                                </p>
                                <div className={`mt-3 p-3 rounded font-mono text-sm ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'}`}>
                                    "The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"
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

export default BlockStructureDemo;
