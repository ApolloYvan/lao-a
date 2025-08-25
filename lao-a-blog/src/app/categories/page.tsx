import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import { contentSource } from '@/lib/content-api'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '分类',
  description: '浏览所有文章分类',
}

export default async function CategoriesPage() {
  try {
    const articles = await contentSource.getArticles()
    
    // 统计每个分类的文章数量
    const categoryStats = articles.reduce((acc, article) => {
      const category = article.category || '未分类'
      acc[category] = (acc[category] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    const categories = Object.entries(categoryStats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">分类</h1>
            <p className="text-xl text-gray-600">
              浏览所有文章分类，找到你感兴趣的内容
            </p>
          </div>

          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">暂无分类</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <div
                  key={category.name}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                      {category.name}
                    </h2>
                    <span className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-1 rounded-full">
                      {category.count} 篇
                    </span>
                  </div>
                  
                  <div className="space-y-2">
                    {articles
                      .filter(article => (article.category || '未分类') === category.name)
                      .slice(0, 3)
                      .map(article => (
                        <div key={article.id} className="flex items-center justify-between">
                          <a
                            href={`/posts/${article.slug}`}
                            className="text-gray-700 hover:text-blue-600 transition-colors truncate"
                          >
                            {article.title}
                          </a>
                          <span className="text-sm text-gray-500">
                            {new Date(article.publishedAt).toLocaleDateString('zh-CN')}
                          </span>
                        </div>
                      ))}
                  </div>
                  
                  {category.count > 3 && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <a
                        href={`/categories/${encodeURIComponent(category.name)}`}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        查看全部 {category.count} 篇文章 →
                      </a>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error('Error loading categories:', error)
    notFound()
  }
}
