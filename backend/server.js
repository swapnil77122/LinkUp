// backend/server.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { pool } = require("./db");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const { Server } = require("socket.io");

const PORT = process.env.PORT || 4000;

// ---------- Middleware ----------
app.use(
  cors({
    origin: "http://localhost:5173", // frontend dev server
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());

// Simple request logger (debug)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url}`);
  next();
});

// ---------- Routes ----------
const contactsRouter = require("./routes/contacts");
app.use("/api/contacts", contactsRouter);

// Ping route (debugging connection)
app.get("/api/ping", (req, res) => {
  res.json({ message: "pong" });
});

// Messages router factory with socket.io
const { Server: IOServer } = require("socket.io");
const io = new IOServer(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

const messagesRouterFactory = require("./routes/messages");
app.use("/api/messages", messagesRouterFactory(io));

// ---------- Socket.io ----------
io.on("connection", (socket) => {
  console.log("✅ Socket connected:", socket.id);

  socket.on("join", (room) => {
    console.log(`➡️ Socket ${socket.id} joined room ${room}`);
    socket.join(room);
  });

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", socket.id);
  });
});

// ---------- Start Server ----------
server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
