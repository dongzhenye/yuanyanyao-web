import React, { useState, useRef, useLayoutEffect } from 'react'
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
  const [showAllFilters, setShowAllFilters] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const filtersContainerRef = useRef<HTMLDivElement>(null);
  const baseFiltersRef = useRef<HTMLDivElement>(null);

  // 更简单直接的宽度检测方法
  useLayoutEffect(() => {
    // 创建检测函数
    const checkWidth = () => {
      // 通过媒体查询检测屏幕宽度，更简单可靠
      const isMobile = window.matchMedia('(max-width: 768px)').matches;
      setShouldCollapse(isMobile);
    };

    // 初始检测
    checkWidth();

    // 设置窗口大小变化监听
    window.addEventListener('resize', checkWidth);

    // 清理
    return () => {
      window.removeEventListener('resize', checkWidth);
    };
  }, []);
  
  return (
    <div className="mt-0" ref={containerRef}>
      {/* 筛选标签 */}
      <div className="flex flex-wrap items-start gap-y-2">
        <span className="inline-flex items-center text-sm text-gray-500 whitespace-nowrap mr-2">
          筛选:
        </span>
        <div className="flex flex-wrap gap-2" ref={filtersContainerRef}>
          {/* 注册类型标签 - 默认显示的标签 */}
          <div ref={baseFiltersRef} className="flex flex-wrap gap-2">
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
          </div>

          {/* 额外的剂型标签 - 根据宽度判断是否显示 */}
          <div className={`${(showAllFilters || !shouldCollapse) ? 'flex' : 'hidden'} flex-wrap gap-2`}>
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
          
          {/* 展开/收起按钮 - 仅在移动端显示 */}
          {shouldCollapse && (
            <button 
              className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => setShowAllFilters(prev => !prev)}
            >
              {showAllFilters ? '收起' : '更多...'}
            </button>
          )}
        </div>
      </div>

      {/* 已选条件 */}
      {activeFilters.length > 0 && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-sm text-gray-500">已选:</span>
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
              清除
            </button>
          </div>
        </div>
      )}
    </div>
  )
} 