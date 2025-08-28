import { NextRequest, NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

// 类型定义
interface PostStats {
  views: number
  likes: number
}

interface UserLikes {
  [userId: string]: { [slug: string]: boolean }
}

interface StatsData {
  [slug: string]: PostStats
}

// 获取用户标识
function getUserIdentifier(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  return btoa(ip).slice(0, 16)
}

// KV 存储操作
async function getStats(): Promise<StatsData> {
  try {
    const stats = await kv.get<StatsData>('post_stats')
    return stats || {}
  } catch {
    return {}
  }
}

async function setStats(stats: StatsData): Promise<void> {
  await kv.set('post_stats', stats)
}

async function getUserLikes(): Promise<UserLikes> {
  try {
    const userLikes = await kv.get<UserLikes>('user_likes')
    return userLikes || {}
  } catch {
    return {}
  }
}

async function setUserLikes(userLikes: UserLikes): Promise<void> {
  await kv.set('user_likes', userLikes)
}

// 获取文章统计数据
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const stats = await getStats()
    const postStats = stats[slug] || { views: 0, likes: 0 }
    
    const userIdentifier = getUserIdentifier(request)
    const userLikes = await getUserLikes()
    const userLikedPosts = userLikes[userIdentifier] || {}
    
    return NextResponse.json({
      ...postStats,
      userLiked: !!userLikedPosts[slug]
    })
  } catch (error) {
    console.error('Error fetching post stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch post stats' },
      { status: 500 }
    )
  }
}

// 更新文章统计数据
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const { action } = await request.json()
    
    if (!action || !['view', 'like', 'unlike'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action' },
        { status: 400 }
      )
    }
    
    const userIdentifier = getUserIdentifier(request)
    console.log(`[API] User ${userIdentifier} attempting ${action} on post ${slug}`)
    
    const stats = await getStats()
    const userLikes = await getUserLikes()
    
    if (!stats[slug]) {
      stats[slug] = { views: 0, likes: 0 }
    }
    
    if (!userLikes[userIdentifier]) {
      userLikes[userIdentifier] = {}
    }
    
    let actionPerformed = false
    
    if (action === 'view') {
      stats[slug].views += 1
      actionPerformed = true
    } else if (action === 'like') {
      if (!userLikes[userIdentifier][slug]) {
        stats[slug].likes += 1
        userLikes[userIdentifier][slug] = true
        actionPerformed = true
        console.log(`[API] User ${userIdentifier} liked post ${slug}`)
      } else {
        console.log(`[API] User ${userIdentifier} already liked post ${slug}`)
      }
    } else if (action === 'unlike') {
      if (userLikes[userIdentifier][slug]) {
        stats[slug].likes = Math.max(0, stats[slug].likes - 1)
        userLikes[userIdentifier][slug] = false
        actionPerformed = true
        console.log(`[API] User ${userIdentifier} unliked post ${slug}`)
      } else {
        console.log(`[API] User ${userIdentifier} already unliked post ${slug}`)
      }
    }
    
    try {
      await setStats(stats)
      await setUserLikes(userLikes)
      console.log(`[API] Successfully updated stats for post ${slug}`)
    } catch (writeError) {
      console.error('[API] Error writing to KV:', writeError)
      return NextResponse.json(
        { error: 'Failed to save data' },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      ...stats[slug],
      userLiked: !!userLikes[userIdentifier][slug],
      actionPerformed
    })
  } catch (error) {
    console.error('Error updating post stats:', error)
    return NextResponse.json(
      { error: 'Failed to update post stats' },
      { status: 500 }
    )
  }
}
