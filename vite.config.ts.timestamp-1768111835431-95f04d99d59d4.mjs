// vite.config.ts
import { defineConfig } from "file:///C:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/USER/OneDrive/Desktop/MASTER%20NGN%20GENERATOR-20251218T130148Z-3-001/MASTER%20NGN%20GENERATOR/node_modules/@vitejs/plugin-react/dist/index.js";
var vite_config_default = defineConfig({
  plugins: [react()],
  server: {
    port: 7005
  },
  // Production build optimization
  build: {
    // Use terser for better minification
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true,
        // Remove console.logs in production
        drop_debugger: true
        // Remove debugger statements
      }
    },
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React bundle
          "vendor-react": ["react", "react-dom"],
          // Charts library (heavy)
          "vendor-charts": ["recharts"],
          // PDF generation
          "vendor-pdf": ["jspdf"],
          // AI/Google libraries
          "vendor-ai": ["@google/generative-ai"],
          // UI icons
          "vendor-icons": ["lucide-react"]
        }
      }
    },
    // Increase chunk size warning limit (we have valid large chunks)
    chunkSizeWarningLimit: 600,
    // Generate source maps for debugging (disable in sensitive deployments)
    sourcemap: false
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "recharts", "lucide-react"]
  },
  // Environment variable prefix
  envPrefix: "VITE_"
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxVU0VSXFxcXE9uZURyaXZlXFxcXERlc2t0b3BcXFxcTUFTVEVSIE5HTiBHRU5FUkFUT1ItMjAyNTEyMThUMTMwMTQ4Wi0zLTAwMVxcXFxNQVNURVIgTkdOIEdFTkVSQVRPUlwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcVVNFUlxcXFxPbmVEcml2ZVxcXFxEZXNrdG9wXFxcXE1BU1RFUiBOR04gR0VORVJBVE9SLTIwMjUxMjE4VDEzMDE0OFotMy0wMDFcXFxcTUFTVEVSIE5HTiBHRU5FUkFUT1JcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL1VTRVIvT25lRHJpdmUvRGVza3RvcC9NQVNURVIlMjBOR04lMjBHRU5FUkFUT1ItMjAyNTEyMThUMTMwMTQ4Wi0zLTAwMS9NQVNURVIlMjBOR04lMjBHRU5FUkFUT1Ivdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xyXG5pbXBvcnQgcmVhY3QgZnJvbSAnQHZpdGVqcy9wbHVnaW4tcmVhY3QnXHJcblxyXG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xyXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG5cclxuICAgIHNlcnZlcjoge1xyXG4gICAgICAgIHBvcnQ6IDcwMDUsXHJcbiAgICB9LFxyXG5cclxuICAgIC8vIFByb2R1Y3Rpb24gYnVpbGQgb3B0aW1pemF0aW9uXHJcbiAgICBidWlsZDoge1xyXG4gICAgICAgIC8vIFVzZSB0ZXJzZXIgZm9yIGJldHRlciBtaW5pZmljYXRpb25cclxuICAgICAgICBtaW5pZnk6ICd0ZXJzZXInLFxyXG4gICAgICAgIHRlcnNlck9wdGlvbnM6IHtcclxuICAgICAgICAgICAgY29tcHJlc3M6IHtcclxuICAgICAgICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgIC8vIFJlbW92ZSBjb25zb2xlLmxvZ3MgaW4gcHJvZHVjdGlvblxyXG4gICAgICAgICAgICAgICAgZHJvcF9kZWJ1Z2dlcjogdHJ1ZSwgLy8gUmVtb3ZlIGRlYnVnZ2VyIHN0YXRlbWVudHNcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICAvLyBDb2RlIHNwbGl0dGluZyBmb3IgYmV0dGVyIGNhY2hpbmdcclxuICAgICAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgICAgICAgIG91dHB1dDoge1xyXG4gICAgICAgICAgICAgICAgbWFudWFsQ2h1bmtzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ29yZSBSZWFjdCBidW5kbGVcclxuICAgICAgICAgICAgICAgICAgICAndmVuZG9yLXJlYWN0JzogWydyZWFjdCcsICdyZWFjdC1kb20nXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBDaGFydHMgbGlicmFyeSAoaGVhdnkpXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci1jaGFydHMnOiBbJ3JlY2hhcnRzJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gUERGIGdlbmVyYXRpb25cclxuICAgICAgICAgICAgICAgICAgICAndmVuZG9yLXBkZic6IFsnanNwZGYnXSxcclxuICAgICAgICAgICAgICAgICAgICAvLyBBSS9Hb29nbGUgbGlicmFyaWVzXHJcbiAgICAgICAgICAgICAgICAgICAgJ3ZlbmRvci1haSc6IFsnQGdvb2dsZS9nZW5lcmF0aXZlLWFpJ10sXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gVUkgaWNvbnNcclxuICAgICAgICAgICAgICAgICAgICAndmVuZG9yLWljb25zJzogWydsdWNpZGUtcmVhY3QnXSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgLy8gSW5jcmVhc2UgY2h1bmsgc2l6ZSB3YXJuaW5nIGxpbWl0ICh3ZSBoYXZlIHZhbGlkIGxhcmdlIGNodW5rcylcclxuICAgICAgICBjaHVua1NpemVXYXJuaW5nTGltaXQ6IDYwMCxcclxuXHJcbiAgICAgICAgLy8gR2VuZXJhdGUgc291cmNlIG1hcHMgZm9yIGRlYnVnZ2luZyAoZGlzYWJsZSBpbiBzZW5zaXRpdmUgZGVwbG95bWVudHMpXHJcbiAgICAgICAgc291cmNlbWFwOiBmYWxzZSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXHJcbiAgICBvcHRpbWl6ZURlcHM6IHtcclxuICAgICAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWNoYXJ0cycsICdsdWNpZGUtcmVhY3QnXSxcclxuICAgIH0sXHJcblxyXG4gICAgLy8gRW52aXJvbm1lbnQgdmFyaWFibGUgcHJlZml4XHJcbiAgICBlbnZQcmVmaXg6ICdWSVRFXycsXHJcbn0pXHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBcWUsU0FBUyxvQkFBb0I7QUFDbGdCLE9BQU8sV0FBVztBQUdsQixJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUN4QixTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsRUFFakIsUUFBUTtBQUFBLElBQ0osTUFBTTtBQUFBLEVBQ1Y7QUFBQTtBQUFBLEVBR0EsT0FBTztBQUFBO0FBQUEsSUFFSCxRQUFRO0FBQUEsSUFDUixlQUFlO0FBQUEsTUFDWCxVQUFVO0FBQUEsUUFDTixjQUFjO0FBQUE7QUFBQSxRQUNkLGVBQWU7QUFBQTtBQUFBLE1BQ25CO0FBQUEsSUFDSjtBQUFBO0FBQUEsSUFHQSxlQUFlO0FBQUEsTUFDWCxRQUFRO0FBQUEsUUFDSixjQUFjO0FBQUE7QUFBQSxVQUVWLGdCQUFnQixDQUFDLFNBQVMsV0FBVztBQUFBO0FBQUEsVUFFckMsaUJBQWlCLENBQUMsVUFBVTtBQUFBO0FBQUEsVUFFNUIsY0FBYyxDQUFDLE9BQU87QUFBQTtBQUFBLFVBRXRCLGFBQWEsQ0FBQyx1QkFBdUI7QUFBQTtBQUFBLFVBRXJDLGdCQUFnQixDQUFDLGNBQWM7QUFBQSxRQUNuQztBQUFBLE1BQ0o7QUFBQSxJQUNKO0FBQUE7QUFBQSxJQUdBLHVCQUF1QjtBQUFBO0FBQUEsSUFHdkIsV0FBVztBQUFBLEVBQ2Y7QUFBQTtBQUFBLEVBR0EsY0FBYztBQUFBLElBQ1YsU0FBUyxDQUFDLFNBQVMsYUFBYSxZQUFZLGNBQWM7QUFBQSxFQUM5RDtBQUFBO0FBQUEsRUFHQSxXQUFXO0FBQ2YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
