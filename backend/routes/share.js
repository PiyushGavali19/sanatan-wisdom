import express from "express";
import SharedChat from "../models/sharedchat.js";

const router = express.Router();


// CREATE SHARE LINK
router.post("/", async (req, res) => {
  try {
    const { messages } = req.body;

    const chat = await SharedChat.create({
      messages,
    });

    res.json({ id: chat._id });
  } catch (err) {
    res.status(500).json({ error: "Failed to share" });
  }
});


// GET SHARED CHAT
router.get("/:id", async (req, res) => {
  try {
    const chat = await SharedChat.findById(
      req.params.id
    );

    if (!chat)
      return res.status(404).json({
        error: "Not found",
      });

    res.json(chat);
  } catch {
    res.status(500).json({ error: "Error" });
  }
});

export default router;
