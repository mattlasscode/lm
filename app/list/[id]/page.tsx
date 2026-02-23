import { redirect } from 'next/navigation';
import { getListWithItems } from '@/app/actions';
import ListDetail from '@/components/ListDetail';
import Header from '@/components/Header';

export default async function ListPage({ params }: { params: { id: string } }) {
  const listId = parseInt(params.id);
  const data = await getListWithItems(listId);

  if (!data.list) {
    redirect('/');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <ListDetail list={data.list} items={data.items} />
      </main>
    </div>
  );
}
