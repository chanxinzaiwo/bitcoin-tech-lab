/**
 * Prefetch utilities for optimizing navigation
 */

// Track which modules have been prefetched
const prefetchedModules = new Set<string>();

/**
 * Prefetch a module chunk by dynamically importing it
 */
export const prefetchModule = async (moduleId: string): Promise<void> => {
  if (prefetchedModules.has(moduleId)) return;

  const moduleMap: Record<string, () => Promise<unknown>> = {
    ecc: () => import('../components/ECCDemo'),
    address: () => import('../components/AddressDemo'),
    hdwallet: () => import('../components/HDWalletDemo'),
    utxo: () => import('../components/UTXODemo'),
    script: () => import('../components/ScriptDemo'),
    mempool: () => import('../components/MempoolDemo'),
    p2p: () => import('../components/P2PDemo'),
    pow: () => import('../components/PoWDemo'),
    mining: () => import('../components/MiningEconomicsDemo'),
    consensus: () => import('../components/ConsensusDemo'),
    fork: () => import('../components/ForkDemo'),
    segwit: () => import('../components/SegWitDemo'),
    taproot: () => import('../components/TaprootDemo'),
    schnorr: () => import('../components/SchnorrDemo'),
    lightning: () => import('../components/LightningDemo'),
    rbf: () => import('../components/RBFDemo'),
    fullnode: () => import('../components/FullNodeDemo'),
    spv: () => import('../components/SPVDemo'),
    cold: () => import('../components/ColdWalletDemo'),
    privacy: () => import('../components/PrivacyDemo'),
    attack51: () => import('../components/Attack51Demo'),
    history: () => import('../components/BitcoinHistoryDemo'),
    quantum: () => import('../components/QuantumDemo'),
    lamport: () => import('../components/LamportDemo'),
  };

  const loader = moduleMap[moduleId];
  if (loader) {
    try {
      await loader();
      prefetchedModules.add(moduleId);
    } catch (e) {
      console.warn(`Failed to prefetch module: ${moduleId}`, e);
    }
  }
};

/**
 * Prefetch multiple modules
 */
export const prefetchModules = (moduleIds: string[]): void => {
  // Use requestIdleCallback if available, otherwise setTimeout
  const scheduleTask = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

  moduleIds.forEach((id, index) => {
    scheduleTask(() => {
      prefetchModule(id);
    }, { timeout: 2000 + index * 500 });
  });
};

/**
 * Prefetch on hover - call this when user hovers over a navigation item
 */
export const prefetchOnHover = (moduleId: string): (() => void) => {
  // Small delay to avoid prefetching on accidental hovers
  const timer = setTimeout(() => {
    prefetchModule(moduleId);
  }, 100);

  return () => clearTimeout(timer);
};

/**
 * Get popular/recommended modules to prefetch after initial load
 */
export const getRecommendedPrefetch = (): string[] => {
  return ['ecc', 'address', 'utxo', 'pow', 'lightning'];
};

/**
 * Prefetch recommended modules after page is idle
 */
export const prefetchRecommended = (): void => {
  if (typeof window === 'undefined') return;

  // Wait for page to be fully loaded and idle
  if (document.readyState === 'complete') {
    prefetchModules(getRecommendedPrefetch());
  } else {
    window.addEventListener('load', () => {
      setTimeout(() => {
        prefetchModules(getRecommendedPrefetch());
      }, 2000);
    });
  }
};
