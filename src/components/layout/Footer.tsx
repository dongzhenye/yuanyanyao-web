import React from 'react'
import Link from 'next/link'

export const Footer = () => {
  return (
    <footer className="py-6 border-t border-gray-200 bg-white">
      <div className="container max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center text-sm text-gray-500 space-x-2">
          <span>作者</span>
          <a 
            href="https://dongzhenye.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            @dongzhenye
          </a>
          <span className="text-gray-300">·</span>
          <Link
            href="/about"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            关于我们
          </Link>
          <span className="text-gray-300">·</span>
          <a
            href="https://github.com/dongzhenye/yuanyanyao/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            我要纠错
          </a>
        </div>
      </div>
    </footer>
  )
} 