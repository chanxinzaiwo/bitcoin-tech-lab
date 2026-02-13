import React, { useState } from 'react';
import {
  Layers, Lock, FileSignature, Code, ArrowRight,
  CheckCircle, XCircle, Zap, Shield, Eye,
  Terminal, Hash, Key, GitBranch, Cpu,
  AlertTriangle, Info, ChevronRight, Award
} from 'lucide-react';
import { useLab } from '../store/LabContext';
import StackDemo from './BitcoinScript/StackDemo';
import P2PKHDemo from './BitcoinScript/P2PKHDemo';
import Quiz from './Quiz';
import { scriptQuiz } from '../data/quizData';

const ScriptDemo = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const { isDarkMode } = useLab();

  const tabs = [
    { id: 'intro', label: '原理解析' },
    { id: 'stack', label: '堆栈机' },
    { id: 'p2pkh', label: 'P2PKH' },
    { id: 'types', label: '脚本类型' },
    { id: 'opcodes', label: '操作码' },
    { id: 'quiz', label: '测验' },
  ];

  return (
    <div className={`${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans min-h-screen`}>
      <nav className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm border-b sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-pink-600 text-white p-1.5 rounded-full">
                 <Code className="h-6 w-6" />
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} hidden sm:block`}>比特币脚本</span>
              <span className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} sm:hidden`}>Script</span>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? isDarkMode ? 'bg-pink-500/20 text-pink-400' : 'bg-pink-50 text-pink-700'
                      : isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'} scrollbar-hide`}>
             {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-block mr-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                    activeTab === tab.id
                      ? isDarkMode ? 'bg-pink-500/20 text-pink-400 border-pink-500/30' : 'bg-pink-50 text-pink-700 border-pink-200'
                      : isDarkMode ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-slate-300'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'intro' && <IntroSection changeTab={setActiveTab} isDarkMode={isDarkMode} />}
        {activeTab === 'stack' && <StackDemo isDarkMode={isDarkMode} />}
        {activeTab === 'p2pkh' && <P2PKHDemo isDarkMode={isDarkMode} />}
        {activeTab === 'types' && <ScriptTypesSection isDarkMode={isDarkMode} />}
        {activeTab === 'opcodes' && <OpCodesSection isDarkMode={isDarkMode} />}
        {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
      </main>

      <footer className={`max-w-6xl mx-auto px-4 py-6 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm`}>
        <p>脚本是比特币可编程性的基石，为了安全，它被设计为非图灵完备的。</p>
      </footer>
    </div>
  );
};

const IntroSection = ({ changeTab, isDarkMode }: { changeTab: (tab: string) => void; isDarkMode: boolean }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">智能合约的鼻祖</h1>
      <p className="text-pink-50 text-lg md:text-xl max-w-2xl leading-relaxed">
        比特币不仅仅是数字黄金，它还是一个可编程的货币系统。<br/>
        每一笔交易实际上都是一段名为 "Script" 的微型程序。只有当这程序返回 "TRUE" 时，资金才能被花费。
      </p>
      <button
        onClick={() => changeTab('stack')}
        className="mt-8 bg-white text-pink-700 hover:bg-pink-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
      >
        启动堆栈机 <ArrowRight className="h-5 w-5" />
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <Card title="基于堆栈 (Stack)" icon={<Layers className="h-8 w-8 text-pink-500" />} isDarkMode={isDarkMode}>
        比特币脚本语言非常简单，就像叠盘子一样。数据和指令依次入栈，处理完后出栈。这种设计消除了无限循环的可能性，极其安全。
      </Card>
      <Card title="UTXO 模型" icon={<Lock className="h-8 w-8 text-pink-500" />} isDarkMode={isDarkMode}>
        比特币没有"余额"概念。你拥有的实际上是"未花费的输出"。每次消费，你都在解开旧的锁（解锁脚本），并给剩余资金加上新的锁（锁定脚本）。
      </Card>
      <Card title="P2PKH" icon={<FileSignature className="h-8 w-8 text-pink-500" />} isDarkMode={isDarkMode}>
        "Pay to Public Key Hash" 是最常见的交易类型。它要求提供一个公钥和一个签名，且公钥的哈希值必须匹配地址。
      </Card>
    </div>
  </div>
);

// Script Types Comparison Section
const ScriptTypesSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const scriptTypes = [
    {
      name: 'P2PKH',
      fullName: 'Pay to Public Key Hash',
      prefix: '1...',
      era: '2009 (创世)',
      size: '~148 vB',
      privacy: 2,
      features: ['最经典的交易类型', '公钥哈希保护', '广泛支持'],
      limitations: ['体积较大', '无多签支持'],
      color: 'blue',
      scriptPubKey: 'OP_DUP OP_HASH160 <PKH> OP_EQUALVERIFY OP_CHECKSIG',
      scriptSig: '<Sig> <PubKey>',
    },
    {
      name: 'P2SH',
      fullName: 'Pay to Script Hash',
      prefix: '3...',
      era: '2012 (BIP16)',
      size: '~297 vB (多签)',
      privacy: 3,
      features: ['支持复杂脚本', '多签名支持', '发送方无需知道脚本'],
      limitations: ['赎回时暴露脚本', '费用由接收方承担'],
      color: 'purple',
      scriptPubKey: 'OP_HASH160 <ScriptHash> OP_EQUAL',
      scriptSig: '<Sig...> <RedeemScript>',
    },
    {
      name: 'P2WPKH',
      fullName: 'Pay to Witness PKH',
      prefix: 'bc1q...',
      era: '2017 (SegWit)',
      size: '~68 vB',
      privacy: 3,
      features: ['见证数据分离', '费用节省 38%', '解决交易可锻性'],
      limitations: ['旧钱包不支持'],
      color: 'emerald',
      scriptPubKey: 'OP_0 <20-byte PKH>',
      scriptSig: '(empty) | Witness: <Sig> <PubKey>',
    },
    {
      name: 'P2WSH',
      fullName: 'Pay to Witness Script Hash',
      prefix: 'bc1q...',
      era: '2017 (SegWit)',
      size: '~104 vB (多签)',
      privacy: 3,
      features: ['SegWit 多签', '脚本在见证区', '更低费用'],
      limitations: ['复杂度高'],
      color: 'cyan',
      scriptPubKey: 'OP_0 <32-byte ScriptHash>',
      scriptSig: '(empty) | Witness: <Sig...> <Script>',
    },
    {
      name: 'P2TR',
      fullName: 'Pay to Taproot',
      prefix: 'bc1p...',
      era: '2021 (Taproot)',
      size: '~57 vB',
      privacy: 5,
      features: ['Schnorr 签名', 'MAST 隐私', '单签与多签外观相同'],
      limitations: ['最新标准', '采用中'],
      color: 'orange',
      scriptPubKey: 'OP_1 <32-byte PubKey>',
      scriptSig: '(empty) | Witness: <Schnorr Sig>',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; light: string }> = {
      blue: {
        bg: isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-500',
        light: isDarkMode ? 'bg-blue-500/10' : 'bg-blue-50/50',
      },
      purple: {
        bg: isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50',
        border: 'border-purple-500',
        text: 'text-purple-500',
        light: isDarkMode ? 'bg-purple-500/10' : 'bg-purple-50/50',
      },
      emerald: {
        bg: isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-500',
        light: isDarkMode ? 'bg-emerald-500/10' : 'bg-emerald-50/50',
      },
      cyan: {
        bg: isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-50',
        border: 'border-cyan-500',
        text: 'text-cyan-500',
        light: isDarkMode ? 'bg-cyan-500/10' : 'bg-cyan-50/50',
      },
      orange: {
        bg: isDarkMode ? 'bg-orange-500/20' : 'bg-orange-50',
        border: 'border-orange-500',
        text: 'text-orange-500',
        light: isDarkMode ? 'bg-orange-500/10' : 'bg-orange-50/50',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          比特币脚本类型演进
        </h2>
        <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
          比特币脚本从简单的 P2PKH 发展到支持复杂智能合约的 Taproot，每一次升级都在安全性、隐私性和效率之间寻找平衡。
        </p>
      </div>

      {/* Evolution Timeline */}
      <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <h3 className={`text-lg font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          演进时间线
        </h3>
        <div className="relative">
          <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`} />
          <div className="space-y-6">
            {scriptTypes.map((type, index) => {
              const colors = getColorClasses(type.color);
              return (
                <div key={type.name} className="flex items-start gap-4 ml-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${colors.bg} border-2 ${colors.border}`}>
                    <span className={`text-xs font-bold ${colors.text}`}>{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{type.name}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${colors.bg} ${colors.text}`}>{type.era}</span>
                    </div>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{type.fullName}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Script Type Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scriptTypes.map((type) => {
          const colors = getColorClasses(type.color);
          return (
            <div
              key={type.name}
              className={`rounded-xl p-5 border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className={`text-lg font-bold ${colors.text}`}>{type.name}</h4>
                  <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{type.fullName}</p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-mono ${colors.bg} ${colors.text}`}>
                  {type.prefix}
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>典型大小</span>
                  <p className={`font-mono text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{type.size}</p>
                </div>

                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>隐私等级</span>
                  <div className="flex gap-1 mt-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        className={`w-4 h-2 rounded-sm ${
                          level <= type.privacy
                            ? colors.text.replace('text-', 'bg-')
                            : isDarkMode ? 'bg-slate-700' : 'bg-slate-200'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>优点</span>
                  <ul className="mt-1 space-y-1">
                    {type.features.map((feature, i) => (
                      <li key={i} className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                        <CheckCircle className="w-3 h-3 text-emerald-500 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>限制</span>
                  <ul className="mt-1 space-y-1">
                    {type.limitations.map((limitation, i) => (
                      <li key={i} className={`text-xs flex items-center gap-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        <XCircle className="w-3 h-3 text-amber-500 shrink-0" />
                        {limitation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comparison Table */}
      <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className={`p-4 border-b ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
          <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
            详细对比表
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
              <tr>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>脚本类型</th>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ScriptPubKey</th>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>ScriptSig / Witness</th>
              </tr>
            </thead>
            <tbody>
              {scriptTypes.map((type, index) => (
                <tr key={type.name} className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                  <td className={`px-4 py-3 font-bold ${getColorClasses(type.color).text}`}>{type.name}</td>
                  <td className={`px-4 py-3 font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {type.scriptPubKey}
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {type.scriptSig}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`rounded-2xl p-6 border-2 ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100'}`}>
            <Zap className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <h4 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
              推荐使用 P2TR (Taproot)
            </h4>
            <p className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>
              如果你的钱包支持，优先使用 Taproot 地址 (bc1p...)。它提供最佳的隐私保护、最低的交易费用，
              并且单签名交易与复杂多签交易在链上看起来完全相同，大大增强了隐私性。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// OP_CODE Reference Section
const OpCodesSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: '全部' },
    { id: 'constants', label: '常量' },
    { id: 'flow', label: '流程控制' },
    { id: 'stack', label: '堆栈操作' },
    { id: 'arithmetic', label: '算术运算' },
    { id: 'crypto', label: '密码学' },
    { id: 'locktime', label: '时间锁' },
  ];

  const opcodes = [
    // Constants
    { name: 'OP_0', hex: '0x00', category: 'constants', desc: '将空字节数组推入堆栈（代表 FALSE）', example: 'OP_0 → []' },
    { name: 'OP_1 ~ OP_16', hex: '0x51-0x60', category: 'constants', desc: '将 1-16 的数字推入堆栈', example: 'OP_5 → [5]' },
    { name: 'OP_PUSHDATA', hex: '0x01-0x4e', category: 'constants', desc: '将指定字节数的数据推入堆栈', example: '<20 bytes> → [data]' },

    // Flow Control
    { name: 'OP_IF', hex: '0x63', category: 'flow', desc: '如果栈顶非零，执行后续语句', example: '1 OP_IF [exec] OP_ENDIF' },
    { name: 'OP_NOTIF', hex: '0x64', category: 'flow', desc: '如果栈顶为零，执行后续语句', example: '0 OP_NOTIF [exec] OP_ENDIF' },
    { name: 'OP_ELSE', hex: '0x67', category: 'flow', desc: 'IF/NOTIF 的否定分支', example: 'OP_IF [A] OP_ELSE [B] OP_ENDIF' },
    { name: 'OP_ENDIF', hex: '0x68', category: 'flow', desc: '结束 IF/ELSE 条件块', example: 'OP_IF ... OP_ENDIF' },
    { name: 'OP_VERIFY', hex: '0x69', category: 'flow', desc: '如果栈顶为假，立即失败', example: '1 OP_VERIFY → (continues)' },
    { name: 'OP_RETURN', hex: '0x6a', category: 'flow', desc: '标记输出不可花费，常用于存储数据', example: 'OP_RETURN <data> → unspendable' },

    // Stack Operations
    { name: 'OP_DUP', hex: '0x76', category: 'stack', desc: '复制栈顶元素', example: '[a] → [a, a]' },
    { name: 'OP_DROP', hex: '0x75', category: 'stack', desc: '移除栈顶元素', example: '[a, b] → [a]' },
    { name: 'OP_SWAP', hex: '0x7c', category: 'stack', desc: '交换栈顶两个元素', example: '[a, b] → [b, a]' },
    { name: 'OP_OVER', hex: '0x78', category: 'stack', desc: '复制栈顶第二个元素到栈顶', example: '[a, b] → [a, b, a]' },
    { name: 'OP_ROT', hex: '0x7b', category: 'stack', desc: '将第三个元素移到栈顶', example: '[a, b, c] → [b, c, a]' },
    { name: 'OP_2DUP', hex: '0x6e', category: 'stack', desc: '复制栈顶两个元素', example: '[a, b] → [a, b, a, b]' },
    { name: 'OP_PICK', hex: '0x79', category: 'stack', desc: '复制栈中第 n 个元素到栈顶', example: '[a, b, c] 2 OP_PICK → [a, b, c, a]' },

    // Arithmetic
    { name: 'OP_ADD', hex: '0x93', category: 'arithmetic', desc: '弹出两个数相加', example: '[2, 3] OP_ADD → [5]' },
    { name: 'OP_SUB', hex: '0x94', category: 'arithmetic', desc: '弹出两个数相减 (b-a)', example: '[5, 3] OP_SUB → [2]' },
    { name: 'OP_1ADD', hex: '0x8b', category: 'arithmetic', desc: '栈顶加 1', example: '[5] OP_1ADD → [6]' },
    { name: 'OP_1SUB', hex: '0x8c', category: 'arithmetic', desc: '栈顶减 1', example: '[5] OP_1SUB → [4]' },
    { name: 'OP_NEGATE', hex: '0x8f', category: 'arithmetic', desc: '取负数', example: '[5] OP_NEGATE → [-5]' },
    { name: 'OP_ABS', hex: '0x90', category: 'arithmetic', desc: '取绝对值', example: '[-5] OP_ABS → [5]' },
    { name: 'OP_MIN', hex: '0xa3', category: 'arithmetic', desc: '返回较小值', example: '[2, 5] OP_MIN → [2]' },
    { name: 'OP_MAX', hex: '0xa4', category: 'arithmetic', desc: '返回较大值', example: '[2, 5] OP_MAX → [5]' },

    // Cryptographic
    { name: 'OP_HASH160', hex: '0xa9', category: 'crypto', desc: 'SHA256 + RIPEMD160 双重哈希', example: '<pubkey> → <20-byte hash>' },
    { name: 'OP_HASH256', hex: '0xaa', category: 'crypto', desc: 'SHA256 + SHA256 双重哈希', example: '<data> → <32-byte hash>' },
    { name: 'OP_SHA256', hex: '0xa8', category: 'crypto', desc: 'SHA256 哈希', example: '<data> → <32-byte hash>' },
    { name: 'OP_RIPEMD160', hex: '0xa6', category: 'crypto', desc: 'RIPEMD160 哈希', example: '<data> → <20-byte hash>' },
    { name: 'OP_CHECKSIG', hex: '0xac', category: 'crypto', desc: '验证签名，成功返回 1', example: '<sig> <pubkey> → TRUE/FALSE' },
    { name: 'OP_CHECKSIGVERIFY', hex: '0xad', category: 'crypto', desc: 'CHECKSIG + VERIFY 组合', example: '<sig> <pubkey> → (continues or fails)' },
    { name: 'OP_CHECKMULTISIG', hex: '0xae', category: 'crypto', desc: 'M-of-N 多重签名验证', example: '0 <sigs...> M <pubs...> N → TRUE/FALSE' },
    { name: 'OP_EQUAL', hex: '0x87', category: 'crypto', desc: '比较两个元素是否相等', example: '[a, a] → TRUE' },
    { name: 'OP_EQUALVERIFY', hex: '0x88', category: 'crypto', desc: 'EQUAL + VERIFY 组合', example: '[a, a] → (continues)' },

    // Timelock
    { name: 'OP_CHECKLOCKTIMEVERIFY', hex: '0xb1', category: 'locktime', desc: '验证 nLockTime 绝对时间锁 (BIP65)', example: '<time> OP_CLTV' },
    { name: 'OP_CHECKSEQUENCEVERIFY', hex: '0xb2', category: 'locktime', desc: '验证 nSequence 相对时间锁 (BIP112)', example: '<blocks> OP_CSV' },
  ];

  const filteredOpcodes = selectedCategory === 'all'
    ? opcodes
    : opcodes.filter(op => op.category === selectedCategory);

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, string> = {
      constants: 'text-blue-500',
      flow: 'text-purple-500',
      stack: 'text-emerald-500',
      arithmetic: 'text-amber-500',
      crypto: 'text-pink-500',
      locktime: 'text-cyan-500',
    };
    return colors[cat] || 'text-slate-500';
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${isDarkMode ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
            <Terminal className="w-6 h-6 text-pink-500" />
          </div>
          <div>
            <h2 className={`text-2xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
              Bitcoin Script 操作码参考
            </h2>
            <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
              比特币脚本语言约有 100+ 个操作码，这里列出了最常用的部分。脚本是非图灵完备的，
              没有循环结构，这保证了每个脚本都会在有限步骤内终止。
            </p>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === cat.id
                ? isDarkMode ? 'bg-pink-500/20 text-pink-400 border border-pink-500/30' : 'bg-pink-100 text-pink-700 border border-pink-200'
                : isDarkMode ? 'bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Important Notes */}
      <div className={`rounded-xl p-4 flex items-start gap-3 ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-amber-50 border border-amber-200'}`}>
        <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
        <div>
          <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-800'}`}>
            <strong>堆栈方向说明：</strong>堆栈显示中，最右边的元素是栈顶。例如 [a, b] 表示 a 在栈底，b 在栈顶。
            操作码总是从栈顶开始操作。
          </p>
        </div>
      </div>

      {/* Opcodes Table */}
      <div className={`rounded-2xl overflow-hidden border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className={isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}>
              <tr>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>操作码</th>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>十六进制</th>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>描述</th>
                <th className={`px-4 py-3 text-left font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>示例</th>
              </tr>
            </thead>
            <tbody>
              {filteredOpcodes.map((op, index) => (
                <tr key={op.name} className={`border-t ${isDarkMode ? 'border-slate-800 hover:bg-slate-800/50' : 'border-slate-100 hover:bg-slate-50'}`}>
                  <td className={`px-4 py-3 font-mono font-bold ${getCategoryColor(op.category)}`}>
                    {op.name}
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                    {op.hex}
                  </td>
                  <td className={`px-4 py-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                    {op.desc}
                  </td>
                  <td className={`px-4 py-3 font-mono text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    {op.example}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Common Patterns */}
      <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          常见脚本模式
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>P2PKH 标准交易</h4>
            <div className={`font-mono text-xs p-3 rounded ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'}`}>
              OP_DUP OP_HASH160 {'<'}PKH{'>'} OP_EQUALVERIFY OP_CHECKSIG
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              验证公钥哈希匹配且签名有效
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`}>2-of-3 多签</h4>
            <div className={`font-mono text-xs p-3 rounded ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'}`}>
              OP_2 {'<'}PK1{'>'} {'<'}PK2{'>'} {'<'}PK3{'>'} OP_3 OP_CHECKMULTISIG
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              需要 3 个公钥中的 2 个签名
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>时间锁 (CLTV)</h4>
            <div className={`font-mono text-xs p-3 rounded ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'}`}>
              {'<'}locktime{'>'} OP_CHECKLOCKTIMEVERIFY OP_DROP {'<'}normal script{'>'}
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              只有在指定时间后才能花费
            </p>
          </div>

          <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
            <h4 className={`font-bold mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>哈希锁 (HTLC)</h4>
            <div className={`font-mono text-xs p-3 rounded ${isDarkMode ? 'bg-slate-900 text-slate-300' : 'bg-white text-slate-700'}`}>
              OP_HASH160 {'<'}hash{'>'} OP_EQUAL OP_IF {'<'}receiverPK{'>'} OP_ELSE ...
            </div>
            <p className={`text-xs mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              原子交换和闪电网络的基础
            </p>
          </div>
        </div>
      </div>

      {/* Disabled Opcodes */}
      <div className={`rounded-2xl p-6 ${isDarkMode ? 'bg-slate-900 border border-slate-800' : 'bg-white border border-slate-200'}`}>
        <h3 className={`text-lg font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          <Shield className="w-5 h-5 text-red-500" />
          已禁用的操作码
        </h3>
        <p className={`mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          以下操作码因安全原因已被禁用，执行时会导致脚本立即失败：
        </p>
        <div className="flex flex-wrap gap-2">
          {['OP_CAT', 'OP_SUBSTR', 'OP_MUL', 'OP_DIV', 'OP_MOD', 'OP_LSHIFT', 'OP_RSHIFT', 'OP_AND', 'OP_OR', 'OP_XOR'].map((op) => (
            <span
              key={op}
              className={`px-3 py-1 rounded-full text-xs font-mono ${isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600'}`}
            >
              {op}
            </span>
          ))}
        </div>
        <p className={`mt-4 text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
          注：社区正在讨论通过软分叉重新启用部分操作码（如 OP_CAT）以增强比特币的可编程性。
        </p>
      </div>
    </div>
  );
};

const Card = ({ title, icon, children, isDarkMode }: { title: string; icon: React.ReactNode; children: React.ReactNode; isDarkMode: boolean }) => (
  <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
    <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
    <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
    <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
  </div>
);

// Quiz Section
const QuizSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${isDarkMode ? 'bg-pink-500/20' : 'bg-pink-100'}`}>
                    <Award className="w-8 h-8 text-pink-500" />
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>
                    比特币脚本知识测验
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    测试你对比特币脚本的理解
                </p>
            </div>
            <Quiz quizData={scriptQuiz} />
        </div>
    );
};

export default ScriptDemo;