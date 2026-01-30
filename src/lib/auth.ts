import jwt, { SignOptions } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is missing");

export function signToken(payload: object): string {
  const options: SignOptions = { expiresIn: "7d" };
  return jwt.sign(payload, JWT_SECRET!, options);
}

export function verifyToken(token: string): any {
  return jwt.verify(token, JWT_SECRET!, undefined);
}
