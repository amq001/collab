import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    res.cookie("jwt", token, {
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
        httpOnly: true, // prevent client-side JavaScript from accessing the cookie - cross-site scripting (XSS) attacks
        sameSite: "strict", // prevent the browser from sending this cookie along with cross-site requests - cross-site request forgery (CSRF) attacks
        secure: process.env.NODE_ENV === "production"
    });

    return token;
}