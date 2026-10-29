try {
  process.loadEnvFile('.env');
} catch {
  console.warn('[proxy] .env not found, REST Countries requests will fail without REST_COUNTRIES_API_KEY');
}

const apiKey = process.env.REST_COUNTRIES_API_KEY ?? '';

export default {
  '/api': {
    target: 'https://api.restcountries.com',
    changeOrigin: true,
    secure: true,
    rewrite: (path) => path.replace(/^\/api/, ''),
    configure: (proxy) => {
      proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('origin');
        proxyReq.setHeader('Authorization', `Bearer ${apiKey}`);
      });
    },
  },
};
