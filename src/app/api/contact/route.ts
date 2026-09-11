import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const rateLimit = checkRateLimit(`contact:${clientIp}`, 5, 60 * 1000);

    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "لقد تجاوزت عدد المحاولات المسموح بها مؤقتاً. يرجى الانتظار قليلاً ثم المحاولة." },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetInSeconds.toString(),
          },
        }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات الطلب غير صالحة" }, { status: 400 });
    }

    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawPhone = typeof body.phone === "string" ? body.phone.trim() : "";
    const rawMessage = typeof body.message === "string" ? body.message.trim() : "";
    const rawType = typeof body.type === "string" ? body.type.trim() : "contact";

    if (!rawName || rawName.length < 2 || rawName.length > 100) {
      return NextResponse.json(
        { error: "الرجاء كتابة اسم صحيح (بين 2 إلى 100 حرف)" },
        { status: 400 }
      );
    }

    // Phone validation: allow digits, +, spaces, hyphens, parentheses, length 8-20
    const cleanPhone = rawPhone.replace(/[\s\-()]/g, "");
    const phoneRegex = /^\+?[0-9]{8,18}$/;
    if (!rawPhone || !phoneRegex.test(cleanPhone) || rawPhone.length > 20) {
      return NextResponse.json(
        { error: "الرجاء إدخال رقم هاتف صحيح (مثال: 01020499680)" },
        { status: 400 }
      );
    }

    if (!rawMessage || rawMessage.length < 5 || rawMessage.length > 1000) {
      return NextResponse.json(
        { error: "الرجاء كتابة رسالة واضحة (بين 5 إلى 1000 حرف)" },
        { status: 400 }
      );
    }

    const allowedTypes = ["contact", "inquiry", "order", "complaint", "feedback"];
    const type = allowedTypes.includes(rawType.toLowerCase())
      ? rawType.toLowerCase()
      : "contact";

    const sql = getDb();
    if (sql) {
      // Ensure table exists
      await initDb();

      // Insert message into Neon Postgres
      await sql`
        INSERT INTO customer_messages (name, phone, message, type)
        VALUES (${rawName}, ${rawPhone}, ${rawMessage}, ${type});
      `;
    }

    return NextResponse.json({
      success: true,
      message: "تم استلام رسالتك بنجاح! وسنتواصل معك في أقرب وقت.",
    });
  } catch (error) {
    console.error("Error saving customer message:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ الرسالة. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
