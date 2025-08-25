import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

// 统计数据文件路径
const STATS_FILE = path.join(process.cwd(), 'data', 'post-stats.json')

// 确保数据目录存在
async function ensureDataDir() {
  const dataDir = path.dirname(STATS_FILE)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// 读取统计数据
async function readStats() {
  try {
    await ensureDataDir()
    const data = await fs.readFile(STATS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return {}
  }
}

// 写入统计数据
async function writeStats(stats: Record<string, { views: number; likes: number }>) {
  await ensureDataDir()
  await fs.writeFile(STATS_FILE, JSON.stringify(stats, null, 2))
}

// 获取文章统计数据
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const stats = await readStats()
    const postStats = stats[slug] || { views: 0, likes: 0 }
    
    return NextResponse.json(postStats)
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
    const stats = await readStats()
    
    if (!stats[slug]) {
      stats[slug] = { views: 0, likes: 0 }
    }
    
    if (action === 'view') {
      stats[slug].views += 1
    } else if (action === 'like') {
      stats[slug].likes += 1
    } else if (action === 'unlike') {
      stats[slug].likes = Math.max(0, stats[slug].likes - 1)
    }
    
    await writeStats(stats)
    
    return NextResponse.json(stats[slug])
  } catch (error) {
    console.error('Error updating post stats:', error)
    return NextResponse.json(
      { error: 'Failed to update post stats' },
      { status: 500 }
    )
  }
}
