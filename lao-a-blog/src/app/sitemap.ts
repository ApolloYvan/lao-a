import { MetadataRoute } from 'next'
import { contentSource } from '@/lib/content-api'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://your-project.vercel.app'
  
  // 静态页面
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  try {
    // 动态生成文章页面
    const articles = await contentSource.getArticles()
    const articlePages = articles.map((article) => ({
      url: `${baseUrl}/posts/${article.slug}`,
      lastModified: new Date(article.updatedAt).toISOString(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }))

    // 动态生成分类页面
    const categories = [...new Set(articles.map(article => article.category).filter(Boolean))]
    const categoryPages = categories.map((category) => ({
      url: `${baseUrl}/categories/${encodeURIComponent(category)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // 动态生成标签页面
    const allTags = articles.flatMap(article => article.tags)
    const uniqueTags = [...new Set(allTags)]
    const tagPages = uniqueTags.map((tag) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'weekly' as const,
      priority: 0.5,
    }))

    return [...staticPages, ...articlePages, ...categoryPages, ...tagPages]
  } catch (error) {
    console.error('Error generating sitemap:', error)
    return staticPages
  }
}
