"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getChatsOfUsers = exports.addNewChat = exports.addMsgToChat = exports.getChats = void 0;
var chatModel_1 = require("../Model/chatModel");
var messageModel_1 = require("../Model/messageModel");
var users_schema_1 = __importDefault(require("../Model/users-schema"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var dotenv_1 = __importDefault(require("dotenv"));
var sockets_1 = require("../sockets");
dotenv_1.default.config();
var getChats = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, foundUser, chats, result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.headers.authorization.split(" ")[1];
                user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                return [4 /*yield*/, users_schema_1.default.findOne({ username: user.username })];
            case 1:
                foundUser = _a.sent();
                return [4 /*yield*/, chatModel_1.ChatModel.find({ users: foundUser._id }).populate("users", "username profileImage firstName lastName active lastSeen")];
            case 2:
                chats = _a.sent();
                result = [];
                chats.forEach(function (chat) {
                    chat.users.forEach(function (user) {
                        if (user.username !== foundUser.username) {
                            result.push(user);
                        }
                    });
                });
                res.send(result);
                return [2 /*return*/];
        }
    });
}); };
exports.getChats = getChats;
var getChatsOfUsers = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var otherUser, token, user, user1, chats, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                otherUser = req.params.username;
                token = req.headers.authorization.split(" ")[1];
                user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                return [4 /*yield*/, users_schema_1.default.findOne({ username: otherUser })];
            case 1:
                user1 = _a.sent();
                return [4 /*yield*/, chatModel_1.ChatModel.findOne({
                        // @ts-ignore
                        users: { $all: [user1._id, user.id] },
                    })
                        .populate("messages")
                        .select("messages")];
            case 2:
                chats = _a.sent();
                //   chats = chats.map((chat:any)=>chat.messages)
                // console.log(chats);
                //@ts-ignore
                res.send(chats.messages);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                res.status(400).json({
                    status: "fail",
                    message: err_1,
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getChatsOfUsers = getChatsOfUsers;
var addNewChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, user, user1, user2, chat, newChat, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                token = req.headers.authorization.split(" ")[1];
                user = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                return [4 /*yield*/, users_schema_1.default.findOne({ username: req.body.userId })];
            case 1:
                user1 = _a.sent();
                return [4 /*yield*/, users_schema_1.default.findOne({ username: user.username })];
            case 2:
                user2 = _a.sent();
                return [4 /*yield*/, chatModel_1.ChatModel.findOne({
                        users: { $all: [user1._id, user2._id] },
                    })];
            case 3:
                chat = _a.sent();
                if (chat) {
                    res.status();
                    return [2 /*return*/];
                }
                return [4 /*yield*/, chatModel_1.ChatModel.create({
                        users: [user1._id, user2._id],
                    })];
            case 4:
                newChat = _a.sent();
                res.status(201).send();
                return [3 /*break*/, 6];
            case 5:
                err_2 = _a.sent();
                console.log(err_2);
                res.status(400).json({
                    status: "fail",
                    message: err_2,
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addNewChat = addNewChat;
var addMsgToChat = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, users, msg, token, user1, user2, msgResponse, doc, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                _a = req.body, users = _a.users, msg = _a.msg;
                token = req.headers.authorization.split(" ")[1];
                return [4 /*yield*/, jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY)];
            case 1:
                user1 = _b.sent();
                return [4 /*yield*/, users_schema_1.default.findOne({ username: users })];
            case 2:
                user2 = _b.sent();
                return [4 /*yield*/, messageModel_1.MessageModel.create({
                        content: msg,
                        sentBy: user1.username,
                    })];
            case 3:
                msgResponse = _b.sent();
                return [4 /*yield*/, chatModel_1.ChatModel.findOneAndUpdate({ users: { $all: [user1.id, user2._id] } }, { $push: { messages: msgResponse._id } }, { new: true, upsert: true })];
            case 4:
                doc = _b.sent();
                sockets_1.io.emit("message-sent", msg);
                res.status(201).send(doc);
                return [3 /*break*/, 6];
            case 5:
                err_3 = _b.sent();
                console.log(err_3);
                res.status(400).json({
                    status: "fail",
                    message: err_3.message,
                });
                return [3 /*break*/, 6];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.addMsgToChat = addMsgToChat;
