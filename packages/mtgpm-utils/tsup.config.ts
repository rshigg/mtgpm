import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/*.ts'],
  format: ['esm'],
  dts: true,
  tsconfig: 'tsconfig.json',
});
