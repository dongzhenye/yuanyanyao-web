import Link from 'next/link'

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-xl font-bold">
            原研药查询
          </Link>
          <nav className="flex gap-8">
            <Link href="/about" className="hover:text-primary">关于</Link>
            <a 
              href="https://github.com/dongzhenye/yuanyanyao"
              target="_blank"
              rel="noopener"
              className="hover:text-primary"
            >
              GitHub
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
} 