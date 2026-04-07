"use client";

import Link from "next/link";
import { useTasks, useTaskDispatch } from "@/features/tasks/TaskContext";
import { parseISO, isAfter, startOfDay, format } from "date-fns";
import AnimatedNumber from "@/components/AnimatedNumber";

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
        <p className="text-xs uppercase tracking-widest text-neutral-400 mb-1">
          {format(today, "EEEE, MMMM d")}
        </p>
        <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">
          Daily Planner
        </h1>
      </div>
    <div className="grid grid-cols-4 gap-3" style={{ gridTemplateRows: `auto ${overdue.length > 0 ? "auto " : ""}1fr${completed.length > 0 ? " auto" : ""}` }}>
      <div className="col-span-1 bg-neutral-900 rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
        <p className="text-[10px] uppercase tracking-widest text-neutral-500">Today</p>
        <AnimatedNumber value={todayTotal} className="text-4xl font-bold text-white mt-2 block" />
        {todayTotal > 0 && (
          <p className="text-xs text-neutral-500 mt-1">
            {completedToday} done
          </p>
        )}
      </div>

      <div className={`col-span-1 rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200 ${overdue.length > 0 ? "bg-red-500" : "bg-neutral-100"}`}>
        <p className={`text-[10px] uppercase tracking-widest ${overdue.length > 0 ? "text-red-200" : "text-neutral-400"}`}>
          Overdue
        </p>
        <AnimatedNumber value={overdue.length} className={`text-4xl font-bold mt-2 block ${overdue.length > 0 ? "text-white" : "text-neutral-300"}`} />
      </div>

      <div className="col-span-1 bg-neutral-100 rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.02] transition-transform duration-200">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400">Active</p>
        <AnimatedNumber value={totalActive} className="text-4xl font-bold text-neutral-800 mt-2 block" />
      </div>

      <div className="col-span-1 bg-white border border-neutral-200 rounded-2xl p-5 flex flex-col" style={{ gridRow: "1 / -1" }}>
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-3">Navigate</p>
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
              className="block px-4 py-3 rounded-xl text-sm font-medium text-neutral-700 bg-neutral-50 hover:bg-neutral-900 hover:text-white hover:scale-[1.02] transition-all duration-200"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>

      {overdue.length > 0 && (
        <div className="col-span-3 bg-red-50 border border-red-200/60 rounded-2xl p-5">
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

      <div className={`${overdue.length > 0 ? "col-span-4" : "col-span-3"} bg-white border border-neutral-200 rounded-2xl p-5`}>
        <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
          Upcoming
        </p>
        {upcoming.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-sm text-neutral-300">Nothing ahead</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {upcoming.map((task, i) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 hover:scale-[1.01] transition-all duration-200 animate-fade-in-up"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <input
                  type="checkbox"
                  onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                  className="h-3.5 w-3.5 rounded border-neutral-300 accent-neutral-700 shrink-0 cursor-pointer"
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
                  <Link href={`/tasks/${task.id}/edit`} className="text-sm font-medium text-neutral-800 truncate hover:underline">
                    {task.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    {task.time && (
                      <span className="text-[10px] font-mono text-neutral-500">{task.time}</span>
                    )}
                    <span className="text-[10px] text-neutral-400">{task.category}</span>
                    <span className="text-[10px] font-mono text-neutral-400">
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
        <div className="col-span-4 bg-white border border-neutral-200 rounded-2xl p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-4">
            Completed
          </p>
          <div className="grid grid-cols-2 gap-2">
            {completed.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-4 py-3 rounded-xl bg-neutral-50"
              >
                <input
                  type="checkbox"
                  checked
                  onChange={() => dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })}
                  className="h-3.5 w-3.5 rounded border-neutral-300 accent-neutral-700 shrink-0 cursor-pointer"
                />
                <Link href={`/tasks/${task.id}/edit`} className="text-sm text-neutral-400 line-through truncate hover:underline">
                  {task.title}
                </Link>
                <span className="text-[10px] font-mono text-neutral-300 ml-auto shrink-0">
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
