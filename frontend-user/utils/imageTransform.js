// utils/imageTransform.js
export const getResizedImage = (url, width = 640, height = 360) => {
  if (!url) return '';
  return url.replace('/upload/', `/upload/c_fill,h_${height},w_${width}/`);
};
