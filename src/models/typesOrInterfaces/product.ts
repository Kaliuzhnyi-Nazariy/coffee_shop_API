export interface IProduct {
  id: string;
  title: string;
  price: number;
  description: string;
  category: { hot: boolean; cold: boolean };
  image: string;
  rating: { rate: number };
}

export interface IProductCart {
  id: string;
  title: string;
  price: number;
  description: string;
  category: { hot: boolean; cold: boolean };
  image: string;
  rating: { rate: number };
  amount: number;
}
