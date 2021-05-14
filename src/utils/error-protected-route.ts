import { NextFunction, Request, Response } from "express";
import ApiError from "./api-error";

export default function ErrorProtectedRoute(fn: (req: Request, res: Response,next: NextFunction) => Promise<any>) {
    return (req: Request, res: Response, next: NextFunction) => {
        (async () => {                                                       //WHY ASYNC?
            await fn(req, res,next)
        })().catch((err) => {
            if(err.name === "ApiError"){
                next(err)
            }
            else{
                let error = new ApiError("unknown-error", err.message, 500 )
                next(error)
            }
        })
    }
}