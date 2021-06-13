import express from "express";
import {
  addMsgToChat,
  getChats,
  addNewChat,
  getChatsOfUsers,
} from "../Controller/chat-controller";

const chatRouter = express.Router();

chatRouter.get("/", getChats);

chatRouter.get("/:username", getChatsOfUsers);

chatRouter.post("/new", addNewChat);

chatRouter.post("/", addMsgToChat);

export default chatRouter;
