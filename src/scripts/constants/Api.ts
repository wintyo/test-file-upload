export const API_ROOT = (() => {
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:9000';
  }
  return '';
})();
