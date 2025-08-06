import { Request, Response } from "express";
import { Types } from "mongoose";
import { TransactionService } from "./transaction.service";
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

const getMyTransactionHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = (req as AuthenticatedRequest).user?.userId;
    
    if (!userId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "User not authenticated",
            data: null
        });
    }
    
    const result = await TransactionService.getTransactionHistory(new Types.ObjectId(userId));
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Transaction history retrieved successfully",
        data: result
    });
});

const getAgentCommissionHistory = catchAsync(async (req: Request, res: Response) => {
    const agentId = (req as AuthenticatedRequest).user?.userId;
    
    if (!agentId) {
        return sendResponse(res, {
            statusCode: httpStatus.UNAUTHORIZED,
            success: false,
            message: "Agent not authenticated",
            data: null
        });
    }
    
    const result = await TransactionService.getAgentCommissionHistory(new Types.ObjectId(agentId));
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Commission history retrieved successfully",
        data: result
    });
});

const getAllTransactions = catchAsync(async (req: Request, res: Response) => {
    const result = await TransactionService.getAllTransactions();
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All transactions retrieved successfully",
        data: result
    });
});

export const TransactionController = {
    getMyTransactionHistory,
    getAgentCommissionHistory,
    getAllTransactions
}; 