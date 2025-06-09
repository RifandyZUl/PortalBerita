import { useState } from 'react';

const ProfileCard = () => {
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  return (
    <div className="border rounded-lg p-6 flex flex-col items-center">
      <div className="w-32 h-32 bg-gray-200 rounded-full mb-4 overflow-hidden">
        {image ? (
          <img
            src={image}
            alt="Profile Preview"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>
      <h3 className="text-lg font-semibold">Denis</h3>
      <p className="text-gray-500 mb-4">Administrator</p>
      <label className="bg-blue-600 text-white px-4 py-2 rounded w-full mb-2 hover:bg-blue-700 transition cursor-pointer text-center">
        Upload New Picture
        <input type="file" className="hidden" onChange={handleImageChange} />
      </label>
    </div>
  );
};

export default ProfileCard;
