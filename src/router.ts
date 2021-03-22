import express, { Router } from "express";
import UserController from "./controllers/User";
import authMiddleware from "./middlewares/auth";

const routes = Router();

routes.route("/auth").post(UserController.authenticate);
routes.route("/users").post(UserController.store);

routes.use(authMiddleware);

routes.route("/users").get(UserController.index);
routes
  .route("/users/:id")
  .get(UserController.show)
  .put(UserController.update)
  .delete(UserController.destroy);

export default routes;
