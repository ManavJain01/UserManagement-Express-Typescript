import { type IUser } from "./user.dto";
import { User } from "./user.schema";
import { generateAccessTokenAndRefreshToken } from "../common/helper/jwt.helper";
import { sendEmail } from "../common/services/email.service";

export const createUser = async (data: IUser) => {
    const result = await User.create({ ...data });

    const { accessToken, refreshToken } = await generateAccessTokenAndRefreshToken(result, "userCreating");

    result.refreshToken = refreshToken;

    await result.save();

    const invitationLink = `http://localhost:3000/invite-user?token=${accessToken}`;

    // Step 4: Send email with user's credentials
    const mailOptions = {
        from: process.env.MAIL_USER!, // Replace with your sender email
        to: result.email,
        subject: "Welcome to Our Platform",
        text: `Hello ${result.name},\n\nYour account has been created successfully.\n\nCredentials:\nEmail: ${result.email}\nPassword: (set the password here ${invitationLink})\n\nThank you for joining us!\n\nBest Regards,\nYour Company`,
      };
  
      await sendEmail(mailOptions);

    return { user: result, accessToken, refreshToken };
};

export const updateUser = async (id: string, data: IUser) => {
    const result = await User.findOneAndUpdate({ _id: id }, data, {
        new: true,
    });
    return result;
};

export const editUser = async (id: string, data: Partial<IUser>) => {
    console.log("in edit:", data);
    console.log("id", id);
    
    
    const result = await User.findOneAndUpdate({ _id: id }, data);
    return result;
};

export const deleteUser = async (id: string) => {
    const result = await User.deleteOne({ _id: id });
    return result;
};

export const getUserById = async (id: string) => {
    const result = await User.findById(id).lean();
    return result;
};

export const getAllUser = async () => {
    const result = await User.find({}).lean();
    return result;
};
export const getUserByEmail = async (email: string) => {
    const result = await User.findOne({ email }).lean();
    return result;
}