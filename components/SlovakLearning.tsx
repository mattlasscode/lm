'use client';

import { useState, useRef } from 'react';
import { Mic, Play, Plus, Calendar, BookOpen } from 'lucide-react';
import { createSlovakWord, updateSlovakWordAudio, uploadAudio } from '@/app/actions';
import type { SlovakWord } from '@/lib/supabase';

interface Props {
  todaysWord: SlovakWord | null;
  allWords: SlovakWord[];
}

export default function SlovakLearning({ todaysWord, allWords }: Props) {
  const [showNewWord, setShowNewWord] = useState(!todaysWord);
  const [recording, setRecording] = useState<{ person: 'matt' | 'leila' | null }>({ person: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  async function handleCreateWord(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await createSlovakWord(formData);
      setShowNewWord(false);
      window.location.reload();
    } catch (error) {
      console.error('Error creating word:', error);
      alert('Failed to create word');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function startRecording(person: 'matt' | 'leila') {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const file = new File([blob], `${person}-${Date.now()}.webm`, { type: 'audio/webm' });
        
        const formData = new FormData();
        formData.append('file', file);

        try {
          const audioUrl = await uploadAudio(formData);
          if (todaysWord) {
            await updateSlovakWordAudio(todaysWord.id, person, audioUrl);
            window.location.reload();
          }
        } catch (error) {
          console.error('Error uploading audio:', error);
          alert('Failed to upload recording');
        }

        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setRecording({ person });
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone');
    }
  }

  function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      setRecording({ person: null });
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
          Slovak Learning 🇸🇰
        </h1>
        <p className="text-gray-600">Daily word practice for Leila & Matt</p>
      </div>

      {/* Today's Word */}
      {todaysWord && !showNewWord ? (
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              {new Date(todaysWord.date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
            <button
              onClick={() => setShowNewWord(true)}
              className="text-sm text-purple-600 hover:text-purple-700"
            >
              Add new word
            </button>
          </div>

          <div className="text-center space-y-4 py-6">
            <div className="space-y-2">
              <div className="text-5xl font-bold text-purple-600">
                {todaysWord.word_slovak}
              </div>
              <div className="text-2xl text-gray-600">
                {todaysWord.word_english}
              </div>
            </div>
            {todaysWord.notes && (
              <p className="text-gray-500 italic">{todaysWord.notes}</p>
            )}
          </div>

          {/* Audio Recordings */}
          <div className="grid md:grid-cols-2 gap-4">
            {/* Matt's Recording */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  M
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Matt</div>
                  <div className="text-xs text-gray-600">Teacher</div>
                </div>
              </div>

              {todaysWord.matt_audio_url ? (
                <div className="space-y-2">
                  <audio src={todaysWord.matt_audio_url} controls className="w-full" />
                  <button
                    onClick={() => startRecording('matt')}
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                  >
                    Re-record
                  </button>
                </div>
              ) : recording.person === 'matt' ? (
                <button
                  onClick={stopRecording}
                  className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 animate-pulse"
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={() => startRecording('matt')}
                  className="w-full py-3 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Record Pronunciation
                </button>
              )}
            </div>

            {/* Leila's Recording */}
            <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  L
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Leila</div>
                  <div className="text-xs text-gray-600">Student</div>
                </div>
              </div>

              {todaysWord.leila_audio_url ? (
                <div className="space-y-2">
                  <audio src={todaysWord.leila_audio_url} controls className="w-full" />
                  <button
                    onClick={() => startRecording('leila')}
                    className="w-full py-2 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors text-sm"
                  >
                    Re-record
                  </button>
                </div>
              ) : recording.person === 'leila' ? (
                <button
                  onClick={stopRecording}
                  className="w-full py-3 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2 animate-pulse"
                >
                  <div className="w-3 h-3 bg-white rounded-full animate-ping" />
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={() => startRecording('leila')}
                  className="w-full py-3 px-4 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center justify-center gap-2"
                >
                  <Mic className="w-5 h-5" />
                  Record Practice
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* New Word Form */
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6" />
            Add Today's Word
          </h2>
          <form onSubmit={handleCreateWord} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slovak Word
              </label>
              <input
                type="text"
                name="wordSlovak"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Dobrý deň"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                English Translation
              </label>
              <input
                type="text"
                name="wordEnglish"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="e.g., Good day"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (optional)
              </label>
              <textarea
                name="notes"
                rows={3}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="Usage notes, pronunciation tips, etc."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Adding...' : 'Add Word'}
              </button>
              {todaysWord && (
                <button
                  type="button"
                  onClick={() => setShowNewWord(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* Previous Words */}
      {allWords.length > 0 && (
        <div className="bg-white rounded-3xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Previous Words ({allWords.length})
          </h2>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {allWords.map((word) => (
              <div
                key={word.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-purple-600">{word.word_slovak}</span>
                    <span className="text-gray-400">→</span>
                    <span className="text-gray-700">{word.word_english}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(word.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="flex gap-2">
                  {word.matt_audio_url && (
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      M
                    </div>
                  )}
                  {word.leila_audio_url && (
                    <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                      L
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
