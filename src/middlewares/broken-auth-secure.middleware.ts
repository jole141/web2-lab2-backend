import { Request, Response, NextFunction } from "express";
import { checkFailedAttempts } from "../utils";

export const brokenAuthSecure = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const { message, code } = checkFailedAttempts(req.ip);
  if (code !== 200) {
    res.status(code).json({ message });
    return;
  }
  next();
};
