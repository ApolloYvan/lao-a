import { SITE_CONFIG } from '@/lib/constants'
import MainLayout from '@/components/layout/MainLayout'
import PostCard from '@/components/ui/PostCard'
import { Search } from 'lucide-react'
import { contentSource } from '@/lib/content-api'

async function getPosts() {
  try {
    return await contentSource.getArticles()
  } catch (error) {
    console.error('Error fetching posts:', error)
    return []
  }
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Hero Section */}
        <div className="text-center py-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            {SITE_CONFIG.name}
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            {SITE_CONFIG.description}
          </p>
          
          {/* Search Box */}
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="搜索文章..."
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        </div>

        {/* Featured Post - 只有当文章数量大于1时才显示精选文章 */}
        {posts.length > 1 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-3">
                精选
              </span>
              最新文章
            </h2>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <PostCard post={posts[0]} />
            </div>
          </div>
        )}

        {/* Recent Posts */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {posts.length > 1 ? '最近文章' : '文章'}
            </h2>
            <span className="text-sm text-gray-500">
              共 {posts.length} 篇文章
            </span>
          </div>
          
          <div className="grid gap-8">
            {posts.length > 1 ? (
              // 当文章数量大于1时，显示除第一篇外的其他文章
              posts.slice(1).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))
            ) : (
              // 当只有1篇文章时，直接显示这篇文章
              posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))
            )}
          </div>
          
          {posts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-4">
                还没有发布文章
              </div>
              <p className="text-gray-500">
                敬请期待精彩内容！
              </p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {posts.length > 5 && (
          <div className="text-center pt-8">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
              加载更多文章
            </button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
