import { useEffect, useState } from 'react';
import DOMPurify from 'dompurify';

const dummyNews = {
  title: 'Harga Bitcoin Anjlok di Tengah Kekhawatiran Resesi AS',
  publishedAt: '2025-06-25',
  author: 'Admin Winnicode',
  imageUrl: 'https://tse4.mm.bing.net/th?id=OIP.bgvMu8vQcELlufCQPSZivgHaEK&pid=Api&P=0&h=220',
  content: `
    <p>Harga kripto bitcoin dan ethereum anjlok ke posisi terendah selama beberapa hari terakhir.</p>
    <h2>Penurunan Signifikan</h2>
    <ul>
      <li>Bitcoin turun lebih dari 10% dalam 24 jam.</li>
      <li>Total kapitalisasi pasar kripto merosot di bawah $1 triliun.</li>
      <li>Ethereum dan Solana ikut anjlok 15%.</li>
    </ul>
    <p>Investor khawatir terhadap resesi ekonomi di AS.</p>
  `,
};

const NewsDetail = () => {
  const [sanitizedContent, setSanitizedContent] = useState('');

  useEffect(() => {
    const cleanHTML = DOMPurify.sanitize(dummyNews.content);
    setSanitizedContent(cleanHTML);
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-3xl font-bold mb-2">{dummyNews.title}</h1>
      <p className="text-sm text-gray-500 mb-6">
        {dummyNews.publishedAt} | {dummyNews.author}
      </p>

      <img
        src={dummyNews.imageUrl}
        alt={dummyNews.title}
        onError={(e) => e.currentTarget.src = '/images/placeholder.jpg'}
        className="max-w-2xl w-full h-auto object-contain mx-auto rounded-md mb-6"
      />

      <div
        className="prose prose-base max-w-none text-justify"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      {/* Komentar (dummy UI) */}
      <section className="mt-10">
        <h2 className="text-xl font-semibold mb-4">Leave a Comment</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Nama"
            className="w-full px-4 py-2 rounded border border-gray-300 text-sm focus:outline-none"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 rounded border border-gray-300 text-sm focus:outline-none"
          />
          <textarea
            placeholder="Message..."
            rows="4"
            className="w-full px-4 py-2 rounded border border-gray-300 text-sm focus:outline-none"
          />
          <button
            type="submit"
            className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition"
          >
            Post Comment
          </button>
        </form>
      </section>
    </div>
  );
};

export default NewsDetail;
