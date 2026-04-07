"use client";

import Link from "next/link";
import KanbanView from "@/components/KanbanView";

export default function BoardPage() {
  return (
    <div className="min-h-screen px-8 py-10">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-end justify-between mb-8">
          <div>
            <Link
              href="/"
              className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
            >
              &larr; Home
            </Link>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter mt-1">
              Board
            </h1>
          </div>
        </header>

        <KanbanView />
      </div>
    </div>
  );
}
