'use client';

import { LogOut } from 'lucide-react';
import Link from 'next/link';

export default function Header() {
  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

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
        
        <button
          onClick={handleLogout}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Déconnexion"
        >
          <LogOut className="w-5 h-5 text-gray-600" />
        </button>
      </div>
    </header>
  );
}
