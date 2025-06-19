import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProfileCard = ({ admin, onPhotoSelect }) => {
  const [previewImage, setPreviewImage] = useState(null);

  // Set preview dari photo URL admin jika tersedia
  useEffect(() => {
    if (admin?.photo) {
      setPreviewImage(admin.photo);
    }
  }, [admin]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      onPhotoSelect(file); // kirim file ke parent
    }
  };

  return (
    <div className="border rounded-lg p-6 flex flex-col items-center bg-white shadow-sm">
      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden">
        {previewImage ? (
          <img
            src={previewImage}
            alt="Profile"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      <h3 className="text-lg font-semibold">{admin?.firstName || 'Admin'}</h3>
      <p className="text-gray-500 mb-4">{admin?.bio || 'No bio provided.'}</p>

      <label className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-700 transition cursor-pointer text-center">
        Upload New Picture
        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
      </label>
    </div>
  );
};

ProfileCard.propTypes = {
  admin: PropTypes.object.isRequired,
  onPhotoSelect: PropTypes.func.isRequired
};

export default ProfileCard;
