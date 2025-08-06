import { Types } from "mongoose";

export enum WalletStatus {
    ACTIVE = "active",
    BLOCKED = "blocked",
    SUSPENDED = "suspended"
}

export interface IWallet {
    _id?: Types.ObjectId;
    userId: Types.ObjectId;
    balance: number;
    status: WalletStatus;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
} 