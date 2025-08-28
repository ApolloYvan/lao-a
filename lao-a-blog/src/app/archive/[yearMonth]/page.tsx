import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import MainLayout from '@/components/layout/MainLayout'
import PostCard from '@/components/ui/PostCard'
import { contentSource } from '@/lib/content-api'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface ArchivePageProps {
  params: Promise<{
    yearMonth: string
  }>
}

export async function generateMetadata({ params }: ArchivePageProps): Promise<Metadata> {
  const { yearMonth } = await params
  const [year, month] = yearMonth.split('-')
  const displayDate = `${year}年${month}月`
  
  return {
    title: `${displayDate} 文章归档`,
    description: `浏览 ${displayDate} 发布的所有文章`,
  }
}

export default async function ArchiveDetailPage({ params }: ArchivePageProps) {
  const { yearMonth } = await params
  const [year, month] = yearMonth.split('-')
  const displayDate = `${year}年${month}月`
  
  try {
    const allArticles = await contentSource.getArticles()
    
    // 筛选指定年月的文章
    const articles = allArticles.filter(article => {
      const date = parseISO(article.publishedAt)
      const articleYearMonth = format(date, 'yyyy-MM', { locale: zhCN })
      return articleYearMonth === yearMonth
    })
    
    if (articles.length === 0) {
      notFound()
    }

    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {displayDate} 文章归档
            </h1>
            <p className="text-xl text-gray-600">
              共 {articles.length} 篇文章
            </p>
          </div>

          <div className="grid gap-8">
            {articles.map((article) => (
              <PostCard key={article.slug} post={article} />
            ))}
          </div>
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error('Error loading archive detail:', error)
    notFound()
  }
}
