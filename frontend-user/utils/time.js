export const formatWaktuLalu = (tanggal) => {
  const sekarang = new Date();
  const waktu = new Date(tanggal);
  const selisihMs = sekarang - waktu;

  const menit = Math.floor(selisihMs / (1000 * 60));
  const jam = Math.floor(selisihMs / (1000 * 60 * 60));
  const hari = Math.floor(selisihMs / (1000 * 60 * 60 * 24));

  if (menit < 1) return 'Baru saja';
  if (menit < 60) return `${menit} menit yang lalu`;
  if (jam < 24) return `${jam} jam yang lalu`;
  if (hari < 7) return `${hari} hari yang lalu`;

  // Jika lebih dari 7 hari, tampilkan tanggal lengkap
  return waktu.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};
