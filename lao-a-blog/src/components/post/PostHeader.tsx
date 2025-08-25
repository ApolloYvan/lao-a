import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { Calendar, Clock } from 'lucide-react'
import { AUTHOR_INFO } from '@/lib/constants'
import { Article } from '@/lib/content-api'
import PostStats from '@/components/ui/PostStats'

interface PostHeaderProps {
  post: Article
}

export default function PostHeader({ post }: PostHeaderProps) {
  return (
    <header className="mb-8">
      {/* 分类标签 */}
      <div className="mb-4">
        <Link
          href={`/categories/${post.category}`}
          className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full hover:bg-blue-200 transition-colors"
        >
          {post.category}
        </Link>
      </div>
      
      {/* 文章标题 */}
      <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 leading-tight">
        {post.title}
      </h1>
      
      {/* 封面图片 - 移到标题后面 */}
      <div className="aspect-video relative rounded-xl overflow-hidden mb-8">
        <Image
          src={post.coverImage || '/images/laoa.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          quality={75}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
        />
      </div>
      
      {/* 文章摘要 */}
      <p className="text-xl text-gray-600 mb-8 leading-relaxed">
        {post.summary}
      </p>
      
      {/* 文章元信息 */}
      <div className="flex flex-wrap items-center gap-6 text-gray-500 mb-8">
        {/* 作者信息 */}
        <div className="flex items-center gap-2">
          <div className="relative w-8 h-8">
            <Image
              src={AUTHOR_INFO.avatar}
              alt={AUTHOR_INFO.name}
              fill
              className="rounded-full object-cover"
            />
          </div>
          <span className="font-medium text-gray-700">{AUTHOR_INFO.name}</span>
        </div>
        
        {/* 发布日期 */}
        <div className="flex items-center gap-1">
          <Calendar className="h-4 w-4" />
          <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
        </div>
        
        {/* 阅读时间 */}
        {post.readingTime && (
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{post.readingTime}分钟阅读</span>
          </div>
        )}
        
        {/* 统计信息 */}
        <PostStats slug={post.slug} />
      </div>
      
      {/* 标签 */}
      <div className="flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full hover:bg-gray-200 transition-colors"
          >
            #{tag}
          </Link>
        ))}
      </div>
    </header>
  )
}
