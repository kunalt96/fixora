import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

export const tenants = {};

router.post('/errors', (req, res) => {
  const { message, stack, url } = req.body;
  const finalApiKey = req.headers['x-api-key'] || req.body.apiKey || req.query.apiKey;

  if (!finalApiKey) {
    return res.status(400).json({ error: 'API Key is required' });
  }

  if (!tenants[finalApiKey]) {
    tenants[finalApiKey] = [];
  }

  const tenantErrors = tenants[finalApiKey];
  const existingError = tenantErrors.find((err) => err.message === message);

  if (existingError) {
    existingError.count += 1;
    existingError.lastSeen = new Date();
    return res.status(200).json(tenantErrors);
  }

  const newError = {
    id: uuidv4(),
    message,
    stack,
    url,
    apiKey: finalApiKey,
    count: 1,
    firstSeen: new Date(),
    lastSeen: new Date(),
    analysis: null
  };

  tenantErrors.push(newError);
  res.status(201).json(tenantErrors);
});

router.get('/errors', (req, res) => {
  const finalApiKey = req.headers['x-api-key'];
  if (!finalApiKey || !tenants[finalApiKey]) {
    return res.json([]);
  }
  res.json(tenants[finalApiKey]);
});

export default router;
