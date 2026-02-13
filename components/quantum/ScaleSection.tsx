import React, { useState, useEffect } from 'react';
import { Scale, Clock, Cpu, RefreshCw, Play, FastForward } from 'lucide-react';

const ScaleSection = () => {
  const [count, setCount] = useState(0); 
  const [isCracking, setIsCracking] = useState(false);
  const [warpSpeed, setWarpSpeed] = useState(false);
  const target = 1.1579e77; 

  useEffect(() => {
    let interval: any;
    if (isCracking) {
      interval = setInterval(() => {
        setCount(prev => {
          const increment = warpSpeed ? 1e30 : 1e14;
          return prev + increment;
        }); 
      }, 16);
    }
    return () => clearInterval(interval);
  }, [isCracking, warpSpeed]);

  const progress = (count / target) * 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                 宇宙级的绝望 (256位)
            </h2>
            <p className="text-cyan-50 text-lg leading-relaxed">
                比特币私钥空间是一个拥有 <strong>2<sup>256</sup> 个刻度</strong>的宇宙时钟。暴力破解意味着不仅不知道指针位置，还要一格一格地尝试。
            </p>
        </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Scale Visualization */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 space-y-6 shadow-sm">
            <h3 className="font-bold text-slate-800">数量级对比</h3>
            
            <div className="space-y-4">
              <ScaleBar label={<span>2<sup>32</sup> (40亿)</span>} desc="地球人口" color="bg-blue-500" width="1%" />
              <ScaleBar label={<span>2<sup>64</sup> (1800亿亿)</span>} desc="地球沙砾总和" color="bg-yellow-500" width="5%" />
              <div className="relative pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-bold text-purple-600">2<sup>256</sup> (比特币私钥)</span>
                  <span className="text-purple-600">宇宙原子总和 (10<sup>80</sup>)</span>
                </div>
                <div className="w-full bg-slate-100 h-6 rounded-full overflow-hidden relative shadow-inner border border-slate-200">
                  <div className="bg-purple-500 h-full w-full opacity-20"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-slate-600 tracking-wider">
                    1.15 × 10^77 (天文数字)
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 p-4 rounded-xl text-sm text-purple-800 flex gap-3">
             <Clock className="w-5 h-5 flex-shrink-0" />
             <div>
               <strong>物理极限：</strong> 256 位时钟的周长，比任何物理飞船能飞越的距离都要长。
             </div>
          </div>
        </div>

        {/* Simulation */}
        <div className="flex flex-col justify-center">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden group shadow-lg">
            
            <div className="flex items-center justify-between mb-6 relative z-10">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-red-500" /> 
                暴力破解模拟器
              </h3>
              <div className="text-xs font-mono text-slate-500">Speed: {warpSpeed ? 'WARP 9.9' : 'MAX'}</div>
            </div>

            <div className="text-center space-y-2 mb-8 relative z-10">
              <div className="text-xs text-slate-400 uppercase tracking-widest">已检查刻度</div>
              <div className="font-mono text-2xl md:text-3xl text-red-600 truncate tracking-tight font-bold">
                {count > 1e20 ? count.toExponential(2) : count.toLocaleString()}
              </div>
              <div className="text-xs text-slate-500 h-4">
                {warpSpeed ? "正在疯狂跳跃数十亿年..." : "(假设每秒检查 100 万亿个)"}
              </div>
            </div>

            <div className="space-y-2 relative z-10 mb-8">
              <div className="flex justify-between text-xs text-slate-500">
                <span>总进度 (即使快进100亿年也是0%)</span>
                <span>{progress.toFixed(20)}%</span>
              </div>
              <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden border border-slate-200">
                 <div className="bg-red-500 h-full transition-all duration-300" style={{width: `${Math.max(progress, 0.5)}%`}}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 relative z-10">
              <button 
                onClick={() => setIsCracking(!isCracking)}
                className={`py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  isCracking 
                    ? 'bg-red-50 text-red-600 border border-red-200' 
                    : 'bg-red-600 hover:bg-red-500 text-white shadow-red-200'
                }`}
              >
                {isCracking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                {isCracking ? '正在计算...' : '开始破解'}
              </button>
              
              <button 
                onClick={() => setWarpSpeed(!warpSpeed)}
                disabled={!isCracking}
                className={`py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  warpSpeed
                    ? 'bg-purple-600 text-white shadow-lg' 
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200 disabled:opacity-50'
                }`}
              >
                <FastForward className="w-4 h-4" />
                快进100亿年
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface ScaleBarProps {
    label: React.ReactNode;
    desc: string;
    color: string;
    width: string;
}
const ScaleBar: React.FC<ScaleBarProps> = ({ label, desc, color, width }) => (
  <div>
    <div className="flex justify-between text-xs mb-1">
      <span className="text-slate-600 font-medium">{label}</span>
      <span className="text-slate-400">{desc}</span>
    </div>
    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
      <div className={`${color} h-full`} style={{width}}></div>
    </div>
  </div>
);

export default ScaleSection;