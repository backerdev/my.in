import express from "express";

import {
  deletePO,
  getAllQcPo,
  updateGrnPo,
} from "../controllers/qcController.js";
import { protect } from "../middlewares/authProtectMiddleWare.js";

const routes = express.Router();

routes.get("/", protect, getAllQcPo);
routes.patch("/", protect, updateGrnPo);
routes.delete("/", protect, deletePO);

export default routes;
