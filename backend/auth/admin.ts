import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { secret } from "encore.dev/config";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const db = SQLDatabase.named("postgres");
const jwtSecret = secret("JWTSecret");

export interface AdminLoginRequest {
  username: string;
  password: string;
}

export interface AdminLoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

// Admin login endpoint
export const adminLogin = api<AdminLoginRequest, AdminLoginResponse>(
  { expose: true, method: "POST", path: "/admin/login" },
  async (req) => {
    const admin = await db.queryRow<{
      id: number;
      username: string;
      password_hash: string;
      role: string;
    }>`
      SELECT id, username, password_hash, role 
      FROM admins 
      WHERE username = ${req.username} AND active = true
    `;

    if (!admin) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    const isValid = await bcrypt.compare(req.password, admin.password_hash);
    if (!isValid) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    const token = jwt.sign(
      { adminId: admin.id, username: admin.username, role: admin.role },
      jwtSecret(),
      { expiresIn: "24h" }
    );

    return {
      token,
      user: {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
    };
  }
);

export interface AdminTokenValidationResponse {
  valid: boolean;
  admin?: {
    id: number;
    username: string;
    role: string;
  };
}

// Validate admin token
export const validateAdminToken = api<{ token: string }, AdminTokenValidationResponse>(
  { expose: true, method: "POST", path: "/admin/validate" },
  async (req) => {
    try {
      const decoded = jwt.verify(req.token, jwtSecret()) as any;
      return {
        valid: true,
        admin: {
          id: decoded.adminId,
          username: decoded.username,
          role: decoded.role,
        },
      };
    } catch (error) {
      return { valid: false };
    }
  }
);
