import jwt from "jsonwebtoken";
import { DB_IP_DATA } from "./datasource";
import dotenv from "dotenv";
import { ICheckResult } from "./types";

dotenv.config();

const TOKEN_SECRET = process.env.TOKEN_SECRET || "";

export const checkFailedAttempts = (ip: string): ICheckResult => {
  const optionalIPData = DB_IP_DATA.find((data) => data.ip === ip);
  if (!optionalIPData) {
    return { message: "OK", code: 200 };
  }

  if (optionalIPData.attempts >= 3) {
    const timeDifference =
      new Date().getTime() - optionalIPData.lastAttempt.getTime();
    const minutes = Math.floor(timeDifference / 60000);
    if (minutes < 1) {
      return { message: "Too many failed attempts", code: 429 };
    } else {
      DB_IP_DATA.splice(DB_IP_DATA.indexOf(optionalIPData), 1);
    }
  }

  return { message: "OK", code: 200 };
};

export const addFailedAttempt = (ip: string) => {
  const optionalIPData = DB_IP_DATA.find((data) => data.ip === ip);
  if (!optionalIPData) {
    DB_IP_DATA.push({
      id: DB_IP_DATA.length + 1,
      ip,
      attempts: 1,
      lastAttempt: new Date(),
    });
  } else {
    optionalIPData.attempts++;
    optionalIPData.lastAttempt = new Date();
  }
};

export const generateJWT = (username: string, email: string) => {
  return jwt.sign({ username, email }, TOKEN_SECRET, {
    expiresIn: "10h",
  });
};
