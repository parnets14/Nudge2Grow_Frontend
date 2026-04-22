// Helper function to convert image URLs to use the correct backend
export const getImageUrl = (url) => {
  if (!url) return '';
  
  // If it's a base64 data URL, return as is
  if (url.startsWith('data:')) return url;
  
  // For development, use local IP (same as backend)
  const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || 'http://192.168.1.29:5000';
  
  // If it's already a full URL with the correct domain, return as is
  if (url.startsWith(BACKEND_URL)) {
    return url;
  }
  
  // If it's a different IP or localhost, replace with current backend URL
  if (url.includes(':5000')) {
    return url.replace(/http:\/\/[^:]+:5000/, BACKEND_URL);
  }
  
  // If it's just a path starting with /uploads/, prepend the backend URL
  if (url.startsWith('/uploads/')) {
    return `${BACKEND_URL}${url}`;
  }
  
  // If it's just a filename, prepend the full uploads path
  if (!url.startsWith('http')) {
    return `${BACKEND_URL}/uploads/${url}`;
  }
  
  return url;
};
