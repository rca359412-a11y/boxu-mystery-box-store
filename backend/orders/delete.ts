import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("postgres");

export interface DeleteOrderRequest {
  id: number;
}

// Delete an order
export const deleteOrder = api<DeleteOrderRequest, void>(
  { expose: true, method: "DELETE", path: "/orders/:id" },
  async (req) => {
    const result = await db.exec`DELETE FROM orders WHERE id = ${req.id}`;
    
    // Note: Since SQLDatabase.exec doesn't return affected rows count,
    // we'll assume the operation succeeded if no error was thrown
  }
);
