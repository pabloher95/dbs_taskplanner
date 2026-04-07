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
          const dateDiff = a.deadline.localeCompare(b.deadline);
          if (dateDiff !== 0) return dateDiff;
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
        <div className="flex bg-slate-100/80 rounded-lg p-0.5">
          <button
            onClick={() => setSortBy("priority")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
              sortBy === "priority"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Priority
          </button>
          <button
            onClick={() => setSortBy("time")}
            className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-all duration-200 ${
              sortBy === "time"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Time
          </button>
        </div>
      </div>
    <div className="grid grid-cols-4 gap-4 items-start">
      {columns.map((col) => (
        <div key={col.label} className="bg-white/60 backdrop-blur-md border border-white/60 rounded-3xl p-3">
          <div className="flex items-center justify-between px-2 mb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 capitalize">
              {col.label}
            </h2>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-500">
              {col.tasks.length}
            </span>
          </div>

          {col.tasks.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-xs text-slate-300">No tasks</p>
            </div>
          ) : (
            <div className="space-y-2">
              {col.tasks.map((task, i) => {
                const isOverdue = parseISO(task.deadline) < today;

                return (
                  <div
                    key={task.id}
                    className={`bg-white/85 backdrop-blur-md rounded-2xl p-3.5 border transition-all duration-200 hover:shadow-lg hover:shadow-indigo-100/50 hover:bg-white hover:scale-[1.03] active:scale-[0.98] animate-pop-in ${
                      isOverdue ? "border-red-200/60" : "border-white"
                    }`}
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="flex items-start gap-2">
                      <input
                        type="checkbox"
                        onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                        className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 shrink-0 mt-0.5 cursor-pointer"
                      />
                      <Link href={`/tasks/${task.id}/edit`} className="text-sm font-semibold text-slate-800 leading-snug flex-1 hover:underline">
                        {task.title}
                      </Link>
                      <div
                        className={`w-2 h-2 rounded-full shrink-0 mt-1 ${priorityColors[task.priority]}`}
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      {task.time && (
                        <span className="text-[10px] font-mono text-indigo-400">{task.time}</span>
                      )}
                      <span
                        className={`text-[10px] font-mono ${
                          isOverdue ? "text-red-400 font-medium" : "text-slate-400"
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
                      <p className="text-xs text-slate-400 mt-2 line-clamp-2">
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
