import { getTodaysSlovakWord, getAllSlovakWords } from '../actions';
import Header from '@/components/Header';
import SlovakLearning from '@/components/SlovakLearning';

export default async function SlovakPage() {
  const todaysWord = await getTodaysSlovakWord();
  const allWords = await getAllSlovakWords();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <SlovakLearning todaysWord={todaysWord} allWords={allWords} />
      </main>
    </div>
  );
}
