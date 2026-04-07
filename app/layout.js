import { Inter } from "next/font/google";
import "./globals.css";
import { TaskProvider } from "@/features/tasks/TaskContext";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Daily Planner",
  description: "A minimal daily planner app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased font-[family-name:var(--font-inter)]`}
      >
        <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-indigo-50/40 to-slate-100 -z-10" />
        <TaskProvider>
          <main className="min-h-screen p-8 animate-page-in">{children}</main>
        </TaskProvider>
      </body>
    </html>
  );
}
