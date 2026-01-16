export interface ProductAnalytics {
  productId: string;
  productName: string;
  quantitySold: number;
  totalRevenue: number;
  uniqueDropshippersCount: number;
  returnRate: number;
  averagePrice: number;
  minPrice: number;
  maxPrice: number;
}

export interface ProductTimelinePoint {
  date: string;
  price: number;
  ordersCount: number;
}

export interface ProductTimeline {
  productId: string;
  productName: string;
  timeline: ProductTimelinePoint[];
}
