'use client'

import { useEffect, useState } from 'react'
import RelatedPosts from './RelatedPosts'
import { Article } from '@/lib/content-api'

interface AsyncRelatedPostsProps {
  currentSlug: string
  category: string
}

export default function AsyncRelatedPosts({ currentSlug, category }: AsyncRelatedPostsProps) {
  const [relatedPosts, setRelatedPosts] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchRelatedPosts = async () => {
      try {
        const response = await fetch('/api/articles')
        const data = await response.json()
        
        // API返回的是 { articles: Article[], pagination: {...} }
        const allPosts: Article[] = data.articles || []
        
        const filtered = allPosts
          .filter(p => p.slug !== currentSlug && p.category === category)
          .slice(0, 3)
        
        setRelatedPosts(filtered)
      } catch (error) {
        console.error('Error fetching related posts:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchRelatedPosts()
  }, [currentSlug, category])

  if (isLoading) {
    return (
      <div className="mt-12 pt-8 border-t border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">相关文章</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (relatedPosts.length === 0) {
    return null
  }

  return (
    <div className="mt-12 pt-8 border-t border-gray-200">
      <RelatedPosts posts={relatedPosts} />
    </div>
  )
}
