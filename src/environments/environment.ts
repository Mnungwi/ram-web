export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/public',
  // Backend origin without the /api/public suffix — used to build absolute
  // URLs for uploaded media (e.g. /uploads/media/<file>).
  mediaUrl: 'http://localhost:3000',
};
