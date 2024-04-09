import { Request } from "express";
import { UserModel, userSchema } from "../models/user.models";

export type UserSchemaType = typeof userSchema;

export interface IUserAuthInfoRequest extends Request {
    user: UserModel;
}
