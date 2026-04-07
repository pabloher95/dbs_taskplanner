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
      <div className="mb-10">
        <p className="text-xs uppercase tracking-widest text-indigo-400/70 mb-1 font-medium">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tighter">
          Daily Planner
        </h1>
      </div>
    <div className="grid grid-cols-4 gap-4" style={{ gridTemplateRows: `auto ${overdue.length > 0 ? "auto " : ""}1fr${completed.length > 0 ? " auto" : ""}` }}>
      <div className="col-span-1 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-indigo-200/50 hover-lift hover:shadow-xl hover:shadow-indigo-300/50 animate-pop-in" style={{ animationDelay: "0ms" }}>
        <p className="text-[10px] uppercase tracking-widest text-indigo-300">Today</p>
        <p className="text-5xl font-extrabold text-white mt-2">{todayTotal}</p>
        {todayTotal > 0 && (
          <p className="text-xs text-indigo-300 mt-1">
            {completedToday} done
          </p>
        )}
      </div>

      <div className={`col-span-1 rounded-3xl p-6 flex flex-col justify-between hover-lift animate-pop-in ${overdue.length > 0 ? "bg-gradient-to-br from-red-500 to-red-600 shadow-lg shadow-red-200/50 hover:shadow-xl hover:shadow-red-300/50" : "bg-white/60 backdrop-blur-sm border border-white/80 hover:shadow-lg hover:shadow-indigo-100/40"}`} style={{ animationDelay: "80ms" }}>
        <p className={`text-[10px] uppercase tracking-widest ${overdue.length > 0 ? "text-red-200" : "text-slate-400"}`}>
          Overdue
        </p>
        <p className={`text-5xl font-extrabold mt-2 ${overdue.length > 0 ? "text-white" : "text-slate-300"}`}>
          {overdue.length}
        </p>
      </div>

      <div className="col-span-1 bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-6 flex flex-col justify-between hover-lift hover:shadow-lg hover:shadow-indigo-100/40 animate-pop-in" style={{ animationDelay: "160ms" }}>
        <p className="text-[10px] uppercase tracking-widest text-slate-400">Active</p>
        <p className="text-5xl font-extrabold text-slate-800 mt-2">{totalActive}</p>
      </div>

      <div className="col-span-1 bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-6 flex flex-col animate-slide-in-left" style={{ gridRow: "1 / -1", animationDelay: "200ms" }}>
        <p className="text-[10px] uppercase tracking-widest text-slate-400 mb-4 font-medium">Navigate</p>
        <div className="flex flex-col flex-1 justify-between gap-2">
          {[
            { href: "/tasks/new", label: "New Task" },
            { href: `/day/${todayStr}`, label: "Day View" },
            { href: "/week", label: "Week" },
            { href: "/board", label: "Board" },
          ].map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 rounded-2xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 hover:scale-[1.05] hover:shadow-lg hover:shadow-indigo-300/40 active:scale-[0.97] transition-all duration-200 animate-scale-in"
              style={{ animationDelay: `${300 + i * 80}ms` }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="col-span-3 bg-red-50/80 backdrop-blur-sm border border-red-200/40 rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-red-400 mb-3">
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

      <div className={`${overdue.length > 0 ? "col-span-4" : "col-span-3"} bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-6 animate-fade-in-up`} style={{ animationDelay: "250ms" }}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-5">
          Upcoming
        </p>
        {upcoming.length === 0 ? (
          <div className="py-14 text-center">
            <p className="text-sm text-slate-300 font-medium">Nothing ahead</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {upcoming.map((task, i) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3.5 rounded-2xl bg-white/70 border border-white hover:bg-white hover:shadow-md hover:shadow-indigo-100/50 hover:scale-[1.02] active:scale-[0.99] transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${350 + i * 70}ms` }}
              >
                <input
                  type="checkbox"
                  onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 shrink-0 cursor-pointer"
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
                  <Link href={`/tasks/${task.id}/edit`} className="text-sm font-semibold text-slate-800 truncate hover:underline">
                    {task.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.time && (
                      <span className="text-[10px] font-mono text-indigo-400">{task.time}</span>
                    )}
                    <span className="text-[10px] text-slate-400">{task.category}</span>
                    <span className="text-[10px] font-mono text-slate-400">
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
        <div className="col-span-4 bg-white/60 backdrop-blur-sm border border-white/80 rounded-3xl p-6">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
            Completed
          </p>
          <div className="grid grid-cols-2 gap-2">
            {completed.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-50/80"
              >
                <input
                  type="checkbox"
                  checked
                  onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                  className="h-3.5 w-3.5 rounded border-slate-300 accent-indigo-600 shrink-0 cursor-pointer"
                />
                <Link href={`/tasks/${task.id}/edit`} className="text-sm text-slate-400 line-through truncate hover:underline">
                  {task.title}
                </Link>
                <span className="text-[10px] font-mono text-slate-300 ml-auto shrink-0">
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
