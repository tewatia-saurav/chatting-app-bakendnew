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
exports.setUserActiveStatus = exports.sendOtpToPhone = exports.sendOtpToMail = exports.uploadPhotos = exports.POSTS_PATH = void 0;
var nodemailer_1 = __importDefault(require("nodemailer"));
var googleapis_1 = require("googleapis");
var twilio_1 = require("twilio");
var dotenv_1 = __importDefault(require("dotenv"));
var multer_1 = __importDefault(require("multer"));
var path_1 = __importDefault(require("path"));
var users_schema_1 = __importDefault(require("../Model/users-schema"));
var moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
exports.POSTS_PATH = path_1.default.join("uploads/profileImages"); //1
var storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path_1.default.join(__dirname, "../", exports.POSTS_PATH));
    },
    filename: function (req, file, cb) {
        var extention = file.mimetype.split("/")[1];
        // console.log("Extension", extention);
        cb(null, Date.now() + ("." + extention));
    },
});
var upload = multer_1.default({
    storage: storage,
});
exports.uploadPhotos = upload.single("profileImage");
var sendOtpToMail = function (email, otp) { return __awaiter(void 0, void 0, void 0, function () {
    var oAuth2Client, accessToken, transport, mailOption, result, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 3, , 4]);
                oAuth2Client = new googleapis_1.google.auth.OAuth2(process.env.CLIENT_ID, process.env.CLIENT_SECRET, process.env.REDIRECT_URI);
                oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
                return [4 /*yield*/, oAuth2Client.getAccessToken()];
            case 1:
                accessToken = _a.sent();
                transport = nodemailer_1.default.createTransport({
                    // @ts-ignore
                    service: "gmail",
                    auth: {
                        type: "OAUTH2",
                        user: "team.heros.mindtree@gmail.com",
                        clientId: process.env.CLIENT_ID,
                        clientSecret: process.env.CLIENT_SECRET,
                        refreshToken: process.env.REFRESH_TOKEN,
                        accessToken: accessToken,
                    },
                });
                mailOption = {
                    from: '"Team Heros" <team.heros.mindtree@gmail.com',
                    to: email,
                    subject: "Email Verification Otp",
                    html: "<p>Otp to login in <b>Chatting App</b> is <b>" + otp + "</b>. Please DO NOT share it with anyone.</p>",
                };
                return [4 /*yield*/, transport.sendMail(mailOption)];
            case 2:
                result = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.log(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.sendOtpToMail = sendOtpToMail;
var sendOtpToPhone = function (phone, otp) { return __awaiter(void 0, void 0, void 0, function () {
    var client, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                client = new twilio_1.Twilio(process.env.TWILIO_AUTH_SID, process.env.TWILIO_AUTH_TOKEN);
                return [4 /*yield*/, client.messages.create({
                        body: "Otp to login in Chatting App is " + otp + ". Please DO NOT share it with anyone.",
                        to: phone,
                        from: process.env.TWILIO_NUMBER,
                    })];
            case 1:
                _a.sent();
                return [3 /*break*/, 3];
            case 2:
                err_2 = _a.sent();
                console.log(err_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.sendOtpToPhone = sendOtpToPhone;
var setUserActiveStatus = function (connectionId, username, active) { return __awaiter(void 0, void 0, void 0, function () {
    var res, res;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!username) return [3 /*break*/, 2];
                return [4 /*yield*/, users_schema_1.default.findOneAndUpdate({ username: username }, { connectionId: connectionId, active: active, lastSeen: "" })];
            case 1:
                res = _a.sent();
                return [3 /*break*/, 4];
            case 2: return [4 /*yield*/, users_schema_1.default.findOneAndUpdate({ connectionId: connectionId }, {
                    connectionId: connectionId,
                    active: active,
                    lastSeen: moment_1.default().format("dddd, MMMM Do, h:mm a"),
                })];
            case 3:
                res = _a.sent();
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.setUserActiveStatus = setUserActiveStatus;
