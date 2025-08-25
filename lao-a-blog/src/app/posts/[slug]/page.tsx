import { notFound } from 'next/navigation'
import MainLayout from '@/components/layout/MainLayout'
import PostHeader from '@/components/post/PostHeader'
import PostBody from '@/components/post/PostBody'
import AsyncTableOfContents from '@/components/post/AsyncTableOfContents'
import AsyncRelatedPosts from '@/components/post/AsyncRelatedPosts'
import MarkdownRenderer from '@/components/post/MarkdownRenderer'
import PostViewTracker from '@/components/post/PostViewTracker'
import { contentSource } from '@/lib/content-api'
import type { Metadata } from 'next'

interface PostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  try {
    const posts = await contentSource.getArticles()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error('Error generating static params:', error)
    return []
  }
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params
    const post = await contentSource.getArticle(slug)
    if (!post) {
      return {
        title: '文章未找到',
      }
    }

    return {
      title: post.title,
      description: post.summary,
      keywords: post.tags,
      openGraph: {
        title: post.title,
        description: post.summary,
        type: 'article',
        publishedTime: post.publishedAt,
        tags: post.tags,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.summary,
        images: post.coverImage ? [post.coverImage] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return { title: '文章未找到' }
  }
}

export default async function PostPage({ params }: PostPageProps) {
  // 先获取主要文章内容，立即显示
  const { slug } = await params
  const post = await contentSource.getArticle(slug)
  
  if (!post) {
    notFound()
  }



  return (
    <MainLayout showSidebar={false}>
      <div className="max-w-6xl mx-auto">
        <article>
          {/* 文章头部 */}
          <PostHeader post={post} />
          
          <div className="flex gap-8">
            {/* 文章内容 */}
            <div className="flex-1 min-w-0">
              <PostBody>
                <MarkdownRenderer content={post.content} />
              </PostBody>
              
              {/* 异步加载相关文章 */}
              <AsyncRelatedPosts currentSlug={post.slug} category={post.category} />
            </div>
            
            {/* 异步加载目录导航 */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <AsyncTableOfContents />
              </div>
            </aside>
          </div>
        </article>
      </div>
      
      {/* 阅读数追踪 */}
      <PostViewTracker slug={post.slug} />
    </MainLayout>
  )
}
