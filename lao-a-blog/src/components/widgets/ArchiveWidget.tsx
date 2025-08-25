'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Archive } from 'lucide-react'
import { Article } from '@/lib/content-api'
import { useEffect, useState } from 'react'

export default function ArchiveWidget() {
  const [posts, setPosts] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPosts() {
      try {
        const response = await fetch('/api/articles')
        const data = await response.json()
        setPosts(data.articles || [])
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])
  
  // 按年月分组
  const archiveData = posts.reduce((acc, post) => {
    const date = parseISO(post.publishedAt)
    const yearMonth = format(date, 'yyyy-MM', { locale: zhCN })
    const yearMonthDisplay = format(date, 'yyyy年MM月', { locale: zhCN })
    
    if (!acc[yearMonth]) {
      acc[yearMonth] = {
        display: yearMonthDisplay,
        count: 0,
        posts: []
      }
    }
    
    acc[yearMonth].count++
    acc[yearMonth].posts.push(post)
    
    return acc
  }, {} as Record<string, { display: string; count: number; posts: Article[] }>)

  // 按时间倒序排列
  const sortedArchive = Object.entries(archiveData)
    .sort(([a], [b]) => b.localeCompare(a))
    .slice(0, 12) // 显示最近12个月

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Archive className="h-5 w-5 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-900">文章归档</h3>
        </div>
        <div className="text-gray-500 text-sm">加载中...</div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Archive className="h-5 w-5 text-green-500" />
        <h3 className="text-lg font-semibold text-gray-900">文章归档</h3>
      </div>
      
      <div className="space-y-2">
        {sortedArchive.map(([yearMonth, data]) => (
          <Link
            key={yearMonth}
            href={`/archive/${yearMonth}`}
            className="flex items-center justify-between p-2 rounded hover:bg-gray-50 transition-colors group"
          >
            <span className="text-gray-700 group-hover:text-blue-600 transition-colors">
              {data.display}
            </span>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {data.count}
            </span>
          </Link>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-100">
        <Link
          href="/archive"
          className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
        >
          查看所有归档 →
        </Link>
      </div>
    </div>
  )
}
