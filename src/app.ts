import express from "express";
import cors from "cors";
import connectionToDB from "./connection-to-db";
import userRouter from "./Routes/users-route";
import chatRouter from "./Routes/chats-route";
import dotenv from "dotenv";
import {http} from './sockets'
dotenv.config();

// const app = express();
// app.set("port", process.env.PORT);
// app.use(express.json());
// app.use(cors());

// let http = require("http").Server(app);

// let io = require("socket.io")(http);

connectionToDB()
  .then(() => {
    console.log("Connected to database");
    http.listen(process.env.PORT, () => {
      console.log(`Server Running at http://localhost:${process.env.PORT}`);
    });
  })
  .catch((err: any) => {
    console.log(err.message);
  });

// app.use("/api/user", userRouter);
// app.use("/api/chats", chatRouter);
// app.use("/uploads", express.static(__dirname + "/uploads"));

// io.on("connection", (data: any) => {
//   console.log("connected");
// });

// export default io;
