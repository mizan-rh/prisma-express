import { Request, Response } from "express";
import { prisma } from "../../config/prisma";
import { AuthRequest } from "../../middleware/auth.middleware";

export const listProducts = async (_: Request, res: Response) => {
  const products = await prisma.product.findMany({ include: { seller: true } });
  res.json(products);
};

export const getProduct = async (req: Request, res: Response) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { seller: true },
  });
  res.json(product);
};

export const createProduct = async (req: AuthRequest, res: Response) => {
  const product = await prisma.product.create({
    data: { ...req.body, sellerId: req.user.id },
  });
  res.status(201).json(product);
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (
    !existing ||
    (existing.sellerId !== req.user.id && req.user.role !== "ADMIN")
  )
    return res.status(403).json({ error: "Forbidden" });

  const updated = await prisma.product.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json(updated);
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
  const existing = await prisma.product.findUnique({
    where: { id: req.params.id },
  });
  if (
    !existing ||
    (existing.sellerId !== req.user.id && req.user.role !== "ADMIN")
  )
    return res.status(403).json({ error: "Forbidden" });

  await prisma.product.delete({ where: { id: req.params.id } });
  res.status(204).end();
};
