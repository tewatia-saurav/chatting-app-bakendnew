"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var connection_to_db_1 = __importDefault(require("./connection-to-db"));
var dotenv_1 = __importDefault(require("dotenv"));
var sockets_1 = require("./sockets");
dotenv_1.default.config();
// const app = express();
// app.set("port", process.env.PORT);
// app.use(express.json());
// app.use(cors());
// let http = require("http").Server(app);
// let io = require("socket.io")(http);
connection_to_db_1.default()
    .then(function () {
    console.log("Connected to database");
    sockets_1.http.listen(process.env.PORT, function () {
        console.log("Server Running at http://localhost:" + process.env.PORT);
    });
})
    .catch(function (err) {
    console.log(err.message);
});
// app.use("/api/user", userRouter);
// app.use("/api/chats", chatRouter);
// app.use("/uploads", express.static(__dirname + "/uploads"));
// io.on("connection", (data: any) => {
//   console.log("connected");
// });
// export default io;
