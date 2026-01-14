import './bootstrap';
import { buildApp } from './http/fastify-app';

async function main() {
  const app = buildApp();

  await app.listen({
    port: 3000,
    host: '0.0.0.0',
  });
}

main();
