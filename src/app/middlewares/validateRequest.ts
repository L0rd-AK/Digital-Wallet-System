import { NextFunction, Request, Response } from "express"
import { AnyZodObject } from "zod"

export const validateRequest = (zodSchema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Parse and validate the entire request object (body, params, query)
        await zodSchema.parseAsync({
            body: req.body,
            params: req.params,
            query: req.query
        })
        next()
    } catch (error) {
        next(error)
    }
}