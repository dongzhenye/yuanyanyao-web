import React from 'react'
import Link from 'next/link'
import { DrugWithPinyin } from '@/lib/types'
import { formatBrandName } from '@/lib/utils'

interface DrugHeaderProps {
  drug: DrugWithPinyin
}

export const DrugHeader: React.FC<DrugHeaderProps> = ({ drug }) => {
  return (
    <div>
      {/* 面包屑导航 */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500">
        <Link href="/" className="hover:text-primary">
          首页
        </Link>
        <span>/</span>
        <span>{drug.productName}</span>
      </nav>
      
      {/* 药品标题 */}
      <div className="mt-4">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          {drug.productName}
          {drug.isOriginal && (
            <span className="px-2 py-0.5 text-sm rounded-full bg-primary/10 text-primary">
              原研
            </span>
          )}
        </h1>
        <div className="mt-2 text-lg text-gray-600">
          {formatBrandName(drug.brandName.cn)}
          {drug.brandName.en && (
            <span className="ml-2 text-gray-400">
              ({formatBrandName(drug.brandName.en)})
            </span>
          )}
        </div>
      </div>
      
      {/* 标签信息 */}
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-primary/10 text-primary">
          {drug.registrationType === "境外生产药品" ? "进口药" : "国产药"}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          {drug.formulation}
        </span>
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
          {drug.category}
        </span>
      </div>
    </div>
  )
} 