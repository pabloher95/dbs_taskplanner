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
              className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            >
              &larr; Home
            </Link>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight mt-1">
              Board
            </h1>
          </div>
        </header>

        <KanbanView />
      </div>
    </div>
  );
}
