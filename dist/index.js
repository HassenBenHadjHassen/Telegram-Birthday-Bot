"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const prismaClient_1 = require("./prismaClient");
const telegramBot_1 = require("./telegramBot");
const startup = () => {
    prismaClient_1.prismaClient.$connect();
    (0, telegramBot_1.botStarter)();
};
startup();
