import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { secret } from "encore.dev/config";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

const db = SQLDatabase.named("postgres");
const jwtSecret = secret("JWTSecret");

export interface CustomerLoginRequest {
  email: string;
  password: string;
}

export interface CustomerLoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

// Customer login endpoint
export const customerLogin = api<CustomerLoginRequest, CustomerLoginResponse>(
  { expose: true, method: "POST", path: "/customer/login" },
  async (req) => {
    const customer = await db.queryRow<{
      id: number;
      email: string;
      name: string;
      password_hash: string;
    }>`
      SELECT id, email, name, password_hash 
      FROM customers 
      WHERE email = ${req.email}
    `;

    if (!customer) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    const isValid = await bcrypt.compare(req.password, customer.password_hash);
    if (!isValid) {
      throw APIError.unauthenticated("Invalid credentials");
    }

    const token = jwt.sign(
      { customerId: customer.id, email: customer.email },
      jwtSecret(),
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: customer.id,
        email: customer.email,
        name: customer.name,
      },
    };
  }
);
