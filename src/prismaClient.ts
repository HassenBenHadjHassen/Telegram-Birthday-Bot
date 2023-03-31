import { PrismaClient } from "@prisma/client";

require("dotenv").config();

export const prismaClient = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});
