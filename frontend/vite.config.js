import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
export default defineConfig({
  plugins: [react()],
  server: { port: 5173, proxy: { '/api': { target: 'http://localhost:3001', changeOrigin: true } } },
  test: {
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/**/*.test.jsx', 'src/**/*.test.js'],
    coverage: {
      provider: 'v8', reporter: ['text', 'lcov', 'json-summary'],
      include: ['src/utils.js', 'src/ProductForm.jsx', 'src/ProductTable.jsx'],
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 },
    },
  },
});
