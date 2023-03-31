require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
import { prismaClient } from "./prismaClient";

function getNextBirthday(date: Date): Date {
  const now = new Date();
  const currentYear = now.getFullYear();
  const birthMonth = date.getMonth();
  const birthDate = date.getDate();
  const nextBirthday = new Date(currentYear, birthMonth, birthDate);

  if (nextBirthday.getTime() < now.getTime()) {
    nextBirthday.setFullYear(currentYear + 1);
  }

  return nextBirthday;
}

function getAge(date: Date): number {
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  return diffYears;
}

function getDaysLeft(date: Date): number {
  const today = new Date();
  const timeDiff = date.getTime() - today.getTime();
  const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
  return daysDiff;
}

export const botStarter = () => {
  const bot = new TelegramBot(process.env.TELEGRAM_API_KEY, {
    polling: true,
  });

  bot.on("message", async (msg: any) => {
    const chatId: number = msg.chat.id;
    const userId: number = msg.from.id;
    const userFirstName: string = msg.from.first_name;

    const user = await prismaClient.user.findUnique({
      where: {
        userId: userId,
      },
    });

    if (msg.text === "/start") {
      // Send a welcome message to the new user
      bot.sendMessage(
        chatId,
        `Welcome to the chat, ${userFirstName}! type /help to see the commands`
      );
    }

    if (msg.text === "/setbirthday") {
      bot.sendMessage(
        chatId,
        "Enter your birthday (in the format MM/DD/YYYY):"
      );
      bot.once("message", async (msg: any) => {
        const birthday = new Date(msg.text);

        // Calculate the user's next birthday
        const age = getAge(birthday);
        const nextBirthday = getNextBirthday(birthday);

        bot.sendMessage(
          chatId,
          "Your birthday has been set. I will wish you a happy birthday when it comes around!"
        );

        user
          ? await prismaClient.user.update({
              where: {
                userId: userId,
              },
              data: {
                firstName: userFirstName,
                birthday: birthday,
                nextBirthday: nextBirthday,
              },
            })
          : await prismaClient.user.create({
              data: {
                chatId: chatId,
                userId: userId,
                firstName: userFirstName,
                birthday: birthday,
                nextBirthday: nextBirthday,
              },
            });
      });
    } else if (msg.text === "/checkbirthday") {
      const birthday = user?.birthday;
      const nextBirthday = user?.nextBirthday;

      // Check if it's the user's birthday
      if (birthday?.getDate() === new Date().getDate()) {
        bot.sendMessage(chatId, `Happy birthday, ${userFirstName}! 🎉🎂`);
      } else {
        const daysUntilBirthday = getDaysLeft(nextBirthday!);

        bot.sendMessage(
          chatId,
          `Your next birthday is on ${nextBirthday}. Only ${daysUntilBirthday} days to go! 🎉🎂`
        );
      }
    } else if (msg.text === "/age") {
      const birthday = user?.birthday;
      const age = getAge(birthday!);
      bot.sendMessage(chatId, `You are ${age} years old!`);
    } else if (msg.text === "/help") {
      bot.sendMessage(
        chatId,
        "Here are the commands you can use:\n/setbirthday - Set your birthday\n/checkbirthday - Check how many days until your next birthday\n/age - Check your age"
      );
    }
  });
};
