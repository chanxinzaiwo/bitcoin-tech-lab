import React, { useState, useEffect } from 'react';
import { Skull, Wallet, Hourglass, Repeat, Shield, Clock, Database, Zap, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

const AttackSection = () => {
  const [mode, setMode] = useState('hodl'); // hodl, spend, reuse
  const [status, setStatus] = useState('idle'); // idle, racing, success, failed
  
  // Progress Bars
  const [minerProgress, setMinerProgress] = useState(0);
  const [hackerProgress, setHackerProgress] = useState(0);

  useEffect(() => {
    // Reset on mode change
    setMinerProgress(0);
    setHackerProgress(0);
    setStatus('idle');
  }, [mode]);

  const startRace = () => {
    setStatus('racing');
    setMinerProgress(0);
    setHackerProgress(0);
    
    const interval = setInterval(() => {
      setMinerProgress(prev => {
        if (prev >= 100) return 100;
        const luck = Math.random();
        let speed = 0.5; 
        if (luck > 0.9) speed = 3.0; 
        if (luck < 0.2) speed = 0.1; 
        
        return Math.min(prev + speed, 100);
      });

      setHackerProgress(prev => {
        if (prev >= 100) return 100;
        
        let speed = 0;
        if (mode === 'spend') speed = 0.8; 
        if (mode === 'reuse') speed = 5.0; 
        if (mode === 'hodl') speed = 0; 

        return Math.min(prev + speed, 100);
      });

    }, 50);

    return () => clearInterval(interval);
  };

  // Check race results
  useEffect(() => {
    if (status !== 'racing') return;

    if (mode === 'hodl') {
      // Nothing happens
    } else if (hackerProgress >= 100 && minerProgress < 100) {
      setStatus('failed');
    } else if (minerProgress >= 100 && hackerProgress < 100) {
      setStatus('success');
    }
  }, [minerProgress, hackerProgress, status, mode]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                 攻防竞速 (三种生存模式)
            </h2>
            <p className="text-red-50 text-lg leading-relaxed">
                量子时代的比特币安全是一场<strong>“速度的博弈”</strong>。
                只有当黑客能在矿工打包交易之前（约10分钟窗口）算出私钥，攻击才会生效。
            </p>
        </div>

      {/* Mode Selection */}
      <div className="flex flex-wrap gap-4 justify-center">
        <button onClick={() => setMode('hodl')} className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all shadow-sm ${mode === 'hodl' ? 'bg-green-600 border-green-400 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
          <Wallet className="w-5 h-5" /> 囤币不动 (HODL)
        </button>
        <button onClick={() => setMode('spend')} className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all shadow-sm ${mode === 'spend' ? 'bg-orange-600 border-orange-400 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
          <Hourglass className="w-5 h-5" /> 正常转账 (Spend)
        </button>
        <button onClick={() => setMode('reuse')} className={`flex items-center gap-2 px-6 py-3 rounded-xl border transition-all shadow-sm ${mode === 'reuse' ? 'bg-red-600 border-red-400 text-white shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>
          <Repeat className="w-5 h-5" /> 地址复用 (Reuse)
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8 items-stretch">
        
        {/* Scenario Description */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col justify-between shadow-sm">
          <div className="space-y-4">
             {mode === 'hodl' && (
                <>
                  <h3 className="text-green-600 font-bold text-lg flex items-center gap-2"><Shield className="w-5 h-5" /> 绝对安全区</h3>
                  <p className="text-slate-600">你只用新地址收款。公钥从未暴露。Shor 算法无法启动。</p>
                </>
             )}
             {mode === 'spend' && (
                <>
                  <h3 className="text-orange-500 font-bold text-lg flex items-center gap-2"><Clock className="w-5 h-5" /> 死亡竞速</h3>
                  <p className="text-slate-600">发起转账瞬间，公钥暴露。你必须祈祷矿工在黑客算出私钥前打包你的交易。</p>
                </>
             )}
             {mode === 'reuse' && (
                <>
                  <h3 className="text-red-600 font-bold text-lg flex items-center gap-2"><Skull className="w-5 h-5" /> 必死无疑</h3>
                  <p className="text-slate-600">你复用了老地址。公钥早已记录在链上。黑客不需要等，直接秒杀。</p>
                </>
             )}
          </div>

          <div className="mt-8">
            {mode === 'hodl' ? (
               <div className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200">无需操作 (安全)</div>
            ) : (
              <button
                onClick={startRace}
                disabled={status === 'racing' || status === 'success' || status === 'failed'}
                className={`w-full py-4 font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95 ${
                  status === 'racing' ? 'bg-slate-100 text-slate-400 cursor-wait' :
                  mode === 'spend' ? 'bg-gradient-to-r from-orange-600 to-orange-500 text-white hover:from-orange-500' :
                  'bg-gradient-to-r from-red-600 to-red-500 text-white hover:from-red-500'
                }`}
              >
                {status === 'racing' ? '竞速中...' : mode === 'spend' ? '发起转账 (开始竞速)' : '黑客尝试攻击'} 
              </button>
            )}
          </div>
        </div>

        {/* Racing Visualization */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl relative overflow-hidden flex flex-col justify-center shadow-sm">
          {mode === 'hodl' ? (
             <div className="text-center text-slate-400">
               <Shield className="w-16 h-16 mx-auto mb-4 opacity-20" />
               <p>没有目标公钥，黑客正在休眠。</p>
             </div>
          ) : (
            <div className="space-y-6">
              {/* Miner Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-green-600">
                   <span className="flex items-center gap-1"><Database className="w-3 h-3" /> 矿工打包进度 (随机性)</span>
                   <span>{Math.round(minerProgress)}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-green-200">
                  <div className="h-full bg-green-500 transition-all duration-75 ease-linear" style={{width: `${minerProgress}%`}}></div>
                </div>
              </div>

              {/* Hacker Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-red-500">
                   <span className="flex items-center gap-1"><Zap className="w-3 h-3" /> 黑客破解进度 (被盗)</span>
                   <span>{Math.round(hackerProgress)}%</span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-red-200">
                  <div className="h-full bg-red-500 transition-all duration-75 ease-linear" style={{width: `${hackerProgress}%`}}></div>
                </div>
              </div>

              {/* Result Status */}
              <div className="h-16 flex items-center justify-center">
                 {status === 'success' && (
                   <div className="flex items-center gap-2 text-green-700 bg-green-50 px-4 py-2 rounded-lg border border-green-200 animate-in zoom-in">
                     <CheckCircle2 className="w-5 h-5" /> 交易成功上链！惊险逃生。
                   </div>
                 )}
                 {status === 'failed' && (
                   <div className="flex items-center gap-2 text-red-700 bg-red-50 px-4 py-2 rounded-lg border border-red-200 animate-in zoom-in">
                     <XCircle className="w-5 h-5" /> 私钥被破解！资金被黑客转走。
                   </div>
                 )}
                 {status === 'idle' && <div className="text-slate-500 text-sm">等待发起交易...</div>}
              </div>
            </div>
          )}
        </div>

      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-xl text-sm text-yellow-800 flex gap-3">
        <AlertTriangle className="w-5 h-5 flex-shrink-0 text-yellow-600" />
        <p>
          <strong>结论：</strong> 
          在 Spend 模式下，即便不复用地址，也存在微小的概率被拥有极高算力的量子计算机“抢跑”（如果矿工运气不好，打包慢了）。
          但在 Reuse 模式下，被盗是 100% 确定的。
        </p>
      </div>
    </div>
  );
};

export default AttackSection;