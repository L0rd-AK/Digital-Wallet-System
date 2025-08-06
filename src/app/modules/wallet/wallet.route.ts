import express from "express";
import { WalletController } from "./wallet.controller";
import { auth } from "../../middlewares/auth";
import { validateRequest } from "../../middlewares/validateRequest";
import { walletValidation } from "./wallet.validation";
import { Role } from "../user/user.interface";

const router = express.Router();

// User routes - users can only access their own wallet
router.get("/my-wallet/", auth(Role.USER, Role.AGENT, Role.ADMIN), WalletController.getMyWallet);
router.get("/balance", auth(Role.USER, Role.AGENT, Role.ADMIN), WalletController.getWalletBalance);
router.post("/add-money", auth(Role.USER), validateRequest(walletValidation.addMoney), WalletController.addMoney);
router.post("/withdraw", auth(Role.USER), validateRequest(walletValidation.withdrawMoney), WalletController.withdrawMoney);
router.post("/send-money", auth(Role.USER), validateRequest(walletValidation.sendMoney), WalletController.sendMoney);


// Admin/Agent routes - access to other users' wallets
router.get("/user/:userId", auth(Role.AGENT, Role.ADMIN), WalletController.getUserWallet);
router.get("/user/:userId/balance", auth(Role.AGENT, Role.ADMIN), WalletController.getUserWalletBalance);

// Agent routes
router.post("/cash-in", auth(Role.AGENT), validateRequest(walletValidation.cashIn), WalletController.cashIn);
router.post("/cash-out", auth(Role.AGENT), validateRequest(walletValidation.cashOut), WalletController.cashOut);

// Admin routes
router.get("/all", auth(Role.ADMIN), WalletController.getAllWallets);
router.patch("/block/:userId", auth(Role.ADMIN), WalletController.blockWallet);
router.patch("/unblock/:userId", auth(Role.ADMIN), WalletController.unblockWallet);
router.post("/create", auth(Role.ADMIN), validateRequest(walletValidation.createWallet), WalletController.createWallet);

export const WalletRoutes = router; 