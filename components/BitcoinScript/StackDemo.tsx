import React, { useState } from 'react';
import { RotateCcw, CheckCircle2, StepForward, Disc, Play } from 'lucide-react';

// --- TYPES ---
type StackItem = {
  id: number;
  val: string | number;
  type: 'data' | 'result' | 'bool';
  isNew?: boolean;
};

interface StackDemoProps {
  isDarkMode?: boolean;
}

const StackDemo: React.FC<StackDemoProps> = ({ isDarkMode = false }) => {
  // --- STATE ---
  const [pc, setPc] = useState(0); // Program Counter
  const [stack, setStack] = useState<StackItem[]>([]);
  
  // ALU State
  const [alu, setAlu] = useState<{ 
    op: string | null, 
    inputs: (string|number)[], 
    output: string | number | null, 
    status: 'idle' | 'pulling' | 'computing' | 'pushing' 
  }>({ op: null, inputs: [], output: null, status: 'idle' });

  // --- SCRIPT CONFIG ---
  const script = [
    { op: "OP_2", action: "PUSH", val: 2 },
    { op: "OP_3", action: "PUSH", val: 3 },
    { op: "OP_ADD", action: "CALC", inputs: 2, func: (a:any, b:any) => parseInt(a)+parseInt(b) },
    { op: "OP_5", action: "PUSH", val: 5 },
    { op: "OP_EQUAL", action: "CHECK", inputs: 2, func: (a:any, b:any) => a == b }
  ];

  const isFinished = pc >= script.length;

  // --- LOGIC ---
  const reset = () => {
    setStack([]);
    setPc(0);
    setAlu({ op: null, inputs: [], output: null, status: 'idle' });
  };

  const step = () => {
    if (isFinished || alu.status !== 'idle') return;

    const cmd = script[pc];
    
    // PUSH: Script -> Stack (Fast Path)
    if (cmd.action === 'PUSH') {
      const newItem: StackItem = {
        id: Date.now(),
        val: cmd.val!,
        type: 'data',
        isNew: true
      };
      setStack(prev => [newItem, ...prev]);
      setPc(prev => prev + 1);
    } 
    // CALC: Stack -> ALU -> Stack (Slow Path)
    else {
      setAlu({ op: cmd.op, inputs: [], output: null, status: 'pulling' });

      // 1. Pull Inputs (Visual delay)
      setTimeout(() => {
        let inputs: any[] = [];
        let newStack = [...stack];
        const count = (cmd as any).inputs || 1;
        inputs = newStack.slice(0, count).map(i => i.val).reverse();
        newStack = newStack.slice(count);
        
        setStack(newStack);
        setAlu(prev => ({ ...prev, inputs, status: 'computing' }));

        // 2. Compute
        setTimeout(() => {
            let result: any = (cmd as any).func(...inputs);
            if (typeof result === 'boolean') result = result ? 'TRUE' : 'FALSE';

            setAlu(prev => ({ ...prev, output: result, status: 'pushing' }));

            // 3. Push Output
            setTimeout(() => {
                const resItem: StackItem = {
                    id: Date.now(),
                    val: result,
                    type: cmd.action === 'CHECK' ? (result === 'TRUE' ? 'bool' : 'data') : 'result',
                    isNew: true
                };
                setStack(prev => [resItem, ...prev]);
                setAlu({ op: null, inputs: [], output: null, status: 'idle' });
                setPc(prev => prev + 1);
            }, 800);

        }, 1000); 

      }, 800);
    }
  };

  return (
    <div className={`flex flex-col ${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'} border rounded-2xl relative overflow-hidden font-sans select-none min-h-[600px] shadow-sm`}>

      {/* BACKGROUND GRID */}
      <div className={`absolute inset-0 bg-[linear-gradient(to_right,${isDarkMode ? '#334155' : '#e2e8f0'}_1px,transparent_1px),linear-gradient(to_bottom,${isDarkMode ? '#334155' : '#e2e8f0'}_1px,transparent_1px)] bg-[size:40px_40px] opacity-40 pointer-events-none`}></div>

      <div className="flex-1 flex flex-col items-center justify-center relative z-10 py-4 gap-8">

          {/* --- TOP: MEMORY STACK --- */}
          <div className="relative group">
              {/* Data Path Line (Stack <-> ALU) */}
              <div className={`absolute left-1/2 -translate-x-1/2 top-full h-12 w-1 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'} z-0`}>
                  <div className={`w-full h-full bg-cyan-500 transition-all duration-300 ${alu.status === 'pulling' ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
                  <div className={`w-full h-full bg-pink-500 transition-all duration-300 ${alu.status === 'pushing' ? 'opacity-100 animate-pulse' : 'opacity-0'}`}></div>
              </div>

              {/* Stack Container */}
              <div className={`w-48 min-h-[180px] ${isDarkMode ? 'bg-slate-800 border-slate-600' : 'bg-slate-50 border-slate-300'} border-2 rounded-xl relative flex flex-col justify-end p-3 gap-2 shadow-sm transition-all duration-500`}>
                  <div className={`absolute -top-3 left-4 ${isDarkMode ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-200 text-slate-500'} px-2 text-[10px] font-bold uppercase tracking-widest border rounded`}>Memory Stack</div>

                  {stack.length === 0 && (
                      <div className={`absolute inset-0 flex items-center justify-center ${isDarkMode ? 'text-slate-600' : 'text-slate-300'}`}>
                          <Disc size={48} className="animate-spin-slow" />
                      </div>
                  )}

                  <div className="w-full flex flex-col justify-end gap-1.5 z-10">
                      {stack.map((item) => (
                          <div
                            key={item.id}
                            className={`
                                w-full h-10 rounded border flex items-center justify-center font-mono font-bold text-sm shadow-sm transition-all duration-500 relative overflow-hidden
                                ${item.isNew ? 'animate-[slide-up_0.3s_ease-out]' : ''}
                                ${item.type === 'bool'
                                    ? (item.val === 'TRUE'
                                        ? isDarkMode ? 'bg-green-500/20 border-green-500/50 text-green-400' : 'bg-green-100 border-green-300 text-green-700'
                                        : isDarkMode ? 'bg-red-500/20 border-red-500/50 text-red-400' : 'bg-red-100 border-red-300 text-red-700')
                                    : item.type === 'result'
                                        ? isDarkMode ? 'bg-pink-500/20 border-pink-500/50 text-pink-400' : 'bg-pink-100 border-pink-300 text-pink-700'
                                        : isDarkMode ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400' : 'bg-cyan-100 border-cyan-300 text-cyan-700'}
                            `}
                          >
                              {item.val}
                          </div>
                      ))}
                  </div>

                  {/* Stack Base */}
                  <div className={`absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t ${isDarkMode ? 'from-slate-700/50' : 'from-slate-200/50'} to-transparent`}></div>
              </div>
          </div>

          {/* --- MIDDLE: ALU CHIP --- */}
          <div className="relative z-20">
              <div className={`
                  w-64 h-32 ${isDarkMode ? 'bg-slate-800' : 'bg-white'} rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center relative shadow-lg
                  ${alu.status !== 'idle' ? 'border-pink-500 shadow-pink-500/20' : isDarkMode ? 'border-slate-600' : 'border-slate-300'}
              `}>
                  {/* Decorative Pins */}
                  <div className={`absolute -left-2 top-4 bottom-4 w-1 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'} flex flex-col justify-between py-2`}>
                      {[...Array(6)].map((_,i) => <div key={i} className={`w-3 h-1 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'} -ml-1`}></div>)}
                  </div>
                  <div className={`absolute -right-2 top-4 bottom-4 w-1 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'} flex flex-col justify-between py-2`}>
                      {[...Array(6)].map((_,i) => <div key={i} className={`w-3 h-1 ${isDarkMode ? 'bg-slate-600' : 'bg-slate-300'} -mr-1`}></div>)}
                  </div>

                  {/* Chip Label */}
                  <div className="absolute top-2 left-3 flex gap-2">
                      <div className={`text-[9px] ${isDarkMode ? 'text-slate-500' : 'text-slate-400'} font-black tracking-widest`}>OP_CODE PROCESSOR</div>
                  </div>
                  <div className="absolute top-2 right-3">
                      <div className={`w-2 h-2 rounded-full ${alu.status !== 'idle' ? 'bg-pink-500 animate-pulse' : isDarkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
                  </div>

                  {/* Screen */}
                  <div className="w-48 h-16 bg-slate-900 border border-slate-800 rounded flex items-center justify-center font-mono relative overflow-hidden text-white">
                      {alu.status === 'idle' ? (
                          <div className="text-slate-600 text-xs animate-pulse">READY</div>
                      ) : (
                          <div className="flex flex-col items-center z-10">
                              <div className="text-pink-400 text-xs font-bold mb-1">{alu.op}</div>
                              {alu.status === 'pulling' && <div className="text-cyan-400 text-[10px] animate-pulse">READING MEMORY...</div>}
                              {alu.status === 'computing' && (
                                  <div className="flex gap-2">
                                      {alu.inputs.map((v, i) => (
                                          <span key={i} className="text-slate-200 font-bold">{v}</span>
                                      ))}
                                  </div>
                              )}
                              {alu.status === 'pushing' && (
                                  <div className="text-green-400 font-bold text-lg animate-bounce">{alu.output}</div>
                              )}
                          </div>
                      )}
                  </div>
              </div>
          </div>

          {/* --- BOTTOM: SCRIPT TAPE --- */}
          <div className={`relative w-full max-w-2xl h-28 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} border-y-2 flex items-center justify-center overflow-hidden group`}>
              {/* Laser Reader */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-red-500 z-40 opacity-50"></div>
              <div className="absolute left-1/2 -translate-x-1/2 top-0 w-3 h-1.5 bg-red-500 rounded-b z-40"></div>

              {/* Active Zone Highlight */}
              <div className={`absolute left-1/2 -translate-x-1/2 top-2 bottom-2 w-24 ${isDarkMode ? 'bg-slate-700/50 border-slate-600' : 'bg-slate-50 border-slate-100'} border-x z-0 pointer-events-none`}></div>

              {/* Tape Track */}
              <div className={`absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_19px,${isDarkMode ? '#334155' : '#f1f5f9'}_20px)]`}></div>

              {/* Cards Container */}
              <div
                className="flex items-center gap-2 absolute left-1/2 transition-transform duration-500 ease-[cubic-bezier(0.2,1,0.3,1)] will-change-transform"
                style={{
                    transform: `translateX(calc(-2.5rem - ${pc * 5.5}rem))`
                }}
              >
                  {script.map((step, i) => (
                      <div
                        key={i}
                        className={`
                            w-20 h-14 rounded-lg border-2 flex flex-col items-center justify-center font-mono text-xs font-bold shadow-sm transition-all duration-500 shrink-0 relative
                            ${i === pc
                                ? 'bg-slate-800 border-slate-700 text-white scale-110 z-20 shadow-md'
                                : i < pc
                                    ? isDarkMode ? 'bg-slate-700 border-slate-600 text-slate-500 opacity-50 blur-[0.5px]' : 'bg-slate-100 border-slate-200 text-slate-400 opacity-50 blur-[0.5px]'
                                    : isDarkMode ? 'bg-slate-800 border-slate-600 text-slate-300' : 'bg-white border-slate-300 text-slate-600'}
                        `}
                      >
                          <span className={`text-[9px] mb-0.5 tracking-tighter uppercase ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>{step.action}</span>
                          <span>{step.op}</span>
                      </div>
                  ))}

                  {/* End Marker */}
                  <div className={`w-20 h-14 rounded-lg border-2 border-dashed flex items-center justify-center font-mono text-[10px] shrink-0 transition-all duration-500 ${
                    pc >= script.length
                      ? 'border-green-500 text-green-500 bg-green-500/20 scale-110 z-20'
                      : isDarkMode ? 'border-slate-600 text-slate-500' : 'border-slate-300 text-slate-400'
                  }`}>
                      END
                  </div>
              </div>
          </div>

      </div>

      {/* --- CONTROL PANEL --- */}
      <div className={`h-20 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'} border-t flex items-center justify-center gap-8 relative z-30`}>
          {/* Reset Button */}
          <button
            onClick={reset}
            className="group flex flex-col items-center gap-1 active:scale-95 transition-transform"
          >
              <div className={`w-12 h-12 rounded-full ${isDarkMode ? 'bg-slate-700 border-slate-600 hover:border-slate-500' : 'bg-white border-slate-300 hover:border-slate-400'} border flex items-center justify-center shadow-sm transition-all`}>
                  <RotateCcw size={18} className={`${isDarkMode ? 'text-slate-400 group-hover:text-slate-300' : 'text-slate-500 group-hover:text-slate-700'}`} />
              </div>
              <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-widest`}>Reset</span>
          </button>

          {/* Step Button */}
          <button
            onClick={step}
            disabled={isFinished || alu.status !== 'idle'}
            className={`group flex flex-col items-center gap-1 transition-all ${isFinished || alu.status !== 'idle' ? 'opacity-50 cursor-not-allowed' : 'active:scale-95'}`}
          >
              <div className={`
                  w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-md transition-all
                  ${isFinished
                      ? 'bg-green-600 border-green-600'
                      : 'bg-pink-600 border-pink-500 hover:bg-pink-500'}
              `}>
                  {isFinished ? <CheckCircle2 size={28} className="text-white" /> : <StepForward size={28} className="text-white" />}
              </div>
              <span className={`text-[9px] font-bold ${isDarkMode ? 'text-slate-500' : 'text-slate-500'} uppercase tracking-widest`}>
                  {isFinished ? 'Complete' : 'Step'}
              </span>
          </button>
      </div>

    </div>
  );
};

export default StackDemo;