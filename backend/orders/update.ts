import { api, APIError } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("postgres");

export interface UpdateOrderRequest {
  id: number;
  status?: string;
  customerName?: string;
  phone?: string;
  governorate?: string;
  address?: string;
}

export interface Order {
  id: number;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  productId: number;
  productPrice: number;
  shippingPrice: number;
  totalPrice: number;
  status: string;
  createdAt: Date;
}

export interface UpdateOrderResponse {
  order: Order;
}

// Update an order
export const update = api<UpdateOrderRequest, UpdateOrderResponse>(
  { expose: true, method: "PUT", path: "/orders/:id" },
  async (req) => {
    const updates: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (req.status) {
      updates.push(`status = $${paramIndex++}`);
      params.push(req.status);
    }
    if (req.customerName) {
      updates.push(`customer_name = $${paramIndex++}`);
      params.push(req.customerName);
    }
    if (req.phone) {
      updates.push(`phone = $${paramIndex++}`);
      params.push(req.phone);
    }
    if (req.governorate) {
      updates.push(`governorate = $${paramIndex++}`);
      params.push(req.governorate);
    }
    if (req.address) {
      updates.push(`address = $${paramIndex++}`);
      params.push(req.address);
    }

    if (updates.length === 0) {
      throw APIError.invalidArgument("No fields to update");
    }

    params.push(req.id);

    const query = `
      UPDATE orders 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, customer_name as "customerName", phone, governorate, address, 
                product_id as "productId", product_price as "productPrice", 
                shipping_price as "shippingPrice", total_price as "totalPrice",
                status, created_at as "createdAt"
    `;

    const order = await db.rawQueryRow<Order>(query, ...params);

    if (!order) {
      throw APIError.notFound("Order not found");
    }

    return { order };
  }
);
