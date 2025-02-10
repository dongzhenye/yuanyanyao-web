import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { useState, useMemo } from 'react'
import { Header } from '@/components/layout/Header'
import { SearchBox } from '@/components/search/SearchBox'
import { searchDrugs } from '@/lib/search'
import { siteConfig } from '@/lib/config'
import drugsData from '@/data/drugs.json'
import type { SearchResultItem } from '@/lib/types'

const Home: NextPage = () => {
  const [results, setResults] = useState<SearchResultItem[]>([])
  const [isSearching, setIsSearching] = useState(false)

  // 计算副标题
  const subtitle = useMemo(() => {
    return siteConfig.getSubtitle({
      total: drugsData.meta.total,
      lastUpdate: new Date(drugsData.meta.lastUpdate)
    })
  }, [])

  const handleSearch = (query: string) => {
    setIsSearching(true)
    // 简单的去抖动
    setTimeout(() => {
      setResults(searchDrugs(query))
      setIsSearching(false)
    }, 300)
  }

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

          <div className="mt-8">
            {isSearching ? (
              <div className="text-center text-gray-500">搜索中...</div>
            ) : results.length > 0 ? (
              <div className="space-y-4">
                {results.map(drug => (
                  <div 
                    key={drug.id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <div className="font-medium text-lg text-primary">
                      {drug.genericName}
                    </div>
                    <div className="mt-1 text-gray-500">
                      {drug.brandName.cn}
                      {drug.brandName.en && ` (${drug.brandName.en})`}
                    </div>
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
