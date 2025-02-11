import React from 'react'
import { DrugWithPinyin } from '@/lib/types'

interface DrugSpecsProps {
  drug: DrugWithPinyin
}

export const DrugSpecs: React.FC<DrugSpecsProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">产品信息</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 药品类别 */}
          <div>
            <div className="text-sm text-gray-500">药品类别</div>
            <div className="mt-1">{drug.category}</div>
          </div>

          {/* 剂型 */}
          <div>
            <div className="text-sm text-gray-500">剂型</div>
            <div className="mt-1">{drug.formulation}</div>
          </div>
        </div>

        {/* 规格 */}
        <div>
          <div className="text-sm text-gray-500">规格</div>
          <div className="mt-1">{drug.specification}</div>
        </div>

        {/* 包装规格 */}
        {drug.packageSpec && (
          <div>
            <div className="text-sm text-gray-500">包装规格</div>
            <div className="mt-1">{drug.packageSpec}</div>
          </div>
        )}
      </div>
    </div>
  )
} 