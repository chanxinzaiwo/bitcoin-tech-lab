import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';

interface NextStep {
    id: string;
    title: string;
    desc: string;
    reason: string;
}

// Define relationships between modules
const moduleRelations: Record<string, NextStep[]> = {
    ecc: [
        { id: 'address', title: '地址生成', desc: '学习如何从公钥生成地址', reason: '公钥 → 地址的下一步' },
        { id: 'hdwallet', title: 'HD 钱包', desc: '用一个种子生成无限密钥对', reason: '密钥管理进阶' },
        { id: 'schnorr', title: 'Schnorr 签名', desc: '更高效的签名方案', reason: 'ECC 的现代演进' },
    ],
    address: [
        { id: 'utxo', title: 'UTXO 模型', desc: '理解地址是如何接收和花费比特币的', reason: '地址的实际使用' },
        { id: 'segwit', title: 'SegWit 地址', desc: '了解 bc1q 地址的优势', reason: '现代地址格式' },
    ],
    hdwallet: [
        { id: 'cold', title: '冷钱包', desc: '安全存储你的助记词', reason: '钱包安全实践' },
        { id: 'utxo', title: 'UTXO 模型', desc: '理解钱包余额的计算方式', reason: '钱包原理深入' },
    ],
    utxo: [
        { id: 'script', title: 'Script 脚本', desc: '了解 UTXO 的锁定和解锁机制', reason: 'UTXO 的技术细节' },
        { id: 'rbf', title: 'RBF 竞价', desc: '学习如何加速交易', reason: '交易实用技巧' },
    ],
    script: [
        { id: 'segwit', title: 'SegWit', desc: '脚本结构的现代改进', reason: '脚本的演进' },
        { id: 'taproot', title: 'Taproot', desc: '使用 MAST 隐藏脚本分支', reason: '智能合约隐私' },
    ],
    pow: [
        { id: 'consensus', title: 'Nakamoto 共识', desc: '了解最长链原则', reason: '挖矿 → 共识' },
        { id: 'attack51', title: '51% 攻击', desc: '算力的安全边界', reason: '理解安全模型' },
    ],
    consensus: [
        { id: 'fork', title: '软硬分叉', desc: '共识规则如何升级', reason: '共识的演变' },
        { id: 'attack51', title: '51% 攻击', desc: '共识的攻击向量', reason: '安全分析' },
    ],
    p2p: [
        { id: 'rbf', title: 'RBF 竞价', desc: '内存池中的交易竞争', reason: '网络实用知识' },
        { id: 'spv', title: 'SPV 轻节点', desc: '不下载全部数据也能验证', reason: '轻量级参与网络' },
    ],
    segwit: [
        { id: 'taproot', title: 'Taproot', desc: 'SegWit 之后的下一次升级', reason: '技术演进路线' },
        { id: 'lightning', title: '闪电网络', desc: 'SegWit 使闪电网络成为可能', reason: '二层扩容' },
    ],
    taproot: [
        { id: 'schnorr', title: 'Schnorr 签名', desc: 'Taproot 的签名基础', reason: '深入 Taproot 原理' },
    ],
    lightning: [
        { id: 'segwit', title: 'SegWit', desc: '闪电网络的前置条件', reason: '理解技术基础' },
    ],
    attack51: [
        { id: 'consensus', title: 'Nakamoto 共识', desc: '理解 51% 攻击的防御机制', reason: '从攻击理解防御' },
    ],
    quantum: [
        { id: 'lamport', title: 'Lamport 签名', desc: '后量子加密方案', reason: '量子威胁的应对' },
        { id: 'ecc', title: 'ECC 原理', desc: '理解被量子威胁的算法', reason: '知彼知己' },
    ],
    lamport: [
        { id: 'quantum', title: '量子计算威胁', desc: '了解 Lamport 要解决的问题', reason: '理解问题背景' },
    ],
    rbf: [
        { id: 'utxo', title: 'UTXO 模型', desc: 'RBF 如何替换交易的原理', reason: '技术原理' },
        { id: 'lightning', title: '闪电网络', desc: '避免链上拥堵的方案', reason: '另一种解决思路' },
    ],
    fork: [
        { id: 'consensus', title: 'Nakamoto 共识', desc: '分叉与共识的关系', reason: '理解分叉本质' },
        { id: 'segwit', title: 'SegWit', desc: '软分叉升级案例', reason: '实际案例学习' },
    ],
    schnorr: [
        { id: 'taproot', title: 'Taproot', desc: 'Schnorr 在 Taproot 中的应用', reason: '实际应用' },
        { id: 'ecc', title: 'ECC 原理', desc: 'Schnorr 的数学基础', reason: '深入原理' },
    ],
    spv: [
        { id: 'pow', title: 'PoW 挖矿', desc: '理解 SPV 验证的安全假设', reason: '安全模型' },
    ],
    cold: [
        { id: 'hdwallet', title: 'HD 钱包', desc: '冷钱包的密钥生成原理', reason: '技术基础' },
    ],
};

interface NextStepsProps {
    currentModule: string;
    onNavigate: (moduleId: string) => void;
    isDarkMode: boolean;
}

const NextSteps: React.FC<NextStepsProps> = ({ currentModule, onNavigate, isDarkMode }) => {
    const nextSteps = moduleRelations[currentModule] || [];

    if (nextSteps.length === 0) return null;

    return (
        <div className={`mt-12 p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900/50 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center gap-2 mb-4">
                <BookOpen className={`w-5 h-5 ${isDarkMode ? 'text-orange-400' : 'text-orange-500'}`} />
                <h3 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>推荐下一步</h3>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {nextSteps.map((step) => (
                    <button
                        key={step.id}
                        onClick={() => onNavigate(step.id)}
                        className={`p-4 rounded-xl border text-left transition-all group ${
                            isDarkMode
                                ? 'bg-slate-800/50 border-slate-700 hover:bg-slate-800 hover:border-orange-500/50'
                                : 'bg-white border-slate-200 hover:border-orange-300 hover:shadow-md'
                        }`}
                    >
                        <div className="flex items-start justify-between gap-2">
                            <div>
                                <h4 className={`font-bold text-sm mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    {step.title}
                                </h4>
                                <p className={`text-xs mb-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    {step.desc}
                                </p>
                                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                                    isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600'
                                }`}>
                                    {step.reason}
                                </span>
                            </div>
                            <ArrowRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${
                                isDarkMode ? 'text-slate-500 group-hover:text-orange-400' : 'text-slate-400 group-hover:text-orange-500'
                            }`} />
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default NextSteps;
