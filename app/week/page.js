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
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        &larr; Home
      </Link>

      <div className="flex items-center gap-4 mt-3 mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setWeekStart(subWeeks(weekStart, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
          >
            &larr;
          </button>
          <button
            onClick={() => setWeekStart(addWeeks(weekStart, 1))}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-neutral-200 text-neutral-400 hover:text-neutral-700 hover:border-neutral-300 transition-colors"
          >
            &rarr;
          </button>
        </div>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          {format(weekStart, "MMM d")} – {format(weekEnd, "MMM d, yyyy")}
        </h1>
        <div className="ml-auto flex items-center gap-2">
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
          {!isCurrentWeek && (
            <button
              onClick={() => setWeekStart(startOfWeek(today))}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-900 hover:text-white hover:border-neutral-900 transition-colors"
            >
              This Week
            </button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-neutral-900 rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500">Total</p>
          <p className="text-3xl font-bold text-white mt-1">{weekTasks.length}</p>
        </div>
        <div className="bg-neutral-100 rounded-2xl p-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-400">Active</p>
          <p className="text-3xl font-bold text-neutral-800 mt-1">{weekActive}</p>
        </div>
        <div className={`rounded-2xl p-4 ${weekCompleted > 0 ? "bg-emerald-50" : "bg-neutral-100"}`}>
          <p className={`text-[10px] uppercase tracking-widest ${weekCompleted > 0 ? "text-emerald-400" : "text-neutral-400"}`}>Done</p>
          <p className={`text-3xl font-bold mt-1 ${weekCompleted > 0 ? "text-emerald-600" : "text-neutral-300"}`}>{weekCompleted}</p>
        </div>
      </div>

      {/* Day columns */}
      <div className="grid grid-cols-7 gap-3">
        {days.map((day) => {
          const dayTasks = getTasksForDay(day);
          const isTodayDate = isToday(day);
          const isPast = isBefore(day, today);

          return (
            <div
              key={day.toISOString()}
              className={`rounded-2xl p-3 min-h-[200px] ${
                isTodayDate
                  ? "bg-neutral-900"
                  : "bg-neutral-100"
              }`}
            >
              <Link
                href={`/day/${format(day, "yyyy-MM-dd")}`}
                className="block mb-3"
              >
                <p className={`text-[10px] font-bold uppercase tracking-widest ${
                  isTodayDate ? "text-neutral-500" : "text-neutral-400"
                }`}>
                  {format(day, "EEE")}
                </p>
                <p className={`text-lg font-bold ${
                  isTodayDate ? "text-white" : "text-neutral-800"
                }`}>
                  {format(day, "d")}
                </p>
              </Link>

              {dayTasks.length === 0 ? (
                <p className={`text-[10px] ${isTodayDate ? "text-neutral-600" : "text-neutral-300"}`}>
                  No tasks
                </p>
              ) : (
                <div className="space-y-1.5">
                  {dayTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-start gap-1.5 px-2 py-1.5 rounded-lg ${
                        isTodayDate
                          ? "bg-neutral-800"
                          : task.completed
                          ? "bg-neutral-50"
                          : "bg-white"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                        className="h-3 w-3 rounded border-neutral-300 accent-neutral-700 shrink-0 mt-0.5 cursor-pointer"
                      />
                      <div className="min-w-0 flex-1">
                        <Link
                          href={`/tasks/${task.id}/edit`}
                          className={`text-[11px] leading-tight block truncate hover:underline ${
                            task.completed
                              ? isTodayDate
                                ? "text-neutral-600 line-through"
                                : "text-neutral-400 line-through"
                              : isTodayDate
                              ? "text-neutral-200"
                              : "text-neutral-700"
                          }`}
                        >
                          {task.title}
                        </Link>
                        {!task.completed && (
                          <>
                            {task.time && (
                              <span className="text-[9px] font-mono text-neutral-400 block mt-0.5">{task.time}</span>
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
