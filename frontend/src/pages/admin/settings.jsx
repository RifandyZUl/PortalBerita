import ProfileCard from '@/components/settings/ProfileCard';
import ProfileForm from '@/components/settings/ProfileForm';

const Settings = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Account Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCard />
        <ProfileForm />
      </div>
    </div>
  );
};

export default Settings;
