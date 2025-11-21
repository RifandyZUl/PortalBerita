// Helper function untuk mendapatkan baseURL
// Bisa dipakai di file yang menggunakan fetch (bukan axios)

export const getBaseURL = () => {
  // Jika VITE_API_URL sudah di-set, gunakan itu
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Jika di production (Vercel), gunakan Railway URL
  if (import.meta.env.MODE === 'production' || (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'))) {
    return 'https://portalberitaa.up.railway.app';
  }
  
  // Default untuk development
  return 'http://localhost:5000';
};

