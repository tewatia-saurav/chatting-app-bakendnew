import bcrypt from "bcryptjs";
let { Auth } = require("two-step-auth");
import OTP from "../Model/otpSchema";
import User from "../Model/users-schema";
import twilio, { Twilio } from "twilio";
const util = require("./utils");

const verifyEmail = async (req: any, res: any, next: any) => {
  if (req.body.userId.indexOf("@gmail.com") < 0) {
    next();
  }
  const email = req.body.userId;

  let user: any = await OTP.findOne({ user: req.user._id });

  if (user) {
    const val = await OTP.findByIdAndDelete(user);
  }

  try {
    const response = await Auth(req.user.email, "Chatting App");
    if (response.status === 200) {
      let hashedOtp = await bcrypt.hash(String(response.OTP), 10);
      await OTP.create({
        otp: hashedOtp,
        user: req.user._id,
      });

      next();

      // res.status(200).json({ status: true, message: `Login SuccessFul Otp has been sent to ${email}`});
      // res.json({
      //   // users: newOtp,
      //   //   otp:otp1
      // });
    }
  } catch (err) {
    res.status(404).json({ status: false, message: err.message });
  }
};

const verifyPhone = async (req: any, res: any, next: any) => {
  const phone = req.body.userId;

  let user: any = await OTP.findOne({ user: req.user._id });
  if (user) {
    await OTP.deleteOne(user);
  }
  try {
    const client = new Twilio(
      process.env.TWILIO_AUTH_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    const otp = Math.floor(Math.random() * 899999 + 100000);

    await client.messages.create({
      body: `Your otp for Chatting App is : ${otp}`,
      to: phone,
      from: process.env.TWILIO_NUMBER,
    });

    let hashedOtp = await bcrypt.hash(String(otp), 10);

    await OTP.create({
      user: req.user._id,
      otp: hashedOtp,
    });

    next();
  } catch (err) {
    res.send(err);
  }
};

export { verifyEmail, verifyPhone };
