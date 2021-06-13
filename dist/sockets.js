"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = exports.http = void 0;
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var users_route_1 = __importDefault(require("./Routes/users-route"));
var chats_route_1 = __importDefault(require("./Routes/chats-route"));
var utils_1 = require("./Controller/utils");
var app = express_1.default();
app.set("port", process.env.PORT);
app.use(express_1.default.json());
app.use(cors_1.default());
var http = require("http").Server(app);
exports.http = http;
var io = require("socket.io")(http);
exports.io = io;
app.use("/api/user", users_route_1.default);
app.use("/api/chats", chats_route_1.default);
app.use("/uploads", express_1.default.static(__dirname + "/uploads"));
io.on("connection", function (socket) {
    socket.on("setUserActive", function (username) {
        console.log("changing active status for : ", username);
        utils_1.setUserActiveStatus(socket.id, username, true);
        io.emit('doneSettingUpUserActive');
    });
    socket.on("disconnect", function () {
        console.log("disconnecting");
        utils_1.setUserActiveStatus(socket.id, null, false);
        io.emit('doneSettingUpUserActive');
    });
});
