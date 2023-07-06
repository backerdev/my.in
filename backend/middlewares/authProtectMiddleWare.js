import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protect = expressAsyncHandler(async (req, res, next) => {
  let token;
  console.log("middleware");
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.userId).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  } else {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const authorize = (x) => {
  return (req, res, next) => {
    console.log(req.user);
    if (x === req.user.roles) {
      next();
    } else {
      res.status(401);
      throw new Error("Not Authorised!.");
    }
  };
};

export { protect, authorize };
