import React, { useCallback, useRef, useEffect } from 'react'
import { SearchSuggestions } from './SearchSuggestions'

interface SearchBoxProps {
  value: string
  onChange: (value: string) => void
  onSearch: (query: string) => void
  placeholder?: string
  shouldFocus?: boolean
}

export const SearchBox = ({ 
  value, 
  onChange, 
  onSearch, 
  placeholder,
  shouldFocus,
}: SearchBoxProps) => {
  const inputRef = useRef<HTMLInputElement>(null)
  const searchTimeoutRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    if (shouldFocus) {
      inputRef.current?.focus()
    }
  }, [shouldFocus])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    onChange(newValue)
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      onSearch(newValue)
    }, 300)
  }, [onChange, onSearch])

  const handleSuggestionSelect = useCallback((term: string) => {
    onChange(term)
    onSearch(term)
  }, [onChange, onSearch])

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder || "输入药品名称、拼音或简拼搜索"}
          className="w-full px-4 py-3 text-lg border border-gray-300 rounded-lg 
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            placeholder:text-gray-400
            transition-all duration-200 ease-in-out"
        />
        <div className="absolute right-3 top-0 h-full flex items-center">
          {value && (
            <button
              onClick={() => {
                onChange('')
                onSearch('')
              }}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
      
      <SearchSuggestions onSelect={handleSuggestionSelect} />
    </div>
  )
} 