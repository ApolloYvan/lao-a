import Image from 'next/image'
import Link from 'next/link'
import { Github, Mail, ExternalLink } from 'lucide-react'
import { AUTHOR_INFO } from '@/lib/constants'

export default function AuthorCard() {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="text-center">
        {/* Avatar */}
        <div className="relative w-20 h-20 mx-auto mb-4">
          <Image
            src={AUTHOR_INFO.avatar}
            alt={AUTHOR_INFO.name}
            fill
            className="rounded-full object-cover"
          />
        </div>
        
        {/* Name & Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {AUTHOR_INFO.name}
        </h3>
        <p className="text-blue-600 text-sm font-medium mb-3">
          {AUTHOR_INFO.title}
        </p>
        
        {/* Bio */}
        <p className="text-gray-600 text-sm leading-relaxed mb-4">
          {AUTHOR_INFO.bio}
        </p>
        
        {/* Social Links */}
        <div className="flex justify-center space-x-3">
          <Link
            href={AUTHOR_INFO.social.github}
            className="p-2 text-gray-600 hover:text-gray-900 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub"
          >
            <Github className="h-5 w-5" />
          </Link>
          <Link
            href={AUTHOR_INFO.social.juejin}
            className="p-2 text-gray-600 hover:text-blue-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="稀土掘金"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
          <Link
            href={AUTHOR_INFO.social.csdn}
            className="p-2 text-gray-600 hover:text-orange-500 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="CSDN"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
          <Link
            href={AUTHOR_INFO.social.zhihu}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
            title="知乎"
          >
            <ExternalLink className="h-5 w-5" />
          </Link>
          <Link
            href={`mailto:${AUTHOR_INFO.social.email}`}
            className="p-2 text-gray-600 hover:text-red-500 transition-colors"
            title="邮箱"
          >
            <Mail className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </div>
  )
}
