'use client'

import { useEffect } from 'react'

interface PostViewTrackerProps {
  slug: string
}

export default function PostViewTracker({ slug }: PostViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      try {
        // 检查是否已经记录过这次访问（使用sessionStorage）
        const viewKey = `viewed_${slug}`
        if (sessionStorage.getItem(viewKey)) {
          return
        }

        // 记录访问
        await fetch(`/api/posts/${slug}/stats`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ action: 'view' }),
        })

        // 标记为已访问
        sessionStorage.setItem(viewKey, 'true')
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    // 延迟一点时间再记录，确保用户真的在阅读
    const timer = setTimeout(trackView, 2000)

    return () => clearTimeout(timer)
  }, [slug])

  return null // 这个组件不渲染任何内容
}
