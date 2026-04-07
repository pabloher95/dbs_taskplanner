"use client";

import Link from "next/link";
import { useTasks, useTaskDispatch } from "@/features/tasks/TaskContext";
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
  isBefore,
  startOfDay,
  parseISO,
} from "date-fns";
import { useState } from "react";

const priorityColors = {
  High: "bg-red-400",
  Medium: "bg-amber-400",
  Low: "bg-emerald-400",
};

export default function WeekPage() {
  const tasks = useTasks();
  const dispatch = useTaskDispatch();
  const today = startOfDay(new Date());

  const [weekStart, setWeekStart] = useState(startOfWeek(today));
  const [sortBy, setSortBy] = useState("priority");
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const weekEnd = addDays(weekStart, 6);
  const isCurrentWeek = days.some((d) => isSameDay(d, today));

  function getTasksForDay(day) {
    const dateStr = format(day, "yyyy-MM-dd");
    return tasks
      .filter((t) => t.deadline === dateStr)
      .sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        if (sortBy === "time") {
          if (!a.time && !b.time) return 0;
          if (!a.time) return 1;
          if (!b.time) return -1;
          return a.time.localeCompare(b.time);
        }
        const order = { High: 0, Medium: 1, Low: 2 };
        return order[a.priority] - order[b.priority];
      });
  }

  const weekTasks = tasks.filter((t) => {
    const d = parseISO(t.deadline);
    return d >= weekStart && d <= weekEnd;
  });
  const weekCompleted = weekTasks.filter((t) => t.completed).length;
  const weekActive = weekTasks.filter((t) => !t.completed).length;

  return (
    <div className="max-w-6xl mx-auto mt-12 px-6">
      <Link
        href="/"
        className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
      >
        &larr; Home
      </Link>

      <div className="flex items-center gap-4 mt-3 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
          >
            &larr;
          </button>
          <button
            onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/60 backdrop-blur-sm border border-white/80 text-slate-400 hover:text-slate-700 hover:border-slate-300 transition-colors"
          >
            &rarr;
          </button>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </h1>
        <div className="ml-auto flex items-center gap-2">
          <div className="flex bg-slate-100/80 rounded-lg p-0.5">
            <button
              onClick={() => setSortBy("priority")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                sortBy === "priority"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Priority
            </button>
            <button
              onClick={() => setSortBy("time")}
              className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                sortBy === "time"
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Time
            </button>
          </div>
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekStart(startOfWeek(today))}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-white/80 bg-white text-slate-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-colors"
            >
              This Week
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-4 shadow-lg shadow-indigo-200/50 hover-lift hover:shadow-xl hover:shadow-indigo-300/50 animate-pop-in" style={{ animationDelay: "0ms" }}>
          <p className="text-[10px] uppercase tracking-widest text-indigo-300">Total</p>
          <p className="text-3xl font-bold text-white mt-1">{weekTasks.length}</p>
        </div>
        <div className="bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-4 hover-lift hover:shadow-lg hover:shadow-indigo-100/40 animate-pop-in" style={{ animationDelay: "80ms" }}>
          <p className="text-[10px] uppercase tracking-widest text-slate-400">Active</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{weekActive}</p>
        </div>
        <div className={`rounded-3xl p-4 hover-lift animate-pop-in ${weekCompleted > 0 ? "bg-emerald-50/80 border border-emerald-200/40 hover:shadow-lg hover:shadow-emerald-100/40" : "bg-white/60 backdrop-blur-sm border border-white/80 hover:shadow-lg hover:shadow-indigo-100/40"}`} style={{ animationDelay: "160ms" }}>
          <p className={`text-[10px] uppercase tracking-widest ${weekCompleted > 0 ? "text-emerald-400" : "text-slate-400"}`}>Done</p>
          <p className={`text-3xl font-bold mt-1 ${weekCompleted > 0 ? "text-emerald-600" : "text-slate-300"}`}>{weekCompleted}</p>
        </div>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day, dayIndex) => {
          const dayTasks = getTasksForDay(day);
          const isTodayDate = isToday(day);
          const isPast = isBefore(day, today);

          return (
            <div
              key={day.toISOString()}
              className={`rounded-3xl p-3 min-h-[200px] hover-lift animate-pop-in ${
                isTodayDate
                  ? "bg-gradient-to-br from-indigo-600 to-indigo-700 shadow-lg shadow-indigo-200/50 hover:shadow-xl hover:shadow-indigo-300/50"
                  : "bg-white/40 backdrop-blur-sm border border-white/60 hover:shadow-lg hover:shadow-indigo-100/40"
              }`}
              style={{ animationDelay: `${dayIndex * 60}ms` }}
            >
              <Link
                href={`/day/${format(day, "yyyy-MM-dd")}`}
                className="block mb-3"
              >
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  isTodayDate ? "text-indigo-300" : "text-slate-400"
                }`}>
                  {format(day, "EEE")}
                </p>
                <p className={`text-lg font-bold ${
                  isTodayDate ? "text-white" : "text-slate-800"
                }`}>
                  {format(day, "d")}
                </p>
              </Link>

              {dayTasks.length === 0 ? (
                <p className={`text-[10px] ${isTodayDate ? "text-indigo-300/70" : "text-slate-300"}`}>
                  No tasks
                </p>
              ) : (
                <div className="space-y-1.5">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-1.5 px-2 py-1.5 rounded-lg ${
                        isTodayDate
                          ? "bg-indigo-500/30"
                          : task.completed
                          ? "bg-white/60"
                          : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                        className="h-3 w-3 rounded border-slate-300 accent-indigo-600 shrink-0 mt-0.5 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/tasks/${task.id}/edit`}
                          className={`text-[11px] leading-tight block truncate hover:underline ${
                            task.completed
                              ? isTodayDate
                                ? "text-indigo-300/60 line-through"
                                : "text-slate-400 line-through"
                              : isTodayDate
                              ? "text-white"
                              : "text-slate-700"
                          }`}
                        >
                          {task.title}
                        </Link>
                        {!task.completed && (
                          <>
                            {task.time && (
                              <span className={`text-[9px] font-mono block mt-0.5 ${isTodayDate ? "text-indigo-300" : "text-slate-400"}`}>{task.time}</span>
                            )}
                            <div className={`w-full h-0.5 rounded-full mt-1 ${priorityColors[task.priority]}`} />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
