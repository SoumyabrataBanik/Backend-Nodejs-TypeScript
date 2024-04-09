import express from "express";
import { Request } from "express";
import { UserSchemaType } from "../models/user.models";

declare global {
    namespace Express {
        export interface Request {
            user: UserSchemaType;
        }
    }
}
