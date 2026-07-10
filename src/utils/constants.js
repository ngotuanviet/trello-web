let apiRoot = ''
if (process.env.BUILD_MODE === 'dev') {
  apiRoot = 'http://localhost:3000'
}
if (process.env.BUILD_MODE === 'production') {
  apiRoot = import.meta.env.VITE_URL_PRODUC
}
export const API_ROOT = apiRoot

