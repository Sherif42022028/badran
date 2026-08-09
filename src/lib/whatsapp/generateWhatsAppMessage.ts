import { MESSAGE_DIVIDER } from "@/config/whatsapp";
import { CartItem } from "@/components/CartModal";

export interface CustomBlendOrder {
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  roast: string;
  cardamom: string;
  origin: string;
  additions: string[];
  weight: string;
  totalPrice: number;
  notes?: string;
}

/**
 * Generates a clean, beautifully formatted Arabic WhatsApp message for custom blend orders.
 */
export function generateBlendWhatsAppMessage(order: CustomBlendOrder): string {
  const lines: string[] = [];

  lines.push("مرحبا *بن بدران* ☕");
  lines.push("أريد طلب الخلطة التالية:");
  lines.push("");
  lines.push(MESSAGE_DIVIDER);

  if (order.orderId) {
    lines.push(`🧾 *رقم الطلب:* ${order.orderId}`);
  }
  if (order.customerName && order.customerName.trim()) {
    lines.push(`👤 *العميل:* ${order.customerName.trim()}`);
  }
  if (order.customerPhone && order.customerPhone.trim()) {
    lines.push(`📱 *رقم الهاتف:* ${order.customerPhone.trim()}`);
  }

  lines.push("");
  lines.push("☕ *تفاصيل الخلطة:*");
  lines.push(`• *التحميص:* ${order.roast}`);
  lines.push(`• *التحويج:* ${order.cardamom}`);
  lines.push(`• *البن الأساسي:* ${order.origin}`);
  lines.push(`• *الإضافات:* ${order.additions.length > 0 ? order.additions.join(" + ") : "بدون إضافات"}`);
  lines.push(`• *الوزن:* ${order.weight}`);
  lines.push("");
  lines.push(`💵 *السعر التقديري:* ${order.totalPrice} ج.م`);

  if (order.notes && order.notes.trim()) {
    lines.push("");
    lines.push("📝 *ملاحظات إضافية:*");
    lines.push(order.notes.trim());
  }

  lines.push("");
  lines.push(MESSAGE_DIVIDER);
  lines.push("شكراً لكم 🤎");

  return lines.join("\n");
}

/**
 * Generates a clean, beautifully formatted Arabic WhatsApp message for cart orders.
 */
export function generateCartWhatsAppMessage(
  cartItems: CartItem[],
  totalAmount: number,
  customerName?: string,
  customerPhone?: string,
  notes?: string,
  orderId?: string
): string {
  const lines: string[] = [];

  lines.push("مرحبا *بن بدران* ☕");
  lines.push("أرغب في إتمام الطلب التالي من السلة:");
  lines.push("");
  lines.push(MESSAGE_DIVIDER);

  if (orderId) {
    lines.push(`🧾 *رقم الطلب:* ${orderId}`);
  }
  if (customerName && customerName.trim()) {
    lines.push(`👤 *اسم العميل:* ${customerName.trim()}`);
  }
  if (customerPhone && customerPhone.trim()) {
    lines.push(`📱 *رقم الهاتف:* ${customerPhone.trim()}`);
  }

  lines.push("");
  lines.push("☕ *تفاصيل المنتجات:*");

  cartItems.forEach((ci, idx) => {
    lines.push(`${idx + 1}) *${ci.item.name}* (${ci.selectedPrice.unit}) × ${ci.quantity}`);
    lines.push(`   - السعر: ${ci.selectedPrice.price * ci.quantity} ج.م`);
  });

  lines.push("");
  lines.push(MESSAGE_DIVIDER);
  lines.push(`💵 *الإجمالي النهائي:* ${totalAmount} ج.م`);

  if (notes && notes.trim()) {
    lines.push("");
    lines.push("📝 *ملاحظات الطحن والتحويج:*");
    lines.push(notes.trim());
  }

  lines.push("");
  lines.push(MESSAGE_DIVIDER);
  lines.push("يرجى تأكيد تجهيز الطلب والاستلام! 🤎");

  return lines.join("\n");
}
