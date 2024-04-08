import { Request, Response, NextFunction } from "express";

// export type AsyncHandlerProps = {
//     fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>;
// };

export type RequestHandlerProps = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<unknown>;

const asyncHandler = (requestHandler: RequestHandlerProps) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) =>
            next(err)
        );
    };
};

export { asyncHandler };

// const asyncHandler =
//     (fn: AsyncHandlerProps["fn"]) =>
//     async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await fn(req, res, next);
//         } catch (error: unknown) {
//             let err = error as { message: string; code?: number };
//             if (err.code) {
//                 res.status(err.code).json({
//                     success: false,
//                     message: err.message,
//                 });
//             } else {
//                 res.status(500).json({
//                     success: false,
//                     message: err.message,
//                 });
//             }
//         }
//     };
