import React, { useState } from 'react';
import {
    History, Calendar, GitBranch, AlertTriangle, TrendingUp,
    Users, Shield, Zap, ChevronRight, ExternalLink, Award
} from 'lucide-react';
import { useLab } from '../store/LabContext';

// Types
interface HistoryEvent {
    date: string;
    title: string;
    description: string;
    category: 'genesis' | 'technical' | 'controversy' | 'adoption' | 'security';
    importance: 1 | 2 | 3;
    details?: string[];
}

const BitcoinHistoryDemo = () => {
    const { isDarkMode } = useLab();
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [expandedEvent, setExpandedEvent] = useState<number | null>(null);

    const categories = [
        { id: 'genesis', label: '起源', icon: Award, color: 'text-amber-500' },
        { id: 'technical', label: '技术升级', icon: Zap, color: 'text-blue-500' },
        { id: 'controversy', label: '争议事件', icon: AlertTriangle, color: 'text-red-500' },
        { id: 'adoption', label: '应用发展', icon: TrendingUp, color: 'text-emerald-500' },
        { id: 'security', label: '安全事件', icon: Shield, color: 'text-purple-500' },
    ];

    const historyEvents: HistoryEvent[] = [
        {
            date: '2008-10-31',
            title: '比特币白皮书发布',
            description: '中本聪在密码学邮件列表发布《比特币：一种点对点电子现金系统》白皮书',
            category: 'genesis',
            importance: 3,
            details: [
                '白皮书仅 9 页，解决了"双花问题"',
                '首次提出工作量证明 + 区块链的组合',
                '中本聪的真实身份至今成谜',
            ],
        },
        {
            date: '2009-01-03',
            title: '创世区块诞生',
            description: '比特币网络启动，创世区块被挖出，包含《泰晤士报》头条：\"Chancellor on brink of second bailout for banks\"',
            category: 'genesis',
            importance: 3,
            details: [
                '创世区块奖励 50 BTC，因代码问题无法花费',
                '嵌入的新闻标题暗示比特币诞生的背景',
                '标志着人类首个去中心化货币的诞生',
            ],
        },
        {
            date: '2009-01-12',
            title: '第一笔比特币交易',
            description: '中本聪向 Hal Finney 发送 10 BTC，这是历史上第一笔比特币转账',
            category: 'genesis',
            importance: 2,
            details: [
                'Hal Finney 是著名密码学家，PGP 开发者之一',
                '他是比特币最早的支持者和贡献者',
                '2014 年因渐冻症去世，遗体进行了冷冻保存',
            ],
        },
        {
            date: '2010-05-22',
            title: '比特币披萨日',
            description: 'Laszlo Hanyecz 用 10,000 BTC 购买两个披萨，首次用比特币购买实物',
            category: 'adoption',
            importance: 2,
            details: [
                '这是比特币首次被用于购买实物商品',
                '按当时价格约 $41，现价值数亿美元',
                '每年 5 月 22 日被称为"比特币披萨日"',
            ],
        },
        {
            date: '2010-08-15',
            title: '价值溢出漏洞',
            description: '黑客利用整数溢出漏洞凭空创造 1844 亿 BTC，社区紧急回滚区块链',
            category: 'security',
            importance: 3,
            details: [
                '这是比特币历史上最严重的安全事件',
                '在 5 小时内被发现并通过软分叉修复',
                '涉及的区块被回滚，攻击无效',
                '此后再未发生类似严重漏洞',
            ],
        },
        {
            date: '2011-02-09',
            title: '比特币首次达到 $1',
            description: '比特币价格首次达到 1 美元，市值约 100 万美元',
            category: 'adoption',
            importance: 1,
        },
        {
            date: '2011-04-23',
            title: '中本聪最后的消息',
            description: '中本聪发送最后一封已知邮件，之后彻底消失',
            category: 'genesis',
            importance: 2,
            details: [
                '邮件提到他已转向其他事情',
                '将项目交给 Gavin Andresen 等人',
                '此后再无中本聪的公开消息',
            ],
        },
        {
            date: '2011-06-19',
            title: 'Mt.Gox 首次被黑',
            description: '当时最大的比特币交易所 Mt.Gox 遭黑客攻击，价格一度跌至 $0.01',
            category: 'security',
            importance: 2,
        },
        {
            date: '2012-11-28',
            title: '第一次减半',
            description: '比特币迎来首次减半，区块奖励从 50 BTC 降至 25 BTC',
            category: 'technical',
            importance: 3,
            details: [
                '减半时价格约 $12',
                '此后一年内价格涨至 $1000+',
                '验证了比特币货币政策的可行性',
            ],
        },
        {
            date: '2013-10-01',
            title: '丝绸之路被关闭',
            description: 'FBI 关闭暗网市场丝绸之路，逮捕创始人，没收约 17 万 BTC',
            category: 'controversy',
            importance: 2,
            details: [
                '丝绸之路是最早大规模使用比特币的地下市场',
                '创始人 Ross Ulbricht 被判终身监禁',
                '没收的比特币后被美国政府拍卖',
            ],
        },
        {
            date: '2014-02-24',
            title: 'Mt.Gox 破产',
            description: 'Mt.Gox 宣布破产，损失约 85 万 BTC，为当时最大的加密货币盗窃案',
            category: 'security',
            importance: 3,
            details: [
                '约占当时流通比特币的 7%',
                'CEO Mark Karpelès 后被逮捕',
                '事件推动了交易所安全标准的提升',
                '\"Not your keys, not your coins\" 成为格言',
            ],
        },
        {
            date: '2015-01-26',
            title: 'Coinbase 获得纽约州牌照',
            description: 'Coinbase 成为首家获得美国州级合规牌照的比特币交易所',
            category: 'adoption',
            importance: 1,
        },
        {
            date: '2015-12-07',
            title: 'SegWit 提案发布',
            description: 'BIP-141 提出隔离见证方案，引发长达两年的扩容争论',
            category: 'technical',
            importance: 2,
        },
        {
            date: '2016-07-09',
            title: '第二次减半',
            description: '区块奖励从 25 BTC 降至 12.5 BTC',
            category: 'technical',
            importance: 2,
            details: [
                '减半时价格约 $650',
                '2017 年底涨至近 $20,000',
                '催生了 2017 年牛市',
            ],
        },
        {
            date: '2017-08-01',
            title: 'BCH 分叉',
            description: '比特币现金 (BCH) 从比特币分叉，区块大小扩至 8MB',
            category: 'controversy',
            importance: 3,
            details: [
                '这是比特币最重大的社区分裂',
                '大区块派 vs 小区块派的最终决裂',
                '所有 BTC 持有者获得等量 BCH',
                'BCH 后续又分叉出 BSV',
            ],
        },
        {
            date: '2017-08-24',
            title: 'SegWit 激活',
            description: '隔离见证在主网激活，解决交易延展性问题，为闪电网络铺路',
            category: 'technical',
            importance: 3,
            details: [
                '通过用户激活软分叉 (UASF) 推动',
                '证明了用户而非矿工掌握最终决定权',
                '有效区块容量提升约 70%',
            ],
        },
        {
            date: '2017-12-17',
            title: '比特币达到近 $20,000',
            description: '比特币价格首次接近 2 万美元，总市值超过 3000 亿美元',
            category: 'adoption',
            importance: 2,
        },
        {
            date: '2018-01-26',
            title: 'Coincheck 被盗',
            description: '日本交易所 Coincheck 被盗 5.3 亿美元的 NEM，非比特币但影响整个行业',
            category: 'security',
            importance: 1,
        },
        {
            date: '2018-03-15',
            title: '闪电网络主网上线',
            description: 'Lightning Labs 发布 lnd 0.4，闪电网络正式在比特币主网运行',
            category: 'technical',
            importance: 2,
            details: [
                '实现了比特币的即时小额支付',
                '理论上可支持每秒数百万笔交易',
                '开启了比特币作为支付手段的新时代',
            ],
        },
        {
            date: '2020-05-11',
            title: '第三次减半',
            description: '区块奖励从 12.5 BTC 降至 6.25 BTC',
            category: 'technical',
            importance: 2,
            details: [
                '减半时价格约 $8,500',
                '一年后涨至 $60,000+',
                'DeFi 和机构入场推动新一轮牛市',
            ],
        },
        {
            date: '2020-08-11',
            title: 'MicroStrategy 首次购入比特币',
            description: 'MicroStrategy 宣布购入 2.5 亿美元比特币作为储备资产，开启机构入场潮',
            category: 'adoption',
            importance: 2,
            details: [
                '这是首家上市公司将比特币作为主要储备',
                'CEO Michael Saylor 成为比特币布道者',
                '该公司持续增持，持有超过 15 万 BTC',
            ],
        },
        {
            date: '2021-02-08',
            title: '特斯拉购入比特币',
            description: '特斯拉宣布购入 15 亿美元比特币，并计划接受比特币付款',
            category: 'adoption',
            importance: 2,
        },
        {
            date: '2021-06-09',
            title: '萨尔瓦多将比特币定为法币',
            description: '萨尔瓦多成为全球首个将比特币定为法定货币的国家',
            category: 'adoption',
            importance: 3,
            details: [
                '所有商家必须接受比特币支付',
                '政府推出官方钱包 Chivo',
                '开创了国家采用比特币的先例',
            ],
        },
        {
            date: '2021-11-14',
            title: 'Taproot 激活',
            description: 'Taproot 升级在区块 709,632 激活，引入 Schnorr 签名和 MAST',
            category: 'technical',
            importance: 3,
            details: [
                '四年来比特币最重大的技术升级',
                '大幅增强隐私性和脚本能力',
                '为未来智能合约发展奠定基础',
            ],
        },
        {
            date: '2022-11-11',
            title: 'FTX 崩盘',
            description: 'FTX 交易所申请破产，创始人 SBF 被捕，损失数十亿美元用户资金',
            category: 'security',
            importance: 3,
            details: [
                '史上最大的加密货币欺诈案之一',
                'SBF 被判 25 年监禁',
                '再次证明了自托管的重要性',
                '推动了监管讨论',
            ],
        },
        {
            date: '2024-01-10',
            title: '美国批准比特币现货 ETF',
            description: 'SEC 批准 11 支比特币现货 ETF，包括贝莱德、富达等巨头',
            category: 'adoption',
            importance: 3,
            details: [
                '结束了十年的 ETF 申请之路',
                '首日交易量超过 46 亿美元',
                '为机构投资者提供了合规入口',
                '被视为比特币主流化的里程碑',
            ],
        },
        {
            date: '2024-04-20',
            title: '第四次减半',
            description: '区块奖励从 6.25 BTC 降至 3.125 BTC',
            category: 'technical',
            importance: 2,
            details: [
                '减半时价格约 $64,000',
                '已有超过 93% 的比特币被挖出',
                '距最后一个比特币被挖出还有约 116 年',
            ],
        },
    ];

    const filteredEvents = selectedCategory
        ? historyEvents.filter(e => e.category === selectedCategory)
        : historyEvents;

    const getCategoryColor = (category: string) => {
        const cat = categories.find(c => c.id === category);
        return cat?.color || 'text-slate-500';
    };

    const getCategoryBg = (category: string) => {
        switch (category) {
            case 'genesis': return isDarkMode ? 'bg-amber-500/20' : 'bg-amber-50';
            case 'technical': return isDarkMode ? 'bg-blue-500/20' : 'bg-blue-50';
            case 'controversy': return isDarkMode ? 'bg-red-500/20' : 'bg-red-50';
            case 'adoption': return isDarkMode ? 'bg-emerald-500/20' : 'bg-emerald-50';
            case 'security': return isDarkMode ? 'bg-purple-500/20' : 'bg-purple-50';
            default: return isDarkMode ? 'bg-slate-800' : 'bg-slate-100';
        }
    };

    return (
        <div className={`min-h-screen ${isDarkMode ? 'bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-800'} font-sans`}>
            {/* Navigation */}
            <nav className={`shadow-sm border-b sticky top-0 z-40 ${isDarkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
                <div className="max-w-6xl mx-auto px-4 h-16 flex items-center gap-2">
                    <div className="bg-indigo-600 text-white p-1.5 rounded-full">
                        <History className="h-6 w-6" />
                    </div>
                    <span className="font-bold text-xl tracking-tight">比特币历史</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in">

                {/* Intro */}
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-2xl p-8 text-white shadow-xl">
                    <h2 className="text-3xl font-bold mb-4 flex items-center gap-2">
                        <History className="w-8 h-8" /> 比特币发展史
                    </h2>
                    <p className="text-indigo-100 text-lg leading-relaxed max-w-3xl">
                        从 2008 年白皮书发布到今天，比特币经历了无数次考验：技术升级、安全事件、社区分裂、监管挑战...
                        了解这段历史，才能更好地理解比特币的价值和韧性。
                    </p>
                </div>

                {/* Category Filter */}
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setSelectedCategory(null)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                            !selectedCategory
                                ? 'bg-indigo-500 text-white'
                                : isDarkMode
                                ? 'bg-slate-800 text-slate-400 hover:text-white'
                                : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                        }`}
                    >
                        全部事件
                    </button>
                    {categories.map(cat => (
                        <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all ${
                                selectedCategory === cat.id
                                    ? 'bg-indigo-500 text-white'
                                    : isDarkMode
                                    ? 'bg-slate-800 text-slate-400 hover:text-white'
                                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                            }`}
                        >
                            <cat.icon className={`w-4 h-4 ${selectedCategory === cat.id ? 'text-white' : cat.color}`} />
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Timeline */}
                <div className="relative">
                    {/* Timeline line */}
                    <div className={`absolute left-[19px] top-0 bottom-0 w-0.5 ${isDarkMode ? 'bg-slate-700' : 'bg-slate-300'}`} />

                    <div className="space-y-4">
                        {filteredEvents.map((event, index) => {
                            const CategoryIcon = categories.find(c => c.id === event.category)?.icon || Calendar;
                            const isExpanded = expandedEvent === index;

                            return (
                                <div key={index} className="relative pl-12">
                                    {/* Timeline dot */}
                                    <div className={`absolute left-0 w-10 h-10 rounded-full flex items-center justify-center ${getCategoryBg(event.category)} border-2 ${isDarkMode ? 'border-slate-800' : 'border-white'}`}>
                                        <CategoryIcon className={`w-5 h-5 ${getCategoryColor(event.category)}`} />
                                    </div>

                                    {/* Event card */}
                                    <div
                                        className={`p-4 rounded-xl border cursor-pointer transition-all hover:shadow-lg ${
                                            isDarkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-slate-300'
                                        } ${event.importance === 3 ? 'ring-2 ring-indigo-500/30' : ''}`}
                                        onClick={() => setExpandedEvent(isExpanded ? null : index)}
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`text-sm font-mono ${isDarkMode ? 'text-slate-500' : 'text-slate-500'}`}>
                                                        {event.date}
                                                    </span>
                                                    {event.importance === 3 && (
                                                        <span className="px-2 py-0.5 bg-indigo-500 text-white text-xs rounded-full">
                                                            重要
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                                    {event.title}
                                                </h4>
                                                <p className={`text-sm mt-1 ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {event.description}
                                                </p>
                                            </div>
                                            {event.details && (
                                                <ChevronRight className={`w-5 h-5 transition-transform ${isExpanded ? 'rotate-90' : ''} ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                                            )}
                                        </div>

                                        {/* Expanded details */}
                                        {isExpanded && event.details && (
                                            <div className={`mt-4 pt-4 border-t ${isDarkMode ? 'border-slate-800' : 'border-slate-200'}`}>
                                                <ul className={`space-y-2 text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                                    {event.details.map((detail, i) => (
                                                        <li key={i} className="flex items-start gap-2">
                                                            <span className="text-indigo-500 mt-1">•</span>
                                                            {detail}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Key Lessons */}
                <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                    <h3 className={`font-bold text-lg mb-4 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                        历史的教训
                    </h3>

                    <div className="grid md:grid-cols-3 gap-4">
                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <Shield className="w-8 h-8 text-purple-500 mb-2" />
                            <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                自托管至关重要
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                Mt.Gox、FTX 等事件反复证明：把币留在交易所就是把信任交给他人。
                            </p>
                        </div>

                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <Users className="w-8 h-8 text-emerald-500 mb-2" />
                            <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                用户主权
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                2017 年 SegWit 激活证明，运行全节点的用户才是比特币的最终裁决者。
                            </p>
                        </div>

                        <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-slate-800' : 'bg-slate-100'}`}>
                            <TrendingUp className="w-8 h-8 text-amber-500 mb-2" />
                            <h4 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                                长期视角
                            </h4>
                            <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                经历无数次"死亡"预言，比特币依然运行。理解其价值需要长期视角。
                            </p>
                        </div>
                    </div>
                </div>

            </main>
        </div>
    );
};

export default BitcoinHistoryDemo;
