import { onRequest } from '../functions/api/signup.js';

export default {
  async fetch(request, env) {
    const { pathname } = new URL(request.url);
    if (pathname === '/api/signup' || pathname === '/api/signup/') {
      return onRequest({ request, env });
    }
    if (pathname === '/api' || pathname.startsWith('/api/')) {
      return new Response('Not found', { status: 404, headers: { 'Cache-Control': 'no-store' } });
    }
    return env.ASSETS.fetch(request);
  }
};
