"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var sockets_1 = require("./sockets");
sockets_1.io.on("connection here", function (data) {
    console.log('connected');
});
sockets_1.io.emit();
