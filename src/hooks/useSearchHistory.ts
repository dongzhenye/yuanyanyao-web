import { useState, useEffect } from 'react'
import type { SearchHistoryItem } from '@/lib/types'

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem('searchHistory')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // 保存搜索历史到 localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  const addToHistory = (searchTerm: string, filters: string[]) => {
    const currentState = {
      searchTerm,
      filters: [...filters],
      timestamp: Date.now()
    }

    setSearchHistory(prev => {
      // 避免重复添加相同的搜索
      const isDuplicate = prev[0] && 
        prev[0].searchTerm === searchTerm && 
        prev[0].filters.length === filters.length &&
        prev[0].filters.every((f, i) => f === filters[i])
      
      if (isDuplicate) return prev
      return [currentState, ...prev].slice(0, 10) // 只保留最近10条
    })
  }

  return {
    searchHistory,
    addToHistory
  }
} 