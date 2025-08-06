import express from "express";
import { TransactionController } from "./transaction.controller";
import { auth } from "../../middlewares/auth";
import { Role } from "../user/user.interface";

const router = express.Router();

// User and Agent routes
router.get("/my-history", auth(Role.USER, Role.AGENT), TransactionController.getMyTransactionHistory);

// Agent routes
router.get("/commission-history", auth(Role.AGENT), TransactionController.getAgentCommissionHistory);

// Admin routes
router.get("/all", auth(Role.ADMIN), TransactionController.getAllTransactions);

export const TransactionRoutes = router; 