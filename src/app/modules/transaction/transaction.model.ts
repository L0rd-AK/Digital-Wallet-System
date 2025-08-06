import { model, Schema } from "mongoose";
import { ITransaction, TransactionType, TransactionStatus } from "./transaction.interface";

const transactionSchema = new Schema<ITransaction>({
    senderId: { type: Schema.Types.ObjectId, ref: "User" },
    receiverId: { type: Schema.Types.ObjectId, ref: "User" },
    agentId: { type: Schema.Types.ObjectId, ref: "User" },
    amount: { type: Number, required: true, min: 0 },
    fee: { type: Number, default: 0, min: 0 },
    commission: { type: Number, default: 0, min: 0 },
    type: {
        type: String,
        enum: Object.values(TransactionType),
        required: true
    },
    status: {
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.COMPLETED
    },
    description: { type: String },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

export const Transaction = model<ITransaction>("Transaction", transactionSchema) 