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
        className="text-xs text-slate-400 hover:text-indigo-500 transition-colors"
      >
        &larr; Home
      </Link>

      {/* Day nav */}
      <div className="flex items-center gap-4 mt-3 mb-10">
        <div className="flex items-center gap-2">
          <Link
            href={`/day/${prevDate}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md border border-white/80 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
          >
            &larr;
          </Link>
          <Link
            href={`/day/${nextDate}`}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/80 backdrop-blur-md border border-white/80 text-slate-400 hover:text-indigo-600 hover:border-indigo-200 transition-all duration-200"
          >
            &rarr;
          </Link>
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">
            {format(selectedDate, "EEEE, MMMM d")}
          </h1>
          {isToday(selectedDate) && (
            <p className="text-xs text-indigo-400 mt-0.5 font-medium">Today</p>
          )}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/tasks/new?date=${dateStr}`}
            className="text-xs font-semibold px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-[1.05] hover:shadow-lg hover:shadow-indigo-300/50 active:scale-[0.97] shadow-md shadow-indigo-200/50 transition-all duration-200"
          >
            + Add Task
          </Link>
          {!isToday(selectedDate) && (
            <Link
              href={`/day/${format(today, "yyyy-MM-dd")}`}
              className="text-xs font-medium px-3 py-2 rounded-xl bg-white/80 backdrop-blur-md border border-white/80 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-200"
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
            className="text-xs border border-white/80 rounded-xl px-3 py-2 text-slate-500 bg-white/80 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-indigo-200"
          />
        </div>
      </div>

      <div>
        <div className="space-y-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-5 shadow-lg shadow-indigo-200/50 hover-lift hover:shadow-xl hover:shadow-indigo-300/50 animate-pop-in" style={{ animationDelay: "0ms" }}>
              <p className="text-[10px] uppercase tracking-widest text-indigo-300">Tasks</p>
              <p className="text-4xl font-extrabold text-white mt-1">{dayTasks.length}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl p-5 hover-lift hover:shadow-lg hover:shadow-indigo-100/40 animate-pop-in" style={{ animationDelay: "80ms" }}>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Active</p>
              <p className="text-4xl font-extrabold text-slate-800 mt-1">{active.length}</p>
            </div>
            <div className={`rounded-3xl p-5 hover-lift animate-pop-in ${completed.length > 0 ? "bg-emerald-50/80 border border-emerald-200/40 hover:shadow-lg hover:shadow-emerald-100/40" : "bg-white/80 backdrop-blur-md border border-white/80 hover:shadow-lg hover:shadow-indigo-100/40"}`} style={{ animationDelay: "160ms" }}>
              <p className={`text-[10px] uppercase tracking-widest ${completed.length > 0 ? "text-emerald-400" : "text-slate-400"}`}>Done</p>
              <p className={`text-4xl font-extrabold mt-1 ${completed.length > 0 ? "text-emerald-600" : "text-slate-300"}`}>{completed.length}</p>
            </div>
          </div>

          {/* Active tasks */}
          <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl p-6 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between mb-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                {isOverdueDay ? "Overdue" : "Tasks"}
              </p>
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
            {active.length === 0 ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-300 font-medium">
                  {dayTasks.length === 0 ? "No tasks for this day" : "All done!"}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {active.map((task, i) => (
                  <div
                    key={task.id}
                    className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.99] animate-fade-in-up ${
                      isOverdueDay
                        ? "bg-red-50/80 hover:bg-red-100/70 hover:shadow-md hover:shadow-red-100/50"
                        : "bg-white/85 border border-white hover:bg-white hover:shadow-md hover:shadow-indigo-100/50"
                    }`}
                    style={{ animationDelay: `${300 + i * 60}ms` }}
                  >
                    <input
                      type="checkbox"
                      onChange={(e) => { e.target.classList.add('animate-check-bounce'); dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } }); }}
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 shrink-0 cursor-pointer"
                    />
                    <div className={`w-1 h-8 rounded-full shrink-0 ${priorityColors[task.priority]}`} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/tasks/${task.id}/edit`} className="text-sm font-semibold text-slate-800 hover:underline">{task.title}</Link>
                      <div className="flex items-center gap-2 mt-0.5">
                        {task.time && (
                          <span className="text-[10px] font-mono text-indigo-400">{task.time}</span>
                        )}
                        <span className="text-[10px] text-slate-400">{task.category}</span>
                        <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${priorityActiveColors[task.priority]}`}>
                          {task.priority}
                        </span>
                      </div>
                      {task.notes && (
                        <p className="text-xs text-slate-400 mt-1">{task.notes}</p>
                      )}
                    </div>
                    <button
                      onClick={() => dispatch({ type: "DELETE_TASK", payload: { id: task.id } })}
                      className="text-slate-300 hover:text-red-400 transition-colors text-lg"
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
            <div className="bg-white/80 backdrop-blur-md border border-white/80 rounded-3xl p-6">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
                Completed
              </p>
              <div className="space-y-2">
                {completed.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/80"
                  >
                    <input
                      type="checkbox"
                      checked
                      onChange={(e) => { e.target.classList.add('animate-check-bounce'); dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } }); }}
                      className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 shrink-0 cursor-pointer"
                    />
                    <Link href={`/tasks/${task.id}/edit`} className="text-sm text-slate-400 line-through truncate hover:underline">{task.title}</Link>
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
