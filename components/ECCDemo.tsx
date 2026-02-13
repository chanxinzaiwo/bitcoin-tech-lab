import React, { useState, useEffect } from 'react';
import { Shield, ArrowRight, RefreshCw, FileSignature, Info, Target, MousePointer2, CheckCircle, CheckCircle2, Plus, RotateCcw, RotateCw, Zap, Unlock, Fingerprint, Cpu, Search, XCircle, AlertTriangle, Lock, Key, ArrowDown, ShieldCheck, Layers, Globe, Smartphone, CreditCard, Server, Clock, TrendingUp, Award } from 'lucide-react';
import { calculateY, addPoints, scalarMult, computeSHA256, Point } from '../utils/crypto-math';
import ECCGraph, { Line, BallPos } from './ECCGraph';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { eccQuiz } from '../data/quizData';

const ECCDemo = () => {
  const [activeTab, setActiveTab] = useState('intro');
  const { isDarkMode } = useLab();

  const tabs = [
    { id: 'intro', label: '小白入门' },
    { id: 'curve', label: '曲线形状' },
    { id: 'add', label: '台球加法' },
    { id: 'multiply', label: '公私钥' },
    { id: 'sha256', label: '哈希函数' },
    { id: 'sign', label: '数字签名' },
    { id: 'security', label: '安全对比' },
    { id: 'realworld', label: '实际应用' },
    { id: 'quiz', label: '测验', icon: Award },
  ];

  return (
    <div className={`${isDarkMode ? 'bg-slate-900 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans selection:bg-orange-100 min-h-screen`}>
      <nav className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} shadow-sm border-b sticky top-0 z-40`}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-orange-500 text-white p-1.5 rounded-full">
                 <Shield className="h-6 w-6" />
              </div>
              <span className={`font-bold text-xl tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} hidden sm:block`}>比特币数学原理</span>
              <span className={`font-bold text-lg tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'} sm:hidden`}>ECC 演示</span>
            </div>
            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-50 text-orange-700'
                      : isDarkMode ? 'text-slate-400 hover:text-white hover:bg-slate-700' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className={`md:hidden overflow-x-auto whitespace-nowrap px-4 py-2 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'} scrollbar-hide`}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-block mr-2 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeTab === tab.id
                  ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                  : isDarkMode ? 'bg-slate-700 text-slate-300 border-slate-600 active:bg-slate-600' : 'bg-white text-slate-600 border-slate-300 active:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'intro' && <IntroSection changeTab={setActiveTab} isDarkMode={isDarkMode} />}
        {activeTab === 'curve' && <CurvePlayground isDarkMode={isDarkMode} />}
        {activeTab === 'add' && <PointAddition isDarkMode={isDarkMode} />}
        {activeTab === 'multiply' && <ScalarMultiplication isDarkMode={isDarkMode} />}
        {activeTab === 'sha256' && <SHA256Section isDarkMode={isDarkMode} />}
        {activeTab === 'sign' && <SignatureSimulation isDarkMode={isDarkMode} />}
        {activeTab === 'security' && <SecurityComparison isDarkMode={isDarkMode} />}
        {activeTab === 'realworld' && <RealWorldApplications isDarkMode={isDarkMode} />}
        {activeTab === 'quiz' && <QuizSection isDarkMode={isDarkMode} />}
      </main>

      <footer className={`max-w-6xl mx-auto px-4 py-6 text-center ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} text-sm`}>
        <p>此演示仅用于教育目的。比特币实际使用的是有限域上的 secp256k1 曲线。</p>
      </footer>
    </div>
  );
};

// 1. 简介部分
const IntroSection = ({ changeTab, isDarkMode }: { changeTab: (tab: string) => void; isDarkMode: boolean }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">比特币的数学魔法</h1>
      <p className="text-orange-50 text-lg md:text-xl max-w-2xl leading-relaxed">
        你可能听说过"私钥"和"公钥"，但它们到底是什么？<br/>
        这不仅仅是密码，这是一场在数学曲线上的"台球游戏"。中本聪利用这种数学魔法，让你能证明"这笔钱是我的"，而不需要告诉任何人你的密码。
      </p>
      <button
        onClick={() => changeTab('curve')}
        className="mt-8 bg-white text-orange-700 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
      >
        第一步：认识曲线 <ArrowRight className="h-5 w-5" />
      </button>
    </div>

    <div className="grid md:grid-cols-3 gap-6">
      <Card title="中本聪的选择" icon={<div className="font-serif italic text-2xl">y² = x³ + 7</div>} isDarkMode={isDarkMode}>
        比特币没有使用复杂的参数，而是选择了一条极其简洁的曲线，名为 <strong>secp256k1</strong>。它的形状决定了比特币的安全基石。
      </Card>
      <Card title="不可逆的魔法" icon={<RefreshCw className="h-8 w-8 text-orange-500" />} isDarkMode={isDarkMode}>
        在这个曲线上，你可以轻松地将一个点"乘"上一亿次，但如果只给你结果，你绝对算不出原来的点乘了多少次。这就是私钥安全的秘密。
      </Card>
      <Card title="所有权证明" icon={<FileSignature className="h-8 w-8 text-orange-500" />} isDarkMode={isDarkMode}>
        当你发送比特币时，你其实是在用私钥对交易信息进行"数学盖章"。矿工通过公钥验证这个章，确认钱确实是你花的，且金额未被篡改。
      </Card>
    </div>
  </div>
);

const Card = ({ title, icon, children, isDarkMode }: any) => (
  <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'} p-6 rounded-xl shadow-sm border hover:shadow-md transition-shadow`}>
    <div className="mb-4 flex justify-center md:justify-start">{icon}</div>
    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{title}</h3>
    <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} leading-relaxed text-sm`}>{children}</p>
  </div>
);


// 2. 曲线形状部分
const CurvePlayground = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const [mode, setMode] = useState('bitcoin');
  const [a, setA] = useState(0);
  const [b, setB] = useState(7);

  useEffect(() => {
    if (mode === 'bitcoin') {
      setA(0); setB(7);
    } else {
      setA(-1); setB(1);
    }
  }, [mode]);

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ECCGraph a={a} b={b} />
      </div>
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>曲线形状</h2>

          <div className={`flex ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} p-1 rounded-lg mb-6`}>
            <button
              onClick={() => setMode('standard')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'standard'
                  ? isDarkMode ? 'bg-slate-600 text-white shadow' : 'bg-white text-slate-900 shadow'
                  : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              普通椭圆曲线
            </button>
            <button
              onClick={() => setMode('bitcoin')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                mode === 'bitcoin' ? 'bg-orange-500 text-white shadow' : isDarkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              比特币曲线 (secp256k1)
            </button>
          </div>

          <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4 text-sm`}>
            数学公式：<code className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} p-1 rounded font-bold font-mono`}>y² = x³ + ax + b</code>
          </p>

          <div className={`space-y-4 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl border`}>
            <div>
              <label className={`flex justify-between text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                <span>参数 a {mode === 'bitcoin' && '(固定为 0)'}</span>
                <span>{a}</span>
              </label>
              <input
                type="range" min="-5" max="5" step="0.5"
                disabled={mode === 'bitcoin'}
                value={a} onChange={(e) => setA(parseFloat(e.target.value))}
                className={`w-full ${mode === 'bitcoin' ? 'accent-slate-300 cursor-not-allowed' : 'accent-indigo-600'}`}
              />
            </div>
            <div>
              <label className={`flex justify-between text-sm font-medium ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-1`}>
                <span>参数 b {mode === 'bitcoin' && '(固定为 7)'}</span>
                <span>{b}</span>
              </label>
              <input
                type="range" min="-10" max="10" step="0.5"
                disabled={mode === 'bitcoin'}
                value={b} onChange={(e) => setB(parseFloat(e.target.value))}
                className={`w-full ${mode === 'bitcoin' ? 'accent-slate-300 cursor-not-allowed' : 'accent-indigo-600'}`}
              />
            </div>
          </div>
        </div>

        <div className={`p-4 rounded-lg border text-sm leading-relaxed ${
          mode === 'bitcoin'
            ? isDarkMode ? 'bg-orange-500/20 border-orange-500/30 text-orange-300' : 'bg-orange-50 border-orange-100 text-orange-800'
            : isDarkMode ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-indigo-50 border-indigo-100 text-indigo-800'
        }`}>
          <h3 className="font-bold flex items-center gap-2 mb-2">
            <Info className="h-4 w-4" />
            {mode === 'bitcoin' ? '为什么比特币选这条？' : '普通曲线长什么样？'}
          </h3>
          {mode === 'bitcoin' ? (
            <p>
              比特币使用了参数非常简单的 <strong>secp256k1</strong> 曲线 (a=0, b=7)。这不仅提高了计算效率，更重要的是，参数越简单，越能证明设计者没有在参数中"藏后门"。
            </p>
          ) : (
             <p>
              一般的椭圆曲线通过调整 a 和 b 可以变成各种奇怪的形状（如分离的蛋状圆环）。但在密码学中，我们只关心它的数学性质。试着拖动滑块，看看曲线如何变化！
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// 3. 点加法
const PointAddition = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const a = 0, b = 7;
  const [px, setPx] = useState(-1.8);
  const [py, setPy] = useState(0);
  const [qx, setQx] = useState(0.5);
  const [qy, setQy] = useState(0);
  const [isDoubling, setIsDoubling] = useState(false);
  const [animState, setAnimState] = useState('idle');
  const [ballProgress, setBallProgress] = useState(0);

  useEffect(() => {
    const y = calculateY(px, a, b);
    if (!isNaN(y)) setPy(y);
  }, [px]);

  useEffect(() => {
    const y = calculateY(qx, a, b);
    if (!isNaN(y)) setQy(y);
  }, [qx]);

  const calculateResult = () => {
    let slope;
    if (isDoubling || (Math.abs(px - qx) < 0.05)) {
        if (py === 0) return null; 
        slope = (3 * px * px + a) / (2 * py);
    } else {
        slope = (qy - py) / (qx - px);
    }
    const rx = slope * slope - px - (isDoubling ? px : qx);
    const intersectY = slope * (rx - px) + py;
    const ry = -intersectY;
    return { x: rx, y: ry, intersectY: intersectY, slope: slope };
  };

  const result = calculateResult();

  useEffect(() => {
    if (animState === 'idle' || animState === 'done') return;
    let startTime: number | null = null;
    const duration = 1200; 
    const frame = (time: number) => {
        if (!startTime) startTime = time;
        const p = Math.min((time - startTime) / duration, 1);
        setBallProgress(p);
        if (p < 1) {
            requestAnimationFrame(frame);
        } else {
            if (animState === 'shooting') {
                setAnimState('reflecting');
                setBallProgress(0);
            } else if (animState === 'reflecting') {
                setAnimState('done');
            }
        }
    };
    requestAnimationFrame(frame);
  }, [animState]);

  const startAnimation = () => {
    if (!result) return;
    setAnimState('shooting');
    setBallProgress(0);
  };

  const getBallPos = (): BallPos | null => {
    if (animState === 'idle' || !result) return null;
    if (animState === 'shooting') {
        return { start: {x: px, y: py}, end: {x: result.x, y: result.intersectY}, progress: ballProgress };
    }
    if (animState === 'reflecting') {
        return { start: {x: result.x, y: result.intersectY}, end: {x: result.x, y: result.y}, progress: ballProgress };
    }
    return null; // done
  };

  const points: Point[] = [
    { x: px, y: py, label: 'P', color: '#ea580c' },
    ...(!isDoubling ? [{ x: qx, y: qy, label: 'Q', color: '#0ea5e9' }] : []),
    ...(result && animState !== 'idle' ? [
        { x: result.x, y: result.intersectY, label: '撞击点', color: '#94a3b8', size: 4 },
        ...(animState === 'done' ? [{ x: result.x, y: result.y, label: 'R (落点)', color: '#d946ef', size: 8 }] : [])
    ] : [])
  ];

  const lines: Line[] = [];
  if (result) {
      const range = 20; 
      const x1 = px - range; 
      const x2 = px + range;
      const y1 = result.slope * (x1 - px) + py;
      const y2 = result.slope * (x2 - px) + py;

      lines.push({ 
        x1: x1, y1: y1, x2: x2, y2: y2,
        color: '#fbbf24', dashed: animState === 'idle' 
      });

      if (animState === 'reflecting' || animState === 'done') {
          lines.push({ 
              x1: result.x, y1: result.intersectY, 
              x2: result.x, y2: result.y, 
              color: '#94a3b8', dashed: true 
          });
      }
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ECCGraph
            a={a} b={b} points={points} lines={lines}
            interactive={animState === 'idle' || animState === 'done'}
            onDrag={(x) => { setPx(x); setAnimState('idle'); }}
            animatingBall={getBallPos()}
        />
        <div className={`mt-4 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
            {animState === 'idle' || animState === 'done' ? '拖动橙色点 P 调整位置，黄色虚线为瞄准方向' : '计算中...'}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>台球加法规则</h2>
          <div className="flex gap-2 mb-4">
            <button
                onClick={() => { setIsDoubling(false); setAnimState('idle'); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${!isDoubling ? 'bg-orange-600 text-white border-orange-600' : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600' : 'bg-white text-slate-600 border-slate-300'}`}
            >
                P + Q (两球)
            </button>
            <button
                onClick={() => { setIsDoubling(true); setAnimState('idle'); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold border ${isDoubling ? 'bg-orange-600 text-white border-orange-600' : isDarkMode ? 'bg-slate-800 text-slate-300 border-slate-600' : 'bg-white text-slate-600 border-slate-300'}`}
            >
                P + P (自旋)
            </button>
          </div>

          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 rounded-xl border shadow-sm`}>
             <p className={`${isDarkMode ? 'text-slate-400' : 'text-slate-600'} text-sm mb-4`}>
                {isDoubling
                    ? '当我们要计算 P+P 时，不能连接两个点。取而代之的是使用 P 点的"切线"方向来击球。'
                    : '椭圆曲线的加法就像打台球。连接两点（P和Q）进行瞄准，球会撞到曲线上的某一点。'
                }
             </p>
             <button
                onClick={startAnimation}
                disabled={!result || (animState !== 'idle' && animState !== 'done')}
                className={`w-full ${isDarkMode ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-900 hover:bg-slate-800'} text-white py-3 rounded-lg font-bold disabled:opacity-50 flex items-center justify-center gap-2`}
             >
                <Target className="h-5 w-5" /> 发射台球
             </button>
          </div>
          {isDoubling && (
            <div className={`mt-4 ${isDarkMode ? 'bg-indigo-500/20 border-indigo-500/30' : 'bg-indigo-50 border-indigo-100'} p-4 rounded-lg border animate-in fade-in slide-in-from-top-2`}>
                <h4 className={`font-bold ${isDarkMode ? 'text-indigo-300' : 'text-indigo-800'} flex items-center gap-2 mb-2`}>
                    <MousePointer2 className="h-4 w-4" /> 什么是&quot;切线&quot;？
                </h4>
                <p className={`text-sm ${isDarkMode ? 'text-indigo-200' : 'text-indigo-700'} leading-relaxed`}>
                    想象你在 P 点滑雪。曲线就是山坡，<strong>切线就是你滑雪板指向的方向</strong>。
                    <br/><br/>
                    也就是仅仅"擦过" P 点边缘，而不穿过它的那条直线。它代表了曲线在这一点的瞬间方向。
                </p>
            </div>
          )}
          {animState === 'done' && (
              <div className={`mt-4 ${isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200'} p-4 rounded-lg border animate-in fade-in slide-in-from-bottom-2`}>
                  <h4 className={`font-bold ${isDarkMode ? 'text-green-300' : 'text-green-800'} flex items-center gap-2 mb-1`}>
                      <CheckCircle className="h-4 w-4" /> 计算完成
                  </h4>
                  <p className={`text-sm ${isDarkMode ? 'text-green-200' : 'text-green-700'}`}>
                      R 点垂直落下。结果：<span className="font-mono font-bold">P {isDoubling ? '+ P' : '+ Q'} = R</span>。
                  </p>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. 公私钥
const ScalarMultiplication = ({ isDarkMode }: { isDarkMode: boolean }) => {
  const a = 0, b = 7;
  const startX = -1.2;
  const [currentP, setCurrentP] = useState({ x: startX, y: calculateY(startX, a, b) });
  const [step, setStep] = useState(1);
  const [targetStep, setTargetStep] = useState<number | null>(null);
  const [history, setHistory] = useState<any[]>([]); // Past states
  const [future, setFuture] = useState<any[]>([]); // For Redo
  const [hideStep, setHideStep] = useState(false);
  const [inputPrivKey, setInputPrivKey] = useState('');
  const [scale, setScale] = useState(26);

  const [animState, setAnimState] = useState('idle');
  const [ballProgress, setBallProgress] = useState(0);
  const [animData, setAnimData] = useState<any>(null); 

  const initialP = { x: startX, y: calculateY(startX, a, b) };

  // 统一的缩放计算函数
  const calculateOptimalScale = (x: number, y: number) => {
      const maxCoord = Math.max(Math.abs(x), Math.abs(y));
      const padding = 2;
      let targetScale = 200 / (maxCoord + padding);
      return Math.min(Math.max(targetScale, 1.0), 40); 
  };

  useEffect(() => {
    if (animState !== 'idle') return; 
    const targetScale = calculateOptimalScale(currentP.x, currentP.y);
    if (Math.abs(scale - targetScale) > 0.1) {
        setScale(targetScale);
    }
  }, [currentP, animState]);

  const calculateNext = (p1: any, p2: any) => {
      let m;
      let isDoubling = false;
      if (Math.abs(p1.x - p2.x) < 0.001 && Math.abs(p1.y - p2.y) < 0.001) {
         if (p1.y === 0) return null; 
         m = (3 * p1.x * p1.x + a) / (2 * p1.y);
         isDoubling = true;
      } else {
         if (Math.abs(p1.x - p2.x) < 0.001) return null; 
         m = (p2.y - p1.y) / (p2.x - p1.x);
      }
      const x3 = m * m - p1.x - p2.x;
      const intersectY = m * (x3 - p1.x) + p1.y; 
      const y3 = -intersectY; 
      return { x: x3, y: y3, intersectY, slope: m, isDoubling };
  };

  const nextStep = () => {
      setFuture([]);
      if (targetStep !== null) {
          const res = calculateNext(currentP, initialP);
          if (res) {
              setHistory(prev => [...prev, { ...currentP, step }]);
              setCurrentP({ x: res.x, y: res.y });
              setStep(s => s + 1);
          }
          return;
      }
      const res = calculateNext(currentP, initialP);
      if (res) {
          setAnimData(res);
          setAnimState('shooting');
          setBallProgress(0);
      }
  };

  const handleUndo = () => {
      if (history.length === 0) return;
      const prev = history[history.length - 1];
      setFuture(prevFuture => [{ p: currentP, step: step }, ...prevFuture]);
      setCurrentP({ x: prev.x, y: prev.y });
      setStep(prev.step);
      setHistory(prevHist => prevHist.slice(0, -1));
      setAnimState('idle');
  };

  const handleRedo = () => {
      if (future.length === 0) return;
      const next = future[0];
      setHistory(prevHist => [...prevHist, { ...currentP, step }]);
      setCurrentP({ x: next.p.x, y: next.p.y });
      setStep(next.step);
      setFuture(prevFut => prevFut.slice(1));
  };

  const reset = () => {
    setStep(1);
    setTargetStep(null);
    setCurrentP(initialP);
    setHistory([]);
    setFuture([]); 
    setHideStep(false);
    setAnimState('idle');
    setAnimData(null);
    setScale(26); 
  };

  useEffect(() => {
    if (animState === 'idle') return;
    let startTime: number | null = null;
    const duration = 1200; 
    const frame = (time: number) => {
        if (!startTime) startTime = time;
        const p = Math.min((time - startTime) / duration, 1);
        setBallProgress(p);
        if (animData) {
            let activeX, activeY;
            if (animState === 'shooting') {
                activeX = currentP.x + (animData.x - currentP.x) * p;
                activeY = currentP.y + (animData.intersectY - currentP.y) * p;
            } else {
                activeX = animData.x;
                activeY = animData.intersectY + (animData.y - animData.intersectY) * p;
            }
            const targetScale = calculateOptimalScale(activeX, activeY);
            setScale(targetScale);
        }
        if (p < 1) {
            requestAnimationFrame(frame);
        } else {
            if (animState === 'shooting') {
                setAnimState('reflecting');
                setBallProgress(0);
            } else if (animState === 'reflecting') {
                if (animData) {
                    setHistory(prev => [...prev, { ...currentP, step }]);
                    setCurrentP({ x: animData.x, y: animData.y });
                    setStep(s => s + 1);
                }
                setAnimState('idle');
                setAnimData(null);
            }
        }
    };
    requestAnimationFrame(frame);
  }, [animState, animData, currentP, step]);

  const runToTarget = (k: number) => {
      setTargetStep(k);
      setHideStep(true); 
  };
  
  // 新增：直接跳转到目标步数，消除动画过程
  const handleJumpTo = (k: number) => {
    // 立即停止动画相关的状态
    setTargetStep(null);
    setAnimState('idle');
    setAnimData(null);
    setFuture([]);

    // 同步计算所有历史步骤
    let curr: Point | null = initialP;
    const newHistory = [];
    
    // 从 step 1 开始计算到 step k
    for (let i = 1; i < k; i++) {
        if (!curr) break;
        newHistory.push({ x: curr.x, y: curr.y, step: i });
        curr = addPoints(curr, initialP, a);
    }
    
    // 更新最终状态
    if (curr) {
        setHistory(newHistory);
        setCurrentP({ x: curr.x, y: curr.y });
        setStep(k);
        setHideStep(true);
        
        // 立即调整缩放以适应最终点
        const targetScale = calculateOptimalScale(curr.x, curr.y);
        setScale(targetScale);
    }
  };

  useEffect(() => {
    let interval: any;
    if (targetStep && step < targetStep) {
        interval = setInterval(() => {
            nextStep();
        }, 50); 
    } else if (targetStep && step >= targetStep) {
        setTargetStep(null); 
    }
    return () => clearInterval(interval);
  }, [targetStep, step]);

  const getLines = (): Line[] => {
      if (animState !== 'idle' && animData) {
          const lines: Line[] = [];
          const range = 2000; 
          const startPoint = currentP; 
          const x1 = startPoint.x - range; 
          const x2 = startPoint.x + range;
          const y1 = animData.slope * (x1 - startPoint.x) + startPoint.y;
          const y2 = animData.slope * (x2 - startPoint.x) + startPoint.y;
          lines.push({ x1, y1, x2, y2, color: '#fbbf24' }); 
          if (animState === 'reflecting') {
             lines.push({ 
                 x1: animData.x, y1: animData.intersectY, 
                 x2: animData.x, y2: animData.y, 
                 color: '#94a3b8', dashed: true 
             });
          }
          return lines;
      }
      return []; 
  };

  const getBallPos = (): BallPos | null => {
    if (animState === 'idle' || !animData) return null;
    if (animState === 'shooting') {
        return { 
            start: {x: currentP.x, y: currentP.y}, 
            end: {x: animData.x, y: animData.intersectY}, 
            progress: ballProgress 
        };
    }
    if (animState === 'reflecting') {
        return { 
            start: {x: animData.x, y: animData.intersectY}, 
            end: {x: animData.x, y: animData.y}, 
            progress: ballProgress 
        };
    }
    return null;
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <ECCGraph
            a={a} b={b}
            scale={scale}
            points={[
                { x: initialP.x, y: initialP.y, label: 'G (基点)', color: '#ea580c', labelDx: -40, labelDy: 20 },
                { x: currentP.x, y: currentP.y, label: hideStep ? '?' : `K (公钥 ${step}G)`, color: '#d946ef', labelDx: 10, labelDy: -10 },
                ...(step > 1 ? [{ x: initialP.x, y: initialP.y, label: 'G', color: '#ea580c', size: 4 }] : []),
                ...history.map(h => ({ x: h.x, y: h.y, color: '#cbd5e1', size: 3 }))
            ]}
            lines={getLines()}
            animatingBall={getBallPos()}
        />
        <div className={`mt-4 text-center text-sm ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} min-h-[20px]`}>
            {animState !== 'idle' ? (
                <span className="text-orange-600 font-bold animate-pulse">
                    正在计算: {step === 1 ? 'G + G (切线倍乘)' : `${step}G + G (两点相加)`} ...
                </span>
            ) : (
                step === 1 ? '点击"单步"开始打台球' : `已经连续击球 ${step-1} 次`
            )}
        </div>
      </div>
      <div className="space-y-6">
        <div>
          <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>生成公私钥</h2>

          <div className={`${isDarkMode ? 'bg-blue-500/20 border-blue-500/30 text-blue-300' : 'bg-blue-50 border-blue-100 text-blue-800'} rounded-lg p-4 mb-4 text-sm border`}>
             <h4 className="font-bold flex items-center gap-2 mb-2">
                 <MousePointer2 className="h-4 w-4" /> 为什么 2G+G 计算方式不一样？
             </h4>
             <ul className="space-y-2 list-disc list-inside">
                 <li>
                     <strong>第一杆 (1G &rarr; 2G):</strong> 此时你的球在 G 点，你要加的也是 G 点。两个点重合了，无法连线，所以只能打<strong>切线</strong> (G的瞬间方向)。
                 </li>
                 <li>
                     <strong>第二杆 (2G &rarr; 3G):</strong> 你的球现在停在 2G 点。你要加的还是 G 点。现在有两个不同的点 (2G 和 G)，所以直接<strong>连接这两个点</strong>来击球。
                 </li>
             </ul>
          </div>

          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-5 rounded-xl border shadow-sm space-y-4`}>
             {/* 状态显示 */}
             <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'} p-3 rounded-lg`}>
                <div className="flex justify-between items-center mb-2">
                    <div className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>当前公式:</div>
                    <div className={`font-mono text-lg ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'} font-bold`}>
                        K = <span className={hideStep ? 'bg-slate-800 text-white px-1 rounded' : ''}>{hideStep ? '???' : step}</span> × G
                    </div>
                </div>
                <div className={`text-xs ${isDarkMode ? 'text-slate-500 border-slate-600' : 'text-slate-500 border-slate-200'} font-mono border-t pt-2 mt-2`}>
                    {step === 1 ? (
                        <span>初始状态: 只有 1 个 G</span>
                    ) : (
                        <div className="flex items-center gap-2 animate-in slide-in-from-left">
                            <span className={`${isDarkMode ? 'bg-slate-600' : 'bg-slate-200'} px-1 rounded`}>{step}G</span>
                            <span>=</span>
                            <span className={`${isDarkMode ? 'bg-purple-500/30 text-purple-300' : 'bg-purple-100 text-purple-700'} px-1 rounded`}>{step-1}G</span>
                            <span>+</span>
                            <span className={`${isDarkMode ? 'bg-orange-500/30 text-orange-300' : 'bg-orange-100 text-orange-700'} px-1 rounded`}>G</span>
                        </div>
                    )}
                </div>
             </div>

             {/* 核心控制按钮组 */}
             <div className="grid grid-cols-2 gap-2">
                 <button
                    onClick={nextStep}
                    disabled={!!targetStep || animState !== 'idle'}
                    className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm"
                 >
                    <Plus className="h-5 w-5" /> 单步执行 (+G)
                 </button>

                 <button
                    onClick={handleUndo}
                    disabled={history.length === 0 || !!targetStep || animState !== 'idle'}
                    className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'} border py-2 rounded-lg font-medium disabled:opacity-50 flex justify-center items-center gap-1`}
                 >
                    <RotateCcw className="h-4 w-4" /> 撤销
                 </button>

                 <button
                    onClick={handleRedo}
                    disabled={future.length === 0 || !!targetStep || animState !== 'idle'}
                    className={`${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'} border py-2 rounded-lg font-medium disabled:opacity-50 flex justify-center items-center gap-1`}
                 >
                    <RotateCw className="h-4 w-4" /> 重做
                 </button>
             </div>

             {/* 高级功能 */}
             <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'} space-y-2`}>
                 <button
                    onClick={() => {
                        const randomK = Math.floor(Math.random() * 30) + 10;
                        handleJumpTo(randomK);
                    }}
                    disabled={!!targetStep || animState !== 'idle'}
                    className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 flex justify-center items-center gap-1"
                 >
                    <Zap className="h-4 w-4" /> 随机私钥 (演示)
                 </button>

                 <div className="flex gap-2">
                     <input
                        type="number"
                        placeholder="输入私钥 (1-50)"
                        value={inputPrivKey}
                        onChange={(e) => setInputPrivKey(e.target.value)}
                        className={`flex-1 border rounded px-2 text-sm ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-500' : ''}`}
                     />
                     <button
                        onClick={() => {
                            const k = parseInt(inputPrivKey);
                            if(k > 0 && k <= 50) {
                                handleJumpTo(k);
                            }
                        }}
                        className="bg-slate-800 text-white px-3 py-1 rounded text-sm hover:bg-slate-700"
                     >
                        执行
                     </button>
                 </div>
             </div>

             {hideStep && !targetStep && (
                  <button
                    onClick={() => setHideStep(false)}
                    className="w-full bg-green-600 text-white py-2 rounded-lg font-semibold hover:bg-green-700 flex justify-center items-center gap-2 mt-2"
                  >
                    <Unlock className="h-4 w-4" /> 揭晓私钥 (答案: {step})
                  </button>
             )}

             <button onClick={reset} className={`w-full text-sm ${isDarkMode ? 'text-slate-500 hover:text-red-400 hover:bg-red-500/20' : 'text-slate-400 hover:text-red-500 hover:bg-red-50'} py-2 rounded flex items-center justify-center gap-1 mt-1 transition-colors`}>
                <RefreshCw className="h-3 w-3" /> 重置所有
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// 5. SHA-256 演示组件
const SHA256Section = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const [input, setInput] = useState("Hello World");
    const [hashData, setHashData] = useState({ hex: "", binary: "" });
    const [nonce, setNonce] = useState(0);
    const [isMining, setIsMining] = useState(false);

    useEffect(() => {
        let active = true;
        const finalInput = input + (nonce > 0 ? nonce.toString() : "");
        computeSHA256(finalInput).then(data => {
            if(active) setHashData(data);
        });
        return () => { active = false; };
    }, [input, nonce]);

    useEffect(() => {
        if (!isMining) return;
        let currentNonce = nonce;
        let active = true;
        const mine = async () => {
            while (active && isMining) {
                currentNonce++;
                const finalInput = input + currentNonce.toString();
                const data = await computeSHA256(finalInput);
                if (data.hex.startsWith('00')) {
                    setNonce(currentNonce);
                    setHashData(data);
                    setIsMining(false);
                    break;
                }
                if (currentNonce % 50 === 0) {
                    setNonce(currentNonce);
                    await new Promise(r => setTimeout(r, 0)); 
                }
            }
        };
        mine();
        return () => { active = false; setIsMining(false); };
    }, [isMining, input]);

    const renderBitGrid = () => {
        const bits = hashData.binary.split('').slice(0, 256);
        return (
            <div
                className={`grid gap-0.5 w-fit mx-auto ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} p-1 rounded border ${isDarkMode ? 'border-slate-600' : 'border-slate-300'}`}
                style={{ gridTemplateColumns: 'repeat(16, 1fr)' }}
            >
                {bits.map((bit, i) => (
                    <div
                        key={i}
                        className={`w-3 h-3 sm:w-4 sm:h-4 rounded-[1px] transition-colors duration-300 ${bit === '1' ? 'bg-indigo-600' : isDarkMode ? 'bg-slate-800' : 'bg-white'}`}
                        title={`Bit ${i}: ${bit}`}
                    ></div>
                ))}
            </div>
        );
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            <div className="space-y-6">
                <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-6 rounded-xl border shadow-sm text-center`}>
                    <h3 className={`text-sm font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} uppercase mb-4`}>雪崩效应可视化 (256位)</h3>
                    {renderBitGrid()}
                    <p className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} mt-2`}>每一个方格代表哈希值中的 1 个二进制位</p>
                </div>

                <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} p-4 rounded-lg border`}>
                    <h3 className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} flex items-center gap-2 mb-2`}>
                        <Fingerprint className="h-5 w-5" /> 数字指纹特性
                    </h3>
                    <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} list-disc list-inside`}>
                        <li><strong>不可逆：</strong> 无法从指纹还原出原始文本。</li>
                        <li><strong>唯一性：</strong> 不同的输入几乎不可能产生相同的指纹。</li>
                        <li><strong>雪崩效应：</strong> 输入改一点点，指纹完全变样。</li>
                    </ul>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>SHA-256 哈希函数</h2>
                    <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>比特币挖矿和签名的基石。</p>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>输入文本</label>
                        <textarea
                            value={input}
                            onChange={(e) => { setInput(e.target.value); setNonce(0); }}
                            className={`w-full mt-1 p-3 border rounded-lg font-mono text-sm h-24 focus:ring-2 focus:ring-indigo-500 outline-none ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white' : ''}`}
                        />
                    </div>

                    <div className={`${isDarkMode ? 'bg-amber-500/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'} p-4 rounded-lg border`}>
                        <div className="flex justify-between items-center mb-2">
                            <label className={`text-sm font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'} flex items-center gap-2`}>
                                <Cpu className="h-4 w-4" /> 挖矿模拟 (Proof of Work)
                            </label>
                            <span className={`text-xs font-mono ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-white border-amber-100'} px-2 py-1 rounded border`}>Nonce: {nonce}</span>
                        </div>
                        <p className={`text-xs ${isDarkMode ? 'text-amber-200' : 'text-amber-700'} mb-3`}>
                            矿工的任务：不断调整 Nonce（随机数），直到生成的哈希值以 <strong>00</strong> 开头。
                        </p>
                        <button
                            onClick={() => setIsMining(!isMining)}
                            className={`w-full py-2 rounded font-bold text-sm flex justify-center items-center gap-2 transition-colors ${isMining ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-amber-500 text-white hover:bg-amber-600'}`}
                        >
                            {isMining ? <RefreshCw className="h-4 w-4 animate-spin"/> : <Zap className="h-4 w-4"/>}
                            {isMining ? '正在寻找...' : '开始挖矿'}
                        </button>
                    </div>

                    <div>
                        <label className={`text-sm font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'}`}>SHA-256 输出 (16进制)</label>
                        <div className={`mt-1 p-3 rounded-lg font-mono text-xs break-all border transition-colors duration-500 ${
                            hashData.hex.startsWith('00')
                                ? isDarkMode ? 'bg-green-500/20 border-green-500/30 text-green-300' : 'bg-green-100 border-green-400 text-green-900'
                                : isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                        }`}>
                            {hashData.hex || "Calculating..."}
                        </div>
                        {hashData.hex.startsWith('00') && (
                            <p className={`text-xs ${isDarkMode ? 'text-green-400' : 'text-green-600'} mt-1 font-bold flex items-center gap-1 animate-in slide-in-from-top-1`}>
                                <CheckCircle className="h-3 w-3"/> 挖矿成功！找到有效哈希。
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. 签名模拟 - 深度优化：垂直并列显示 + 实际例子
const SignatureSimulation = ({ isDarkMode }: { isDarkMode: boolean }) => {
    // 最大已解锁步骤
    const [maxStep, setMaxStep] = useState(0);

    // 密码学变量
    const [privKey, setPrivKey] = useState<number | null>(null);
    const [pubKeyP, setPubKeyP] = useState<Point | null>(null);
    const [nonceK, setNonceK] = useState<number | null>(null);
    const [pointR, setPointR] = useState<Point | null>(null);
    const [message, setMessage] = useState("Alice -> Bob: 5 BTC");
    const [signature, setSignature] = useState<{r: number, s: number, originalZ: number} | null>(null); 
    
    // 简单哈希模拟 (根据字符串长度和内容变化)
    const getHash = (msg: string) => {
        let hash = 0;
        for (let i = 0; i < msg.length; i++) {
            hash = ((hash << 5) - hash) + msg.charCodeAt(i);
            hash |= 0; 
        }
        // 为了演示方便，映射到一个小的正整数范围 (1-10)
        return Math.abs(hash % 10) + 1;
    };

    const messageHash = getHash(message);

    const a = 0, b = 7;
    const startX = -1.2;
    const startY = calculateY(startX, a, b);
    const G = { x: startX, y: startY };

    // 初始化
    const initKeys = () => {
        const d = Math.floor(Math.random() * 5) + 2; 
        const Q = scalarMult(d, G, a);
        setPrivKey(d);
        setPubKeyP(Q);
        setNonceK(null);
        setPointR(null);
        setSignature(null);
        setMaxStep(0); 
        setMessage("Alice -> Bob: 5 BTC");
    };

    useEffect(() => { if (!privKey) initKeys(); }, []);

    // 步骤操作函数
    const nextStep = (stepIndex: number) => {
        if (stepIndex === 0) { // Confirm Identity
            setMaxStep(1);
        } else if (stepIndex === 1) { // Confirm Message
            setMaxStep(2);
        } else if (stepIndex === 2) { // Generate R
            const k = Math.floor(Math.random() * 4) + 1; 
            const R = scalarMult(k, G, a);
            setNonceK(k);
            setPointR(R);
            setMaxStep(3);
        } else if (stepIndex === 3) { // Sign
            if (!pointR || !privKey || !nonceK) return;
            const r = pointR.x;
            const z = messageHash;
            const d = privKey;
            const k = nonceK;
            // s = (z + r*d) / k (简化数学模拟)
            const s = (z + r * d) / k; 
            setSignature({ r, s, originalZ: z }); // Store original Z to detect tamper later
            setMaxStep(4);
        }
    };

    // 动态图表点
    let graphPoints: Point[] = [{ x: G.x, y: G.y, label: 'G', color: '#ea580c' }];
    if (pubKeyP) graphPoints.push({ x: pubKeyP.x, y: pubKeyP.y, label: 'Q', color: '#d946ef', size: 6 });
    if (pointR) graphPoints.push({ x: pointR.x, y: pointR.y, label: 'R', color: '#10b981', size: 6 });

    // 验证逻辑 (实时计算)
    let verifyStatus = 'pending';
    if (signature && pubKeyP) {
        const currentHash = getHash(message);
        const isValid = Math.abs(currentHash - signature.originalZ) < 0.1;
        verifyStatus = isValid ? 'success' : 'fail';
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            {/* 左侧：固定图示 */}
            <div className="lg:col-span-2 space-y-4 lg:sticky lg:top-24 h-fit">
                <ECCGraph a={a} b={b} points={graphPoints} scale={30} />
                <div className={`text-center text-sm ${isDarkMode ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-50'} p-2 rounded`}>
                    图示：<span className="text-orange-600 font-bold">G</span>
                    {pubKeyP && <span> &rarr; <span className="text-pink-600 font-bold">Q (公钥)</span></span>}
                    {pointR && <span> &rarr; <span className="text-emerald-600 font-bold">R (随机点)</span></span>}
                </div>
            </div>

            {/* 右侧：垂直流程 (Timeline) */}
            <div className="space-y-4">
                <h2 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <span>数字签名流程</span>
                    <button onClick={initKeys} className={`ml-auto text-xs ${isDarkMode ? 'bg-slate-700 hover:bg-slate-600' : 'bg-slate-100 hover:bg-slate-200'} px-2 py-1 rounded flex items-center gap-1`}>
                        <RefreshCw className="w-3 h-3"/> 重置
                    </button>
                </h2>

                {/* Step 0: Identity */}
                <div className={`border rounded-xl p-4 transition-all ${maxStep >= 0 ? isDarkMode ? 'bg-slate-800 border-slate-700 shadow-sm' : 'bg-white border-slate-200 shadow-sm' : 'opacity-50'}`}>
                    <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                        <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} p-1.5 rounded`}><Key className="w-4 h-4"/></div>
                        1. Alice 创建身份
                    </div>
                    <div className="text-sm font-mono space-y-2 pl-9">
                        <div className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>私钥 d = <span className="font-bold">{privKey}</span> <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>(保密)</span></div>
                        <div className="text-pink-500">公钥 Q = d×G <span className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>(公开)</span></div>
                    </div>
                    {maxStep === 0 && (
                        <button onClick={() => nextStep(0)} className={`mt-3 w-full py-1.5 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} text-sm font-bold rounded flex justify-center items-center gap-1`}>
                            <ArrowDown className="w-4 h-4"/> 下一步：发起交易
                        </button>
                    )}
                </div>

                {/* Step 1: Message */}
                {maxStep >= 1 && (
                    <div className={`border rounded-xl p-4 transition-all animate-in slide-in-from-top-2 ${maxStep >= 1 ? isDarkMode ? 'bg-slate-800 border-slate-700 shadow-sm' : 'bg-white border-slate-200 shadow-sm' : 'opacity-50'}`}>
                        <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                            <div className={`${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} p-1.5 rounded`}><FileSignature className="w-4 h-4"/></div>
                            2. 发起交易 (撰写消息)
                        </div>
                        <div className="pl-9 space-y-2">
                            <input
                                type="text" value={message} onChange={(e) => setMessage(e.target.value)}
                                className={`w-full text-sm border rounded p-1.5 font-mono transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white focus:bg-slate-600' : 'bg-slate-50 focus:bg-white'}`}
                            />
                            <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} flex items-center gap-2`}>
                                <ArrowRight className="w-3 h-3"/>
                                <span>哈希算法 (SHA-256) &rarr;</span>
                                <span className={`font-mono ${isDarkMode ? 'bg-slate-700' : 'bg-slate-100'} px-1 rounded font-bold`}>z = {messageHash}</span>
                            </div>
                        </div>
                        {maxStep === 1 && (
                            <button onClick={() => nextStep(1)} className={`mt-3 w-full py-1.5 ${isDarkMode ? 'bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30' : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'} text-sm font-bold rounded flex justify-center items-center gap-1`}>
                                <ArrowDown className="w-4 h-4"/> 下一步：引入随机数
                            </button>
                        )}
                    </div>
                )}

                {/* Step 2: Randomness */}
                {maxStep >= 2 && (
                    <div className={`border rounded-xl p-4 transition-all animate-in slide-in-from-top-2 ${maxStep >= 2 ? isDarkMode ? 'bg-slate-800 border-emerald-500/30 shadow-sm' : 'bg-white border-emerald-200 shadow-sm' : ''}`}>
                        <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                            <div className={`${isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700'} p-1.5 rounded`}><Zap className="w-4 h-4"/></div>
                            3. 随机数魔法
                        </div>
                        <div className="pl-9">
                            {!pointR ? (
                                <button onClick={() => nextStep(2)} className="w-full py-2 bg-emerald-600 text-white text-sm font-bold rounded hover:bg-emerald-700">
                                    生成随机点 R
                                </button>
                            ) : (
                                <div className={`text-sm font-mono ${isDarkMode ? 'text-emerald-300 bg-emerald-500/20' : 'text-emerald-800 bg-emerald-50'} p-2 rounded`}>
                                    k = {nonceK} (临时密钥)<br/>
                                    R = k×G (x坐标: {pointR.x.toFixed(2)})
                                </div>
                            )}
                        </div>
                        {pointR && maxStep === 2 && (
                             <div className="mt-2 flex justify-center">
                                 <button onClick={() => setMaxStep(3)} className={`text-xs ${isDarkMode ? 'text-slate-500 hover:text-emerald-400' : 'text-slate-400 hover:text-emerald-600'} flex items-center gap-1`}>
                                     <ArrowDown className="w-3 h-3"/> 继续
                                 </button>
                             </div>
                        )}
                    </div>
                )}

                {/* Step 3: Signature */}
                {maxStep >= 3 && (
                    <div className={`border rounded-xl p-4 transition-all animate-in slide-in-from-top-2 ${maxStep >= 3 ? isDarkMode ? 'bg-slate-800 border-orange-500/30 shadow-sm' : 'bg-white border-orange-200 shadow-sm' : ''}`}>
                        <div className={`flex items-center gap-2 font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>
                            <div className={`${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'} p-1.5 rounded`}><Lock className="w-4 h-4"/></div>
                            4. Alice 生成签名
                        </div>
                        <div className="pl-9">
                            {/* 始终显示公式 */}
                            <div className={`mb-3 p-2 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'} border rounded text-xs font-mono`}>
                                核心公式: s = (z + r·d) / k
                            </div>

                            {!signature ? (
                                <button onClick={() => nextStep(3)} className="w-full py-2 bg-orange-600 text-white text-sm font-bold rounded hover:bg-orange-700">
                                    执行计算
                                </button>
                            ) : (
                                <div className={`text-sm font-mono ${isDarkMode ? 'text-orange-300 bg-orange-500/20' : 'text-orange-800 bg-orange-50'} p-2 rounded break-all`}>
                                    <div className="mb-1">
                                        r: {signature.r.toFixed(4)}... <span className={`text-xs ${isDarkMode ? 'bg-orange-500/30 text-orange-300' : 'bg-orange-200/50 text-orange-700'} px-1 rounded font-bold`}>&larr; (取自点 R 的 X 坐标)</span>
                                    </div>
                                    <div>
                                        s: {signature.s.toFixed(4)}...
                                    </div>
                                </div>
                            )}
                        </div>
                        {signature && maxStep === 3 && (
                             <div className="mt-2 flex justify-center">
                                 <button onClick={() => setMaxStep(4)} className={`text-xs ${isDarkMode ? 'text-slate-500 hover:text-orange-400' : 'text-slate-400 hover:text-orange-600'} flex items-center gap-1`}>
                                     <ArrowDown className="w-3 h-3"/> 前往验证
                                 </button>
                             </div>
                        )}
                    </div>
                )}

                {/* Step 4: Verify */}
                {maxStep >= 4 && signature && (
                    <div className={`border rounded-xl p-4 shadow-sm animate-in slide-in-from-top-2 transition-colors ${
                        verifyStatus === 'success'
                            ? isDarkMode ? 'bg-green-500/20 border-green-500/30' : 'bg-green-50 border-green-200'
                            : isDarkMode ? 'bg-red-500/20 border-red-500/30' : 'bg-red-50 border-red-200'
                    }`}>
                        <div className={`flex items-center gap-2 font-bold mb-2 ${verifyStatus === 'success' ? isDarkMode ? 'text-green-300' : 'text-green-800' : isDarkMode ? 'text-red-300' : 'text-red-800'}`}>
                            <div className={`p-1.5 rounded ${verifyStatus === 'success' ? isDarkMode ? 'bg-slate-800 text-green-400' : 'bg-white text-green-600' : isDarkMode ? 'bg-slate-800 text-red-400' : 'bg-white text-red-600'}`}>
                                {verifyStatus === 'success' ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                            </div>
                            5. 矿工验证
                        </div>

                        <div className="pl-9 text-xs space-y-3">
                            {/* 详细验证面板 */}
                            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} p-3 rounded border shadow-sm mb-3`}>
                                <h4 className={`font-bold ${isDarkMode ? 'text-slate-400' : 'text-slate-500'} mb-2 flex items-center gap-1`}>
                                    <Search className="w-3 h-3"/> 验证过程透视
                                </h4>
                                <div className={`space-y-2 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                    <div className={`flex justify-between border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'} pb-1`}>
                                        <span>1. 计算 u1 = z/s</span>
                                        <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>({messageHash.toFixed(2)} / {signature.s.toFixed(2)})</span>
                                    </div>
                                    <div className={`flex justify-between border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'} pb-1`}>
                                        <span>2. 计算 u2 = r/s</span>
                                        <span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>({signature.r.toFixed(2)} / {signature.s.toFixed(2)})</span>
                                    </div>
                                    <div className={`flex justify-between ${isDarkMode ? 'bg-slate-700' : 'bg-slate-50'} p-1 rounded`}>
                                        <span>3. 还原点 P = u1·G + u2·Q</span>
                                    </div>
                                    <div className={`flex justify-between items-center pt-1 font-bold ${isDarkMode ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                        <span>4. 检查 P.x == r ?</span>
                                    </div>
                                </div>
                            </div>

                            <p className={verifyStatus === 'success' ? isDarkMode ? 'text-green-300' : 'text-green-700' : isDarkMode ? 'text-red-300' : 'text-red-700'}>
                                {verifyStatus === 'success'
                                    ? "验证成功！计算出的 P.x 与签名中的 r 完全一致。证明交易确实来自私钥持有者，且内容未被篡改。"
                                    : "验证失败！计算结果不匹配。这说明要么签名是伪造的，要么交易金额被篡改了。"}
                            </p>

                            {/* 验签天平 */}
                            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white'} p-2 rounded border flex justify-between items-center font-mono text-sm`}>
                                <div className="text-center">
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>签名中的 r</div>
                                    <div className="font-bold text-orange-500">{signature.r.toFixed(4)}</div>
                                </div>
                                <div className={`${isDarkMode ? 'text-slate-500' : 'text-slate-300'} font-bold text-xl`}>
                                    {verifyStatus === 'success' ? '==' : '≠'}
                                </div>
                                <div className="text-center">
                                    <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>计算出的 P.x</div>
                                    <div className={`font-bold ${verifyStatus === 'success' ? 'text-green-500' : 'text-red-500'}`}>
                                        {verifyStatus === 'success' ? signature.r.toFixed(4) : (signature.r + 1.2345).toFixed(4)}
                                    </div>
                                </div>
                            </div>

                            {verifyStatus === 'fail' && (
                                <div className={`flex items-start gap-2 ${isDarkMode ? 'text-red-300 bg-red-500/20' : 'text-red-600 bg-red-100'} p-2 rounded`}>
                                    <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                                    <span>警报：当前消息的哈希值与签名不匹配！可能是黑客篡改了交易金额。</span>
                                </div>
                            )}

                            {/* 篡改实验 */}
                            <div className={`pt-2 border-t ${isDarkMode ? 'border-slate-700' : 'border-black/5'} mt-2`}>
                                <p className={isDarkMode ? 'text-slate-500' : 'text-slate-500'}>实验：尝试在上面的"第2步"中修改交易金额，看看会发生什么。</p>
                                <button
                                    onClick={() => setMessage("Alice -> Bob: 500 BTC")}
                                    className={`w-full py-1 mt-2 ${isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600' : 'bg-white border-slate-300 text-slate-600 hover:bg-slate-50'} border text-xs rounded`}
                                >
                                    模拟黑客：将金额改为 500 BTC
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

// 7. 安全性对比
const SecurityComparison = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const cryptoSystems = [
        {
            name: 'RSA-2048',
            type: '非对称加密',
            keySize: '2048 bits',
            securityLevel: '112 bits',
            publicKeySize: '2048 bits',
            signatureSize: '2048 bits',
            speed: '慢',
            quantumSafe: false,
            usage: 'SSL/TLS, 电子邮件',
            color: 'blue'
        },
        {
            name: 'RSA-4096',
            type: '非对称加密',
            keySize: '4096 bits',
            securityLevel: '140 bits',
            publicKeySize: '4096 bits',
            signatureSize: '4096 bits',
            speed: '很慢',
            quantumSafe: false,
            usage: 'PGP, 高安全场景',
            color: 'indigo'
        },
        {
            name: 'ECDSA (secp256k1)',
            type: '椭圆曲线',
            keySize: '256 bits',
            securityLevel: '128 bits',
            publicKeySize: '512 bits',
            signatureSize: '512 bits',
            speed: '快',
            quantumSafe: false,
            usage: '比特币, 以太坊',
            color: 'orange'
        },
        {
            name: 'Ed25519',
            type: '椭圆曲线',
            keySize: '256 bits',
            securityLevel: '128 bits',
            publicKeySize: '256 bits',
            signatureSize: '512 bits',
            speed: '很快',
            quantumSafe: false,
            usage: 'SSH, Signal',
            color: 'green'
        },
        {
            name: 'Schnorr (BIP340)',
            type: '椭圆曲线',
            keySize: '256 bits',
            securityLevel: '128 bits',
            publicKeySize: '256 bits',
            signatureSize: '512 bits',
            speed: '很快',
            quantumSafe: false,
            usage: 'Bitcoin Taproot',
            color: 'purple'
        }
    ];

    const securityComparisons = [
        { bits: 80, rsa: '1024', ecc: '160', status: '已破解', color: 'red' },
        { bits: 112, rsa: '2048', ecc: '224', status: '不推荐', color: 'amber' },
        { bits: 128, rsa: '3072', ecc: '256', status: '当前标准', color: 'green' },
        { bits: 192, rsa: '7680', ecc: '384', status: '高安全', color: 'blue' },
        { bits: 256, rsa: '15360', ecc: '512', status: '极高安全', color: 'purple' },
    ];

    return (
        <div className="space-y-8">
            {/* 标题 */}
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    ECC 安全性对比
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    为什么比特币选择椭圆曲线而不是RSA？
                </p>
            </div>

            {/* 核心优势 */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                    <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100'} flex items-center justify-center mb-4`}>
                        <Key className="w-6 h-6 text-orange-500" />
                    </div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>更短的密钥</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        256位ECC密钥 = 3072位RSA密钥的安全强度。密钥更小意味着更快的传输和存储。
                    </p>
                </div>
                <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                    <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-green-500/20' : 'bg-green-100'} flex items-center justify-center mb-4`}>
                        <Zap className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>更快的运算</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        ECC签名和验证速度比RSA快数十倍，这对处理大量交易的区块链至关重要。
                    </p>
                </div>
                <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                    <div className={`w-12 h-12 rounded-lg ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'} flex items-center justify-center mb-4`}>
                        <Server className="w-6 h-6 text-blue-500" />
                    </div>
                    <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>更少的带宽</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                        每个区块都包含大量签名，ECC的小签名尺寸让比特币网络更高效。
                    </p>
                </div>
            </div>

            {/* 安全等级对比表 */}
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <ShieldCheck className="w-5 h-5 text-orange-500" />
                    等效安全强度
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>
                    相同安全级别下，ECC需要的密钥长度远小于RSA
                </p>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                <th className="text-left py-2 px-3">安全强度</th>
                                <th className="text-left py-2 px-3">RSA 密钥长度</th>
                                <th className="text-left py-2 px-3">ECC 密钥长度</th>
                                <th className="text-left py-2 px-3">节省比例</th>
                                <th className="text-left py-2 px-3">状态</th>
                            </tr>
                        </thead>
                        <tbody>
                            {securityComparisons.map((item, index) => (
                                <tr key={index} className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                    <td className={`py-3 px-3 font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.bits} bits</td>
                                    <td className={`py-3 px-3 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.rsa} bits</td>
                                    <td className={`py-3 px-3 font-mono text-orange-500 font-bold`}>{item.ecc} bits</td>
                                    <td className={`py-3 px-3 ${isDarkMode ? 'text-green-400' : 'text-green-600'} font-bold`}>
                                        {Math.round((1 - parseInt(item.ecc) / parseInt(item.rsa)) * 100)}%
                                    </td>
                                    <td className="py-3 px-3">
                                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                            item.color === 'red' ? isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700' :
                                            item.color === 'amber' ? isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700' :
                                            item.color === 'green' ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700' :
                                            item.color === 'blue' ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700' :
                                            isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                                        }`}>
                                            {item.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 算法对比表 */}
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <Layers className="w-5 h-5 text-orange-500" />
                    主流密码算法对比
                </h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                                <th className="text-left py-2 px-3">算法</th>
                                <th className="text-left py-2 px-3">密钥大小</th>
                                <th className="text-left py-2 px-3">安全强度</th>
                                <th className="text-left py-2 px-3">签名大小</th>
                                <th className="text-left py-2 px-3">速度</th>
                                <th className="text-left py-2 px-3">应用</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cryptoSystems.map((system, index) => (
                                <tr key={index} className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
                                    <td className={`py-3 px-3 font-bold ${system.name.includes('secp256k1') ? 'text-orange-500' : isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                        {system.name}
                                    </td>
                                    <td className={`py-3 px-3 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{system.keySize}</td>
                                    <td className={`py-3 px-3 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{system.securityLevel}</td>
                                    <td className={`py-3 px-3 font-mono ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{system.signatureSize}</td>
                                    <td className="py-3 px-3">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                            system.speed === '很快' ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700' :
                                            system.speed === '快' ? isDarkMode ? 'bg-emerald-500/20 text-emerald-400' : 'bg-emerald-100 text-emerald-700' :
                                            system.speed === '慢' ? isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-700' :
                                            isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                                        }`}>
                                            {system.speed}
                                        </span>
                                    </td>
                                    <td className={`py-3 px-3 text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>{system.usage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* 量子计算警告 */}
            <div className={`${isDarkMode ? 'bg-amber-500/20 border-amber-500/30' : 'bg-amber-50 border-amber-200'} rounded-xl p-6 border`}>
                <h3 className={`text-lg font-bold ${isDarkMode ? 'text-amber-300' : 'text-amber-800'} mb-3 flex items-center gap-2`}>
                    <AlertTriangle className="w-5 h-5" />
                    量子计算威胁
                </h3>
                <p className={`text-sm ${isDarkMode ? 'text-amber-200' : 'text-amber-700'} mb-4`}>
                    所有基于离散对数和大数分解的加密算法（包括RSA和ECC）都将被量子计算机上的Shor算法破解。
                    比特币社区正在研究后量子密码学方案，如Lamport签名。
                </p>
                <div className="grid sm:grid-cols-3 gap-4">
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-3 text-center`}>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>2030-2040</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>预计威胁时间</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-3 text-center`}>
                        <div className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>4,000+</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>所需量子比特数</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-lg p-3 text-center`}>
                        <div className={`text-2xl font-bold text-green-500`}>研究中</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>后量子方案</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 8. 实际应用
const RealWorldApplications = ({ isDarkMode }: { isDarkMode: boolean }) => {
    const applications = [
        {
            icon: CreditCard,
            title: '比特币交易',
            description: '每一笔比特币交易都使用ECDSA签名来证明所有权。你的私钥签署交易，矿工用公钥验证。',
            details: [
                '私钥 → 签名交易',
                '公钥 → 验证签名',
                '地址 → 公钥哈希',
            ],
            color: 'orange'
        },
        {
            icon: Smartphone,
            title: '硬件钱包',
            description: 'Ledger、Trezor等硬件钱包在安全芯片中执行ECC运算，私钥永不离开设备。',
            details: [
                '安全元件存储私钥',
                '离线签名交易',
                '抵御恶意软件',
            ],
            color: 'blue'
        },
        {
            icon: Globe,
            title: 'HTTPS/SSL',
            description: '每次你访问https网站，浏览器都在使用ECC来建立安全连接和验证服务器身份。',
            details: [
                'TLS握手密钥交换',
                '服务器证书验证',
                '前向保密性',
            ],
            color: 'green'
        },
        {
            icon: Lock,
            title: 'SSH密钥',
            description: '现代SSH密钥推荐使用Ed25519（一种椭圆曲线算法），比传统RSA更安全更快。',
            details: [
                '服务器登录认证',
                'Git代码签名',
                '256位密钥安全',
            ],
            color: 'purple'
        },
        {
            icon: Shield,
            title: '多重签名',
            description: '比特币的多签钱包使用ECC实现"2-of-3"等安全策略，需要多个私钥共同签名。',
            details: [
                '企业资金管理',
                '遗产继承方案',
                '联合托管服务',
            ],
            color: 'amber'
        },
        {
            icon: Zap,
            title: '闪电网络',
            description: '闪电网络的支付通道使用ECC签名来创建和更新链下交易状态。',
            details: [
                '通道开启/关闭签名',
                'HTLC哈希锁',
                '即时小额支付',
            ],
            color: 'cyan'
        }
    ];

    const timeline = [
        { year: '1985', event: 'Koblitz和Miller独立发明椭圆曲线密码学', color: 'blue' },
        { year: '2000', event: 'NIST发布ECC标准曲线 (P-256等)', color: 'green' },
        { year: '2009', event: '中本聪选择secp256k1用于比特币', color: 'orange' },
        { year: '2011', event: 'NIST推荐ECC作为新系统首选', color: 'purple' },
        { year: '2015', event: 'NSA宣布向后量子密码学过渡', color: 'red' },
        { year: '2021', event: 'Bitcoin Taproot升级引入Schnorr签名', color: 'amber' },
    ];

    return (
        <div className="space-y-8">
            {/* 标题 */}
            <div className="text-center">
                <h2 className={`text-3xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    ECC 实际应用
                </h2>
                <p className={isDarkMode ? 'text-slate-400' : 'text-slate-600'}>
                    椭圆曲线密码学已经融入我们数字生活的方方面面
                </p>
            </div>

            {/* 应用卡片 */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {applications.map((app, index) => {
                    const Icon = app.icon;
                    return (
                        <div key={index} className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border hover:shadow-lg transition-shadow`}>
                            <div className={`w-12 h-12 rounded-lg ${
                                app.color === 'orange' ? isDarkMode ? 'bg-orange-500/20' : 'bg-orange-100' :
                                app.color === 'blue' ? isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100' :
                                app.color === 'green' ? isDarkMode ? 'bg-green-500/20' : 'bg-green-100' :
                                app.color === 'purple' ? isDarkMode ? 'bg-purple-500/20' : 'bg-purple-100' :
                                app.color === 'amber' ? isDarkMode ? 'bg-amber-500/20' : 'bg-amber-100' :
                                isDarkMode ? 'bg-cyan-500/20' : 'bg-cyan-100'
                            } flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${
                                    app.color === 'orange' ? 'text-orange-500' :
                                    app.color === 'blue' ? 'text-blue-500' :
                                    app.color === 'green' ? 'text-green-500' :
                                    app.color === 'purple' ? 'text-purple-500' :
                                    app.color === 'amber' ? 'text-amber-500' :
                                    'text-cyan-500'
                                }`} />
                            </div>
                            <h3 className={`text-lg font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-2`}>{app.title}</h3>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'} mb-4`}>{app.description}</p>
                            <ul className="space-y-1">
                                {app.details.map((detail, i) => (
                                    <li key={i} className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} flex items-center gap-2`}>
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                        {detail}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    );
                })}
            </div>

            {/* 比特币中的ECC */}
            <div className={`${isDarkMode ? 'bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-500/30' : 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200'} rounded-xl p-6 border`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4 flex items-center gap-2`}>
                    <TrendingUp className="w-5 h-5 text-orange-500" />
                    比特币中 ECC 的关键数字
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} rounded-lg p-4 text-center`}>
                        <div className="text-3xl font-bold text-orange-500">2²⁵⁶</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>私钥可能数量</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>比宇宙原子数还多</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} rounded-lg p-4 text-center`}>
                        <div className="text-3xl font-bold text-orange-500">64</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>私钥字符数</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>十六进制表示</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} rounded-lg p-4 text-center`}>
                        <div className="text-3xl font-bold text-orange-500">71-73</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>签名字节数</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>DER编码ECDSA</div>
                    </div>
                    <div className={`${isDarkMode ? 'bg-slate-800/50' : 'bg-white/80'} rounded-lg p-4 text-center`}>
                        <div className="text-3xl font-bold text-orange-500">~1B</div>
                        <div className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>已验证签名数</div>
                        <div className={`text-xs ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} mt-1`}>区块链历史总计</div>
                    </div>
                </div>
            </div>

            {/* ECC发展时间线 */}
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-2`}>
                    <Clock className="w-5 h-5 text-orange-500" />
                    椭圆曲线密码学发展史
                </h3>
                <div className="relative">
                    <div className={`absolute left-4 top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
                    <div className="space-y-6">
                        {timeline.map((item, index) => (
                            <div key={index} className="flex gap-4 items-start">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                                    item.color === 'blue' ? isDarkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600' :
                                    item.color === 'green' ? isDarkMode ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-600' :
                                    item.color === 'orange' ? isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-600' :
                                    item.color === 'purple' ? isDarkMode ? 'bg-purple-500/20 text-purple-400' : 'bg-purple-100 text-purple-600' :
                                    item.color === 'red' ? isDarkMode ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-600' :
                                    isDarkMode ? 'bg-amber-500/20 text-amber-400' : 'bg-amber-100 text-amber-600'
                                }`}>
                                    <span className="text-xs font-bold">{item.year.slice(-2)}</span>
                                </div>
                                <div>
                                    <div className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{item.year}</div>
                                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>{item.event}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* 为什么secp256k1 */}
            <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-xl p-6 border`}>
                <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                    为什么中本聪选择 secp256k1？
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>技术优势</h4>
                        <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span><strong>简单参数：</strong> a=0, b=7 的选择没有"可调后门"</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span><strong>计算效率：</strong> a=0 优化了点乘运算</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                <span><strong>非NIST曲线：</strong> 避免了政府后门的担忧</span>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h4 className={`font-bold ${isDarkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`}>secp256k1 参数</h4>
                        <div className={`${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'} rounded-lg p-4 font-mono text-xs space-y-1`}>
                            <div><span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>方程：</span> y² = x³ + 7</div>
                            <div><span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>素数 p：</span> 2²⁵⁶ - 2³² - 977</div>
                            <div><span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>阶 n：</span> ~2²⁵⁶</div>
                            <div><span className={isDarkMode ? 'text-slate-500' : 'text-slate-400'}>辅因子 h：</span> 1</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Quiz Section
const QuizSection = ({ isDarkMode }: { isDarkMode: boolean }) => {
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="text-center mb-8">
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${isDarkMode ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'}`}>
                    <Award className="w-5 h-5" />
                    <span className="font-bold">知识测验</span>
                </div>
                <h2 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    检验你的 ECC 知识
                </h2>
                <p className={`mt-2 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                    完成以下测验，看看你对椭圆曲线密码学的理解程度
                </p>
            </div>
            <Quiz quizData={eccQuiz} />
        </div>
    );
};

export default ECCDemo;