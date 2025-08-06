import { Types } from "mongoose";
import { Transaction } from "./transaction.model";
import { ITransaction, TransactionType, TransactionStatus } from "./transaction.interface";
import ApiError from "../../errorHelpers/ApiError";

const createTransaction = async (transactionData: Partial<ITransaction>): Promise<ITransaction> => {
    const transaction = await Transaction.create(transactionData);
    return transaction;
};

const getTransactionHistory = async (userId: Types.ObjectId): Promise<ITransaction[]> => {
    const transactions = await Transaction.find({
        $or: [
            { senderId: userId },
            { receiverId: userId },
            { agentId: userId }
        ],
        isDeleted: false
    })
    .populate("senderId", "name email")
    .populate("receiverId", "name email")
    .populate("agentId", "name email")
    .sort({ createdAt: -1 });

    return transactions;
};

const getAgentCommissionHistory = async (agentId: Types.ObjectId): Promise<ITransaction[]> => {
    const transactions = await Transaction.find({
        agentId,
        type: { $in: [TransactionType.CASH_IN, TransactionType.CASH_OUT] },
        isDeleted: false
    })
    .populate("senderId", "name email")
    .populate("receiverId", "name email")
    .sort({ createdAt: -1 });

    return transactions;
};

const getAllTransactions = async (): Promise<ITransaction[]> => {
    const transactions = await Transaction.find({ isDeleted: false })
        .populate("senderId", "name email role")
        .populate("receiverId", "name email role")
        .populate("agentId", "name email role")
        .sort({ createdAt: -1 });

    return transactions;
};

const recordAddMoneyTransaction = async (
    userId: Types.ObjectId,
    amount: number
): Promise<ITransaction> => {
    return await createTransaction({
        receiverId: userId,
        amount,
        type: TransactionType.ADD_MONEY,
        description: "Money added to wallet"
    });
};

const recordWithdrawTransaction = async (
    userId: Types.ObjectId,
    amount: number
): Promise<ITransaction> => {
    return await createTransaction({
        senderId: userId,
        amount,
        type: TransactionType.WITHDRAW,
        description: "Money withdrawn from wallet"
    });
};

const recordSendMoneyTransaction = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    amount: number
): Promise<ITransaction> => {
    return await createTransaction({
        senderId,
        receiverId,
        amount,
        type: TransactionType.SEND_MONEY,
        description: "Money sent to another user"
    });
};

const recordReceiveMoneyTransaction = async (
    senderId: Types.ObjectId,
    receiverId: Types.ObjectId,
    amount: number
): Promise<ITransaction> => {
    return await createTransaction({
        senderId,
        receiverId,
        amount,
        type: TransactionType.RECEIVE_MONEY,
        description: "Money received from another user"
    });
};

const recordCashInTransaction = async (
    agentId: Types.ObjectId,
    userId: Types.ObjectId,
    amount: number,
    commission: number
): Promise<ITransaction> => {
    return await createTransaction({
        agentId,
        receiverId: userId,
        amount,
        commission,
        type: TransactionType.CASH_IN,
        description: "Cash-in by agent"
    });
};

const recordCashOutTransaction = async (
    agentId: Types.ObjectId,
    userId: Types.ObjectId,
    amount: number,
    commission: number
): Promise<ITransaction> => {
    return await createTransaction({
        agentId,
        senderId: userId,
        amount,
        commission,
        type: TransactionType.CASH_OUT,
        description: "Cash-out by agent"
    });
};

export const TransactionService = {
    createTransaction,
    getTransactionHistory,
    getAgentCommissionHistory,
    getAllTransactions,
    recordAddMoneyTransaction,
    recordWithdrawTransaction,
    recordSendMoneyTransaction,
    recordReceiveMoneyTransaction,
    recordCashInTransaction,
    recordCashOutTransaction
}; 