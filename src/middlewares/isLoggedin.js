import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import sendResponse from "../utils/response.js";
dotenv.config({ quiet: true });

const isLoggedIn = async (req, res, next) => {
  try {
    const bearerToken = req?.headers?.authorization;
    if (!bearerToken) {
      return sendResponse(res, false, "user is not logged in", null, 500);
    }
    const token = bearerToken.split(" ")[1];
    const decodedUser = jwt.verify(
      token,
      process.env.JWT_SECRET_KEY,
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            return sendResponse(res, false, "Token expired", null, 401);
          }
          return sendResponse(res, false, "User not found", null, 401);
        } else {
          return decoded;
        }
      }
    );
    req.user = {
      id: decodedUser.id,
      email: decodedUser.email,
    };

    next();
  } catch (error) {
    return sendResponse(res, false, "Invalid or expired token", null, 401);
  }
};
export default isLoggedIn;
