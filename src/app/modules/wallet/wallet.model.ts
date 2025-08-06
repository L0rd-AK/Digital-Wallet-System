import { model, Schema } from "mongoose";
import { IWallet, WalletStatus } from "./wallet.interface";

const walletSchema = new Schema<IWallet>({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    balance: { type: Number, default: 50, min: 0 }, // Initial balance ৳50
    status: {
        type: String,
        enum: Object.values(WalletStatus),
        default: WalletStatus.ACTIVE
    },
    isDeleted: { type: Boolean, default: false }
}, {
    timestamps: true,
    versionKey: false
})

export const Wallet = model<IWallet>("Wallet", walletSchema) 