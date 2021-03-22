import jwt from "jsonwebtoken";
import { Response, Request, NextFunction } from "express";
import { promisify } from "util";

interface DecodedJwt {
  id: number;
  iat: number;
  exp: number;
}

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer")
    return res.status(400).json({ message: "Token Invalid" });

  try {
    const decoded = await promisify(jwt.verify)(token, "secret");
    req.userId = decoded.id;

    return next();
  } catch (err) {
    return res.status(401).send({ error: "Token invalid" });
  }
};

export default authMiddleware;
