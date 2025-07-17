import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { ENV } from "../../config/env";
import { prisma } from "../../config/prisma";

export const register = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { name, email, password: hashed, role },
  });

  const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET);
  res.json({ token });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, ENV.JWT_SECRET);
  res.json({ token });
};
