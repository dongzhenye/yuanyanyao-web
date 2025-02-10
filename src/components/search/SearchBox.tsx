import React, { useState, useCallback } from 'react'

interface SearchBoxProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export const SearchBox = ({ onSearch, placeholder }: SearchBoxProps) => {
  const [value, setValue] = useState('')
  
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setValue(newValue)
    onSearch(newValue)
  }, [onSearch])

  return (
    <div className="relative max-w-2xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={handleChange}
        placeholder={placeholder || "输入药品名称、拼音或简拼搜索"}
        className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg 
          focus:ring-2 focus:ring-primary/20 focus:border-primary
          placeholder:text-gray-400"
      />
      <div className="absolute right-3 top-1/2 -translate-y-1/2">
        {value && (
          <button
            onClick={() => {
              setValue('')
              onSearch('')
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  )
} 