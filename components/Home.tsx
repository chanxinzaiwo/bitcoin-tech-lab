import React from 'react';
import { Shield, Zap, ArrowRight, Wallet, Network, Pickaxe, Hash, FileKey, Code, GitMerge, Cpu, Scaling, Workflow, TreeDeciduous, Skull, Flashlight, TrendingUp, Layers, History, EyeOff, Server, Users, GitBranch, BookOpen, Coins, FileText } from 'lucide-react';
import { View } from '../config/navigation';
import NetworkStats from './NetworkStats';
import FAQ from './FAQ';
import BitcoinTimeline from './BitcoinTimeline';

interface HomeProps {
  onViewChange: (view: View) => void;
}

// Type definitions for component props
interface TimelineItemProps {
  step: string;
  title: string;
  description: string;
  children: React.ReactNode;
  align: 'left' | 'right';
}

type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

type ColorStyleKey =
  | 'orange'
  | 'emerald'
  | 'blue'
  | 'pink'
  | 'indigo'
  | 'amber'
  | 'purple'
  | 'rose'
  | 'cyan'
  | 'teal'
  | 'yellow'
  | 'red'
  | 'lime';

interface DemoCardProps {
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorStyleKey;
  onClick: () => void;
  difficulty?: DifficultyLevel;
}

const colorStyles: Record<ColorStyleKey, string> = {
  orange: 'bg-orange-500/10 text-orange-400 border-orange-500/20 group-hover:border-orange-500/50',
  emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 group-hover:border-emerald-500/50',
  blue: 'bg-blue-500/10 text-blue-400 border-blue-500/20 group-hover:border-blue-500/50',
  pink: 'bg-pink-500/10 text-pink-400 border-pink-500/20 group-hover:border-pink-500/50',
  indigo: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20 group-hover:border-indigo-500/50',
  amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20 group-hover:border-amber-500/50',
  purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20 group-hover:border-purple-500/50',
  rose: 'bg-rose-500/10 text-rose-400 border-rose-500/20 group-hover:border-rose-500/50',
  cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20 group-hover:border-cyan-500/50',
  teal: 'bg-teal-500/10 text-teal-400 border-teal-500/20 group-hover:border-teal-500/50',
  yellow: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20 group-hover:border-yellow-500/50',
  red: 'bg-red-500/10 text-red-400 border-red-500/20 group-hover:border-red-500/50',
  lime: 'bg-lime-500/10 text-lime-400 border-lime-500/20 group-hover:border-lime-500/50',
};

const difficultyConfig: Record<DifficultyLevel, { label: string; color: string }> = {
  beginner: { label: '入门', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  intermediate: { label: '进阶', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  advanced: { label: '专家', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

const Home: React.FC<HomeProps> = ({ onViewChange }) => {
  return (
    <div className="relative min-h-screen bg-slate-950 pb-20 overflow-x-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
        
        {/* Header */}
        <div className="text-center space-y-6 mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            Bitcoin Technical Lab
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight text-white">
            解构比特币：<br/>
            <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
              从原理到现代协议的旅程
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-400 leading-relaxed px-2 sm:px-0">
            比特币不仅仅是一种货币，它是一座由数学构建的精密大厦。
            <br className="hidden md:block"/>
            跟随下方的逻辑链路，亲手交互每一个核心组件。
          </p>
        </div>

        {/* Main Flow Timeline */}
        <div className="relative space-y-16 md:space-y-32">
            
            {/* Timeline Center Line */}
            <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent -translate-x-1/2 hidden md:block"></div>
            <div className="absolute left-4 sm:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-800 to-transparent -translate-x-1/2 md:hidden"></div>

            {/* Step 1: Identity */}
            <TimelineItem 
                step="1"
                title="身份与账户"
                description="在比特币的世界里，没有银行来为你开户。你的“账户”诞生于纯粹的数学。通过椭圆曲线加密 (ECC)，我们生成私钥和公钥；再通过哈希算法，生成接收资金的地址。"
                align="left"
            >
                <DemoCard
                    title="ECC 加密原理"
                    desc="私钥如何生成公钥？为什么它是不可逆的？"
                    icon={Shield}
                    color="orange"
                    difficulty="beginner"
                    onClick={() => onViewChange('ecc')}
                />
                <DemoCard
                    title="地址生成流水线"
                    desc="支持 Legacy, SegWit (Bech32) 与 Taproot"
                    icon={FileKey}
                    color="emerald"
                    difficulty="beginner"
                    onClick={() => onViewChange('address')}
                />
                <DemoCard
                    title="HD 钱包 (BIP32/39)"
                    desc="只需12个助记词，派生无限子账户树"
                    icon={TreeDeciduous}
                    color="teal"
                    difficulty="intermediate"
                    onClick={() => onViewChange('hdwallet')}
                />
            </TimelineItem>

            {/* Step 2: Transaction */}
            <TimelineItem 
                step="2"
                title="交易数据结构"
                description="比特币没有“余额”概念，只有 UTXO（未花费交易输出）。交易本质上是一段脚本代码：解锁旧的 UTXO，并锁定为新的 UTXO。"
                align="right"
            >
                <DemoCard
                    title="UTXO 模型"
                    desc="直观感受输入、输出、找零的资金流转"
                    icon={Wallet}
                    color="blue"
                    difficulty="beginner"
                    onClick={() => onViewChange('utxo')}
                />
                <DemoCard
                    title="Script 脚本引擎"
                    desc="Stack 虚拟机如何验证解锁脚本与锁定脚本"
                    icon={Code}
                    color="pink"
                    difficulty="advanced"
                    onClick={() => onViewChange('script')}
                />
            </TimelineItem>

            {/* Step 2.5: Modernization */}
            <TimelineItem 
                step="3"
                title="扩容与升级"
                description="为了解决扩容、延展性攻击和隐私问题，比特币经历了 SegWit 和 Taproot 两次重大升级，并发展出了闪电网络等二层协议。"
                align="left"
            >
                <DemoCard
                    title="SegWit 隔离见证"
                    desc="区块结构变革、Witness 字段与 vByte 计费"
                    icon={Scaling}
                    color="cyan"
                    difficulty="intermediate"
                    onClick={() => onViewChange('segwit')}
                />
                <DemoCard
                    title="Taproot & MAST"
                    desc="Schnorr 签名与默克尔抽象语法树 (MAST) 演示"
                    icon={Workflow}
                    color="purple"
                    difficulty="advanced"
                    onClick={() => onViewChange('taproot')}
                />
                <DemoCard
                    title="闪电网络 (Layer 2)"
                    desc="建立支付通道，实现毫秒级链下即时支付"
                    icon={Flashlight}
                    color="yellow"
                    difficulty="intermediate"
                    onClick={() => onViewChange('lightning')}
                />
            </TimelineItem>

            {/* Step 3: Network */}
            <TimelineItem 
                step="4"
                title="去中心化网络"
                description="交易被创建后，通过 Gossip 协议在 P2P 网络中瞬间扩散。它们暂时停留在每个节点的“内存池 (Mempool)”中，等待矿工的打包。"
                align="right"
            >
                <DemoCard
                    title="P2P 网络广播"
                    desc="模拟交易在分布式节点间的八卦式传播"
                    icon={Network}
                    color="indigo"
                    difficulty="beginner"
                    onClick={() => onViewChange('p2p')}
                />
                <DemoCard
                    title="内存池 (Mempool)"
                    desc="交易等候室：费率排序、RBF/CPFP 加速原理"
                    icon={Layers}
                    color="purple"
                    difficulty="intermediate"
                    onClick={() => onViewChange('mempool')}
                />
                <DemoCard
                    title="RBF 与手续费竞价"
                    desc="模拟高手续费交易如何顶替被卡住的低价交易"
                    icon={TrendingUp}
                    color="lime"
                    difficulty="intermediate"
                    onClick={() => onViewChange('rbf')}
                />
            </TimelineItem>

            {/* Step 4: Consensus */}
            <TimelineItem 
                step="5"
                title="共识与安全"
                description="如何让互不信任的节点达成一致？矿工通过消耗电力进行 PoW 计算，竞争记账权。最长链原则（Nakamoto Consensus）确保了账本的唯一性。"
                align="left"
            >
                <DemoCard
                    title="PoW 挖矿模拟"
                    desc="调整难度，亲手体验哈希碰撞与区块生成"
                    icon={Pickaxe}
                    color="amber"
                    difficulty="beginner"
                    onClick={() => onViewChange('pow')}
                />
                <DemoCard
                    title="挖矿经济学"
                    desc="减半周期、难度调整、收益计算与博弈论"
                    icon={TrendingUp}
                    color="orange"
                    difficulty="intermediate"
                    onClick={() => onViewChange('mining')}
                />
                <DemoCard
                    title="Nakamoto 共识"
                    desc="可视化分叉、孤块与链重组的过程"
                    icon={GitMerge}
                    color="rose"
                    difficulty="intermediate"
                    onClick={() => onViewChange('consensus')}
                />
                <DemoCard
                    title="51% 算力攻击"
                    desc="模拟黑客如何利用算力优势制造双花"
                    icon={Skull}
                    color="red"
                    difficulty="advanced"
                    onClick={() => onViewChange('attack51')}
                />
            </TimelineItem>

        </div>

        {/* Network Stats Section */}
        <div className="mt-20">
            <NetworkStats isDarkMode={true} />
        </div>

        {/* Supplementary Section */}
        <div className="mt-20 pt-20 border-t border-slate-800/50">
            <h2 className="text-3xl font-bold text-center text-white mb-16 flex items-center justify-center gap-3">
                <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                深入学习
            </h2>

            {/* New Modules Grid */}
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
                <div
                    onClick={() => onViewChange('fullnode')}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-cyan-500/50 transition-all duration-300"
                >
                    <div className="w-12 h-12 bg-cyan-900/30 text-cyan-400 rounded-xl flex items-center justify-center mb-4 border border-cyan-500/20">
                        <Server className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">运行全节点</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        独立验证每笔交易，成为比特币网络的一部分
                    </p>
                    <span className="text-cyan-400 font-bold text-sm flex items-center gap-2">
                        了解更多 <ArrowRight className="w-4 h-4" />
                    </span>
                </div>

                <div
                    onClick={() => onViewChange('privacy')}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-violet-500/50 transition-all duration-300"
                >
                    <div className="w-12 h-12 bg-violet-900/30 text-violet-400 rounded-xl flex items-center justify-center mb-4 border border-violet-500/20">
                        <EyeOff className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">隐私技术</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        CoinJoin、PayJoin、Silent Payments 原理演示
                    </p>
                    <span className="text-violet-400 font-bold text-sm flex items-center gap-2">
                        了解更多 <ArrowRight className="w-4 h-4" />
                    </span>
                </div>

                <div
                    onClick={() => onViewChange('history')}
                    className="group bg-slate-900 border border-slate-800 rounded-2xl p-6 cursor-pointer hover:border-indigo-500/50 transition-all duration-300"
                >
                    <div className="w-12 h-12 bg-indigo-900/30 text-indigo-400 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
                        <History className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">比特币历史</h3>
                    <p className="text-slate-400 text-sm mb-4">
                        从创世区块到今天的重大事件时间线
                    </p>
                    <span className="text-indigo-400 font-bold text-sm flex items-center gap-2">
                        了解更多 <ArrowRight className="w-4 h-4" />
                    </span>
                </div>
            </div>

            {/* New Feature Modules */}
            <h3 className="text-xl font-bold text-center text-slate-400 mb-8">高级技术模块</h3>
            <div className="grid md:grid-cols-5 gap-4 max-w-5xl mx-auto mb-12">
                <div
                    onClick={() => onViewChange('musig2')}
                    className="group bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-violet-500/50 transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-violet-900/30 text-violet-400 rounded-lg flex items-center justify-center mb-3 border border-violet-500/20">
                        <Users className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white mb-1 text-sm">MuSig2</h4>
                    <p className="text-slate-500 text-xs">多方聚合签名</p>
                </div>

                <div
                    onClick={() => onViewChange('miniscript')}
                    className="group bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-cyan-500/50 transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-cyan-900/30 text-cyan-400 rounded-lg flex items-center justify-center mb-3 border border-cyan-500/20">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white mb-1 text-sm">Miniscript</h4>
                    <p className="text-slate-500 text-xs">策略脚本语言</p>
                </div>

                <div
                    onClick={() => onViewChange('sidechains')}
                    className="group bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-indigo-500/50 transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-indigo-900/30 text-indigo-400 rounded-lg flex items-center justify-center mb-3 border border-indigo-500/20">
                        <GitBranch className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white mb-1 text-sm">侧链</h4>
                    <p className="text-slate-500 text-xs">Liquid & RSK</p>
                </div>

                <div
                    onClick={() => onViewChange('bip39')}
                    className="group bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-emerald-500/50 transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-emerald-900/30 text-emerald-400 rounded-lg flex items-center justify-center mb-3 border border-emerald-500/20">
                        <BookOpen className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white mb-1 text-sm">BIP39</h4>
                    <p className="text-slate-500 text-xs">助记词详解</p>
                </div>

                <div
                    onClick={() => onViewChange('coinselection')}
                    className="group bg-slate-900 border border-slate-800 rounded-xl p-4 cursor-pointer hover:border-amber-500/50 transition-all duration-300"
                >
                    <div className="w-10 h-10 bg-amber-900/30 text-amber-400 rounded-lg flex items-center justify-center mb-3 border border-amber-500/20">
                        <Coins className="w-5 h-5" />
                    </div>
                    <h4 className="font-bold text-white mb-1 text-sm">币种选择</h4>
                    <p className="text-slate-500 text-xs">UTXO 优化算法</p>
                </div>
            </div>

            {/* Original Challenge Cards */}
            <h3 className="text-xl font-bold text-center text-slate-400 mb-8">前沿与挑战</h3>
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                <div
                    onClick={() => onViewChange('quantum')}
                    className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 cursor-pointer hover:border-cyan-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(6,182,212,0.15)]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-cyan-500 pointer-events-none">
                        <Cpu className="w-40 h-40" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-cyan-900/30 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Cpu className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">量子计算危机</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            Shor 算法如何威胁现有的 ECC 加密体系？比特币抵御量子攻击的最后一道防线是什么？
                        </p>
                        <span className="text-cyan-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            进入模拟 <ArrowRight className="w-5 h-5" />
                        </span>
                    </div>
                </div>

                <div
                    onClick={() => onViewChange('lamport')}
                    className="group relative overflow-hidden bg-slate-900 border border-slate-800 rounded-3xl p-8 cursor-pointer hover:border-green-500/50 transition-all duration-300 hover:shadow-[0_0_30px_rgba(34,197,94,0.15)]"
                >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity text-green-500 pointer-events-none">
                        <Hash className="w-40 h-40" />
                    </div>
                    <div className="relative z-10">
                        <div className="w-14 h-14 bg-green-900/30 text-green-400 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform duration-300">
                            <Hash className="w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Lamport 签名</h3>
                        <p className="text-slate-400 mb-6 leading-relaxed">
                            一种基于哈希函数的后量子签名方案。虽然体积大、只能使用一次，但它极难被量子计算机攻破。
                        </p>
                        <span className="text-green-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                            查看原理 <ArrowRight className="w-5 h-5" />
                        </span>
                    </div>
                </div>
            </div>
        </div>

        {/* FAQ & Timeline Section */}
        <div className="mt-20 grid lg:grid-cols-2 gap-6">
            <FAQ isDarkMode={true} />
            <BitcoinTimeline isDarkMode={true} />
        </div>

      </div>
    </div>
  );
};

// --- Timeline Components ---

const TimelineItem: React.FC<TimelineItemProps> = ({ step, title, description, children, align }) => {
  const isRight = align === 'right';

  return (
    <div className="relative grid md:grid-cols-2 gap-6 md:gap-16 items-center group">
      {/* Center Dot */}
      <div className="absolute left-4 sm:left-6 md:left-1/2 top-0 md:top-1/2 md:-translate-y-1/2 -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-4 sm:border-[6px] border-slate-950 bg-slate-800 group-hover:bg-orange-500 group-hover:border-slate-900 transition-all duration-500 z-20 flex items-center justify-center shadow-2xl">
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-slate-400 group-hover:bg-white transition-colors"></div>
      </div>

      {/* Text Side */}
      <div className={`pl-12 sm:pl-16 md:pl-0 ${isRight ? 'md:order-1 md:text-right md:pr-8' : 'md:order-2 md:pl-8'}`}>
        <div className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 ${isRight ? 'md:justify-end' : ''}`}>
          <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded bg-slate-800 text-orange-500 font-mono font-bold text-xs sm:text-sm border border-slate-700">
            0{step}
          </span>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">{title}</h3>
        </div>
        <p className="text-slate-400 leading-relaxed text-sm sm:text-base md:text-lg">{description}</p>
      </div>

      {/* Cards Side */}
      <div className={`pl-12 sm:pl-16 md:pl-0 mt-4 md:mt-0 ${isRight ? 'md:order-2 md:pl-8' : 'md:order-1 md:pr-8'}`}>
        <div className="grid gap-3 sm:gap-4">{children}</div>
      </div>
    </div>
  );
};

const DemoCard: React.FC<DemoCardProps> = ({ title, desc, icon: Icon, color, onClick, difficulty = 'beginner' }) => {
  const style = colorStyles[color] || colorStyles.orange;
  const diffStyle = difficultyConfig[difficulty];

    return (
        <div
            onClick={onClick}
            className={`group flex items-start sm:items-center gap-4 p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/80 hover:bg-slate-900 cursor-pointer transition-all duration-300 active:scale-[0.98] hover:shadow-lg`}
        >
            <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 border ${style} transition-transform group-hover:scale-110 duration-300`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-slate-200 group-hover:text-white text-base sm:text-lg">{title}</h4>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium hidden sm:inline-block ${diffStyle.color}`}>
                        {diffStyle.label}
                    </span>
                </div>
                <p className="text-sm text-slate-500 group-hover:text-slate-400 transition-colors line-clamp-2 sm:line-clamp-1">{desc}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-slate-700 transition-colors shrink-0 self-center">
                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white" />
            </div>
        </div>
    );
};

export default Home;
