export type OrderType = 'Delivery' | 'Pickup';

export type PaymentMethod = 'Cash' | 'Card' | 'Wallet' | 'InstaPay';

export interface CustomerInfo {
  name: string;
  phone: string;
}

export interface OrderItemOptions {
  size?: string;
  milk?: string;
  sugar?: string;
  extras?: string[];
  note?: string;
}

export interface OrderItem {
  name: string;
  quantity: number;
  options?: OrderItemOptions;
}

export interface CheckoutOrder {
  orderId?: string;
  customer: CustomerInfo;
  orderType: OrderType;
  address?: string;
  branch?: string;
  pickupTime?: string;
  items: OrderItem[];
  subtotal: number;
  deliveryFee?: number;
  discount?: number;
  total: number;
  paymentMethod: PaymentMethod;
  additionalNote?: string;
  currency?: string;
}
