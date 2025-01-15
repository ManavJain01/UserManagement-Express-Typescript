
import mongoose, { model } from "mongoose";
import { type IUser, type IUserDetails } from "./user.dto";
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

const hashPassword = async (password: string) => {
        const hash = await bcrypt.hash(password, 12);
        return hash;
};

const UserSchema = new Schema<IUser>({
        name: { type: String, required: true },
        email: { type: String, required: true },
        role: { type: String, required: true, enum: ["USER", "ADMIN"], default: "USER" },
        password: { type: String, required: true },
        refreshToken: { type: String },
        isBlock: { type: Boolean, required: true, default: false },
        sessions: { type: [String], required: true }
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
        // if (this.password) {
        //         this.password = await hashPassword(this.password);
        // }
        next();
});



const UserDetailSchema = new Schema<IUserDetails>({
        userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
        isOnboard: { type: Boolean, required: true, default: false },
        isKycComplete: { type: Boolean, required: true, default: false },
        twoFactorEnabled: { type: Boolean, required: true, default: false },
        documents: { type: [String], required: true },
}, { timestamps: true });

UserDetailSchema.pre("save", async function (next) {
        next();
});


// Exporting models
const User = model<IUser>("User", UserSchema);
const UserDetails = model<IUserDetails>("UserDetails", UserDetailSchema);

export { User, UserDetails };