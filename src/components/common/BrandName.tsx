import React from 'react'

interface BrandNameProps {
  name: string
  className?: string
}

// 内部格式化函数
function formatName(name: string): string {
  if (!name) return '';
  
  // 如果源数据已经包含商标符号，不再添加
  if (name.includes('®') || name.includes('™')) {
    return name;
  }
  
  // 添加商标符号
  return `${name}®`;
}

export const BrandName: React.FC<BrandNameProps> = ({ name, className = '' }) => {
  // 首先使用内部格式化函数确保有®符号
  const formattedName = formatName(name)
  
  // 分割文本，处理®符号
  const parts = formattedName.split('®')
  
  // 如果没有®符号（这种情况应该很少见），直接返回名称
  if (parts.length === 1) {
    return <span className={className}>{formattedName}</span>
  }
  
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
  )
} 