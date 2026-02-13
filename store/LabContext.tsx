import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { KeyPair, UTXO, Transaction, Block } from '../types';
import { TOTAL_MODULES } from '../config/navigation';

interface LabContextType {
    // Identity
    identity: KeyPair | null;
    setIdentity: (keyPair: KeyPair) => void;

    // Wallet / UTXOs
    wallet: UTXO[];
    addUTXO: (utxo: UTXO) => void;
    removeUTXO: (id: string) => void;
    resetWallet: () => void;

    // Mempool
    mempool: Transaction[];
    broadcastTransaction: (tx: Transaction) => void;
    clearMempool: () => void;

    // Blockchain
    blockchain: Block[];
    addBlock: (block: Block) => void;

    // Theme
    isDarkMode: boolean;
    toggleTheme: () => void;

    // Progress Tracking
    progress: {
        hasIdentity: boolean;
        hasFunded: boolean;
        hasTx: boolean;
        hasMined: boolean;
    };
    updateProgress: (key: keyof LabContextType['progress'], value: boolean) => void;

    // Module Completion Tracking
    visitedModules: string[];
    completedModules: string[];
    markModuleVisited: (moduleId: string) => void;
    markModuleCompleted: (moduleId: string) => void;
    isModuleCompleted: (moduleId: string) => boolean;
    getModuleProgress: () => { visited: number; completed: number; total: number };
}

const LabContext = createContext<LabContextType | undefined>(undefined);

// Storage helper functions
const loadState = <T,>(key: string, fallback: T): T => {
    try {
        const saved = localStorage.getItem(`btc_lab_${key}`);
        return saved ? JSON.parse(saved) : fallback;
    } catch {
        return fallback;
    }
};

const saveState = (key: string, value: unknown) => {
    try {
        localStorage.setItem(`btc_lab_${key}`, JSON.stringify(value));
    } catch (e) {
        console.error("Storage failed", e);
    }
};

// Initial wallet state
const initialWallet: UTXO[] = [
    { id: 'utxo_demo_1', amount: 0.5, ownerAddress: 'DemoWallet', color: 'bg-emerald-100 border-emerald-300 text-emerald-800', time: 100 },
    { id: 'utxo_demo_2', amount: 1.2, ownerAddress: 'DemoWallet', color: 'bg-purple-100 border-purple-300 text-purple-800', time: 200 },
];

export const LabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // Identity State
    const [identity, setIdentityState] = useState<KeyPair | null>(() => loadState('identity', null));

    // Wallet State
    const [wallet, setWallet] = useState<UTXO[]>(() => loadState('wallet', initialWallet));

    // Mempool
    const [mempool, setMempool] = useState<Transaction[]>([]);

    // Blockchain
    const [blockchain, setBlockchain] = useState<Block[]>([]);

    // Theme
    const [isDarkMode, setIsDarkMode] = useState(() => loadState('theme', true));

    // Progress
    const [progress, setProgress] = useState(() => loadState('progress', {
        hasIdentity: false,
        hasFunded: true,
        hasTx: false,
        hasMined: false,
    }));

    // Module Tracking
    const [visitedModules, setVisitedModules] = useState<string[]>(() => loadState('visitedModules', []));
    const [completedModules, setCompletedModules] = useState<string[]>(() => loadState('completedModules', []));

    // --- Persistence Effects ---
    useEffect(() => saveState('identity', identity), [identity]);
    useEffect(() => saveState('wallet', wallet), [wallet]);
    useEffect(() => saveState('theme', isDarkMode), [isDarkMode]);
    useEffect(() => saveState('progress', progress), [progress]);
    useEffect(() => saveState('visitedModules', visitedModules), [visitedModules]);
    useEffect(() => saveState('completedModules', completedModules), [completedModules]);

    // --- Memoized Actions ---
    const updateProgress = useCallback((key: keyof typeof progress, value: boolean) => {
        setProgress(prev => ({ ...prev, [key]: value }));
    }, []);

    const setIdentity = useCallback((kp: KeyPair) => {
        setIdentityState(kp);
        updateProgress('hasIdentity', true);
    }, [updateProgress]);

    const addUTXO = useCallback((utxo: UTXO) => {
        setWallet(prev => [utxo, ...prev]);
    }, []);

    const removeUTXO = useCallback((id: string) => {
        setWallet(prev => prev.filter(u => u.id !== id));
    }, []);

    const resetWallet = useCallback(() => {
        setWallet(initialWallet);
    }, []);

    const broadcastTransaction = useCallback((tx: Transaction) => {
        setMempool(prev => [tx, ...prev]);
        tx.inputs.forEach(input => {
            setWallet(prev => prev.filter(u => u.id !== input.utxoId));
        });
        updateProgress('hasTx', true);
    }, [updateProgress]);

    const clearMempool = useCallback(() => {
        setMempool([]);
    }, []);

    const addBlock = useCallback((block: Block) => {
        setBlockchain(prev => [...prev, block]);
        const txIds = new Set(block.transactions.map(t => t.id));
        setMempool(prev => prev.filter(tx => !txIds.has(tx.id)));
        updateProgress('hasMined', true);
    }, [updateProgress]);

    const toggleTheme = useCallback(() => {
        setIsDarkMode(prev => !prev);
    }, []);

    // Module Tracking Functions
    const markModuleVisited = useCallback((moduleId: string) => {
        setVisitedModules(prev => {
            if (prev.includes(moduleId)) return prev;
            return [...prev, moduleId];
        });
    }, []);

    const markModuleCompleted = useCallback((moduleId: string) => {
        setCompletedModules(prev => {
            if (prev.includes(moduleId)) return prev;
            return [...prev, moduleId];
        });
        markModuleVisited(moduleId);
    }, [markModuleVisited]);

    const isModuleCompleted = useCallback((moduleId: string) => {
        return completedModules.includes(moduleId);
    }, [completedModules]);

    const getModuleProgress = useCallback(() => ({
        visited: visitedModules.length,
        completed: completedModules.length,
        total: TOTAL_MODULES
    }), [visitedModules.length, completedModules.length]);

    // --- Memoized Context Value ---
    const contextValue = useMemo<LabContextType>(() => ({
        identity,
        setIdentity,
        wallet,
        addUTXO,
        removeUTXO,
        resetWallet,
        mempool,
        broadcastTransaction,
        clearMempool,
        blockchain,
        addBlock,
        isDarkMode,
        toggleTheme,
        progress,
        updateProgress,
        visitedModules,
        completedModules,
        markModuleVisited,
        markModuleCompleted,
        isModuleCompleted,
        getModuleProgress
    }), [
        identity,
        setIdentity,
        wallet,
        addUTXO,
        removeUTXO,
        resetWallet,
        mempool,
        broadcastTransaction,
        clearMempool,
        blockchain,
        addBlock,
        isDarkMode,
        toggleTheme,
        progress,
        updateProgress,
        visitedModules,
        completedModules,
        markModuleVisited,
        markModuleCompleted,
        isModuleCompleted,
        getModuleProgress
    ]);

    return (
        <LabContext.Provider value={contextValue}>
            {children}
        </LabContext.Provider>
    );
};

export const useLab = () => {
    const context = useContext(LabContext);
    if (!context) {
        throw new Error('useLab must be used within a LabProvider');
    }
    return context;
};
