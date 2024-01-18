import jwt from "jsonwebtoken";
import ENV from "../config.js";

export default async function auth(req, res, next) {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedtoken = await jwt.verify(token, ENV.JWT_SECRET);
    req.user = decodedtoken;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Authentication failed" });
  }
}
export async function localvariable(req, res, next) {
  req.app.locals = {
    OTP: null,
    resetsession: false,
  };
  next();
}
