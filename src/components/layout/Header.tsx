import Link from 'next/link'

const Logo = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="28" 
    height="28" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor"
    className="text-primary"
  >
    <path 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      strokeWidth="2" 
      d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" 
    />
  </svg>
)

export const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link 
            href="/" 
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <Logo />
            <span className="text-xl font-bold">原研药查询</span>
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