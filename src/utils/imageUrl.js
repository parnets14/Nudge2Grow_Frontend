// Helper function to convert image URLs to use the correct backend
const BACKEND_URL = import.meta.env.VITE_API_BASE_URL
  || import.meta.env.VITE_UPLOADS_URL?.replace('/uploads', '')
  || 'https://nudge2grow.com';

export const getImageUrl = (url) => {
  if (!url) return '';

  // If it's a base64 data URL, return as is
  if (url.startsWith('data:')) return url;

  // If it's already a full URL, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) return url;

  // If it's just a path starting with /uploads/, prepend the backend URL
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL}${url}`;
  }

  // If it's just a filename, prepend the full uploads path
  return `${BACKEND_URL}/uploads/${url}`;
};
