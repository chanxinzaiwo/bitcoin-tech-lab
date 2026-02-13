import React, { useState, useMemo } from 'react';
import { BookOpen, Search, ChevronDown, ChevronUp, ExternalLink } from 'lucide-react';
import { useLab } from '../store/LabContext';

interface GlossaryTerm {
    term: string;
    termEn: string;
    definition: string;
    category: string;
    related?: string[];
}

interface GlossaryProps {
    onClose: () => void;
}

const glossaryData: GlossaryTerm[] = [
    // 基础概念
    { term: '比特币', termEn: 'Bitcoin', definition: '一种去中心化的数字货币，由中本聪在2009年创建，基于点对点网络和密码学技术。', category: '基础概念', related: ['区块链', '中本聪'] },
    { term: '区块链', termEn: 'Blockchain', definition: '一种分布式账本技术，由按时间顺序链接的区块组成，每个区块包含一批交易记录。', category: '基础概念', related: ['区块', '分布式账本'] },
    { term: '聪', termEn: 'Satoshi (sat)', definition: '比特币的最小单位，1 BTC = 100,000,000 聪。以比特币创始人中本聪命名。', category: '基础概念' },
    { term: '中本聪', termEn: 'Satoshi Nakamoto', definition: '比特币的匿名创始人，2008年发布白皮书，2009年启动网络，2011年后消失。真实身份至今成谜。', category: '基础概念' },

    // 密钥与地址
    { term: '私钥', termEn: 'Private Key', definition: '一个256位的随机数，用于签名交易证明所有权。必须严格保密，丢失意味着失去资金控制权。', category: '密钥与地址', related: ['公钥', '助记词'] },
    { term: '公钥', termEn: 'Public Key', definition: '由私钥通过椭圆曲线加密(ECC)派生，可以公开。用于验证签名和生成地址。', category: '密钥与地址', related: ['私钥', 'ECC'] },
    { term: '地址', termEn: 'Address', definition: '比特币的收款标识符，由公钥哈希后编码生成。有多种格式：Legacy(1开头)、P2SH(3开头)、SegWit(bc1q开头)、Taproot(bc1p开头)。', category: '密钥与地址' },
    { term: '助记词', termEn: 'Mnemonic / Seed Phrase', definition: '12或24个英文单词，用于备份和恢复钱包。遵循BIP-39标准，本质是私钥的人类可读形式。', category: '密钥与地址', related: ['HD钱包', 'BIP-39'] },
    { term: 'HD钱包', termEn: 'HD Wallet', definition: '分层确定性钱包，从单个种子派生无限个密钥对。遵循BIP-32/44标准。', category: '密钥与地址', related: ['助记词', 'BIP-32'] },

    // 交易相关
    { term: 'UTXO', termEn: 'Unspent Transaction Output', definition: '未花费交易输出。比特币没有账户余额概念，你的"余额"是所有属于你的UTXO之和。', category: '交易相关', related: ['交易', '找零'] },
    { term: '交易', termEn: 'Transaction (TX)', definition: '比特币转账的数据结构，包含输入(花费的UTXO)和输出(新创建的UTXO)。', category: '交易相关', related: ['UTXO', '手续费'] },
    { term: '手续费', termEn: 'Fee', definition: '交易发送者支付给矿工的费用，按交易大小(vBytes)而非金额计算。', category: '交易相关', related: ['矿工', 'vBytes'] },
    { term: '找零', termEn: 'Change', definition: 'UTXO金额超过支付金额时，多余部分返回给发送者的输出。', category: '交易相关', related: ['UTXO'] },
    { term: '内存池', termEn: 'Mempool', definition: '节点存储未确认交易的地方。矿工从中选择交易打包到区块。', category: '交易相关', related: ['矿工', '确认'] },
    { term: 'RBF', termEn: 'Replace-By-Fee', definition: '允许用更高手续费的新交易替换未确认的旧交易，加速确认。', category: '交易相关', related: ['手续费', 'CPFP'] },
    { term: 'CPFP', termEn: 'Child-Pays-For-Parent', definition: '通过创建高费率的子交易来"拉"未确认的父交易一起被打包。', category: '交易相关', related: ['RBF', '手续费'] },

    // 挖矿与共识
    { term: '挖矿', termEn: 'Mining', definition: '通过消耗算力解决数学难题来创建新区块的过程，成功者获得区块奖励。', category: '挖矿与共识', related: ['PoW', '区块奖励'] },
    { term: 'PoW', termEn: 'Proof of Work', definition: '工作量证明，比特币的共识机制。矿工必须找到使区块哈希满足难度目标的随机数。', category: '挖矿与共识', related: ['挖矿', '难度'] },
    { term: '难度', termEn: 'Difficulty', definition: '挖矿难度，每2016个区块(约2周)调整一次，以保持平均10分钟出一个块。', category: '挖矿与共识', related: ['挖矿', '算力'] },
    { term: '算力', termEn: 'Hashrate', definition: '挖矿设备每秒计算哈希的次数，通常以EH/s(每秒10^18次哈希)为单位。', category: '挖矿与共识', related: ['挖矿', '难度'] },
    { term: '区块奖励', termEn: 'Block Reward', definition: '矿工成功挖出区块获得的比特币，包括区块补贴(新发行)和交易手续费。', category: '挖矿与共识', related: ['挖矿', '减半'] },
    { term: '减半', termEn: 'Halving', definition: '约每4年(210,000区块)区块补贴减少一半，控制比特币发行速度。', category: '挖矿与共识', related: ['区块奖励'] },
    { term: '51%攻击', termEn: '51% Attack', definition: '控制超过一半算力后可能进行的攻击，如双花。成本极高，经济上不划算。', category: '挖矿与共识', related: ['双花', '算力'] },
    { term: '双花', termEn: 'Double Spend', definition: '同一笔比特币被花费两次的攻击尝试。PoW和确认机制可有效防止。', category: '挖矿与共识', related: ['51%攻击', '确认'] },

    // 网络与节点
    { term: '节点', termEn: 'Node', definition: '运行比特币软件、维护区块链副本的计算机。全节点验证所有规则。', category: '网络与节点', related: ['全节点', 'P2P'] },
    { term: '全节点', termEn: 'Full Node', definition: '下载并验证所有区块和交易的节点，不信任任何第三方。', category: '网络与节点', related: ['节点', 'SPV'] },
    { term: 'SPV', termEn: 'Simplified Payment Verification', definition: '简化支付验证，只下载区块头的轻量级钱包。安全性和隐私性较低。', category: '网络与节点', related: ['全节点'] },
    { term: 'P2P', termEn: 'Peer-to-Peer', definition: '点对点网络，节点直接相互连接，无中心服务器。', category: '网络与节点' },

    // 协议升级
    { term: 'SegWit', termEn: 'Segregated Witness', definition: '2017年激活的升级，将签名数据分离，解决交易延展性，增加区块容量。', category: '协议升级', related: ['延展性', 'vBytes'] },
    { term: 'Taproot', termEn: 'Taproot', definition: '2021年激活的升级，引入Schnorr签名和MAST，增强隐私和脚本能力。', category: '协议升级', related: ['Schnorr', 'MAST'] },
    { term: 'Schnorr', termEn: 'Schnorr Signature', definition: '一种签名算法，支持密钥聚合，使多签交易与普通交易无异。', category: '协议升级', related: ['Taproot', '多签'] },
    { term: 'MAST', termEn: 'Merkle Abstract Syntax Tree', definition: '使用默克尔树组织脚本条件，只揭示执行的分支，提升隐私和效率。', category: '协议升级', related: ['Taproot'] },
    { term: '软分叉', termEn: 'Soft Fork', definition: '向后兼容的协议升级，旧节点仍能验证新区块(但可能不理解新规则)。', category: '协议升级', related: ['硬分叉'] },
    { term: '硬分叉', termEn: 'Hard Fork', definition: '不向后兼容的协议变更，旧节点会拒绝新规则的区块，可能导致链分裂。', category: '协议升级', related: ['软分叉', 'BCH'] },

    // 二层方案
    { term: '闪电网络', termEn: 'Lightning Network', definition: '比特币的二层扩容方案，通过支付通道实现即时、低费的链下交易。', category: '二层方案', related: ['支付通道', 'HTLC'] },
    { term: '支付通道', termEn: 'Payment Channel', definition: '两方之间的链下交易通道，只有开启和关闭需要上链。', category: '二层方案', related: ['闪电网络'] },
    { term: 'HTLC', termEn: 'Hash Time-Locked Contract', definition: '哈希时间锁合约，闪电网络用于路由支付的基础原语。', category: '二层方案', related: ['闪电网络'] },

    // 隐私技术
    { term: 'CoinJoin', termEn: 'CoinJoin', definition: '多人联合构造交易，混合输入输出，打破追踪链。', category: '隐私技术', related: ['隐私', 'PayJoin'] },
    { term: 'PayJoin', termEn: 'PayJoin / P2EP', definition: '收款方贡献输入的CoinJoin变种，看起来像普通交易但破坏分析假设。', category: '隐私技术', related: ['CoinJoin'] },

    // 安全
    { term: '冷钱包', termEn: 'Cold Wallet', definition: '完全离线存储私钥的钱包，最安全的存储方式。', category: '安全', related: ['热钱包', '硬件钱包'] },
    { term: '热钱包', termEn: 'Hot Wallet', definition: '连接互联网的钱包，使用方便但有被攻击风险。', category: '安全', related: ['冷钱包'] },
    { term: '多签', termEn: 'Multisig', definition: '需要M-of-N个签名才能花费的安全机制，如2-of-3。', category: '安全', related: ['Schnorr'] },
    { term: '硬件钱包', termEn: 'Hardware Wallet', definition: '专用硬件设备存储私钥，签名在设备内完成，私钥不暴露。', category: '安全', related: ['冷钱包'] },

    // 技术术语
    { term: 'ECC', termEn: 'Elliptic Curve Cryptography', definition: '椭圆曲线加密，比特币使用secp256k1曲线生成公私钥对。', category: '技术术语', related: ['私钥', '公钥'] },
    { term: 'SHA-256', termEn: 'SHA-256', definition: '安全哈希算法，比特币挖矿和地址生成的核心。输出256位固定长度。', category: '技术术语', related: ['挖矿', '哈希'] },
    { term: 'vBytes', termEn: 'Virtual Bytes', definition: '虚拟字节，SegWit后用于计算交易大小和费用的单位。', category: '技术术语', related: ['SegWit', '手续费'] },
    { term: 'BIP', termEn: 'Bitcoin Improvement Proposal', definition: '比特币改进提案，社区提出和讨论协议变更的标准流程。', category: '技术术语' },
];

const Glossary: React.FC<GlossaryProps> = ({ onClose }) => {
    const { isDarkMode } = useLab();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedTerms, setExpandedTerms] = useState<Set<string>>(new Set());

    const categories = useMemo(() => {
        return [...new Set(glossaryData.map(t => t.category))];
    }, []);

    const filteredTerms = useMemo(() => {
        return glossaryData.filter(term => {
            const matchesSearch = searchTerm === '' ||
                term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.termEn.toLowerCase().includes(searchTerm.toLowerCase()) ||
                term.definition.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || term.category === selectedCategory;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, selectedCategory]);

    const groupedTerms = useMemo(() => {
        const groups: Record<string, GlossaryTerm[]> = {};
        filteredTerms.forEach(term => {
            if (!groups[term.category]) {
                groups[term.category] = [];
            }
            groups[term.category].push(term);
        });
        return groups;
    }, [filteredTerms]);

    const toggleTerm = (term: string) => {
        setExpandedTerms(prev => {
            const next = new Set(prev);
            if (next.has(term)) {
                next.delete(term);
            } else {
                next.add(term);
            }
            return next;
        });
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-y-auto" onClick={onClose}>
            <div className={`min-h-screen py-8 px-4 ${isDarkMode ? 'bg-slate-950/95' : 'bg-white/95'} backdrop-blur-sm`}>
                <div
                    className="max-w-4xl mx-auto"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'}`}>
                            <BookOpen className="w-5 h-5" />
                            <span className="font-bold">术语表</span>
                        </div>
                        <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                            比特币术语词典
                        </h2>
                        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            常用术语的中英文对照和解释
                        </p>
                    </div>

                    {/* Search */}
                    <div className="relative mb-6">
                        <Search className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                        <input
                            type="text"
                            placeholder="搜索术语..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-12 pr-4 py-3 rounded-xl border text-base outline-none transition-colors ${
                                isDarkMode
                                    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                            }`}
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        <button
                            onClick={() => setSelectedCategory(null)}
                            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                !selectedCategory
                                    ? 'bg-blue-500 text-white'
                                    : isDarkMode
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                            }`}
                        >
                            全部
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                                    selectedCategory === cat
                                        ? 'bg-blue-500 text-white'
                                        : isDarkMode
                                        ? 'bg-slate-800 text-slate-400 hover:text-white'
                                        : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Terms List */}
                    <div className="space-y-6">
                        {Object.entries(groupedTerms).map(([category, terms]) => (
                            <div key={category}>
                                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {category}
                                </h3>
                                <div className={`rounded-xl border overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                                    {terms.map((term, index) => {
                                        const isExpanded = expandedTerms.has(term.term);
                                        return (
                                            <div
                                                key={term.term}
                                                className={`${index > 0 ? (isDarkMode ? 'border-t border-slate-800' : 'border-t border-slate-100') : ''}`}
                                            >
                                                <button
                                                    onClick={() => toggleTerm(term.term)}
                                                    className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                                                        isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                            {term.term}
                                                        </span>
                                                        <span className={`text-sm font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                            {term.termEn}
                                                        </span>
                                                    </div>
                                                    {isExpanded ? (
                                                        <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                                    ) : (
                                                        <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                                    )}
                                                </button>
                                                {isExpanded && (
                                                    <div className={`px-4 pb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                        <p className="text-sm leading-relaxed mb-2">
                                                            {term.definition}
                                                        </p>
                                                        {term.related && term.related.length > 0 && (
                                                            <div className="flex items-center gap-2 flex-wrap">
                                                                <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                                                                    相关:
                                                                </span>
                                                                {term.related.map(rel => (
                                                                    <button
                                                                        key={rel}
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setSearchTerm(rel);
                                                                        }}
                                                                        className={`text-xs px-2 py-1 rounded ${
                                                                            isDarkMode
                                                                                ? 'bg-slate-800 text-blue-400 hover:bg-slate-700'
                                                                                : 'bg-slate-100 text-blue-600 hover:bg-slate-200'
                                                                        }`}
                                                                    >
                                                                        {rel}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredTerms.length === 0 && (
                        <div className={`text-center py-12 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                            没有找到匹配的术语
                        </div>
                    )}

                    {/* Close Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={onClose}
                            className={`px-8 py-3 rounded-xl font-bold transition-colors ${
                                isDarkMode
                                    ? 'bg-slate-800 text-white hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                            }`}
                        >
                            关闭
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Glossary;
