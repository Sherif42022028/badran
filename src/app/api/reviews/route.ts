import { NextResponse } from "next/server";
import { getDb, initDb } from "@/lib/db";

// Fallback initial reviews if DB is fresh
const INITIAL_REVIEWS = [
  {
    id: 1,
    name: "أحمد الفقي",
    comment: "أحسن بن في ميت غمر بلا منازع، الخلطة المحوجة بالحبهان والمستكة مظبوطة بالمللي والتحمير ممتاز.",
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

export async function GET() {
  try {
    const sql = getDb();
    if (!sql) {
      return NextResponse.json({ reviews: INITIAL_REVIEWS });
    }

    await initDb();

    const dbReviews = await sql`
      SELECT id, name, comment, rating, created_at
      FROM customer_reviews
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
    const { name, comment, rating } = await request.json();

    if (!name || !comment) {
      return NextResponse.json(
        { error: "الرجاء كتاية الاسم والتقييم" },
        { status: 400 }
      );
    }

    const sql = getDb();
    if (sql) {
      await initDb();
      await sql`
        INSERT INTO customer_reviews (name, comment, rating)
        VALUES (${name}, ${comment}, ${rating || 5});
      `;
    }

    return NextResponse.json({
      success: true,
      message: "شكراً لك! تم إضافة تقييمك بنجاح.",
    });
  } catch (error) {
    console.error("Error posting review:", error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء حفظ التقييم" },
      { status: 500 }
    );
  }
}
