import 'dotenv/config';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const developmentAllowedEnvironmentVariables = [
  'DEFENDER_POOL_ID',
  'DEFENDER_POOL_CLIENT_ID',
  'DEFENDER_API_URL',
];

export default defineConfig(({ mode }) => ({
	plugins: [sveltekit()],
	define: mode === "development" ? developmentAllowedEnvironmentVariables.reduce((definedEnvironmentVariables, allowedEnvironmentVariable) => ({
		...definedEnvironmentVariables, 
		[`process.env.${allowedEnvironmentVariable}`]:JSON.stringify( process.env[allowedEnvironmentVariable]) 
	}), {}) : undefined,
}));
