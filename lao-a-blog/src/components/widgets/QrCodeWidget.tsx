import Image from 'next/image'
import { AUTHOR_INFO } from '@/lib/constants'

export default function QrCodeWidget() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        如何联系我
      </h3>
      
      <h6 className="text-lg font-semibold text-gray-900 mb-4 text-center">
        公众号
      </h6>
      <div className="text-center">
        {/* QR Code */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={AUTHOR_INFO.qrcode}
            alt="微信二维码"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          扫码关注，获取最新技术文章推送
        </p>
        
        {/* WeChat ID */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
          微信号：{AUTHOR_INFO.social.wechat}
        </div>
      </div>


      <h6 className="text-lg font-semibold text-gray-900 mb-4 text-center mt-4">
         知识星球
      </h6>
      <div className="text-center">
        {/* QR Code */}
        <div className="relative w-32 h-32 mx-auto mb-4">
          <Image
            src={AUTHOR_INFO.qrcode}
            alt="微信二维码"
            fill
            className="rounded-lg object-cover"
          />
        </div>
        
        {/* Description */}
        <p className="text-gray-600 text-sm leading-relaxed">
          加入我的星球，获取最新消息
        </p>
        
        {/* WeChat ID */}
        <div className="mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700">
          微信号：{AUTHOR_INFO.social.wechat}
        </div>
      </div>
    </div>
  )
}
