'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Check, Trash2, Image as ImageIcon, MessageSquare, X } from 'lucide-react';
import Link from 'next/link';
import { createItem, toggleItemComplete, deleteItem, addCompletion, uploadImage } from '@/app/actions';

export default function ListDetail({ list, items }: { list: any; items: any[] }) {
  const [newItemText, setNewItemText] = useState('');
  const [showCompletionModal, setShowCompletionModal] = useState<number | null>(null);
  const [completionComment, setCompletionComment] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemText.trim()) return;
    
    await createItem(list.id, newItemText);
    setNewItemText('');
  }

  async function handleToggleComplete(itemId: number) {
    const item = items.find(i => i.id === itemId);
    if (!item.completed) {
      setShowCompletionModal(itemId);
    } else {
      await toggleItemComplete(itemId, list.id);
    }
  }

  async function handleAddCompletion(itemId: number) {
    const formData = new FormData();
    
    let imageUrl = '';
    if (selectedFile) {
      setUploadingImage(true);
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });
      const data = await response.json();
      imageUrl = data.url;
      setUploadingImage(false);
    }
    
    formData.append('comment', completionComment);
    formData.append('imageUrl', imageUrl);
    
    await addCompletion(itemId, list.id, formData);
    await toggleItemComplete(itemId, list.id);
    
    setShowCompletionModal(null);
    setCompletionComment('');
    setImagePreview(null);
    setSelectedFile(null);
  }

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleDeleteItem(itemId: number) {
    if (confirm('Supprimer cet élément ?')) {
      await deleteItem(itemId, list.id);
    }
  }

  const completedItems = items.filter(item => item.completed);
  const pendingItems = items.filter(item => !item.completed);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/"
          className="p-2 hover:bg-white/50 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </Link>
        <div className="flex-1">
          <div className={`bg-gradient-to-r ${list.color} p-4 rounded-xl inline-flex items-center justify-center mb-2`}>
            <span className="text-4xl">{list.emoji}</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800">{list.name}</h1>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <form onSubmit={handleAddItem} className="flex gap-2">
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            placeholder="Ajouter un élément..."
            className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Ajouter
          </button>
        </form>
      </div>

      {pendingItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">À faire</h2>
          <div className="space-y-3">
            {pendingItems.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
              >
                <button
                  onClick={() => handleToggleComplete(item.id)}
                  className="w-6 h-6 rounded-full border-2 border-gray-300 hover:border-pink-500 transition-colors flex-shrink-0"
                />
                <span className="flex-1 text-gray-800">{item.text}</span>
                <button
                  onClick={() => handleDeleteItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {completedItems.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Complété ✨</h2>
          <div className="space-y-4">
            {completedItems.map((item: any) => (
              <div key={item.id} className="border-2 border-green-100 rounded-xl p-4 bg-green-50/50">
                <div className="flex items-center gap-3 mb-3">
                  <button
                    onClick={() => handleToggleComplete(item.id)}
                    className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center flex-shrink-0"
                  >
                    <Check className="w-4 h-4 text-white" />
                  </button>
                  <span className="flex-1 text-gray-800 line-through">{item.text}</span>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="p-2 hover:bg-red-100 rounded-lg transition-all"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>
                
                {item.completions && item.completions.length > 0 && (
                  <div className="ml-9 space-y-3">
                    {item.completions.map((completion: any) => (
                      <div key={completion.id} className="bg-white rounded-lg p-3 border border-green-200">
                        {completion.comment && (
                          <p className="text-gray-700 mb-2">{completion.comment}</p>
                        )}
                        {completion.image_url && (
                          <img
                            src={completion.image_url}
                            alt="Completion"
                            className="rounded-lg max-w-sm w-full"
                          />
                        )}
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(completion.created_at).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showCompletionModal !== null && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-800">Marquer comme complété</h3>
              <button
                onClick={() => {
                  setShowCompletionModal(null);
                  setCompletionComment('');
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Commentaire (optionnel)
                </label>
                <textarea
                  value={completionComment}
                  onChange={(e) => setCompletionComment(e.target.value)}
                  placeholder="Comment c'était ? Vos impressions..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-pink-500 focus:outline-none resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo (optionnel)
                </label>
                <div className="space-y-2">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="rounded-xl w-full max-h-64 object-cover"
                      />
                      <button
                        onClick={() => {
                          setImagePreview(null);
                          setSelectedFile(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-pink-500 cursor-pointer transition-colors">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <span className="text-sm text-gray-500">Cliquez pour ajouter une photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => handleAddCompletion(showCompletionModal)}
                disabled={uploadingImage}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
              >
                {uploadingImage ? 'Upload en cours...' : 'Marquer comme fait'}
              </button>
              <button
                onClick={async () => {
                  await toggleItemComplete(showCompletionModal, list.id);
                  setShowCompletionModal(null);
                  setCompletionComment('');
                  setImagePreview(null);
                  setSelectedFile(null);
                }}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-all"
              >
                Sans détails
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
