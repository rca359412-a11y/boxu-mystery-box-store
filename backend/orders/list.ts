import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";
import { Query } from "encore.dev/api";

const db = SQLDatabase.named("postgres");

export interface ListOrdersRequest {
  status?: Query<string>;
  page?: Query<number>;
  limit?: Query<number>;
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

export interface ListOrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

// List all orders with pagination and filtering
export const list = api<ListOrdersRequest, ListOrdersResponse>(
  { expose: true, method: "GET", path: "/orders" },
  async (req) => {
    const page = req.page || 1;
    const limit = req.limit || 20;
    const offset = (page - 1) * limit;

    let whereClause = "";
    const params: any[] = [];

    if (req.status) {
      whereClause = "WHERE status = $1";
      params.push(req.status);
    }

    const countQuery = `SELECT COUNT(*) as total FROM orders ${whereClause}`;
    const totalResult = await db.rawQueryRow<{ total: number }>(countQuery, ...params);
    const total = totalResult?.total || 0;

    const ordersQuery = `
      SELECT id, customer_name as "customerName", phone, governorate, address, 
             product_id as "productId", product_price as "productPrice", 
             shipping_price as "shippingPrice", total_price as "totalPrice",
             status, created_at as "createdAt"
      FROM orders 
      ${whereClause}
      ORDER BY created_at DESC 
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `;

    const orders: Order[] = [];
    for await (const order of db.rawQuery<Order>(ordersQuery, ...params, limit, offset)) {
      orders.push(order);
    }

    return {
      orders,
      total,
      page,
      limit,
    };
  }
);
