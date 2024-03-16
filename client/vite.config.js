import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://localhost:3000', // Updated to port 3000
        secure: false, // Depending on your SSL configuration, you might need to set this to true
        ws: true,
        https: true,
      },
    },
  },

  plugins: [react()],
});



