import { Request, Response, NextFunction } from "express";

export const sessionCheck = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    console.log("sessionCheck", req.session.user);
    if (!req.session.user) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    next();
};
