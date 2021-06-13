"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var chat_controller_1 = require("../Controller/chat-controller");
var chatRouter = express_1.default.Router();
chatRouter.get("/", chat_controller_1.getChats);
chatRouter.get("/:username", chat_controller_1.getChatsOfUsers);
chatRouter.post("/new", chat_controller_1.addNewChat);
chatRouter.post("/", chat_controller_1.addMsgToChat);
exports.default = chatRouter;
