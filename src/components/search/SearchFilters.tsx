import React from 'react'
import { SearchTag } from './SearchTag'

interface TagClickParams {
  text: string
  type?: string
}

interface SearchFiltersProps {
  activeFilters: string[]
  onTagClick: (params: TagClickParams) => void
  onClearFilters: () => void
}

// 精简后的筛选选项
const FILTER_OPTIONS = {
  剂型: ['片剂', '胶囊', '注射剂', '口服液'],
  注册: ['境外生产药品', '境内生产药品']
}

export const SearchFilters: React.FC<SearchFiltersProps> = ({
  activeFilters,
  onTagClick,
  onClearFilters
}) => {
  return (
    <div className="mt-4">
      {/* 筛选标签 */}
      <div className="flex flex-wrap items-start gap-y-3">
        <span className="inline-flex items-center text-sm text-gray-500 whitespace-nowrap mr-2">
          筛选:
        </span>
        <div className="flex flex-wrap gap-2">
          {/* 注册类型标签 */}
          <SearchTag
            text="境外生产药品"
            type="注册"
            onClick={() => onTagClick({ text: "境外生产药品", type: "注册" })}
            active={activeFilters.includes("境外生产药品")}
          />
          <SearchTag
            text="境内生产药品"
            type="注册"
            onClick={() => onTagClick({ text: "境内生产药品", type: "注册" })}
            active={activeFilters.includes("境内生产药品")}
          />

          {/* 剂型标签 */}
          {FILTER_OPTIONS.剂型.map(form => (
            <SearchTag
              key={form}
              text={form}
              type="剂型"
              onClick={() => onTagClick({ text: form, type: "剂型" })}
              active={activeFilters.includes(form)}
            />
          ))}
        </div>
      </div>

      {/* 已选条件 */}
      {activeFilters.length > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <span className="text-sm text-gray-500">已选条件：</span>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <SearchTag
                key={filter}
                text={filter}
                onClick={() => onTagClick({ text: filter })}
                active
              />
            ))}
            <button
              onClick={onClearFilters}
              className="text-sm text-gray-400 hover:text-gray-600"
            >
              清除全部
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 