import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { DrugWithPinyin } from '@/lib/types'
import drugsData from '@/data/drugs.json'
import { getDrugById } from '@/lib/search'
import { Header } from '@/components/layout/Header'
import { DrugHeader } from '@/components/drug/DrugHeader'
import { CompanyInfo } from '@/components/drug/CompanyInfo'
import { RelatedDrugs } from '@/components/drug/RelatedDrugs'
import { BasicInfo } from '@/components/drug/BasicInfo'
import { DrugNames } from '@/components/drug/DrugNames'
import { DrugSpecs } from '@/components/drug/DrugSpecs'
import { OriginalInfo } from '@/components/drug/OriginalInfo'
import { trackEvent } from '@/lib/analytics'
import { useEffect } from 'react'

interface DrugPageProps {
  drug: DrugWithPinyin
  relatedDrugs: {
    sameGeneric: DrugWithPinyin[]
    sameManufacturer: DrugWithPinyin[]
  }
}

const DrugPage: NextPage<DrugPageProps> = ({ drug, relatedDrugs }) => {
  useEffect(() => {
    trackEvent('view_drug', {
      drug_id: drug.id,
      drug_name: drug.productName
    })
  }, [drug.id, drug.productName])

  return (
    <>
      <NextSeo
        title={`${drug.productName} - ${drug.brandName.cn} | 原研药查询`}
        description={`${drug.productName}（${drug.brandName.cn}）的详细信息，包括规格、厂商、注册信息等。`}
      />
      
      <div className="min-h-screen bg-gray-50">
        <Header />
        
        <main className="container max-w-7xl mx-auto px-4 py-8">
          <DrugHeader drug={drug} />
          
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 主要内容区域 */}
            <div className="lg:col-span-8 space-y-6">
              <BasicInfo drug={drug} />
              <DrugNames drug={drug} />
              <DrugSpecs drug={drug} />
              <CompanyInfo drug={drug} />
              
              {/* 添加数据来源板块 */}
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">数据来源</h2>
                <div className="space-y-4">
                  {/* 数据来源 */}
                  <div>
                    <div className="text-sm text-gray-500">数据来源</div>
                    <div className="mt-1 flex items-center gap-2">
                      <span>原研药数据库</span>
                      <a 
                        href="https://github.com/dongzhenye/yuanyanyao" 
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-primary-dark transition-colors"
                      >
                        <svg className="w-4 h-4 inline-block" fill="currentColor" viewBox="0 0 24 24">
                          <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                  
                  {/* 更新日期 */}
                  <div>
                    <div className="text-sm text-gray-500">最后更新</div>
                    <div className="mt-1">{drug.lastUpdated}</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 侧边栏 */}
            <div className="lg:col-span-4 space-y-6">
              <OriginalInfo drug={drug} />
              <RelatedDrugs 
                sameGeneric={relatedDrugs.sameGeneric}
                sameManufacturer={relatedDrugs.sameManufacturer}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export const getStaticPaths = async () => {
  return {
    paths: drugsData.drugs.map(drug => ({
      params: { id: drug.id }
    })),
    fallback: false
  }
}

export const getStaticProps = async ({ params }: { params: { id: string } }) => {
  const drug = getDrugById(params.id)
  if (!drug) {
    return { notFound: true }
  }
  
  // 获取相关药品
  const relatedDrugs = {
    sameGeneric: drugsData.drugs
      .filter(d => d.genericName === drug.genericName && d.id !== drug.id)
      .slice(0, 5),
    sameManufacturer: drugsData.drugs
      .filter(d => d.manufacturerName === drug.manufacturerName && d.id !== drug.id)
      .slice(0, 5)
  }
  
  return { 
    props: { 
      drug,
      relatedDrugs
    } 
  }
}

export default DrugPage 