'use client'

import { useEffect } from 'react'

interface PostViewTrackerProps {
  slug: string
}

export default function PostViewTracker({ slug }: PostViewTrackerProps) {
  useEffect(() => {
    const trackView = async () => {
      const viewKey = `viewed_${slug}`
      if (sessionStorage.getItem(viewKey)) return

      try {
        const response = await fetch(`/api/posts/${slug}/stats`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'view' }),
        })

        if (response.ok) {
          sessionStorage.setItem(viewKey, 'true')
        }
      } catch (error) {
        console.error('Error tracking view:', error)
      }
    }

    const timer = setTimeout(trackView, 2000)
    return () => clearTimeout(timer)
  }, [slug])

  return null
}
