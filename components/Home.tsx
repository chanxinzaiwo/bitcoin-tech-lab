import React from 'react';
import { Shield, Zap, ArrowRight, Wallet, Network, Pickaxe, Hash, FileKey, Code, GitMerge, Cpu, Scaling, Workflow, TreeDeciduous, Skull, Flashlight, TrendingUp, Layers, History, EyeOff, Server, Users, GitBranch, BookOpen, Coins, FileText, Key, Smartphone, Snowflake, Split, Sigma, RefreshCw, Clock, KeyRound, Link2, Repeat, Box, Shuffle, Send, Gem, ArrowUp, Lock, Flame, Hexagon, Cat, Globe } from 'lucide-react';
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
  | 'lime'
  | 'violet'
  | 'green';

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
  violet: 'bg-violet-500/10 text-violet-400 border-violet-500/20 group-hover:border-violet-500/50',
  green: 'bg-green-500/10 text-green-400 border-green-500/20 group-hover:border-green-500/50',
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

      <div className="max-w-5xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-16 relative z-10">

        {/* Header */}
        <div className="text-center space-y-4 sm:space-y-6 mb-12 sm:mb-24 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-[0_0_15px_rgba(249,115,22,0.2)]">
            Bitcoin Technical Lab
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
            解构比特币：<br/>
            <span className="bg-gradient-to-r from-orange-400 to-amber-200 bg-clip-text text-transparent">
              从原理到现代协议的旅程
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-sm sm:text-base md:text-lg text-slate-400 leading-relaxed px-2 sm:px-0">
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
        <div className="mt-12 sm:mt-20 pt-12 sm:pt-20 border-t border-slate-800/50">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-white mb-8 sm:mb-16 flex items-center justify-center gap-2 sm:gap-3">
                <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-400 fill-yellow-400" />
                深入学习
            </h2>

            {/* All Modules Grid - Organized by Category */}

            {/* 核心原理 */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-orange-400" />
                核心原理
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-8 sm:mb-12">
                <ModuleCard view="ecc" label="ECC 加密" icon={Shield} color="orange" onClick={onViewChange} />
                <ModuleCard view="address" label="地址生成" icon={Hash} color="emerald" onClick={onViewChange} />
                <ModuleCard view="hdwallet" label="HD 钱包" icon={TreeDeciduous} color="teal" onClick={onViewChange} />
                <ModuleCard view="bip32" label="BIP32 派生" icon={Key} color="blue" onClick={onViewChange} />
                <ModuleCard view="bip39" label="BIP39 助记词" icon={BookOpen} color="emerald" onClick={onViewChange} />
                <ModuleCard view="utxo" label="UTXO 模型" icon={Wallet} color="blue" onClick={onViewChange} />
                <ModuleCard view="script" label="脚本引擎" icon={Code} color="pink" onClick={onViewChange} />
                <ModuleCard view="miniscript" label="Miniscript" icon={FileText} color="cyan" onClick={onViewChange} />
                <ModuleCard view="merkle" label="默克尔树" icon={GitBranch} color="purple" onClick={onViewChange} />
                <ModuleCard view="transaction" label="交易构建" icon={Send} color="indigo" onClick={onViewChange} />
                <ModuleCard view="coinselection" label="币种选择" icon={Coins} color="amber" onClick={onViewChange} />
                <ModuleCard view="mempool" label="内存池" icon={Layers} color="purple" onClick={onViewChange} />
            </div>

            {/* 网络共识 */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                <Network className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
                网络共识
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-8 sm:mb-12">
                <ModuleCard view="p2p" label="P2P 网络" icon={Network} color="indigo" onClick={onViewChange} />
                <ModuleCard view="blockstructure" label="区块结构" icon={Box} color="blue" onClick={onViewChange} />
                <ModuleCard view="pow" label="PoW 挖矿" icon={Pickaxe} color="amber" onClick={onViewChange} />
                <ModuleCard view="mining" label="挖矿经济学" icon={TrendingUp} color="orange" onClick={onViewChange} />
                <ModuleCard view="consensus" label="共识机制" icon={GitMerge} color="rose" onClick={onViewChange} />
                <ModuleCard view="fork" label="软硬分叉" icon={Split} color="purple" onClick={onViewChange} />
            </div>

            {/* 扩容与升级 */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                <Scaling className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
                扩容与升级
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-8 sm:mb-12">
                <ModuleCard view="segwit" label="隔离见证" icon={Scaling} color="cyan" onClick={onViewChange} />
                <ModuleCard view="taproot" label="Taproot" icon={Workflow} color="purple" onClick={onViewChange} />
                <ModuleCard view="schnorr" label="Schnorr 签名" icon={Sigma} color="pink" onClick={onViewChange} />
                <ModuleCard view="musig2" label="MuSig2 聚合" icon={Users} color="violet" onClick={onViewChange} />
                <ModuleCard view="lightning" label="闪电网络" icon={Flashlight} color="yellow" onClick={onViewChange} />
                <ModuleCard view="sidechains" label="侧链" icon={GitBranch} color="indigo" onClick={onViewChange} />
                <ModuleCard view="timelock" label="时间锁" icon={Clock} color="teal" onClick={onViewChange} />
                <ModuleCard view="psbt" label="PSBT 签名" icon={FileText} color="blue" onClick={onViewChange} />
                <ModuleCard view="atomicswap" label="原子交换" icon={Repeat} color="emerald" onClick={onViewChange} />
                <ModuleCard view="rbf" label="RBF 替换" icon={RefreshCw} color="lime" onClick={onViewChange} />
                <ModuleCard view="cpfp" label="CPFP 子付父" icon={ArrowUp} color="green" onClick={onViewChange} />
            </div>

            {/* 安全与隐私 */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                <EyeOff className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" />
                安全与隐私
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2 sm:gap-3 mb-8 sm:mb-12">
                <ModuleCard view="fullnode" label="全节点" icon={Server} color="cyan" onClick={onViewChange} />
                <ModuleCard view="spv" label="SPV 轻节点" icon={Smartphone} color="blue" onClick={onViewChange} />
                <ModuleCard view="cold" label="冷钱包" icon={Snowflake} color="cyan" onClick={onViewChange} />
                <ModuleCard view="multisig" label="多签钱包" icon={Users} color="purple" onClick={onViewChange} />
                <ModuleCard view="threshold" label="门限签名" icon={KeyRound} color="indigo" onClick={onViewChange} />
                <ModuleCard view="adaptor" label="适配器签名" icon={Link2} color="pink" onClick={onViewChange} />
                <ModuleCard view="vault" label="Vault 保险库" icon={Lock} color="teal" onClick={onViewChange} />
                <ModuleCard view="coinjoin" label="CoinJoin 混币" icon={Shuffle} color="violet" onClick={onViewChange} />
                <ModuleCard view="privacy" label="隐私技术" icon={EyeOff} color="purple" onClick={onViewChange} />
                <ModuleCard view="attack51" label="51% 攻击" icon={Skull} color="red" onClick={onViewChange} />
            </div>

            {/* 前沿与历史 */}
            <h3 className="text-lg sm:text-xl font-bold text-slate-300 mb-4 sm:mb-6 flex items-center gap-2">
                <History className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-400" />
                前沿与历史
            </h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 sm:gap-3 mb-8 sm:mb-12">
                <ModuleCard view="ordinals" label="Ordinals 铭文" icon={Gem} color="amber" onClick={onViewChange} />
                <ModuleCard view="runes" label="Runes 符文" icon={Flame} color="orange" onClick={onViewChange} />
                <ModuleCard view="arc20" label="ARC20 代币" icon={Hexagon} color="yellow" onClick={onViewChange} />
                <ModuleCard view="cat20" label="CAT20 代币" icon={Cat} color="lime" onClick={onViewChange} />
                <ModuleCard view="ecosystem" label="生态全景" icon={Globe} color="violet" onClick={onViewChange} />
                <ModuleCard view="opcat" label="OP_CAT" icon={Link2} color="orange" onClick={onViewChange} />
                <ModuleCard view="history" label="比特币历史" icon={History} color="indigo" onClick={onViewChange} />
                <ModuleCard view="quantum" label="量子计算" icon={Cpu} color="cyan" onClick={onViewChange} />
                <ModuleCard view="lamport" label="Lamport 签名" icon={FileKey} color="emerald" onClick={onViewChange} />
            </div>
        </div>

        {/* FAQ & Timeline Section */}
        <div className="mt-12 sm:mt-20 grid lg:grid-cols-2 gap-4 sm:gap-6">
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

// --- Module Card Component for All Modules Grid ---
interface ModuleCardProps {
  view: View;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: ColorStyleKey;
  onClick: (view: View) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ view, label, icon: Icon, color, onClick }) => {
  const colorClasses: Record<ColorStyleKey, { bg: string; text: string; border: string; hoverBorder: string }> = {
    orange: { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-500/20', hoverBorder: 'hover:border-orange-500/50' },
    emerald: { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-500/20', hoverBorder: 'hover:border-emerald-500/50' },
    blue: { bg: 'bg-blue-900/30', text: 'text-blue-400', border: 'border-blue-500/20', hoverBorder: 'hover:border-blue-500/50' },
    pink: { bg: 'bg-pink-900/30', text: 'text-pink-400', border: 'border-pink-500/20', hoverBorder: 'hover:border-pink-500/50' },
    indigo: { bg: 'bg-indigo-900/30', text: 'text-indigo-400', border: 'border-indigo-500/20', hoverBorder: 'hover:border-indigo-500/50' },
    amber: { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-500/20', hoverBorder: 'hover:border-amber-500/50' },
    purple: { bg: 'bg-purple-900/30', text: 'text-purple-400', border: 'border-purple-500/20', hoverBorder: 'hover:border-purple-500/50' },
    rose: { bg: 'bg-rose-900/30', text: 'text-rose-400', border: 'border-rose-500/20', hoverBorder: 'hover:border-rose-500/50' },
    cyan: { bg: 'bg-cyan-900/30', text: 'text-cyan-400', border: 'border-cyan-500/20', hoverBorder: 'hover:border-cyan-500/50' },
    teal: { bg: 'bg-teal-900/30', text: 'text-teal-400', border: 'border-teal-500/20', hoverBorder: 'hover:border-teal-500/50' },
    yellow: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-500/20', hoverBorder: 'hover:border-yellow-500/50' },
    red: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-500/20', hoverBorder: 'hover:border-red-500/50' },
    lime: { bg: 'bg-lime-900/30', text: 'text-lime-400', border: 'border-lime-500/20', hoverBorder: 'hover:border-lime-500/50' },
    violet: { bg: 'bg-violet-900/30', text: 'text-violet-400', border: 'border-violet-500/20', hoverBorder: 'hover:border-violet-500/50' },
    green: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-500/20', hoverBorder: 'hover:border-green-500/50' },
  };
  const c = colorClasses[color];

  return (
    <div
      onClick={() => onClick(view)}
      className={`group bg-slate-900 border border-slate-800 rounded-xl p-2.5 sm:p-3 cursor-pointer ${c.hoverBorder} transition-all duration-300 hover:bg-slate-800/50 active:scale-[0.98] min-h-[72px] sm:min-h-0`}
    >
      <div className={`w-8 h-8 sm:w-9 sm:h-9 ${c.bg} ${c.text} rounded-lg flex items-center justify-center mb-1.5 sm:mb-2 border ${c.border}`}>
        <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </div>
      <h4 className="font-bold text-white text-[10px] sm:text-xs leading-tight line-clamp-2">{label}</h4>
    </div>
  );
};

export default Home;
