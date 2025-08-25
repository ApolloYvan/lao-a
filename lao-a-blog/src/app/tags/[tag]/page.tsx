import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import PostCard from '@/components/ui/PostCard'
import { contentSource } from '@/lib/content-api'
import type { Metadata } from 'next'

interface TagPageProps {
  params: Promise<{
    tag: string
  }>
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  return {
    title: `#${decodedTag} - 标签`,
    description: `浏览 #${decodedTag} 标签下的所有文章`,
  }
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag } = await params
  const decodedTag = decodeURIComponent(tag)
  
  try {
    const articles = await contentSource.getArticlesByTag(decodedTag)
    
    if (articles.length === 0) {
      notFound()
    }

    return (
      <MainLayout>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              #{decodedTag}
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
              <p className="text-gray-500">该标签下暂无文章</p>
            </div>
          )}
        </div>
      </MainLayout>
    )
  } catch (error) {
    console.error('Error loading tag:', error)
    notFound()
  }
}
