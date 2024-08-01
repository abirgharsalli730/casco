import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react' ;
import copy from "rollup-plugin-copy";
// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ['**/*.xml','**/*.xlsx'],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        secure: false,
      },
    },
  },
  plugins: [ copy({
    targets: [
      {
        src: "node_modules/pspdfkit/dist/pspdfkit-lib",
        dest: "public/",
      },
    ],
    hook: "buildStart",
  }),react()],
});