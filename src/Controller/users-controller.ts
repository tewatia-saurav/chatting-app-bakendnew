import jwt from "jsonwebtoken";
import User from "../Model/users-schema";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import path from "path";
import fs from "fs";
import { sendOtpToPhone, sendOtpToMail, POSTS_PATH } from "./utils";
dotenv.config();

const getAll = async (req: any, res: any) => {
  try {
    const users = await User.find({}).select("username");
    res.send(users);
    // @ts-ignore
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getByUsername = async (req: any, res: any) => {
  try {
    let value = new RegExp(req.params.userName);
    const users = await User.find({
      username: { $regex: value, $options: "i" },
    }).select("username");
    res.json({ users });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const signup = async (req: any, res: any) => {
  // console.log("here");
  try {
    const { profileImage, username } = req.body;
    // console.log(req.file)
    const newUser = await User.create({
      ...req.body,
      profileImage: POSTS_PATH + "/" + req.file.filename,
    });

    // res.json({ users: newUser });
    res.status(200).json({
      status: "SuccessFul",
    });
    // @ts-ignore
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const login = async (req: any, res: any, next: any) => {
  try {
    const { userId, password } = req.body;

    if (!userId || !password) {
      // @ts-ignore
      res.status(400).json({
        status: "The fields are empty please enter the data",
      });
      return;
    }
    const user: any = await User.findOne({
      $or: [{ email: userId }, { phoneNumber: userId }, { username: userId }],
    });
    // @ts-ignore
    if (!user || !(await user.correctPassword(password, user.password))) {
      res.send(400).json({
        message: "UnSuccessFul",
      });
    } else {
      const otp = Math.floor(Math.random() * 899999 + 100000);
      // console.log("SEnding otp");
      sendOtpToPhone(user.phoneNumber, otp);
      sendOtpToMail(user.email, otp);

      let hashedOtp = await bcrypt.hash(String(otp), 10);

      // //@ts-ignore
      let token = await jwt.sign(
        { username: user.username, id: user._id, otp: hashedOtp },
        process.env.SECRET_KEY!,
        { expiresIn: "5m" }
      );

      let secretPhone =
        user.phoneNumber.slice(3, 5) + "******" + user.phoneNumber.slice(11);
      let secretEmail =
        user.email.slice(0, 4) +
        "**********" +
        user.email.slice(user.email.length - 10);
      res.json({
        status: true,
        message: `Otp sent to ${secretEmail} & ${secretPhone}`,
        token: token,
      });
    }
  } catch (err) {
    res.json({
      status: "fail",
      message: err.message,
    });
  }
};

const isAuthorize = async (req: any, res: any, next: any) => {
  try {
    if (req.headers && req.headers.authorization) {
      const token = req.headers.authorization.split(" ")[1];

      const decode = jwt.verify(token, process.env.SECRET_KEY!);

      // @ts-ignore
      const requestUser = await User.findOne(decode.username);

      try {
        if (!requestUser) {
          return res.json({ success: false, message: "Unauthorized Access" });
        } else {
          req.user = requestUser;
          next();
        }
      } catch (err) {
        if (err.name === "JsonWebTokenError") {
          return res.json({ success: false, message: "Unauthorized Access" });
        }
        if (err.name === "TokenExpiredError") {
          return res.json({
            success: false,
            message: "Session Expire please try sign again",
          });
        }
      }
    }
  } catch (err) {
    res.status(400).json({
      message: "Error in Authorization",
    });
  }
};

const otpAuth = async (req: any, res: any) => {
  if (!req.headers && !req.headers.authorization) {
    res.json({
      status: false,
      message: "Headers are not given",
    });
    return;
  }

  try {
    const token = req.headers.authorization.split(" ")[1];

    const decode: any = jwt.verify(token, process.env.SECRET_KEY!);
    const { otp } = req.body;

    let user: any = await User.findOne({ _id: decode.id });

    // @ts-ignore
    if (await bcrypt.compare(otp, decode.otp)) {
      let token = await jwt.sign(
        { username: user.username, id: user._id },
        process.env.SECRET_KEY!,
        { expiresIn: "24h" }
      );
      res.json({
        status: true,
        message: "Successful Access",
        token: token,
      });
    } else {
      res.json({ status: false, message: "Unsuccessful" });
    }
  } catch (err) {
    console.log(err);
    res.status(400).send("Bad Request");
  }
};

const getUserByToken = async (req: any, res: any) => {
  try {
    if (!req.headers && !req.headers.authorization) {
      res.json({
        status: false,
        message: "Headers are not given",
      });
      return;
    }

    const token = req.headers.authorization.split(" ")[1];

    const decode: any = jwt.verify(token, process.env.SECRET_KEY!);

    let user: any = await User.findOne({ _id: decode.id });

    // console.log(user);

    res.send({
      firstName: user.firstName,
      lastName: user.lastName,
      bioData: user.bioData,
      phoneNumber: user.phoneNumber,
      username: user.username,
      profileImage: user.profileImage,
    });
  } catch (err) {
    // console.log(err);
    res.send(err);
  }

};



export {
  login,
  signup,
  isAuthorize,
  getUserByToken,
  otpAuth,
  getAll,
  getByUsername,
};
