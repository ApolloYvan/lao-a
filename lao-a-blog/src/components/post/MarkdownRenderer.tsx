'use client'

import { useEffect, useState } from 'react'
import Prism from 'prismjs'
import 'prismjs/themes/prism-tomorrow.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-bash'
import 'prismjs/components/prism-markdown'

interface MarkdownRendererProps {
  content: string
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const [isClient, setIsClient] = useState(false)
  const [renderedContent, setRenderedContent] = useState('')

  useEffect(() => {
    setIsClient(true)
    
    // 添加复制代码的全局函数
    if (typeof window !== 'undefined') {
      (window as { copyCode?: (codeId: string) => void }).copyCode = (codeId: string) => {
        const codeElement = document.getElementById(codeId)
        if (codeElement) {
          const text = codeElement.textContent || ''
          navigator.clipboard.writeText(text).then(() => {
            // 可以添加一个提示
            console.log('代码已复制到剪贴板')
          })
        }
      }
    }
    
    // 简单的Markdown解析
    let html = content
    
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
    
    // 处理代码块 - 使用Prism进行语法高亮
    html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, lang, code) => {
      const language = lang || 'text'
      const highlightedCode = Prism.highlight(code.trim(), Prism.languages[language] || Prism.languages.text, language)
      const codeId = `code-${Math.random().toString(36).substr(2, 9)}`
      return `<CODE_BLOCK_START>${codeId}</CODE_BLOCK_START><div class="relative group my-4"><button onclick="copyCode('${codeId}')" class="absolute top-2 right-2 bg-gray-700 hover:bg-gray-600 text-gray-300 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity z-10">复制</button><pre class="bg-gray-900 text-gray-100 rounded-lg border border-gray-700 p-0 overflow-x-auto"><code id="${codeId}" class="language-${language}">${highlightedCode}</code></pre></div><CODE_BLOCK_END>${codeId}</CODE_BLOCK_END>`
    })
    
    // 处理内联代码
    html = html.replace(/`([^`]+)`/g, '<code class="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm">$1</code>')
    
    // 处理链接
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">$1</a>')
    
    // 处理引用块
    html = html.replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-blue-500 bg-blue-50 p-6 my-8 rounded-r-lg italic text-gray-700">$1</blockquote>')
    
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
    
    // 移除代码块标记
    html = html.replace(/<CODE_BLOCK_START>.*?<\/CODE_BLOCK_START>/g, '')
    html = html.replace(/<CODE_BLOCK_END>.*?<\/CODE_BLOCK_END>/g, '')
    
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
