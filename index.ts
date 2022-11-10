import express, { Express } from "express";
import session from "cookie-session";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import nocache from "nocache";
import { errorHandler } from "./src/middlewares/error.middleware";
import { DB_COMMENTS, DB_USER, initalComments } from "./src/datasource";
import { addFailedAttempt } from "./src/utils";
import { brokenAuthSecure } from "./src/middlewares/broken-auth-secure.middleware";
import { sessionCheck } from "./src/middlewares/sessionCheck.middleware";
import csurf from "csurf";
import cookieParser from "cookie-parser";
import { success } from "concurrently/dist/src/defaults";

dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN_URL =
  process.env.CLIENT_ORIGIN_URL || "http://localhost:4000";
const HACKER_ORIGIN_URL =
  process.env.HACKER_ORIGIN_URL || "http://localhost:3000";
const SESSION_SECRET = process.env.TOKEN_SECRET || ".";

const server: Express = express();

server.set("trust proxy", 1);
server.use(
  cors({
    origin: [CLIENT_ORIGIN_URL, HACKER_ORIGIN_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
server.use(cookieParser());
server.use(
  session({
    keys: [SESSION_SECRET],
    name: "session",
    secret: SESSION_SECRET,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    sameSite: "none",
    maxAge: 24 * 60 * 60 * 1000,
  })
);
const csrfProtect = csurf({ cookie: true });
server.use(express.json());
server.set("json spaces", 2);
server.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
server.use(nocache());

server.get("/csrf-token", csrfProtect, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

server.get("/api/transfer", sessionCheck, async (req, res) => {
  const { to, amount } = req.query;
  const fromUser = DB_USER.find((user) => user.username === req.session.user);
  const toUser = DB_USER.find((user) => user.email === to);
  if (!fromUser || !toUser) {
    res.status(400).json({ message: "Bad request" });
    return;
  }
  if (fromUser.balance < parseInt(amount as string, 10)) {
    res.status(400).json({ message: "Insufficient balance" });
    return;
  }
  fromUser.balance -= parseInt(amount as string, 10);
  toUser.balance += parseInt(amount as string, 10);
  res.json({
    message: `Successfully transferred ${amount} to ${to}`,
  });
});

server.get(
  "/api/transfer-secure",
  sessionCheck,
  csrfProtect,
  async (req, res) => {
    const { to, amount } = req.query;
    const fromUser = DB_USER.find((user) => user.username === req.session.user);
    const toUser = DB_USER.find((user) => user.email === to);
    if (!fromUser || !toUser) {
      res.status(400).json({ message: "Bad request" });
      return;
    }
    if (fromUser.balance < parseInt(amount as string, 10)) {
      res.status(400).json({ message: "Insufficient balance" });
      return;
    }
    fromUser.balance -= parseInt(amount as string, 10);
    toUser.balance += parseInt(amount as string, 10);
    res.json({
      message: `Successfully transferred ${amount} to ${to}`,
    });
  }
);

server.post("/api/login1", function (req, res, next) {
  req.session.user = "test";
  res.send("ok");
});

server.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = DB_USER.find((user) => user.username === username);
  if (!user) {
    res.status(401).json({ message: "Bad credentials" });
    return;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    res.status(401).json({ message: "Bad credentials" });
    return;
  }

  req.session.user = username;

  res.json({
    user: username,
  });
});

server.get("/reset-balance", function (req, res, next) {
  DB_USER.forEach((user) => {
    user.balance = 10000;
  });
  res.send("ok");
});

server.post("/api/login-secure", brokenAuthSecure, async (req, res) => {
  const { username, password } = req.body;
  const user = DB_USER.find((user) => user.username === username);
  if (!user) {
    addFailedAttempt(req.ip);
    res.status(401).json({ message: "Bad credentials" });
    return;
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    addFailedAttempt(req.ip);
    res.status(401).json({ message: "Bad credentials" });
    return;
  }
  req.session.user = username;

  res.json({
    user: username,
  });
});

server.get("/api/logout", function (req, res, next) {
  req.session.destroy();
  res.json({ message: "Logout successfully" });
});

server.get("/users", (req, res) => {
  res.json(DB_USER);
});

server.get("/comments", (req, res) => {
  res.json(DB_COMMENTS);
});

server.post("/comments", (req, res) => {
  const { text } = req.body;
  DB_COMMENTS.push({
    id: DB_COMMENTS.length + 1,
    text,
  });
  res.json({ message: "Comment added" });
});

server.delete("/comments", (req, res) => {
  DB_COMMENTS.splice(0, DB_COMMENTS.length);
  DB_COMMENTS.push(...initalComments);
  res.json({ message: "Comments reset" });
});

server.use(errorHandler);

server.listen(PORT, () => {
  console.log("Server listening on http://localhost:" + PORT);
});
