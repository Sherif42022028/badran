import { MESSAGE_DIVIDER } from "@/config/whatsapp";
import { CartItem } from "@/components/CartModal";

export interface CustomBlendOrder {
  orderId?: string;
  customerName?: string;
  customerPhone?: string;
  blendName?: string;
  roast?: string;
  cardamom?: string;
  origin?: string;
  recipeBreakdown?: string;
  grind?: string;
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
  lines.push(`أريد طلب خلطة خاصة بي *(${order.blendName || "توليفتك على مزاجك"})*:`);
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
  lines.push("☕ *تركيبة ومكونات الخلطة المخصصة:*");
  if (order.recipeBreakdown) {
    lines.push(`• *توزيع الأنواع والأوزان:*\n  ${order.recipeBreakdown}`);
  } else if (order.origin) {
    lines.push(`• *البن الأساسي:* ${order.origin}`);
  }

  if (order.roast) {
    lines.push(`• *درجة التحميص:* ${order.roast}`);
  }
  if (order.grind) {
    lines.push(`• *درجة الطحن:* ${order.grind}`);
  }
  if (order.cardamom) {
    lines.push(`• *مستوى التحويج:* ${order.cardamom}`);
  }
  lines.push(
    `• *الإضافات:* ${
      order.additions && order.additions.length > 0
        ? order.additions.join(" + ")
        : "بدون إضافات"
    }`
  );
  lines.push(`• *إجمالي وزن التوليفة:* ${order.weight}`);
  lines.push("");
  lines.push(`💵 *السعر الإجمالي:* ${order.totalPrice} ج.م`);

  if (order.notes && order.notes.trim()) {
    lines.push("");
    lines.push("📝 *ملاحظات التحضير:*");
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
    const name = ci.name || ci.item?.name || "صنف";
    const variant = ci.selectedVariant || ci.selectedPrice?.unit || "";
    const price = ci.unitPrice ?? ci.selectedPrice?.price ?? 0;
    const lineTotal = price * ci.quantity;
    const variantDisplay = variant ? ` (${variant})` : "";
    lines.push(`${idx + 1}) *${name}*${variantDisplay} × ${ci.quantity}`);
    lines.push(`   - السعر: ${lineTotal} ج.م`);
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
  lines.push("قهوة تستحقها كل يوم ☕🤎");

  return lines.join("\n");
}
