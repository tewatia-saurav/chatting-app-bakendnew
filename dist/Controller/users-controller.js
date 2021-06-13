"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.getByUsername = exports.getAll = exports.otpAuth = exports.getUserByToken = exports.isAuthorize = exports.signup = exports.login = void 0;
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var users_schema_1 = __importDefault(require("../Model/users-schema"));
var dotenv_1 = __importDefault(require("dotenv"));
var bcryptjs_1 = __importDefault(require("bcryptjs"));
var utils_1 = require("./utils");
dotenv_1.default.config();
var getAll = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, users_schema_1.default.find({}).select("username")];
            case 1:
                users = _a.sent();
                res.send(users);
                return [3 /*break*/, 3];
            case 2:
                err_1 = _a.sent();
                res.status(400).json({
                    status: "fail",
                    message: err_1,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getAll = getAll;
var getByUsername = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var value, users, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                value = new RegExp(req.params.userName);
                return [4 /*yield*/, users_schema_1.default.find({
                        username: { $regex: value, $options: "i" },
                    }).select("username")];
            case 1:
                users = _a.sent();
                res.json({ users: users });
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                res.status(400).json({
                    status: "fail",
                    message: err_2,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getByUsername = getByUsername;
var signup = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, profileImage, username, newUser, err_3;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.body, profileImage = _a.profileImage, username = _a.username;
                return [4 /*yield*/, users_schema_1.default.create(__assign(__assign({}, req.body), { profileImage: utils_1.POSTS_PATH + "/" + req.file.filename }))];
            case 1:
                newUser = _b.sent();
                // res.json({ users: newUser });
                res.status(200).json({
                    status: "SuccessFul",
                });
                return [3 /*break*/, 3];
            case 2:
                err_3 = _b.sent();
                res.status(400).json({
                    status: "fail",
                    message: err_3,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.signup = signup;
var login = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, userId, password, user, _b, otp, hashedOtp, token, secretPhone, secretEmail, err_4;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 8, , 9]);
                _a = req.body, userId = _a.userId, password = _a.password;
                if (!userId || !password) {
                    // @ts-ignore
                    res.status(400).json({
                        status: "The fields are empty please enter the data",
                    });
                    return [2 /*return*/];
                }
                return [4 /*yield*/, users_schema_1.default.findOne({
                        $or: [{ email: userId }, { phoneNumber: userId }, { username: userId }],
                    })];
            case 1:
                user = _c.sent();
                _b = !user;
                if (_b) return [3 /*break*/, 3];
                return [4 /*yield*/, user.correctPassword(password, user.password)];
            case 2:
                _b = !(_c.sent());
                _c.label = 3;
            case 3:
                if (!_b) return [3 /*break*/, 4];
                res.send(400).json({
                    message: "UnSuccessFul",
                });
                return [3 /*break*/, 7];
            case 4:
                otp = Math.floor(Math.random() * 899999 + 100000);
                // console.log("SEnding otp");
                utils_1.sendOtpToPhone(user.phoneNumber, otp);
                utils_1.sendOtpToMail(user.email, otp);
                return [4 /*yield*/, bcryptjs_1.default.hash(String(otp), 10)];
            case 5:
                hashedOtp = _c.sent();
                return [4 /*yield*/, jsonwebtoken_1.default.sign({ username: user.username, id: user._id, otp: hashedOtp }, process.env.SECRET_KEY, { expiresIn: "5m" })];
            case 6:
                token = _c.sent();
                secretPhone = user.phoneNumber.slice(3, 5) + "******" + user.phoneNumber.slice(11);
                secretEmail = user.email.slice(0, 4) +
                    "**********" +
                    user.email.slice(user.email.length - 10);
                res.json({
                    status: true,
                    message: "Otp sent to " + secretEmail + " & " + secretPhone,
                    token: token,
                });
                _c.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                err_4 = _c.sent();
                res.json({
                    status: "fail",
                    message: err_4.message,
                });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
var isAuthorize = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, requestUser, err_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                if (!(req.headers && req.headers.authorization)) return [3 /*break*/, 2];
                token = req.headers.authorization.split(" ")[1];
                decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                return [4 /*yield*/, users_schema_1.default.findOne(decode.username)];
            case 1:
                requestUser = _a.sent();
                try {
                    if (!requestUser) {
                        return [2 /*return*/, res.json({ success: false, message: "Unauthorized Access" })];
                    }
                    else {
                        req.user = requestUser;
                        next();
                    }
                }
                catch (err) {
                    if (err.name === "JsonWebTokenError") {
                        return [2 /*return*/, res.json({ success: false, message: "Unauthorized Access" })];
                    }
                    if (err.name === "TokenExpiredError") {
                        return [2 /*return*/, res.json({
                                success: false,
                                message: "Session Expire please try sign again",
                            })];
                    }
                }
                _a.label = 2;
            case 2: return [3 /*break*/, 4];
            case 3:
                err_5 = _a.sent();
                res.status(400).json({
                    message: "Error in Authorization",
                });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.isAuthorize = isAuthorize;
var otpAuth = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, otp, user, token_1, err_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!req.headers && !req.headers.authorization) {
                    res.json({
                        status: false,
                        message: "Headers are not given",
                    });
                    return [2 /*return*/];
                }
                _a.label = 1;
            case 1:
                _a.trys.push([1, 7, , 8]);
                token = req.headers.authorization.split(" ")[1];
                decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                otp = req.body.otp;
                return [4 /*yield*/, users_schema_1.default.findOne({ _id: decode.id })];
            case 2:
                user = _a.sent();
                return [4 /*yield*/, bcryptjs_1.default.compare(otp, decode.otp)];
            case 3:
                if (!_a.sent()) return [3 /*break*/, 5];
                return [4 /*yield*/, jsonwebtoken_1.default.sign({ username: user.username, id: user._id }, process.env.SECRET_KEY, { expiresIn: "24h" })];
            case 4:
                token_1 = _a.sent();
                res.json({
                    status: true,
                    message: "Successful Access",
                    token: token_1,
                });
                return [3 /*break*/, 6];
            case 5:
                res.json({ status: false, message: "Unsuccessful" });
                _a.label = 6;
            case 6: return [3 /*break*/, 8];
            case 7:
                err_6 = _a.sent();
                console.log(err_6);
                res.status(400).send("Bad Request");
                return [3 /*break*/, 8];
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.otpAuth = otpAuth;
var getUserByToken = function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, decode, user, err_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                if (!req.headers && !req.headers.authorization) {
                    res.json({
                        status: false,
                        message: "Headers are not given",
                    });
                    return [2 /*return*/];
                }
                token = req.headers.authorization.split(" ")[1];
                decode = jsonwebtoken_1.default.verify(token, process.env.SECRET_KEY);
                return [4 /*yield*/, users_schema_1.default.findOne({ _id: decode.id })];
            case 1:
                user = _a.sent();
                // console.log(user);
                res.send({
                    firstName: user.firstName,
                    lastName: user.lastName,
                    bioData: user.bioData,
                    phoneNumber: user.phoneNumber,
                    username: user.username,
                    profileImage: user.profileImage,
                });
                return [3 /*break*/, 3];
            case 2:
                err_7 = _a.sent();
                // console.log(err);
                res.send(err_7);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getUserByToken = getUserByToken;
