import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
    const {JWT_SECRET,NODE_ENV} = ENV;
    if (!JWT_SECRET) {
      throw new Error('JWT_SECRET is not defined in environment variables');
    }
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // prevent client-side JavaScript from accessing the cookie - cross-site scripting (XSS) attacks
        sameSite: "strict", // prevent the browser from sending this cookie along with cross-site requests - cross-site request forgery (CSRF) attacks
        secure: NODE_ENV === "production"
    });
    return token;
}