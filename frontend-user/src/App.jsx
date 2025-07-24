// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import DefaultLayout from '@/layouts/DefaultLayout';
import HomePage from '@/pages/HomePage';
import NewsDetail from './pages/NewsDetail';
import SearchPage from '@/pages/SearchPage';
import CategoryPage from './pages/CategoryPage';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/news/:slug" element={<NewsDetail />} />
          <Route path="/berita/:slug" element={<NewsDetail />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
