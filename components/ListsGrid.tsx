'use client';

import { useState } from 'react';
import { Plus, MapPin, Film, MessageCircle, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { createList } from '@/app/actions';

const EMOJI_SUGGESTIONS = ['🌍', '🎬', '💭', '🍽️', '📚', '🎵', '✈️', '🎨', '🏃', '💡'];
const COLOR_OPTIONS = [
  'from-pink-500 to-rose-500',
  'from-purple-500 to-indigo-500',
  'from-blue-500 to-cyan-500',
  'from-green-500 to-emerald-500',
  'from-yellow-500 to-orange-500',
  'from-red-500 to-pink-500',
];

export default function ListsGrid({ lists }: { lists: any[] }) {
  const [showNewList, setShowNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('✨');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);

  async function handleCreateList(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newListName);
    formData.append('emoji', selectedEmoji);
    formData.append('color', selectedColor);
    
    await createList(formData);
    setShowNewList(false);
    setNewListName('');
    setSelectedEmoji('✨');
    setSelectedColor(COLOR_OPTIONS[0]);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-800">Vos Listes</h2>
        <button
          onClick={() => setShowNewList(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Plus className="w-5 h-5" />
          Nouvelle Liste
        </button>
      </div>

      {showNewList && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-pink-200">
          <form onSubmit={handleCreateList} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de la liste
              </label>
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="ex: Endroits à visiter"
                className="w-full px-4 py-2 rounded-lg border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Emoji
              </label>
              <div className="flex gap-2 flex-wrap">
                {EMOJI_SUGGESTIONS.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setSelectedEmoji(emoji)}
                    className={`text-2xl p-2 rounded-lg transition-all ${
                      selectedEmoji === emoji
                        ? 'bg-pink-100 scale-110'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Couleur
              </label>
              <div className="flex gap-2 flex-wrap">
                {COLOR_OPTIONS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`w-12 h-12 rounded-lg bg-gradient-to-r ${color} transition-all ${
                      selectedColor === color
                        ? 'scale-110 ring-4 ring-pink-200'
                        : 'hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
              >
                Créer
              </button>
              <button
                type="button"
                onClick={() => setShowNewList(false)}
                className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-all"
              >
                Annuler
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {lists.map((list: any) => (
          <Link
            key={list.id}
            href={`/list/${list.id}`}
            className="group"
          >
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-pink-200">
              <div className={`bg-gradient-to-r ${list.color} p-4 rounded-xl mb-4 flex items-center justify-center`}>
                <span className="text-5xl">{list.emoji}</span>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-pink-600 transition-colors">
                {list.name}
              </h3>
              <p className="text-sm text-gray-500">
                Créée le {new Date(list.created_at).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {lists.length === 0 && !showNewList && (
        <div className="text-center py-16">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">Aucune liste pour le moment</p>
          <p className="text-gray-400">Créez votre première liste pour commencer !</p>
        </div>
      )}
    </div>
  );
}
