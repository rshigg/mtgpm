import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['index.ts'],
  format: ['esm'],
  dts: true,
  tsconfig: 'tsconfig.json',
  external: ['react', 'react-dom'],
});
