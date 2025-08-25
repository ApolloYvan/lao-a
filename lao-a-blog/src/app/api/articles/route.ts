import { NextRequest, NextResponse } from 'next/server'
import { contentSource } from '@/lib/content-api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    let articles

    if (category) {
      articles = await contentSource.getArticlesByCategory(category)
    } else if (tag) {
      articles = await contentSource.getArticlesByTag(tag)
    } else {
      articles = await contentSource.getArticles()
    }

    // 分页处理
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedArticles = articles.slice(startIndex, endIndex)

    return NextResponse.json({
      articles: paginatedArticles,
      pagination: {
        page,
        limit,
        total: articles.length,
        totalPages: Math.ceil(articles.length / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    )
  }
}
