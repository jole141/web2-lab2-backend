import express, { Express } from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import cors from "cors";
import nocache from "nocache";
import { errorHandler } from "./src/middlewares/error.middleware";
import { DB_COMMENTS, DB_USER, initalComments } from "./src/datasource";
import { addFailedAttempt, generateJWT } from "./src/utils";
import { brokenAuthSecure } from "./src/middlewares/broken-auth-secure.middleware";

dotenv.config();

const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN_URL = process.env.CLIENT_ORIGIN_URL;

const server: Express = express();

server.use(express.json());
server.set("json spaces", 2);
server.use((req, res, next) => {
  res.contentType("application/json; charset=utf-8");
  next();
});
server.use(nocache());
server.use(
  cors({
    origin: CLIENT_ORIGIN_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Authorization", "Content-Type"],
    maxAge: 86400,
  })
);

server.post("/login", async (req, res) => {
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
  res.json({
    token: generateJWT(username, user.email),
  });
});

server.post("/login-secure", brokenAuthSecure, async (req, res) => {
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
  res.json({
    token: generateJWT(username, user.email),
  });
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
