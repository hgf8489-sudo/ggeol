export const config = {
  port: parseInt(process.env.PORT ?? '4000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  frontendUrl: process.env.FRONTEND_URL ?? 'http://localhost:5173',
  cacheTtl: parseInt(process.env.CACHE_TTL ?? '300', 10),
  coingeckoApiKey: process.env.COINGECKO_API_KEY ?? '',
};
