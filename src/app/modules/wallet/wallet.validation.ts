import { z } from "zod";

const addMoney = z.object({
    body: z.object({
        amount: z.number().positive("Amount must be positive")
    })
});

const withdrawMoney = z.object({
    body: z.object({
        amount: z.number().positive("Amount must be positive")
    })
});

const sendMoney = z.object({
    body: z.object({
        receiverId: z.string().min(1, "Receiver ID is required"),
        amount: z.number().positive("Amount must be positive")
    })
});

const cashIn = z.object({
    body: z.object({
        userId: z.string().min(1, "User ID is required"),
        amount: z.number().positive("Amount must be positive")
    })
});

const cashOut = z.object({
    body: z.object({
        userId: z.string().min(1, "User ID is required"),
        amount: z.number().positive("Amount must be positive")
    })
});

const createWallet = z.object({
    body: z.object({
        userId: z.string().min(1, "User ID is required")
    })
});

export const walletValidation = {
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    createWallet
}; 