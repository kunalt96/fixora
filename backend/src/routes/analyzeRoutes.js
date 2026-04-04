import express from "express";
import { analyZeERROR } from "../services/aiServices.js";

const router = express.Router();

router.post("/analyze", async (req, res) => {
    const { message, stack } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required" });
    }

    // const response = await analyZeERROR({ message, stack });
    const response1 = {
        "explanation": "The error occurs because the JavaScript engine attempted to execute a function named 'undefinedFunction' that has not been declared or imported in the current scope at line 20 of test.html.",
        "fix": "Ensure the function is defined before it is called, or if it is intended to be imported from an external script, verify that the script is properly linked in the HTML document and loaded before the line causing the error.",
        "confidence": "High"
    }

    await new Promise(resolve => setTimeout(resolve, 2000));
    res.json(response1);
});

export default router;