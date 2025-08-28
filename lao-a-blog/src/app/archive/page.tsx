import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import MainLayout from '@/components/layout/MainLayout'
import { contentSource } from '@/lib/content-api'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '文章归档',
  description: '按时间浏览所有文章',
}

export default async function ArchivePage() {
  try {
    const articles = await contentSource.getArticles()
    
    // 按年月分组
    const archiveData = articles.reduce((acc, article) => {
      const date = parseISO(article.publishedAt)
      const yearMonth = format(date, 'yyyy-MM', { locale: zhCN })
      const yearMonthDisplay = format(date, 'yyyy年MM月', { locale: zhCN })
      
      if (!acc[yearMonth]) {
        acc[yearMonth] = {
          display: yearMonthDisplay,
          count: 0,
          articles: []
        }
      }
      
      acc[yearMonth].count++
      acc[yearMonth].articles.push(article)
      
      return acc
    }, {} as Record<string, { display: string; count: number; articles: typeof articles }>)

    // 按时间倒序排列
    const sortedArchive = Object.entries(archiveData)
      .sort(([a], [b]) => b.localeCompare(a))

    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">文章归档</h1>
            <p className="text-xl text-gray-600">
              按时间浏览所有文章，共 {articles.length} 篇
            </p>
          </div>

          <div className="space-y-8">
            {sortedArchive.map(([yearMonth, data]) => (
              <div key={yearMonth} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {data.display}
                  </h2>
                  <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                    {data.count} 篇文章
                  </span>
                </div>
                
                <div className="space-y-3">
                  {data.articles.map((article) => (
                    <div key={article.slug} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-1">
                        <Link
                          href={`/posts/${article.slug}`}
                          className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                          {article.title}
                        </Link>
                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                          <span>{format(parseISO(article.publishedAt), 'MM月dd日', { locale: zhCN })}</span>
                          <span>•</span>
                          <span>{article.category}</span>
                          {article.readingTime && (
                            <>
                              <span>•</span>
                              <span>{article.readingTime}分钟</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {articles.length === 0 && (
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
      </MainLayout>
    )
  } catch (error) {
    console.error('Error loading archive:', error)
    return (
      <MainLayout>
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg mb-4">
            加载归档失败
          </div>
          <p className="text-gray-500">
            请稍后重试
          </p>
        </div>
      </MainLayout>
    )
  }
}
