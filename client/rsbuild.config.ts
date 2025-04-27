import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { TanStackRouterRspack } from '@tanstack/router-plugin/rspack';

export default defineConfig({
  plugins: [pluginReact()],
  server: {
    port: 5173,
  },
  source: {
    tsconfigPath: './tsconfig.json',
  },
  tools: {
    rspack: {
      plugins: [
        TanStackRouterRspack({
          routeToken: 'layout',
          target: 'react',
          autoCodeSplitting: true,
        }),
      ],
    },
  },
  html: {
    title: 'EatZilla',
    favicon: './public/favicon.ico',
  },
});
