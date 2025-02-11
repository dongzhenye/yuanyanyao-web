import { NextPage } from 'next'
import { NextSeo } from 'next-seo'
import { DrugWithPinyin } from '@/lib/types'
import drugsData from '@/data/drugs.json'
import { getDrugById } from '@/lib/search'
import { Header } from '@/components/layout/Header'
import { DrugHeader } from '@/components/drug/DrugHeader'
import { CompanyInfo } from '@/components/drug/CompanyInfo'
import { RelatedDrugs } from '@/components/drug/RelatedDrugs'
import { DrugIdentifier } from '@/components/drug/DrugIdentifier'
import { DrugNames } from '@/components/drug/DrugNames'
import { DrugSpecs } from '@/components/drug/DrugSpecs'
import { OriginalInfo } from '@/components/drug/OriginalInfo'
import { DataSource } from '@/components/drug/DataSource'

interface DrugPageProps {
  drug: DrugWithPinyin
  relatedDrugs: {
    sameGeneric: DrugWithPinyin[]
    sameManufacturer: DrugWithPinyin[]
  }
}

const DrugPage: NextPage<DrugPageProps> = ({ drug, relatedDrugs }) => {
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
              <DrugIdentifier drug={drug} />
              <DrugNames drug={drug} />
              <DrugSpecs drug={drug} />
              <CompanyInfo drug={drug} />
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

        {/* 数据来源信息 */}
        <DataSource lastUpdated={drug.lastUpdated} />
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