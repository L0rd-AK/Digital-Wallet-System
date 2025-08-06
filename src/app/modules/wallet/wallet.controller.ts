import { Request, Response } from "express";
import { Types } from "mongoose";
import { WalletService } from "./wallet.service";
import { TransactionService } from "../transaction/transaction.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

// Define the extended Request type
interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}

const createWallet = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.body;
    const result = await WalletService.createWallet(userId);
    
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Wallet created successfully",
        data: result
    });
});

const getMyWallet = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user?.userId;
    const currentUserRole = (req as AuthenticatedRequest).user?.role;
    
    // Check if trying to access another user's wallet via URL params
    const requestedUserId = req.params.userId;
    if (requestedUserId && requestedUserId !== userId) {
        // Only admin and agent can access other users' wallets
        if (currentUserRole !== "admin" && currentUserRole !== "agent") {
            return sendResponse(res, {
                statusCode: httpStatus.FORBIDDEN,
                success: false,
                message: "You don't have permission to access other users' wallet",
                data: null
            });
        }
        // Use the requested userId for admin/agent
        const result = await WalletService.getWalletByUserId(new Types.ObjectId(requestedUserId));
        
        if (!result) {
            return sendResponse(res, {
                statusCode: httpStatus.NOT_FOUND,
                success: false,
                message: "Wallet not found",
                data: null
            });
        }
        
        return sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: "User wallet retrieved successfully",
            data: result
        });
    }
    
    // Regular flow - user accessing their own wallet
    const result = await WalletService.getWalletByUserId(new Types.ObjectId(userId));
    
    if (!result) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Wallet not found",
            data: null
        });
    }
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet retrieved successfully",
        data: result
    });
});

const addMoney = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    const userId = (req as AuthenticatedRequest).user?.userId;
    
    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null
        });
    }
    
    if (!amount || amount <= 0) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid amount",
            data: null
        });
    }
    
    const result = await WalletService.updateWalletBalance(new Types.ObjectId(userId), amount, "add");
    
    // Record transaction
    await TransactionService.recordAddMoneyTransaction(new Types.ObjectId(userId), amount);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Money added successfully",
        data: result
    });
});

const withdrawMoney = catchAsync(async (req: Request, res: Response) => {
    const { amount } = req.body;
    const userId = (req as AuthenticatedRequest).user?.userId;
    
    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null
        });
    }
    
    if (!amount || amount <= 0) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid amount",
            data: null
        });
    }
    
    const result = await WalletService.updateWalletBalance(new Types.ObjectId(userId), amount, "subtract");
    
    // Record transaction
    await TransactionService.recordWithdrawTransaction(new Types.ObjectId(userId), amount);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Money withdrawn successfully",
        data: result
    });
});

const sendMoney = catchAsync(async (req: Request, res: Response) => {
    const { receiverId, amount } = req.body;
    const senderId = (req as AuthenticatedRequest).user?.userId;
    
    if (!senderId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null
        });
    }
    
    if (!amount || amount <= 0) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid amount",
            data: null
        });
    }
    
    if (!receiverId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Receiver ID is required",
            data: null
        });
    }
    
    // First subtract from sender
    await WalletService.updateWalletBalance(new Types.ObjectId(senderId), amount, "subtract");
    
    // Then add to receiver
    const result = await WalletService.updateWalletBalance(new Types.ObjectId(receiverId), amount, "add");
    
    // Record transactions
    await TransactionService.recordSendMoneyTransaction(new Types.ObjectId(senderId), new Types.ObjectId(receiverId), amount);
    await TransactionService.recordReceiveMoneyTransaction(new Types.ObjectId(senderId), new Types.ObjectId(receiverId), amount);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Money sent successfully",
        data: result
    });
});

const cashIn = catchAsync(async (req: Request, res: Response) => {
    const { userId, amount } = req.body;
    const agentId = (req as AuthenticatedRequest).user?.userId;
    
    if (!agentId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Agent not authenticated",
            data: null
        });
    }
    
    if (!amount || amount <= 0) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid amount",
            data: null
        });
    }
    
    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "User ID is required",
            data: null
        });
    }
    
    const result = await WalletService.updateWalletBalance(new Types.ObjectId(userId), amount, "add");
    
    // Calculate commission (2% of amount)
    const commission = amount * 0.02;
    
    // Record transaction
    await TransactionService.recordCashInTransaction(new Types.ObjectId(agentId), new Types.ObjectId(userId), amount, commission);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cash-in completed successfully",
        data: result
    });
});

const cashOut = catchAsync(async (req: Request, res: Response) => {
    const { userId, amount } = req.body;
    const agentId = (req as AuthenticatedRequest).user?.userId;
    
    if (!agentId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Agent not authenticated",
            data: null
        });
    }
    
    if (!amount || amount <= 0) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "Invalid amount",
            data: null
        });
    }
    
    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.BAD_REQUEST,
            success: false,
            message: "User ID is required",
            data: null
        });
    }
    
    const result = await WalletService.updateWalletBalance(new Types.ObjectId(userId), amount, "subtract");
    
    // Calculate commission (2% of amount)
    const commission = amount * 0.02;
    
    // Record transaction
    await TransactionService.recordCashOutTransaction(new Types.ObjectId(agentId), new Types.ObjectId(userId), amount, commission);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Cash-out completed successfully",
        data: result
    });
});

const blockWallet = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await WalletService.blockWallet(new Types.ObjectId(userId));
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet blocked successfully",
        data: result
    });
});

const unblockWallet = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const result = await WalletService.unblockWallet(new Types.ObjectId(userId));
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet unblocked successfully",
        data: result
    });
});

const getAllWallets = catchAsync(async (req: Request, res: Response) => {
    const result = await WalletService.getAllWallets();
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All wallets retrieved successfully",
        data: result
    });
});

const getWalletBalance = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user?.userId;
    
    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null
        });
    }
    
    const balance = await WalletService.getWalletBalance(new Types.ObjectId(userId));
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Wallet balance retrieved successfully",
        data: { balance }
    });
});

// Admin/Agent only - Get any user's wallet balance
const getUserWalletBalance = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const currentUserRole = (req as AuthenticatedRequest).user?.role;
    
    // Only admin and agent can access other users' wallet balance
    if (currentUserRole !== "admin" && currentUserRole !== "agent") {
        return sendResponse(res, {
            statusCode: httpStatus.FORBIDDEN,
            success: false,
            message: "You don't have permission to access other users' wallet balance",
            data: null
        });
    }
    
    const balance = await WalletService.getWalletBalance(new Types.ObjectId(userId));
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User wallet balance retrieved successfully",
        data: { balance }
    });
});

// Admin/Agent only - Get any user's wallet details
const getUserWallet = catchAsync(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const currentUserRole = (req as AuthenticatedRequest).user?.role;
    
    // Only admin and agent can access other users' wallet details
    if (currentUserRole !== "admin" && currentUserRole !== "agent") {
        return sendResponse(res, {
            statusCode: httpStatus.FORBIDDEN,
            success: false,
            message: "You don't have permission to access other users' wallet details",
            data: null
        });
    }
    
    const result = await WalletService.getWalletByUserId(new Types.ObjectId(userId));
    
    if (!result) {
        return sendResponse(res, {
            statusCode: httpStatus.NOT_FOUND,
            success: false,
            message: "Wallet not found",
            data: null
        });
    }
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User wallet retrieved successfully",
        data: result
    });
});

export const WalletController = {
    createWallet,
    getMyWallet,
    addMoney,
    withdrawMoney,
    sendMoney,
    cashIn,
    cashOut,
    blockWallet,
    unblockWallet,
    getAllWallets,
    getWalletBalance,
    getUserWalletBalance,
    getUserWallet
}; 