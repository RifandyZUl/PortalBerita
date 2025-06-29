import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

const DefaultLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[80vh] px-4 sm:px-6 md:px-8">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
