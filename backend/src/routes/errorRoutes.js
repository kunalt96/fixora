import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

const errors = [];

router.post('/errors', (req, res) => {
  const { message, stack, url } = req.body;

  const newError = {
    id: uuidv4(),
    message,
    stack,
    url,
    count: 1,
    firstSeen: new Date(),
    lastSeen: new Date()
  };

  errors.push(newError);
  res.status(201).json(newError);
});

router.get('/errors', (req, res) => {
  res.json(errors);
});

export default router;
