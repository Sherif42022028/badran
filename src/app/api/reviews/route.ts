import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";
import { checkRateLimit, getClientIp } from "@/lib/rateLimit";

// Fallback initial reviews if DB is fresh
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "أحمد الفقي",
    comment: "أحسن بن في ميت غمر بلا منازع، الخلطة المحوجة بالحبهان والمستكة مظبوطة بالمللي والتحميص ممتاز.",
    rating: 5,
    created_at: "2026-08-01",
  },
  {
    id: 2,
    name: "د. محمود عبد السلام",
    comment: "البن الفرنساوي بالبندق عندهم تحفة، والبن الكولومبي نقي جداً ورائحته تملأ المكان. ربنا يبارك لهم.",
    rating: 5,
    created_at: "2026-07-28",
  },
  {
    id: 3,
    name: "مهندس شريف",
    comment: "التعامل محترم وسريع جداً، وتجهيز التوليفة الخاصة قدام عيني باحترافية عالية.",
    rating: 5,
    created_at: "2026-07-25",
  },
];

export async function GET(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const readLimit = checkRateLimit(`reviews_read:${clientIp}`, 30, 60 * 1000);

    if (!readLimit.success) {
      return NextResponse.json(
        { error: "طلبات كثيرة جداً، يرجى المحاولة بعد لحظات." },
        { status: 429, headers: { "Retry-After": readLimit.resetInSeconds.toString() } }
      );
    }

    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ reviews: INITIAL_REVIEWS });
    }

    await initDb();

    const dbReviews = await sql`
      SELECT id, name, comment, rating, created_at
      FROM customer_reviews
      WHERE is_approved = TRUE
      ORDER BY id DESC
      LIMIT 10;
    `;

    if (!dbReviews || dbReviews.length === 0) {
      return NextResponse.json({ reviews: INITIAL_REVIEWS });
    }

    return NextResponse.json({ reviews: dbReviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ reviews: INITIAL_REVIEWS });
  }
}

export async function POST(request: Request) {
  try {
    const clientIp = getClientIp(request);
    const writeLimit = checkRateLimit(`reviews_write:${clientIp}`, 3, 60 * 1000);

    if (!writeLimit.success) {
      return NextResponse.json(
        { error: "لقد تجاوزت الحد المسموح لإرسال التقييمات. يرجى الانتظار قليلاً ثم المحاولة." },
        { status: 429, headers: { "Retry-After": writeLimit.resetInSeconds.toString() } }
      );
    }

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "بيانات الطلب غير صالحة" }, { status: 400 });
    }

    const rawName = typeof body.name === "string" ? body.name.trim() : "";
    const rawComment = typeof body.comment === "string" ? body.comment.trim() : "";
    const rawRating = Number(body.rating);

    if (!rawName || rawName.length < 2 || rawName.length > 100) {
      return NextResponse.json(
        { error: "الرجاء كتابة اسم صحيح (بين 2 إلى 100 حرف)" },
        { status: 400 }
      );
    }

    if (!rawComment || rawComment.length < 5 || rawComment.length > 500) {
      return NextResponse.json(
        { error: "الرجاء كتابة تعليق مناسب (بين 5 إلى 500 حرف)" },
        { status: 400 }
      );
    }

    const rating = Math.floor(rawRating);
    if (isNaN(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "التقييم يجب أن يكون رقماً صحيحاً بين 1 و 5 نجوم" },
        { status: 400 }
      );
    }

    const sql = getDb();
    if (sql) {
      await initDb();
      await sql`
        INSERT INTO customer_reviews (name, comment, rating, is_approved)
        VALUES (${rawName}, ${rawComment}, ${rating}, FALSE);
      `;
    }

    return NextResponse.json({
      success: true,
      message: "شكراً لك! تم استلام تقييمك بنجاح وسيظهر بالموقع بعد المراجعة.",
    });
  } catch (error) {
    console.error("Error posting review:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التقييم" },
      { status: 500 }
    );
  }
}
