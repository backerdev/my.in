import express from "express";

import { protect, authorize } from "../middlewares/authProtectMiddleWare.js";
import {
  createNewStorage,
  deleteStorage,
  getStorages,
  updateStorage,
} from "../controllers/adminController.js";

const routes = express.Router();

routes.get("/", protect, getStorages);
routes.post("/", protect, createNewStorage);
routes.patch("/", protect, updateStorage);
routes.delete("/", protect, deleteStorage);

export default routes;
