import { type IUser } from "../user/user.dto";
import { User } from "../user/user.schema";
import { decodeAccessToken, generateAccessTokenAndRefreshToken } from "../common/helper/jwt.helper";

import bcrypt from 'bcrypt';

export const createUser = async (data: IUser) => {
    const result = await User.create({ ...data });

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(result);

    result.refreshToken = refreshToken;

    await result.save();

    return { user: result, accessToken, refreshToken };
};

const isCorrectPassword = async (dbPassword: string, incomingPassword: string) => {
    console.log("dbPassword: ", dbPassword);
    console.log("incomingPassword: ", incomingPassword);

    // const query = await bcrypt.compare(incomingPassword, dbPassword);
    const query = incomingPassword === dbPassword;

    if(query) return true;
    else return false;
}

export const getUserByLogin = async (data: IUser) => {
    const { email, password } = data;
    const user = await User.findOne({ email });
    
    if (!user) {
        throw new Error("User not found");
    }
    
    // Checking input password is correct or not...
    if(!await isCorrectPassword(user.password, password)){
        throw new Error("Invalid credentials");
    }
    
    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(user);

    return { user: user, accessToken, refreshToken };
};