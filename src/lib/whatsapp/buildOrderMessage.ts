import { CheckoutOrder } from "@/types/Order";
import { SHOP_NAME, DEFAULT_CURRENCY, MESSAGE_DIVIDER } from "@/config/whatsapp";

/**
 * Builds a clean, structured WhatsApp message string for checkout.
 */
export function buildOrderMessage(order: CheckoutOrder): string {
  const currency = order.currency || DEFAULT_CURRENCY;
  const lines: string[] = [];

  lines.push(`Hello *${SHOP_NAME}* ☕`);
  lines.push("");
  lines.push("I’d like to place the following order:");
  lines.push("");
  lines.push(MESSAGE_DIVIDER);

  if (order.orderId) {
    lines.push(`🧾 *Order ID:* ${order.orderId}`);
  }

  lines.push("");
  lines.push("👤 *Customer Details*");
  lines.push(`*Name:* ${order.customer.name}`);
  lines.push(`*Phone:* ${order.customer.phone}`);
  lines.push("");
  lines.push(`🚚 *Order Type:* ${order.orderType}`);

  if (order.orderType === "Delivery" && order.address) {
    lines.push(`📍 *Address:* ${order.address}`);
  } else if (order.orderType === "Pickup") {
    if (order.branch) {
      lines.push(`🏬 *Branch:* ${order.branch}`);
    }
    if (order.pickupTime) {
      lines.push(`⏰ *Pickup Time:* ${order.pickupTime}`);
    }
  }

  lines.push("");
  lines.push(MESSAGE_DIVIDER);
  lines.push("☕ *Order Details*");
  lines.push("");

  order.items.forEach((item, index) => {
    lines.push(`${index + 1}) *${item.name}* x${item.quantity}`);
    if (item.options) {
      if (item.options.size) {
        lines.push(`   - Size: ${item.options.size}`);
      }
      if (item.options.milk) {
        lines.push(`   - Milk: ${item.options.milk}`);
      }
      if (item.options.sugar) {
        lines.push(`   - Sugar: ${item.options.sugar}`);
      }
      if (item.options.extras && item.options.extras.length > 0) {
        lines.push(`   - Extras: ${item.options.extras.join(", ")}`);
      }
      if (item.options.note) {
        lines.push(`   - Note: ${item.options.note}`);
      }
    }
    if (index < order.items.length - 1) {
      lines.push("");
    }
  });

  lines.push("");
  lines.push(MESSAGE_DIVIDER);
  lines.push(`💵 *Subtotal:* ${order.subtotal} ${currency}`);

  if (order.orderType === "Delivery" && order.deliveryFee !== undefined && order.deliveryFee > 0) {
    lines.push(`🚚 *Delivery Fee:* ${order.deliveryFee} ${currency}`);
  }

  if (order.discount !== undefined && order.discount > 0) {
    lines.push(`🎟️ *Discount:* -${order.discount} ${currency}`);
  }

  lines.push(`✅ *Total:* ${order.total} ${currency}`);
  lines.push("");
  lines.push(`💳 *Payment Method:* ${order.paymentMethod}`);

  if (order.additionalNote && order.additionalNote.trim()) {
    lines.push("");
    lines.push("📝 *Additional Note:*");
    lines.push(order.additionalNote.trim());
  }

  lines.push("");
  lines.push(MESSAGE_DIVIDER);
  lines.push("Thank you! ☕");

  return lines.join("\n");
}
