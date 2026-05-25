// Типы для магазина кофе
export type CoffeeCardType = {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  image: string;
  description: string;
  rating: number;
  roastLevel: 'light' | 'medium' | 'dark';
  origin: string;
  flavor: string;
};

export interface CoffeeFilterParams {
  search?: string;
  inStock?: boolean;
  roastLevel?: 'light' | 'medium' | 'dark';
  origin?: string;
}