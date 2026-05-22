export interface Category {
  id: number;
  name: string;
  parent_id: number | null;
  image_url?: string; // We might need to add this to the DB if we want category images
}

export interface Review {
  id: number;
  user_id: number | null;
  product_id: number | null;
  rating: number | null;
  comment: string | null;
  created_at: string | null;
}

export interface Product {
  id: number;
  category_id: number | null;
  name: string;
  description: string | null;
  price: string | number;
  stock: number | null;
  image_url: string | null;
  created_at: string | null;
  categories?: Category | null;
  reviews?: Review[];
}
