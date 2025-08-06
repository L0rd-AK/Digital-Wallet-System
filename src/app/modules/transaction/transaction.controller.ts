import { Request, Response } from "express";
import { TransactionService } from "./transaction.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status-codes";

const getMyTransactionHistory = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const result = await TransactionService.getTransactionHistory(userId);
    
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Transaction history retrieved successfully",
        data: result
    });
});

const getAgentCommissionHistory = catchAsync(async (req: Request, res: Response) => {
    const agentId = req.user?.id;
    const result = await TransactionService.getAgentCommissionHistory(agentId);
    
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