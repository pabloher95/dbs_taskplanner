import localFont from "next/font/local";
import "./globals.css";
import { TaskProvider } from "@/features/tasks/TaskContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "Daily Planner",
  description: "A minimal daily planner app",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-stone-50 font-[family-name:var(--font-geist-sans)]`}
      >
        <TaskProvider>
          <main className="min-h-screen p-8">{children}</main>
        </TaskProvider>
      </body>
    </html>
  );
}
