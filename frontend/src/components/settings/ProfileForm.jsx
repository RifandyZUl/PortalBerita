import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import PropTypes from 'prop-types';

const ProfileForm = ({ admin, photo }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm();

  // Set default values ketika `admin` berubah
  useEffect(() => {
    if (admin) {
      reset({
        firstName: admin.firstName || '',
        lastName: admin.lastName || '',
        email: admin.email || '',
        username: admin.username || '',
        bio: admin.bio || ''
      });
    }
  }, [admin, reset]);

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('username', data.username);
    formData.append('bio', data.bio);
    if (photo) formData.append('photo', photo);

    try {
      const res = await fetch('http://localhost:5000/api/admin/profile', {
        method: 'PUT',
        body: formData,
        credentials: 'include',
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Gagal memperbarui profil');
      toast.success('Profil berhasil diperbarui!');
    } catch (err) {
      console.error(err);
      toast.error('Gagal memperbarui profil');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <h3 className="font-semibold text-lg">Profile Information</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <input
            type="text"
            placeholder="First Name"
            {...register('firstName', { required: 'First name is required' })}
            className="border px-3 py-2 w-full"
          />
          {errors.firstName && (
            <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            placeholder="Last Name"
            {...register('lastName')}
            className="border px-3 py-2 w-full"
          />
        </div>
      </div>

      <input
        type="email"
        placeholder="Email Address"
        {...register('email', {
          required: 'Email is required',
          pattern: {
            value: /^\S+@\S+$/i,
            message: 'Invalid email format'
          }
        })}
        className="border px-3 py-2 w-full"
      />
      {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

      <input
        type="text"
        placeholder="Username"
        {...register('username', { required: 'Username is required' })}
        className="border px-3 py-2 w-full"
      />
      {errors.username && <p className="text-red-500 text-sm">{errors.username.message}</p>}

      <textarea
        placeholder="Bio"
        {...register('bio')}
        className="border px-3 py-2 w-full min-h-[100px]"
      />

      <div className="flex justify-end gap-4">
        <button
          type="button"
          className="px-4 py-2 border rounded hover:bg-gray-100 transition"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

ProfileForm.propTypes = {
  admin: PropTypes.object.isRequired,
  photo: PropTypes.object
};

export default ProfileForm;
