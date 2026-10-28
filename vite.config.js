import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // If you are deploying to GitHub Pages under a subpath (e.g., repository name), 
  // change base to '/your-repo-name/'. If using Vercel or Netlify, keep it as '/'
  base: '/birthday-surprise/',
  build: {
    chunkSizeWarningLimit: 700,
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
})