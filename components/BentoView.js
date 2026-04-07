"use client";

import Link from "next/link";
import { useTasks, useTaskDispatch } from "@/features/tasks/TaskContext";
import { parseISO, isAfter, startOfDay, format } from "date-fns";


export default function BentoView() {
  const tasks = useTasks();
  const dispatch = useTaskDispatch();
  const today = startOfDay(new Date());
  const todayStr = format(today, "yyyy-MM-dd");

  const upcoming = tasks
    .filter(
      (t) =>
        !t.completed &&
        (isAfter(parseISO(t.deadline), today) ||
          parseISO(t.deadline).getTime() === today.getTime())
    )
    .sort((a, b) => {
      const dateDiff = parseISO(a.deadline) - parseISO(b.deadline);
      if (dateDiff !== 0) return dateDiff;
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    })
    .slice(0, 6);

  const overdue = tasks.filter(
    (t) => !t.completed && parseISO(t.deadline) < today
  );

  const completedToday = tasks.filter(
    (t) => t.completed && t.deadline === todayStr
  ).length;
  const todayTotal = tasks.filter((t) => t.deadline === todayStr).length;
  const totalActive = tasks.filter((t) => !t.completed).length;
  const completed = tasks.filter((t) => t.completed);

  return (
    <div className="max-w-4xl mx-auto mt-12 px-6">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-stone-400 mb-1">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
          Daily Planner
        </h1>
      </div>
    <div className="grid grid-cols-4 gap-3" style={{ gridTemplateRows: `auto ${overdue.length > 0 ? "auto " : ""}1fr${completed.length > 0 ? " auto" : ""}` }}>
      <div className="col-span-1 bg-stone-900 rounded-2xl p-6 flex flex-col justify-between">
        <p className="text-[10px] uppercase tracking-widest text-stone-500">Today</p>
        <p className="text-4xl font-extrabold text-white mt-2">{todayTotal}</p>
        {todayTotal > 0 && (
          <p className="text-xs text-stone-500 mt-1">
            {completedToday} done
          </p>
        )}
      </div>

      <div className={`col-span-1 rounded-2xl p-5 flex flex-col justify-between ${overdue.length > 0 ? "bg-red-500" : "bg-stone-100"}`}>
        <p className={`text-[10px] uppercase tracking-widest ${overdue.length > 0 ? "text-red-200" : "text-stone-400"}`}>
          Overdue
        </p>
        <p className={`text-4xl font-extrabold mt-2 ${overdue.length > 0 ? "text-white" : "text-stone-300"}`}>
          {overdue.length}
        </p>
      </div>

      <div className="col-span-1 bg-stone-100 rounded-2xl p-5 flex flex-col justify-between">
        <p className="text-[10px] uppercase tracking-widest text-stone-400">Active</p>
        <p className="text-4xl font-extrabold text-stone-800 mt-2">{totalActive}</p>
      </div>

      <div className="col-span-1 bg-white shadow-sm rounded-2xl p-6 flex flex-col" style={{ gridRow: "1 / -1" }}>
        <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-3">Navigate</p>
        <div className="flex flex-col flex-1 justify-between">
          {[
            { href: "/tasks/new", label: "New Task" },
            { href: `/day/${todayStr}`, label: "Day View" },
            { href: "/week", label: "Week" },
            { href: "/board", label: "Board" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-xl text-sm font-medium text-stone-700 bg-stone-50 hover:bg-amber-600 hover:text-white transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="col-span-3 bg-red-50 border border-red-200/60 rounded-2xl p-5">
          <p className="text-[10px] font-medium uppercase tracking-widest text-red-400 mb-3">
            Overdue tasks
          </p>
          <div className="grid grid-cols-3 gap-2">
            {overdue.slice(0, 6).map((task) => (
              <div key={task.id} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/70">
                <input
                  type="checkbox"
                  onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                  className="h-3.5 w-3.5 rounded border-red-300 accent-red-500 shrink-0 cursor-pointer"
                />
                <div className="min-w-0">
                  <Link href={`/tasks/${task.id}/edit`} className="text-xs font-medium text-red-800 truncate hover:underline">{task.title}</Link>
                  <p className="text-[10px] text-red-400">{format(parseISO(task.deadline), "MMM d")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className={`${overdue.length > 0 ? "col-span-4" : "col-span-3"} bg-white shadow-sm rounded-2xl p-6`}>
        <p className="text-[10px] font-medium uppercase tracking-widest text-stone-400 mb-4">
          Upcoming
        </p>
        {upcoming.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-stone-300">Nothing ahead</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {upcoming.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-50 hover:bg-stone-100 transition-colors"
              >
                <input
                  type="checkbox"
                  onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                  className="h-3.5 w-3.5 rounded border-stone-300 accent-stone-700 shrink-0 cursor-pointer"
                />
                <div
                  className={`w-1 h-8 rounded-full shrink-0 ${
                    task.priority === "High"
                      ? "bg-red-400"
                      : task.priority === "Medium"
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <Link href={`/tasks/${task.id}/edit`} className="text-sm font-medium text-stone-800 truncate hover:underline">
                    {task.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.time && (
                      <span className="text-[10px] font-mono text-stone-500">{task.time}</span>
                    )}
                    <span className="text-[10px] text-stone-400">{task.category}</span>
                    <span className="text-[10px] font-mono text-stone-400">
                      {format(parseISO(task.deadline), "MMM d")}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {completed.length > 0 && (
        <div className="col-span-4 bg-white shadow-sm rounded-2xl p-6">
          <p className="text-[10px] font-medium uppercase tracking-widest text-stone-400 mb-4">
            Completed
          </p>
          <div className="grid grid-cols-2 gap-2">
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
                <Link href={`/tasks/${task.id}/edit`} className="text-sm text-stone-400 line-through truncate hover:underline">
                  {task.title}
                </Link>
                <span className="text-[10px] font-mono text-stone-300 ml-auto shrink-0">
                  {format(parseISO(task.deadline), "MMM d")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
    </div>
  );
}
