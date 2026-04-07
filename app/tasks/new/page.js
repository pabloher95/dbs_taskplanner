"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { useTaskDispatch, CATEGORIES, PRIORITIES } from "@/features/tasks/TaskContext";

export default function NewTaskPage() {
  const dispatch = useTaskDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState(searchParams.get("date") || format(new Date(), "yyyy-MM-dd"));
  const [time, setTime] = useState("");
  const [category, setCategory] = useState(CATEGORIES[3]);
  const [priority, setPriority] = useState(PRIORITIES[1]);
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        title: title.trim(),
        deadline,
        time,
        category,
        priority,
        notes: notes.trim(),
      },
    });

    router.replace("/");
  }

  const priorityActiveColors = {
    High: "bg-red-500 text-white",
    Medium: "bg-amber-500 text-white",
    Low: "bg-emerald-500 text-white",
  };

  return (
    <div className="max-w-xl mx-auto mt-12 px-6">
      <Link
        href="/"
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        &larr; Home
      </Link>
      <h1 className="text-2xl font-bold text-stone-900 tracking-tight mt-2 mb-8">
        New Task
      </h1>

      <form onSubmit={handleSubmit} noValidate>
        <div className="bg-white shadow-sm rounded-2xl divide-y divide-stone-100">
          {/* Title */}
          <div className="p-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              autoFocus
              className="w-full text-sm text-stone-800 placeholder:text-stone-300 bg-transparent focus:outline-none"
            />
          </div>

          {/* Deadline & Time */}
          <div className="p-5 flex gap-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="text-sm text-stone-800 bg-transparent focus:outline-none"
              />
            </div>
            <div className="w-px bg-stone-100" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
                Time <span className="normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-sm text-stone-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          {/* Category & Priority */}
          <div className="p-5 flex gap-8">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                Category
              </label>
              <div className="flex flex-wrap gap-1.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                      category === c
                        ? "bg-amber-600 text-white"
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px bg-stone-100" />

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-3">
                Priority
              </label>
              <div className="flex gap-1.5">
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      priority === p
                        ? priorityActiveColors[p]
                        : "bg-stone-50 text-stone-500 hover:bg-stone-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Notes */}
          <div className="p-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details (optional)"
              rows={3}
              className="w-full text-sm text-stone-800 placeholder:text-stone-300 bg-transparent resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="flex-1 py-3 rounded-2xl bg-amber-600 text-white text-sm font-medium hover:bg-amber-500 transition-colors"
          >
            Add Task
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl border border-stone-200 text-sm font-medium text-stone-500 hover:bg-stone-50 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
