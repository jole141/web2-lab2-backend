import { Request, Response, NextFunction } from "express";

export const sessionCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.session.user) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
  next();
};
