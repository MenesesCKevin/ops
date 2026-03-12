import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:5224',
          changeOrigin: true,
          secure: false
        }
      }
    },
    build: {
      outDir: isProduction ? '../KYC_OPS.Api/wwwroot' : 'dist',
      emptyOutDir: true,
      sourcemap: true,
      assetsDir: 'assets',
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          entryFileNames: 'assets/[name]-[hash].js',
          chunkFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]',
          manualChunks: (id) => {
            if (id.includes('node_modules/react') || id.includes('node_modules/react-dom') || id.includes('node_modules/react-router')) return 'vendor-react';
            if (id.includes('node_modules/react-icons') || id.includes('node_modules/react-hot-toast')) return 'vendor-ui';
            if (id.includes('node_modules/tailwindcss') || id.includes('node_modules/@tailwindcss')) return 'vendor-tailwind';
            if (id.includes('node_modules')) return 'vendor-general';
          }
        }
      }
    },
    define: {
      'import.meta.env.VITE_API_URL': JSON.stringify('/api'),
      'import.meta.env.VITE_SSO_ENABLED': JSON.stringify(isProduction ? 'true' : 'false'),
      'import.meta.env.VITE_DEFAULT_USER_ID': JSON.stringify(isProduction ? null : '45895623'),
      'import.meta.env.VITE_SSO_SCRIPT_URL': JSON.stringify(isProduction ? 'https://ssupdate.global.hsbc/myhsbc/uservariables.ashx' : null)
    }
  };
});
