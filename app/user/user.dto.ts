import { type BaseSchema } from "../common/dto/base.dto";

export interface IUser extends BaseSchema {
        name: string;
        email: string;
        role: "USER" | "ADMIN";
        password: string,
        isBlock: boolean,
        sessions: Array<string>,
        refreshToken: string
}

export interface IUserDetails extends BaseSchema {
        userId: object
        isOnboard: boolean,
        isKycComplete: boolean,
        twoFactorEnabled: boolean,
        documents: Array<string>
}