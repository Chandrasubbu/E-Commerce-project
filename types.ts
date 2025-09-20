
export interface Vendor {
  id: string;
  name: string;
  logoUrl: string;
  rating: number;
  description: string;
  coverImageUrl: string;
}

export interface Product {
  id:string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  gallery: string[];
  vendorId: string;
  rating: number;
  category: string;
  reviewCount: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface Order {
    id: string;
    date: string; // ISO string
    items: CartItem[];
    total: number;
    shippingAddress: ShippingAddress;
}