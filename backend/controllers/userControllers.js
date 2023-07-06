import asyncHandler from "express-async-handler";
import User from "../models/user.js";
import generatePassword from "../utils/generatePassword.js";
import expressAsyncHandler from "express-async-handler";
import generateToken from "../utils/generateTokens.js";

// @desc    Auth user & get token
// @route   get  /api/users/auth
// @access  Public
export const test = async (req, res) => {
  return res.send(await User.find());
};

// @desc    Auth user & get token
// @route   POST /api/v1/users
// @access  private
const rolesArray = ["1111", "1011", "0101", "0011"];
export const createNewUser = asyncHandler(async (req, res) => {
  const { name, password, confirmPassword, dept, roles } = req.body;
  console.log(req.body);
  if (
    !name ||
    !password ||
    !confirmPassword ||
    !roles ||
    !rolesArray.includes(roles)
  ) {
    res.status(400);
    throw new Error("All Fields are required");
  }
  //    check roles

  // duplicate user
  const existingUser = await User.findOne({ name });
  if (existingUser) {
    res.status(409);
    throw new Error("Please select another user name!.");
  }

  if (password !== confirmPassword) {
    res.status(409);
    throw new Error("Passwords does not match!.");
  }

  // const hashed = generatePassword(password);

  // if (!hashed) {
  //   res.status(500);
  //   throw new Error("Unable to save to Database!.");
  // }

  const newUser = new User({
    name: name,
    password: password,
    roles: roles,
  });
  await newUser.save();
  res.status(201).json({ status: "success", message: "New User created!." });
});

// @desc    Auth user & get token
// @route   POST /api/v1/users/signin
// @access  public
export const signIn = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    res.status(400);
    throw new Error("All fields are required!.");
  }
  console.log("signIn");
  const user = await User.findOne({ name });
  console.log("signIn");
  if (user && (await user.matchPassword(password))) {
    generateToken(res, user._id);
    const userData = {
      _id: user._id,
      name: user.name,
      roles: user.roles,
    };
    // req.user = userData;
    // console.log(req.user);
    res.json({ status: "success", data: userData });
  } else {
    res.status(401);
    throw new Error("No such user!.");
  }
});
export const logoutUser = (req, res) => {
  res.cookie("jwt", "", { httpOnly: true, expires: new Date(0) });

  res.status(200).json({ status: "success", message: "Logout successfully!." });
};
export const updateUser = (req, res) => {
  return res.send("Running");
};
