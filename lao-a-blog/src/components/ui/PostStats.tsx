'use client'

import { useEffect, useState, useCallback } from 'react'
import { Eye, Heart } from 'lucide-react'

interface PostStatsProps {
  slug: string
  showStats?: boolean
}

interface StatsData {
  views: number
  likes: number
  userLiked?: boolean
}

export default function PostStats({ slug, showStats = true }: PostStatsProps) {
  const [stats, setStats] = useState<StatsData>({ views: 0, likes: 0 })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // 加载统计数据
  const loadStats = useCallback(async () => {
    try {
      setError(null)
      const response = await fetch(`/api/posts/${slug}/stats`)
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('加载统计数据失败')
      }
    } catch (error) {
      console.error('Error loading stats:', error)
      setError('网络错误')
    }
  }, [slug])

  useEffect(() => {
    loadStats()
  }, [loadStats])

  // 处理点赞
  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    setError(null)
    
    try {
      const action = stats.userLiked ? 'unlike' : 'like'
      const response = await fetch(`/api/posts/${slug}/stats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
      } else {
        setError('操作失败，请重试')
      }
    } catch (error) {
      console.error('Error updating like:', error)
      setError('网络错误，请重试')
    } finally {
      setIsLoading(false)
    }
  }

  // 格式化数字显示
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  if (!showStats) return null

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <Eye className="h-4 w-4" />
          <span>{formatNumber(stats.views)}</span>
        </div>
        <button
          onClick={handleLike}
          disabled={isLoading}
          className={`flex items-center gap-1 transition-colors ${
            stats.userLiked 
              ? 'text-red-500 hover:text-red-600' 
              : 'hover:text-red-500'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          title={stats.userLiked ? '取消点赞' : '点赞'}
        >
          <Heart className={`h-4 w-4 ${stats.userLiked ? 'fill-current' : ''}`} />
          <span>{formatNumber(stats.likes)}</span>
          {isLoading && (
            <div className="ml-1 w-3 h-3 border border-red-500 border-t-transparent rounded-full animate-spin"></div>
          )}
        </button>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
          {error}
        </div>
      )}
    </div>
  )
}
