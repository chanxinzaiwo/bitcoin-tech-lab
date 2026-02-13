
import React, { useState } from 'react';
import { Snowflake, Wifi, WifiOff, QrCode, ArrowRight, CheckCircle, Smartphone, Lock } from 'lucide-react';
import { useLab } from '../store/LabContext';

const ColdWalletDemo = () => {
    const { isDarkMode } = useLab();
    const [step, setStep] = useState(0);

    // Flow:
    // 0: Hot Wallet creates Unsigned TX
    // 1: Hot Wallet shows QR (Unsigned)
    // 2: Cold Wallet scans & Signs
    // 3: Cold Wallet shows QR (Signed)
    // 4: Hot Wallet scans & Broadcasts

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-sky-500 text-white p-1.5 rounded-full">
                        <Snowflake className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">冷钱包签名 (Air-gapped)</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">
                
                <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <WifiOff className="w-8 h-8" /> 物理隔离的安全性
                    </h2>
                    <p className="text-sky-100 text-lg leading-relaxed max-w-3xl">
                        私钥永远不接触网络。
                        在线设备（观察钱包）只负责构造交易，离线设备（冷钱包）负责签名。数据通过二维码传输，杜绝黑客入侵。
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12">
                    
                    {/* Hot Wallet Side */}
                    <div className={`p-6 rounded-3xl border-4 ${step === 0 || step === 4 ? 'border-blue-500 shadow-xl shadow-blue-200' : 'border-slate-200 opacity-50'} transition-all duration-500 relative overflow-hidden bg-white dark:bg-slate-900`}>
                        <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1">
                            <Wifi className="w-3 h-3" /> Online App
                        </div>
                        
                        <div className="text-center mt-4">
                            <Smartphone className="w-16 h-16 mx-auto text-blue-500 mb-4" />
                            <h3 className="text-xl font-bold mb-2">观察钱包 (Hot)</h3>
                            
                            {step === 0 && (
                                <div className="space-y-4">
                                    <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded text-sm text-left font-mono">
                                        To: Bob<br/>Amount: 1.5 BTC<br/>Fee: 0.0001
                                    </div>
                                    <button onClick={() => setStep(1)} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-blue-700">
                                        构造未签名交易
                                    </button>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-4">
                                    <div className="w-48 h-48 bg-black mx-auto rounded-lg flex items-center justify-center text-white">
                                        <QrCode className="w-32 h-32" />
                                    </div>
                                    <p className="text-sm text-slate-500">请用冷钱包扫描此二维码<br/>(Unsigned TX)</p>
                                    <button onClick={() => setStep(2)} className="text-xs text-blue-500 underline">模拟冷钱包已扫描</button>
                                </div>
                            )}

                            {step === 4 && (
                                <div className="bg-green-100 text-green-800 p-6 rounded-xl animate-in zoom-in">
                                    <CheckCircle className="w-12 h-12 mx-auto mb-2" />
                                    <div className="font-bold text-lg">广播成功!</div>
                                    <div className="text-xs mt-2">TxID: 8a3f...29c1</div>
                                    <button onClick={() => setStep(0)} className="mt-4 text-xs underline">再来一次</button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Cold Wallet Side */}
                    <div className={`p-6 rounded-3xl border-4 ${step === 2 || step === 3 ? 'border-sky-500 shadow-xl shadow-sky-200' : 'border-slate-200 opacity-50'} transition-all duration-500 relative overflow-hidden bg-slate-800 text-white`}>
                        <div className="absolute top-0 right-0 bg-slate-600 text-slate-300 px-4 py-1 rounded-bl-xl text-xs font-bold flex items-center gap-1">
                            <WifiOff className="w-3 h-3" /> Offline Device
                        </div>

                        <div className="text-center mt-4">
                            <Lock className="w-16 h-16 mx-auto text-sky-400 mb-4" />
                            <h3 className="text-xl font-bold mb-2">硬件钱包 (Cold)</h3>

                            {step < 2 && (
                                <div className="text-slate-400 text-sm mt-10">等待扫描...</div>
                            )}

                            {step === 2 && (
                                <div className="space-y-4 animate-in slide-in-from-bottom">
                                    <div className="bg-slate-700 p-3 rounded text-sm text-left font-mono border-l-4 border-sky-500">
                                        <strong>Verify:</strong><br/>
                                        Send 1.5 BTC<br/>To: Bob (1A1z...)
                                    </div>
                                    <button onClick={() => setStep(3)} className="bg-sky-500 text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-sky-400">
                                        确认并签名 (Sign)
                                    </button>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-4">
                                    <div className="w-48 h-48 bg-white mx-auto rounded-lg flex items-center justify-center text-black">
                                        <QrCode className="w-32 h-32" />
                                    </div>
                                    <p className="text-sm text-slate-400">已签名。请用观察钱包扫描传回。</p>
                                    <button onClick={() => setStep(4)} className="text-xs text-sky-400 underline">模拟观察钱包已扫描</button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
};

export default ColdWalletDemo;
