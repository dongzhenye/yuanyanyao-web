import React from 'react'
import { DrugWithPinyin } from '@/lib/types'

interface OriginalInfoProps {
  drug: DrugWithPinyin
}

export const OriginalInfo: React.FC<OriginalInfoProps> = ({ drug }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">原研信息</h2>
      
      <div className="space-y-4">
        {/* 原研状态 */}
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium ${
            drug.isOriginal 
              ? 'bg-primary/10 text-primary' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            {drug.isOriginal ? '原研药品' : '仿制药品'}
          </span>
        </div>

        {/* 原研公司 */}
        <div>
          <div className="text-sm text-gray-500">原研公司</div>
          <div className="mt-1 font-medium">{drug.originator}</div>
        </div>

        {/* 认定依据 */}
        {drug.originatorSource && drug.originatorSource.length > 0 && (
          <div>
            <div className="text-sm text-gray-500">认定依据</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {drug.originatorSource.map((source, index) => (
                <a
                  key={index}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                >
                  {source.type}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* 特殊说明 */}
        {drug.originalException && (
          <div>
            <div className="text-sm text-gray-500">特殊说明</div>
            <div className="mt-1 text-gray-600 text-sm">{drug.originalException}</div>
          </div>
        )}
      </div>
    </div>
  )
} 