import { ApiErrors } from "./ApiErrors";

export function validateEmail(email: string) {
    if (email.includes("@")) {
        return true;
    }
    return false;
}

export function throwError(field: string) {
    throw new ApiErrors(400, `${field} is required. Can't be empty`);
}
