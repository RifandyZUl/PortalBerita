import { useEffect, useState } from 'react';
import ProfileCard from '@/components/settings/ProfileCard';
import ProfileForm from '@/components/settings/ProfileForm';

const Settings = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null); // ⬅️ untuk menyimpan file upload

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/admin/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const data = await res.json();
        setAdminData(data.admin);
      } catch (err) {
        console.error('Gagal mengambil data admin:', err);
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
        {/* Kirim fungsi setPhoto ke ProfileCard */}
        <ProfileCard admin={adminData} onPhotoSelect={setPhoto} />
        {/* Kirim data admin dan foto ke form */}
        <ProfileForm admin={adminData} photo={photo} />
      </div>
    </div>
  );
};

export default Settings;
