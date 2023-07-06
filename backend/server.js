import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();

// imports
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import opsRoutes from "./routes/opsRoutes.js";
import qcRoutes from "./routes/qcRoutes.js";
import { errorHandler, notFound } from "./middlewares/errorMiddlewares.js";

// middlewares

const port = process.env.PORT || 5000;

const app = express();
connectDB();
app.use(cookieParser());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/users", authRoutes);
app.use("/api/v1/ops", opsRoutes);
app.use("/api/v1/qc", qcRoutes);
app.use("/api/v1/admin", adminRoutes);

if (process.env.NODE_ENV === "production") {
  // console.log(process.env.NODE_ENV);
  const __dirname = path.resolve();

  // console.log(path.join(__dirname, "/frontend/dist"));
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"))
  );
} else {
  app.get("/", (req, res) => {
    res.send("API is running....");
  });
}

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log("app running on port "));
