import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// import path from 'path';
// import fs from 'fs';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 7778,
    // https: {
    //   key: fs.readFileSync(path.resolve('./gowork-ssl/gowork.key')),
    //   cert: fs.readFileSync(path.resolve('./gowork-ssl/gowork.crt'))
    // }
  },
  define: {
    global: 'window'
  }
});
