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

const FILTER_OPTIONS = {
  剂型: ['片剂', '胶囊', '肠溶片', '注射剂'],
  分类: ['化学药品', '生物制品', '中药', '天然药物'],
  注册: ['进口药', '国产药']
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
          {/* 原研药标签（移到最前面） */}
          <SearchTag
            text="原研药"
            type="原研"
            onClick={() => onTagClick({ text: "原研药", type: "原研" })}
            active={activeFilters.includes("原研药")}
          />

          {/* 注册类型标签 */}
          <SearchTag
            text="进口药"
            type="注册"
            onClick={() => onTagClick({ text: "境外生产药品", type: "注册" })}
            active={activeFilters.includes("境外生产药品")}
          />
          <SearchTag
            text="国产药"
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

          {/* 分类标签 */}
          {FILTER_OPTIONS.分类.map(category => (
            <SearchTag
              key={category}
              text={category}
              type="分类"
              onClick={() => onTagClick({ text: category, type: "分类" })}
              active={activeFilters.includes(category)}
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