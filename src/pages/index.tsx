import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState, useMemo, useCallback, useEffect } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchBox } from '@/components/search/SearchBox'
import { searchDrugs } from '@/lib/search'
import { siteConfig } from '@/lib/config'
import drugsData from '@/data/drugs.json'
import type { SearchResultItem } from '@/lib/types'
import { SearchResults } from '@/components/search/SearchResults'
import { ActiveFilters } from '@/components/search/ActiveFilters'
import { SearchTag } from '@/components/search/SearchTag'
import { formatRegistrationType } from '@/lib/utils'

// 添加筛选选项配置
const FILTER_OPTIONS = {
  剂型: ['片剂', '胶囊', '肠溶片', '注射剂'],
  分类: ['化学药品', '生物制品'],
  注册: ['进口药', '国产药']
}

interface TagClickParams {
  text: string
  type?: string  // 添加可选的 type 属性
}

const Home: NextPage = () => {
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeFilters, setActiveFilters] = useState<string[]>([])

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
        const filtersByType = activeFilters.reduce((acc, filter) => {
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
          
          acc[type] = acc[type] || []
          acc[type].push(filter)
          return acc
        }, {} as Record<string, string[]>)

        console.log('Filters by type:', filtersByType) // 调试日志

        // 应用筛选逻辑
        searchResults = searchResults.filter(drug => {
          // 每种类型内部是OR，不同类型之间是AND
          return Object.entries(filtersByType).every(([type, filters]) => {
            console.log(`Checking ${type}:`, filters) // 调试日志
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
      const newFilters = prev.includes(text)
        ? prev.filter(f => f !== text)
        : [...prev, text]
      return newFilters
    })
  }, [])

  const handleRemoveFilter = useCallback((filter: string) => {
    setActiveFilters(prev => prev.filter(f => f !== filter))
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

  return (
    <>
      <NextSeo 
        title={siteConfig.name}
        description={siteConfig.description}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
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

          <SearchBox onSearch={handleSearch} />

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
                      onClick={() => handleTagClick({ text: category, type: "分类" })}
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
                        onClick={() => handleTagClick({ text: filter, type: "" })}
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

              {/* 显示结果统计 */}
              <div className="mt-3 text-sm text-gray-500">
                找到 {results.length} 个结果
                {activeFilters.length > 0 && " (已筛选)"}
              </div>
            </div>
          )}

          <div className="mt-8">
            <SearchResults 
              results={results}
              isLoading={isSearching}
              searchTerm={searchTerm}
              onTagClick={handleTagClick}
              activeFilters={activeFilters}
            />
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
