import bcrypt from "bcryptjs";
import { UserModel } from "../models/auth.model";
import { IUser, LoginBody, AuthResponse } from "../types/auth.type";
import { generateToken } from "../helper/jwtHelper";

export const registerUser = async (data: IUser) => {
    const existing = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (existing) throw new Error("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await UserModel.create({
        fullName: data.fullName,
        email: data.email.toLowerCase(),
        password: hashedPassword,
    });

    const token = generateToken({ id: user._id, email: user.email });

    return {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        token,
    };
};

export const loginUser = async (data: LoginBody): Promise<AuthResponse> => {
    const user = await UserModel.findOne({ email: data.email.toLowerCase() });
    if (!user) throw new Error("Invalid credentials");

    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) throw new Error("Invalid credentials");

    const token = generateToken({ id: user._id, fullName: user.fullName, email: user.email });

    return {
        _id: user._id.toString(),
        fullName: user.fullName,
        email: user.email,
        token,
    };
};
