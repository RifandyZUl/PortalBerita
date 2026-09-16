/**
 * News Image Component
 * 
 * Reusable image component dengan fallback handling.
 * 
 * @module components/NewsImage
 */

/**
 * News Image Component
 * 
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Image alt text
 * @param {string} props.className - Additional CSS classes
 * @param {string} props.fallback - Fallback image path (default: '/image/fallback.jpg')
 */
const NewsImage = ({ 
  src, 
  alt = '', 
  className = '', 
  fallback = '/image/fallback.jpg' 
}) => {
  const handleError = (e) => {
    if (e.target.src !== fallback) {
      e.target.onerror = null;
      e.target.src = fallback;
    }
  };

  return (
    <img
      src={src || fallback}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default NewsImage;

