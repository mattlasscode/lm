import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-2 rounded-xl">
            <span className="text-2xl">🐸</span>
          </div>
          <div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Nos Listes
            </h1>
            <p className="text-xs text-gray-600">Leila & Matt</p>
          </div>
        </Link>
        
        <nav className="flex gap-4">
          <Link 
            href="/" 
            className="px-4 py-2 text-gray-600 hover:text-purple-600 transition-colors font-medium"
          >
            Lists
          </Link>
          <Link 
            href="/slovak" 
            className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all font-medium"
          >
            🇸🇰 Slovak
          </Link>
        </nav>
      </div>
    </header>
  );
}
