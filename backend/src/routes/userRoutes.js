import express from "express";

const router = express.Router();

// /api/me — returns authenticated user details
router.get("/me", (req, res) => {
  const { id, email, user_metadata, created_at } = req.user;
  res.json({
    id,
    email,
    name: user_metadata?.full_name || email.split("@")[0],
    createdAt: created_at,
  });
});

export default router;
