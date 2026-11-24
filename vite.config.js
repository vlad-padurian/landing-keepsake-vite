import vituum from 'vituum';
import pug from '@vituum/vite-plugin-pug';
import path from 'path';
import fs from 'node:fs';

const renameHtml = () => ({
  name: 'rename-pug-html',
  apply: 'build',
  closeBundle() {
    const from = path.resolve(import.meta.dirname, 'dist/index.pug.html');
    const to = path.resolve(import.meta.dirname, 'dist/index.html');
    if (fs.existsSync(from)) fs.renameSync(from, to);
  },
});

export default {
  base: '/landing-keepsake-vite/',
  plugins: [
    vituum({
      imports: {
        filenamePattern: {
          '+.css': [],
          '+.scss': [],
        },
      },
    }),
    pug({ root: './src' }),
    renameHtml(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, 'src'),
      '@assets': path.resolve(import.meta.dirname, 'src/assets'),
    },
  },
  build: {
    assetsInlineLimit: 0,
  },
};
