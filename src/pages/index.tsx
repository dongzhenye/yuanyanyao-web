import React from 'react'
import type { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchBox } from '@/components/search/SearchBox'
import { searchDrugs } from '@/lib/search'
import { siteConfig } from '@/lib/config'
import drugsData from '@/data/drugs.json'
import type { SearchResultItem, SearchHistory } from '@/lib/types'
import { SearchResults } from '@/components/search/SearchResults'
import { SearchTag } from '@/components/search/SearchTag'
import { SearchFilters } from '@/components/search/SearchFilters'

// 添加筛选选项配置
const FILTER_OPTIONS = {
  剂型: ['片剂', '胶囊', '肠溶片', '注射剂'],
  分类: ['化学药品', '生物制品'],
  注册: ['进口药', '国产药']
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
  const [searchHistory, setSearchHistory] = useState<SearchHistory[]>([])
  const [shouldFocusInput, setShouldFocusInput] = useState(false)

  // 计算副标题
  const subtitle = useMemo(() => {
    return siteConfig.getSubtitle({
      total: drugsData.meta.total,
      lastUpdate: new Date(drugsData.meta.lastUpdate)
    })
  }, [])

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

  // 处理关联搜索
  const handleRelatedSearch = useCallback((type: 'generic' | 'brand' | 'manufacturer', value: string) => {
    // 保存历史
    const currentState = {
      searchTerm,
      filters: activeFilters,
      timestamp: Date.now()
    }
    setSearchHistory(prev => [currentState, ...prev].slice(0, 10))
    
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
  }, [searchTerm, activeFilters])
  
  // 处理撤销操作
  const handleUndo = useCallback(() => {
    if (searchHistory.length > 0) {
      // 使用数组解构时进行类型检查
      const [firstState, ...rest] = searchHistory
      if (firstState) {  // 添加空值检查
        setSearchHistory(rest)
        setSearchTerm(firstState.searchTerm)
        setActiveFilters(firstState.filters)
      }
    }
  }, [searchHistory])

  return (
    <>
      <NextSeo 
        title={siteConfig.name}
        description={siteConfig.description}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {siteConfig.name}
            </h1>
            <p className="text-gray-500">
              {subtitle}
              <a 
                href={siteConfig.databaseUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-dark hover:underline transition-colors"
              >
                原研药数据库
              </a>
            </p>
          </div>

          <SearchBox
            value={searchTerm}
            onChange={setSearchTerm}
            onSearch={handleSearch}
            autoFocus={shouldFocusInput}
          />

          <SearchFilters 
            activeFilters={activeFilters}
            onTagClick={handleTagClick}
            onClearFilters={handleClearFilters}
          />

          {/* 添加筛选标签区域 */}
          {searchTerm && (
            <div className="mt-4 mb-6">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>筛选：</span>
                <div className="flex flex-wrap gap-2">
                  {/* 注册类型标签 */}
                  {FILTER_OPTIONS.注册.map(reg => {
                    const backendValue = reg === "进口药" ? "境外生产药品" : "境内生产药品"
                    return (
                      <SearchTag 
                        key={reg}
                        text={reg}
                        type="注册"
                        onClick={() => handleTagClick({ text: backendValue, type: "注册" })}
                        active={activeFilters.includes(backendValue)}
                      />
                    )
                  })}
                  
                  {/* 剂型标签 */}
                  {FILTER_OPTIONS.剂型.map(form => (
                    <SearchTag 
                      key={form}
                      text={form}
                      type="剂型"
                      onClick={() => handleTagClick({ text: form, type: "剂型" })}
                      active={activeFilters.includes(form)}
                    />
                  ))}

                  {/* 分类标签 */}
                  {FILTER_OPTIONS.分类.map(category => (
                    <SearchTag 
                      key={category}
                      text={category}
                      type="分类"
                      onClick={() => handleTagClick({ text: category })}
                      active={activeFilters.includes(category)}
                    />
                  ))}
                </div>
              </div>

              {/* 显示已选筛选条件 */}
              {activeFilters.length > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-sm text-gray-500">已选条件：</span>
                  <div className="flex flex-wrap gap-2">
                    {activeFilters.map(filter => (
                      <SearchTag
                        key={filter}
                        text={filter}
                        onClick={() => handleTagClick({ text: filter })}
                        active
                      />
                    ))}
                    <button
                      onClick={handleClearFilters}
                      className="text-sm text-gray-400 hover:text-gray-600"
                    >
                      清除全部
                    </button>
                  </div>
                </div>
              )}

              {/* 在筛选区域和搜索结果之间添加统一的状态栏 */}
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

                {/* 右侧：搜索历史 */}
                {searchHistory.length > 0 && (
                  <div className="flex items-center gap-3 text-sm">
                    <button
                      onClick={handleUndo}
                      className="flex items-center gap-1.5 text-primary hover:text-primary-dark transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      <span>返回上次搜索</span>
                    </button>
                    <span className="text-gray-400 text-xs">
                      |
                    </span>
                    <span className="text-gray-400">
                      共 {searchHistory.length} 条历史
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-8">
            <SearchResults 
              results={results}
              isLoading={isSearching}
              searchTerm={searchTerm}
              onRelatedSearch={handleRelatedSearch}
              onTagClick={handleTagClick}
              activeFilters={activeFilters}
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default HomePage
