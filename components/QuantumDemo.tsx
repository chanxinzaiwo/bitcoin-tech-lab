import React, { useState } from 'react';
import { Shield, Zap, Skull, Waves, Scale } from 'lucide-react';
import ScaleSection from './quantum/ScaleSection';
import WeaponSection from './quantum/WeaponSection';
import ShieldSection from './quantum/ShieldSection';
import AttackSection from './quantum/AttackSection';

const QuantumDemo = () => {
  const [activeTab, setActiveTab] = useState('scale'); 
  
  return (
    <div className="bg-slate-50 text-slate-800 font-sans min-h-screen">
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16 items-center">
                <div className="flex items-center gap-2">
                    <div className="bg-cyan-600 text-white p-1.5 rounded-full">
                        <Zap className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">量子危机</span>
                    <span className="font-bold text-lg tracking-tight text-slate-900 sm:hidden">Quantum</span>
                </div>
                <div className="flex space-x-1">
                    {[
                        { id: 'scale', label: '1. 宇宙难度' },
                        { id: 'weapon', label: '2. 量子武器' },
                        { id: 'shield', label: '3. 哈希盾牌' },
                        { id: 'attack', label: '4. 攻防实战' },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                activeTab === tab.id
                                    ? 'bg-cyan-50 text-cyan-700'
                                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Render Active Section */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {activeTab === 'scale' && <ScaleSection />}
            {activeTab === 'weapon' && <WeaponSection />}
            {activeTab === 'shield' && <ShieldSection />}
            {activeTab === 'attack' && <AttackSection />}
        </div>
      </div>
    </div>
  );
};

export default QuantumDemo;