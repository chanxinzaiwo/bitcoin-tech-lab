import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Search } from 'lucide-react';

interface FAQItem {
    question: string;
    answer: string;
    category: string;
}

const faqData: FAQItem[] = [
    // ========== 基础概念 ==========
    {
        category: '基础概念',
        question: '什么是比特币？',
        answer: '比特币是一种去中心化的数字货币，由中本聪在 2009 年创建。它不依赖任何中央银行或政府，而是通过密码学和分布式网络来保证安全性和可靠性。比特币总量上限为 2100 万枚，通过"挖矿"产生，大约每 4 年产量减半。',
    },
    {
        category: '基础概念',
        question: '私钥和公钥有什么区别？',
        answer: '私钥是一个随机生成的 256 位数字，必须严格保密。公钥由私钥通过椭圆曲线加密 (ECC) 生成，可以公开分享。用私钥签名的交易，任何人都可以用公钥验证其真实性。私钥 → 公钥是单向函数，无法从公钥反推私钥。',
    },
    {
        category: '基础概念',
        question: '什么是 UTXO？',
        answer: 'UTXO (Unspent Transaction Output) 是未花费的交易输出。比特币没有"账户余额"的概念，你的余额其实是所有属于你的 UTXO 的总和。每次转账都是销毁旧的 UTXO，创建新的 UTXO。这种模型天然支持并行验证，提高了安全性。',
    },
    {
        category: '基础概念',
        question: '什么是区块和区块链？',
        answer: '区块是一批交易的打包记录，包含区块头（版本、前区块哈希、默克尔根、时间戳、难度目标、随机数）和交易列表。区块通过"前区块哈希"链接成链，篡改任何历史区块都会导致后续所有区块哈希失效，这就是区块链不可篡改的原理。',
    },
    {
        category: '基础概念',
        question: '比特币地址有哪几种类型？',
        answer: '主要有四种：1) Legacy (P2PKH)：以 1 开头，最古老的格式；2) P2SH：以 3 开头，支持脚本；3) Native SegWit (P2WPKH)：以 bc1q 开头，费用最低；4) Taproot (P2TR)：以 bc1p 开头，隐私性最好。推荐使用 bc1q 或 bc1p 地址。',
    },
    {
        category: '基础概念',
        question: '什么是助记词？',
        answer: '助记词是 12 或 24 个英文单词，用于备份和恢复钱包。它本质上是私钥的人类可读形式，遵循 BIP-39 标准。助记词 + 可选密码 → 种子 → HD 钱包的所有密钥。永远不要在网上输入、截图或告诉任何人你的助记词！',
    },
    {
        category: '基础概念',
        question: '什么是"聪"？',
        answer: '聪 (Satoshi, sat) 是比特币的最小单位，1 BTC = 1 亿聪。由于比特币价格较高，日常小额交易通常以聪为单位。闪电网络甚至支持毫聪 (millisatoshi)。聪以比特币创始人中本聪 (Satoshi Nakamoto) 命名。',
    },

    // ========== 交易相关 ==========
    {
        category: '交易相关',
        question: '为什么我的交易迟迟不确认？',
        answer: '交易确认速度取决于你设置的手续费。矿工优先打包高手续费的交易。如果网络拥堵，低手续费交易可能需要等待很长时间。你可以使用 RBF (Replace-By-Fee) 功能提高手续费来加速确认，或使用 CPFP (子付父) 方法。',
    },
    {
        category: '交易相关',
        question: '什么是找零地址？',
        answer: '当 UTXO 的金额大于你要转账的金额时，多余的部分会作为"找零"发送回你自己的地址。现代钱包通常会自动生成新的找零地址，以保护你的隐私。如果找零发回原地址，会暴露你控制多少资金。',
    },
    {
        category: '交易相关',
        question: '手续费是如何计算的？',
        answer: '比特币手续费按交易大小 (vBytes) 而非金额计算。费率以 sat/vB (聪/虚拟字节) 为单位。交易越复杂（输入/输出越多），体积越大，手续费越高。SegWit 和 Taproot 交易体积更小，费用更低。',
    },
    {
        category: '交易相关',
        question: '什么是 RBF 和 CPFP？',
        answer: 'RBF (Replace-By-Fee) 允许你用更高手续费的新交易替换未确认的旧交易。CPFP (Child-Pays-For-Parent) 是创建一笔花费未确认交易输出的子交易，用高手续费"拉"父交易一起被打包。两者都是加速交易的有效方法。',
    },
    {
        category: '交易相关',
        question: '什么是批量交易 (Batching)？',
        answer: '批量交易是将多笔付款合并到一笔交易中，只需支付一次基础费用。例如交易所提币时，可以把 100 个用户的提币请求合并成一笔交易。这能节省约 75% 的链上费用，也减少了区块空间占用。',
    },
    {
        category: '交易相关',
        question: '交易卡在内存池怎么办？',
        answer: '如果交易启用了 RBF，可以发送更高费率的替换交易。如果没有启用 RBF，可以使用 CPFP 方法。最坏情况下，等待约 2 周，内存池会清除过期交易，资金会"返回"（实际上从未离开你的钱包）。',
    },
    {
        category: '交易相关',
        question: '多少次确认才安全？',
        answer: '取决于交易金额：小额交易 1 次确认即可；中等金额建议 3 次；大额交易建议 6 次以上。6 次确认后，攻击者需要控制 51% 以上算力并消耗巨大成本才能撤销交易。对于交易所充值，通常要求 3-6 次确认。',
    },

    // ========== 钱包使用 ==========
    {
        category: '钱包使用',
        question: '热钱包和冷钱包有什么区别？',
        answer: '热钱包连接互联网，使用方便但有被黑客攻击的风险，适合存放小额日常使用的比特币。冷钱包（如硬件钱包、纸钱包）完全离线，安全性最高，适合长期存储大额资金。建议大部分资金放冷钱包，小部分放热钱包。',
    },
    {
        category: '钱包使用',
        question: '助记词丢失了怎么办？',
        answer: '如果助记词丢失但钱包还能访问，立即将所有资金转移到新钱包（有新助记词）。如果助记词丢失且钱包也无法访问，资金将永久丢失——这就是为什么必须安全备份助记词。建议用金属板刻录，防火防水。',
    },
    {
        category: '钱包使用',
        question: '为什么不建议使用脑钱包？',
        answer: '脑钱包用一句话或密码生成私钥。问题是：1) 人类选择的密码熵值太低，容易被暴力破解；2) 黑客持续扫描常见密码对应的地址；3) 记忆可能出错或遗忘。已有大量脑钱包被盗案例。请使用随机生成的助记词。',
    },
    {
        category: '钱包使用',
        question: '多签钱包如何设置？',
        answer: '多签钱包需要 M-of-N 个签名才能花费资金（如 2-of-3）。设置步骤：1) 准备 N 个独立设备/密钥；2) 使用支持多签的钱包软件创建钱包；3) 导入所有公钥；4) 生成多签地址；5) 分别保管各个密钥。适合企业或高净值用户。',
    },
    {
        category: '钱包使用',
        question: '什么是"只读钱包"？',
        answer: '只读钱包（Watch-only Wallet）只导入公钥或地址，可以查看余额和交易历史，但无法签名交易。常用于：1) 监控冷钱包余额；2) 创建交易后用硬件钱包签名；3) 在不安全设备上查看资金而不暴露私钥。',
    },

    // ========== 安全相关 ==========
    {
        category: '安全相关',
        question: '什么是 51% 攻击？',
        answer: '如果某个实体控制了全网 51% 以上的算力，理论上可以进行"双花"攻击——先用比特币购买商品，等商家发货后，重组区块链撤销这笔交易。但比特币网络算力巨大，51% 攻击成本高达数十亿美元，经济上极不划算。',
    },
    {
        category: '安全相关',
        question: '量子计算机会破解比特币吗？',
        answer: '理论上，拥有约 1500-3000 万个逻辑量子比特的量子计算机可以用 Shor 算法破解 ECC 加密。但目前最先进的量子计算机只有约 1000 个物理量子比特，距离威胁比特币还很遥远。社区已在研究 Lamport 签名等后量子方案。',
    },
    {
        category: '安全相关',
        question: '什么是粉尘攻击？',
        answer: '攻击者向大量地址发送极小金额（"粉尘"），当用户花费这些粉尘时，攻击者可以追踪交易，分析用户的地址关联和资金流向。防范方法：不要花费小额粉尘 UTXO，或使用 CoinJoin 混淆交易。',
    },
    {
        category: '安全相关',
        question: '什么是"$5 扳手攻击"？',
        answer: '这是一个讽刺说法：再强的加密技术，也挡不住有人拿扳手威胁你交出密码。安全不仅是技术问题，也是物理问题。建议：1) 使用多签分散风险；2) 设置"诱饵钱包"存小额资金；3) 保持低调，不公开持有量；4) 考虑时间锁保护。',
    },
    {
        category: '安全相关',
        question: '交易所存币有哪些风险？',
        answer: '交易所风险包括：1) 黑客攻击（Mt.Gox、FTX 等历史案例）；2) 平台跑路或破产；3) 政府冻结或监管；4) 内部人员作恶。记住："Not your keys, not your coins"。建议只在交易所存放交易所需的资金，大部分转到自己控制的钱包。',
    },
    {
        category: '安全相关',
        question: '如何防范钓鱼攻击？',
        answer: '1) 永远从官方渠道下载钱包软件；2) 仔细核对网址，警惕相似域名；3) 不要点击邮件/短信中的链接；4) 硬件钱包上确认交易详情；5) 任何人索要私钥/助记词都是骗子；6) 使用密码管理器避免输入到假网站。',
    },

    // ========== 网络与节点 ==========
    {
        category: '网络与节点',
        question: '运行全节点有什么好处？',
        answer: '全节点独立验证所有交易和区块，不信任任何第三方，是最安全的使用方式。好处：1) 完全隐私，无需向他人查询余额；2) 支持网络去中心化；3) 可以验证矿工是否遵守规则；4) 服务自己的 SPV 钱包和闪电节点。',
    },
    {
        category: '网络与节点',
        question: 'SPV 钱包安全吗？',
        answer: 'SPV (Simplified Payment Verification) 钱包只下载区块头，依赖全节点获取交易数据。安全性较低：1) 需要信任连接的节点；2) 可能被欺骗接受无效交易；3) 隐私较差（节点知道你查询哪些地址）。日常小额使用可以，大额建议用全节点。',
    },
    {
        category: '网络与节点',
        question: '比特币网络能承受多少 TPS？',
        answer: '比特币主链约 7 TPS（每秒交易数），区块大小限制约 4MB（SegWit 后）。这是有意的设计取舍：保持低门槛让普通人能运行全节点，维护去中心化。扩容通过第二层（如闪电网络）实现，闪电网络理论上可达每秒数百万笔交易。',
    },
    {
        category: '网络与节点',
        question: '什么是"区块战争"？',
        answer: '2015-2017 年关于如何扩容比特币的激烈辩论。一方支持直接增大区块大小（大区块派），另一方支持 SegWit + 闪电网络（小区块派）。最终 SegWit 激活，大区块派分叉创建了 BCH。这场战争确立了比特币"用户主权"的治理原则。',
    },
    {
        category: '网络与节点',
        question: '什么是内存池 (Mempool)？',
        answer: '内存池是节点存储未确认交易的地方。当你广播交易后，它先进入内存池，等待矿工打包。矿工按手续费率排序选择交易。你可以通过 mempool.space 等网站查看当前内存池状态和建议费率。',
    },

    // ========== 技术升级 ==========
    {
        category: '技术升级',
        question: '什么是 SegWit？',
        answer: 'SegWit (隔离见证) 是 2017 年的比特币升级，将签名数据从交易主体中分离出来。主要好处：1) 解决交易延展性问题；2) 有效区块容量提升约 70%；3) 降低交易费用；4) 为闪电网络铺平道路。目前约 80% 的交易使用 SegWit。',
    },
    {
        category: '技术升级',
        question: '什么是 Taproot？',
        answer: 'Taproot 是 2021 年激活的重大升级，引入了 Schnorr 签名和 MAST (默克尔抽象语法树)。主要好处：1) 多签交易在链上看起来与普通交易相同，增强隐私；2) 降低复杂脚本的费用；3) 为更高级的智能合约奠定基础。',
    },
    {
        category: '技术升级',
        question: '什么是闪电网络？',
        answer: '闪电网络是比特币的第二层扩容方案。用户可以开设支付通道，在链下进行无限次即时交易，只有开启和关闭通道时需要上链。特点：毫秒级确认、极低手续费（约 0.001%）、支持微支付。缺点：需要在线、通道容量有限。',
    },
    {
        category: '技术升级',
        question: 'Schnorr 签名有什么优势？',
        answer: 'Schnorr 签名相比 ECDSA：1) 线性特性，支持密钥聚合（多个签名合并为一个）；2) 批量验证更高效；3) 签名体积更小；4) 数学证明更简洁安全。Taproot 升级引入了 Schnorr，使多签交易费用降低且隐私提升。',
    },
    {
        category: '技术升级',
        question: '什么是时间锁？',
        answer: '时间锁让资金在特定时间或区块高度之前无法被花费。两种类型：1) CLTV (CheckLockTimeVerify)：绝对时间锁，如"2025年1月1日后才能花"；2) CSV (CheckSequenceVerify)：相对时间锁，如"从上笔交易确认后 144 个区块才能花"。用于闪电网络、遗产规划等。',
    },

    // ========== 投资与保管 ==========
    {
        category: '投资与保管',
        question: '如何安全地保管大额比特币？',
        answer: '建议方案：1) 使用知名品牌的硬件钱包（如 Ledger、Trezor、Coldcard）；2) 设置 2-of-3 或 3-of-5 多签；3) 助记词用金属板刻录，分地存放；4) 定期测试恢复流程；5) 考虑使用时间锁增加安全层；6) 保持低调，不公开持有量。',
    },
    {
        category: '投资与保管',
        question: '继承人如何获取我的比特币？',
        answer: '比特币遗产规划方案：1) 律师托管密封的助记词，附解锁说明；2) 使用 Shamir 秘密共享，将助记词分成多份；3) 设置时间锁多签，本人不操作一段时间后继承人可解锁；4) 使用专业的数字遗产服务。重要：确保继承人理解如何使用。',
    },
    {
        category: '投资与保管',
        question: '比特币有避税功能吗？',
        answer: '比特币交易在大多数国家需要纳税。虽然链上交易是匿名的，但交易所有 KYC 记录，税务机关可以追踪。出入金、交易盈利、挖矿收入通常都有税务义务。建议咨询当地税务专业人士，合法合规地进行税务申报。',
    },
    {
        category: '投资与保管',
        question: '什么是 DCA 定投策略？',
        answer: 'DCA (Dollar-Cost Averaging) 是定期定额投资策略：不论价格高低，每周/每月固定买入一定金额的比特币。优点：1) 平滑波动，降低择时风险；2) 养成储蓄习惯；3) 心理压力小。适合长期投资者，避免一次性买在高点。',
    },
];

interface FAQProps {
    isDarkMode: boolean;
}

const FAQ: React.FC<FAQProps> = ({ isDarkMode }) => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    const categories = [...new Set(faqData.map((item) => item.category))];

    const filteredFAQ = faqData.filter((item) => {
        const matchesSearch =
            item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.answer.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !selectedCategory || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className={`p-6 rounded-2xl border ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3 mb-6">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isDarkMode ? 'bg-blue-500/20' : 'bg-blue-100'}`}>
                    <HelpCircle className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                    <h3 className={`font-bold text-lg ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>常见问题</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>快速了解比特币核心概念</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                <input
                    type="text"
                    placeholder="搜索问题..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                        isDarkMode
                            ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500 focus:border-blue-500'
                            : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:border-blue-500'
                    }`}
                />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-4">
                <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                        !selectedCategory
                            ? 'bg-blue-500 text-white'
                            : isDarkMode
                            ? 'bg-slate-800 text-slate-400 hover:text-white'
                            : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                    }`}
                >
                    全部
                </button>
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                            selectedCategory === cat
                                ? 'bg-blue-500 text-white'
                                : isDarkMode
                                ? 'bg-slate-800 text-slate-400 hover:text-white'
                                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* FAQ List */}
            <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {filteredFAQ.map((item, index) => (
                    <div
                        key={index}
                        className={`rounded-xl border overflow-hidden transition-colors ${
                            isDarkMode ? 'border-slate-800' : 'border-slate-200'
                        }`}
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            className={`w-full flex items-center justify-between p-4 text-left transition-colors ${
                                isDarkMode ? 'hover:bg-slate-800/50' : 'hover:bg-slate-50'
                            }`}
                        >
                            <span className={`font-medium text-sm pr-4 ${isDarkMode ? 'text-slate-200' : 'text-slate-800'}`}>
                                {item.question}
                            </span>
                            {openIndex === index ? (
                                <ChevronUp className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            ) : (
                                <ChevronDown className={`w-4 h-4 shrink-0 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                            )}
                        </button>
                        {openIndex === index && (
                            <div className={`px-4 pb-4 text-sm leading-relaxed ${isDarkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                                {item.answer}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {filteredFAQ.length === 0 && (
                <div className={`text-center py-8 ${isDarkMode ? 'text-slate-500' : 'text-slate-400'}`}>
                    没有找到相关问题
                </div>
            )}
        </div>
    );
};

export default FAQ;
