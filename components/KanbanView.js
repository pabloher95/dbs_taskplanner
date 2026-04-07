"use client";

import { useState } from "react";
import Link from "next/link";
import { useTasks, useTaskDispatch, CATEGORIES } from "@/features/tasks/TaskContext";
import { parseISO, startOfDay, format } from "date-fns";

export default function KanbanView() {
  const tasks = useTasks();
  const dispatch = useTaskDispatch();
  const today = startOfDay(new Date());
  const [sortBy, setSortBy] = useState("priority");

  const activeTasks = tasks.filter((t) => !t.completed);

  const priorityColors = {
    High: "bg-red-400",
    Medium: "bg-amber-400",
    Low: "bg-emerald-400",
  };

  const columns = CATEGORIES.map((cat) => ({
    label: cat,
    tasks: activeTasks
      .filter((t) => t.category === cat)
      .sort((a, b) => {
        if (sortBy === "time") {
          if (!a.time && !b.time) return 0;
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        }
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      }),
  }));

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="flex bg-neutral-100 rounded-lg p-0.5">
          <button
            onClick={() => setSortBy("priority")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
              sortBy === "priority"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Priority
          </button>
          <button
            onClick={() => setSortBy("time")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
              sortBy === "time"
                ? "bg-white text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-700"
            }`}
          >
            Time
          </button>
        </div>
      </div>
    <div className="grid grid-cols-4 gap-4 items-start">
      {columns.map((col) => (
        <div key={col.label} className="bg-neutral-100 rounded-2xl p-3">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-500 capitalize">
              {col.label}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-500">
              {col.tasks.length}
            </span>
          </div>

          {col.tasks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-neutral-300">No tasks</p>
            </div>
          ) : (
            <div className="space-y-2">
              {col.tasks.map((task) => {
                const isOverdue = parseISO(task.deadline) < today;

                return (
                  <div
                    key={task.id}
                    className={`bg-white/70 backdrop-blur-sm rounded-xl p-3 shadow-sm border transition-all duration-200 hover:shadow-lg ${
                      isOverdue ? "border-red-200" : "border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                        className="h-3.5 w-3.5 rounded border-neutral-300 accent-neutral-700 shrink-0 mt-0.5 cursor-pointer"
                      />
                      <Link href={`/tasks/${task.id}/edit`} className="text-sm font-medium text-neutral-800 leading-snug flex-1 hover:underline">
                        {task.title}
                      </Link>
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 mt-1 ${priorityColors[task.priority]}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {task.time && (
                        <span className="text-[10px] font-mono text-neutral-500">{task.time}</span>
                      )}
                      <span
                        className={`text-[10px] font-mono ${
                          isOverdue ? "text-red-400 font-medium" : "text-neutral-400"
                        }`}
                      >
                        {format(parseISO(task.deadline), "MMM d")}
                      </span>
                      {isOverdue && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-50 text-red-500 font-medium">
                          Overdue
                        </span>
                      )}
                    </div>
                    {task.notes && (
                      <p className="text-xs text-neutral-400 mt-2 line-clamp-2">
                        {task.notes}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
    </div>
  );
}
