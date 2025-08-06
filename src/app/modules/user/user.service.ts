import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { userSearchableFields } from "./user.constant";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import { WalletService } from "../wallet/wallet.service";

const createUser = async (payload: Partial<IUser>) => {
    const { email, password, ...rest } = payload;

    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User Already Exist")
    }

    const hashedPassword = await bcryptjs.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND))

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })

    // Create wallet for user and agent automatically
    if (user.role === Role.USER || user.role === Role.AGENT) {
        await WalletService.createWallet(user._id);
    }

    return user
}

const updateUser = async (userId: string, payload: Partial<IUser>, decodedToken: JwtPayload) => {

    if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
        if (userId !== decodedToken.userId) {
            throw new AppError(401, "You are not authorized")
        }
    }

    const ifUserExist = await User.findById(userId);

    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (decodedToken.role === Role.ADMIN && ifUserExist.role === Role.ADMIN) {
        throw new AppError(401, "You are not authorized")
    }

    /**
     * email - can not update
     * name, phone, password address
     * password - re hashing
     *  only admin - role, isDeleted...
     */

    if (payload.role) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified || payload.isApproved) {
        if (decodedToken.role === Role.USER || decodedToken.role === Role.AGENT) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized");
        }
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true })

    return newUpdatedUser
}


const getAllUsers = async (query: Record<string, string>) => {

    const queryBuilder = new QueryBuilder(User.find(), query)
    const usersData = queryBuilder
        .filter()
        .search(userSearchableFields)
        .sort()
        .fields()
        .paginate();

    const [data, meta] = await Promise.all([
        usersData.build(),
        queryBuilder.getMeta()
    ])

    return {
        data,
        meta
    }
};
const getSingleUser = async (id: string) => {
    const user = await User.findById(id).select("-password");
    return {
        data: user
    }
};
const getMe = async (userId: string) => {
    const user = await User.findById(userId).select("-password");
    return {
        data: user
    }
};

const approveAgent = async (agentId: string) => {
    const agent = await User.findById(agentId);
    
    if (!agent) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    
    if (agent.role !== Role.AGENT) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
    }
    
    agent.isApproved = true;
    await agent.save();
    
    return agent;
};

const suspendAgent = async (agentId: string) => {
    const agent = await User.findById(agentId);
    
    if (!agent) {
        throw new AppError(httpStatus.NOT_FOUND, "Agent not found");
    }
    
    if (agent.role !== Role.AGENT) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not an agent");
    }
    
    agent.isApproved = false;
    await agent.save();
    
    return agent;
};

const getAllAgents = async () => {
    const agents = await User.find({ role: Role.AGENT, isDeleted: false }).select("-password");
    return agents;
};

export const UserServices = {
    createUser,
    getAllUsers,
    getSingleUser,
    updateUser,
    getMe,
    approveAgent,
    suspendAgent,
    getAllAgents
}