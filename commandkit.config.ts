import { devtools } from '@commandkit/devtools';
import { defineConfig } from 'commandkit';

export default defineConfig({
  plugins: [devtools()],
});