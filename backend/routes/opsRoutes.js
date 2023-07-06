import express from "express";

import { protect, authorize } from "../middlewares/authProtectMiddleWare.js";
import {
  createPO,
  getStorageforPO,
  updatePO,
} from "../controllers/purchaserController.js";
import { batchChemical, getSrvi } from "../controllers/batchingController.js";

const routes = express.Router();

routes.get("/batch", getSrvi);
routes.patch("/batch", protect, batchChemical);

routes.get("/", protect, getStorageforPO);
routes.post("/", protect, createPO);
routes.patch("/", protect, updatePO);

export default routes;
