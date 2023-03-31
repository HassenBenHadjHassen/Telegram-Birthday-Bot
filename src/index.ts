import { prismaClient } from "./prismaClient";
import { botStarter } from "./telegramBot";

const startup = () => {
  prismaClient.$connect();
  botStarter();
};

startup();
