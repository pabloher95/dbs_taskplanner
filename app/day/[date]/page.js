"use client";

import { useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  parseISO,
  format,
  addDays,
  subDays,
  isToday,
  isBefore,
  startOfDay,
} from "date-fns";
import { useTasks, useTaskDispatch } from "@/features/tasks/TaskContext";

const priorityColors = {
  High: "bg-red-400",
  Medium: "bg-amber-400",
  Low: "bg-emerald-400",
};

const priorityActiveColors = {
  High: "bg-red-500 text-white",
  Medium: "bg-amber-500 text-white",
  Low: "bg-emerald-500 text-white",
};

export default function DayPage() {
  const params = useParams();
  const selectedDate = parseISO(params.date);
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const today = startOfDay(new Date());

  const tasks = useTasks();
  const dispatch = useTaskDispatch();
  const [sortBy, setSortBy] = useState("priority");

  const dayTasks = useMemo(() => {
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
  }, [tasks, dateStr, sortBy]);

  const active = dayTasks.filter((t) => !t.completed);
  const completed = dayTasks.filter((t) => t.completed);
  const isOverdueDay = isBefore(selectedDate, today);

  const prevDate = format(subDays(selectedDate, 1), "yyyy-MM-dd");
  const nextDate = format(addDays(selectedDate, 1), "yyyy-MM-dd");

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      <Link
        href="/"
        className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
      >
        &larr; Home
      </Link>

      {/* Day nav */}
      <div className="flex items-center gap-4 mt-3 mb-8">
        <div className="flex items-center gap-2">
          <Link
            href={`/day/${prevDate}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-stone-700 hover:border-stone-300 transition-colors"
          >
            &larr;
          </Link>
          <Link
            href={`/day/${nextDate}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white border border-stone-200 text-stone-400 hover:text-stone-700 hover:border-stone-300 transition-colors"
          >
            &rarr;
          </Link>
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
            {format(selectedDate, "EEEE, MMMM d")}
          </h1>
          {isToday(selectedDate) && (
            <p className="text-xs text-stone-400 mt-0.5">Today</p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/tasks/new?date=${dateStr}`}
            className="text-xs font-medium px-3 py-2 rounded-xl bg-amber-600 text-white hover:bg-amber-500 transition-colors"
          >
            + Add Task
          </Link>
          {!isToday(selectedDate) && (
            <Link
              href={`/day/${format(today, "yyyy-MM-dd")}`}
              className="text-xs font-medium px-3 py-2 rounded-xl border border-stone-200 bg-white text-stone-600 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-colors"
            >
              Today
            </Link>
          )}
          <input
            type="date"
            value={dateStr}
            onChange={(e) => {
              if (e.target.value) window.location.href = `/day/${e.target.value}`;
            }}
            className="text-xs border border-stone-200 rounded-xl px-3 py-2 text-stone-500 bg-white focus:outline-none focus:ring-2 focus:ring-stone-200"
          />
        </div>
      </div>

      <div>
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-stone-900 rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-stone-500">Tasks</p>
              <p className="text-3xl font-bold text-white mt-1">{dayTasks.length}</p>
            </div>
            <div className="bg-stone-100 rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-stone-400">Active</p>
              <p className="text-3xl font-bold text-stone-800 mt-1">{active.length}</p>
            </div>
            <div className={`rounded-2xl p-4 ${completed.length > 0 ? "bg-emerald-50" : "bg-stone-100"}`}>
              <p className={`text-[10px] uppercase tracking-widest ${completed.length > 0 ? "text-emerald-400" : "text-stone-400"}`}>Done</p>
              <p className={`text-3xl font-bold mt-1 ${completed.length > 0 ? "text-emerald-600" : "text-stone-300"}`}>{completed.length}</p>
            </div>
          </div>

          {/* Active tasks */}
          <div className="bg-white shadow-sm rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {isOverdueDay ? "Overdue" : "Tasks"}
              </p>
              <div className="flex bg-stone-100 rounded-lg p-0.5">
                <button
                  onClick={() => setSortBy("priority")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    sortBy === "priority"
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Priority
                </button>
                <button
                  onClick={() => setSortBy("time")}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-medium transition-colors ${
                    sortBy === "time"
                      ? "bg-white text-stone-900 shadow-sm"
                      : "text-stone-500 hover:text-stone-700"
                  }`}
                >
                  Time
                </button>
              </div>
            </div>
            {active.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-stone-300">
                  {dayTasks.length === 0 ? "No tasks for this day" : "All done!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {active.map((task) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isOverdueDay
                        ? "bg-red-50 hover:bg-red-100/70"
                        : "bg-stone-50 hover:bg-stone-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                      className="h-3.5 w-3.5 rounded border-stone-300 accent-stone-700 shrink-0 cursor-pointer"
                    />
                    <div className={`w-1 h-8 rounded-full shrink-0 ${priorityColors[task.priority]}`} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/tasks/${task.id}/edit`} className="text-sm font-medium text-stone-800 hover:underline">{task.title}</Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.time && (
                          <span className="text-[10px] font-mono text-stone-500">{task.time}</span>
                        )}
                        <span className="text-[10px] text-stone-400">{task.category}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${priorityActiveColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-stone-400 mt-1">{task.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch({ type: "DELETE_TASK", payload: { id: task.id } })}
                      className="text-stone-300 hover:text-red-400 transition-colors text-lg"
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed tasks */}
          {completed.length > 0 && (
            <div className="bg-white shadow-sm rounded-2xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-4">
                Completed
              </p>
              <div className="space-y-2">
                {completed.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-50"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                      className="h-3.5 w-3.5 rounded border-stone-300 accent-stone-700 shrink-0 cursor-pointer"
                    />
                    <Link href={`/tasks/${task.id}/edit`} className="text-sm text-stone-400 line-through truncate hover:underline">{task.title}</Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

