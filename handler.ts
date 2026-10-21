import { Hono } from 'hono';
import { handle } from '@hono/node-server/vercel';
import { cors } from 'hono/cors';
import hiAnimeRoutes from './src/routes/routes';
import { AppError } from './src/utils/errors';
import { fail } from './src/utils/response';

const app = new Hono();

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'OPTIONS'] }));

app.get('/ping', (c) =>
  c.json({ status: 'ok', timestamp: new Date().toISOString(), environment: 'vercel' })
);

app.route('/api/v2', hiAnimeRoutes);

app.onError((err, c) => {
  if (err instanceof AppError) {
    return fail(c, err.message, err.statusCode, err.details);
  }
  console.error('Unexpected error:', err.message);
  return fail(c, 'Internal server error', 500);
});

app.notFound((c) => fail(c, 'Route not found', 404));

export default handle(app);
