'use client'

import { useEffect, useState } from 'react'
import { List } from 'lucide-react'

interface TocItem {
  id: string
  text: string
  level: number
}

export default function TableOfContents() {
  const [toc, setToc] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState<string>('')
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // 延迟执行，等待MarkdownRenderer完成渲染
    const timer = setTimeout(() => {
      // 获取所有标题元素
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
      const tocItems: TocItem[] = Array.from(headings).map((heading, index) => {
        // 如果标题没有id，自动生成一个
        if (!heading.id) {
          const id = `heading-${index}`
          heading.id = id
        }
        
        return {
          id: heading.id,
          text: heading.textContent || '',
          level: parseInt(heading.tagName.charAt(1)),
        }
      })
      
      setToc(tocItems)

      // 滚动监听，高亮当前章节
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id)
            }
          })
        },
        { 
          rootMargin: '-20% 0% -35% 0%',
          threshold: 0.1
        }
      )

      headings.forEach((heading) => observer.observe(heading))

      return () => observer.disconnect()
    }, 100) // 减少延迟时间到100ms

    return () => clearTimeout(timer)
  }, [])

  const handleClick = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // 获取固定头部的高度（h-16 = 64px）
      const headerHeight = 64
      const elementTop = element.offsetTop
      const scrollTop = elementTop - headerHeight - 20 // 额外20px的间距
      
      window.scrollTo({
        top: scrollTop,
        behavior: 'smooth'
      })
    }
  }

  // 在客户端渲染之前，返回一个占位符以避免hydration错误
  if (!isClient) {
    return (
      <nav className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <List className="h-5 w-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">目录</h3>
        </div>
        <div className="text-gray-500 text-sm">加载中...</div>
      </nav>
    )
  }

  if (toc.length === 0) {
    return null
  }

  return (
    <nav className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-4">
        <List className="h-5 w-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">目录</h3>
      </div>
      
      <ul className="space-y-2">
        {toc.map((item) => (
          <li key={item.id}>
            <button
              onClick={() => handleClick(item.id)}
              className={`block w-full text-left text-sm transition-colors hover:text-blue-600 ${
                activeId === item.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-600'
              }`}
              style={{ 
                paddingLeft: `${(item.level - 1) * 12}px`,
                textAlign: 'left'
              }}
            >
              {item.text}
            </button>
          </li>
        ))}
      </ul>
      
      {/* 回到顶部按钮 */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="text-sm text-gray-500 hover:text-blue-600 transition-colors"
        >
          ↑ 回到顶部
        </button>
      </div>
    </nav>
  )
}
