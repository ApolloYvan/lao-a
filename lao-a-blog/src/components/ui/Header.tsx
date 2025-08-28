'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, Search, Sun, Moon } from 'lucide-react'
import { NAVIGATION_ITEMS, SITE_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useTheme } from '@/contexts/ThemeContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()
  const { isDarkTheme, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md dark:border-gray-700 dark:bg-gray-900/80">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {SITE_CONFIG.name}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium dark:text-gray-300 dark:hover:text-blue-400"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Button and Theme Toggle */}
          <div className="hidden md:flex items-center space-x-4">
            <button 
              onClick={() => router.push('/search')}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Search className="h-5 w-5" />
            </button>
            <button 
              onClick={toggleTheme}
              className="p-2 text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300 ease-in-out",
            isMenuOpen ? "max-h-80 pb-4" : "max-h-0"
          )}
        >
          {/* Theme Toggle for Mobile */}
          <div className="flex justify-center pt-4 pb-3 border-b border-gray-200 dark:border-gray-700">
            <button 
              onClick={toggleTheme}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              {isDarkTheme ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="font-medium">{isDarkTheme ? '切换到日间模式' : '切换到夜间模式'}</span>
            </button>
          </div>
          
          <nav className="flex flex-col space-y-4 pt-4">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors font-medium dark:text-gray-300 dark:hover:text-blue-400"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <button 
              onClick={() => {
                router.push('/search')
                setIsMenuOpen(false)
              }}
              className="flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors dark:text-gray-300 dark:hover:text-blue-400"
            >
              <Search className="h-5 w-5" />
              <span>搜索</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  )
}
