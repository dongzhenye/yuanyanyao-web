import React, { useState } from 'react'
import { DrugWithPinyin } from '@/lib/types'

interface DrugIdentifierProps {
  drug: DrugWithPinyin
}

export const DrugIdentifier: React.FC<DrugIdentifierProps> = ({ drug }) => {
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000) // 2秒后隐藏提示
    } catch (err) {
      console.error('复制失败:', err)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">标识信息</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* 国药准字 */}
          <div className="space-y-1">
            <dt className="text-sm text-gray-500">国药准字</dt>
            <dd className="flex items-center gap-2 group">
              <span className="font-medium">{drug.identifier}</span>
              <button
                onClick={() => handleCopy(drug.identifier)}
                className="relative text-gray-400 hover:text-primary transition-colors"
                title="复制"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                {copySuccess && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 text-xs text-white bg-gray-800 rounded whitespace-nowrap">
                    已复制
                  </span>
                )}
              </button>
            </dd>
          </div>

          {/* 批准日期 */}
          <div className="space-y-1">
            <dt className="text-sm text-gray-500">批准日期</dt>
            <dd className="font-medium">{drug.approvalDate}</dd>
          </div>
        </div>
      </div>
    </div>
  )
} 