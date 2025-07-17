import { Router } from 'express';
import { createCheckout, handleWebhook } from './payment.controller';
import { requireAuth } from '../../middleware/auth.middleware';

const router = Router();

router.post('/checkout', requireAuth, createCheckout);
router.post('/webhook', handleWebhook); // raw middleware applied in app.ts

export default router;
