export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  userId: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: string;
  items: OrderItem[];
}
