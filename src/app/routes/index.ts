import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";
import { AuthRoutes } from "../modules/auth/auth.route";
import { WalletRoutes } from "../modules/wallet/wallet.route";
import { TransactionRoutes } from "../modules/transaction/transaction.route";

const router = Router();

// Auth routes
router.use("/auth", AuthRoutes);

// User routes
router.use("/users", UserRoutes);

// Wallet routes
router.use("/wallets", WalletRoutes);

// Transaction routes
router.use("/transactions", TransactionRoutes);

export { router };