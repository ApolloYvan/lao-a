'use client'

import { useEffect, useState } from 'react'
import { Eye, Heart } from 'lucide-react'

interface PostStatsProps {
  slug: string
  showStats?: boolean
}

export default function PostStats({ slug, showStats = true }: PostStatsProps) {
  const [stats, setStats] = useState({ views: 0, likes: 0 })
  const [isLiked, setIsLiked] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // 加载统计数据
  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetch(`/api/posts/${slug}/stats`)
        if (response.ok) {
          const data = await response.json()
          setStats(data)
        }
      } catch (error) {
        console.error('Error loading stats:', error)
      }
    }

    loadStats()
  }, [slug])

  // 处理点赞
  const handleLike = async () => {
    if (isLoading) return

    setIsLoading(true)
    try {
      const action = isLiked ? 'unlike' : 'like'
      const response = await fetch(`/api/posts/${slug}/stats`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action }),
      })

      if (response.ok) {
        const data = await response.json()
        setStats(data)
        setIsLiked(!isLiked)
      }
    } catch (error) {
      console.error('Error updating like:', error)
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
    <div className="flex items-center gap-4 text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <Eye className="h-4 w-4" />
        <span>{formatNumber(stats.views)}</span>
      </div>
      <button
        onClick={handleLike}
        disabled={isLoading}
        className={`flex items-center gap-1 transition-colors ${
          isLiked 
            ? 'text-red-500 hover:text-red-600' 
            : 'hover:text-red-500'
        } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
        <span>{formatNumber(stats.likes)}</span>
      </button>
    </div>
  )
}
