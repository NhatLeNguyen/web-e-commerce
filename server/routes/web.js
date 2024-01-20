import express from 'express';
import homeController from '../controllers/homeController';
let router = express.Router();

const initWebRoute = (app) => {
  router.post('/', homeController.getHomePage);

  return app.use('/', router);
};

export default initWebRoute;
