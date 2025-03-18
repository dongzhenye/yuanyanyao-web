import React from 'react'
import { DrugWithPinyin } from '@/lib/types'
import { Tag } from '@/components/common/Tag'

interface BasicInfoProps {
  drug: DrugWithPinyin
}

export const BasicInfo: React.FC<BasicInfoProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">基础信息</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 左列 */}
        <div className="space-y-4">
          {/* 批准文号 */}
          <div>
            <div className="text-sm text-gray-500">批准文号</div>
            <div className="mt-1">{drug.identifier}</div>
          </div>

          {/* 注册类型 */}
          <div>
            <div className="text-sm text-gray-500">注册类型</div>
            <div className="mt-1">
              <Tag 
                text={drug.registrationType}
                type="其他"
              />
            </div>
          </div>

          {/* 药品类型 */}
          <div>
            <div className="text-sm text-gray-500">药品类型</div>
            <div className="mt-1">
              <Tag 
                text={drug.isOTC ? 'OTC药品' : '处方药'}
                type={drug.isOTC ? 'success' : 'warning'}
              />
            </div>
          </div>

          {/* 剂型 */}
          <div>
            <div className="text-sm text-gray-500">剂型</div>
            <div className="mt-1">
              <Tag 
                text={drug.formulation}
                type="其他"
              />
            </div>
          </div>
        </div>

        {/* 右列 */}
        <div className="space-y-4">
          {/* 分类 */}
          <div>
            <div className="text-sm text-gray-500">分类</div>
            <div className="mt-1">
              <Tag 
                text={drug.category}
                type="其他"
              />
            </div>
          </div>

          {/* 批准日期 */}
          <div>
            <div className="text-sm text-gray-500">批准日期</div>
            <div className="mt-1">{drug.approvalDate}</div>
          </div>

          {/* 更新日期 */}
          <div>
            <div className="text-sm text-gray-500">最后更新</div>
            <div className="mt-1">{drug.lastUpdated}</div>
          </div>
        </div>
      </div>
    </div>
  )
} 