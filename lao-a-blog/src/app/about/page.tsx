import MainLayout from '@/components/layout/MainLayout'
import { AUTHOR_INFO } from '@/lib/constants'
import Image from 'next/image'
import { Mail, Github, ExternalLink, MessageCircle, CheckCircle } from 'lucide-react'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于',
  description: AUTHOR_INFO.bio,
}

export default function AboutPage() {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">关于我</h1>
          <p className="text-xl text-gray-600">
            了解我的技术背景和写作初衷
          </p>
        </div>

          <div className="grid gap-8 lg:grid-cols-3">
          {/* 作者信息卡片 */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={AUTHOR_INFO.avatar}
                    alt={AUTHOR_INFO.name}
                    fill
                    className="rounded-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {AUTHOR_INFO.name}
                </h2>
                <p className="text-gray-600 mb-4">{AUTHOR_INFO.title}</p>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {AUTHOR_INFO.bio}
                </p>
              </div>

              {/* 社交链接 */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 mb-3">联系我</h3>
                <div className="space-y-2">
                  <a
                    href={`mailto:${AUTHOR_INFO.social.email}`}
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Mail className="h-4 w-4" />
                    <span>邮箱</span>
                  </a>
                  <a
                    href={AUTHOR_INFO.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                  </a>
                  <a
                    href={AUTHOR_INFO.social.juejin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>稀土掘金</span>
                  </a>
                  <a
                    href={AUTHOR_INFO.social.csdn}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-orange-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>CSDN</span>
                  </a>
                  <a
                    href={AUTHOR_INFO.social.zhihu}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                  >
                    <ExternalLink className="h-4 w-4" />
                    <span>知乎</span>
                  </a>
                  <div className="flex items-center gap-2 text-gray-600">
                    <MessageCircle className="h-4 w-4" />
                    <span>微信: {AUTHOR_INFO.social.wechat}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 详细内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 个人介绍 */}
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <div className="prose prose-lg max-w-none">
                <h2>我是谁？</h2>
                <p>我是<strong>大厂码农老A</strong>｜一线大厂7年Java专家｜团队面试官</p>

                <p>在这里，不灌鸡汤，不聊高大上的理论，只分享关于技术、职场、成长的“B面”真话</p>

                <p>可提供1v1模拟面试、简历精修等深度服务，陪你走好从简历到Offer的“最后一公里”</p>

                <p>欢迎关注，看见一个更真实的程序员世界</p>

                <h2>这里有什么</h2>
                
                <h3>🔧 技术</h3>
                <p>侧重于大厂真实场景下的技术应用、源码解读、架构思考和排错经验。</p>
                
                <h3>💼 职场</h3>
                <p>聚焦于程序员的求职、面试、晋升、沟通协作、团队文化等现实问题。</p>
                
                <h3>🚀 成长</h3>
                <p>探讨程序员的学习方法、思维模式、职业规划和心态建设。</p>
                
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
                  <p className="text-blue-800 font-medium">
                    💡 我不是来当你的&ldquo;人生导师&rdquo;的，而是想成为你的&ldquo;师兄&rdquo;。
                    陪你走好程序员的每一步，喜欢说点真话。
                  </p>
                </div>
                
                <h2>关于这个博客</h2>
                <p>这个博客是用Cursor和Gemini搭建的，耗时2小时，感兴趣可以评论区留言，呼声高的话我出个教程</p>
              </div>
            </div>

            {/* 我能提供什么 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">我能提供什么</h2>
              <ul className="space-y-3 text-[15px]">
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-blue-600 mt-1 h-4 w-4 flex-shrink-0" />
                  <span><strong>1v1 职业咨询（付费）</strong>：定位梳理、转型路径、项目复盘、简历迭代与面试模拟。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-blue-600 mt-1 h-4 w-4 flex-shrink-0" />
                  <span><strong>工程与团队咨询</strong>：架构演进、效能提升、问题定义与技术方案评审。</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="text-blue-600 mt-1 h-4 w-4 flex-shrink-0" />
                  <span><strong>内容合作</strong>：课程共创、内部分享、品牌合作。</span>
                </li>
              </ul>
            </div>

            {/* 服务说明 */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold mb-3">服务说明（价格占位）</h2>
              <ul className="list-disc pl-6 text-[15px] text-gray-700 space-y-2">
                <li>1v1 咨询：60 分钟（价格占位），含会前问卷与会后纪要。</li>
                <li>深度陪跑：4 周（价格占位），含目标拆解、周度复盘与闭环总结。</li>
                <li>企业内训：按需定制（价格占位），可开具发票。</li>
              </ul>
            </div>


          </div>
        </div>
      </div>
    </MainLayout>
  )
}
