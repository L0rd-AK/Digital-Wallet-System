import { Types } from "mongoose";

export enum Role {
    ADMIN = "admin",
    USER = "user",
    AGENT = "agent",
}

//auth providers
/**
 * email, password authentication
 */

export interface IAuthProvider {
    provider: "credentials";
    providerId: string;
}

export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}

export interface IUser {
    _id?: Types.ObjectId
    userId?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    auths: IAuthProvider[];
    // Agent specific fields
    commissionRate?: number;
    isApproved?: boolean;
    createdAt?: Date
}