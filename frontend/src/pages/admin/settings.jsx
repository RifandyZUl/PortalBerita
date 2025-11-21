import { useEffect, useState } from 'react';
import ProfileCard from '@/components/settings/ProfileCard';
import ProfileForm from '@/components/settings/ProfileForm';
import api from '../../utils/api';

const Settings = () => {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [photo, setPhoto] = useState(null);
  const [shouldRefresh, setShouldRefresh] = useState(false);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/api/admin/profile');
      if (res.data?.admin) {
        setAdminData(res.data.admin);
      } else {
        throw new Error(res.data?.message || 'Gagal memuat profil');
      }
    } catch (err) {
      console.error('Gagal mengambil data admin:', err);
      setAdminData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [shouldRefresh]);

  const handleProfileUpdated = () => {
    setShouldRefresh(prev => !prev); // Trigger fetch ulang
    setPhoto(null); // Reset foto setelah update
  };

  if (loading) return <p>Loading...</p>;
  if (!adminData) return <p>Gagal memuat profil.</p>;

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard admin={adminData} onPhotoSelect={setPhoto} />
        <ProfileForm
          admin={adminData}
          photo={photo}
          onProfileUpdated={handleProfileUpdated}
        />
      </div>
    </div>
  );
};

export default Settings;
