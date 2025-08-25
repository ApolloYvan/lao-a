// 内容API接口 - 支持从外部源获取文章内容
export interface Article {
  id: string
  title: string
  slug: string
  summary: string
  content: string
  tags: string[]
  category: string
  coverImage: string
  readingTime: number
  published: boolean
  publishedAt: string
  updatedAt: string
  author: {
    name: string
    avatar: string
  }
  views?: number
  likes?: number
}

export interface ContentSource {
  // 从GitHub获取文章列表
  getArticles(): Promise<Article[]>
  
  // 从GitHub获取单篇文章
  getArticle(slug: string): Promise<Article | null>
  
  // 从GitHub获取分类文章
  getArticlesByCategory(category: string): Promise<Article[]>
  
  // 从GitHub获取标签文章
  getArticlesByTag(tag: string): Promise<Article[]>
}



// GitHub内容源实现
export class GitHubContentSource implements ContentSource {
  private repo: string
  private branch: string
  private token?: string

  constructor(repo: string, branch: string = 'main', token?: string) {
    this.repo = repo
    this.branch = branch
    this.token = token
  }

  private async fetchFromGitHub(path: string): Promise<unknown> {
    const url = `https://api.github.com/repos/${this.repo}/contents/${path}?ref=${this.branch}`
    const headers: Record<string, string> = {
      'Accept': 'application/vnd.github.v3+json'
    }
    
    if (this.token) {
      headers['Authorization'] = `token ${this.token}`
    }

    const response = await fetch(url, { 
      headers,
      next: { revalidate: 300 } // 缓存5分钟
    })
    
    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status}`)
    }

    return response.json()
  }

  private async getFileContent(path: string): Promise<string> {
    const data = await this.fetchFromGitHub(path) as { type: string; content: string }
    
    if (data.type === 'file') {
      // 如果是单个文件
      const content = data.content
      return Buffer.from(content, 'base64').toString('utf-8')
    } else {
      throw new Error(`Path ${path} is not a file`)
    }
  }

  private async getDirectoryContents(path: string): Promise<Array<{ name: string; sha: string; created_at: string; updated_at: string }>> {
    const data = await this.fetchFromGitHub(path) as Array<{ name: string; sha: string; created_at: string; updated_at: string }>
    
    if (Array.isArray(data)) {
      return data
    } else {
      throw new Error(`Path ${path} is not a directory`)
    }
  }

  private parseFrontMatter(content: string): { frontmatter: Record<string, unknown>; content: string } {
    const frontMatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = content.match(frontMatterRegex)
    
    if (!match) {
      return { frontmatter: {}, content }
    }

    const [, frontmatterStr, contentStr] = match
    const frontmatter: Record<string, unknown> = {}
    
    // 简单的YAML解析
    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        let value = valueParts.join(':').trim()
        
        // 处理引号
        if ((value.startsWith('"') && value.endsWith('"')) || 
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        
        // 处理数组
        if (value.startsWith('[') && value.endsWith(']')) {
          value = JSON.parse(value)
        }
        
        frontmatter[key.trim()] = value
      }
    })

    return { frontmatter, content: contentStr }
  }

  async getArticles(): Promise<Article[]> {
    try {
      const files = await this.getDirectoryContents('content/posts')
      const articles: Article[] = []

      for (const file of files) {
        if (file.name.endsWith('.mdx') || file.name.endsWith('.md')) {
          try {
            const content = await this.getFileContent(`content/posts/${file.name}`)
            const { frontmatter, content: articleContent } = this.parseFrontMatter(content)
            
            if (frontmatter.published !== false) {
              articles.push({
                id: file.sha,
                title: (frontmatter.title as string) || '',
                slug: (frontmatter.slug as string) || file.name.replace(/\.(mdx?)$/, ''),
                summary: (frontmatter.summary as string) || '',
                content: articleContent,
                tags: (frontmatter.tags as string[]) || [],
                category: (frontmatter.category as string) || '',
                coverImage: (frontmatter.coverImage as string) || '',
                readingTime: (frontmatter.readingTime as number) || 1,
                published: frontmatter.published !== false,
                publishedAt: (frontmatter.date as string) || file.created_at,
                updatedAt: file.updated_at,
                author: {
                  name: (frontmatter.author as string) || '老A',
                  avatar: '/images/laoa.jpg'
                }
              })
            }
          } catch (error) {
            console.error(`Error parsing article ${file.name}:`, error)
          }
        }
      }

      // 按发布时间排序
      return articles.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } catch (error) {
      console.error('Error fetching articles from GitHub:', error)
      return []
    }
  }

  async getArticle(slug: string): Promise<Article | null> {
    try {
      const articles = await this.getArticles()
      return articles.find(article => article.slug === slug) || null
    } catch (error) {
      console.error(`Error fetching article ${slug}:`, error)
      return null
    }
  }

  async getArticlesByCategory(category: string): Promise<Article[]> {
    try {
      const articles = await this.getArticles()
      return articles.filter(article => article.category === category)
    } catch (error) {
      console.error(`Error fetching articles by category ${category}:`, error)
      return []
    }
  }

  async getArticlesByTag(tag: string): Promise<Article[]> {
    try {
      const articles = await this.getArticles()
      return articles.filter(article => article.tags.includes(tag))
    } catch (error) {
      console.error(`Error fetching articles by tag ${tag}:`, error)
      return []
    }
  }
}

// 创建默认的内容源实例
export const contentSource = new GitHubContentSource(
  process.env.GITHUB_REPO || 'your-username/your-blog-repo',
  process.env.GITHUB_BRANCH || 'main',
  process.env.GITHUB_TOKEN
)
