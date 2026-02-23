import { getLists } from './actions';
import ListsGrid from '@/components/ListsGrid';
import Header from '@/components/Header';

export default async function HomePage() {
  const lists = await getLists();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ListsGrid lists={lists} />
      </main>
    </div>
  );
}
