import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendResponse from "../utils/response.js";
import bcrypt from "bcrypt";
dotenv.config({ quiet: true });
export const signUp = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = new User({
      name,
      email,
      password,
      role,
    });
    const newUser = await user.save();
    //generate the new token
    const token = jwt.sign(
      {
        email: newUser.email,
        name: newUser.name,
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    const data = {
      user: newUser,
      token,
    };
    return sendResponse(res, true, "signUp successfully", data);
  } catch (error) {
    return sendResponse(res, false, error.message, null, 500);
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return sendResponse(res, false, "user is not found", null, 404);
    }
    const isMatch = await bcrypt.compare(password, user.password ?? "");
    if (!isMatch) {
      return sendResponse(
        res,
        false,
        "Email/password do not match ",
        null,
        404
      );
    }
    const token = jwt.sign(
      {
        email: user.email,
        name: user.name,
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRY }
    );
    const data = {
      user,
      token,
    };
    return sendResponse(res, true, "user LoggedIn successfully", data);
  } catch (error) {
    return sendResponse(res, false, error.message, null, 500);
  }
};
