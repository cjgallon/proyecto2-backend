import express from "express";
import { authenticateToken } from "../auth/auth_token";
import {
  createOrder,
  getOrderById,
  getOrderbyDateAndUser,
  updatedOrder
} from "./Order.controller";

const router = express.Router();

router.post("/", authenticateToken, createOrder);

router.get("/ById/:_id", authenticateToken, getOrderById);

//Ruta para obtener un producto según la categoría, el usuario y/o el texto de búsqueda
router.get("/ByDateAndUser", authenticateToken, getOrderbyDateAndUser);

router.patch("/:_id", authenticateToken, updatedOrder);

export default router;
