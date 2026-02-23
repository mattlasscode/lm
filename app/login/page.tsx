'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';

export default function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = '/';
    } else {
      setError('Mot de passe incorrect');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="w-full max-w-md p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-4 rounded-2xl">
                <Heart className="w-12 h-12 text-white fill-white" />
              </div>
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Nos Listes
            </h1>
            <p className="text-gray-600">Leila & Matt</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mot de passe"
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none transition-colors"
                disabled={loading}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Connexion...' : 'Entrer'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
