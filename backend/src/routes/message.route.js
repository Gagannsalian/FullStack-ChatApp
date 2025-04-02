import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserForSlider, getMessages, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Route to get users for chat slider
router.get("/users", protectRoute, getUserForSlider);

// Route to get messages between two users
router.get("/:id", protectRoute, getMessages);

// Route to send a message between users
router.post("/send/:id", protectRoute, sendMessage);

export default router;
