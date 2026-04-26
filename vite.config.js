import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // <-- THÊM DÒNG NÀY ĐỂ KHAI BÁO BIẾN

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
  tailwindcss()
  ],
})
