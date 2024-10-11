import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: [
			{
				find: 'src',
				replacement: resolve(__dirname, 'src')
			},
			{
				find: 'wailsjs',
				replacement: resolve(__dirname, 'wailsjs')
			}
		]
	},
	server: {
		proxy: {
			'/wails-local': {
				target: 'http://localhost:5173',
				changeOrigin: true,
				configure(proxy, options) {
					proxy.on('start', (req, res) => {
						res.statusCode = 404;
						res.end();
					});
				},
			}
		},
	},
	plugins: [react()]
});
