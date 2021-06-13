import express from "express";
import {
  login,
  signup,
  isAuthorize,
  otpAuth,
  getAll,
  getByUsername,
  getUserByToken,
} from "../Controller/users-controller";
import { uploadPhotos } from "../Controller/utils";
const userRouter = express.Router();

userRouter.post("/signup", uploadPhotos, signup);

userRouter.get("/", getAll);

userRouter.get("/token", getUserByToken);

userRouter.get("/:username", getByUsername);

userRouter.post("/login", login);

// userRouter.post("/resend/otp")

userRouter.post("/verify/otp", otpAuth);

export default userRouter;
