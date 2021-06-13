import express from "express";
import connectionToDB from "./connection-to-db";
import cors from "cors";
import moment from "moment";
import userRouter from "./Routes/users-route";
import chatRouter from "./Routes/chats-route";
import { setUserActiveStatus } from "./Controller/utils";

const app = express();
app.set("port", process.env.PORT);
app.use(express.json());
app.use(cors());

let http = require("http").Server(app);

let io = require("socket.io")(http);

app.use("/api/user", userRouter);
app.use("/api/chats", chatRouter);
app.use("/uploads", express.static(__dirname + "/uploads"));

io.on("connection", (socket: any) => {
  socket.on("setUserActive", (username: any) => {
    console.log("changing active status for : ", username);
    setUserActiveStatus(socket.id, username, true);

    io.emit('doneSettingUpUserActive')
  });
  socket.on("disconnect", () => {
    console.log("disconnecting");
    setUserActiveStatus(socket.id, null, false);
    io.emit('doneSettingUpUserActive')
  });
});

export { http, io };
