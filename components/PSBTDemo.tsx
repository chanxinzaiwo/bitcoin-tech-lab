import React, { useState } from 'react';
import { FileText, Users, PenTool, CheckCircle, XCircle, AlertTriangle, Plus, ArrowRight, Laptop, Smartphone, HardDrive, Send, Eye, Lock, Unlock, Layers, Copy, Check } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { getQuizByModule } from '../data/quizData';

interface PSBTInput {
    txid: string;
    vout: number;
    value: number;
    signed: boolean[];
    requiredSigs: number;
}

interface PSBTOutput {
    address: string;
    value: number;
}

const PSBTDemo: React.FC = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'structure', label: '结构解析' },
        { id: 'workflow', label: '工作流程' },
        { id: 'builder', label: '交互构建' },
        { id: 'usecases', label: '应用场景' },
        { id: 'quiz', label: '测验' }
    ];

    // PSBT Builder State
    const [inputs, setInputs] = useState<PSBTInput[]>([
        { txid: 'a1b2c3...', vout: 0, value: 50000, signed: [false, false], requiredSigs: 2 },
    ]);
    const [outputs, setOutputs] = useState<PSBTOutput[]>([
        { address: 'bc1q...recipient', value: 40000 },
        { address: 'bc1q...change', value: 9000 },
    ]);
    const [currentRole, setCurrentRole] = useState<'creator' | 'signer1' | 'signer2' | 'finalizer' | 'broadcaster'>('creator');
    const [psbtState, setPsbtState] = useState<'unsigned' | 'partial' | 'complete' | 'finalized' | 'broadcast'>('unsigned');
    const [copiedField, setCopiedField] = useState<string | null>(null);

    // Workflow demo state
    const [workflowStep, setWorkflowStep] = useState(0);

    const roles = [
        { id: 'creator', label: '创建者', icon: FileText, color: 'blue' },
        { id: 'signer1', label: '签名者 1', icon: PenTool, color: 'purple' },
        { id: 'signer2', label: '签名者 2', icon: PenTool, color: 'indigo' },
        { id: 'finalizer', label: '终结者', icon: CheckCircle, color: 'green' },
        { id: 'broadcaster', label: '广播者', icon: Send, color: 'orange' },
    ];

    const handleSign = (inputIndex: number, signerIndex: number) => {
        const newInputs = [...inputs];
        newInputs[inputIndex].signed[signerIndex] = true;
        setInputs(newInputs);

        // Check if all inputs have enough signatures
        const allComplete = newInputs.every(input =>
            input.signed.filter(s => s).length >= input.requiredSigs
        );

        if (allComplete) {
            setPsbtState('complete');
        } else if (newInputs.some(input => input.signed.some(s => s))) {
            setPsbtState('partial');
        }
    };

    const handleFinalize = () => {
        if (psbtState === 'complete') {
            setPsbtState('finalized');
            setCurrentRole('broadcaster');
        }
    };

    const handleBroadcast = () => {
        if (psbtState === 'finalized') {
            setPsbtState('broadcast');
        }
    };

    const resetBuilder = () => {
        setInputs([
            { txid: 'a1b2c3...', vout: 0, value: 50000, signed: [false, false], requiredSigs: 2 },
        ]);
        setOutputs([
            { address: 'bc1q...recipient', value: 40000 },
            { address: 'bc1q...change', value: 9000 },
        ]);
        setCurrentRole('creator');
        setPsbtState('unsigned');
    };

    const copyToClipboard = (text: string, field: string) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const generatePSBTHex = () => {
        // Simulated PSBT hex based on state
        const statePrefix = {
            'unsigned': '70736274ff01',
            'partial': '70736274ff01007',
            'complete': '70736274ff0100a',
            'finalized': '70736274ff0100f',
            'broadcast': '02000000',
        };
        return statePrefix[psbtState] + '0'.repeat(40) + '...';
    };

    const quizData = getQuizByModule('psbt');

    return (
        <div className={`min-h-screen py-8 ${isDarkMode ? 'bg-slate-950' : 'bg-slate-50'}`}>
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 mb-4">
                        <FileText className="w-8 h-8 text-white" />
                    </div>
                    <h1 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        PSBT 部分签名交易
                    </h1>
                    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        Partially Signed Bitcoin Transaction - 多方协作签名标准
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
                                    ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg'
                                    : isDarkMode
                                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                        : 'bg-white text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className={`rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} p-6`}>

                    {/* Intro Tab */}
                    {activeTab === 'intro' && (
                        <div className="space-y-6">
                            <div className={`p-6 rounded-xl ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    什么是 PSBT？
                                </h3>
                                <p className={`${isDarkMode ? 'text-slate-300' : 'text-slate-700'} leading-relaxed`}>
                                    PSBT（Partially Signed Bitcoin Transaction）是 BIP-174 定义的一种标准格式，
                                    用于在多个参与方之间传递未完成的比特币交易。它允许不同的设备和软件安全地协作创建、
                                    签名和广播交易，是硬件钱包、多签钱包和离线签名的基础。
                                </p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <Layers className="w-5 h-5 text-emerald-500" />
                                        核心概念
                                    </h4>
                                    <div className="space-y-3">
                                        {[
                                            { term: 'Creator', desc: '创建基本交易结构' },
                                            { term: 'Updater', desc: '添加签名所需的元数据' },
                                            { term: 'Signer', desc: '使用私钥签署输入' },
                                            { term: 'Combiner', desc: '合并多个部分签名' },
                                            { term: 'Finalizer', desc: '组装最终的脚本' },
                                            { term: 'Extractor', desc: '提取可广播的交易' },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`font-mono font-medium ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                    {item.term}
                                                </span>
                                                <span className={`text-sm ml-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    - {item.desc}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <h4 className={`font-bold mb-3 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        <CheckCircle className="w-5 h-5 text-teal-500" />
                                        主要优势
                                    </h4>
                                    <div className="space-y-2">
                                        {[
                                            { title: '互操作性', desc: '不同钱包软件可以协作' },
                                            { title: '离线安全', desc: '私钥无需接触网络' },
                                            { title: '多签支持', desc: '天然支持多方签名' },
                                            { title: '硬件兼容', desc: '硬件钱包的标准接口' },
                                            { title: '审计友好', desc: '签名前可完整审查交易' },
                                        ].map((item, i) => (
                                            <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <span className={`font-medium ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{item.title}</span>
                                                <span className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{item.desc}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    PSBT 工作流程概览
                                </h4>
                                <div className="flex flex-wrap items-center justify-center gap-2">
                                    {[
                                        { icon: FileText, label: '创建', color: 'blue' },
                                        { icon: Eye, label: '更新', color: 'purple' },
                                        { icon: PenTool, label: '签名', color: 'indigo' },
                                        { icon: Layers, label: '合并', color: 'cyan' },
                                        { icon: CheckCircle, label: '终结', color: 'green' },
                                        { icon: Send, label: '广播', color: 'orange' },
                                    ].map((step, i) => (
                                        <React.Fragment key={i}>
                                            <div className={`flex flex-col items-center p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                <step.icon className={`w-6 h-6 mb-1 text-${step.color}-500`} />
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>{step.label}</span>
                                            </div>
                                            {i < 5 && <ArrowRight className={`w-4 h-4 ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`} />}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-teal-500/10 border border-teal-500/20' : 'bg-teal-50 border border-teal-200'}`}>
                                <p className={`text-sm ${isDarkMode ? 'text-teal-300' : 'text-teal-700'}`}>
                                    <strong>BIP-174 与 BIP-370：</strong>BIP-174 定义了原始 PSBT 格式（版本 0），
                                    BIP-370 引入了 PSBT 版本 2，增加了对 Taproot 等新功能的支持，并改进了字段结构。
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Structure Tab */}
                    {activeTab === 'structure' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    PSBT 数据结构
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-600'}`}>
                                    PSBT 使用键值对格式存储交易数据和元数据，分为全局、输入和输出三个部分。
                                </p>
                            </div>

                            {/* Magic Bytes */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    PSBT 格式
                                </h4>
                                <div className={`p-4 rounded-lg font-mono text-sm overflow-x-auto ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="px-2 py-1 rounded bg-purple-500/20 text-purple-400">70736274</span>
                                        <span className={`text-xs self-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>魔数 "psbt"</span>
                                        <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-400">ff</span>
                                        <span className={`text-xs self-center ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>分隔符</span>
                                        <span className="px-2 py-1 rounded bg-green-500/20 text-green-400">[全局数据]</span>
                                        <span className="px-2 py-1 rounded bg-amber-500/20 text-amber-400">[输入数据...]</span>
                                        <span className="px-2 py-1 rounded bg-rose-500/20 text-rose-400">[输出数据...]</span>
                                    </div>
                                </div>
                            </div>

                            {/* Global Fields */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                    全局字段 (Global)
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        { key: '0x00', name: 'PSBT_GLOBAL_UNSIGNED_TX', desc: '未签名的原始交易' },
                                        { key: '0x01', name: 'PSBT_GLOBAL_XPUB', desc: '扩展公钥（用于派生）' },
                                        { key: '0xFB', name: 'PSBT_GLOBAL_VERSION', desc: 'PSBT 版本号' },
                                        { key: '0xFC', name: 'PSBT_GLOBAL_PROPRIETARY', desc: '专有数据' },
                                    ].map((field, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <code className="px-2 py-0.5 rounded bg-green-500/20 text-green-400 text-xs">{field.key}</code>
                                                <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{field.name}</span>
                                            </div>
                                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{field.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Input Fields */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    输入字段 (Per-Input)
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        { key: '0x00', name: 'NON_WITNESS_UTXO', desc: '完整的前序交易' },
                                        { key: '0x01', name: 'WITNESS_UTXO', desc: '见证 UTXO（金额+脚本）' },
                                        { key: '0x02', name: 'PARTIAL_SIG', desc: '部分签名' },
                                        { key: '0x03', name: 'SIGHASH_TYPE', desc: '签名哈希类型' },
                                        { key: '0x04', name: 'REDEEM_SCRIPT', desc: 'P2SH 赎回脚本' },
                                        { key: '0x05', name: 'WITNESS_SCRIPT', desc: 'P2WSH 见证脚本' },
                                        { key: '0x06', name: 'BIP32_DERIVATION', desc: '密钥派生路径' },
                                        { key: '0x07', name: 'FINAL_SCRIPTSIG', desc: '最终脚本签名' },
                                    ].map((field, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <code className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 text-xs">{field.key}</code>
                                                <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{field.name}</span>
                                            </div>
                                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{field.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Output Fields */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    输出字段 (Per-Output)
                                </h4>
                                <div className="grid md:grid-cols-2 gap-3">
                                    {[
                                        { key: '0x00', name: 'REDEEM_SCRIPT', desc: '输出的赎回脚本' },
                                        { key: '0x01', name: 'WITNESS_SCRIPT', desc: '输出的见证脚本' },
                                        { key: '0x02', name: 'BIP32_DERIVATION', desc: '输出密钥派生路径' },
                                    ].map((field, i) => (
                                        <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <code className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-xs">{field.key}</code>
                                                <span className={`font-mono text-xs ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{field.name}</span>
                                            </div>
                                            <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{field.desc}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Workflow Tab */}
                    {activeTab === 'workflow' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    多签钱包签名流程
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-600'}`}>
                                    以 2-of-3 多签为例，展示 PSBT 如何在不同参与方之间传递和签名。
                                </p>
                            </div>

                            {/* Workflow Steps */}
                            <div className="space-y-4">
                                {[
                                    {
                                        step: 1,
                                        title: '协调者创建 PSBT',
                                        actor: '观察钱包',
                                        icon: Laptop,
                                        desc: '在联网设备上创建未签名的 PSBT，包含所有必要的 UTXO 信息和输出',
                                        details: ['选择输入 UTXO', '设置输出地址和金额', '添加 BIP32 派生路径', '导出 PSBT 文件'],
                                    },
                                    {
                                        step: 2,
                                        title: '签名者 A 签名',
                                        actor: '硬件钱包 A',
                                        icon: HardDrive,
                                        desc: '第一个签名者使用硬件钱包离线签名',
                                        details: ['导入 PSBT', '验证交易详情', '使用私钥签名', '导出部分签名的 PSBT'],
                                    },
                                    {
                                        step: 3,
                                        title: '签名者 B 签名',
                                        actor: '手机钱包 B',
                                        icon: Smartphone,
                                        desc: '第二个签名者添加自己的签名',
                                        details: ['扫描或导入 PSBT', '确认交易信息', '添加第二个签名', '导出完成的 PSBT'],
                                    },
                                    {
                                        step: 4,
                                        title: '终结并广播',
                                        actor: '任意节点',
                                        icon: Send,
                                        desc: '组装最终交易并广播到网络',
                                        details: ['合并所有签名', '生成最终脚本', '提取原始交易', '广播到比特币网络'],
                                    },
                                ].map((item, i) => (
                                    <div
                                        key={i}
                                        className={`p-5 rounded-xl transition-all ${
                                            workflowStep === i
                                                ? isDarkMode
                                                    ? 'bg-emerald-900/30 border-2 border-emerald-500/50'
                                                    : 'bg-emerald-50 border-2 border-emerald-300'
                                                : isDarkMode
                                                    ? 'bg-slate-800'
                                                    : 'bg-slate-50'
                                        }`}
                                        onClick={() => setWorkflowStep(i)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                                                workflowStep >= i
                                                    ? 'bg-emerald-500 text-white'
                                                    : isDarkMode ? 'bg-slate-700 text-slate-400' : 'bg-slate-200 text-slate-500'
                                            }`}>
                                                {workflowStep > i ? <CheckCircle className="w-6 h-6" /> : <item.icon className="w-6 h-6" />}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                        步骤 {item.step}: {item.title}
                                                    </h4>
                                                    <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-200 text-slate-600'}`}>
                                                        {item.actor}
                                                    </span>
                                                </div>
                                                <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {item.desc}
                                                </p>
                                                {workflowStep === i && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                        {item.details.map((detail, j) => (
                                                            <div key={j} className={`p-2 rounded text-sm flex items-center gap-2 ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                                                <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                                                <span className={isDarkMode ? 'text-slate-300' : 'text-slate-700'}>{detail}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setWorkflowStep(Math.max(0, workflowStep - 1))}
                                    disabled={workflowStep === 0}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        workflowStep > 0
                                            ? isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                                            : isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    上一步
                                </button>
                                <button
                                    onClick={() => setWorkflowStep(Math.min(3, workflowStep + 1))}
                                    disabled={workflowStep === 3}
                                    className={`px-4 py-2 rounded-lg font-medium ${
                                        workflowStep < 3
                                            ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                            : isDarkMode ? 'bg-slate-800 text-slate-600' : 'bg-slate-100 text-slate-400'
                                    }`}
                                >
                                    下一步
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Builder Tab */}
                    {activeTab === 'builder' && (
                        <div className="space-y-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'}`}>
                                <h3 className={`font-bold mb-2 ${isDarkMode ? 'text-emerald-400' : 'text-emerald-700'}`}>
                                    PSBT 交互式构建器
                                </h3>
                                <p className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-600'}`}>
                                    模拟 2-of-2 多签交易的 PSBT 创建和签名过程。
                                </p>
                            </div>

                            {/* Role Selector */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    当前角色
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {roles.map(role => (
                                        <button
                                            key={role.id}
                                            onClick={() => setCurrentRole(role.id as typeof currentRole)}
                                            disabled={
                                                (role.id === 'signer1' && psbtState === 'unsigned') ||
                                                (role.id === 'signer2' && !inputs[0].signed[0]) ||
                                                (role.id === 'finalizer' && psbtState !== 'complete') ||
                                                (role.id === 'broadcaster' && psbtState !== 'finalized')
                                            }
                                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-all ${
                                                currentRole === role.id
                                                    ? `bg-${role.color}-500 text-white`
                                                    : isDarkMode
                                                        ? 'bg-slate-700 text-slate-300 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed'
                                                        : 'bg-white text-slate-600 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed'
                                            }`}
                                        >
                                            <role.icon className="w-4 h-4" />
                                            {role.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* PSBT State */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        PSBT 状态
                                    </h4>
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        psbtState === 'broadcast' ? 'bg-green-500/20 text-green-400' :
                                        psbtState === 'finalized' ? 'bg-blue-500/20 text-blue-400' :
                                        psbtState === 'complete' ? 'bg-purple-500/20 text-purple-400' :
                                        psbtState === 'partial' ? 'bg-amber-500/20 text-amber-400' :
                                        'bg-slate-500/20 text-slate-400'
                                    }`}>
                                        {psbtState === 'broadcast' ? '已广播' :
                                         psbtState === 'finalized' ? '已终结' :
                                         psbtState === 'complete' ? '签名完成' :
                                         psbtState === 'partial' ? '部分签名' : '未签名'}
                                    </span>
                                </div>

                                {/* Inputs */}
                                <div className="space-y-3 mb-4">
                                    <h5 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        输入 (Inputs)
                                    </h5>
                                    {inputs.map((input, i) => (
                                        <div key={i} className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <div className="flex items-center justify-between mb-3">
                                                <div>
                                                    <span className={`font-mono text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                        {input.txid}:{input.vout}
                                                    </span>
                                                    <span className={`ml-3 text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                        {input.value.toLocaleString()} sats
                                                    </span>
                                                </div>
                                                <span className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                                    {input.requiredSigs}-of-{input.signed.length} 多签
                                                </span>
                                            </div>
                                            <div className="flex gap-2">
                                                {input.signed.map((signed, j) => (
                                                    <button
                                                        key={j}
                                                        onClick={() => handleSign(i, j)}
                                                        disabled={signed || currentRole !== `signer${j + 1}` || psbtState === 'finalized' || psbtState === 'broadcast'}
                                                        className={`flex-1 py-2 rounded flex items-center justify-center gap-2 transition-all ${
                                                            signed
                                                                ? 'bg-green-500/20 text-green-400'
                                                                : currentRole === `signer${j + 1}`
                                                                    ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                                                                    : isDarkMode
                                                                        ? 'bg-slate-600 text-slate-400'
                                                                        : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                    >
                                                        {signed ? <CheckCircle className="w-4 h-4" /> : <PenTool className="w-4 h-4" />}
                                                        签名者 {j + 1}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Outputs */}
                                <div className="space-y-3">
                                    <h5 className={`text-sm font-medium ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        输出 (Outputs)
                                    </h5>
                                    {outputs.map((output, i) => (
                                        <div key={i} className={`p-3 rounded-lg flex items-center justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                            <span className={`font-mono text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                                {output.address}
                                            </span>
                                            <span className={`text-sm ${isDarkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                                                {output.value.toLocaleString()} sats
                                            </span>
                                        </div>
                                    ))}
                                    <div className={`p-2 rounded text-center text-sm ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`}>
                                        手续费: {inputs.reduce((sum, i) => sum + i.value, 0) - outputs.reduce((sum, o) => sum + o.value, 0)} sats
                                    </div>
                                </div>
                            </div>

                            {/* PSBT Hex Output */}
                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        PSBT Hex
                                    </h4>
                                    <button
                                        onClick={() => copyToClipboard(generatePSBTHex(), 'psbt')}
                                        className={`p-2 rounded ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                                    >
                                        {copiedField === 'psbt' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    </button>
                                </div>
                                <div className={`p-3 rounded-lg font-mono text-xs break-all ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700'}`}>
                                    {generatePSBTHex()}
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                {currentRole === 'finalizer' && psbtState === 'complete' && (
                                    <button
                                        onClick={handleFinalize}
                                        className="flex-1 py-3 rounded-lg font-medium bg-gradient-to-r from-emerald-500 to-teal-600 text-white hover:shadow-lg"
                                    >
                                        终结 PSBT
                                    </button>
                                )}
                                {currentRole === 'broadcaster' && psbtState === 'finalized' && (
                                    <button
                                        onClick={handleBroadcast}
                                        className="flex-1 py-3 rounded-lg font-medium bg-gradient-to-r from-orange-500 to-amber-600 text-white hover:shadow-lg"
                                    >
                                        广播交易
                                    </button>
                                )}
                                <button
                                    onClick={resetBuilder}
                                    className={`px-6 py-3 rounded-lg font-medium ${isDarkMode ? 'bg-slate-700 text-slate-300 hover:bg-slate-600' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                                >
                                    重置
                                </button>
                            </div>

                            {psbtState === 'broadcast' && (
                                <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-green-500/10 border border-green-500/20' : 'bg-green-50 border border-green-200'}`}>
                                    <div className="flex items-center gap-3">
                                        <CheckCircle className="w-6 h-6 text-green-500" />
                                        <div>
                                            <h4 className={`font-bold ${isDarkMode ? 'text-green-400' : 'text-green-700'}`}>
                                                交易已广播！
                                            </h4>
                                            <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-600'}`}>
                                                交易已成功提交到比特币网络，等待确认。
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Use Cases Tab */}
                    {activeTab === 'usecases' && (
                        <div className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                            <HardDrive className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            硬件钱包集成
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        PSBT 是硬件钱包与软件钱包通信的标准接口。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• Ledger、Trezor 原生支持</li>
                                            <li>• 私钥永不离开设备</li>
                                            <li>• 通过 USB/蓝牙传输 PSBT</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
                                            <Users className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            多签钱包
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        在多个签名者之间安全传递交易。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 企业资产管理</li>
                                            <li>• 家庭财务共管</li>
                                            <li>• 托管服务</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
                                            <Lock className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            冷存储签名
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        离线设备上安全签名交易。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• 气隙隔离签名</li>
                                            <li>• QR 码传输 PSBT</li>
                                            <li>• SD 卡离线传输</li>
                                        </ul>
                                    </div>
                                </div>

                                <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                                            <Layers className="w-5 h-5 text-white" />
                                        </div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                            CoinJoin 协调
                                        </h4>
                                    </div>
                                    <p className={`text-sm mb-3 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                        多方隐私交易的协调工具。
                                    </p>
                                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-white'}`}>
                                        <ul className={`text-sm space-y-1 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                            <li>• Wasabi Wallet CoinJoin</li>
                                            <li>• JoinMarket</li>
                                            <li>• PayJoin 实现</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className={`p-5 rounded-xl ${isDarkMode ? 'bg-gradient-to-r from-emerald-900/30 to-teal-900/30 border border-emerald-500/20' : 'bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200'}`}>
                                <h4 className={`font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                    支持 PSBT 的软件
                                </h4>
                                <div className="grid md:grid-cols-4 gap-3">
                                    {[
                                        'Bitcoin Core',
                                        'Sparrow Wallet',
                                        'BlueWallet',
                                        'Specter Desktop',
                                        'Electrum',
                                        'Wasabi Wallet',
                                        'Coldcard',
                                        'BitBox02',
                                    ].map((sw, i) => (
                                        <div key={i} className={`p-2 rounded-lg text-center text-sm ${isDarkMode ? 'bg-slate-700 text-slate-300' : 'bg-white text-slate-700'}`}>
                                            {sw}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-amber-500/10 border border-amber-500/20' : 'bg-amber-50 border border-amber-200'}`}>
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className={`w-5 h-5 mt-0.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
                                    <div>
                                        <h4 className={`font-bold ${isDarkMode ? 'text-amber-400' : 'text-amber-700'}`}>
                                            安全提示
                                        </h4>
                                        <ul className={`text-sm mt-1 space-y-1 ${isDarkMode ? 'text-amber-200' : 'text-amber-600'}`}>
                                            <li>• 签名前务必验证所有输出地址和金额</li>
                                            <li>• 确认手续费是否合理</li>
                                            <li>• 使用可信软件处理 PSBT</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Quiz Tab */}
                    {activeTab === 'quiz' && quizData && (
                        <Quiz quizData={quizData} />
                    )}
                </div>
            </div>
        </div>
    );
};

export default PSBTDemo;
