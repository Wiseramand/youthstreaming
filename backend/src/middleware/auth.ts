import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  const token = header?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Token ausente" });
  }

  try {
    const secret = process.env.JWT_SECRET ?? "";
    const payload = jwt.verify(token, secret) as { id: string; role: string };
    req.user = { id: payload.id, role: payload.role };
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const authorizeAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== "ADMIN") {
    return res.status(403).json({ message: "Acesso negado" });
  }
  return next();
};