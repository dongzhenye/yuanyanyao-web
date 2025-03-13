import React, { useState, useRef, useLayoutEffect } from 'react'

interface SearchSuggestionsProps {
  onSelect: (term: string) => void
}

// 热门搜索词列表
const HOT_SEARCHES = [
  {
    type: '常用药品',
    terms: ['芬必得', '达菲', '美林', '布洛芬']
  },
  {
    type: '慢性病药',
    terms: ['拜新同', '阿托伐他汀', '氯吡格雷', '厄贝沙坦']
  },
  {
    type: '知名药企',
    terms: ['辉瑞', '拜耳']
  }
]

// 优先显示的热门药品（移动端默认只显示这些）
const PRIORITY_TERMS = ['芬必得', '达菲', '美林', '布洛芬', '辉瑞'];

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSelect }) => {
  const [showAllTerms, setShowAllTerms] = useState(false);
  const [shouldCollapse, setShouldCollapse] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const termsContainerRef = useRef<HTMLDivElement>(null);
  const priorityTermsRef = useRef<HTMLDivElement>(null);
  
  const allTerms = HOT_SEARCHES.flatMap(group => group.terms);
  const priorityTerms = allTerms.filter(term => PRIORITY_TERMS.includes(term));
  const otherTerms = allTerms.filter(term => !PRIORITY_TERMS.includes(term));
  
  // 使用更简单直接的宽度检测方法
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
    <div className="mt-3" ref={containerRef}>
      <div className="text-sm text-gray-500 mb-2">热门搜索：</div>
      <div className="flex flex-wrap gap-2" ref={termsContainerRef}>
        {/* 优先显示的标签 */}
        <div ref={priorityTermsRef} className="flex flex-wrap gap-2">
          {priorityTerms.map(term => (
            <button
              key={term}
              onClick={() => onSelect(term)}
              className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
        
        {/* 其他标签 - 根据宽度判断是否显示 */}
        <div className={`${(showAllTerms || !shouldCollapse) ? 'flex' : 'hidden'} flex-wrap gap-2`}>
          {otherTerms.map(term => (
            <button
              key={term}
              onClick={() => onSelect(term)}
              className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {term}
            </button>
          ))}
        </div>
        
        {/* 展开/收起按钮 - 仅在移动端显示 */}
        {shouldCollapse && (
          <button 
            className="px-2 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => setShowAllTerms(prev => !prev)}
          >
            {showAllTerms ? '收起' : '更多...'}
          </button>
        )}
      </div>
    </div>
  )
} 