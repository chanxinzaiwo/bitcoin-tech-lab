import React, { useState, useEffect } from 'react';
import { Key, Shield, RefreshCw, CheckCircle, XCircle, AlertTriangle, Eye, EyeOff, Copy, Lock, Unlock, BookOpen, Grid, Hash, ArrowRight, Zap } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

// BIP39 English wordlist (first 100 words for demo)
const wordlist = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse',
    'access', 'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act',
    'action', 'actor', 'actress', 'actual', 'adapt', 'add', 'addict', 'address', 'adjust', 'admit',
    'adult', 'advance', 'advice', 'aerobic', 'affair', 'afford', 'afraid', 'again', 'age', 'agent',
    'agree', 'ahead', 'aim', 'air', 'airport', 'aisle', 'alarm', 'album', 'alcohol', 'alert',
    'alien', 'all', 'alley', 'allow', 'almost', 'alone', 'alpha', 'already', 'also', 'alter',
    'always', 'amateur', 'amazing', 'among', 'amount', 'amused', 'analyst', 'anchor', 'ancient', 'anger',
    'angle', 'angry', 'animal', 'ankle', 'announce', 'annual', 'another', 'answer', 'antenna', 'antique',
    'anxiety', 'any', 'apart', 'apology', 'appear', 'apple', 'approve', 'april', 'arch', 'arctic',
    'area', 'arena', 'argue', 'arm', 'armed', 'armor', 'army', 'around', 'arrange', 'arrest',
];

const BIP39Demo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    // Mnemonic generation state
    const [entropy, setEntropy] = useState('');
    const [entropyBits, setEntropyBits] = useState(128);
    const [checksum, setChecksum] = useState('');
    const [mnemonic, setMnemonic] = useState<string[]>([]);
    const [showEntropy, setShowEntropy] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);

    // Passphrase state
    const [passphrase, setPassphrase] = useState('');
    const [showPassphrase, setShowPassphrase] = useState(false);
    const [seed, setSeed] = useState('');

    // Validation state
    const [inputMnemonic, setInputMnemonic] = useState('');
    const [validationResult, setValidationResult] = useState<{valid: boolean, message: string} | null>(null);

    const generateRandomHex = (bytes: number) => {
        const array = new Uint8Array(bytes);
        crypto.getRandomValues(array);
        return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
    };

    const hexToBinary = (hex: string) => {
        return hex.split('').map(c => parseInt(c, 16).toString(2).padStart(4, '0')).join('');
    };

    const generateMnemonic = () => {
        setIsGenerating(true);

        // Generate entropy
        const entropyBytes = entropyBits / 8;
        const newEntropy = generateRandomHex(entropyBytes);
        setEntropy(newEntropy);

        // Calculate checksum (simplified - just use first bits of hash representation)
        const checksumBits = entropyBits / 32;
        const newChecksum = generateRandomHex(1).slice(0, checksumBits / 4 || 1);
        setChecksum(newChecksum);

        // Generate mnemonic words
        const wordCount = (entropyBits + checksumBits) / 11;
        const words: string[] = [];
        for (let i = 0; i < wordCount; i++) {
            const index = Math.floor(Math.random() * 2048) % wordlist.length;
            words.push(wordlist[index]);
        }
        setMnemonic(words);

        // Generate seed (simulated)
        setTimeout(() => {
            setSeed(generateRandomHex(64));
            setIsGenerating(false);
        }, 500);
    };

    const validateMnemonic = () => {
        const words = inputMnemonic.trim().toLowerCase().split(/\s+/);

        if (![12, 15, 18, 21, 24].includes(words.length)) {
            setValidationResult({
                valid: false,
                message: `无效的助记词数量: ${words.length}。有效数量为 12, 15, 18, 21 或 24`
            });
            return;
        }

        const invalidWords = words.filter(w => !wordlist.includes(w));
        if (invalidWords.length > 0) {
            setValidationResult({
                valid: false,
                message: `发现无效单词: ${invalidWords.slice(0, 3).join(', ')}${invalidWords.length > 3 ? '...' : ''}`
            });
            return;
        }

        // In real implementation, would verify checksum
        setValidationResult({
            valid: true,
            message: '助记词格式有效！（注：这是简化验证，实际需要验证校验和）'
        });
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
    };

    const tabs = [
        { id: 'intro', label: '概念介绍' },
        { id: 'structure', label: '结构详解' },
        { id: 'generator', label: '生成器' },
        { id: 'security', label: '安全实践' },
        { id: 'recovery', label: '恢复验证' },
        { id: 'quiz', label: '知识测验' },
    ];

    const quizData = getQuizByModule('bip39');

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`}>
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
                        <Key className="w-4 h-4" />
                        密钥管理
                    </div>
                    <h1 className="text-4xl font-bold mb-4">BIP39 助记词详解</h1>
                    <p className={`text-lg ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} max-w-2xl mx-auto`}>
                        BIP39 定义了如何将随机熵转换为人类可读的助记词，是现代加密钱包备份的基石
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
                                    ? 'bg-emerald-500 text-white'
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
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <BookOpen className="w-5 h-5 text-emerald-400" />
                                        什么是 BIP39？
                                    </h3>
                                    <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>
                                        BIP39 (Bitcoin Improvement Proposal 39) 定义了一种将随机数（熵）编码为
                                        <strong>一组助记词</strong>的标准方法。这些词来自一个 2048 词的标准词表，
                                        使得备份和恢复钱包变得简单且不易出错。
                                    </p>
                                </div>

                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <Shield className="w-5 h-5 text-amber-400" />
                                        为什么重要？
                                    </h3>
                                    <ul className="space-y-2">
                                        {[
                                            '人类可读 - 比十六进制更易记忆',
                                            '错误检测 - 内置校验和',
                                            '跨钱包兼容 - 行业标准',
                                            '可选密码 - 额外安全层',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-2">
                                                <CheckCircle className="w-4 h-4 text-emerald-400" />
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Visual Flow */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'}`}>
                                <h3 className="text-xl font-bold mb-6 text-center">从熵到种子的转换流程</h3>
                                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                                    {[
                                        { name: '随机熵', desc: '128-256 bits', icon: Hash, color: 'emerald' },
                                        { name: '校验和', desc: 'SHA256 前 N bits', icon: Shield, color: 'blue' },
                                        { name: '助记词', desc: '12-24 个单词', icon: BookOpen, color: 'violet' },
                                        { name: '种子', desc: 'PBKDF2-SHA512', icon: Key, color: 'amber' },
                                    ].map((step, i) => (
                                        <React.Fragment key={i}>
                                            <div className="text-center">
                                                <div className={`w-14 h-14 rounded-xl bg-${step.color}-500/20 flex items-center justify-center mx-auto mb-2`}>
                                                    <step.icon className={`w-7 h-7 text-${step.color}-400`} />
                                                </div>
                                                <div className="font-bold">{step.name}</div>
                                                <div className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{step.desc}</div>
                                            </div>
                                            {i < 3 && <ArrowRight className="w-6 h-6 text-slate-500 hidden md:block" />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            {/* Word Count Options */}
                            <div>
                                <h3 className="text-xl font-bold mb-4">助记词长度选项</h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className={isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}>
                                                <th className="px-4 py-3 text-left">单词数</th>
                                                <th className="px-4 py-3 text-left">熵 (bits)</th>
                                                <th className="px-4 py-3 text-left">校验和 (bits)</th>
                                                <th className="px-4 py-3 text-left">总计 (bits)</th>
                                                <th className="px-4 py-3 text-left">安全性</th>
                                            </tr>
                                        </thead>
                                        <tbody className={`divide-y ${isDarkMode ? 'divide-slate-700' : 'divide-slate-200'}`}>
                                            {[
                                                { words: 12, entropy: 128, checksum: 4, security: '128 bits (推荐)' },
                                                { words: 15, entropy: 160, checksum: 5, security: '160 bits' },
                                                { words: 18, entropy: 192, checksum: 6, security: '192 bits' },
                                                { words: 21, entropy: 224, checksum: 7, security: '224 bits' },
                                                { words: 24, entropy: 256, checksum: 8, security: '256 bits (最高)' },
                                            ].map((row, i) => (
                                                <tr key={i}>
                                                    <td className="px-4 py-3 font-bold">{row.words} 词</td>
                                                    <td className="px-4 py-3 text-emerald-400">{row.entropy}</td>
                                                    <td className="px-4 py-3 text-blue-400">{row.checksum}</td>
                                                    <td className="px-4 py-3">{row.entropy + row.checksum}</td>
                                                    <td className="px-4 py-3 text-amber-400">{row.security}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'structure' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">BIP39 结构详解</h3>

                            {/* Step by Step */}
                            <div className="relative">
                                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-emerald-500 via-blue-500 to-amber-500"></div>

                                {[
                                    {
                                        step: 1,
                                        title: '生成随机熵',
                                        color: 'emerald',
                                        content: (
                                            <div>
                                                <p className={`mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    使用加密安全的随机数生成器 (CSPRNG) 生成 128-256 位随机数据。
                                                </p>
                                                <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                    <span className="text-slate-500">例 (128 bits): </span>
                                                    <span className="text-emerald-400">0c1e24e5917779d297e14d45f14e1a1a</span>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: 2,
                                        title: '计算校验和',
                                        color: 'blue',
                                        content: (
                                            <div>
                                                <p className={`mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    对熵进行 SHA-256 哈希，取结果的前 N 位作为校验和 (N = 熵长度 / 32)。
                                                </p>
                                                <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                    <div><span className="text-slate-500">SHA256: </span><span className="text-blue-400">e8f32...</span></div>
                                                    <div><span className="text-slate-500">校验和 (4 bits): </span><span className="text-blue-400">1110</span></div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: 3,
                                        title: '合并并分割',
                                        color: 'violet',
                                        content: (
                                            <div>
                                                <p className={`mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    将熵和校验和拼接，然后每 11 位分割成一组 (2^11 = 2048 = 词表大小)。
                                                </p>
                                                <div className={`p-3 rounded-lg font-mono text-xs ${isDarkMode ? 'bg-slate-900' : 'bg-white'} overflow-x-auto`}>
                                                    <div className="text-slate-500">132 bits 分割为 12 组:</div>
                                                    <div className="text-violet-400 mt-1">
                                                        [00011000011] [10010010011] [10011100101] ...
                                                    </div>
                                                    <div className="text-slate-500 mt-1">每组对应词表索引 0-2047</div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: 4,
                                        title: '映射到词表',
                                        color: 'rose',
                                        content: (
                                            <div>
                                                <p className={`mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    每个 11 位组转换为索引，从 BIP39 词表查找对应单词。
                                                </p>
                                                <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {['abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'absurd', 'abuse', 'access', 'accident'].map((word, i) => (
                                                            <div key={i} className="flex items-center gap-1">
                                                                <span className="text-slate-500 text-xs">{i}.</span>
                                                                <span className="text-rose-400">{word}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    },
                                    {
                                        step: 5,
                                        title: '生成种子',
                                        color: 'amber',
                                        content: (
                                            <div>
                                                <p className={`mb-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                                    使用 PBKDF2-HMAC-SHA512 将助记词 + 可选密码转换为 512 位种子。
                                                </p>
                                                <div className={`p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                    <div><span className="text-slate-500">输入: </span><span className="text-emerald-400">助记词 + "mnemonic" + 密码</span></div>
                                                    <div><span className="text-slate-500">迭代: </span><span className="text-blue-400">2048 次</span></div>
                                                    <div><span className="text-slate-500">输出: </span><span className="text-amber-400">512 位种子</span></div>
                                                </div>
                                            </div>
                                        )
                                    },
                                ].map((item, i) => (
                                    <div key={i} className="relative pl-16 pb-8">
                                        <div className={`absolute left-4 w-5 h-5 rounded-full bg-${item.color}-500 border-4 ${isDarkMode ? 'border-slate-900' : 'border-white'}`}></div>
                                        <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className="flex items-center gap-3 mb-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold bg-${item.color}-500/20 text-${item.color}-400`}>
                                                    步骤 {item.step}
                                                </span>
                                                <h4 className="text-lg font-bold">{item.title}</h4>
                                            </div>
                                            {item.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'generator' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold mb-6">助记词生成器</h3>

                            {/* Entropy Bits Selector */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <label className="block font-bold mb-3">选择熵长度</label>
                                <div className="flex flex-wrap gap-2">
                                    {[
                                        { bits: 128, words: 12 },
                                        { bits: 160, words: 15 },
                                        { bits: 192, words: 18 },
                                        { bits: 224, words: 21 },
                                        { bits: 256, words: 24 },
                                    ].map(opt => (
                                        <button
                                            key={opt.bits}
                                            onClick={() => setEntropyBits(opt.bits)}
                                            className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                                entropyBits === opt.bits
                                                    ? 'bg-emerald-500 text-white'
                                                    : isDarkMode
                                                        ? 'bg-slate-700 hover:bg-slate-600'
                                                        : 'bg-slate-200 hover:bg-slate-300'
                                            }`}
                                        >
                                            {opt.bits} bits ({opt.words} 词)
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Generate Button */}
                            <button
                                onClick={generateMnemonic}
                                disabled={isGenerating}
                                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                {isGenerating ? (
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                ) : (
                                    <Zap className="w-5 h-5" />
                                )}
                                {isGenerating ? '生成中...' : '生成助记词'}
                            </button>

                            {/* Results */}
                            {mnemonic.length > 0 && (
                                <div className="space-y-4">
                                    {/* Entropy */}
                                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <label className="font-bold text-emerald-400">熵 ({entropyBits} bits)</label>
                                            <button
                                                onClick={() => setShowEntropy(!showEntropy)}
                                                className={`p-2 rounded-lg ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                                            >
                                                {showEntropy ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <code className={`block p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            {showEntropy ? entropy : '•'.repeat(entropy.length)}
                                        </code>
                                    </div>

                                    {/* Checksum */}
                                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <label className="block font-bold mb-2 text-blue-400">校验和 ({entropyBits / 32} bits)</label>
                                        <code className={`block p-3 rounded-lg font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                            {checksum}
                                        </code>
                                    </div>

                                    {/* Mnemonic */}
                                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20' : 'bg-gradient-to-r from-emerald-100 to-teal-100 border border-emerald-200'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <label className="font-bold">助记词 ({mnemonic.length} 词)</label>
                                            <button
                                                onClick={() => copyToClipboard(mnemonic.join(' '))}
                                                className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${isDarkMode ? 'bg-slate-800 hover:bg-slate-700' : 'bg-white hover:bg-slate-100'}`}
                                            >
                                                <Copy className="w-4 h-4" />
                                                复制
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                                            {mnemonic.map((word, i) => (
                                                <div key={i} className={`p-2 rounded-lg text-center ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                    <span className="text-xs text-slate-500">{i + 1}. </span>
                                                    <span className="font-mono font-bold">{word}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Passphrase */}
                                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                        <label className="block font-bold mb-2">可选密码 (Passphrase)</label>
                                        <div className="relative">
                                            <input
                                                type={showPassphrase ? 'text' : 'password'}
                                                value={passphrase}
                                                onChange={(e) => setPassphrase(e.target.value)}
                                                placeholder="输入可选密码..."
                                                className={`w-full px-4 py-2 pr-10 rounded-lg ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border`}
                                            />
                                            <button
                                                onClick={() => setShowPassphrase(!showPassphrase)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                                            >
                                                {showPassphrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                            密码会改变生成的种子，可作为额外安全层
                                        </p>
                                    </div>

                                    {/* Seed */}
                                    {seed && (
                                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <label className="block font-bold mb-2 text-amber-400">种子 (512 bits)</label>
                                            <code className={`block p-3 rounded-lg font-mono text-xs break-all ${isDarkMode ? 'bg-slate-900' : 'bg-white'}`}>
                                                {seed}
                                            </code>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Warning */}
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-rose-900/20 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'}`}>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="font-bold text-rose-400 mb-1">安全警告</p>
                                        <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            这是演示用途。请勿使用此页面生成的助记词存储真实资金。
                                            在生产环境中，请使用经过审计的硬件钱包或离线工具。
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-8">
                            <h3 className="text-xl font-bold mb-6">安全最佳实践</h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Do's */}
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-emerald-900/20 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'}`}>
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-emerald-400">
                                        <CheckCircle className="w-5 h-5" />
                                        应该做
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            '使用离线设备生成助记词',
                                            '在纸上手写备份',
                                            '使用金属助记词板防火防水',
                                            '分开存放多份备份',
                                            '使用可选密码增加安全性',
                                            '验证恢复流程有效',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-400 mt-2"></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Don'ts */}
                                <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-rose-900/20 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'}`}>
                                    <h4 className="font-bold mb-4 flex items-center gap-2 text-rose-400">
                                        <XCircle className="w-5 h-5" />
                                        不应该做
                                    </h4>
                                    <ul className="space-y-3">
                                        {[
                                            '截图或拍照助记词',
                                            '存储在云端或网盘',
                                            '通过网络发送助记词',
                                            '在联网设备上输入',
                                            '使用脑钱包或弱密码',
                                            '告诉任何人你的助记词',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2">
                                                <div className="w-2 h-2 rounded-full bg-rose-400 mt-2"></div>
                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* Passphrase Best Practices */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <h4 className="font-bold mb-4">可选密码 (Passphrase) 使用建议</h4>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <h5 className="font-medium mb-2 text-emerald-400">优点</h5>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 助记词泄露后仍有保护</li>
                                            <li>• 可创建"诱饵钱包"</li>
                                            <li>• 不同密码产生不同钱包</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h5 className="font-medium mb-2 text-amber-400">注意事项</h5>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                            <li>• 忘记密码 = 永久丢失资金</li>
                                            <li>• 密码也需要安全备份</li>
                                            <li>• 任何密码都"有效"（无错误提示）</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Backup Strategies */}
                            <div>
                                <h4 className="font-bold mb-4">备份策略</h4>
                                <div className="grid md:grid-cols-3 gap-4">
                                    {[
                                        {
                                            name: '纸质备份',
                                            icon: BookOpen,
                                            color: 'emerald',
                                            pros: '简单、离线',
                                            cons: '易损坏、可读'
                                        },
                                        {
                                            name: '金属助记词板',
                                            icon: Shield,
                                            color: 'amber',
                                            pros: '防火防水、耐用',
                                            cons: '成本高、可读'
                                        },
                                        {
                                            name: '分片备份',
                                            icon: Grid,
                                            color: 'violet',
                                            pros: '更安全、冗余',
                                            cons: '复杂、需多处存放'
                                        },
                                    ].map((method, i) => (
                                        <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                            <div className={`w-10 h-10 rounded-lg bg-${method.color}-500/20 text-${method.color}-400 flex items-center justify-center mb-3`}>
                                                <method.icon className="w-5 h-5" />
                                            </div>
                                            <h5 className="font-bold mb-2">{method.name}</h5>
                                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <span className="text-emerald-400">优:</span> {method.pros}
                                            </p>
                                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                <span className="text-rose-400">缺:</span> {method.cons}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'recovery' && (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold mb-6">助记词恢复与验证</h3>

                            {/* Input */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                <label className="block font-bold mb-2">输入助记词</label>
                                <textarea
                                    value={inputMnemonic}
                                    onChange={(e) => {
                                        setInputMnemonic(e.target.value);
                                        setValidationResult(null);
                                    }}
                                    placeholder="输入助记词，用空格分隔..."
                                    rows={3}
                                    className={`w-full px-4 py-3 rounded-lg font-mono ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-300'} border`}
                                />
                                <p className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    支持 12, 15, 18, 21 或 24 个单词
                                </p>
                            </div>

                            {/* Validate Button */}
                            <button
                                onClick={validateMnemonic}
                                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold"
                            >
                                验证助记词
                            </button>

                            {/* Result */}
                            {validationResult && (
                                <div className={`p-6 rounded-xl ${
                                    validationResult.valid
                                        ? isDarkMode ? 'bg-emerald-900/30 border border-emerald-500/30' : 'bg-emerald-50 border border-emerald-200'
                                        : isDarkMode ? 'bg-rose-900/30 border border-rose-500/30' : 'bg-rose-50 border border-rose-200'
                                }`}>
                                    <div className="flex items-center gap-3">
                                        {validationResult.valid ? (
                                            <CheckCircle className="w-8 h-8 text-emerald-400" />
                                        ) : (
                                            <XCircle className="w-8 h-8 text-rose-400" />
                                        )}
                                        <div>
                                            <p className={`font-bold ${validationResult.valid ? 'text-emerald-400' : 'text-rose-400'}`}>
                                                {validationResult.valid ? '验证通过' : '验证失败'}
                                            </p>
                                            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>
                                                {validationResult.message}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Common Mistakes */}
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-amber-900/20 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
                                <h4 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
                                    <AlertTriangle className="w-5 h-5" />
                                    常见恢复错误
                                </h4>
                                <ul className="space-y-2 text-sm">
                                    {[
                                        '单词顺序错误 - 顺序非常重要',
                                        '拼写错误 - 注意相似单词如 "advice" vs "advise"',
                                        '遗漏或多余单词 - 确保数量正确',
                                        '使用错误词表 - 确保使用英语 BIP39 词表',
                                        '密码错误或遗忘 - 密码区分大小写',
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-2">
                                            <XCircle className="w-4 h-4 text-amber-400" />
                                            <span className={isDarkMode ? 'text-slate-300' : 'text-slate-600'}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
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

export default BIP39Demo;
