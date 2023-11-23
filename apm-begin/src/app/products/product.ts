import { Review } from "../reviews/review";

/* Defines the product entity */
export interface Product {
  id: number;
  productName: string;
  productCode: string;
  description: string;
  price: number;
  quantityInStock?: number;
  hasReviews?: boolean;
  reviews?: Review[];
}

// this should be in a separate file called utility
export interface ResponseResult<T> {
  data: T | undefined;
  error?: string
}
