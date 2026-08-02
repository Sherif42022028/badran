import type { Metadata } from "next";
import { Lalezar, Tajawal, DM_Sans } from "next/font/google";
import "./globals.css";

const lalezar = Lalezar({
  weight: "400",
  subsets: ["arabic"],
  variable: "--font-lalezar",
  display: "swap",
});

const tajawal = Tajawal({
  weight: ["400", "500", "700"],
  subsets: ["arabic"],
  variable: "--font-tajawal",
  display: "swap",
});

const dmSans = DM_Sans({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-dmsans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "بن بدران | Budran Coffee - أصالة القهوة العربية والفرنسية",
  description:
    "موقع بن بدران الرسمي (ميت غمر). أجود أنواع البن العربي، البن المحوج، الخلطات الفرنسية، والتوليفات الخاصة بأعلى معايير الجودة والتحميص الطازج.",
  keywords: ["بن بدران", "قهوة بدران", "Budran Coffee", "ميت غمر", "بن محوج", "قهوة فرنسية", "أجود أنواع البن"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${lalezar.variable} ${tajawal.variable} ${dmSans.variable} scroll-smooth h-full`}
    >
      <body className="min-h-full flex flex-col font-tajawal antialiased text-[#3A2416]">
        {children}
      </body>
    </html>
  );
}
