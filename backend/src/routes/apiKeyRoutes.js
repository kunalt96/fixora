import express from 'express';
import crypto from 'crypto';
import { tenants } from './errorRoutes.js';

const router = express.Router();

router.get('/generate-apiKey', (req, res) => {
    const apiKey = crypto.randomBytes(8).toString('hex'); // 16 character hex string
    tenants[apiKey] = [];
    res.status(201).json({ apiKey });
});

export default router;
