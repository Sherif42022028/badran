import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { name, phone, message, type } = await request.json();

    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: "الرجاء تعبئة جميع الحقول المطلوبة (الاسم، الهاتف، الرسالة)" },
        { status: 400 }
      );
    }

    const sql = getDb();
    if (sql) {
      // Ensure table exists
      await initDb();

      // Insert message into Neon Postgres
      await sql`
        INSERT INTO customer_messages (name, phone, message, type)
        VALUES (${name}, ${phone}, ${message}, ${type || 'contact'});
      `;
    }

    return NextResponse.json({
      success: true,
      message: "تم استلام رسالتك بنجاح! وسنتواصل معك في أقرب وقت.",
    });
  } catch (error: any) {
    console.error("Error saving customer message:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ الرسالة. يرجى المحاولة لاحقاً." },
      { status: 500 }
    );
  }
}
