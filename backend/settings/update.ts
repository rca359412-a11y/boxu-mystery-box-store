import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("postgres");

export interface UpdateSettingsRequest {
  shippingPrice?: number;
  productPrice?: number;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  googleAdsId?: string;
}

export interface Settings {
  shippingPrice: number;
  productPrice: number;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  googleAdsId?: string;
}

export interface UpdateSettingsResponse {
  settings: Settings;
}

// Update application settings
export const updateSettings = api<UpdateSettingsRequest, UpdateSettingsResponse>(
  { expose: true, method: "PUT", path: "/settings" },
  async (req) => {
    // First, try to get existing settings
    const existing = await db.queryRow<{ id: number }>`SELECT id FROM settings LIMIT 1`;

    let settings;
    if (existing) {
      // Update existing settings
      const updates: string[] = [];
      const params: any[] = [];
      let paramIndex = 1;

      if (req.shippingPrice !== undefined) {
        updates.push(`shipping_price = $${paramIndex++}`);
        params.push(req.shippingPrice);
      }
      if (req.productPrice !== undefined) {
        updates.push(`product_price = $${paramIndex++}`);
        params.push(req.productPrice);
      }
      if (req.facebookPixelId !== undefined) {
        updates.push(`facebook_pixel_id = $${paramIndex++}`);
        params.push(req.facebookPixelId);
      }
      if (req.googleAnalyticsId !== undefined) {
        updates.push(`google_analytics_id = $${paramIndex++}`);
        params.push(req.googleAnalyticsId);
      }
      if (req.googleAdsId !== undefined) {
        updates.push(`google_ads_id = $${paramIndex++}`);
        params.push(req.googleAdsId);
      }

      params.push(existing.id);

      const query = `
        UPDATE settings 
        SET ${updates.join(", ")}
        WHERE id = $${paramIndex}
        RETURNING shipping_price, product_price, facebook_pixel_id, 
                  google_analytics_id, google_ads_id
      `;

      settings = await db.rawQueryRow<{
        shipping_price: number;
        product_price: number;
        facebook_pixel_id: string | null;
        google_analytics_id: string | null;
        google_ads_id: string | null;
      }>(query, ...params);
    } else {
      // Create new settings
      settings = await db.queryRow<{
        shipping_price: number;
        product_price: number;
        facebook_pixel_id: string | null;
        google_analytics_id: string | null;
        google_ads_id: string | null;
      }>`
        INSERT INTO settings (
          shipping_price, product_price, facebook_pixel_id, 
          google_analytics_id, google_ads_id
        ) VALUES (
          ${req.shippingPrice || 8000}, 
          ${req.productPrice || 99000}, 
          ${req.facebookPixelId || null},
          ${req.googleAnalyticsId || null}, 
          ${req.googleAdsId || null}
        ) RETURNING shipping_price, product_price, facebook_pixel_id, 
                    google_analytics_id, google_ads_id
      `;
    }

    return {
      settings: {
        shippingPrice: settings!.shipping_price,
        productPrice: settings!.product_price,
        facebookPixelId: settings!.facebook_pixel_id || undefined,
        googleAnalyticsId: settings!.google_analytics_id || undefined,
        googleAdsId: settings!.google_ads_id || undefined,
      },
    };
  }
);
