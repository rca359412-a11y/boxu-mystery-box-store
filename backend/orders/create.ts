import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("postgres");

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  productId: number;
  productPrice: number;
  shippingPrice: number;
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

export interface CreateOrderResponse {
  order: Order;
}

// Create a new order
export const create = api<CreateOrderRequest, CreateOrderResponse>(
  { expose: true, method: "POST", path: "/orders" },
  async (req) => {
    const totalPrice = req.productPrice + req.shippingPrice;

    const order = await db.queryRow<Order>`
      INSERT INTO orders (
        customer_name, phone, governorate, address, 
        product_id, product_price, shipping_price, total_price, 
        status, created_at
      ) VALUES (
        ${req.customerName}, ${req.phone}, ${req.governorate}, ${req.address},
        ${req.productId}, ${req.productPrice}, ${req.shippingPrice}, ${totalPrice},
        'processing', NOW()
      ) RETURNING *
    `;

    return { order };
  }
);
