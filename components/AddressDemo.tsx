import React, { useState } from 'react';
import { Key, ArrowRight, Hash, FileKey, CheckCircle2, RefreshCw, ArrowDown, Shield, Search, Fingerprint, Save, Scaling, Workflow, AlertTriangle, Clock, Zap, Globe, Lock, Copy, QrCode, Check, Info, TrendingUp, Database } from 'lucide-react';
import { useLab } from '../store/LabContext';

const AddressDemo = () => {
    const [activeTab, setActiveTab] = useState('intro');
    const { isDarkMode } = useLab();

    const tabs = [
        { id: 'intro', label: '原理介绍' },
        { id: 'demo', label: '生成流水线' },
        { id: 'compare', label: '地址对比' },
        { id: 'security', label: '安全与验证' },
    ];

    return (
        <div className={`font-sans min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'}`}>
             <nav className={`shadow-sm border-b sticky top-0 z-40 transition-colors duration-300 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <div className="flex items-center gap-2">
                            <div className="bg-emerald-600 text-white p-1.5 rounded-full">
                                <FileKey className="h-6 w-6" />
                            </div>
                            <span className={`font-bold text-xl tracking-tight hidden sm:block ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>地址生成</span>
                            <span className={`font-bold text-lg tracking-tight sm:hidden ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>Address</span>
                        </div>
                        {/* Desktop Menu */}
                        <div className="hidden md:flex space-x-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                        activeTab === tab.id
                                            ? 'bg-emerald-500/10 text-emerald-500'
                                            : (isDarkMode ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100')
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
                            className={`inline-block mr-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                                    : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-700 active:bg-slate-700' : 'bg-white text-slate-600 border-slate-300 active:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {activeTab === 'intro' && <IntroSection changeTab={setActiveTab} isDarkMode={isDarkMode} />}
                {activeTab === 'demo' && <GeneratorSection isDarkMode={isDarkMode} />}
                {activeTab === 'compare' && <AddressCompareSection isDarkMode={isDarkMode} />}
                {activeTab === 'security' && <SecuritySection isDarkMode={isDarkMode} />}
            </main>
        </div>
    );
};

const IntroSection = ({ changeTab, isDarkMode }: { changeTab: (tab: string) => void, isDarkMode: boolean }) => (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-emerald-600 to-teal-800 rounded-2xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-12 opacity-10">
                 <FileKey className="w-64 h-64" />
             </div>
            <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-bold mb-6">地址：你的数字保险柜</h1>
                <p className="text-emerald-100 text-lg md:text-xl max-w-2xl leading-relaxed">
                    比特币地址看起来像一串乱码，但它其实是公钥的“指纹”。<br/>
                    随着技术演进，地址格式也从最初的 P2PKH (1开头)，进化到了 SegWit (bc1q开头) 和 Taproot (bc1p开头)。
                </p>
                <button
                    onClick={() => changeTab('demo')}
                    className="mt-8 bg-white text-emerald-800 hover:bg-emerald-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                >
                    开始生成地址 <ArrowRight className="h-5 w-5" />
                </button>
            </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
            <Card title="双重哈希 (Legacy)" icon={<Hash className="h-8 w-8 text-emerald-500" />} isDarkMode={isDarkMode}>
                在传统地址中，公钥经过 SHA-256 和 RIPEMD-160 双重哈希。不仅缩短长度，还多加一层量子防护。
            </Card>
            <Card title="Bech32 编码 (SegWit)" icon={<Scaling className="h-8 w-8 text-emerald-500" />} isDarkMode={isDarkMode}>
                现代地址使用 Base32 变体。全部小写，容易语音朗读，且内置了更强大的错误纠正码 (BCH Code)。
            </Card>
            <Card title="Schnorr 聚合 (Taproot)" icon={<Workflow className="h-8 w-8 text-emerald-500" />} isDarkMode={isDarkMode}>
                最新的 Taproot 地址使用 Schnorr 公钥。它允许将多签和复杂脚本伪装成普通的单签名地址，隐私性极强。
            </Card>
        </div>
    </div>
);

const Card = ({ title, icon, children, isDarkMode }: any) => (
    <div className={`p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
        <h3 className={`text-lg font-bold mb-2 ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h3>
        <p className={`leading-relaxed text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{children}</p>
    </div>
);

type AddressType = 'legacy' | 'segwit' | 'taproot';

const GeneratorSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const { setIdentity } = useLab();
    const [addrType, setAddrType] = useState<AddressType>('legacy');
    const [pubKey, setPubKey] = useState("0450863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B23522CD470243453A299FA9E77237716103ABC11A1DF38855ED6F2EE187E9C582BA6");
    const [privKey, setPrivKey] = useState("KxFC1jmwwCoACiCAWZ3eXa96mBM6tb3TYzGmf6YwgdGWZgawvRtJ");
    const [step, setStep] = useState(0);
    const [saved, setSaved] = useState(false);
    
    // --- Data Mocks ---
    const shaHash = "600FFE422B4E00731A59557A5CCA46CC183944191006324A447BDB2D98D4B408";
    const ripemdHash = "010966776006953D5567439E5E39F86A0D273BEE";
    
    // Legacy
    const legacyNetByte = "00010966776006953D5567439E5E39F86A0D273BEE";
    const legacyChecksum = "D61967F6";
    const legacyAddress = "16UwLL9Risc3QfPqBUvKofHmBQ7wMtjvM";

    // SegWit (P2WPKH)
    const segwitProgram = "0014" + ripemdHash; // Version 0 + 20-byte hash
    const segwitAddress = "bc1qqw3585v9q6m249j7k0w95g84r5d2638w35c754";

    // Taproot (P2TR)
    const taprootPubKey = "50863AD64A87AE8A2FE83C1AF1A8403CB53F53E486D8511DAD8A04887E5B235"; // x-only (32 bytes)
    const taprootProgram = "0120" + taprootPubKey; // Version 1 + 32-byte key
    const taprootAddress = "bc1p2s585v9q6m249j7k0w95g84r5d2638w35c754y965j36089325s34802";

    const generateNew = () => {
        const chars = "0123456789ABCDEF";
        let newKey = "04";
        for(let i=0; i<128; i++) newKey += chars[Math.floor(Math.random()*16)];
        setPubKey(newKey);
        setStep(0);
        setSaved(false);
    };

    const handleSaveIdentity = () => {
        const addr = addrType === 'legacy' ? legacyAddress : addrType === 'segwit' ? segwitAddress : taprootAddress;
        setIdentity({
            privateKey: privKey,
            publicKey: pubKey,
            address: addr,
            label: `My ${addrType === 'legacy' ? 'Legacy' : addrType === 'segwit' ? 'SegWit' : 'Taproot'} Wallet`
        });
        setSaved(true);
    };

    // --- Pipeline Logic ---
    const getSteps = () => {
        if (addrType === 'legacy') {
            return [
                { title: "SHA-256 哈希", desc: "第一层压缩：将公钥压缩为 256 位。", in: pubKey, out: shaHash, color: "blue" },
                { title: "RIPEMD-160 哈希", desc: "第二层压缩：进一步压缩为 160 位，生成更短的指纹。", in: shaHash, out: ripemdHash, color: "indigo" },
                { title: "添加版本号", desc: "头部添加 00，代表主网地址 (P2PKH)。", in: ripemdHash, out: legacyNetByte, color: "purple" },
                { title: "校验和 (Checksum)", desc: "双重 SHA-256 取前 4 字节，防止抄写错误。", in: legacyNetByte, out: `${legacyNetByte}${legacyChecksum}`, color: "pink", highlight: legacyChecksum },
                { title: "Base58 编码", desc: "传统编码，去除了 0/O/I/l 等易混淆字符。", in: `${legacyNetByte}${legacyChecksum}`, out: legacyAddress, color: "emerald", final: true },
            ];
        } else if (addrType === 'segwit') {
            return [
                { title: "SHA-256 & RIPEMD-160", desc: "与传统地址相同，先计算 20 字节的 KeyHash。", in: pubKey, out: ripemdHash, color: "blue" },
                { title: "Witness Program", desc: "构建见证程序：Version 0 (00) + 20字节 Hash (14...)", in: ripemdHash, out: segwitProgram, color: "purple" },
                { title: "Bech32 编码", desc: "使用 'bc' 前缀。更高效，支持二维码大写，自带纠错能力。", in: segwitProgram, out: segwitAddress, color: "emerald", final: true },
            ];
        } else {
            // Taproot
            return [
                { title: "Tweaked Public Key", desc: "Schnorr 只需要 X 坐标 (32字节)。", in: pubKey, out: taprootPubKey, color: "blue" },
                { title: "Witness Program", desc: "构建见证程序：Version 1 (51) + 32字节 Key (20...)", in: taprootPubKey, out: taprootProgram, color: "purple" },
                { title: "Bech32m 编码", desc: "升级版编码，专为 Taproot 优化。", in: taprootProgram, out: taprootAddress, color: "emerald", final: true },
            ];
        }
    };

    const steps = getSteps();

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Control Panel */}
            <div className={`p-1 bg-slate-100 rounded-xl flex ${isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}`}>
                {[
                    { id: 'legacy', label: 'Legacy (1...)', desc: 'P2PKH' },
                    { id: 'segwit', label: 'SegWit (bc1q...)', desc: 'P2WPKH' },
                    { id: 'taproot', label: 'Taproot (bc1p...)', desc: 'P2TR' }
                ].map((type) => (
                    <button
                        key={type.id}
                        onClick={() => { setAddrType(type.id as any); setStep(0); setSaved(false); }}
                        className={`flex-1 py-3 rounded-lg text-sm font-medium transition-all ${
                            addrType === type.id
                                ? 'bg-white text-emerald-600 shadow-md ring-1 ring-emerald-500/20'
                                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-900')
                        }`}
                    >
                        <div className="font-bold">{type.label}</div>
                        <div className="text-[10px] opacity-70">{type.desc}</div>
                    </button>
                ))}
            </div>

            {/* Input Section */}
            <div className={`p-6 rounded-2xl shadow-sm border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`font-bold flex items-center gap-2 ${isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        <Key className="w-5 h-5 text-orange-500" /> 初始公钥 (Public Key)
                    </h3>
                    <button onClick={generateNew} className="text-sm flex items-center gap-1 text-emerald-600 hover:text-emerald-700 bg-emerald-500/10 px-3 py-1.5 rounded-full font-bold transition-colors">
                        <RefreshCw className="w-4 h-4" /> 生成新公钥
                    </button>
                </div>
                <div className={`p-4 rounded-xl font-mono text-xs break-all border shadow-inner ${isDarkMode ? 'bg-slate-950 text-slate-400 border-slate-800' : 'bg-slate-50 text-slate-600 border-slate-200'}`}>
                    {pubKey}
                </div>
            </div>

            {/* Pipeline Steps */}
            <div className="space-y-4 relative">
                <div className={`absolute left-6 md:left-8 top-0 bottom-0 w-0.5 -z-10 hidden md:block ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'}`}></div>

                {steps.map((s, idx) => {
                    const isActive = step >= idx;
                    const isCurrent = step === idx;
                    const containerClass = isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100';
                    const activeBorder = isDarkMode ? `border-${s.color}-900` : `border-${s.color}-100`;
                    
                    return (
                        <div key={idx} className={`relative transition-all duration-500 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4'}`}>
                            <div className={`md:ml-16 p-5 rounded-xl border-2 shadow-sm ${containerClass} ${isActive ? activeBorder : ''} ${isCurrent ? `ring-2 ring-${s.color}-500/20` : ''}`}>
                                <div className="flex items-start gap-4">
                                    <div className={`absolute left-4 md:-left-12 w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shrink-0 z-10 ${isActive ? `bg-${s.color}-500` : (isDarkMode ? 'bg-slate-800' : 'bg-slate-300')}`}>
                                        {idx + 1}
                                    </div>
                                    <div className="flex-1 min-w-0 pl-10 md:pl-0">
                                        <h4 className={`font-bold ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>{s.title}</h4>
                                        <p className={`text-xs mb-3 ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{s.desc}</p>
                                        
                                        {isActive && (
                                            <div className={`p-3 rounded-lg border font-mono text-xs break-all animate-in fade-in zoom-in-95 duration-300 ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50 border-slate-200'}`}>
                                                {s.highlight ? (
                                                    <>
                                                        <span className="text-slate-500">{s.out.replace(s.highlight, '')}</span>
                                                        <span className={`font-bold text-${s.color}-500`}>{s.highlight}</span>
                                                    </>
                                                ) : (
                                                    <span className={s.final ? `font-bold text-${s.color}-500 text-sm` : 'text-slate-500'}>
                                                        {s.out}
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                    {isCurrent && !s.final && (
                                        <button 
                                            onClick={() => setStep(idx + 1)}
                                            className={`bg-${s.color}-600 text-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform`}
                                        >
                                            <ArrowDown className="w-5 h-5" />
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}

                {/* Final Success */}
                {step === steps.length && (
                        <div className="text-center py-8 animate-in zoom-in duration-500 space-y-4">
                            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-500 px-6 py-3 rounded-full font-bold border border-emerald-500/20">
                                <CheckCircle2 className="w-6 h-6" />
                                地址生成完毕
                            </div>
                            
                            {!saved ? (
                                <button 
                                    onClick={handleSaveIdentity}
                                    className="block mx-auto bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                                >
                                    <Save className="w-4 h-4" /> 保存到全局钱包
                                </button>
                            ) : (
                                <div className="text-emerald-500 text-sm font-medium">
                                    已保存！现在你可以在 UTXO 和交易工坊中使用此身份。
                                </div>
                            )}

                            <button onClick={() => {generateNew(); setStep(0);}} className="block mx-auto mt-4 text-slate-400 hover:text-slate-500 text-sm">
                                再来一次
                            </button>
                        </div>
                )}
            </div>
        </div>
    );
};

// Address Comparison Section
const AddressCompareSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [copied, setCopied] = useState<string | null>(null);

    const addressTypes = [
        {
            type: 'Legacy (P2PKH)',
            prefix: '1...',
            example: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2',
            year: 2009,
            features: ['最原始的地址格式', 'Base58Check编码', '支持最广泛', '手续费最高'],
            pros: ['所有钱包都支持', '历史悠久，经过充分验证'],
            cons: ['交易体积大', '手续费高', '不支持SegWit优化'],
            color: 'amber',
            scriptType: 'P2PKH (Pay to Public Key Hash)',
            size: '34 字符'
        },
        {
            type: 'Nested SegWit (P2SH-P2WPKH)',
            prefix: '3...',
            example: '3J98t1WpEZ73CNmQviecrnyiWrnqRhWNLy',
            year: 2017,
            features: ['向后兼容的SegWit', '包装在P2SH脚本中', '中等手续费', '过渡方案'],
            pros: ['兼容老钱包', '比Legacy省手续费'],
            cons: ['不如Native SegWit高效', '即将淘汰'],
            color: 'blue',
            scriptType: 'P2SH-P2WPKH (Wrapped SegWit)',
            size: '34 字符'
        },
        {
            type: 'Native SegWit (P2WPKH)',
            prefix: 'bc1q...',
            example: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq',
            year: 2017,
            features: ['原生隔离见证', 'Bech32编码', '手续费低', '推荐使用'],
            pros: ['最低手续费', '错误检测能力强', 'QR码友好'],
            cons: ['部分老交易所不支持'],
            color: 'emerald',
            scriptType: 'P2WPKH (Native SegWit)',
            size: '42 字符'
        },
        {
            type: 'Taproot (P2TR)',
            prefix: 'bc1p...',
            example: 'bc1p5d7rjq7g6rdk2yhzks9smlaqtedr4dekq08ge8ztwac72sfr9rusxg3297',
            year: 2021,
            features: ['Schnorr签名', 'MAST支持', '最高隐私', '智能合约'],
            pros: ['签名聚合', '隐私性最强', '支持复杂脚本'],
            cons: ['采用率还在增长中'],
            color: 'purple',
            scriptType: 'P2TR (Pay to Taproot)',
            size: '62 字符'
        }
    ];

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopied(id);
        setTimeout(() => setCopied(null), 2000);
    };

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    比特币地址类型对比
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    从2009年至今，比特币地址经历了四代演进
                </p>
            </div>

            {/* Timeline */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Clock className="w-5 h-5 text-emerald-500" />
                    演进时间线
                </h3>
                <div className="relative">
                    <div className={`absolute top-4 left-0 right-0 h-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className="flex justify-between relative">
                        {addressTypes.map((addr, index) => (
                            <div key={index} className="text-center flex-1">
                                <div className={`w-8 h-8 rounded-full mx-auto mb-2 flex items-center justify-center text-white text-xs font-bold ${
                                    addr.color === 'amber' ? 'bg-amber-500' :
                                    addr.color === 'blue' ? 'bg-blue-500' :
                                    addr.color === 'emerald' ? 'bg-emerald-500' :
                                    'bg-purple-500'
                                }`}>
                                    {addr.year.toString().slice(-2)}
                                </div>
                                <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>{addr.year}</div>
                                <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>{addr.type.split(' ')[0]}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Address Cards */}
            <div className="grid md:grid-cols-2 gap-6">
                {addressTypes.map((addr, index) => (
                    <div key={index} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl border overflow-hidden`}>
                        <div className={`p-4 ${
                            addr.color === 'amber' ? isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50' :
                            addr.color === 'blue' ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50' :
                            addr.color === 'emerald' ? isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50' :
                            isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50'
                        }`}>
                            <div className="flex items-center justify-between">
                                <h4 className={`font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{addr.type}</h4>
                                <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                                    addr.color === 'amber' ? 'bg-amber-500 text-white' :
                                    addr.color === 'blue' ? 'bg-blue-500 text-white' :
                                    addr.color === 'emerald' ? 'bg-emerald-500 text-white' :
                                    'bg-purple-500 text-white'
                                }`}>
                                    {addr.prefix}
                                </span>
                            </div>
                            <div className={`text-xs mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{addr.scriptType}</div>
                        </div>

                        <div className="p-4 space-y-4">
                            {/* Example Address */}
                            <div>
                                <div className={`text-xs font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-1`}>示例地址</div>
                                <div className={`flex items-center gap-2 p-2 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                                    <code className={`text-xs font-mono flex-1 truncate ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                                        {addr.example}
                                    </code>
                                    <button
                                        onClick={() => handleCopy(addr.example, `addr-${index}`)}
                                        className={`p-1 rounded ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                                    >
                                        {copied === `addr-${index}` ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                    </button>
                                </div>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-2">
                                {addr.features.map((feature, i) => (
                                    <div key={i} className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                                        {feature}
                                    </div>
                                ))}
                            </div>

                            {/* Pros & Cons */}
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <div className={`text-xs font-bold text-green-500 mb-1`}>优点</div>
                                    <ul className="space-y-1">
                                        {addr.pros.map((pro, i) => (
                                            <li key={i} className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} flex items-start gap-1`}>
                                                <Check className="w-3 h-3 text-green-500 mt-0.5 shrink-0" />
                                                {pro}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <div>
                                    <div className={`text-xs font-bold text-red-500 mb-1`}>缺点</div>
                                    <ul className="space-y-1">
                                        {addr.cons.map((con, i) => (
                                            <li key={i} className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} flex items-start gap-1`}>
                                                <AlertTriangle className="w-3 h-3 text-red-500 mt-0.5 shrink-0" />
                                                {con}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Comparison Table */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border overflow-x-auto`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Database className="w-5 h-5 text-emerald-500" />
                    详细对比
                </h3>
                <table className="w-full text-sm">
                    <thead>
                        <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                            <th className="text-left py-2 px-3">特性</th>
                            <th className="text-center py-2 px-3">Legacy</th>
                            <th className="text-center py-2 px-3">Nested</th>
                            <th className="text-center py-2 px-3">Native</th>
                            <th className="text-center py-2 px-3">Taproot</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className={`py-2 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>地址长度</td>
                            <td className="text-center py-2 px-3">34</td>
                            <td className="text-center py-2 px-3">34</td>
                            <td className="text-center py-2 px-3">42</td>
                            <td className="text-center py-2 px-3">62</td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className={`py-2 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>手续费</td>
                            <td className="text-center py-2 px-3"><span className="text-red-500">高</span></td>
                            <td className="text-center py-2 px-3"><span className="text-amber-500">中</span></td>
                            <td className="text-center py-2 px-3"><span className="text-green-500">低</span></td>
                            <td className="text-center py-2 px-3"><span className="text-green-500">最低</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className={`py-2 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>隐私性</td>
                            <td className="text-center py-2 px-3"><span className="text-red-500">低</span></td>
                            <td className="text-center py-2 px-3"><span className="text-amber-500">中</span></td>
                            <td className="text-center py-2 px-3"><span className="text-amber-500">中</span></td>
                            <td className="text-center py-2 px-3"><span className="text-green-500">高</span></td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className={`py-2 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>错误检测</td>
                            <td className="text-center py-2 px-3">Base58Check</td>
                            <td className="text-center py-2 px-3">Base58Check</td>
                            <td className="text-center py-2 px-3">BCH</td>
                            <td className="text-center py-2 px-3">BCH</td>
                        </tr>
                        <tr className={`border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                            <td className={`py-2 px-3 ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>推荐使用</td>
                            <td className="text-center py-2 px-3"><span className="text-red-500">否</span></td>
                            <td className="text-center py-2 px-3"><span className="text-amber-500">过渡</span></td>
                            <td className="text-center py-2 px-3"><span className="text-green-500">是</span></td>
                            <td className="text-center py-2 px-3"><span className="text-purple-500">推荐</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            {/* Recommendation */}
            <div className={`${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'} mb-3 flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5" />
                    2024年地址选择建议
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>日常使用</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            使用 <span className="text-emerald-500 font-bold">Native SegWit (bc1q...)</span>，兼容性好，手续费低。
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>高隐私需求</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            使用 <span className="text-purple-500 font-bold">Taproot (bc1p...)</span>，多签和复杂脚本看起来都像普通交易。
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>最大兼容性</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            如果对方交易所不支持SegWit，用 <span className="text-amber-500 font-bold">Legacy (1...)</span> 作为备选。
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Security Section
const SecuritySection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [testAddress, setTestAddress] = useState('1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2');
    const [validationResult, setValidationResult] = useState<{valid: boolean; type: string; error?: string} | null>(null);

    const validateAddress = () => {
        const addr = testAddress.trim();
        if (!addr) {
            setValidationResult({ valid: false, type: '', error: '请输入地址' });
            return;
        }

        // Simple validation rules
        if (addr.startsWith('1') && addr.length >= 26 && addr.length <= 35) {
            setValidationResult({ valid: true, type: 'Legacy (P2PKH)' });
        } else if (addr.startsWith('3') && addr.length >= 26 && addr.length <= 35) {
            setValidationResult({ valid: true, type: 'Nested SegWit (P2SH)' });
        } else if (addr.startsWith('bc1q') && addr.length === 42) {
            setValidationResult({ valid: true, type: 'Native SegWit (P2WPKH)' });
        } else if (addr.startsWith('bc1p') && addr.length === 62) {
            setValidationResult({ valid: true, type: 'Taproot (P2TR)' });
        } else if (addr.startsWith('bc1')) {
            setValidationResult({ valid: true, type: 'SegWit (可能是P2WSH)' });
        } else {
            setValidationResult({ valid: false, type: '', error: '无法识别的地址格式' });
        }
    };

    const securityTips = [
        {
            icon: Shield,
            title: '校验和保护',
            description: '每个比特币地址都包含校验和。如果你抄错了一个字符，钱包会立即发现错误，拒绝发送交易。',
            color: 'emerald'
        },
        {
            icon: QrCode,
            title: 'QR码安全',
            description: 'Bech32地址全部小写，生成的QR码更紧凑、更易扫描。Legacy地址混合大小写，QR码密度更高。',
            color: 'blue'
        },
        {
            icon: Lock,
            title: '量子安全',
            description: '只要你的地址从未花费过，你的公钥就是隐藏的（只暴露公钥哈希）。这提供了一定程度的量子计算保护。',
            color: 'purple'
        },
        {
            icon: Globe,
            title: '地址重用风险',
            description: '每次收款都应该使用新地址。重复使用地址会降低隐私性，让观察者更容易追踪你的交易历史。',
            color: 'amber'
        }
    ];

    const checksumExamples = [
        { original: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2', corrupted: '1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN3', error: '最后一位错误' },
        { original: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdq', corrupted: 'bc1qar0srrr7xfkvy5l643lydnw9re59gtzzwf5mdp', error: '校验位不匹配' },
    ];

    return (
        <div className="space-y-8">
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    地址安全与验证
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    了解比特币地址的内置安全机制
                </p>
            </div>

            {/* Address Validator */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Search className="w-5 h-5 text-emerald-500" />
                    地址验证器
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    输入一个比特币地址，检查其格式和类型
                </p>
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={testAddress}
                        onChange={(e) => setTestAddress(e.target.value)}
                        placeholder="输入比特币地址"
                        className={`flex-1 px-4 py-3 rounded-lg border text-sm font-mono ${
                            isDarkMode
                                ? 'bg-slate-800 border-slate-700 text-white placeholder:text-slate-500'
                                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400'
                        }`}
                    />
                    <button
                        onClick={validateAddress}
                        className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-emerald-700 transition-colors"
                    >
                        验证
                    </button>
                </div>
                {validationResult && (
                    <div className={`mt-4 p-4 rounded-lg ${
                        validationResult.valid
                            ? isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200'
                            : isDarkMode ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200'
                    } border`}>
                        <div className="flex items-center gap-2">
                            {validationResult.valid ? (
                                <>
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                    <span className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>有效地址</span>
                                    <span className={`text-sm ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>- {validationResult.type}</span>
                                </>
                            ) : (
                                <>
                                    <AlertTriangle className="w-5 h-5 text-red-500" />
                                    <span className={`font-bold ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>无效地址</span>
                                    <span className={`text-sm ${isDarkMode ? 'text-red-400' : 'text-red-600'}`}>- {validationResult.error}</span>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Security Tips */}
            <div className="grid md:grid-cols-2 gap-6">
                {securityTips.map((tip, index) => {
                    const Icon = tip.icon;
                    return (
                        <div key={index} className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                            <div className={`w-12 h-12 rounded-lg ${
                                tip.color === 'emerald' ? isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-100' :
                                tip.color === 'blue' ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100' :
                                tip.color === 'purple' ? isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100' :
                                isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100'
                            } flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${
                                    tip.color === 'emerald' ? 'text-emerald-500' :
                                    tip.color === 'blue' ? 'text-blue-500' :
                                    tip.color === 'purple' ? 'text-purple-500' :
                                    'text-amber-500'
                                }`} />
                            </div>
                            <h4 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{tip.title}</h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{tip.description}</p>
                        </div>
                    );
                })}
            </div>

            {/* Checksum Demo */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Fingerprint className="w-5 h-5 text-emerald-500" />
                    校验和演示
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    即使只改变一个字符，校验和也会失效
                </p>
                <div className="space-y-4">
                    {checksumExamples.map((example, index) => (
                        <div key={index} className={`p-4 rounded-lg ${isDarkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    <code className={`text-xs font-mono ${isDarkMode ? 'text-green-300' : 'text-green-700'}`}>{example.original}</code>
                                </div>
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="w-4 h-4 text-red-500" />
                                    <code className={`text-xs font-mono ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>{example.corrupted}</code>
                                    <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>({example.error})</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Error Detection Comparison */}
            <div className={`${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Info className="w-5 h-5 text-emerald-500" />
                    Base58 vs Bech32 错误检测
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'} border`}>
                        <h4 className={`font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'} mb-2`}>Base58Check (Legacy)</h4>
                        <ul className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-700'} space-y-1`}>
                            <li>可检测单个字符错误</li>
                            <li>4字节校验和 (32位)</li>
                            <li>不能定位错误位置</li>
                            <li>大小写混合，易混淆</li>
                        </ul>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'} border`}>
                        <h4 className={`font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'} mb-2`}>Bech32/Bech32m (SegWit/Taproot)</h4>
                        <ul className={`text-sm ${isDarkMode ? 'text-emerald-200' : 'text-emerald-700'} space-y-1`}>
                            <li>可检测最多4个字符错误</li>
                            <li>BCH纠错码 (30位)</li>
                            <li>可定位错误位置</li>
                            <li>全小写，更清晰</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Best Practices */}
            <div className={`${isDarkMode ? 'bg-emerald-500/20 border-emerald-500/30' : 'bg-emerald-50 border-emerald-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-emerald-300' : 'text-emerald-800'} mb-4 flex items-center gap-2`}>
                    <Shield className="w-5 h-5" />
                    地址安全最佳实践
                </h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>1. 仔细核对</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            发送大额前，至少核对地址的前6位和后6位
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>2. 使用QR码</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            扫描QR码比手动复制粘贴更安全可靠
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>3. 小额测试</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            首次转账先发小额，确认收到后再转大额
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>4. 警惕剪贴板</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            恶意软件可能替换剪贴板中的地址
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>5. 不要重用</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            每次收款使用新地址，保护隐私
                        </p>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-4`}>
                        <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>6. 备份种子</div>
                        <p className={`text-xs ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            助记词是恢复所有地址的唯一方式
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddressDemo;
