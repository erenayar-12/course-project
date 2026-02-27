import { defineConfig } from '@prisma/cli';

export default defineConfig({
  adapter: {
    provider: 'postgresql',
    url: process.env.DATABASE_URL,
  },
});
