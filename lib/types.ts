export type ProductIntent = {
  product: string;
  maxPrice?: number;
  minPrice?: number;
  brand?: string;
  category?: string;
  mustHave?: string[];
  sortGoal?: "best_value" | "cheapest" | "premium" | "fast_shipping";
};

export type Offer = {
  title: string;
  price?: number;
  store?: string;
  url: string;
  image?: string;
  rating?: number;
  reviews?: number;
  shipping?: string;
  aiScore?: number;
  reason?: string;
};
