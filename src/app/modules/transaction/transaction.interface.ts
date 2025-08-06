import { Types } from "mongoose";

export enum TransactionType {
    ADD_MONEY = "add_money",
    WITHDRAW = "withdraw",
    SEND_MONEY = "send_money",
    RECEIVE_MONEY = "receive_money",
    CASH_IN = "cash_in",
    CASH_OUT = "cash_out"
}

export enum TransactionStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed",
    REVERSED = "reversed"
}

export interface ITransaction {
    _id?: Types.ObjectId;
    senderId?: Types.ObjectId;
    receiverId?: Types.ObjectId;
    agentId?: Types.ObjectId;
    amount: number;
    fee?: number;
    commission?: number;
    type: TransactionType;
    status: TransactionStatus;
    description?: string;
    isDeleted?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
} 