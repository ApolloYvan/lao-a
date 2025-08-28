import { NextRequest, NextResponse } from 'next/server'
import { createClient } from 'redis'

// Redis 客户端初始化
let redis: ReturnType<typeof createClient> | null = null

async function getRedisClient() {
  if (!redis) {
    redis = await createClient({
      url: process.env.STORAGE_REDIS_URL || process.env.REDIS_URL || 'redis://localhost:6379'
    }).connect()
  }
  return redis
}

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

// Redis 存储操作 - 优化版本
async function getStats(): Promise<StatsData> {
  try {
    const redisClient = await getRedisClient()
    const statsJson = await redisClient.get('post_stats')
    return statsJson ? JSON.parse(statsJson) : {}
  } catch (error) {
    console.error('Redis getStats error:', error)
    return {}
  }
}

async function setStats(stats: StatsData): Promise<void> {
  try {
    const redisClient = await getRedisClient()
    await redisClient.set('post_stats', JSON.stringify(stats))
  } catch (error) {
    console.error('Redis setStats error:', error)
    throw new Error('Redis database not configured. Please check Redis setup.')
  }
}

async function getUserLikes(): Promise<UserLikes> {
  try {
    const redisClient = await getRedisClient()
    const userLikesJson = await redisClient.get('user_likes')
    return userLikesJson ? JSON.parse(userLikesJson) : {}
  } catch (error) {
    console.error('Redis getUserLikes error:', error)
    return {}
  }
}

async function setUserLikes(userLikes: UserLikes): Promise<void> {
  try {
    const redisClient = await getRedisClient()
    await redisClient.set('user_likes', JSON.stringify(userLikes))
  } catch (error) {
    console.error('Redis setUserLikes error:', error)
    throw new Error('Redis database not configured. Please check Redis setup.')
  }
}

// 优化的 Redis 操作（可选）
async function isUserLikedPost(userId: string, slug: string): Promise<boolean> {
  try {
    const redisClient = await getRedisClient()
    const result = await redisClient.sIsMember(`likes:${slug}`, userId)
    return result === 1
  } catch (error) {
    console.error('Redis isUserLikedPost error:', error)
    return false
  }
}

async function addUserLike(userId: string, slug: string): Promise<void> {
  try {
    const redisClient = await getRedisClient()
    await redisClient.sAdd(`likes:${slug}`, userId)
    await redisClient.hIncrBy('post_views_likes', `${slug}:likes`, 1)
  } catch (error) {
    console.error('Redis addUserLike error:', error)
    throw new Error('Failed to add user like')
  }
}

async function removeUserLike(userId: string, slug: string): Promise<void> {
  try {
    const redisClient = await getRedisClient()
    await redisClient.sRem(`likes:${slug}`, userId)
    await redisClient.hIncrBy('post_views_likes', `${slug}:likes`, -1)
  } catch (error) {
    console.error('Redis removeUserLike error:', error)
    throw new Error('Failed to remove user like')
  }
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
      console.error('[API] Error writing to Redis:', writeError)
      const errorMessage = writeError instanceof Error ? writeError.message : 'Failed to save data'
      return NextResponse.json(
        { error: errorMessage },
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
