import React from 'react'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState, useCallback, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchBox } from '@/components/search/SearchBox'
import { searchDrugs } from '@/lib/search'
import { siteConfig } from '@/lib/config'
import drugsData from '@/data/drugs.json'
import type { SearchResultItem, SearchHistory } from '@/lib/types'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchFilters } from '@/components/search/SearchFilters'
import { Footer } from '@/components/layout/Footer'
import { trackEvent } from '@/lib/analytics'

// 添加筛选选项配置
const FILTER_OPTIONS = {
  剂型: ['片剂', '胶囊', '注射剂', '口服液'],
  分类: ['化学药品', '生物制品'],
  注册: ['境外生产药品', '境内生产药品']
}

interface TagClickParams {
  text: string
  type?: string
}

const HomePage: NextPage = () => {
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>(() => {
    // 从 localStorage 恢复搜索历史
    try {
      const saved = localStorage.getItem('searchHistory')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })
  const [shouldFocusInput, setShouldFocusInput] = useState(false)

  const handleSearch = useCallback((query: string) => {
    setIsSearching(true)
    setSearchTerm(query)
    setTimeout(() => {
      let searchResults = searchDrugs(query)
      
      // 应用标签筛选
      if (activeFilters.length > 0) {
        // 按类型分组筛选条件
        const filtersByType = activeFilters.reduce<Record<string, string[]>>((acc, filter) => {
          let type = "其他"
          // 先处理原研药标签
          if (filter === "原研药") {
            type = "原研"
          }
          // 再处理注册类型（使用后端值判断）
          else if (filter === "境外生产药品" || filter === "境内生产药品") {
            type = "注册"
          }
          // 最后处理其他类型
          else if (FILTER_OPTIONS.剂型?.includes(filter)) {
            type = "剂型"
          }
          else if (FILTER_OPTIONS.分类?.includes(filter)) {
            type = "分类"
          }
          
          // 确保类型安全的数组访问
          acc[type] = acc[type] ?? []
          acc[type]!.push(filter)  // 使用非空断言，因为我们已经确保了它存在
          return acc
        }, {})

        // 应用筛选逻辑
        searchResults = searchResults.filter(drug => {
          // 每种类型内部是OR，不同类型之间是AND
          return Object.entries(filtersByType).every(([type, filters]) => {
            switch (type) {
              case "原研":
                return drug.isOriginal
              case "剂型":
                return filters.some(f => drug.formulation === f)
              case "分类":
                return filters.some(f => drug.category === f)
              case "注册":
                return filters.some(f => drug.registrationType === f)
              default:
                return true
            }
          })
        })
      }
      
      setResults(searchResults)
      setIsSearching(false)
      
      // 添加搜索事件跟踪
      if (query.trim()) {
        trackEvent('search', {
          term: query,
          results_count: searchResults.length
        })
      }
    }, 300)
  }, [activeFilters])

  const handleTagClick = useCallback(({ text, type }: TagClickParams) => {
    setActiveFilters(prev => {
      // 使用 type 参数来决定如何处理筛选
      const newFilters = prev.includes(text)
        ? prev.filter(f => f !== text)
        : [...prev, text]
      
      // 根据类型进行特殊处理
      if (type === '注册') {
        // 注册类型互斥，移除其他注册类型
        return [...prev.filter(f => !f.includes('生产药品')), text]
      }
      
      // 添加筛选事件跟踪
      trackEvent('filter_change', {
        filters: newFilters
      })
      
      return newFilters
    })
  }, [])

  const handleClearFilters = useCallback(() => {
    setActiveFilters([])
  }, [])

  // 当筛选条件变化时重新搜索
  useEffect(() => {
    if (searchTerm) {
      handleSearch(searchTerm)
    }
  }, [activeFilters, handleSearch, searchTerm])

  // 保存搜索历史到 localStorage
  useEffect(() => {
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory))
  }, [searchHistory])

  // 处理历史记录点击
  const handleHistoryClick = useCallback(() => {
    if (searchHistory.length > 0) {
      const lastSearch = searchHistory[0]
      if (!lastSearch) return

      setSearchTerm(lastSearch.searchTerm)
      setActiveFilters([...lastSearch.filters])  // 创建新数组以确保类型安全
      handleSearch(lastSearch.searchTerm)
    }
  }, [searchHistory, handleSearch])

  // 处理关联搜索
  const handleRelatedSearch = useCallback((type: 'generic' | 'brand' | 'manufacturer', value: string) => {
    // 保存历史记录前先检查是否重复
    const currentState = {
      searchTerm,
      filters: [...activeFilters],  // 创建新数组以确保类型安全
      timestamp: Date.now()
    }
    setSearchHistory(prev => {
      // 避免重复添加相同的搜索
      if (prev[0]?.searchTerm === searchTerm && 
          JSON.stringify(prev[0]?.filters) === JSON.stringify(activeFilters)) {
        return prev
      }
      return [currentState, ...prev].slice(0, 10)
    })
    
    // 更新搜索词和筛选条件
    setSearchTerm(value)
    setShouldFocusInput(true) // 触发输入框聚焦
    
    // 根据类型设置筛选条件
    switch(type) {
      case 'generic':
        setActiveFilters(prev => 
          prev.filter(f => ['registrationType', 'formulation'].includes(f))
        )
        break
      case 'brand':
      case 'manufacturer':
        setActiveFilters([])
        break
    }
    
    // 添加关联搜索事件跟踪
    trackEvent('related_search', {
      from: searchTerm,
      to: value,
      type
    })
  }, [searchTerm, activeFilters])
  
  return (
    <>
      <NextSeo 
        title={searchTerm 
          ? `${searchTerm} 相关药品`
          : '原研药查询 - 专业的原研药品信息平台'
        }
        description={searchTerm
          ? `查看与"${searchTerm}"相关的${results.length}个药品信息，包括通用名、商品名、生产厂商等详细数据。`
          : siteConfig.description
        }
      />
      
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-white">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.2] pointer-events-none" />
        
        <Header />
        
        <main className="container relative max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">
              {siteConfig.name}
            </h1>

            {/* 优化副标题布局 */}
            <div className="flex flex-wrap justify-center items-center gap-x-1 gap-y-2 text-base text-gray-600">
              <div className="flex items-center">
                <span>已收录</span>
                <span className="mx-1 text-primary font-medium">{drugsData.meta.total}</span>
                <span>种药品</span>
              </div>

              <span className="hidden sm:block text-gray-400">·</span>

              <div className="flex items-center">
                <span>更新于</span>
                <span className="mx-1 text-primary font-medium">
                  {Math.floor((Date.now() - new Date(drugsData.meta.lastUpdate).getTime()) / (1000 * 60 * 60 * 24))}
                </span>
                <span>天前</span>
              </div>

              <span className="hidden sm:block text-gray-400">·</span>

              <div className="flex items-center">
                <span>来自</span>
                <a 
                  href={siteConfig.databaseUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ml-1 inline-flex items-center text-primary hover:text-primary-dark transition-colors group"
                >
                  原研药数据库
                  <svg 
                    className="w-4 h-4 ml-0.5 opacity-80" 
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* 搜索框添加卡片效果 */}
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8">
            <SearchBox 
              value={searchTerm}
              onChange={setSearchTerm}
              onSearch={handleSearch}
              shouldFocus={shouldFocusInput}
            />
          </div>

          {/* 只在有搜索词时显示筛选组件 */}
          {searchTerm && (
            <SearchFilters
              activeFilters={activeFilters}
              onTagClick={handleTagClick}
              onClearFilters={handleClearFilters}
            />
          )}

          {/* 在筛选区域和搜索结果之间添加统一的状态栏 */}
          {searchTerm && (
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              {/* 左侧：结果统计 */}
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="font-medium">
                  找到 {results.length} 个结果
                </span>
                {activeFilters.length > 0 && (
                  <span className="text-gray-400">
                    (已筛选)
                  </span>
                )}
              </div>

              {/* 右侧：搜索历史 - 简化版本 */}
              {searchHistory.length > 0 && (
                <button
                  onClick={handleHistoryClick}
                  className="text-sm text-primary hover:text-primary-dark hover:underline"
                >
                  返回上次搜索
                </button>
              )}
            </div>
          )}

          <SearchResults 
            results={results}
            isLoading={isSearching}
            searchTerm={searchTerm}
            onRelatedSearch={handleRelatedSearch}
            onTagClick={handleTagClick}
            activeFilters={activeFilters}
          />
        </main>

        <Footer />
      </div>
    </>
  )
}

export default HomePage
