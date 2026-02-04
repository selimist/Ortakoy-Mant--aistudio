export interface Review {
  author: string;
  rating: number;
  text: string;
  source: string;
}

export interface RestaurantData {
  name: string;
  description: string;
  address: string;
  rating: number;
  reviewCount: string;
  reviews: Review[];
  googleMapsUri?: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image: string;
  popular?: boolean;
}