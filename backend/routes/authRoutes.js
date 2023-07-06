import express from "express";
import {
  createNewUser,
  logoutUser,
  signIn,
  test,
  updateUser,
} from "../controllers/userControllers.js";
import { protect, authorize } from "../middlewares/authProtectMiddleWare.js";

const routes = express.Router();

routes.post("/", signIn);
routes.patch("/", updateUser);
routes.post("/register", createNewUser);
routes.post("/logout", logoutUser);
routes.get("/", protect, authorize("1011"), test);

export default routes;
