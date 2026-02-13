import React from 'react';
import { ArrowRight, RefreshCw, FileSignature } from 'lucide-react';
import { ECCComponentProps } from './types';
import ECCCard from './ECCCard';

interface IntroSectionProps extends ECCComponentProps {
  changeTab: (tab: string) => void;
}

/**
 * Introduction section for ECC demo
 * Explains the basics of Bitcoin's mathematical foundation
 */
const IntroSection: React.FC<IntroSectionProps> = ({ changeTab, isDarkMode }) => (
  <div className="space-y-8 animate-in fade-in duration-500">
    {/* Hero Banner */}
    <div className="bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl p-8 md:p-12 text-white shadow-xl">
      <h1 className="text-3xl md:text-5xl font-bold mb-6">比特币的数学魔法</h1>
      <p className="text-orange-50 text-lg md:text-xl max-w-2xl leading-relaxed">
        你可能听说过"私钥"和"公钥"，但它们到底是什么？
        <br />
        这不仅仅是密码，这是一场在数学曲线上的"台球游戏"。中本聪利用这种数学魔法，让你能证明"这笔钱是我的"，而不需要告诉任何人你的密码。
      </p>
      <button
        onClick={() => changeTab('curve')}
        className="mt-8 bg-white text-orange-700 hover:bg-orange-50 font-semibold py-3 px-6 rounded-lg shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
        aria-label="继续到曲线形状部分"
      >
        第一步：认识曲线 <ArrowRight className="h-5 w-5" aria-hidden="true" />
      </button>
    </div>

    {/* Feature Cards */}
    <div className="grid md:grid-cols-3 gap-6">
      <ECCCard
        title="中本聪的选择"
        icon={<div className="font-serif italic text-2xl">y² = x³ + 7</div>}
        isDarkMode={isDarkMode}
      >
        比特币没有使用复杂的参数，而是选择了一条极其简洁的曲线，名为{' '}
        <strong>secp256k1</strong>。它的形状决定了比特币的安全基石。
      </ECCCard>

      <ECCCard
        title="不可逆的魔法"
        icon={<RefreshCw className="h-8 w-8 text-orange-500" aria-hidden="true" />}
        isDarkMode={isDarkMode}
      >
        在这个曲线上，你可以轻松地将一个点"乘"上一亿次，但如果只给你结果，你绝对算不出原来的点乘了多少次。这就是私钥安全的秘密。
      </ECCCard>

      <ECCCard
        title="所有权证明"
        icon={<FileSignature className="h-8 w-8 text-orange-500" aria-hidden="true" />}
        isDarkMode={isDarkMode}
      >
        当你发送比特币时，你其实是在用私钥对交易信息进行"数学盖章"。矿工通过公钥验证这个章，确认钱确实是你花的，且金额未被篡改。
      </ECCCard>
    </div>
  </div>
);

export default IntroSection;
