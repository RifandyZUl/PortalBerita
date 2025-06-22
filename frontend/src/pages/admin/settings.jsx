import { useEffect, useState } from 'react';
import ProfileCard from '@/components/settings/ProfileCard';
import ProfileForm from '@/components/settings/ProfileForm';

const Settings = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null); // Untuk menyimpan file gambar baru

  // Ambil data profil admin saat komponen dimount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || 'Gagal memuat profil');
        setAdminData(data.admin);
      } catch (err) {
        console.error('Gagal mengambil data admin:', err);
        setAdminData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!adminData) return <p>Gagal memuat profil.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kirim admin dan fungsi setPhoto ke ProfileCard */}
        <ProfileCard admin={adminData} onPhotoSelect={setPhoto} />

        {/* Kirim admin dan file foto ke ProfileForm */}
        <ProfileForm admin={adminData} photo={photo} />
      </div>
    </div>
  );
};

export default Settings;
