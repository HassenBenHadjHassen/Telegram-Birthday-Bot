"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaClient = void 0;
const client_1 = require("@prisma/client");
require("dotenv").config();
exports.prismaClient = new client_1.PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
});
