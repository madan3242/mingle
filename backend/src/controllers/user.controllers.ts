import { NextFunction, Request, Response } from "express";
import { AsyncHandler } from "../utils/AsyncHandler";
import { ApiError } from "../utils/ApiError";

export const signup = AsyncHandler(async (req: Request, res: Response, next: NextFunction)  => {
    const { username, email, password } = req.body;
});

export const login = AsyncHandler(async (req: Request, res: Response, next: NextFunction)  => {
    const { username, password } = req.body;
});