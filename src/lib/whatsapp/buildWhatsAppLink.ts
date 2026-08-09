/**
 * Formats phone number and message into a WhatsApp direct link (wa.me).
 * Throws a readable error if the phone number is missing or empty after sanitization.
 */
export function buildWhatsAppLink(phoneNumber: string, message: string): string {
  // Remove spaces, + signs, parentheses, and hyphens from phone number
  const cleanPhone = phoneNumber.replace(/[\s+()\-_]/g, "");

  if (!cleanPhone) {
    throw new Error("WhatsApp phone number is missing or invalid. Please configure a valid contact phone number.");
  }

  const encodedMessage = encodeURIComponent(message);

  if (encodedMessage.length > 6000) {
    console.warn("WhatsApp message exceeds 6000 encoded characters and may be truncated by WhatsApp web or mobile app.");
  }

  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}
