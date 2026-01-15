import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],

    server: {
        port: 7005,
    },

    // Production build optimization
    build: {
        // Use terser for better minification
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true,  // Remove console.logs in production
                drop_debugger: true, // Remove debugger statements
            },
        },

        // Code splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Core React bundle
                    'vendor-react': ['react', 'react-dom'],
                    // Charts library (heavy)
                    'vendor-charts': ['recharts'],
                    // PDF generation
                    'vendor-pdf': ['jspdf'],
                    // AI/Google libraries
                    'vendor-ai': ['@google/generative-ai'],
                    // UI icons
                    'vendor-icons': ['lucide-react'],
                },
            },
        },

        // Increase chunk size warning limit (we have valid large chunks)
        chunkSizeWarningLimit: 600,

        // Generate source maps for debugging (disable in sensitive deployments)
        sourcemap: false,
    },

    // Optimize dependencies
    optimizeDeps: {
        include: ['react', 'react-dom', 'recharts', 'lucide-react'],
    },

    // Environment variable prefix
    envPrefix: 'VITE_',
})
