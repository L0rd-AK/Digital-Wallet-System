import express from "express";
import { TransactionController } from "./transaction.controller";
import { auth } from "../../middlewares/auth";

const router = express.Router();

// User and Agent routes
router.get("/my-history", auth("user", "agent"), TransactionController.getMyTransactionHistory);

// Agent routes
router.get("/commission-history", auth("agent"), TransactionController.getAgentCommissionHistory);

// Admin routes
router.get("/all", auth("admin"), TransactionController.getAllTransactions);

export const TransactionRoutes = router; 