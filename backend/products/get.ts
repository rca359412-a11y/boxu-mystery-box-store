import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("postgres");

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image_url: string;
  video_url?: string;
  active: boolean;
}

export interface GetProductResponse {
  product: Product;
}

// Get the mystery box product
export const getMysteryBox = api<void, GetProductResponse>(
  { expose: true, method: "GET", path: "/products/mystery-box" },
  async () => {
    const product = await db.queryRow<Product>`
      SELECT id, name, description, price, image_url, video_url, active
      FROM products 
      WHERE slug = 'mystery-box' AND active = true
    `;

    if (!product) {
      return {
        product: {
          id: 1,
          name: "Mystery Box - Découvrez la surprise !",
          description: "Une boîte mystère pleine de surprises d'une valeur supérieure au prix d'achat",
          price: 99000,
          image_url: "/mystery-box.jpg",
          video_url: "/mystery-box-video.mp4",
          active: true,
        },
      };
    }

    return { product };
  }
);
