import type { Metadata } from "next";
import { Alexandria, Amiri, Tajawal, DM_Sans } from "next/font/google";
import "./globals.css";

const alexandria = Alexandria({
  weight: ["300", "400", "600", "700", "800"],
  subsets: ["arabic"],
  variable: "--font-alexandria",
  display: "swap",
});

const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  variable: "--font-amiri",
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
  title: "بن بدران | Budran Coffee — أصالة وتوليف القهوة الفاخرة",
  description:
    "موقع بن بدران الرسمي (ميت غمر). أجود أنواع البن العربي، البن المحوج، الخلطات الفرنسية، والتوليفات الخاصة بأعلى معايير الجودة والتحميص الطازج.",
  keywords: ["بن بدران", "قهوة بدران", "Budran Coffee", "ميت غمر", "بن محوج", "قهوة فرنسية", "أجود أنواع البن", "قهوة فاخرة"],
  icons: {
    icon: "/logo.jpg",
    shortcut: "/logo.jpg",
    apple: "/logo.jpg",
  },
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
      className={`${alexandria.variable} ${amiri.variable} ${tajawal.variable} ${dmSans.variable} scroll-smooth h-full`}
    >
      <body className="min-h-full flex flex-col font-alexandria antialiased bg-[#FAF7F2] text-[#1E110A]">
        {children}
      </body>
    </html>
  );
}
