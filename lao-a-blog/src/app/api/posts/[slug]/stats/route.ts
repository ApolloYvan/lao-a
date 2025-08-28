import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

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

// 文件路径
const DATA_DIR = path.join(process.cwd(), 'data')
const STATS_FILE = path.join(DATA_DIR, 'post-stats.json')
const USER_LIKES_FILE = path.join(DATA_DIR, 'user-likes.json')

// 获取用户标识
function getUserIdentifier(request: NextRequest): string {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
             request.headers.get('x-real-ip') || 
             'unknown'
  return btoa(ip).slice(0, 16)
}

// 通用文件操作
async function readJsonFile<T>(filePath: string, defaultValue: T): Promise<T> {
  try {
    await fs.mkdir(path.dirname(filePath), { recursive: true })
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return defaultValue
  }
}

async function writeJsonFile<T>(filePath: string, data: T): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true })
  await fs.writeFile(filePath, JSON.stringify(data, null, 2))
}

// 获取文章统计数据
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const stats = await readJsonFile<StatsData>(STATS_FILE, {})
    const postStats = stats[slug] || { views: 0, likes: 0 }
    
    const userIdentifier = getUserIdentifier(request)
    const userLikes = await readJsonFile<UserLikes>(USER_LIKES_FILE, {})
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
    
    const stats = await readJsonFile<StatsData>(STATS_FILE, {})
    const userLikes = await readJsonFile<UserLikes>(USER_LIKES_FILE, {})
    
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
      await writeJsonFile(STATS_FILE, stats)
      await writeJsonFile(USER_LIKES_FILE, userLikes)
      console.log(`[API] Successfully updated stats for post ${slug}`)
    } catch (writeError) {
      console.error('[API] Error writing files:', writeError)
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
