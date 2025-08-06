import { JwtPayload } from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload {
    userId: string;
    email: string;
    role: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: CustomJwtPayload;
        }
    }
}