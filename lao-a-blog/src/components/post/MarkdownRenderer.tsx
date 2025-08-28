'use client'

import { useEffect, useState } from 'react'
import Prism from 'prismjs'
// 使用自定义主题，不加载默认主题
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-shell-session'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-yaml'
import { useTheme } from '@/contexts/ThemeContext'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [isClient, setIsClient] = useState(false)
  const [renderedContent, setRenderedContent] = useState('')
  const { isDarkTheme } = useTheme()

  useEffect(() => {
    setIsClient(true)
    
    // 添加复制代码的全局函数
    if (typeof window !== 'undefined') {
      (window as { copyCode?: (codeId: string) => void }).copyCode = async (codeId: string) => {
        const codeElement = document.getElementById(codeId)
        const button = document.querySelector(`button[onclick="copyCode('${codeId}')"]`) as HTMLButtonElement
        
        if (codeElement && button) {
          try {
            const text = codeElement.textContent || ''
            await navigator.clipboard.writeText(text)
            
            // 显示成功反馈
            const originalText = button.textContent
            button.textContent = '已复制!'
            button.classList.add('bg-green-600')
            
            setTimeout(() => {
              button.textContent = originalText
              button.classList.remove('bg-green-600')
            }, 2000)
          } catch (error) {
            console.error('复制失败:', error)
            button.textContent = '复制失败'
            button.classList.add('bg-red-600')
            
            setTimeout(() => {
              button.textContent = '复制'
              button.classList.remove('bg-red-600')
            }, 2000)
          }
        }
      }


    }
    
    // 简单的Markdown解析
    let html = content
    
    // 先提取并渲染代码块，使用占位符保护，避免被后续替换影响
    const codeBlocks: string[] = []
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
      const trimmedCode = code.trim()
      
      // 语言映射和检测
      let detectedLanguage = (lang || 'text').toLowerCase()
      if (['bash', 'shell', 'sh', 'zsh', 'console', 'shell-session', 'bin'].includes(detectedLanguage)) {
        detectedLanguage = 'bash'
      } else if (['js', 'javascript'].includes(detectedLanguage)) {
        detectedLanguage = 'javascript'
      } else if (['ts', 'typescript'].includes(detectedLanguage)) {
        detectedLanguage = 'typescript'
      } else if (detectedLanguage === 'java') {
        detectedLanguage = 'java'
      } else if (['py', 'python'].includes(detectedLanguage)) {
        detectedLanguage = 'python'
      } else if (detectedLanguage === 'sql') {
        detectedLanguage = 'sql'
      } else if (['yaml', 'yml'].includes(detectedLanguage)) {
        detectedLanguage = 'yaml'
      } else if (detectedLanguage === 'json') {
        detectedLanguage = 'json'
      } else if (detectedLanguage === 'css') {
        detectedLanguage = 'css'
      } else if (['html', 'xml', 'markup'].includes(detectedLanguage)) {
        detectedLanguage = 'markup'
      } else if (['ini', 'properties'].includes(detectedLanguage)) {
        detectedLanguage = 'ini'
      }
      
      // 使用 Prism.js 进行语法高亮
      let highlightedCode = trimmedCode
      if (detectedLanguage !== 'text' && Prism.languages[detectedLanguage as keyof typeof Prism.languages]) {
        try {
          highlightedCode = Prism.highlight(trimmedCode, Prism.languages[detectedLanguage], detectedLanguage)
        } catch (error) {
          console.warn(`Prism highlight failed for language: ${detectedLanguage}`, error)
          highlightedCode = trimmedCode
        }
      }
      
      const themeClass = isDarkTheme ? 'bg-gray-800 text-gray-100 border-gray-600' : 'bg-gray-50 text-gray-800 border-gray-300'
      const blockHtml = `<div class="relative group my-4">
        <button onclick="copyCode('${codeId}')" class="absolute top-3 right-3 bg-gray-700 hover:bg-gray-600 text-gray-300 px-3 py-1.5 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-md">复制</button>
        <pre class="${themeClass} rounded-lg border p-5 overflow-x-auto shadow-lg font-mono text-sm leading-relaxed"><code id="${codeId}" class="language-${detectedLanguage} block">${highlightedCode}</code></pre>
      </div>`
      const placeholder = `[[CODEBLOCK-${codeBlocks.length}]]`
      codeBlocks.push(blockHtml)
      return placeholder
    })
    
    // 处理标题 - 生成安全的ID
    let headingIndex = 0
    html = html.replace(/^### (.*$)/gim, (match, title) => {
      headingIndex++
      const safeId = `heading-${headingIndex}`
      return `<h3 id="${safeId}" class="text-xl font-bold text-gray-900 mt-8 mb-4">${title}</h3>`
    })
    html = html.replace(/^## (.*$)/gim, (match, title) => {
      headingIndex++
      const safeId = `heading-${headingIndex}`
      return `<h2 id="${safeId}" class="text-2xl font-bold text-gray-900 mt-10 mb-6">${title}</h2>`
    })
    html = html.replace(/^# (.*$)/gim, (match, title) => {
      headingIndex++
      const safeId = `heading-${headingIndex}`
      return `<h1 id="${safeId}" class="text-3xl font-bold text-gray-900 mt-12 mb-8">${title}</h1>`
    })
    
    // 处理粗体
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    
    // 处理斜体
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
    
    // 其余 Markdown 转换（标题、强调、列表等）
    
    // 处理内联代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
    
    // 处理引用块 - 正确处理多行引用
    html = html.replace(/^> (.*$)/gim, (match, content) => {
      return `<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 rounded-r-lg italic text-gray-700">${content}</blockquote>`
    })
    
    // 合并连续的引用块为一个
    html = html.replace(/<\/blockquote>\s*<blockquote[^>]*>/g, '<br>')
    
    // 处理列表 - 改进版本
    html = html.replace(/^\* (.*$)/gim, '<li class="my-2">$1</li>')
    // 将连续的li标签包装在ul中
    html = html.replace(/(<li.*?<\/li>)(\s*<li.*?<\/li>)*/g, (match) => {
      return `<ul class="list-disc pl-6 my-6 space-y-2">${match}</ul>`
    })
    
    // 处理段落 - 改进版本
    html = html.replace(/^(?!<[h|u|p|d|b|p])(.+)$/gim, (match) => {
      // 跳过空行和代码块标记
      if (match.trim() === '' || match.includes('CODE_BLOCK_START') || match.includes('CODE_BLOCK_END')) return match
      return `<p class="my-0 leading-relaxed text-gray-700">${match}</p>`
    })
    
    // 清理多余的段落标签
    html = html.replace(/<p><\/p>/g, '')
    html = html.replace(/<p>(<h[1-6]>.*<\/h[1-6]>)<\/p>/g, '$1')
    html = html.replace(/<p>(<ul>.*<\/ul>)<\/p>/g, '$1')
    html = html.replace(/<p>(<pre>.*<\/pre>)<\/p>/g, '$1')
    
    // 恢复代码块占位符
    codeBlocks.forEach((block, idx) => {
      html = html.replace(`[[CODEBLOCK-${idx}]]`, block)
    })
    
    setRenderedContent(html)
  }, [content])

  // 在客户端渲染之前，显示基本的HTML内容
  if (!isClient) {
    // 简单的服务器端渲染，不包含复杂的客户端功能
    const basicHtml = content
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold text-gray-900 mt-8 mb-4">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold text-gray-900 mt-10 mb-6">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold text-gray-900 mt-12 mb-8">$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 rounded-r-lg italic text-gray-700">$1</blockquote>')
      .replace(/^\* (.*$)/gim, '<li class="my-2">$1</li>')
      .replace(/(<li.*?<\/li>)(\s*<li.*?<\/li>)*/g, (match) => {
        return `<ul class="list-disc pl-6 my-6 space-y-2">${match}</ul>`
      })
      .replace(/^(?!<[h|u|p|d|b|p])(.+)$/gim, (match) => {
        if (match.trim() === '') return match
        return `<p class="my-0 leading-relaxed text-gray-700">${match}</p>`
      })
    
    return (
      <div 
        className="prose prose-lg max-w-none"
        dangerouslySetInnerHTML={{ __html: basicHtml }}
      />
    )
  }

  return (
    <div 
      className="prose prose-lg max-w-none"
      dangerouslySetInnerHTML={{ __html: renderedContent }}
    />
  )
}
