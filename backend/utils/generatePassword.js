import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";

const generatePassword = expressAsyncHandler(async (pwd) => {
  if (pwd) {
    return await bcrypt.hash(pwd, 11);
  }
  res.status(500);
  throw new Error("Unable to store into Database");
});

export default generatePassword;
