import { ChatModel } from "../Model/chatModel";
import { MessageModel } from "../Model/messageModel";
import User from "../Model/users-schema";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { io } from "../sockets";
dotenv.config();

const getChats = async (req: any, res: any) => {
  let token = req.headers.authorization.split(" ")[1];

  let user: any = jwt.verify(token, process.env.SECRET_KEY!);

  let foundUser: any = await User.findOne({ username: user.username });

  // @ts-ignore
  let chats = await ChatModel.find({ users: foundUser._id }).populate(
    "users",
    "username profileImage firstName lastName active lastSeen"
  );
  let result: any = [];
  chats.forEach((chat: any) => {
    chat.users.forEach((user: any) => {
      if (user.username !== foundUser.username) {
        result.push(user);
      }
    });
  });

  res.send(result);
};

const getChatsOfUsers = async (req: any, res: any) => {
  // console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
  // console.log(req.params);
  try {
    let otherUser = req.params.username;

    let token = req.headers.authorization.split(" ")[1];
    let user: any = jwt.verify(token, process.env.SECRET_KEY!);

    let user1 = await User.findOne({ username: otherUser });

    // console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
    // console.log(user, user1);

    let chats = await ChatModel.findOne({
      // @ts-ignore
      users: { $all: [user1._id, user.id] },
    })
      .populate("messages")
      .select("messages");

    //   chats = chats.map((chat:any)=>chat.messages)
    // console.log(chats);
    //@ts-ignore
    res.send(chats.messages);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const addNewChat = async (req: any, res: any) => {
  try {
    let token = req.headers.authorization.split(" ")[1];
    let user: any = jwt.verify(token, process.env.SECRET_KEY!);

    let user1: any = await User.findOne({ username: req.body.userId });
    let user2: any = await User.findOne({ username: user.username });
    // console.log(user1, user2);
    let chat = await ChatModel.findOne({
      users: { $all: [user1._id, user2._id] },
    });
    if (chat) {
      res.status();
      return;
    }
    let newChat = await ChatModel.create({
      users: [user1!._id, user2!._id],
    });

    res.status(201).send();
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const addMsgToChat = async (req: any, res: any) => {
  try {
    let { users, msg } = req.body;
    let token = req.headers.authorization.split(" ")[1];
    let user1: any = await jwt.verify(token, process.env.SECRET_KEY!);
    let user2: any = await User.findOne({ username: users });
    // console.log(user1, user2);
    let msgResponse = await MessageModel.create({
      content: msg,
      sentBy: user1.username,
    });

    let doc = await ChatModel.findOneAndUpdate(
      { users: { $all: [user1.id, user2._id] } },
      { $push: { messages: msgResponse._id } },
      { new: true, upsert: true }
    );
    io.emit("message-sent", msg);
    res.status(201).send(doc);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

export { getChats, addMsgToChat, addNewChat, getChatsOfUsers };
