import { authJwt, checkDuplicateUsernameOrEmail, checkRolesExisted } from '../middlewares/index.js';
import * as controller from '../controllers/auth.controller.js';

export const setupAuthRoutes = (app) => {
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Headers', 'x-access-token, Origin, Content-Type, Accept');
    next();
  });

  app.post('/api/auth/signup', [checkDuplicateUsernameOrEmail, checkRolesExisted], controller.signup);
  app.post('/api/auth/signin', controller.signin);
};