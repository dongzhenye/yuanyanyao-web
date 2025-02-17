import React from 'react'
import { DrugWithPinyin } from '@/lib/types'

interface CompanyInfoProps {
  drug: DrugWithPinyin
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">企业信息</h2>
      
      <div className="space-y-4">
        {/* 上市许可持有人 */}
        <div>
          <div className="text-sm text-gray-500">上市许可持有人</div>
          <div className="mt-1 font-medium">{drug.mahName}</div>
        </div>
        
        {/* 生产企业 */}
        <div>
          <div className="text-sm text-gray-500">生产企业</div>
          <div className="mt-1">{drug.manufacturerName}</div>
        </div>
        
        {/* 分装企业（如有） */}
        {drug.packagingName && (
          <div>
            <div className="text-sm text-gray-500">分装企业</div>
            <div className="mt-1">{drug.packagingName}</div>
          </div>
        )}
      </div>
    </div>
  )
} 