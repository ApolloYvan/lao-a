import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock } from 'lucide-react'
import { Article } from '@/lib/content-api'
import PostStats from './PostStats'

interface PostCardProps {
  post: Article
  showStats?: boolean
}

export default function PostCard({ post, showStats = true }: PostCardProps) {
  return (
    <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-all duration-300 group">
      {post.coverImage && (
        <div className="aspect-video relative overflow-hidden">
          <Image
            src={post.coverImage}
            alt={post.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      <div className="p-6">
        {/* Meta Info */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
            {post.category}
          </span>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>
          {post.readingTime && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{post.readingTime}分钟</span>
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
          <Link 
            href={`/posts/${post.slug}`} 
            className="hover:text-blue-600 transition-colors"
          >
            {post.title}
          </Link>
        </h2>

        {/* Summary */}
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.summary}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 bg-gray-100 text-gray-700 text-sm rounded hover:bg-gray-200 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
          {post.tags.length > 3 && (
            <span className="text-gray-500 text-sm">
              +{post.tags.length - 3}
            </span>
          )}
        </div>

        {/* Stats */}
        {showStats && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <PostStats slug={post.slug} />
            <Link
              href={`/posts/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
            >
              阅读更多 →
            </Link>
          </div>
        )}
      </div>
    </article>
  )
}
