import React, { useState, useRef, useLayoutEffect } from 'react'

interface SearchSuggestionsProps {
  onSelect: (term: string) => void
}

// 热门搜索词列表
const HOT_SEARCHES = [
  {
    type: '常用药品',
    terms: ['布洛芬', '奥司他韦', '阿托伐他汀']
  },
  {
    type: '品牌药品',
    terms: ['芬必得', '美林', '达菲']
  },
  {
    type: '知名药企',
    terms: ['辉瑞', '拜耳']
  }
]

// 所有搜索词
const ALL_TERMS = HOT_SEARCHES.flatMap(group => group.terms);

export const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ onSelect }) => {
  const [showAllTerms, setShowAllTerms] = useState(false);
  const [visibleTerms, setVisibleTerms] = useState<string[]>([]);
  const [needsMoreButton, setNeedsMoreButton] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const termsContainerRef = useRef<HTMLDivElement>(null);
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  
  // 计算可见标签数量
  useLayoutEffect(() => {
    const calculateVisibleTerms = () => {
      const container = termsContainerRef.current;
      const moreButton = moreButtonRef.current;
      if (!container || !moreButton) return;

      // 重置容器状态
      setShowAllTerms(false);
      
      // 计算"更多"按钮的宽度
      const moreButtonWidth = moreButton.offsetWidth;
      
      // 获取容器宽度
      const containerWidth = container.offsetWidth;
      
      // 临时创建一个标签来测量单个标签的宽度
      const tempButton = document.createElement('button');
      tempButton.className = 'px-2 py-1 text-[14px] bg-gray-100 text-gray-700 rounded-full';
      tempButton.style.visibility = 'hidden';
      container.appendChild(tempButton);
      
      try {
        // 计算每个标签的实际宽度
        const tagWidths = ALL_TERMS.map(term => {
          tempButton.textContent = term;
          const width = tempButton.offsetWidth;
          return width + 8; // 8px for gap
        });
        
        // 计算所有标签的总宽度
        const totalWidth = tagWidths.reduce((sum, width) => sum + (width || 0), 0);
        
        // 判断是否需要"更多"按钮
        const needsMore = totalWidth > containerWidth;
        setNeedsMoreButton(needsMore);
        
        if (needsMore) {
          // 计算可以显示多少个标签
          let currentWidth = 0;
          let visibleCount = 0;
          
          for (let i = 0; i < tagWidths.length; i++) {
            const width = tagWidths[i];
            if (width === undefined) continue;
            
            // 预留更多按钮的空间
            if (currentWidth + width + moreButtonWidth + 8 > containerWidth) break;
            
            currentWidth += width;
            visibleCount++;
          }
          
          // 设置可见标签
          setVisibleTerms(ALL_TERMS.slice(0, Math.max(1, visibleCount))); // 确保至少显示1个标签
        } else {
          // 如果空间足够，显示所有标签
          setVisibleTerms(ALL_TERMS);
        }
      } finally {
        // 移除临时标签
        if (container.contains(tempButton)) {
          container.removeChild(tempButton);
        }
      }
    };

    // 初始计算
    calculateVisibleTerms();
    
    // 监听窗口大小变化
    window.addEventListener('resize', calculateVisibleTerms);
    
    return () => {
      window.removeEventListener('resize', calculateVisibleTerms);
    };
  }, []);

  return (
    <div className="mt-3" ref={containerRef}>
      <div className="text-[14px] text-gray-500 mb-2">热门搜索：</div>
      <div 
        ref={termsContainerRef}
        className={`flex gap-2 ${showAllTerms ? 'flex-wrap' : 'flex-nowrap overflow-hidden'}`}
      >
        {/* 可见标签 */}
        {(showAllTerms ? ALL_TERMS : visibleTerms).map(term => (
          <button
            key={term}
            onClick={() => onSelect(term)}
            className="shrink-0 px-2 py-1 text-[14px] bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            {term}
          </button>
        ))}
        
        {/* 更多按钮 - 只在需要时显示 */}
        {needsMoreButton && (
          <button 
            ref={moreButtonRef}
            className="shrink-0 px-2 py-1 text-[14px] bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            onClick={() => setShowAllTerms(prev => !prev)}
          >
            {showAllTerms ? '收起' : '更多...'}
          </button>
        )}
      </div>
    </div>
  )
} 