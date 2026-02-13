import { QuizData } from '../components/Quiz';

// ECC 加密原理测验
export const eccQuiz: QuizData = {
    moduleId: 'ecc',
    moduleName: 'ECC 加密原理',
    questions: [
        {
            id: 'ecc_1',
            type: 'single',
            question: '比特币使用的椭圆曲线是哪一条？',
            options: ['secp256k1', 'secp256r1', 'Curve25519', 'P-384'],
            correctAnswers: [0],
            explanation: '比特币使用 secp256k1 曲线，这是 Koblitz 曲线的一种，其参数选择使得运算效率更高。secp256r1 是 NIST 推荐的曲线，常用于 TLS。',
            difficulty: 'easy'
        },
        {
            id: 'ecc_2',
            type: 'single',
            question: '在椭圆曲线密码学中，私钥是什么？',
            options: ['曲线上的一个点', '一个随机的大整数', '两个点的和', '公钥的哈希值'],
            correctAnswers: [1],
            explanation: '私钥是一个随机选择的大整数（256位），公钥则是通过将生成元点 G 与私钥相乘（标量乘法）得到的曲线上的点。',
            difficulty: 'easy'
        },
        {
            id: 'ecc_3',
            type: 'single',
            question: '为什么从公钥无法反推出私钥？',
            options: [
                '因为使用了哈希函数',
                '因为椭圆曲线离散对数问题（ECDLP）是计算困难的',
                '因为私钥是加密存储的',
                '因为公钥比私钥长'
            ],
            correctAnswers: [1],
            explanation: '椭圆曲线离散对数问题（ECDLP）是计算上不可行的。给定点 P 和 Q = kP，在没有已知高效算法的情况下无法求出标量 k。',
            difficulty: 'medium'
        },
        {
            id: 'ecc_4',
            type: 'single',
            question: 'ECC 相比 RSA 的主要优势是什么？',
            options: [
                '使用更简单的数学',
                '在相同安全级别下密钥更短',
                '发明时间更早',
                '不需要随机数'
            ],
            correctAnswers: [1],
            explanation: '256位的 ECC 密钥提供的安全性约等于3072位的 RSA 密钥。更短的密钥意味着更小的存储空间和更快的计算速度。',
            difficulty: 'easy'
        },
        {
            id: 'ecc_5',
            type: 'trueFalse',
            question: '椭圆曲线上的"加法"运算遵循我们日常的算术加法规则。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '椭圆曲线上的"加法"是一种特殊定义的几何运算：两点相加是通过这两点画一条直线，找到第三个交点，再关于x轴对称得到。这与普通算术加法完全不同。',
            difficulty: 'medium'
        }
    ]
};

// HD 钱包测验
export const hdWalletQuiz: QuizData = {
    moduleId: 'hdwallet',
    moduleName: 'HD 钱包',
    questions: [
        {
            id: 'hd_1',
            type: 'single',
            question: 'BIP-39 标准定义了什么？',
            options: [
                '比特币地址格式',
                '助记词（种子词）的生成规范',
                '交易签名算法',
                '区块结构'
            ],
            correctAnswers: [1],
            explanation: 'BIP-39 定义了如何将随机熵转换为人类可读的助记词（通常是12或24个单词），以及如何从助记词派生种子。',
            difficulty: 'easy'
        },
        {
            id: 'hd_2',
            type: 'single',
            question: 'HD 钱包中的 "H" 代表什么？',
            options: ['Hash', 'Hierarchical', 'Hardware', 'Hidden'],
            correctAnswers: [1],
            explanation: 'HD 代表 Hierarchical Deterministic（分层确定性）。这种钱包可以从单一种子派生出树状结构的密钥对。',
            difficulty: 'easy'
        },
        {
            id: 'hd_3',
            type: 'single',
            question: '标准的 BIP-44 派生路径格式是什么？',
            options: [
                'm/44\'/coin\'/account\'/change/index',
                'm/purpose/coin/account',
                'seed/master/child',
                'root/branch/leaf'
            ],
            correctAnswers: [0],
            explanation: 'BIP-44 定义了路径格式 m/44\'/coin_type\'/account\'/change/address_index，其中 44\' 表示使用 BIP-44 标准，coin_type 0 表示比特币主网。',
            difficulty: 'medium'
        },
        {
            id: 'hd_4',
            type: 'multiple',
            question: '以下哪些是安全备份助记词的正确做法？（多选）',
            options: [
                '用纸笔抄写并妥善保管',
                '存储在云端便于访问',
                '使用金属板刻录',
                '分成多份存放在不同位置'
            ],
            correctAnswers: [0, 2, 3],
            explanation: '助记词应该离线备份，纸质或金属板都可以。分散存储（如 Shamir 秘密分享）可以增加安全性。永远不要将助记词存储在联网设备或云端！',
            difficulty: 'medium'
        },
        {
            id: 'hd_5',
            type: 'single',
            question: '硬化派生（Hardened Derivation）的主要目的是什么？',
            options: [
                '让派生速度更快',
                '防止从子公钥反推父私钥',
                '减少存储空间',
                '支持更多币种'
            ],
            correctAnswers: [1],
            explanation: '硬化派生使用父私钥而非父公钥来派生子密钥，这样即使子私钥泄露，也无法结合父公钥反推出父私钥或其他子私钥。',
            difficulty: 'hard'
        }
    ]
};

// UTXO 模型测验
export const utxoQuiz: QuizData = {
    moduleId: 'utxo',
    moduleName: 'UTXO 模型',
    questions: [
        {
            id: 'utxo_1',
            type: 'single',
            question: 'UTXO 代表什么？',
            options: [
                'Unspent Transaction Output（未花费交易输出）',
                'Universal Transaction Order',
                'User Transaction Object',
                'Unified Token Exchange Output'
            ],
            correctAnswers: [0],
            explanation: 'UTXO 是 Unspent Transaction Output 的缩写，代表"未花费的交易输出"。比特币的"余额"实际上是你能控制的所有 UTXO 的总和。',
            difficulty: 'easy'
        },
        {
            id: 'utxo_2',
            type: 'single',
            question: '在 UTXO 模型中，如何"找零"？',
            options: [
                '系统自动退还多余金额',
                '创建一个新的 UTXO 发回给自己',
                '余额保留在原 UTXO 中',
                '多余金额自动成为矿工费'
            ],
            correctAnswers: [1],
            explanation: '在 UTXO 模型中，你必须花费整个 UTXO。如果需要找零，你要创建一个新的输出（UTXO）发送回自己的地址。输入总额减去所有输出总额的差额成为矿工费。',
            difficulty: 'easy'
        },
        {
            id: 'utxo_3',
            type: 'trueFalse',
            question: '一笔比特币交易可以有多个输入和多个输出。',
            options: ['正确', '错误'],
            correctAnswers: [0],
            explanation: '比特币交易可以包含多个输入（消耗多个 UTXO）和多个输出（创建多个新 UTXO），这使得批量支付和合并资金成为可能。',
            difficulty: 'easy'
        },
        {
            id: 'utxo_4',
            type: 'single',
            question: 'UTXO 模型相比账户模型的主要优势是什么？',
            options: [
                '更容易计算余额',
                '隐私性更好，便于并行验证',
                '交易费用更低',
                '支持更多功能'
            ],
            correctAnswers: [1],
            explanation: 'UTXO 模型天然支持交易的并行验证（不同 UTXO 相互独立），且每次交易可以使用新地址，提供更好的隐私性。而账户模型中，同一账户的交易必须串行处理。',
            difficulty: 'medium'
        },
        {
            id: 'utxo_5',
            type: 'single',
            question: '什么是"粉尘"（Dust）UTXO？',
            options: [
                '被盗的 UTXO',
                '金额太小，花费它的手续费超过其价值的 UTXO',
                '未确认的 UTXO',
                '来自挖矿的 UTXO'
            ],
            correctAnswers: [1],
            explanation: '粉尘 UTXO 是指金额非常小的 UTXO，花费它们所需的手续费甚至超过了它们本身的价值。比特币网络有粉尘限制（约 546 聪）来防止大量创建粉尘 UTXO。',
            difficulty: 'medium'
        }
    ]
};

// 比特币脚本测验
export const scriptQuiz: QuizData = {
    moduleId: 'script',
    moduleName: '比特币脚本',
    questions: [
        {
            id: 'script_1',
            type: 'single',
            question: '比特币脚本语言是图灵完备的吗？',
            options: [
                '是的',
                '不是',
                '取决于交易类型',
                '只有 Taproot 脚本是'
            ],
            correctAnswers: [1],
            explanation: '比特币脚本故意设计为非图灵完备的，它没有循环结构。这是为了安全性考虑，确保每个脚本都会在有限步骤内终止，防止拒绝服务攻击。',
            difficulty: 'easy'
        },
        {
            id: 'script_2',
            type: 'single',
            question: 'P2PKH 脚本中的 OP_DUP 操作做什么？',
            options: [
                '删除栈顶元素',
                '复制栈顶元素',
                '交换栈顶两个元素',
                '对栈顶元素哈希'
            ],
            correctAnswers: [1],
            explanation: 'OP_DUP 复制栈顶元素。在 P2PKH 脚本中，它复制公钥，这样一份用于验证地址哈希，另一份保留用于后续的签名验证。',
            difficulty: 'easy'
        },
        {
            id: 'script_3',
            type: 'single',
            question: 'P2SH (Pay to Script Hash) 的主要优点是什么？',
            options: [
                '交易费用更低',
                '发送方无需知道复杂脚本的细节',
                '不需要签名',
                '支持无限大的脚本'
            ],
            correctAnswers: [1],
            explanation: 'P2SH 允许发送方只需向一个脚本哈希发送资金，而不需要知道实际的解锁条件。复杂脚本（如多签）的细节只在花费时才揭示。',
            difficulty: 'medium'
        },
        {
            id: 'script_4',
            type: 'single',
            question: '在 2-of-3 多签脚本中，需要多少个签名才能花费资金？',
            options: ['1个', '2个', '3个', '任意数量'],
            correctAnswers: [1],
            explanation: '2-of-3 多签意味着 3 个公钥中需要 2 个对应的私钥签名才能花费。这常用于需要多方授权的场景，如公司资金管理。',
            difficulty: 'easy'
        },
        {
            id: 'script_5',
            type: 'single',
            question: 'OP_CHECKSIG 操作验证什么？',
            options: [
                '交易金额',
                '签名与公钥是否匹配',
                '区块高度',
                '网络状态'
            ],
            correctAnswers: [1],
            explanation: 'OP_CHECKSIG 从栈中取出签名和公钥，验证签名是否是用对应私钥对交易数据签署的。如果验证通过返回 TRUE，否则返回 FALSE。',
            difficulty: 'easy'
        }
    ]
};

// 闪电网络测验
export const lightningQuiz: QuizData = {
    moduleId: 'lightning',
    moduleName: '闪电网络',
    questions: [
        {
            id: 'ln_1',
            type: 'single',
            question: '闪电网络是比特币的第几层解决方案？',
            options: ['Layer 0', 'Layer 1', 'Layer 2', 'Layer 3'],
            correctAnswers: [2],
            explanation: '闪电网络是比特币的 Layer 2 解决方案。Layer 1 是比特币主链，Layer 2 是建立在主链之上的协议，继承主链的安全性同时提供更快的支付。',
            difficulty: 'easy'
        },
        {
            id: 'ln_2',
            type: 'single',
            question: 'HTLC 代表什么？',
            options: [
                'Hash Time-Locked Contract',
                'High Transaction Limit Channel',
                'Hybrid Transfer Layer Chain',
                'Hash Transfer Lock Code'
            ],
            correctAnswers: [0],
            explanation: 'HTLC 是 Hash Time-Locked Contract（哈希时间锁合约）的缩写，它是闪电网络实现多跳原子支付的核心技术。',
            difficulty: 'easy'
        },
        {
            id: 'ln_3',
            type: 'single',
            question: '开启一个闪电网络通道需要什么？',
            options: [
                '向矿工支付特殊费用',
                '在链上创建一笔多签交易',
                '运行特殊的挖矿软件',
                '获得网络许可'
            ],
            correctAnswers: [1],
            explanation: '开启闪电通道需要创建一笔链上的 2-of-2 多签交易（Funding Transaction），将资金锁入一个双方共同控制的地址。',
            difficulty: 'medium'
        },
        {
            id: 'ln_4',
            type: 'trueFalse',
            question: '在闪电网络中，每次支付都需要等待链上确认。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '闪电网络的核心优势就是链下即时支付。只有开启和关闭通道时需要链上交易，通道内的支付只需要双方交换签名更新状态，毫秒级完成。',
            difficulty: 'easy'
        },
        {
            id: 'ln_5',
            type: 'single',
            question: '闪电网络的"洋葱路由"主要保护什么？',
            options: [
                '支付金额',
                '支付路径的隐私',
                '交易速度',
                '通道容量'
            ],
            correctAnswers: [1],
            explanation: '洋葱路由使得每个中间节点只知道它的上一跳和下一跳，无法看到完整的支付路径。这保护了发送方和接收方的隐私。',
            difficulty: 'medium'
        }
    ]
};

// SegWit 测验
export const segwitQuiz: QuizData = {
    moduleId: 'segwit',
    moduleName: '隔离见证',
    questions: [
        {
            id: 'sw_1',
            type: 'single',
            question: 'SegWit 是什么类型的升级？',
            options: ['硬分叉', '软分叉', '侧链', '新的加密货币'],
            correctAnswers: [1],
            explanation: 'SegWit 是通过软分叉激活的，这意味着旧节点仍然能够验证新的交易格式（虽然看不到完整的见证数据），向后兼容。',
            difficulty: 'easy'
        },
        {
            id: 'sw_2',
            type: 'single',
            question: 'SegWit 解决了什么长期存在的问题？',
            options: [
                '双花攻击',
                '交易可锻性（Transaction Malleability）',
                '51% 攻击',
                '私钥泄露'
            ],
            correctAnswers: [1],
            explanation: 'SegWit 将签名数据移出交易 ID 的计算范围，解决了交易可锻性问题。这对闪电网络等依赖未确认交易 ID 的技术至关重要。',
            difficulty: 'medium'
        },
        {
            id: 'sw_3',
            type: 'single',
            question: 'Native SegWit (P2WPKH) 地址以什么开头？',
            options: ['1', '3', 'bc1q', 'bc1p'],
            correctAnswers: [2],
            explanation: 'Native SegWit 地址使用 Bech32 编码，主网地址以 bc1q 开头。bc1p 是 Taproot 地址的前缀。以 1 开头的是传统 P2PKH，以 3 开头的是 P2SH。',
            difficulty: 'easy'
        },
        {
            id: 'sw_4',
            type: 'single',
            question: 'SegWit 交易比传统交易节省多少费用？',
            options: ['约 10%', '约 25%', '约 40%', '约 80%'],
            correctAnswers: [2],
            explanation: 'SegWit 交易通常可节省约 40% 的费用。这是因为见证数据（签名）只按 1/4 的权重计入区块大小限制。',
            difficulty: 'medium'
        },
        {
            id: 'sw_5',
            type: 'trueFalse',
            question: 'SegWit 将比特币的区块大小限制从 1MB 提升到了 4MB。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'SegWit 引入了"区块权重"概念，最大为 4M 权重单位（WU）。但由于见证数据按 1/4 权重计算，实际区块大小约为 1.8-2MB，而非简单的 4MB。',
            difficulty: 'hard'
        }
    ]
};

// Taproot 测验
export const taprootQuiz: QuizData = {
    moduleId: 'taproot',
    moduleName: 'Taproot',
    questions: [
        {
            id: 'tr_1',
            type: 'single',
            question: 'Taproot 在哪一年激活？',
            options: ['2017年', '2019年', '2021年', '2023年'],
            correctAnswers: [2],
            explanation: 'Taproot 于 2021 年 11 月在区块高度 709,632 激活。它是自 2017 年 SegWit 以来最重要的比特币协议升级。',
            difficulty: 'easy'
        },
        {
            id: 'tr_2',
            type: 'single',
            question: 'Taproot 地址以什么开头？',
            options: ['1', '3', 'bc1q', 'bc1p'],
            correctAnswers: [3],
            explanation: 'Taproot 地址使用 Bech32m 编码，主网地址以 bc1p 开头。这与 Native SegWit 的 bc1q 前缀区分开。',
            difficulty: 'easy'
        },
        {
            id: 'tr_3',
            type: 'single',
            question: 'MAST 代表什么？',
            options: [
                'Merklized Abstract Syntax Tree',
                'Multi-Asset Spending Transaction',
                'Master Account Security Token',
                'Modular Authentication Signature Type'
            ],
            correctAnswers: [0],
            explanation: 'MAST 是 Merklized Abstract Syntax Tree（默克尔化抽象语法树）的缩写，它允许将多个脚本路径组织成默克尔树，只需揭示实际使用的路径。',
            difficulty: 'medium'
        },
        {
            id: 'tr_4',
            type: 'single',
            question: 'Taproot 的主要隐私优势是什么？',
            options: [
                '隐藏交易金额',
                '单签与多签交易在链上看起来一样',
                '隐藏发送方地址',
                '使用零知识证明'
            ],
            correctAnswers: [1],
            explanation: 'Taproot 的关键路径（Key Path）支出使得简单的单签交易和复杂的多签/智能合约在链上看起来完全相同，大大增强了隐私性。',
            difficulty: 'medium'
        },
        {
            id: 'tr_5',
            type: 'trueFalse',
            question: 'Taproot 使用 Schnorr 签名而非 ECDSA。',
            options: ['正确', '错误'],
            correctAnswers: [0],
            explanation: 'Taproot 引入了 Schnorr 签名方案（BIP-340），它支持签名聚合、批量验证等特性，比 ECDSA 更高效。',
            difficulty: 'easy'
        }
    ]
};

// 共识机制测验
export const consensusQuiz: QuizData = {
    moduleId: 'consensus',
    moduleName: '共识机制',
    questions: [
        {
            id: 'con_1',
            type: 'single',
            question: '比特币采用什么共识机制？',
            options: [
                'Proof of Stake (PoS)',
                'Proof of Work (PoW)',
                'Delegated Proof of Stake (DPoS)',
                'Proof of Authority (PoA)'
            ],
            correctAnswers: [1],
            explanation: '比特币使用工作量证明（PoW）共识机制，矿工通过消耗计算资源来竞争出块权，这确保了网络的去中心化和安全性。',
            difficulty: 'easy'
        },
        {
            id: 'con_2',
            type: 'single',
            question: '比特币的目标出块时间是多少？',
            options: ['1 分钟', '5 分钟', '10 分钟', '30 分钟'],
            correctAnswers: [2],
            explanation: '比特币的设计目标是平均每 10 分钟产生一个新区块。难度调整机制每 2016 个区块（约两周）调整一次，以维持这个目标。',
            difficulty: 'easy'
        },
        {
            id: 'con_3',
            type: 'single',
            question: '什么是"最长链规则"？',
            options: [
                '选择包含最多交易的链',
                '选择累计工作量最大的链',
                '选择最早创建的链',
                '选择节点最多的链'
            ],
            correctAnswers: [1],
            explanation: '更准确地说是"最重链规则"——节点总是选择累计工作量（难度总和）最大的链作为有效链。这确保了即使有分叉，网络也会收敛到同一条链。',
            difficulty: 'medium'
        },
        {
            id: 'con_4',
            type: 'single',
            question: '通常建议等待多少个确认才认为比特币交易是安全的？',
            options: ['1 个', '3 个', '6 个', '100 个'],
            correctAnswers: [2],
            explanation: '6 个确认是广泛接受的标准，大约需要 1 小时。随着确认数增加，交易被撤销的概率呈指数级下降。对于小额交易，更少的确认也是可以接受的。',
            difficulty: 'easy'
        },
        {
            id: 'con_5',
            type: 'trueFalse',
            question: '在比特币网络中，拥有超过 50% 算力的矿工可以修改历史交易。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '即使拥有超过 50% 算力，攻击者也只能尝试双花自己的交易或阻止新交易确认。他无法修改其他人的历史交易，因为他没有其他人的私钥来创建有效签名。',
            difficulty: 'hard'
        }
    ]
};

// 挖矿经济学测验
export const miningQuiz: QuizData = {
    moduleId: 'mining',
    moduleName: '挖矿经济学',
    questions: [
        {
            id: 'min_1',
            type: 'single',
            question: '比特币的总量上限是多少？',
            options: ['1000 万', '2100 万', '1 亿', '无上限'],
            correctAnswers: [1],
            explanation: '比特币的总量被硬编码限制在 2100 万枚。由于四年一次的减半机制，预计最后一个比特币将在约 2140 年被挖出。',
            difficulty: 'easy'
        },
        {
            id: 'min_2',
            type: 'single',
            question: '比特币减半大约每多久发生一次？',
            options: ['1 年', '2 年', '4 年', '10 年'],
            correctAnswers: [2],
            explanation: '比特币每 210,000 个区块减半一次，大约是每 4 年。2024 年的第四次减半将区块奖励从 6.25 BTC 降至 3.125 BTC。',
            difficulty: 'easy'
        },
        {
            id: 'min_3',
            type: 'single',
            question: '当所有比特币都被挖完后，矿工靠什么获得收入？',
            options: [
                '政府补贴',
                '交易手续费',
                '没有收入',
                '新发行的代币'
            ],
            correctAnswers: [1],
            explanation: '当区块奖励归零后，矿工将完全依靠交易手续费维持收入。这也是为什么比特币需要保持一定的链上交易量和合理的手续费市场。',
            difficulty: 'easy'
        },
        {
            id: 'min_4',
            type: 'single',
            question: '难度调整的目的是什么？',
            options: [
                '限制矿工数量',
                '保持出块时间稳定在约 10 分钟',
                '增加交易速度',
                '减少能源消耗'
            ],
            correctAnswers: [1],
            explanation: '难度调整确保无论全网算力如何变化，平均出块时间始终保持在约 10 分钟。当算力增加时难度上升，算力减少时难度下降。',
            difficulty: 'easy'
        },
        {
            id: 'min_5',
            type: 'single',
            question: '比特币创世区块的奖励是多少？',
            options: ['12.5 BTC', '25 BTC', '50 BTC', '100 BTC'],
            correctAnswers: [2],
            explanation: '创世区块（2009年1月3日）的奖励是 50 BTC。经过三次减半后，当前（2024年之前）的区块奖励是 6.25 BTC。',
            difficulty: 'medium'
        }
    ]
};

// PoW 挖矿测验
export const powQuiz: QuizData = {
    moduleId: 'pow',
    moduleName: 'PoW 挖矿',
    questions: [
        {
            id: 'pow_1',
            type: 'single',
            question: '比特币挖矿本质上是在寻找什么？',
            options: ['质数', '满足特定条件的哈希值', '随机数序列', '加密密钥'],
            correctAnswers: [1],
            explanation: '挖矿是寻找一个 nonce 值，使得区块头的哈希值小于目标值（以足够多的零开头）。',
            difficulty: 'easy'
        },
        {
            id: 'pow_2',
            type: 'single',
            question: 'Nonce 在挖矿中的作用是什么？',
            options: ['验证交易', '作为随机数不断尝试以改变哈希值', '存储交易数据', '加密区块'],
            correctAnswers: [1],
            explanation: 'Nonce 是矿工可以自由修改的数值，通过不断改变 nonce 来尝试找到满足条件的哈希值。',
            difficulty: 'easy'
        },
        {
            id: 'pow_3',
            type: 'single',
            question: '比特币挖矿使用什么哈希算法？',
            options: ['SHA-1', 'SHA-256', 'MD5', 'SHA-512'],
            correctAnswers: [1],
            explanation: '比特币使用双重 SHA-256（SHA256d）进行挖矿，即对数据进行两次 SHA-256 哈希。',
            difficulty: 'easy'
        },
        {
            id: 'pow_4',
            type: 'trueFalse',
            question: '挖矿难度越高，需要找到的哈希值前导零越多。',
            options: ['正确', '错误'],
            correctAnswers: [0],
            explanation: '难度与目标值成反比。难度越高，目标值越小，意味着有效哈希需要更多的前导零位。',
            difficulty: 'medium'
        },
        {
            id: 'pow_5',
            type: 'single',
            question: '为什么说挖矿是"工作量证明"？',
            options: ['因为需要人工审核', '因为找到有效哈希需要大量计算', '因为需要支付费用', '因为需要网络投票'],
            correctAnswers: [1],
            explanation: '找到满足条件的哈希需要大量的随机尝试和计算资源，这个计算量本身就是"工作量"的证明。',
            difficulty: 'easy'
        }
    ]
};

// 地址生成测验
export const addressQuiz: QuizData = {
    moduleId: 'address',
    moduleName: '地址生成',
    questions: [
        {
            id: 'addr_1',
            type: 'single',
            question: '比特币地址是从什么派生的？',
            options: ['随机生成', '公钥的哈希', '私钥直接编码', '区块高度'],
            correctAnswers: [1],
            explanation: '比特币地址是公钥经过 SHA-256 和 RIPEMD-160 哈希后，再加上版本前缀和校验和生成的。',
            difficulty: 'easy'
        },
        {
            id: 'addr_2',
            type: 'single',
            question: 'Base58Check 编码的主要优点是什么？',
            options: ['更短的地址', '避免混淆字符（如0/O, l/1）且包含校验', '更高的安全性', '支持更多字符'],
            correctAnswers: [1],
            explanation: 'Base58Check 移除了容易混淆的字符（0、O、l、I），并包含4字节校验和来检测输入错误。',
            difficulty: 'medium'
        },
        {
            id: 'addr_3',
            type: 'single',
            question: '传统 P2PKH 地址以什么字符开头？',
            options: ['3', 'bc1', '1', 'm'],
            correctAnswers: [2],
            explanation: '主网 P2PKH 地址以"1"开头，P2SH 地址以"3"开头，Native SegWit 以"bc1q"开头。',
            difficulty: 'easy'
        },
        {
            id: 'addr_4',
            type: 'trueFalse',
            question: '从比特币地址可以反推出公钥。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '地址是公钥哈希的结果，哈希是单向函数，无法从哈希值反推出原始公钥。只有在花费时才会揭示公钥。',
            difficulty: 'medium'
        },
        {
            id: 'addr_5',
            type: 'single',
            question: 'Bech32 编码用于什么类型的地址？',
            options: ['传统地址', 'P2SH 地址', 'Native SegWit 地址', '多签地址'],
            correctAnswers: [2],
            explanation: 'Bech32 是为 Native SegWit（P2WPKH/P2WSH）设计的编码格式，地址以 bc1q 开头，错误检测能力更强。',
            difficulty: 'medium'
        }
    ]
};

// 内存池测验
export const mempoolQuiz: QuizData = {
    moduleId: 'mempool',
    moduleName: '内存池',
    questions: [
        {
            id: 'mem_1',
            type: 'single',
            question: '内存池（Mempool）存储什么？',
            options: ['已确认的交易', '待确认的交易', '历史区块', '用户私钥'],
            correctAnswers: [1],
            explanation: '内存池是每个节点维护的待确认交易的临时存储区，矿工从中选择交易打包进区块。',
            difficulty: 'easy'
        },
        {
            id: 'mem_2',
            type: 'single',
            question: '矿工通常如何选择内存池中的交易？',
            options: ['先到先得', '按手续费率从高到低', '随机选择', '按交易金额'],
            correctAnswers: [1],
            explanation: '矿工通常优先选择手续费率（sat/vB）高的交易，以最大化区块收益。',
            difficulty: 'easy'
        },
        {
            id: 'mem_3',
            type: 'trueFalse',
            question: '所有比特币节点的内存池内容完全相同。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '每个节点的内存池是独立的，可能因为网络延迟、策略设置不同而有差异。没有"全局"内存池。',
            difficulty: 'medium'
        },
        {
            id: 'mem_4',
            type: 'single',
            question: '交易在内存池中等待过久会发生什么？',
            options: ['自动确认', '可能被驱逐或过期', '手续费自动增加', '发送回发送方'],
            correctAnswers: [1],
            explanation: '如果内存池拥挤，低手续费的交易可能被驱逐。默认情况下，交易在内存池中保留约2周后会被移除。',
            difficulty: 'medium'
        },
        {
            id: 'mem_5',
            type: 'single',
            question: 'CPFP（Child Pays for Parent）是什么技术？',
            options: ['加速父交易的子交易技术', '多签交易方案', '隐私增强技术', '跨链交易协议'],
            correctAnswers: [0],
            explanation: 'CPFP 允许创建一笔高手续费的子交易，花费父交易的输出。矿工为了获得子交易的手续费，会一起打包父交易。',
            difficulty: 'hard'
        }
    ]
};

// P2P 网络测验
export const p2pQuiz: QuizData = {
    moduleId: 'p2p',
    moduleName: 'P2P 网络',
    questions: [
        {
            id: 'p2p_1',
            type: 'single',
            question: '比特币网络是什么类型的网络？',
            options: ['客户端-服务器', '点对点（P2P）', '主从结构', '星型拓扑'],
            correctAnswers: [1],
            explanation: '比特币是去中心化的点对点网络，每个节点都是平等的，没有中央服务器。',
            difficulty: 'easy'
        },
        {
            id: 'p2p_2',
            type: 'single',
            question: '新节点如何发现网络中的其他节点？',
            options: ['查询中央服务器', 'DNS 种子和节点发现协议', '手动配置', '广播搜索'],
            correctAnswers: [1],
            explanation: '新节点通过 DNS 种子获取初始节点列表，然后通过 addr 消息从已连接节点获取更多节点地址。',
            difficulty: 'medium'
        },
        {
            id: 'p2p_3',
            type: 'single',
            question: '比特币网络默认使用什么端口？',
            options: ['80', '443', '8333', '3000'],
            correctAnswers: [2],
            explanation: '比特币主网默认使用 8333 端口进行 P2P 通信，测试网使用 18333 端口。',
            difficulty: 'easy'
        },
        {
            id: 'p2p_4',
            type: 'trueFalse',
            question: '比特币网络中的所有节点都必须存储完整的区块链。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '网络中有全节点（存储完整链）和轻节点（SPV，只存储区块头）。不是所有节点都需要完整数据。',
            difficulty: 'easy'
        },
        {
            id: 'p2p_5',
            type: 'single',
            question: 'Gossip 协议在比特币网络中用于什么？',
            options: ['加密通信', '传播交易和区块信息', '验证签名', '生成地址'],
            correctAnswers: [1],
            explanation: 'Gossip 协议让每个节点将收到的新信息转发给它的邻居节点，使信息快速传播到整个网络。',
            difficulty: 'medium'
        }
    ]
};

// RBF 费用替换测验
export const rbfQuiz: QuizData = {
    moduleId: 'rbf',
    moduleName: 'RBF 费用替换',
    questions: [
        {
            id: 'rbf_1',
            type: 'single',
            question: 'RBF 代表什么？',
            options: ['Return Before Fee', 'Replace-By-Fee', 'Relay Broadcasting Format', 'Rapid Block Finder'],
            correctAnswers: [1],
            explanation: 'RBF 是 Replace-By-Fee（费用替换）的缩写，允许用更高手续费的交易替换内存池中的原交易。',
            difficulty: 'easy'
        },
        {
            id: 'rbf_2',
            type: 'single',
            question: '交易必须满足什么条件才能被 RBF 替换？',
            options: ['任何交易都可以', '原交易必须标记为可替换', '必须有矿工批准', '只有小额交易可以'],
            correctAnswers: [1],
            explanation: '根据 BIP-125，原交易必须设置 nSequence < 0xFFFFFFFE 来标记为可替换（opt-in RBF）。',
            difficulty: 'medium'
        },
        {
            id: 'rbf_3',
            type: 'trueFalse',
            question: 'RBF 替换交易必须支付更高的总手续费。',
            options: ['正确', '错误'],
            correctAnswers: [0],
            explanation: '替换交易的总手续费必须高于原交易，而且增加的手续费必须足够支付替换交易本身的传播成本。',
            difficulty: 'medium'
        },
        {
            id: 'rbf_4',
            type: 'single',
            question: 'RBF 的主要用途是什么？',
            options: ['增加交易隐私', '加速卡住的交易', '减少交易大小', '增加交易金额'],
            correctAnswers: [1],
            explanation: 'RBF 最常见的用途是当原交易因手续费太低而卡住时，通过支付更高的手续费来加速确认。',
            difficulty: 'easy'
        },
        {
            id: 'rbf_5',
            type: 'single',
            question: 'Full RBF 与 Opt-in RBF 的区别是什么？',
            options: ['没有区别', 'Full RBF 允许替换任何未确认交易', 'Full RBF 只用于大额交易', 'Full RBF 需要更多确认'],
            correctAnswers: [1],
            explanation: 'Opt-in RBF 只允许替换明确标记的交易，而 Full RBF 政策允许节点接受对任何未确认交易的替换。',
            difficulty: 'hard'
        }
    ]
};

// 软硬分叉测验
export const forkQuiz: QuizData = {
    moduleId: 'fork',
    moduleName: '软硬分叉',
    questions: [
        {
            id: 'fork_1',
            type: 'single',
            question: '什么是软分叉？',
            options: ['向后兼容的协议升级', '不兼容的链分裂', '临时的网络分叉', '矿工组织'],
            correctAnswers: [0],
            explanation: '软分叉是向后兼容的升级，旧节点仍能验证新区块（虽然可能不理解新规则的全部内容）。',
            difficulty: 'easy'
        },
        {
            id: 'fork_2',
            type: 'single',
            question: '硬分叉与软分叉的主要区别是什么？',
            options: ['速度不同', '硬分叉不向后兼容', '软分叉需要更多算力', '硬分叉更安全'],
            correctAnswers: [1],
            explanation: '硬分叉是不兼容的协议更改，旧节点会拒绝新区块。如果没有全面共识，会导致链分裂。',
            difficulty: 'easy'
        },
        {
            id: 'fork_3',
            type: 'single',
            question: 'SegWit 是通过什么类型的分叉激活的？',
            options: ['硬分叉', '软分叉', '用户激活', '没有分叉'],
            correctAnswers: [1],
            explanation: 'SegWit 是通过软分叉激活的（BIP-141），旧节点将 SegWit 交易视为"anyone-can-spend"交易。',
            difficulty: 'medium'
        },
        {
            id: 'fork_4',
            type: 'single',
            question: 'Bitcoin Cash 是如何产生的？',
            options: ['软分叉', '硬分叉导致的链分裂', '新创建的加密货币', 'ICO'],
            correctAnswers: [1],
            explanation: 'Bitcoin Cash 在 2017 年通过硬分叉从比特币分裂出来，主要争议是区块大小限制。',
            difficulty: 'easy'
        },
        {
            id: 'fork_5',
            type: 'trueFalse',
            question: '软分叉需要网络中所有节点同时升级。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '软分叉的优势就是不需要所有节点同时升级。只要大多数算力支持新规则，网络就能平稳过渡。',
            difficulty: 'medium'
        }
    ]
};

// Schnorr 签名测验
export const schnorrQuiz: QuizData = {
    moduleId: 'schnorr',
    moduleName: 'Schnorr 签名',
    questions: [
        {
            id: 'sch_1',
            type: 'single',
            question: 'Schnorr 签名相比 ECDSA 的主要优势是什么？',
            options: ['更长的签名', '支持签名聚合', '使用不同的曲线', '不需要私钥'],
            correctAnswers: [1],
            explanation: 'Schnorr 签名支持线性组合，多个签名可以聚合成一个，节省空间并增强隐私。',
            difficulty: 'easy'
        },
        {
            id: 'sch_2',
            type: 'single',
            question: 'MuSig 是什么？',
            options: ['新的哈希算法', '基于 Schnorr 的多签方案', '区块压缩技术', '网络协议'],
            correctAnswers: [1],
            explanation: 'MuSig 是使用 Schnorr 签名实现的多签方案，多方可以合作生成一个看起来像单签的聚合签名。',
            difficulty: 'medium'
        },
        {
            id: 'sch_3',
            type: 'trueFalse',
            question: 'Schnorr 签名比 ECDSA 签名更短。',
            options: ['正确', '错误'],
            correctAnswers: [0],
            explanation: 'Schnorr 签名固定为 64 字节，而 ECDSA 签名通常为 71-72 字节（DER 编码）。',
            difficulty: 'medium'
        },
        {
            id: 'sch_4',
            type: 'single',
            question: 'Schnorr 签名在比特币中通过什么升级引入？',
            options: ['SegWit', 'Taproot', 'Lightning', 'CSV'],
            correctAnswers: [1],
            explanation: 'Schnorr 签名（BIP-340）作为 Taproot 升级的一部分在 2021 年引入比特币。',
            difficulty: 'easy'
        },
        {
            id: 'sch_5',
            type: 'single',
            question: '批量验证（Batch Verification）对 Schnorr 签名有什么好处？',
            options: ['减少存储空间', '加速多个签名的验证', '增加安全性', '简化密钥管理'],
            correctAnswers: [1],
            explanation: 'Schnorr 签名的数学特性允许同时验证多个签名比逐个验证更快，这对全节点验证区块很有帮助。',
            difficulty: 'hard'
        }
    ]
};

// SPV 轻节点测验
export const spvQuiz: QuizData = {
    moduleId: 'spv',
    moduleName: 'SPV 轻节点',
    questions: [
        {
            id: 'spv_1',
            type: 'single',
            question: 'SPV 代表什么？',
            options: ['Secure Private Vault', 'Simplified Payment Verification', 'Standard Protocol Version', 'Signed Public Value'],
            correctAnswers: [1],
            explanation: 'SPV 是 Simplified Payment Verification（简化支付验证）的缩写，允许不下载完整区块链验证交易。',
            difficulty: 'easy'
        },
        {
            id: 'spv_2',
            type: 'single',
            question: 'SPV 客户端需要下载什么数据？',
            options: ['完整区块链', '只有区块头', '只有交易', '什么都不需要'],
            correctAnswers: [1],
            explanation: 'SPV 客户端只下载区块头（每个 80 字节），通过默克尔证明验证特定交易是否包含在区块中。',
            difficulty: 'easy'
        },
        {
            id: 'spv_3',
            type: 'single',
            question: 'SPV 客户端如何验证交易已被确认？',
            options: ['询问矿工', '通过默克尔证明', '下载完整区块', '信任第三方'],
            correctAnswers: [1],
            explanation: 'SPV 使用默克尔证明（Merkle Proof）验证交易包含在某个区块的默克尔树中，而无需下载完整区块。',
            difficulty: 'medium'
        },
        {
            id: 'spv_4',
            type: 'trueFalse',
            question: 'SPV 客户端的安全性与全节点完全相同。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'SPV 客户端信任矿工的工作量证明，无法验证所有共识规则。存在被欺骗的风险，安全性低于全节点。',
            difficulty: 'medium'
        },
        {
            id: 'spv_5',
            type: 'single',
            question: '布隆过滤器（Bloom Filter）在 SPV 中的作用是什么？',
            options: ['加密交易', '隐私保护地请求相关交易', '验证签名', '计算手续费'],
            correctAnswers: [1],
            explanation: '布隆过滤器允许 SPV 客户端向全节点请求与自己相关的交易，而不完全暴露自己的地址（虽然隐私保护有限）。',
            difficulty: 'hard'
        }
    ]
};

// 冷钱包测验
export const coldQuiz: QuizData = {
    moduleId: 'cold',
    moduleName: '冷钱包',
    questions: [
        {
            id: 'cold_1',
            type: 'single',
            question: '什么是冷钱包？',
            options: ['存放在冰箱里的钱包', '离线存储私钥的钱包', '免费的钱包', '多签钱包'],
            correctAnswers: [1],
            explanation: '冷钱包是指私钥从不接触互联网的钱包，大大降低了被黑客攻击的风险。',
            difficulty: 'easy'
        },
        {
            id: 'cold_2',
            type: 'multiple',
            question: '以下哪些是冷钱包的形式？（多选）',
            options: ['硬件钱包', '纸钱包', '交易所账户', '金属助记词板'],
            correctAnswers: [0, 1, 3],
            explanation: '硬件钱包、纸钱包和金属板都是冷存储方式。交易所账户是热钱包，私钥由交易所控制。',
            difficulty: 'easy'
        },
        {
            id: 'cold_3',
            type: 'single',
            question: '冷钱包如何签署交易？',
            options: ['在线签署', '离线签署后传输签名', '无法签署交易', '由矿工签署'],
            correctAnswers: [1],
            explanation: '冷钱包在离线环境签署交易，然后通过 QR 码、USB 或其他方式将签名后的交易传输到联网设备广播。',
            difficulty: 'medium'
        },
        {
            id: 'cold_4',
            type: 'trueFalse',
            question: '使用冷钱包可以完全消除丢失资金的风险。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '冷钱包防止了在线攻击，但仍有物理丢失、损坏、遗忘密码或备份不当导致资金丢失的风险。',
            difficulty: 'easy'
        },
        {
            id: 'cold_5',
            type: 'single',
            question: 'Air-gapped 设备是什么意思？',
            options: ['使用空气冷却', '永不联网的设备', '使用无线通信', '轻量级设备'],
            correctAnswers: [1],
            explanation: 'Air-gapped（气隙隔离）设备是指物理上与网络隔离、永不连接互联网的设备，提供最高级别的安全性。',
            difficulty: 'medium'
        }
    ]
};

// 隐私技术测验
export const privacyQuiz: QuizData = {
    moduleId: 'privacy',
    moduleName: '隐私技术',
    questions: [
        {
            id: 'priv_1',
            type: 'trueFalse',
            question: '比特币交易是完全匿名的。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '比特币是伪匿名的，不是完全匿名。所有交易都是公开可追踪的，通过链分析可以关联地址和身份。',
            difficulty: 'easy'
        },
        {
            id: 'priv_2',
            type: 'single',
            question: 'CoinJoin 是什么？',
            options: ['新的加密货币', '多个用户混合交易以增强隐私', '交易加速服务', '挖矿协议'],
            correctAnswers: [1],
            explanation: 'CoinJoin 是一种隐私技术，多个用户将他们的交易合并为一笔，使外部观察者难以追踪资金流向。',
            difficulty: 'medium'
        },
        {
            id: 'priv_3',
            type: 'single',
            question: '为什么建议每次收款使用新地址？',
            options: ['旧地址会过期', '增加隐私性', '降低手续费', '提高交易速度'],
            correctAnswers: [1],
            explanation: '使用新地址可以防止他人将你的多笔交易关联起来，这是基本的隐私最佳实践。',
            difficulty: 'easy'
        },
        {
            id: 'priv_4',
            type: 'single',
            question: 'Taproot 如何改善比特币隐私？',
            options: ['隐藏交易金额', '使复杂脚本看起来像简单交易', '加密地址', '隐藏交易时间'],
            correctAnswers: [1],
            explanation: 'Taproot 的关键路径支出使多签和智能合约交易在链上与普通单签交易无法区分。',
            difficulty: 'medium'
        },
        {
            id: 'priv_5',
            type: 'single',
            question: '什么是链分析（Chain Analysis）？',
            options: ['优化区块链性能', '追踪和分析区块链交易以识别实体', '验证交易签名', '预测价格'],
            correctAnswers: [1],
            explanation: '链分析是通过分析区块链上的交易模式、时间、金额等来追踪资金流向并可能识别用户身份的技术。',
            difficulty: 'easy'
        }
    ]
};

// 比特币历史测验
export const historyQuiz: QuizData = {
    moduleId: 'history',
    moduleName: '比特币历史',
    questions: [
        {
            id: 'hist_1',
            type: 'single',
            question: '比特币白皮书发布于哪一年？',
            options: ['2007年', '2008年', '2009年', '2010年'],
            correctAnswers: [1],
            explanation: '中本聪在 2008 年 10 月 31 日发布了比特币白皮书《Bitcoin: A Peer-to-Peer Electronic Cash System》。',
            difficulty: 'easy'
        },
        {
            id: 'hist_2',
            type: 'single',
            question: '比特币创世区块包含什么著名信息？',
            options: ['Hello World', '泰晤士报头条', '中本聪的地址', '没有特殊信息'],
            correctAnswers: [1],
            explanation: '创世区块包含"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"，引用当天泰晤士报头条。',
            difficulty: 'medium'
        },
        {
            id: 'hist_3',
            type: 'single',
            question: '第一笔使用比特币购买实物的交易是什么？',
            options: ['咖啡', '披萨', '汽车', '房子'],
            correctAnswers: [1],
            explanation: '2010 年 5 月 22 日，Laszlo Hanyecz 用 10,000 BTC 购买了两个披萨，这天被称为"比特币披萨日"。',
            difficulty: 'easy'
        },
        {
            id: 'hist_4',
            type: 'single',
            question: 'Mt. Gox 是什么？',
            options: ['比特币开发团队', '早期最大的比特币交易所（后破产）', '挖矿硬件公司', '比特币分叉'],
            correctAnswers: [1],
            explanation: 'Mt. Gox 曾是最大的比特币交易所，2014 年因安全漏洞丢失约 85 万比特币后破产。',
            difficulty: 'medium'
        },
        {
            id: 'hist_5',
            type: 'single',
            question: '中本聪最后一次公开活动是什么时候？',
            options: ['2009年', '2010年', '2011年', '2012年'],
            correctAnswers: [2],
            explanation: '中本聪在 2010 年底逐渐淡出，2011 年 4 月发送最后一封已知邮件后彻底消失。',
            difficulty: 'medium'
        }
    ]
};

// 全节点测验
export const fullnodeQuiz: QuizData = {
    moduleId: 'fullnode',
    moduleName: '全节点',
    questions: [
        {
            id: 'fn_1',
            type: 'single',
            question: '运行全节点的主要好处是什么？',
            options: ['获得挖矿奖励', '完全验证所有交易和区块', '更快的交易速度', '免费转账'],
            correctAnswers: [1],
            explanation: '全节点独立验证所有交易和区块，不信任任何第三方，提供最高级别的安全性和隐私。',
            difficulty: 'easy'
        },
        {
            id: 'fn_2',
            type: 'single',
            question: '截至 2024 年，运行比特币全节点大约需要多少存储空间？',
            options: ['约 50 GB', '约 150 GB', '约 500 GB', '约 1 TB'],
            correctAnswers: [2],
            explanation: '完整的比特币区块链数据约 500-600 GB，不过可以使用剪枝（pruning）模式减少到约 10 GB。',
            difficulty: 'medium'
        },
        {
            id: 'fn_3',
            type: 'trueFalse',
            question: '运行全节点可以获得比特币奖励。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '全节点不会获得任何直接的经济奖励。奖励只给矿工。运行全节点的好处是安全和隐私，而非收入。',
            difficulty: 'easy'
        },
        {
            id: 'fn_4',
            type: 'single',
            question: 'Bitcoin Core 是什么？',
            options: ['比特币的核心开发团队', '最广泛使用的全节点软件', '比特币交易所', '挖矿软件'],
            correctAnswers: [1],
            explanation: 'Bitcoin Core 是比特币的参考实现，也是使用最广泛的全节点软件，由开源社区维护。',
            difficulty: 'easy'
        },
        {
            id: 'fn_5',
            type: 'single',
            question: 'IBD（Initial Block Download）是什么？',
            options: ['国际比特币组织', '新节点首次同步完整区块链的过程', '比特币备份协议', '投资策略'],
            correctAnswers: [1],
            explanation: 'IBD 是新全节点从网络下载并验证整个区块链历史的过程，可能需要数小时到数天。',
            difficulty: 'medium'
        }
    ]
};

// Lamport 签名测验
export const lamportQuiz: QuizData = {
    moduleId: 'lamport',
    moduleName: 'Lamport 签名',
    questions: [
        {
            id: 'lamp_1',
            type: 'single',
            question: 'Lamport 签名的特点是什么？',
            options: ['基于椭圆曲线', '基于哈希函数，抗量子攻击', '签名最短', '支持多签'],
            correctAnswers: [1],
            explanation: 'Lamport 签名只依赖哈希函数的安全性，不依赖数学难题，因此理论上可以抵抗量子计算机攻击。',
            difficulty: 'medium'
        },
        {
            id: 'lamp_2',
            type: 'single',
            question: 'Lamport 签名的主要缺点是什么？',
            options: ['安全性低', '签名和密钥体积非常大', '计算太慢', '不支持验证'],
            correctAnswers: [1],
            explanation: 'Lamport 签名的公钥和签名都很大（数千字节），而且每对密钥只能安全使用一次。',
            difficulty: 'medium'
        },
        {
            id: 'lamp_3',
            type: 'trueFalse',
            question: 'Lamport 密钥对可以重复使用签署多条消息。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'Lamport 签名是一次性的（one-time signature），每签署一条消息就会泄露部分私钥信息，重复使用会导致私钥泄露。',
            difficulty: 'hard'
        },
        {
            id: 'lamp_4',
            type: 'single',
            question: 'Lamport 签名如何对消息的每一位进行签名？',
            options: ['整体加密', '每位对应两个私钥，揭示其中一个', '使用计数器', '随机选择'],
            correctAnswers: [1],
            explanation: '对于消息的每一位，预先生成两个随机数及其哈希。签名时根据该位是 0 还是 1，揭示对应的私钥。',
            difficulty: 'hard'
        },
        {
            id: 'lamp_5',
            type: 'single',
            question: 'Lamport 签名为什么被研究用于后量子密码学？',
            options: ['效率最高', '不依赖大整数分解或离散对数等数学问题', '由量子计算机发明', '体积最小'],
            correctAnswers: [1],
            explanation: '量子计算机可以破解基于因子分解和离散对数的加密，而 Lamport 只依赖哈希函数，目前认为哈希函数对量子计算仍安全。',
            difficulty: 'medium'
        }
    ]
};

// 量子计算测验
export const quantumQuiz: QuizData = {
    moduleId: 'quantum',
    moduleName: '量子计算',
    questions: [
        {
            id: 'qc_1',
            type: 'single',
            question: '量子计算机对比特币的主要威胁是什么？',
            options: ['挖矿更快', '可能破解椭圆曲线加密', '网络攻击', '存储问题'],
            correctAnswers: [1],
            explanation: 'Shor 算法可以在量子计算机上高效解决椭圆曲线离散对数问题，可能破解比特币的签名算法。',
            difficulty: 'easy'
        },
        {
            id: 'qc_2',
            type: 'single',
            question: '地址从未花费过的比特币为什么相对安全？',
            options: ['有额外保护', '公钥未暴露，只有哈希', '数量太少', '矿工保护'],
            correctAnswers: [1],
            explanation: '未花费的地址只暴露了公钥哈希，攻击者需要先破解哈希才能得到公钥，然后才能尝试破解私钥。',
            difficulty: 'medium'
        },
        {
            id: 'qc_3',
            type: 'trueFalse',
            question: '当前的量子计算机已经能够威胁比特币安全。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '目前的量子计算机规模远远不够（需要数百万个稳定量子比特），估计还需要数十年才可能构成真正威胁。',
            difficulty: 'easy'
        },
        {
            id: 'qc_4',
            type: 'single',
            question: 'Grover 算法对比特币挖矿有什么影响？',
            options: ['无影响', '将挖矿难度降低到平方根级别', '完全破解挖矿', '提高难度'],
            correctAnswers: [1],
            explanation: 'Grover 算法可以将搜索问题加速到平方根级别，相当于将 256 位安全降到 128 位，可通过增加难度应对。',
            difficulty: 'hard'
        },
        {
            id: 'qc_5',
            type: 'single',
            question: '比特币如何为量子时代做准备？',
            options: ['已经量子安全', '研究后量子签名算法升级', '放弃加密', '无法准备'],
            correctAnswers: [1],
            explanation: '社区正在研究后量子密码学方案（如 Lamport、SPHINCS+）。比特币可通过软分叉升级到量子安全的签名算法。',
            difficulty: 'medium'
        }
    ]
};

// 51% 攻击测验
export const attack51Quiz: QuizData = {
    moduleId: 'attack51',
    moduleName: '51% 攻击',
    questions: [
        {
            id: 'a51_1',
            type: 'single',
            question: '什么是 51% 攻击？',
            options: ['控制 51% 的比特币', '控制超过 50% 的网络算力', '攻击 51 个节点', '51 次重复攻击'],
            correctAnswers: [1],
            explanation: '51% 攻击是指攻击者控制超过半数的网络算力，从而能够重组区块链、双花等。',
            difficulty: 'easy'
        },
        {
            id: 'a51_2',
            type: 'multiple',
            question: '51% 攻击者可以做什么？（多选）',
            options: ['双花自己的交易', '阻止交易被确认', '偷取他人的比特币', '修改他人的历史交易'],
            correctAnswers: [0, 1],
            explanation: '攻击者可以双花自己的交易和审查（阻止）其他交易，但无法偷取他人资金或修改他人的历史交易（没有私钥）。',
            difficulty: 'medium'
        },
        {
            id: 'a51_3',
            type: 'trueFalse',
            question: '成功执行 51% 攻击后，攻击者可以创建无限量的比特币。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '即使控制了多数算力，攻击者仍必须遵守共识规则（如区块奖励数量）。违反规则的区块会被其他节点拒绝。',
            difficulty: 'medium'
        },
        {
            id: 'a51_4',
            type: 'single',
            question: '为什么比特币难以被 51% 攻击？',
            options: ['技术上不可能', '攻击成本极高且可能无利可图', '已有防护措施', '算力分散在全球'],
            correctAnswers: [1],
            explanation: '攻击比特币需要巨额硬件和电力投资。即使攻击成功，会导致币价暴跌，攻击者可能得不偿失。',
            difficulty: 'easy'
        },
        {
            id: 'a51_5',
            type: 'single',
            question: '哪些加密货币曾遭受过成功的 51% 攻击？',
            options: ['比特币', 'Ethereum Classic、Bitcoin Gold 等小币种', '以太坊', '所有加密货币都安全'],
            correctAnswers: [1],
            explanation: 'ETC、BTG 等算力较低的加密货币曾多次遭受 51% 攻击。比特币由于算力巨大，从未成功被攻击。',
            difficulty: 'medium'
        }
    ]
};

// 交易构建测验
export const transactionQuiz: QuizData = {
    moduleId: 'transaction',
    moduleName: '交易构建',
    questions: [
        {
            id: 'tx_1',
            type: 'single',
            question: '比特币交易的输入指的是什么？',
            options: [
                '发送者的钱包地址',
                '之前交易的未花费输出（UTXO）',
                '交易的手续费',
                '接收者的公钥'
            ],
            correctAnswers: [1],
            explanation: '比特币交易的输入引用之前交易的输出（UTXO）。每个输入包含前一交易的 txid 和输出索引（vout），以及解锁这些资金的签名。',
            difficulty: 'easy'
        },
        {
            id: 'tx_2',
            type: 'single',
            question: '交易手续费是如何计算的？',
            options: [
                '固定金额，由网络设定',
                '输入总额 - 输出总额',
                '交易金额的百分比',
                '每个输入收取固定费用'
            ],
            correctAnswers: [1],
            explanation: '手续费 = 输入总额 - 输出总额。这个差额会被矿工收取。如果你有 1 BTC 输入，发送 0.9 BTC，找零 0.09 BTC，那么 0.01 BTC 就是手续费。',
            difficulty: 'easy'
        },
        {
            id: 'tx_3',
            type: 'single',
            question: 'SIGHASH_ALL 表示什么？',
            options: [
                '签名所有输入和所有输出',
                '只签名输入，不签名输出',
                '签名所有输入和对应的单个输出',
                '允许任何人修改交易'
            ],
            correctAnswers: [0],
            explanation: 'SIGHASH_ALL（0x01）是最常用的签名类型，表示签名覆盖所有输入和所有输出。这确保交易在签名后不能被修改。',
            difficulty: 'medium'
        },
        {
            id: 'tx_4',
            type: 'single',
            question: '为什么比特币交易需要"找零"输出？',
            options: [
                '因为矿工要求必须有找零',
                '因为 UTXO 必须完整花费，不能部分使用',
                '因为找零可以降低手续费',
                '因为接收者需要找零来验证交易'
            ],
            correctAnswers: [1],
            explanation: 'UTXO 模型要求每个 UTXO 必须完整花费。如果你有 1 BTC 的 UTXO 但只想发送 0.3 BTC，必须创建一个 0.7 BTC（减去手续费）的找零输出返回给自己。',
            difficulty: 'medium'
        },
        {
            id: 'tx_5',
            type: 'trueFalse',
            question: '一笔比特币交易可以有多个输入和多个输出。',
            options: ['正确', '错误'],
            correctAnswers: [0],
            explanation: '比特币交易可以有任意数量的输入和输出。例如，可以合并多个小额 UTXO（多输入）或同时向多人付款（多输出）。',
            difficulty: 'easy'
        }
    ]
};

// 多签钱包测验
export const multiSigQuiz: QuizData = {
    moduleId: 'multisig',
    moduleName: '多签钱包',
    questions: [
        {
            id: 'multisig_1',
            type: 'single',
            question: '2-of-3 多签钱包意味着什么？',
            options: [
                '需要 2 个私钥，可以创建 3 个地址',
                '需要 3 个签名者中的 2 个签名才能花费',
                '每笔交易可以发送给 3 个地址中的 2 个',
                '钱包有 3 个账户，每个账户需要 2 次确认'
            ],
            correctAnswers: [1],
            explanation: 'M-of-N 多签（如 2-of-3）表示总共有 N 个签名者，需要其中 M 个签名才能授权交易。这提供了冗余性和安全性。',
            difficulty: 'easy'
        },
        {
            id: 'multisig_2',
            type: 'single',
            question: 'P2SH 多签地址以什么数字开头？',
            options: ['1', '3', 'bc1', '5'],
            correctAnswers: [1],
            explanation: 'P2SH（Pay-to-Script-Hash）地址以"3"开头。这是传统多签钱包最常用的地址格式。更新的 P2WSH 地址则以"bc1"开头。',
            difficulty: 'easy'
        },
        {
            id: 'multisig_3',
            type: 'single',
            question: '多签钱包的主要优势是什么？',
            options: [
                '交易速度更快',
                '手续费更低',
                '消除单点故障风险',
                '地址更短'
            ],
            correctAnswers: [2],
            explanation: '多签的核心优势是消除单点故障。即使一个私钥丢失或被盗，资金仍然安全，因为攻击者需要获取多个私钥才能花费资金。',
            difficulty: 'easy'
        },
        {
            id: 'multisig_4',
            type: 'single',
            question: '企业财务管理通常使用哪种多签配置？',
            options: [
                '1-of-2（任一人可签）',
                '2-of-2（必须双方同意）',
                '3-of-5（多人审批）',
                '5-of-5（全员一致）'
            ],
            correctAnswers: [2],
            explanation: '企业通常使用 3-of-5 或类似配置，确保重大支出需要多人审批，同时允许部分人缺席时仍能运作。',
            difficulty: 'medium'
        },
        {
            id: 'multisig_5',
            type: 'trueFalse',
            question: '在 2-of-3 多签中，如果丢失了 2 个私钥，仍然可以恢复资金。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '在 2-of-3 多签中，至少需要 2 个私钥才能签名。如果丢失 2 个私钥，就无法达到签名门槛，资金将永久锁定。',
            difficulty: 'medium'
        }
    ]
};

// 默克尔树测验
export const merkleTreeQuiz: QuizData = {
    moduleId: 'merkle',
    moduleName: '默克尔树',
    questions: [
        {
            id: 'merkle_1',
            type: 'single',
            question: '默克尔树的主要作用是什么？',
            options: [
                '加密交易数据',
                '高效验证数据完整性',
                '生成比特币地址',
                '计算交易手续费'
            ],
            correctAnswers: [1],
            explanation: '默克尔树是一种哈希树结构，可以高效地验证大量数据的完整性。通过默克尔根，可以用 O(log n) 的复杂度验证任意数据是否存在于集合中。',
            difficulty: 'easy'
        },
        {
            id: 'merkle_2',
            type: 'single',
            question: '比特币区块头中的默克尔根大小是多少？',
            options: ['16 字节', '32 字节', '64 字节', '256 字节'],
            correctAnswers: [1],
            explanation: '默克尔根是一个 SHA-256 哈希值，固定为 32 字节（256 位）。无论区块包含多少交易，默克尔根的大小始终相同。',
            difficulty: 'easy'
        },
        {
            id: 'merkle_3',
            type: 'single',
            question: '如果一个区块有 1024 笔交易，验证其中一笔交易需要多少个哈希值？',
            options: ['10 个', '32 个', '512 个', '1024 个'],
            correctAnswers: [0],
            explanation: '默克尔证明的复杂度是 O(log₂n)。log₂(1024) = 10，所以只需要 10 个哈希值即可验证任意一笔交易的存在性。',
            difficulty: 'medium'
        },
        {
            id: 'merkle_4',
            type: 'single',
            question: '当交易数量为奇数时，比特币如何处理？',
            options: [
                '添加一个空交易',
                '忽略最后一笔交易',
                '复制最后一笔交易与自己配对',
                '报错并拒绝打包'
            ],
            correctAnswers: [2],
            explanation: '当交易数量为奇数时，最后一笔交易会被复制一份与自己配对。这样可以保持树的完整性，同时不影响验证逻辑。',
            difficulty: 'medium'
        },
        {
            id: 'merkle_5',
            type: 'trueFalse',
            question: 'SPV 节点必须下载完整的区块数据才能验证交易。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'SPV（简单支付验证）节点只需下载区块头和默克尔证明即可验证交易存在性，无需下载完整区块。这使得轻钱包可以在手机等资源受限设备上运行。',
            difficulty: 'easy'
        }
    ]
};

// 适配器签名测验
export const adaptorQuiz: QuizData = {
    moduleId: 'adaptor',
    moduleName: '适配器签名',
    questions: [
        {
            id: 'as_1',
            type: 'single',
            question: '适配器签名的核心特性是什么？',
            options: [
                '签名体积更小',
                '签名的完成与秘密揭示原子绑定',
                '不需要私钥',
                '支持量子计算'
            ],
            correctAnswers: [1],
            explanation: '适配器签名的核心特性是将签名的有效性与一个秘密值绑定。知道秘密才能完成签名，而完成的签名发布后任何人都可以提取出秘密。',
            difficulty: 'easy'
        },
        {
            id: 'as_2',
            type: 'single',
            question: '在适配器签名中，"预签名"(pre-signature) 是什么？',
            options: [
                '一个完全有效的签名',
                '一个无效的签名，需要秘密值才能完成',
                '签名的哈希值',
                '公钥的一部分'
            ],
            correctAnswers: [1],
            explanation: '预签名是一个"不完整"的签名 s\' = s - t，本身无效，但可以验证其正确构造。只有添加秘密值 t 后才能得到有效签名 s。',
            difficulty: 'easy'
        },
        {
            id: 'as_3',
            type: 'single',
            question: '适配器签名相比 HTLC 的主要优势是什么？',
            options: [
                '更快的确认时间',
                '更低的手续费',
                '链上隐私性更好，看起来像普通交易',
                '不需要网络连接'
            ],
            correctAnswers: [2],
            explanation: '适配器签名完成后的交易在链上看起来就像普通的 Schnorr 签名交易，无法区分是否参与了原子交换或条件支付，隐私性更好。',
            difficulty: 'medium'
        },
        {
            id: 'as_4',
            type: 'single',
            question: '为什么适配器签名能实现无信任原子交换？',
            options: [
                '因为使用了智能合约',
                '因为签名发布自动揭示秘密，另一方可以提取',
                '因为有可信第三方担保',
                '因为使用了时间锁'
            ],
            correctAnswers: [1],
            explanation: '当一方发布完整签名取走资产时，另一方可以从链上的签名中提取秘密（t = s - s\'），然后用这个秘密完成自己的签名取走对方的资产。',
            difficulty: 'medium'
        },
        {
            id: 'as_5',
            type: 'trueFalse',
            question: '适配器签名可以在使用 ECDSA 的传统比特币交易中使用。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '虽然理论上 ECDSA 也可以构造适配器签名，但实现复杂且效率低。Schnorr 签名的线性特性使适配器签名更加简洁高效，这也是 Taproot 升级的重要意义。',
            difficulty: 'hard'
        }
    ]
};

// 门限签名测验
export const thresholdQuiz: QuizData = {
    moduleId: 'threshold',
    moduleName: '门限签名',
    questions: [
        {
            id: 'ts_1',
            type: 'single',
            question: '门限签名与传统多签的主要区别是什么？',
            options: [
                '门限签名需要更多签名者',
                '门限签名在链上只显示为单个签名',
                '门限签名更不安全',
                '门限签名只能用于比特币'
            ],
            correctAnswers: [1],
            explanation: '门限签名的核心优势是链上只显示单个聚合签名，外部观察者无法区分这是单签还是多签交易，提供更好的隐私性和效率。',
            difficulty: 'easy'
        },
        {
            id: 'ts_2',
            type: 'single',
            question: 'Shamir 秘密分享基于什么数学原理？',
            options: [
                '大整数分解',
                '拉格朗日插值',
                '椭圆曲线离散对数',
                '哈希函数'
            ],
            correctAnswers: [1],
            explanation: 'Shamir 秘密分享使用拉格朗日插值定理：t 个点可以唯一确定一个 t-1 次多项式。秘密是多项式在 x=0 处的值。',
            difficulty: 'medium'
        },
        {
            id: 'ts_3',
            type: 'single',
            question: 'MuSig2 协议是什么类型的签名方案？',
            options: [
                't-of-n 门限签名',
                'n-of-n 多签',
                '单签',
                '环签名'
            ],
            correctAnswers: [1],
            explanation: 'MuSig2 是 n-of-n 多签方案，所有参与者必须协作才能生成有效签名。如果需要 t-of-n 门限，应使用 FROST 协议。',
            difficulty: 'easy'
        },
        {
            id: 'ts_4',
            type: 'single',
            question: 'FROST 协议相比 MuSig2 的主要优势是什么？',
            options: [
                '签名更小',
                '支持 t-of-n 门限，参与者可以离线',
                '不需要交互',
                '更安全'
            ],
            correctAnswers: [1],
            explanation: 'FROST 支持灵活的 t-of-n 门限签名，只需要门限数量的参与者在线即可完成签名，而 MuSig2 需要所有参与者都参与。',
            difficulty: 'medium'
        },
        {
            id: 'ts_5',
            type: 'trueFalse',
            question: '在门限签名方案中，完整的私钥在某个时刻必须被组装出来。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '门限签名的一个关键安全特性是完整私钥永远不需要在任何地方重建。每个参与者使用自己的份额直接计算部分签名，然后聚合成完整签名。',
            difficulty: 'hard'
        }
    ]
};

// 时间锁测验
export const timeLockQuiz: QuizData = {
    moduleId: 'timelock',
    moduleName: '时间锁',
    questions: [
        {
            id: 'tl_1',
            type: 'single',
            question: 'nLockTime 字段设置为 500,000,000 以下的值表示什么？',
            options: [
                'Unix 时间戳',
                '区块高度',
                '交易序列号',
                '手续费金额'
            ],
            correctAnswers: [1],
            explanation: 'nLockTime 的值小于 500,000,000 时被解释为区块高度，大于等于该值时被解释为 Unix 时间戳。这是比特币协议的约定。',
            difficulty: 'easy'
        },
        {
            id: 'tl_2',
            type: 'single',
            question: 'OP_CHECKLOCKTIMEVERIFY (CLTV) 与 nLockTime 的主要区别是什么？',
            options: [
                'CLTV 更快',
                'nLockTime 在交易级别，CLTV 在脚本级别',
                'CLTV 只支持时间戳',
                '没有区别'
            ],
            correctAnswers: [1],
            explanation: 'nLockTime 是交易级别的时间锁，在交易创建时设置。CLTV 是脚本操作码，允许在输出脚本中嵌入时间条件，更加灵活。',
            difficulty: 'medium'
        },
        {
            id: 'tl_3',
            type: 'single',
            question: 'OP_CHECKSEQUENCEVERIFY (CSV) 使用什么类型的时间锁？',
            options: [
                '绝对时间锁',
                '相对时间锁',
                '永久时间锁',
                '可取消时间锁'
            ],
            correctAnswers: [1],
            explanation: 'CSV 使用相对时间锁，时间从 UTXO 被创建（交易确认）开始计算，而不是从某个固定时间点。这对于闪电网络等应用非常重要。',
            difficulty: 'easy'
        },
        {
            id: 'tl_4',
            type: 'single',
            question: '闪电网络中 HTLC 使用时间锁的目的是什么？',
            options: [
                '增加交易速度',
                '降低手续费',
                '确保资金在超时后可以退回',
                '隐藏交易金额'
            ],
            correctAnswers: [2],
            explanation: '在 HTLC 中，时间锁确保如果支付未在规定时间内完成（如接收方未揭示原像），发送方可以在超时后取回资金。',
            difficulty: 'medium'
        },
        {
            id: 'tl_5',
            type: 'trueFalse',
            question: '使用 CSV 相对时间锁时，锁定时间是从交易广播到网络时开始计算。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'CSV 的相对时间是从包含该 UTXO 的交易被确认（打包进区块）时开始计算，而不是广播时。只有交易被确认后，倒计时才开始。',
            difficulty: 'hard'
        }
    ]
};

// PSBT 测验
export const psbtQuiz: QuizData = {
    moduleId: 'psbt',
    moduleName: 'PSBT 部分签名交易',
    questions: [
        {
            id: 'psbt_1',
            type: 'single',
            question: 'PSBT 最初在哪个 BIP 中定义？',
            options: ['BIP-141', 'BIP-174', 'BIP-340', 'BIP-370'],
            correctAnswers: [1],
            explanation: 'PSBT (Partially Signed Bitcoin Transaction) 最初在 BIP-174 中定义。BIP-370 是 PSBT 版本 2 的规范，增加了对更多功能的支持。',
            difficulty: 'easy'
        },
        {
            id: 'psbt_2',
            type: 'single',
            question: 'PSBT 解决了什么核心问题？',
            options: [
                '提高交易速度',
                '降低交易费用',
                '多方参与者协作签名交易',
                '隐藏交易金额'
            ],
            correctAnswers: [2],
            explanation: 'PSBT 的核心目的是让多个参与者（如多签钱包的持有者、离线签名设备）可以协作构建和签名同一笔交易，无需信任也无需泄露私钥。',
            difficulty: 'easy'
        },
        {
            id: 'psbt_3',
            type: 'single',
            question: 'PSBT 工作流程中，"Finalizer" 的职责是什么？',
            options: [
                '创建交易基础结构',
                '提供签名',
                '将所有签名组合成完整的 scriptSig/witness',
                '广播交易到网络'
            ],
            correctAnswers: [2],
            explanation: 'Finalizer 负责收集所有签名，将它们组合成最终的解锁脚本（scriptSig 或 witness），使交易可以被验证和广播。',
            difficulty: 'medium'
        },
        {
            id: 'psbt_4',
            type: 'single',
            question: '在 PSBT 结构中，为什么要为每个输入包含 UTXO 信息？',
            options: [
                '为了加快广播速度',
                '让签名者无需查询链上数据就能验证和签名',
                '为了压缩交易体积',
                '这是中本聪的原始设计'
            ],
            correctAnswers: [1],
            explanation: 'PSBT 包含 UTXO 信息（如金额、锁定脚本）让离线签名设备可以验证交易细节（如手续费是否合理），无需连接网络查询区块链。',
            difficulty: 'medium'
        },
        {
            id: 'psbt_5',
            type: 'trueFalse',
            question: '一个完成的 PSBT 可以直接广播到比特币网络。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'PSBT 是一种用于构建和签名交易的容器格式，不能直接广播。必须先经过 "Extract" 步骤，从 PSBT 中提取出标准的比特币交易格式后才能广播。',
            difficulty: 'hard'
        }
    ]
};

// 原子交换测验
export const atomicSwapQuiz: QuizData = {
    moduleId: 'atomicswap',
    moduleName: '原子交换',
    questions: [
        {
            id: 'as_1',
            type: 'single',
            question: '原子交换中的"原子性"是指什么？',
            options: [
                '交换速度非常快',
                '交换要么完全成功要么完全失败',
                '使用原子级别的加密',
                '只能交换小额资金'
            ],
            correctAnswers: [1],
            explanation: '原子性意味着交换是不可分割的：要么双方都得到对方的资产，要么双方都保留自己的资产，不存在一方得到资产而另一方损失的情况。',
            difficulty: 'easy'
        },
        {
            id: 'as_2',
            type: 'single',
            question: 'HTLC 中的两个关键机制是什么？',
            options: [
                '公钥和私钥',
                '哈希锁和时间锁',
                '签名和验证',
                '加密和解密'
            ],
            correctAnswers: [1],
            explanation: 'HTLC (Hash Time-Locked Contract) 结合了哈希锁（需要知道秘密才能解锁）和时间锁（超时后可以退款），共同保证交换的安全性。',
            difficulty: 'easy'
        },
        {
            id: 'as_3',
            type: 'single',
            question: '在原子交换中，为什么 Alice 的时间锁必须比 Bob 的长？',
            options: [
                '因为 Alice 是发起者',
                '保证 Bob 有足够时间在看到秘密后取走资金',
                '为了节省手续费',
                '这只是一个惯例，没有技术原因'
            ],
            correctAnswers: [1],
            explanation: '如果 Alice 的时间锁和 Bob 一样短或更短，Alice 可能在 Bob 取款前就申请退款，导致 Bob 损失资金。更长的时间锁确保 Bob 有足够时间响应。',
            difficulty: 'medium'
        },
        {
            id: 'as_4',
            type: 'single',
            question: '原子交换相比中心化交易所的主要优势是什么？',
            options: [
                '交易速度更快',
                '手续费更低',
                '用户保持对私钥的控制权',
                '支持更多交易对'
            ],
            correctAnswers: [2],
            explanation: '原子交换让用户在整个过程中始终控制自己的私钥和资金，不需要将资产存入可能被黑客攻击或跑路的第三方平台。',
            difficulty: 'medium'
        },
        {
            id: 'as_5',
            type: 'trueFalse',
            question: '使用相同哈希值的链上 HTLC 原子交换可以实现完美的隐私保护。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '链上 HTLC 使用相同的哈希值，观察者可以通过匹配不同链上的哈希值来关联交易，识别出这是一笔原子交换。适配器签名方案可以提供更好的隐私。',
            difficulty: 'hard'
        }
    ]
};

// 区块结构测验
export const blockStructureQuiz: QuizData = {
    moduleId: 'blockstructure',
    moduleName: '区块结构',
    questions: [
        {
            id: 'bs_1',
            type: 'single',
            question: '比特币区块头的大小是多少字节？',
            options: ['32 字节', '64 字节', '80 字节', '256 字节'],
            correctAnswers: [2],
            explanation: '比特币区块头固定为 80 字节，包含 6 个字段：版本(4)、前区块哈希(32)、默克尔根(32)、时间戳(4)、难度目标(4)、随机数(4)。',
            difficulty: 'easy'
        },
        {
            id: 'bs_2',
            type: 'single',
            question: 'Coinbase 交易有什么特殊之处？',
            options: [
                '它是区块中最后一笔交易',
                '它可以凭空创造比特币',
                '它不需要签名',
                '它的输出立即可用'
            ],
            correctAnswers: [1],
            explanation: 'Coinbase 交易是区块的第一笔交易，是唯一可以凭空创造比特币的交易，用于支付矿工的区块奖励。它需要等待 100 个区块确认后才能花费。',
            difficulty: 'easy'
        },
        {
            id: 'bs_3',
            type: 'single',
            question: '区块头中的 "Previous Block Hash" 有什么作用？',
            options: [
                '加快区块验证速度',
                '将区块链接成不可篡改的链',
                '存储前一个区块的交易',
                '记录挖矿难度'
            ],
            correctAnswers: [1],
            explanation: 'Previous Block Hash 将每个区块与前一个区块链接起来。如果修改任何历史区块，其哈希会改变，导致后续所有区块的 Previous Hash 失效，这就是区块链不可篡改的原因。',
            difficulty: 'medium'
        },
        {
            id: 'bs_4',
            type: 'single',
            question: '区块奖励多久减半一次？',
            options: [
                '每 100,000 个区块',
                '每 210,000 个区块',
                '每年一次',
                '每 500,000 个区块'
            ],
            correctAnswers: [1],
            explanation: '比特币区块奖励每 210,000 个区块减半一次，大约每 4 年发生一次。从最初的 50 BTC 开始，已经减半到目前的 3.125 BTC（2024年后）。',
            difficulty: 'medium'
        },
        {
            id: 'bs_5',
            type: 'trueFalse',
            question: '在 SegWit 升级后，比特币区块的最大大小仍然是 1 MB。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'SegWit 升级引入了"区块权重"概念，最大限制从 1 MB 变为 4 百万权重单位(WU)。实际区块大小可以超过 1 MB，通常在 1.5-2 MB 之间。',
            difficulty: 'hard'
        }
    ]
};

// CoinJoin 混币测验
export const coinJoinQuiz: QuizData = {
    moduleId: 'coinjoin',
    moduleName: 'CoinJoin 混币',
    questions: [
        {
            id: 'cj_1',
            type: 'single',
            question: 'CoinJoin 的核心隐私机制是什么？',
            options: [
                '加密交易金额',
                '隐藏交易地址',
                '将多个用户的交易合并，使输入输出无法关联',
                '使用匿名网络广播交易'
            ],
            correctAnswers: [2],
            explanation: 'CoinJoin 通过将多个用户的交易输入和输出合并到同一笔交易中，使得外部观察者无法确定哪个输入对应哪个输出，从而实现隐私保护。',
            difficulty: 'easy'
        },
        {
            id: 'cj_2',
            type: 'single',
            question: '在 CoinJoin 中，"匿名集"(Anonymity Set) 指的是什么？',
            options: [
                '参与混币的总金额',
                '某个输出可能来自的输入数量',
                '混币交易的手续费',
                '混币轮次数量'
            ],
            correctAnswers: [1],
            explanation: '匿名集是指在一笔 CoinJoin 交易中，某个输出可能来自的输入数量。匿名集越大，追踪难度越高，隐私保护越强。',
            difficulty: 'easy'
        },
        {
            id: 'cj_3',
            type: 'single',
            question: '为什么 CoinJoin 通常要求使用相同金额的输入和输出？',
            options: [
                '降低交易费用',
                '加快交易确认',
                '使所有输出无法区分，增强隐私',
                '满足比特币协议要求'
            ],
            correctAnswers: [2],
            explanation: '如果所有输出金额相同，观察者就无法通过金额来区分和关联输入输出。不同金额的输出可能暴露交易图谱。',
            difficulty: 'medium'
        },
        {
            id: 'cj_4',
            type: 'single',
            question: '以下哪种行为会破坏 CoinJoin 的隐私效果？',
            options: [
                '使用 Tor 网络',
                '多轮混币',
                '将多个混币后的 UTXO 合并使用',
                '等待一段时间后再使用混币资金'
            ],
            correctAnswers: [2],
            explanation: '将多个混币后的 UTXO 合并使用会暴露这些 UTXO 属于同一人，从而使链上分析工具能够将它们关联起来，破坏混币效果。',
            difficulty: 'medium'
        },
        {
            id: 'cj_5',
            type: 'trueFalse',
            question: 'CoinJoin 协调者可以窃取参与者的比特币。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'CoinJoin 是无需信任的协议。每个参与者只有在验证自己的输入和输出都正确存在后才会签名。协调者无法修改交易窃取资金，因为任何更改都需要所有参与者重新签名。',
            difficulty: 'hard'
        }
    ]
};

// MuSig2 聚合签名测验
export const musig2Quiz: QuizData = {
    moduleId: 'musig2',
    moduleName: 'MuSig2 聚合签名',
    questions: [
        {
            id: 'musig2_1',
            type: 'single',
            question: 'MuSig2 是 MuSig 协议的改进版，主要改进了什么？',
            options: [
                '从 3 轮通信减少到 2 轮',
                '从 2 轮通信减少到 1 轮',
                '增加了更多参与者支持',
                '提高了签名大小'
            ],
            correctAnswers: [0],
            explanation: 'MuSig2 将通信轮数从 MuSig 的 3 轮减少到 2 轮，通过使用两个 nonce 允许预计算，同时保持安全性。',
            difficulty: 'easy'
        },
        {
            id: 'musig2_2',
            type: 'single',
            question: 'MuSig2 相比传统多签的主要优势是什么？',
            options: [
                '支持更多参与者',
                '签名更大以提供更高安全性',
                '生成的签名与单签完全相同',
                '不需要网络通信'
            ],
            correctAnswers: [2],
            explanation: 'MuSig2 的聚合签名在链上看起来与普通单人 Schnorr 签名完全相同，外部观察者无法区分这是多签交易，提供更好的隐私和更低的费用。',
            difficulty: 'easy'
        },
        {
            id: 'musig2_3',
            type: 'single',
            question: '为什么 MuSig2 需要密钥聚合系数 aᵢ = H(L, Pᵢ)？',
            options: [
                '提高计算效率',
                '防止 Rogue Key 攻击',
                '减少签名大小',
                '支持更多参与者'
            ],
            correctAnswers: [1],
            explanation: '密钥聚合系数防止 Rogue Key 攻击。没有它，恶意参与者可以选择特定的公钥使聚合公钥变成他单独控制的，从而窃取资金。',
            difficulty: 'medium'
        },
        {
            id: 'musig2_4',
            type: 'single',
            question: 'MuSig2 使用两个 nonce 的目的是什么？',
            options: [
                '增加随机性',
                '允许 nonce 预计算，减少在线轮数',
                '兼容旧版钱包',
                '减少签名大小'
            ],
            correctAnswers: [1],
            explanation: '双 nonce 设计允许参与者在知道要签名的消息之前预先生成和交换 nonce，使得签名过程只需要一轮在线通信。',
            difficulty: 'medium'
        },
        {
            id: 'musig2_5',
            type: 'trueFalse',
            question: 'MuSig2 支持 t-of-n 门限签名，允许任意 t 个参与者完成签名。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: 'MuSig2 是 n-of-n 协议，要求所有参与者都必须参与签名。如果需要 t-of-n 门限签名，应该使用 FROST 协议。',
            difficulty: 'hard'
        }
    ]
};

// Miniscript 测验
export const miniscriptQuiz: QuizData = {
    moduleId: 'miniscript',
    moduleName: 'Miniscript 策略脚本',
    questions: [
        {
            id: 'ms_1',
            type: 'single',
            question: 'Miniscript 是什么？',
            options: [
                '一种新的脚本语言',
                '比特币脚本的可分析子集表示',
                '智能合约平台',
                '交易签名算法'
            ],
            correctAnswers: [1],
            explanation: 'Miniscript 不是新语言，而是现有比特币脚本的一种结构化表示方式，让钱包软件能够自动分析脚本属性，如见证大小、花费条件等。',
            difficulty: 'easy'
        },
        {
            id: 'ms_2',
            type: 'single',
            question: 'Miniscript 的三层抽象从高到低分别是什么？',
            options: [
                'Script → Miniscript → Policy',
                'Policy → Miniscript → Script',
                'Miniscript → Policy → Script',
                'Policy → Script → Miniscript'
            ],
            correctAnswers: [1],
            explanation: 'Policy 是最高层的策略描述，Miniscript 是中间层的结构化表示，Bitcoin Script 是最底层的实际执行代码。',
            difficulty: 'easy'
        },
        {
            id: 'ms_3',
            type: 'single',
            question: 'Miniscript 解决的核心问题是什么？',
            options: [
                '提高交易速度',
                '让脚本可被自动分析和验证',
                '降低交易费用',
                '增加脚本功能'
            ],
            correctAnswers: [1],
            explanation: 'Miniscript 的主要目的是让复杂脚本变得可分析：自动计算见证大小、推导所有花费路径、验证脚本是否符合预期策略等。',
            difficulty: 'medium'
        },
        {
            id: 'ms_4',
            type: 'single',
            question: '在 Policy 语言中，"and(pk(A),or(pk(B),after(100)))" 表示什么？',
            options: [
                'A 或 B 签名',
                'A 签名，且（B 签名或 100 区块后）',
                'A 和 B 都签名，或 100 区块后',
                'A 签名后 100 区块'
            ],
            correctAnswers: [1],
            explanation: '这个策略要求 A 必须签名，同时满足：B 签名或等到区块高度 100 之后。这种模式常用于带时间锁备份的多签。',
            difficulty: 'medium'
        },
        {
            id: 'ms_5',
            type: 'trueFalse',
            question: 'Miniscript 编译器总是能找到最优的脚本实现。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '找到最优脚本是 NP 难问题。Miniscript 编译器使用启发式算法找到足够好的解，但不保证是绝对最优的。',
            difficulty: 'hard'
        }
    ]
};

// 侧链测验
export const sidechainsQuiz: QuizData = {
    moduleId: 'sidechains',
    moduleName: '侧链',
    questions: [
        {
            id: 'sc_1',
            type: 'single',
            question: '侧链通过什么机制与比特币主链连接？',
            options: [
                '智能合约',
                '双向锚定 (Two-Way Peg)',
                '合并挖矿',
                '状态通道'
            ],
            correctAnswers: [1],
            explanation: '侧链通过双向锚定与主链连接。用户将 BTC 发送到主链上的锁定地址，侧链释放等量代币；反向操作则解锁主链 BTC。',
            difficulty: 'easy'
        },
        {
            id: 'sc_2',
            type: 'single',
            question: 'Peg-In 过程中，为什么需要等待大量区块确认？',
            options: [
                '提高交易速度',
                '降低手续费',
                '防止主链重组导致的双花',
                '验证用户身份'
            ],
            correctAnswers: [2],
            explanation: '等待足够的确认（通常 100 个）确保主链交易不会因为链重组而被回滚。如果确认数太少，攻击者可能在侧链获得代币后使主链交易无效。',
            difficulty: 'medium'
        },
        {
            id: 'sc_3',
            type: 'single',
            question: '联邦侧链的主要安全假设是什么？',
            options: [
                '矿工是诚实的',
                '联邦成员的多数是诚实的',
                '用户保管好私钥',
                '网络不会拥堵'
            ],
            correctAnswers: [1],
            explanation: '联邦侧链依赖一组联邦成员控制双向锚定。只要联邦成员的多数是诚实的（例如 11-of-15），系统就是安全的。',
            difficulty: 'medium'
        },
        {
            id: 'sc_4',
            type: 'single',
            question: '以下哪个是著名的比特币联邦侧链项目？',
            options: [
                'Ethereum',
                'Liquid Network',
                'Solana',
                'Polkadot'
            ],
            correctAnswers: [1],
            explanation: 'Liquid Network 是 Blockstream 开发的联邦侧链，专注于交易所之间的快速结算、保密交易和资产发行。',
            difficulty: 'easy'
        },
        {
            id: 'sc_5',
            type: 'trueFalse',
            question: '侧链的安全性与比特币主链完全相同。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '侧链有自己的安全模型，可能不如主链。例如联邦侧链依赖联邦诚实，驱动链依赖矿工不串通。侧链的安全性取决于其具体设计。',
            difficulty: 'hard'
        }
    ]
};

// BIP39 助记词测验
export const bip39Quiz: QuizData = {
    moduleId: 'bip39',
    moduleName: 'BIP39 助记词',
    questions: [
        {
            id: 'bip39_1',
            type: 'single',
            question: 'BIP39 标准词表包含多少个单词？',
            options: ['1024', '2048', '4096', '8192'],
            correctAnswers: [1],
            explanation: 'BIP39 使用 2048 个单词的词表。每个单词代表 11 位信息（2^11 = 2048），这使得助记词可以精确编码任意长度的熵。',
            difficulty: 'easy'
        },
        {
            id: 'bip39_2',
            type: 'single',
            question: '12 个助记词对应多少位熵？',
            options: ['96 位', '128 位', '160 位', '256 位'],
            correctAnswers: [1],
            explanation: '12 个单词 × 11 位 = 132 位，其中 128 位是熵，4 位是校验和（128/32=4）。校验和用于检测输入错误。',
            difficulty: 'easy'
        },
        {
            id: 'bip39_3',
            type: 'single',
            question: 'BIP39 从助记词派生种子使用的算法是什么？',
            options: ['SHA-256', 'RIPEMD-160', 'PBKDF2-HMAC-SHA512', 'Scrypt'],
            correctAnswers: [2],
            explanation: 'BIP39 使用 PBKDF2-HMAC-SHA512 算法，迭代 2048 次，将助记词和可选密码转换为 512 位种子。',
            difficulty: 'medium'
        },
        {
            id: 'bip39_4',
            type: 'single',
            question: 'BIP39 可选密码（passphrase）的主要作用是什么？',
            options: [
                '加快种子生成速度',
                '减少助记词数量',
                '提供额外的安全层和可否认性',
                '简化备份流程'
            ],
            correctAnswers: [2],
            explanation: '可选密码提供额外保护：即使助记词泄露，没有密码也无法访问资金。还可以创建"诱饵钱包"（不同密码产生不同钱包）实现可否认性。',
            difficulty: 'medium'
        },
        {
            id: 'bip39_5',
            type: 'trueFalse',
            question: '输入错误的 BIP39 可选密码会显示错误提示。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '任何密码都会生成一个有效的种子和钱包，只是不同密码对应不同钱包。没有"错误密码"的概念，这也是为什么忘记密码会永久丢失资金。',
            difficulty: 'hard'
        }
    ]
};

// 币种选择测验
export const coinSelectionQuiz: QuizData = {
    moduleId: 'coinselection',
    moduleName: '币种选择',
    questions: [
        {
            id: 'cs_1',
            type: 'single',
            question: '币种选择算法的主要目标是什么？',
            options: [
                '选择最老的 UTXO',
                '最小化浪费（手续费和找零）',
                '选择最大的 UTXO',
                '随机选择'
            ],
            correctAnswers: [1],
            explanation: '币种选择的目标是找到 UTXO 组合，在满足支付金额的同时最小化浪费，包括手续费（取决于输入数量）和产生的找零。',
            difficulty: 'easy'
        },
        {
            id: 'cs_2',
            type: 'single',
            question: 'Bitcoin Core 默认使用哪种币种选择算法？',
            options: [
                '最大优先',
                '最小优先',
                'Branch and Bound',
                '随机选择'
            ],
            correctAnswers: [2],
            explanation: 'Bitcoin Core 优先使用 Branch and Bound 算法尝试找到无找零的精确匹配。如果失败，会回退到 Knapsack 算法。',
            difficulty: 'medium'
        },
        {
            id: 'cs_3',
            type: 'single',
            question: '什么是"粉尘"(Dust) UTXO？',
            options: [
                '被标记为垃圾的 UTXO',
                '金额太小，花费它的手续费超过其价值',
                '来自混币交易的 UTXO',
                '超过 1 年未使用的 UTXO'
            ],
            correctAnswers: [1],
            explanation: '粉尘是指金额非常小（通常 < 546 sats）的 UTXO，花费它所需的手续费可能超过其本身价值，使其经济上不可行。',
            difficulty: 'easy'
        },
        {
            id: 'cs_4',
            type: 'single',
            question: '将多个 UTXO 合并使用会带来什么隐私风险？',
            options: [
                '泄露 IP 地址',
                '暴露这些 UTXO 属于同一人',
                '泄露私钥',
                '没有隐私风险'
            ],
            correctAnswers: [1],
            explanation: '当多个 UTXO 作为同一交易的输入时，链上分析假设它们属于同一人（共同输入所有权假设），这会将不同来源的资金关联起来。',
            difficulty: 'medium'
        },
        {
            id: 'cs_5',
            type: 'trueFalse',
            question: '在高费率期间，应该优先使用小额 UTXO 来整合它们。',
            options: ['正确', '错误'],
            correctAnswers: [1],
            explanation: '高费率期间应该减少输入数量以降低费用。整合小额 UTXO 应该在低费率期间进行，此时额外输入的成本较低。',
            difficulty: 'hard'
        }
    ]
};

// All quizzes export
export const allQuizzes: Record<string, QuizData> = {
    ecc: eccQuiz,
    hdwallet: hdWalletQuiz,
    utxo: utxoQuiz,
    script: scriptQuiz,
    lightning: lightningQuiz,
    segwit: segwitQuiz,
    taproot: taprootQuiz,
    consensus: consensusQuiz,
    mining: miningQuiz,
    pow: powQuiz,
    address: addressQuiz,
    mempool: mempoolQuiz,
    p2p: p2pQuiz,
    rbf: rbfQuiz,
    fork: forkQuiz,
    schnorr: schnorrQuiz,
    spv: spvQuiz,
    cold: coldQuiz,
    privacy: privacyQuiz,
    history: historyQuiz,
    fullnode: fullnodeQuiz,
    lamport: lamportQuiz,
    quantum: quantumQuiz,
    attack51: attack51Quiz,
    merkle: merkleTreeQuiz,
    multisig: multiSigQuiz,
    transaction: transactionQuiz,
    timelock: timeLockQuiz,
    threshold: thresholdQuiz,
    adaptor: adaptorQuiz,
    psbt: psbtQuiz,
    atomicswap: atomicSwapQuiz,
    blockstructure: blockStructureQuiz,
    coinjoin: coinJoinQuiz,
    musig2: musig2Quiz,
    miniscript: miniscriptQuiz,
    sidechains: sidechainsQuiz,
    bip39: bip39Quiz,
    coinselection: coinSelectionQuiz,
};

export const getQuizByModule = (moduleId: string): QuizData | undefined => {
    return allQuizzes[moduleId];
};
