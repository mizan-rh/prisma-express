import { Router } from "express";
import { requireAuth } from "../../middleware/auth.middleware";
import {
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "./product.controller";

const router = Router();

router.get("/", listProducts);
router.get("/:id", getProduct);
router.post("/", requireAuth, createProduct);
router.put("/:id", requireAuth, updateProduct);
router.delete("/:id", requireAuth, deleteProduct);

export default router;
