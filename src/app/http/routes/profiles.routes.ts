import { FastifyInstance } from 'fastify';
import { createProfileController } from '../controllers/profiles/create-profile.controller';
import { getProfileController } from '../controllers/profiles/get-profile.controller';
import { updateProfileController } from '../controllers/profiles/update-profile.controller';

export async function profileRoutes(app: FastifyInstance) {
  app.post('/', createProfileController);
  app.get('/:id', getProfileController);
  app.patch('/:id', updateProfileController);
  // app.delete('/:id', deleteProfileController);
}
