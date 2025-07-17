import express from 'express';
import cors from 'cors';
import { json, raw } from 'express';
import authRoutes from './modules/auth/auth.routes';
import productRoutes from './modules/product/product.routes';
import paymentRoutes from './modules/payment/payment.routes';
import { ENV } from './config/env';

const app = express();

app.use(cors());
app.use(json());

// Stripe webhook requires raw body
app.use('/api/payments/webhook', raw({ type: 'application/json' }));
app.use('/api/payments', paymentRoutes);
app.use(json()); 
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

app.get('/', (_, res) => res.send('Server is alive'));

app.listen(5000, () => {
  console.log('Server running at http://localhost:5000');
});
