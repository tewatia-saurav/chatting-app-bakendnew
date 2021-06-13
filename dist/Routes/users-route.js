"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var users_controller_1 = require("../Controller/users-controller");
var utils_1 = require("../Controller/utils");
var userRouter = express_1.default.Router();
userRouter.post("/signup", utils_1.uploadPhotos, users_controller_1.signup);
userRouter.get("/", users_controller_1.getAll);
userRouter.get("/token", users_controller_1.getUserByToken);
userRouter.get("/:username", users_controller_1.getByUsername);
userRouter.post("/login", users_controller_1.login);
// userRouter.post("/resend/otp")
userRouter.post("/verify/otp", users_controller_1.otpAuth);
exports.default = userRouter;
