import { api } from "encore.dev/api";
import { SQLDatabase } from "encore.dev/storage/sqldb";

const db = SQLDatabase.named("postgres");

export interface Settings {
  shippingPrice: number;
  productPrice: number;
  facebookPixelId?: string;
  googleAnalyticsId?: string;
  googleAdsId?: string;
}

export interface GetSettingsResponse {
  settings: Settings;
}

// Get application settings
export const getSettings = api<void, GetSettingsResponse>(
  { expose: true, method: "GET", path: "/settings" },
  async () => {
    const settings = await db.queryRow<{
      shipping_price: number;
      product_price: number;
      facebook_pixel_id: string | null;
      google_analytics_id: string | null;
      google_ads_id: string | null;
    }>`
      SELECT shipping_price, product_price, facebook_pixel_id, 
             google_analytics_id, google_ads_id
      FROM settings 
      ORDER BY id DESC 
      LIMIT 1
    `;

    if (!settings) {
      return {
        settings: {
          shippingPrice: 8000, // 8 TND in millimes
          productPrice: 99000, // 99 TND in millimes
        },
      };
    }

    return {
      settings: {
        shippingPrice: settings.shipping_price,
        productPrice: settings.product_price,
        facebookPixelId: settings.facebook_pixel_id || undefined,
        googleAnalyticsId: settings.google_analytics_id || undefined,
        googleAdsId: settings.google_ads_id || undefined,
      },
    };
  }
);
