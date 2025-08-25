'use client'

import Link from 'next/link'
import { Tag } from 'lucide-react'
import { useEffect, useState } from 'react'

interface TagWithCount {
  tag: string
  count: number
}

export default function TagCloud() {
  const [tags, setTags] = useState<TagWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchTags() {
      try {
        const response = await fetch('/api/articles')
        const data = await response.json()
        const articles = data.articles || []
        
        // 计算标签统计
        const tagCounts: Record<string, number> = {}
        articles.forEach((article: { tags: string[] }) => {
          article.tags.forEach((tag: string) => {
            tagCounts[tag] = (tagCounts[tag] || 0) + 1
          })
        })
        
        const tagsWithCount = Object.entries(tagCounts)
          .map(([tag, count]) => ({ tag, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 20)
        
        setTags(tagsWithCount)
      } catch (error) {
        console.error('Error fetching tags:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTags()
  }, [])

  // 根据使用次数计算字体大小
  const getTagSize = (count: number, maxCount: number) => {
    const ratio = count / maxCount
    if (ratio > 0.8) return 'text-lg'
    if (ratio > 0.6) return 'text-base'
    if (ratio > 0.4) return 'text-sm'
    return 'text-xs'
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Tag className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">标签云</h3>
        </div>
        <div className="text-gray-500 text-sm">加载中...</div>
      </div>
    )
  }

  const maxCount = Math.max(...tags.map(t => t.count))

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Tag className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-semibold text-gray-900">标签云</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((item) => (
          <Link
            key={item.tag}
            href={`/tags/${item.tag}`}
            className={`
              inline-block px-3 py-1 bg-gray-100 hover:bg-blue-100 text-gray-700 hover:text-blue-700 
              rounded-full transition-colors font-medium
              ${getTagSize(item.count, maxCount)}
            `}
          >
            #{item.tag}
            <span className="ml-1 text-xs text-gray-500">
              ({item.count})
            </span>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/categories"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          查看所有标签 →
        </Link>
      </div>
    </div>
  )
}
