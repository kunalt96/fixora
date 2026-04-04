import express from "express";

const router = express.Router();

router.post("/analyze", async (req, res) => {
    const { message, stack } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    // TEMP: mock response (we'll replace with AI)
    const response = {
        explanation: `This error occurs because ${message}`,
        fix: "Check if variable is defined before using it",
        confidence: "Medium"
    };

    res.json(response);
});

export default router;