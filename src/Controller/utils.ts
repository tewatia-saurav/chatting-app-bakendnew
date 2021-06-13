import nodemailer from "nodemailer";
import { google } from "googleapis";
import twilio, { Twilio } from "twilio";
import dotenv from "dotenv";
import multer from "multer";
import path from "path";
import User from "../Model/users-schema";
import moment from "moment";
dotenv.config();

export const POSTS_PATH = path.join("uploads/profileImages"); //1

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname , "../" , POSTS_PATH));
  },
  filename: function (req, file, cb) {
    const extention = file.mimetype.split("/")[1];
    // console.log("Extension", extention);
    cb(null, Date.now() + `.${extention}`);
  },
});

const upload = multer({
  storage: storage,
});

export const uploadPhotos = upload.single("profileImage");

export const sendOtpToMail = async (email: string, otp: number) => {
  try {
    const oAuth2Client = new google.auth.OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      process.env.REDIRECT_URI
    );
    oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
    const accessToken = await oAuth2Client.getAccessToken();

    const transport: any = nodemailer.createTransport({
      // @ts-ignore
      service: "gmail",
      auth: {
        type: "OAUTH2",
        user: "team.heros.mindtree@gmail.com",
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });
    const mailOption = {
      from: '"Team Heros" <team.heros.mindtree@gmail.com',
      to: email,
      subject: "Email Verification Otp",
      html: `<p>Otp to login in <b>Chatting App</b> is <b>${otp}</b>. Please DO NOT share it with anyone.</p>`,
    };

    let result = await transport.sendMail(mailOption);

    // console.log(`Otp sent to email : ${email}`);
  } catch (err) {
    console.log(err);
  }
};

export const sendOtpToPhone = async (phone: string, otp: number) => {
  try {
    const client = new Twilio(
      process.env.TWILIO_AUTH_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      body: `Otp to login in Chatting App is ${otp}. Please DO NOT share it with anyone.`,
      to: phone,
      from: process.env.TWILIO_NUMBER,
    });

    // console.log(`Otp has been sent to phone : ${phone}`);
  } catch (err) {
    console.log(err);
  }
};

export const setUserActiveStatus = async (
  connectionId: any,
  username: any,
  active: boolean
) => {
  if (username) {
    let res = await User.findOneAndUpdate(
      { username },
      { connectionId, active, lastSeen: "" }
    ); 

  } else {
    let res = await User.findOneAndUpdate(
      { connectionId },
      {
        connectionId,
        active,
        lastSeen: moment().format("dddd, MMMM Do, h:mm a"),
      }
    );
  }
};
