import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom'; // ✅ penting

const DefaultLayout = () => {
  return (
    <>
      <Header />
      <main className="min-h-[80vh]">
        <Outlet /> {/* Ini yang menampilkan HomePage */}
      </main>
      <Footer />
    </>
  );
};

export default DefaultLayout;
// DefaultLayout.jsx