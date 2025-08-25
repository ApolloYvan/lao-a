import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parseISO } from 'date-fns'
import { zhCN } from 'date-fns/locale'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'yyyy年MM月dd日', { locale: zhCN })
}

export function formatDateShort(date: string | Date) {
  const dateObj = typeof date === 'string' ? parseISO(date) : date
  return format(dateObj, 'MM-dd', { locale: zhCN })
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200 // 中文阅读速度约200字/分钟
  const words = content.length
  return Math.ceil(words / wordsPerMinute)
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
