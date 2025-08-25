import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { ArrowRight } from 'lucide-react'
import { Article } from '@/lib/content-api'

interface RelatedPostsProps {
  posts: Article[]
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (posts.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">相关文章</h2>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group"
          >
            {post.coverImage && (
              <div className="aspect-video relative">
                <Image
                  src={post.coverImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
            )}
            
            <div className="p-4">
              {/* 分类 */}
              <div className="mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                  {post.category}
                </span>
              </div>
              
              {/* 标题 */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                <Link 
                  href={`/posts/${post.slug}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  {post.title}
                </Link>
              </h3>
              
              {/* 摘要 */}
              <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                {post.summary}
              </p>
              
              {/* 元信息 */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <time dateTime={post.publishedAt}>
                  {formatDate(post.publishedAt)}
                </time>
                <Link
                  href={`/posts/${post.slug}`}
                  className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  阅读
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
