// server/socket-server.js
require("dotenv").config({ path: ".env.local" });
const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3001;
const app = express();
const httpServer = createServer(app);

// Socket.io setup with CORS
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3000", "https://brainwave-two-iota.vercel.app"],
    methods: ["GET", "POST"],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Make io globally available for notification emission
global.io = io;

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in environment variables");
  process.exit(1);
}

mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
    process.exit(1);
  });

// ============================================
// DEFINE MODELS DIRECTLY (NO IMPORTS)
// ============================================

// User Schema
const userSchema = new mongoose.Schema({
  firebaseUid: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  avatar: { type: String, default: "" },
  studyInterests: [{ type: String }],
  streak: { type: Number, default: 0 },
  lastActive: { type: Date, default: Date.now },
  totalXP: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);

// Message Schema
const messageSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: "StudyGroup" },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "quiz_share", "flashcard_share"],
    default: "text",
  },
  metadata: { type: mongoose.Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ groupId: 1, createdAt: -1 });
messageSchema.index({ senderId: 1, receiverId: 1, createdAt: -1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

// StudyGroup Schema
const studyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, default: "" },
  creatorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  inviteCode: { type: String, required: true },
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

studyGroupSchema.index({ inviteCode: 1 }, { unique: true });
studyGroupSchema.index({ creatorId: 1 });

const StudyGroup =
  mongoose.models.StudyGroup || mongoose.model("StudyGroup", studyGroupSchema);

// ============================================
// SOCKET.IO LOGIC
// ============================================

// Store active users and their socket connections
const activeUsers = new Map(); // userId -> { socketId, groups: Set }
const groupTyping = new Map(); // groupId -> Set of userId

// Enhanced authentication: support Firebase UID or MongoDB ObjectId
io.use(async (socket, next) => {
  try {
    const userId = socket.handshake.auth.userId;
    if (!userId) {
      return next(new Error("Authentication error - userId required"));
    }

    // Try to find user by _id (ObjectId) or firebaseUid (string)
    let user = null;
    if (/^[a-fA-F0-9]{24}$/.test(userId)) {
      user = await User.findById(userId);
    }
    if (!user) {
      user = await User.findOne({ firebaseUid: userId });
    }

    if (!user) {
      return next(new Error("User not found"));
    }

    // Always use user._id as socket.userId for consistency
    socket.userId = user._id.toString();
    socket.user = user;

    next();
  } catch (err) {
    console.error("Auth error:", err);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(`✅ User connected: ${socket.userId}`);

  // Store active user
  activeUsers.set(socket.userId, {
    socketId: socket.id,
    groups: new Set(),
  });

  // Notify all groups that user is online
  socket.broadcast.emit("user_online", {
    userId: socket.userId,
    displayName: socket.user.displayName,
  });

  // ==========================================
  // JOIN GROUP
  // ==========================================
  socket.on("join_group", async ({ groupId }, callback) => {
    try {
      // Verify user is member of group
      const group = await StudyGroup.findById(groupId);

      if (!group) {
        const error = { message: "Group not found" };
        socket.emit("error", error);
        if (callback) callback({ success: false, error: error.message });
        return;
      }

      const isMember = group.members.some(
        (memberId) => memberId.toString() === socket.userId
      );

      if (!isMember) {
        const error = { message: "Not authorized to join this group" };
        socket.emit("error", error);
        if (callback) callback({ success: false, error: error.message });
        return;
      }

      // Join the socket room
      socket.join(`group:${groupId}`);

      // Track user's groups
      const userInfo = activeUsers.get(socket.userId);
      if (userInfo) {
        userInfo.groups.add(groupId);
      }

      // Get online members
      const onlineMembers = [];
      for (const memberId of group.members) {
        const memberIdStr = memberId.toString();
        if (activeUsers.has(memberIdStr)) {
          const member = await User.findById(memberId);
          if (member) {
            onlineMembers.push({
              userId: member._id.toString(),
              displayName: member.displayName,
              avatar: member.avatar,
            });
          }
        }
      }

      // Notify group that user joined
      io.to(`group:${groupId}`).emit("user_joined", {
        userId: socket.userId,
        displayName: socket.user.displayName,
        avatar: socket.user.avatar,
        onlineMembers,
      });

      socket.emit("joined_group", {
        groupId,
        onlineMembers,
      });

      if (callback) callback({ success: true, groupId, onlineMembers });

      console.log(`📥 User ${socket.userId} joined group ${groupId}`);
    } catch (error) {
      console.error("Join group error:", error);
      socket.emit("error", { message: "Failed to join group" });
      if (callback) callback({ success: false, error: error.message });
    }
  });

  // ==========================================
  // LEAVE GROUP
  // ==========================================
  socket.on("leave_group", ({ groupId }) => {
    socket.leave(`group:${groupId}`);

    const userInfo = activeUsers.get(socket.userId);
    if (userInfo) {
      userInfo.groups.delete(groupId);
    }

    // Clean up typing indicator
    if (groupTyping.has(groupId)) {
      groupTyping.get(groupId).delete(socket.userId);
      if (groupTyping.get(groupId).size === 0) {
        groupTyping.delete(groupId);
      }
    }

    io.to(`group:${groupId}`).emit("user_left", {
      userId: socket.userId,
      displayName: socket.user.displayName,
    });

    console.log(`📤 User ${socket.userId} left group ${groupId}`);
  });

  // ==========================================
  // SEND MESSAGE (FIXED: Callback BEFORE broadcast)
  // ==========================================
  socket.on(
    "send_message",
    async ({ groupId, content, type = "text", metadata = null }, callback) => {
      try {
        console.log(`📬 Received send_message from ${socket.userId}:`, content);

        // Validate input
        if (!content || !content.trim()) {
          console.log("❌ Empty message content");
          if (callback) {
            console.log("[DEBUG] Calling callback for empty content");
            callback({ success: false, error: "Message content is required" });
            console.log("[DEBUG] Callback for empty content sent");
          }
          return;
        }

        // Create message in database
        const message = await Message.create({
          groupId,
          senderId: socket.userId,
          content: content.trim(),
          type,
          metadata,
        });

        console.log(`💾 Message saved to DB:`, message._id);

        // Populate sender info
        await message.populate("senderId", "displayName avatar");

        const messageData = {
          _id: message._id.toString(),
          groupId: message.groupId.toString(),
          sender: {
            _id: message.senderId._id.toString(),
            displayName: message.senderId.displayName,
            avatar: message.senderId.avatar,
          },
          content: message.content,
          type: message.type,
          metadata: message.metadata,
          createdAt: message.createdAt,
        };

        // CRITICAL FIX: Acknowledge FIRST before broadcasting
        if (callback) {
          console.log(`[DEBUG] About to call callback for message:`, message._id);
          callback({ success: true, message: messageData });
          console.log(`[DEBUG] Callback for message sent:`, message._id);
        } else {
          console.log(`[DEBUG] No callback function provided for message:`, message._id);
        }

        // THEN broadcast to all group members (including sender)
        console.log(`📡 Broadcasting message to group:${groupId}`);
        io.to(`group:${groupId}`).emit("new_message", messageData);

        // Emit message_delivered to sender (and optionally to all group members)
        // This tells the client to update deliveryStatus to 'delivered'
        io.to(socket.id).emit("message_delivered", { messageId: messageData._id });

        // Stop typing indicator
        if (groupTyping.has(groupId)) {
          groupTyping.get(groupId).delete(socket.userId);
          io.to(`group:${groupId}`).emit("typing_stopped", {
            userId: socket.userId,
            groupId,
          });
        }

        console.log(`💬 Message sent to group ${groupId} by ${socket.userId}`);
      } catch (error) {
        console.error("Send message error:", error);
        const errorMsg = error.message || "Failed to send message";
        socket.emit("error", { message: errorMsg });
        if (callback) {
          console.log("[DEBUG] Calling callback for error");
          callback({ success: false, error: errorMsg });
          console.log("[DEBUG] Callback for error sent");
        }
      }
    }
  );

  // ==========================================
  // TYPING INDICATORS
  // ==========================================
  socket.on("typing_start", ({ groupId }) => {
    try {
      if (!groupTyping.has(groupId)) {
        groupTyping.set(groupId, new Set());
      }
      const typingSet = groupTyping.get(groupId);
      if (!typingSet.has(socket.userId)) {
        typingSet.add(socket.userId);
        socket.to(`group:${groupId}`).emit("user_typing", {
          userId: socket.userId,
          displayName: socket.user.displayName,
          groupId,
        });
      }
    } catch (error) {
      console.error("Typing start error:", error);
    }
  });

  socket.on("typing_stop", ({ groupId }) => {
    try {
      if (groupTyping.has(groupId)) {
        const typingSet = groupTyping.get(groupId);
        if (typingSet.has(socket.userId)) {
          typingSet.delete(socket.userId);
          socket.to(`group:${groupId}`).emit("typing_stopped", {
            userId: socket.userId,
            groupId,
          });
          // Clean up empty sets
          if (typingSet.size === 0) {
            groupTyping.delete(groupId);
          }
        }
      }
    } catch (error) {
      console.error("Typing stop error:", error);
    }
  });

  // ==========================================
  // GET ONLINE MEMBERS
  // ==========================================
  socket.on("get_online_members", async ({ groupId }) => {
    try {
      const group = await StudyGroup.findById(groupId);

      if (!group) {
        return socket.emit("error", { message: "Group not found" });
      }

      const onlineMembers = [];
      for (const memberId of group.members) {
        const memberIdStr = memberId.toString();
        if (activeUsers.has(memberIdStr)) {
          const member = await User.findById(memberId);
          if (member) {
            onlineMembers.push({
              userId: member._id.toString(),
              displayName: member.displayName,
              avatar: member.avatar,
            });
          }
        }
      }

      socket.emit("online_members", { groupId, members: onlineMembers });
    } catch (error) {
      console.error("Get online members error:", error);
    }
  });

  // ==========================================
  // DISCONNECT
  // ==========================================
  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.userId}`);

    const userInfo = activeUsers.get(socket.userId);

    if (userInfo) {
      // Notify all groups user was in and clean up typing
      for (const groupId of userInfo.groups) {
        io.to(`group:${groupId}`).emit("user_left", {
          userId: socket.userId,
          displayName: socket.user.displayName,
        });

        // Clean up typing indicators
        if (groupTyping.has(groupId)) {
          const typingSet = groupTyping.get(groupId);
          typingSet.delete(socket.userId);
          if (typingSet.size === 0) {
            groupTyping.delete(groupId);
          }
          // Notify that user stopped typing
          io.to(`group:${groupId}`).emit("typing_stopped", {
            userId: socket.userId,
            groupId,
          });
        }
      }

      activeUsers.delete(socket.userId);
    }

    // Notify all that user is offline
    socket.broadcast.emit("user_offline", {
      userId: socket.userId,
    });
  });

  // ==========================================
  // ERROR HANDLING
  // ==========================================
  socket.on("error", (error) => {
    console.error(`Socket error for user ${socket.userId}:`, error);
  });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    activeConnections: io.engine.clientsCount,
    activeUsers: activeUsers.size,
    activeGroups: groupTyping.size,
    timestamp: new Date().toISOString(),
  });
});

// Start server
httpServer.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} signal received: closing HTTP server`);

  // Notify all connected clients
  io.emit("server_shutdown", { message: "Server is shutting down" });

  // Close all socket connections
  io.close(() => {
    console.log("All socket connections closed");

    httpServer.close(() => {
      console.log("HTTP server closed");
      mongoose.connection.close(false, () => {
        console.log("MongoDB connection closed");
        process.exit(0);
      });
    });
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error(
      "Could not close connections in time, forcefully shutting down"
    );
    process.exit(1);
  }, 10000);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

module.exports = { io, httpServer };
