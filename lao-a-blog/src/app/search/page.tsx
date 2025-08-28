'use client'

import { useState, useEffect, Suspense } from 'react'
import { Search } from 'lucide-react'
import MainLayout from '@/components/layout/MainLayout'
import PostCard from '@/components/ui/PostCard'
import { contentSource } from '@/lib/content-api'
import { useSearchParams } from 'next/navigation'
import type { Article } from '@/lib/content-api'

function SearchContent() {
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get('q') || ''
  const [query, setQuery] = useState(initialQuery)
  const [results, setResults] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allPosts, setAllPosts] = useState<Article[]>([])

  // 获取所有文章
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const posts = await contentSource.getArticles()
        setAllPosts(posts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }
    fetchPosts()
  }, [])

  // 搜索逻辑
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    
    // 改进的搜索实现：支持分词搜索和更精确的匹配
    const searchResults = allPosts.filter(post => {
      const searchTerm = query.toLowerCase().trim()
      const title = post.title?.toLowerCase() || ''
      const summary = post.summary?.toLowerCase() || ''
      const content = post.content?.toLowerCase() || ''
      
      // 将搜索词按空格分词
      const searchWords = searchTerm.split(/\s+/).filter(word => word.length > 0)
      
      // 如果只有一个搜索词，使用原来的逻辑
      if (searchWords.length === 1) {
        return title.includes(searchWords[0]) || 
               summary.includes(searchWords[0]) || 
               content.includes(searchWords[0])
      }
      
      // 如果有多个搜索词，要求所有词都要匹配（AND 逻辑）
      return searchWords.every(word => 
        title.includes(word) || 
        summary.includes(word) || 
        content.includes(word)
      )
    })

    setResults(searchResults)
    setIsLoading(false)
  }, [query, allPosts])

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Search Header */}
        <div className="text-center py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            搜索文章
          </h1>
          <p className="text-gray-600 mb-8">
            在 {allPosts.length} 篇文章中搜索您感兴趣的内容
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="输入关键词搜索文章..."
                className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-lg"
                autoFocus
              />
            </div>
          </div>
        </div>

        {/* Search Results */}
        <div>
          {query && (
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                搜索结果
              </h2>
              <p className="text-gray-600">
                {isLoading ? '搜索中...' : `找到 ${results.length} 篇相关文章`}
              </p>
            </div>
          )}

          {isLoading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">正在搜索...</p>
            </div>
          )}

          {!isLoading && query && results.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                没有找到相关文章
              </div>
              <p className="text-gray-500">
                尝试使用其他关键词搜索
              </p>
            </div>
          )}

          {!isLoading && results.length > 0 && (
            <div className="grid gap-8">
              {results.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          )}

          {!query && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                输入关键词开始搜索
              </div>
              <p className="text-gray-500">
                搜索标题、摘要和文章内容
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <MainLayout>
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-600 mt-4">加载中...</p>
        </div>
      </MainLayout>
    }>
      <SearchContent />
    </Suspense>
  )
}
