import { Shield, Pickaxe, Wallet, Network, Code, GitMerge, Scaling, Workflow, TreeDeciduous, Skull, Flashlight, TrendingUp, Smartphone, Snowflake, Split, Sigma, Layers, History, EyeOff, Server, Hash, Zap, RefreshCw, Atom, FileKey, GitBranch, Users, Send, Clock, KeyRound, Link2, FileText, Repeat, Box, Shuffle, Coins, Key, BookOpen } from 'lucide-react';

export type View = 'home' | 'quantum' | 'ecc' | 'lamport' | 'pow' | 'address' | 'utxo' | 'script' | 'merkle' | 'transaction' | 'p2p' | 'consensus' | 'segwit' | 'taproot' | 'hdwallet' | 'attack51' | 'lightning' | 'rbf' | 'fork' | 'schnorr' | 'spv' | 'cold' | 'multisig' | 'mempool' | 'mining' | 'history' | 'privacy' | 'fullnode' | 'timelock' | 'threshold' | 'adaptor' | 'psbt' | 'atomicswap' | 'blockstructure' | 'coinjoin' | 'musig2' | 'miniscript' | 'sidechains' | 'bip39' | 'coinselection';

// All views in order for keyboard navigation
export const viewOrder: View[] = [
  'home', 'ecc', 'address', 'hdwallet', 'bip39', 'utxo', 'script', 'miniscript', 'merkle', 'transaction', 'coinselection', 'mempool',
  'segwit', 'taproot', 'schnorr', 'musig2', 'lightning', 'timelock', 'psbt', 'atomicswap', 'sidechains', 'p2p', 'rbf', 'pow',
  'blockstructure', 'mining', 'consensus', 'fork', 'attack51', 'spv', 'fullnode',
  'cold', 'multisig', 'threshold', 'adaptor', 'coinjoin', 'privacy', 'history', 'quantum', 'lamport'
];

// Total number of learning modules (excluding 'home')
export const TOTAL_MODULES = viewOrder.length - 1;

export const navGroups = [
  {
    title: '核心原理',
    items: [
      { id: 'ecc', label: 'ECC 加密', icon: Shield },
      { id: 'address', label: '地址生成', icon: Hash },
      { id: 'hdwallet', label: 'HD 钱包', icon: TreeDeciduous },
      { id: 'bip39', label: 'BIP39 助记词', icon: BookOpen },
      { id: 'utxo', label: 'UTXO 模型', icon: Wallet },
      { id: 'script', label: '脚本引擎', icon: Code },
      { id: 'miniscript', label: 'Miniscript', icon: FileText },
      { id: 'merkle', label: '默克尔树', icon: GitBranch },
      { id: 'transaction', label: '交易构建', icon: Send },
      { id: 'coinselection', label: '币种选择', icon: Coins },
      { id: 'mempool', label: '内存池', icon: Layers },
    ]
  },
  {
    title: '网络共识',
    items: [
      { id: 'p2p', label: 'P2P 网络', icon: Network },
      { id: 'blockstructure', label: '区块结构', icon: Box },
      { id: 'pow', label: 'PoW 挖矿', icon: Pickaxe },
      { id: 'mining', label: '挖矿经济学', icon: TrendingUp },
      { id: 'consensus', label: '共识机制', icon: GitMerge },
      { id: 'fork', label: '软硬分叉', icon: Split },
    ]
  },
  {
    title: '扩容与升级',
    items: [
      { id: 'segwit', label: '隔离见证', icon: Scaling },
      { id: 'taproot', label: 'Taproot', icon: Workflow },
      { id: 'schnorr', label: 'Schnorr', icon: Sigma },
      { id: 'musig2', label: 'MuSig2 聚合签名', icon: Users },
      { id: 'lightning', label: '闪电网络', icon: Flashlight },
      { id: 'sidechains', label: '侧链', icon: GitBranch },
      { id: 'timelock', label: '时间锁', icon: Clock },
      { id: 'psbt', label: 'PSBT 部分签名', icon: FileText },
      { id: 'atomicswap', label: '原子交换', icon: Repeat },
      { id: 'rbf', label: 'RBF 费用替换', icon: RefreshCw },
    ]
  },
  {
    title: '安全与隐私',
    items: [
      { id: 'fullnode', label: '全节点', icon: Server },
      { id: 'spv', label: 'SPV 轻节点', icon: Smartphone },
      { id: 'cold', label: '冷钱包', icon: Snowflake },
      { id: 'multisig', label: '多签钱包', icon: Users },
      { id: 'threshold', label: '门限签名', icon: KeyRound },
      { id: 'adaptor', label: '适配器签名', icon: Link2 },
      { id: 'coinjoin', label: 'CoinJoin 混币', icon: Shuffle },
      { id: 'privacy', label: '隐私技术', icon: EyeOff },
      { id: 'attack51', label: '51% 攻击', icon: Skull },
    ]
  },
  {
    title: '前沿与历史',
    items: [
      { id: 'history', label: '比特币历史', icon: History },
      { id: 'quantum', label: '量子计算', icon: Atom },
      { id: 'lamport', label: 'Lamport 签名', icon: FileKey },
    ]
  }
];
