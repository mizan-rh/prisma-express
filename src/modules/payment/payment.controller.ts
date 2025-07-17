import { Request, Response } from "express";
import { ENV } from "../../config/env";
import { prisma } from "../../config/prisma";
import { stripe } from "../../config/stripe";
import { AuthRequest } from "../../middleware/auth.middleware";

export const createCheckout = async (req: AuthRequest, res: Response) => {
  const { productId } = req.body;
  console.log(productId);
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) return res.status(404).json({ error: "Not found" });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          product_data: { name: product.title },
          currency: "usd",
          unit_amount: product.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${ENV.CLIENT_URL}/success`,
    cancel_url: `${ENV.CLIENT_URL}/cancel`,
    metadata: { productId },
  });

  res.json({ url: session.url });
};

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"]!;
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const productId = session.metadata.productId;

    await prisma.product.update({
      where: { id: productId },
      data: { sold: true },
    });
  }

  res.json({ received: true });
};
