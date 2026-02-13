import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Trophy } from 'lucide-react';
import { View, viewOrder } from './config/navigation';
import { useModals } from './hooks/useModals';
import AppHeader from './components/layout/AppHeader';
import AppFooter from './components/layout/AppFooter';
import ShortcutsModal from './components/modals/ShortcutsModal';
import LoadingSpinner from './components/ui/LoadingSpinner';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './components/Toast';
import { LabProvider, useLab } from './store/LabContext';
import SkipLink from './components/SkipLink';
import { initAnnouncer, announce } from './utils/accessibility';

// Lazy load all demo components for code splitting
const Home = lazy(() => import('./components/Home'));
const QuantumDemo = lazy(() => import('./components/QuantumDemo'));
const ECCDemo = lazy(() => import('./components/ECCDemo'));
const LamportDemo = lazy(() => import('./components/LamportDemo'));
const PoWDemo = lazy(() => import('./components/PoWDemo'));
const AddressDemo = lazy(() => import('./components/AddressDemo'));
const UTXODemo = lazy(() => import('./components/UTXODemo'));
const ScriptDemo = lazy(() => import('./components/ScriptDemo'));
const P2PDemo = lazy(() => import('./components/P2PDemo'));
const ConsensusDemo = lazy(() => import('./components/ConsensusDemo'));
const SegWitDemo = lazy(() => import('./components/SegWitDemo'));
const TaprootDemo = lazy(() => import('./components/TaprootDemo'));
const HDWalletDemo = lazy(() => import('./components/HDWalletDemo'));
const Attack51Demo = lazy(() => import('./components/Attack51Demo'));
const LightningDemo = lazy(() => import('./components/LightningDemo'));
const RBFDemo = lazy(() => import('./components/RBFDemo'));
const ForkDemo = lazy(() => import('./components/ForkDemo'));
const SchnorrDemo = lazy(() => import('./components/SchnorrDemo'));
const SPVDemo = lazy(() => import('./components/SPVDemo'));
const ColdWalletDemo = lazy(() => import('./components/ColdWalletDemo'));
const MempoolDemo = lazy(() => import('./components/MempoolDemo'));
const MerkleTreeDemo = lazy(() => import('./components/MerkleTreeDemo'));
const MultiSigDemo = lazy(() => import('./components/MultiSigDemo'));
const TransactionDemo = lazy(() => import('./components/TransactionDemo'));
const MiningEconomicsDemo = lazy(() => import('./components/MiningEconomicsDemo'));
const BitcoinHistoryDemo = lazy(() => import('./components/BitcoinHistoryDemo'));
const PrivacyDemo = lazy(() => import('./components/PrivacyDemo'));
const FullNodeDemo = lazy(() => import('./components/FullNodeDemo'));
const TimeLockDemo = lazy(() => import('./components/TimeLockDemo'));
const ThresholdSigDemo = lazy(() => import('./components/ThresholdSigDemo'));
const AdaptorSigDemo = lazy(() => import('./components/AdaptorSigDemo'));
const PSBTDemo = lazy(() => import('./components/PSBTDemo'));
const AtomicSwapDemo = lazy(() => import('./components/AtomicSwapDemo'));
const BlockStructureDemo = lazy(() => import('./components/BlockStructureDemo'));
const CoinJoinDemo = lazy(() => import('./components/CoinJoinDemo'));
const MuSig2Demo = lazy(() => import('./components/MuSig2Demo'));
const MiniscriptDemo = lazy(() => import('./components/MiniscriptDemo'));
const SidechainsDemo = lazy(() => import('./components/SidechainsDemo'));
const BIP39Demo = lazy(() => import('./components/BIP39Demo'));
const CoinSelectionDemo = lazy(() => import('./components/CoinSelectionDemo'));
const LearningPath = lazy(() => import('./components/LearningPath'));
const Glossary = lazy(() => import('./components/Glossary'));
const Achievements = lazy(() => import('./components/Achievements'));

const MainApp: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { modals, open, close, toggle } = useModals();
  const { isDarkMode, toggleTheme, markModuleVisited, getModuleProgress } = useLab();

  // Load last view from localStorage or use URL hash
  const [currentView, setCurrentView] = useState<View>(() => {
    const hash = window.location.hash.slice(1) as View;
    if (hash && viewOrder.includes(hash)) {
      return hash;
    }
    const savedView = localStorage.getItem('btc_lab_lastView') as View;
    if (savedView && viewOrder.includes(savedView)) {
      return savedView;
    }
    return 'home';
  });

  // URL hash routing
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) as View;
      if (hash && viewOrder.includes(hash)) {
        setCurrentView(hash);
      } else if (!hash) {
        setCurrentView('home');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Track module visits and save current view
  useEffect(() => {
    if (currentView !== 'home') {
      markModuleVisited(currentView);
    }
    localStorage.setItem('btc_lab_lastView', currentView);
  }, [currentView, markModuleVisited]);

  // Update URL when view changes
  const handleViewChange = useCallback((view: View) => {
    setCurrentView(view);
    window.location.hash = view === 'home' ? '' : view;
    setIsMobileMenuOpen(false);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }

      const currentIndex = viewOrder.indexOf(currentView);

      switch (e.key) {
        case 'ArrowLeft':
          if (currentIndex > 0) {
            handleViewChange(viewOrder[currentIndex - 1]);
          }
          break;
        case 'ArrowRight':
          if (currentIndex < viewOrder.length - 1) {
            handleViewChange(viewOrder[currentIndex + 1]);
          }
          break;
        case 'Escape':
          handleViewChange('home');
          break;
        case '?':
          toggle('shortcuts');
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentView, handleViewChange, toggle]);

  // Initialize accessibility announcer on mount
  useEffect(() => {
    initAnnouncer();
  }, []);

  // Announce view changes for screen readers
  useEffect(() => {
    if (currentView !== 'home') {
      // Map view IDs to human-readable names
      const viewNames: Record<string, string> = {
        ecc: '椭圆曲线密码学',
        quantum: '量子计算',
        hdwallet: 'HD 钱包',
        utxo: 'UTXO 模型',
        script: '比特币脚本',
        merkle: '默克尔树',
        transaction: '交易构建',
        lightning: '闪电网络',
        segwit: '隔离见证',
        taproot: 'Taproot',
        consensus: '共识机制',
        mining: '挖矿经济学',
        pow: '工作量证明',
        address: '比特币地址',
        mempool: '内存池',
        p2p: 'P2P 网络',
        rbf: '手续费替换',
        fork: '分叉机制',
        schnorr: 'Schnorr 签名',
        spv: '简单支付验证',
        cold: '冷存储',
        multisig: '多签钱包',
        privacy: '隐私技术',
        history: '比特币历史',
        fullnode: '全节点',
        lamport: 'Lamport 签名',
        attack51: '51% 攻击',
        timelock: '时间锁',
        threshold: '门限签名',
        adaptor: '适配器签名',
        psbt: 'PSBT 部分签名',
        atomicswap: '原子交换',
        blockstructure: '区块结构',
        coinjoin: 'CoinJoin 混币',
        musig2: 'MuSig2 聚合签名',
        miniscript: 'Miniscript 策略脚本',
        sidechains: '侧链',
        bip39: 'BIP39 助记词',
        coinselection: '币种选择',
      };
      const viewName = viewNames[currentView] || currentView;
      announce(`已切换到 ${viewName} 模块`);
    }
  }, [currentView]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const renderContent = () => {
    const componentMap: Record<View, React.ReactNode> = {
      home: <Home onViewChange={handleViewChange} />,
      quantum: <QuantumDemo />,
      ecc: <ECCDemo />,
      lamport: <LamportDemo />,
      pow: <PoWDemo />,
      address: <AddressDemo />,
      utxo: <UTXODemo />,
      script: <ScriptDemo />,
      merkle: <MerkleTreeDemo />,
      transaction: <TransactionDemo />,
      p2p: <P2PDemo />,
      consensus: <ConsensusDemo />,
      segwit: <SegWitDemo />,
      taproot: <TaprootDemo />,
      hdwallet: <HDWalletDemo />,
      attack51: <Attack51Demo />,
      lightning: <LightningDemo />,
      rbf: <RBFDemo />,
      fork: <ForkDemo />,
      schnorr: <SchnorrDemo />,
      spv: <SPVDemo />,
      cold: <ColdWalletDemo />,
      multisig: <MultiSigDemo />,
      mempool: <MempoolDemo />,
      mining: <MiningEconomicsDemo />,
      history: <BitcoinHistoryDemo />,
      privacy: <PrivacyDemo />,
      fullnode: <FullNodeDemo />,
      timelock: <TimeLockDemo />,
      threshold: <ThresholdSigDemo />,
      adaptor: <AdaptorSigDemo />,
      psbt: <PSBTDemo />,
      atomicswap: <AtomicSwapDemo />,
      blockstructure: <BlockStructureDemo />,
      coinjoin: <CoinJoinDemo />,
      musig2: <MuSig2Demo />,
      miniscript: <MiniscriptDemo />,
      sidechains: <SidechainsDemo />,
      bip39: <BIP39Demo />,
      coinselection: <CoinSelectionDemo />,
    };

    return componentMap[currentView] || <Home onViewChange={handleViewChange} />;
  };

  const progress = getModuleProgress();

  return (
    <div className={`min-h-screen flex flex-col font-sans selection:bg-orange-500 selection:text-white transition-colors duration-300 ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      {/* Skip Link for accessibility */}
      <SkipLink targetId="main-content" />

      {/* Navigation */}
      <AppHeader
        currentView={currentView}
        onViewChange={handleViewChange}
        isDarkMode={isDarkMode}
        toggleTheme={toggleTheme}
        isMobileMenuOpen={isMobileMenuOpen}
        setIsMobileMenuOpen={setIsMobileMenuOpen}
        openModal={open}
      />

      {/* Main Content */}
      <main
        id="main-content"
        className="flex-grow"
        tabIndex={-1}
        role="main"
        aria-label="主要内容区域"
      >
        <ErrorBoundary onReset={() => handleViewChange('home')}>
          <Suspense fallback={<LoadingSpinner message="加载模块中..." />}>
            {renderContent()}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* Footer */}
      <AppFooter isDarkMode={isDarkMode} progress={progress} />

      {/* Keyboard Shortcuts Modal */}
      {modals.shortcuts && (
        <ShortcutsModal onClose={() => close('shortcuts')} isDarkMode={isDarkMode} />
      )}

      {/* Learning Path Modal */}
      {modals.learningPath && (
        <Suspense fallback={<LoadingSpinner />}>
          <LearningPath
            onViewChange={handleViewChange}
            onClose={() => close('learningPath')}
          />
        </Suspense>
      )}

      {/* Glossary Modal */}
      {modals.glossary && (
        <Suspense fallback={<LoadingSpinner />}>
          <Glossary onClose={() => close('glossary')} />
        </Suspense>
      )}

      {/* Achievements Modal */}
      {modals.achievements && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm" onClick={() => close('achievements')}>
          <div className={`w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-white border-slate-200'}`} onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b backdrop-blur-md" style={{ background: isDarkMode ? 'rgba(2, 6, 23, 0.9)' : 'rgba(255, 255, 255, 0.9)', borderColor: isDarkMode ? '#1e293b' : '#e2e8f0' }}>
              <h2 className={`text-lg font-bold flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                <Trophy className="w-5 h-5 text-amber-500" />
                学习成就
              </h2>
              <button
                onClick={() => close('achievements')}
                className={`px-4 py-2 rounded-lg font-medium ${isDarkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
              >
                关闭
              </button>
            </div>
            <Suspense fallback={<LoadingSpinner />}>
              <Achievements />
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

const AppWithProvider = () => (
  <ErrorBoundary>
    <LabProvider>
      <ToastProvider>
        <MainApp />
      </ToastProvider>
    </LabProvider>
  </ErrorBoundary>
);

export default AppWithProvider;
