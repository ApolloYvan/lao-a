import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import PostCard from '@/components/ui/PostCard'
import { contentSource } from '@/lib/content-api'
import type { Metadata } from 'next'

interface CategoryPageProps {
  params: Promise<{
    category: string
  }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  return {
    title: `${decodedCategory} - 分类`,
    description: `浏览 ${decodedCategory} 分类下的所有文章`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const decodedCategory = decodeURIComponent(category)
  
  try {
    const articles = await contentSource.getArticlesByCategory(decodedCategory)
    
    if (articles.length === 0) {
      notFound()
    }

    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {decodedCategory}
            </h1>
            <p className="text-xl text-gray-600">
              共 {articles.length} 篇文章
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <PostCard key={article.id} post={article} />
            ))}
          </div>

          {articles.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">该分类下暂无文章</p>
            </div>
          )}
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error('Error loading category:', error)
    notFound()
  }
}
