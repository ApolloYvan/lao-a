'use client'

import Link from 'next/link'
import { formatDateShort } from '@/lib/utils'
import { TrendingUp } from 'lucide-react'
import { Article } from '@/lib/content-api'
import { useEffect, useState } from 'react'

export default function PopularPosts() {
  const [popularPosts, setPopularPosts] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPopularPosts() {
      try {
        const response = await fetch('/api/articles?limit=5')
        const data = await response.json()
        setPopularPosts(data.articles || [])
      } catch (error) {
        console.error('Error fetching popular posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPopularPosts()
  }, [])

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">热门文章</h3>
        </div>
        <div className="text-gray-500 text-sm">加载中...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="h-5 w-5 text-red-500" />
        <h3 className="text-lg font-semibold text-gray-900">热门文章</h3>
      </div>
      
      <div className="space-y-4">
        {popularPosts.map((post, index) => (
          <div key={post.slug} className="flex items-start gap-3">
            {/* Rank Number */}
            <div className={`
              flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
              ${index < 3 
                ? 'bg-red-500 text-white' 
                : 'bg-gray-200 text-gray-600'
              }
            `}>
              {index + 1}
            </div>
            
            {/* Post Info */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/posts/${post.slug}`}
                className="block text-sm font-medium text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 mb-1"
              >
                {post.title}
              </Link>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span>{formatDateShort(post.publishedAt)}</span>
                <span>•</span>
                <span>1.2k阅读</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/categories"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          查看更多 →
        </Link>
      </div>
    </div>
  )
}
