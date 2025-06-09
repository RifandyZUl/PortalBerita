import { useForm } from 'react-hook-form';

const ProfileForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: {
      firstName: 'Denis',
      lastName: '',
      email: 'denis@example.com',
      username: 'admin123',
      bio: 'Administrator akun portal berita.'
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await response.json();
      console.log('Success:', result);
    } catch (error) {
      console.error('Error:', error);
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
            <p className="text-red-500 text-sm mt-1">
              {errors.firstName.message}
            </p>
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
      {errors.email && (
        <p className="text-red-500 text-sm">{errors.email.message}</p>
      )}

      <input
        type="text"
        placeholder="Username"
        {...register('username', { required: 'Username is required' })}
        className="border px-3 py-2 w-full"
      />
      {errors.username && (
        <p className="text-red-500 text-sm">{errors.username.message}</p>
      )}

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

export default ProfileForm;
