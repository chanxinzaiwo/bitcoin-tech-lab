import React, { useState } from 'react';
import { GitBranch, Key, Lock, Unlock, ArrowRight, Copy, Check, AlertTriangle, Info, ChevronRight, Layers, Shield, Eye, EyeOff } from 'lucide-react';
import { useLab } from '../store/LabContext';
import Quiz from './Quiz';
import { bip32Quiz } from '../data/quizData';

type TabType = 'intro' | 'structure' | 'derivation' | 'paths' | 'security' | 'quiz';

const BIP32Demo: React.FC = () => {
    const [activeTab, setActiveTab] = useState<TabType>('intro');
    const { isDarkMode } = useLab();

    // 交互式派生演示状态
    const [masterKey] = useState('xprv9s21ZrQH143K3QTDL4LXw2F7HEK3wJUD2nW2nRk4stbPy6cq3jPPqjiChkVvvNKmPGJxWUtg6LnF5kejMRNNU3TGtRBeJgk33yuGBxrMPHi');
    const [derivationPath, setDerivationPath] = useState("m/44'/0'/0'/0/0");
    const [showPrivate, setShowPrivate] = useState(false);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);
    const [derivedKeys, setDerivedKeys] = useState<Array<{
        path: string;
        index: number;
        publicKey: string;
        privateKey: string;
        address: string;
        hardened: boolean;
    }>>([]);

    // 模拟密钥派生
    const simulateDerivation = (path: string) => {
        const parts = path.split('/');
        const keys: typeof derivedKeys = [];

        for (let i = 0; i < 5; i++) {
            const currentPath = `${path.replace(/\/\d+$/, '')}/${i}`;
            keys.push({
                path: currentPath,
                index: i,
                publicKey: `03${generateHash(currentPath + 'pub').substring(0, 64)}`,
                privateKey: generateHash(currentPath + 'priv'),
                address: `bc1q${generateHash(currentPath + 'addr').substring(0, 38).toLowerCase()}`,
                hardened: parts.some(p => p.includes("'"))
            });
        }
        setDerivedKeys(keys);
    };

    const generateHash = (input: string): string => {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            const char = input.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const hex = Math.abs(hash).toString(16).padStart(64, '0').substring(0, 64);
        return hex.toUpperCase();
    };

    const copyToClipboard = (text: string, keyId: string) => {
        navigator.clipboard.writeText(text);
        setCopiedKey(keyId);
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const tabs = [
        { id: 'intro' as TabType, label: '概述', icon: Info },
        { id: 'structure' as TabType, label: '密钥结构', icon: Key },
        { id: 'derivation' as TabType, label: '派生演示', icon: GitBranch },
        { id: 'paths' as TabType, label: '标准路径', icon: Layers },
        { id: 'security' as TabType, label: '安全考量', icon: Shield },
        { id: 'quiz' as TabType, label: '测验', icon: Check },
    ];

    const cardClass = isDarkMode
        ? 'bg-slate-800 border-slate-700'
        : 'bg-white border-slate-200';
    const textClass = isDarkMode ? 'text-slate-200' : 'text-slate-800';
    const mutedClass = isDarkMode ? 'text-slate-400' : 'text-slate-600';

    return (
        <div className="space-y-6">
            {/* 标签导航 */}
            <div className="flex flex-wrap gap-2">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
                            activeTab === tab.id
                                ? 'bg-blue-600 text-white'
                                : isDarkMode
                                    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* 概述 */}
            {activeTab === 'intro' && (
                <div className="space-y-6">
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>BIP32: 分层确定性钱包</h3>
                        <p className={`${mutedClass} mb-6`}>
                            BIP32 (Bitcoin Improvement Proposal 32) 定义了分层确定性钱包的标准，
                            允许从单个主密钥派生出无限数量的子密钥，同时保持完整的备份和恢复能力。
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-3 ${textClass}`}>核心优势</h4>
                                <ul className="space-y-2">
                                    {[
                                        '单种子备份：一个助记词恢复所有地址',
                                        '隐私增强：每次交易使用新地址',
                                        '组织结构：按用途分类管理密钥',
                                        '安全隔离：硬化派生保护父密钥'
                                    ].map((item, i) => (
                                        <li key={i} className={`flex items-start gap-2 ${mutedClass}`}>
                                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                <h4 className={`font-bold mb-3 ${textClass}`}>派生层级</h4>
                                <div className="space-y-3">
                                    {[
                                        { level: '种子 (Seed)', desc: '128-512 位随机数' },
                                        { level: '主密钥 (Master)', desc: '根节点，永不暴露' },
                                        { level: '目的层 (Purpose)', desc: "BIP44/49/84 等标准" },
                                        { level: '币种层 (Coin)', desc: "0' = BTC, 60' = ETH" },
                                        { level: '账户层 (Account)', desc: '逻辑分组' },
                                        { level: '链/地址层', desc: '接收/找零地址' }
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center shrink-0">
                                                {i}
                                            </span>
                                            <span className={`font-medium ${textClass}`}>{item.level}</span>
                                            <span className={`text-sm ${mutedClass}`}>- {item.desc}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 派生路径示意图 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>派生树结构</h3>
                        <div className={`p-4 rounded-xl font-mono text-sm ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <pre className={mutedClass}>
{`                    ┌─────────────────┐
                    │   Master Key    │
                    │   (m)           │
                    └────────┬────────┘
                             │
           ┌─────────────────┼─────────────────┐
           │                 │                 │
      ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
      │ m/44'   │       │ m/49'   │       │ m/84'   │
      │ BIP44   │       │ BIP49   │       │ BIP84   │
      └────┬────┘       └────┬────┘       └────┬────┘
           │                 │                 │
      ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
      │ m/44'/0'│       │ m/49'/0'│       │ m/84'/0'│
      │ Bitcoin │       │ Bitcoin │       │ Bitcoin │
      └────┬────┘       └────┬────┘       └────┬────┘
           │                 │                 │
      ┌────┴────┐       ┌────┴────┐       ┌────┴────┐
      │Account 0│       │Account 0│       │Account 0│
      └────┬────┘       └────┬────┘       └────┬────┘
           │
     ┌─────┴─────┐
     │           │
  ┌──┴──┐    ┌──┴──┐
  │  0  │    │  1  │
  │外部 │    │找零 │
  └──┬──┘    └──┬──┘
     │          │
  ┌──┴──┐    ┌──┴──┐
  │0,1..│    │0,1..│
  │地址 │    │地址 │
  └─────┘    └─────┘`}
                            </pre>
                        </div>
                    </div>
                </div>
            )}

            {/* 密钥结构 */}
            {activeTab === 'structure' && (
                <div className="space-y-6">
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>扩展密钥结构 (Extended Key)</h3>
                        <p className={`${mutedClass} mb-6`}>
                            BIP32 扩展密钥包含派生子密钥所需的所有信息，共 78 字节。
                        </p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}>
                                        <th className={`p-3 text-left ${textClass}`}>字段</th>
                                        <th className={`p-3 text-left ${textClass}`}>大小</th>
                                        <th className={`p-3 text-left ${textClass}`}>描述</th>
                                    </tr>
                                </thead>
                                <tbody className={mutedClass}>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-mono">Version</td>
                                        <td className="p-3">4 bytes</td>
                                        <td className="p-3">网络和密钥类型 (xprv/xpub)</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-mono">Depth</td>
                                        <td className="p-3">1 byte</td>
                                        <td className="p-3">派生深度 (0 = master)</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-mono">Parent Fingerprint</td>
                                        <td className="p-3">4 bytes</td>
                                        <td className="p-3">父公钥哈希前 4 字节</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-mono">Child Index</td>
                                        <td className="p-3">4 bytes</td>
                                        <td className="p-3">子密钥索引号</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-mono">Chain Code</td>
                                        <td className="p-3">32 bytes</td>
                                        <td className="p-3">派生熵，防止密钥推断</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-mono">Key Data</td>
                                        <td className="p-3">33 bytes</td>
                                        <td className="p-3">私钥 (0x00 + 32) 或压缩公钥</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 版本前缀 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>版本前缀</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            {[
                                { prefix: 'xprv', hex: '0x0488ADE4', type: '私钥', network: 'Mainnet', standard: 'BIP32' },
                                { prefix: 'xpub', hex: '0x0488B21E', type: '公钥', network: 'Mainnet', standard: 'BIP32' },
                                { prefix: 'yprv', hex: '0x049D7878', type: '私钥', network: 'Mainnet', standard: 'BIP49 (P2SH-SegWit)' },
                                { prefix: 'ypub', hex: '0x049D7CB2', type: '公钥', network: 'Mainnet', standard: 'BIP49 (P2SH-SegWit)' },
                                { prefix: 'zprv', hex: '0x04B2430C', type: '私钥', network: 'Mainnet', standard: 'BIP84 (Native SegWit)' },
                                { prefix: 'zpub', hex: '0x04B24746', type: '公钥', network: 'Mainnet', standard: 'BIP84 (Native SegWit)' },
                            ].map((item, i) => (
                                <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className={`font-mono font-bold text-lg ${item.type === '私钥' ? 'text-red-500' : 'text-green-500'}`}>
                                            {item.prefix}
                                        </span>
                                        <span className={`text-xs px-2 py-1 rounded ${isDarkMode ? 'bg-slate-800' : 'bg-slate-200'} ${mutedClass}`}>
                                            {item.hex}
                                        </span>
                                    </div>
                                    <div className={`text-sm ${mutedClass}`}>
                                        <div>{item.type} · {item.network}</div>
                                        <div className="text-xs mt-1">{item.standard}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* 硬化派生 vs 普通派生 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>硬化派生 vs 普通派生</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className={`p-4 rounded-xl border-2 border-orange-500/30 ${isDarkMode ? 'bg-orange-900/10' : 'bg-orange-50'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Lock className="w-5 h-5 text-orange-500" />
                                    <h4 className={`font-bold ${textClass}`}>硬化派生 (Hardened)</h4>
                                </div>
                                <ul className={`space-y-2 text-sm ${mutedClass}`}>
                                    <li>• 索引范围: 2³¹ ~ 2³² - 1</li>
                                    <li>• 表示方式: n' 或 n<sub>H</sub></li>
                                    <li>• 需要父私钥参与派生</li>
                                    <li>• 即使子私钥泄露，无法推断父密钥</li>
                                    <li className="text-orange-500">✓ 适用于账户级别以上的派生</li>
                                </ul>
                            </div>

                            <div className={`p-4 rounded-xl border-2 border-blue-500/30 ${isDarkMode ? 'bg-blue-900/10' : 'bg-blue-50'}`}>
                                <div className="flex items-center gap-2 mb-3">
                                    <Unlock className="w-5 h-5 text-blue-500" />
                                    <h4 className={`font-bold ${textClass}`}>普通派生 (Normal)</h4>
                                </div>
                                <ul className={`space-y-2 text-sm ${mutedClass}`}>
                                    <li>• 索引范围: 0 ~ 2³¹ - 1</li>
                                    <li>• 表示方式: n</li>
                                    <li>• 仅需父公钥即可派生子公钥</li>
                                    <li>• 支持观察钱包 (watch-only)</li>
                                    <li className="text-blue-500">✓ 适用于生成接收地址</li>
                                </ul>
                            </div>
                        </div>

                        <div className={`mt-4 p-4 rounded-xl ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border border-red-500/30`}>
                            <div className="flex items-start gap-2">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div>
                                    <p className={`font-medium ${textClass}`}>安全警告</p>
                                    <p className={`text-sm ${mutedClass}`}>
                                        如果使用普通派生，泄露父公钥 + 任意子私钥 = 可推算父私钥！
                                        这就是为什么账户级别以上必须使用硬化派生。
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 派生演示 */}
            {activeTab === 'derivation' && (
                <div className="space-y-6">
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>交互式密钥派生</h3>

                        {/* 主密钥显示 */}
                        <div className={`p-4 rounded-xl mb-4 ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium ${textClass}`}>主扩展私钥 (Master xprv)</span>
                                <button
                                    onClick={() => copyToClipboard(masterKey, 'master')}
                                    className={`p-1.5 rounded ${isDarkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-200'}`}
                                >
                                    {copiedKey === 'master' ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                            <code className={`text-xs break-all ${mutedClass}`}>{masterKey}</code>
                        </div>

                        {/* 派生路径输入 */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-6">
                            <div className="flex-1">
                                <label className={`block text-sm font-medium mb-2 ${textClass}`}>派生路径</label>
                                <input
                                    type="text"
                                    value={derivationPath}
                                    onChange={(e) => setDerivationPath(e.target.value)}
                                    className={`w-full px-4 py-2 rounded-lg font-mono ${
                                        isDarkMode
                                            ? 'bg-slate-900 border-slate-700 text-white'
                                            : 'bg-white border-slate-300 text-slate-800'
                                    } border`}
                                    placeholder="m/44'/0'/0'/0/0"
                                />
                            </div>
                            <div className="flex items-end gap-2">
                                <button
                                    onClick={() => simulateDerivation(derivationPath)}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    派生密钥
                                </button>
                                <button
                                    onClick={() => setShowPrivate(!showPrivate)}
                                    className={`p-2 rounded-lg ${isDarkMode ? 'bg-slate-700' : 'bg-slate-200'}`}
                                >
                                    {showPrivate ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* 预设路径 */}
                        <div className="flex flex-wrap gap-2 mb-6">
                            {[
                                { path: "m/44'/0'/0'/0/0", label: 'BIP44 Legacy' },
                                { path: "m/49'/0'/0'/0/0", label: 'BIP49 P2SH-SegWit' },
                                { path: "m/84'/0'/0'/0/0", label: 'BIP84 Native SegWit' },
                                { path: "m/86'/0'/0'/0/0", label: 'BIP86 Taproot' },
                            ].map((preset) => (
                                <button
                                    key={preset.path}
                                    onClick={() => {
                                        setDerivationPath(preset.path);
                                        simulateDerivation(preset.path);
                                    }}
                                    className={`px-3 py-1.5 rounded-lg text-sm ${
                                        derivationPath === preset.path
                                            ? 'bg-blue-600 text-white'
                                            : isDarkMode
                                                ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                                : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                                    }`}
                                >
                                    {preset.label}
                                </button>
                            ))}
                        </div>

                        {/* 派生结果 */}
                        {derivedKeys.length > 0 && (
                            <div className="space-y-3">
                                <h4 className={`font-medium ${textClass}`}>派生的地址 (索引 0-4)</h4>
                                {derivedKeys.map((key, i) => (
                                    <div key={i} className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`font-mono text-sm ${textClass}`}>{key.path}</span>
                                            <span className={`text-xs px-2 py-0.5 rounded ${
                                                key.hardened
                                                    ? 'bg-orange-500/20 text-orange-400'
                                                    : 'bg-blue-500/20 text-blue-400'
                                            }`}>
                                                {key.hardened ? '硬化' : '普通'}
                                            </span>
                                        </div>
                                        <div className="space-y-1 text-xs font-mono">
                                            <div className="flex items-center gap-2">
                                                <span className={mutedClass}>地址:</span>
                                                <span className="text-green-500 break-all">{key.address}</span>
                                                <button onClick={() => copyToClipboard(key.address, `addr-${i}`)}>
                                                    {copiedKey === `addr-${i}` ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={mutedClass}>公钥:</span>
                                                <span className="text-blue-400 break-all">{key.publicKey.substring(0, 32)}...</span>
                                            </div>
                                            {showPrivate && (
                                                <div className="flex items-center gap-2">
                                                    <span className={mutedClass}>私钥:</span>
                                                    <span className="text-red-400 break-all">{key.privateKey.substring(0, 32)}...</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 派生过程可视化 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>派生过程</h3>
                        <div className="flex flex-wrap items-center gap-2">
                            {derivationPath.split('/').map((part, i) => (
                                <React.Fragment key={i}>
                                    {i > 0 && <ChevronRight className={`w-4 h-4 ${mutedClass}`} />}
                                    <div className={`px-3 py-2 rounded-lg font-mono text-sm ${
                                        part === 'm'
                                            ? 'bg-purple-600 text-white'
                                            : part.includes("'")
                                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                                                : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                    }`}>
                                        {part}
                                    </div>
                                </React.Fragment>
                            ))}
                        </div>
                        <div className={`mt-4 text-sm ${mutedClass}`}>
                            <p>路径解析：</p>
                            <ul className="mt-2 space-y-1">
                                {derivationPath.split('/').map((part, i) => {
                                    const descriptions: Record<number, string> = {
                                        0: 'm = 主密钥 (Master Key)',
                                        1: `${part} = 目的 (Purpose): ${part.replace("'", '') === '44' ? 'BIP44 Legacy' : part.replace("'", '') === '49' ? 'BIP49 P2SH-SegWit' : part.replace("'", '') === '84' ? 'BIP84 Native SegWit' : part.replace("'", '') === '86' ? 'BIP86 Taproot' : '自定义'}`,
                                        2: `${part} = 币种 (Coin Type): ${part.replace("'", '') === '0' ? 'Bitcoin' : part.replace("'", '') === '1' ? 'Testnet' : '其他'}`,
                                        3: `${part} = 账户 (Account): 第 ${part.replace("'", '')} 个账户`,
                                        4: `${part} = 链 (Chain): ${part === '0' ? '外部 (接收)' : '内部 (找零)'}`,
                                        5: `${part} = 地址索引 (Index): 第 ${part} 个地址`,
                                    };
                                    return (
                                        <li key={i} className="flex items-center gap-2">
                                            <ArrowRight className="w-3 h-3" />
                                            {descriptions[i] || `${part} = 未知层级`}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* 标准路径 */}
            {activeTab === 'paths' && (
                <div className="space-y-6">
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>BIP44 标准路径格式</h3>
                        <div className={`p-4 rounded-xl font-mono text-center text-lg ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <span className="text-purple-400">m</span>
                            <span className={mutedClass}> / </span>
                            <span className="text-orange-400">purpose'</span>
                            <span className={mutedClass}> / </span>
                            <span className="text-blue-400">coin_type'</span>
                            <span className={mutedClass}> / </span>
                            <span className="text-green-400">account'</span>
                            <span className={mutedClass}> / </span>
                            <span className="text-yellow-400">change</span>
                            <span className={mutedClass}> / </span>
                            <span className="text-pink-400">address_index</span>
                        </div>
                    </div>

                    {/* 各 BIP 标准对比 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>地址类型标准对比</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className={isDarkMode ? 'bg-slate-900' : 'bg-slate-100'}>
                                        <th className={`p-3 text-left ${textClass}`}>标准</th>
                                        <th className={`p-3 text-left ${textClass}`}>Purpose</th>
                                        <th className={`p-3 text-left ${textClass}`}>地址类型</th>
                                        <th className={`p-3 text-left ${textClass}`}>前缀</th>
                                        <th className={`p-3 text-left ${textClass}`}>示例路径</th>
                                    </tr>
                                </thead>
                                <tbody className={mutedClass}>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-bold text-orange-400">BIP44</td>
                                        <td className="p-3 font-mono">44'</td>
                                        <td className="p-3">P2PKH (Legacy)</td>
                                        <td className="p-3 font-mono">1...</td>
                                        <td className="p-3 font-mono text-xs">m/44'/0'/0'/0/0</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-bold text-blue-400">BIP49</td>
                                        <td className="p-3 font-mono">49'</td>
                                        <td className="p-3">P2SH-P2WPKH (SegWit 兼容)</td>
                                        <td className="p-3 font-mono">3...</td>
                                        <td className="p-3 font-mono text-xs">m/49'/0'/0'/0/0</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-bold text-green-400">BIP84</td>
                                        <td className="p-3 font-mono">84'</td>
                                        <td className="p-3">P2WPKH (Native SegWit)</td>
                                        <td className="p-3 font-mono">bc1q...</td>
                                        <td className="p-3 font-mono text-xs">m/84'/0'/0'/0/0</td>
                                    </tr>
                                    <tr className={`border-t ${isDarkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                                        <td className="p-3 font-bold text-purple-400">BIP86</td>
                                        <td className="p-3 font-mono">86'</td>
                                        <td className="p-3">P2TR (Taproot)</td>
                                        <td className="p-3 font-mono">bc1p...</td>
                                        <td className="p-3 font-mono text-xs">m/86'/0'/0'/0/0</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 币种类型 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>常用币种类型 (SLIP-0044)</h3>
                        <div className="grid md:grid-cols-3 gap-4">
                            {[
                                { coin: 'Bitcoin', type: "0'", symbol: 'BTC' },
                                { coin: 'Testnet', type: "1'", symbol: 'tBTC' },
                                { coin: 'Litecoin', type: "2'", symbol: 'LTC' },
                                { coin: 'Dogecoin', type: "3'", symbol: 'DOGE' },
                                { coin: 'Ethereum', type: "60'", symbol: 'ETH' },
                                { coin: 'Bitcoin Cash', type: "145'", symbol: 'BCH' },
                            ].map((item, i) => (
                                <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                                    <div className="flex items-center justify-between">
                                        <span className={textClass}>{item.coin}</span>
                                        <span className={`font-mono text-sm ${mutedClass}`}>{item.type}</span>
                                    </div>
                                    <span className={`text-xs ${mutedClass}`}>{item.symbol}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* 安全考量 */}
            {activeTab === 'security' && (
                <div className="space-y-6">
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>安全最佳实践</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h4 className={`font-bold text-green-500`}>推荐做法</h4>
                                {[
                                    {
                                        title: '使用硬化派生保护账户',
                                        desc: '目的、币种、账户层级必须使用硬化派生'
                                    },
                                    {
                                        title: '定期轮换账户',
                                        desc: '创建新账户而不是继续在旧账户派生地址'
                                    },
                                    {
                                        title: '分离热钱包和冷钱包',
                                        desc: '使用不同的账户索引区分热/冷存储'
                                    },
                                    {
                                        title: '安全备份种子',
                                        desc: '离线存储助记词，支持恢复所有派生密钥'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-green-900/20' : 'bg-green-50'} border border-green-500/20`}>
                                        <div className="flex items-start gap-2">
                                            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className={`font-medium ${textClass}`}>{item.title}</p>
                                                <p className={`text-sm ${mutedClass}`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-4">
                                <h4 className={`font-bold text-red-500`}>避免做法</h4>
                                {[
                                    {
                                        title: '不要共享 xprv',
                                        desc: '扩展私钥可派生所有子私钥'
                                    },
                                    {
                                        title: '不要在非硬化层级共享 xpub',
                                        desc: '结合子私钥可推算父私钥'
                                    },
                                    {
                                        title: '不要跳过 Gap Limit',
                                        desc: '连续未使用地址超过20个时停止扫描'
                                    },
                                    {
                                        title: '不要重用地址',
                                        desc: '影响隐私且降低安全性'
                                    }
                                ].map((item, i) => (
                                    <div key={i} className={`p-3 rounded-lg ${isDarkMode ? 'bg-red-900/20' : 'bg-red-50'} border border-red-500/20`}>
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                                            <div>
                                                <p className={`font-medium ${textClass}`}>{item.title}</p>
                                                <p className={`text-sm ${mutedClass}`}>{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 观察钱包安全 */}
                    <div className={`rounded-2xl border ${cardClass} p-6`}>
                        <h3 className={`text-xl font-bold mb-4 ${textClass}`}>观察钱包 (Watch-Only Wallet)</h3>
                        <p className={`${mutedClass} mb-4`}>
                            通过共享 xpub（扩展公钥），可以创建只能查看余额和生成接收地址的观察钱包，
                            私钥保持离线存储。
                        </p>

                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
                            <div className="flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 text-center p-4 border-2 border-dashed border-green-500/30 rounded-xl">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-green-500" />
                                    </div>
                                    <p className={`font-medium ${textClass}`}>xpub (公开)</p>
                                    <p className={`text-xs ${mutedClass}`}>观察余额 + 生成地址</p>
                                </div>

                                <ArrowRight className={`w-8 h-8 ${mutedClass} rotate-90 md:rotate-0`} />

                                <div className="flex-1 text-center p-4 border-2 border-dashed border-red-500/30 rounded-xl">
                                    <div className="w-12 h-12 mx-auto mb-2 bg-red-500/20 rounded-full flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-red-500" />
                                    </div>
                                    <p className={`font-medium ${textClass}`}>xprv (离线)</p>
                                    <p className={`text-xs ${mutedClass}`}>签名交易 (冷存储)</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* 测验 */}
            {activeTab === 'quiz' && (
                <Quiz quizData={bip32Quiz} />
            )}
        </div>
    );
};

export default BIP32Demo;
