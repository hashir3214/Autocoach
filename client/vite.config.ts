import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
// FIX: Import 'process' to provide proper types for process.cwd(), resolving a TypeScript error where 'cwd' was not found on the global 'process' type.
import process from 'process';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Vite replaces `process.env.API_KEY` with the value from the environment variable during build.
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
    },
  };
});