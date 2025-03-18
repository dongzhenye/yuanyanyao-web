import React from 'react'

interface BrandNameProps {
  name: string | React.ReactNode
  className?: string
}

// 检查文本是否已包含商标符号
function hasTrademarkSymbol(text: string): boolean {
  return text.includes('®') || text.includes('™');
}

// 内部格式化函数
function formatName(name: string): string {
  if (!name) return '';
  return hasTrademarkSymbol(name) ? name : `${name}®`;
}

export const BrandName: React.FC<BrandNameProps> = ({ name, className = '' }) => {
  // 如果name是React元素
  if (React.isValidElement(name)) {
    // 获取元素的文本内容
    const textContent = name.props.text || '';
    
    // 检查是否已有商标符号
    if (hasTrademarkSymbol(textContent)) {
      return <span className={className}>{name}</span>;
    }
    
    // 无商标符号则添加
    return (
      <span className={className}>
        {name}
        <sup className="text-[0.6em]">®</sup>
      </span>
    );
  }
  
  // 如果是字符串
  if (typeof name === 'string') {
    const formattedName = formatName(name);
    const parts = formattedName.split('®');
    
    // 如果没有®符号，直接返回
    if (parts.length === 1) {
      return <span className={className}>{formattedName}</span>;
    }
    
    // 处理带有®符号的文本
    return (
      <span className={className}>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            {part}
            {index < parts.length - 1 && (
              <sup className="text-[0.6em]">®</sup>
            )}
          </React.Fragment>
        ))}
      </span>
    );
  }
  
  // 其他类型直接返回
  return <span className={className}>{String(name)}</span>;
} 