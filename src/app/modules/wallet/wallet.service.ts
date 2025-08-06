import { Types } from "mongoose";
import { Wallet } from "./wallet.model";
import { IWallet, WalletStatus } from "./wallet.interface";
import ApiError from "../../errorHelpers/ApiError";

const createWallet = async (userId: Types.ObjectId): Promise<IWallet> => {
    const existingWallet = await Wallet.findOne({ userId, isDeleted: false });
    if (existingWallet) {
        throw new ApiError(400, "Wallet already exists for this user");
    }

    const wallet = await Wallet.create({
        userId,
        balance: 50, // Initial balance ৳50
        status: WalletStatus.ACTIVE
    });

    return wallet;
};

const getWalletByUserId = async (userId: Types.ObjectId): Promise<IWallet | null> => {
    const wallet = await Wallet.findOne({ userId, isDeleted: false });
    return wallet;
};

const updateWalletBalance = async (
    userId: Types.ObjectId,
    amount: number,
    operation: "add" | "subtract"
): Promise<IWallet> => {
    const wallet = await Wallet.findOne({ userId, isDeleted: false });
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    if (wallet.status !== WalletStatus.ACTIVE) {
        throw new ApiError(400, "Wallet is blocked or suspended");
    }

    if (operation === "subtract" && wallet.balance < amount) {
        throw new ApiError(400, "Insufficient balance");
    }

    const newBalance = operation === "add" 
        ? wallet.balance + amount 
        : wallet.balance - amount;

    if (newBalance < 0) {
        throw new ApiError(400, "Insufficient balance");
    }

    wallet.balance = newBalance;
    await wallet.save();

    return wallet;
};

const blockWallet = async (userId: Types.ObjectId): Promise<IWallet> => {
    const wallet = await Wallet.findOne({ userId, isDeleted: false });
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    wallet.status = WalletStatus.BLOCKED;
    await wallet.save();

    return wallet;
};

const unblockWallet = async (userId: Types.ObjectId): Promise<IWallet> => {
    const wallet = await Wallet.findOne({ userId, isDeleted: false });
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    wallet.status = WalletStatus.ACTIVE;
    await wallet.save();

    return wallet;
};

const getAllWallets = async (): Promise<IWallet[]> => {
    const wallets = await Wallet.find({ isDeleted: false }).populate("userId", "name email role");
    return wallets;
};

const getWalletBalance = async (userId: Types.ObjectId): Promise<number> => {
    const wallet = await Wallet.findOne({ userId, isDeleted: false });
    if (!wallet) {
        throw new ApiError(404, "Wallet not found");
    }

    return wallet.balance;
};

export const WalletService = {
    createWallet,
    getWalletByUserId,
    updateWalletBalance,
    blockWallet,
    unblockWallet,
    getAllWallets,
    getWalletBalance
}; 