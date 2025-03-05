import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const developmentEnvironmentVariables = [
  'DEFENDER_POOL_ID',
  'DEFENDER_POOL_CLIENT_ID',
  'DEFENDER_API_URL',
];

export default defineConfig(({ mode }) => {
	const defineVars: Record<string, string> = {};

  if (mode === "development") {
    developmentEnvironmentVariables.forEach(env => {
      defineVars[`process.env.${env}`] = JSON.stringify(process.env[env]);
    });
  }
  return {
    plugins: [sveltekit()],
    define: mode === "development" ? defineVars : undefined,
  };
});
