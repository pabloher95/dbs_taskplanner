"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useTasks, useTaskDispatch, CATEGORIES, PRIORITIES } from "@/features/tasks/TaskContext";

export default function EditTaskPage() {
  const params = useParams();
  const router = useRouter();
  const tasks = useTasks();
  const dispatch = useTaskDispatch();

  const task = tasks.find((t) => t.id === params.id);

  const [title, setTitle] = useState("");
  const [deadline, setDeadline] = useState("");
  const [time, setTime] = useState("");
  const [category, setCategory] = useState(CATEGORIES[3]);
  const [priority, setPriority] = useState(PRIORITIES[1]);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDeadline(task.deadline);
      setTime(task.time || "");
      setCategory(task.category);
      setPriority(task.priority);
      setNotes(task.notes || "");
    }
  }, [task]);

  if (!task) {
    return (
      <div className="max-w-xl mx-auto mt-16 px-6 text-center">
        <p className="text-sm text-neutral-400">Task not found</p>
        <Link href="/" className="text-xs text-neutral-400 hover:text-neutral-600 mt-4 inline-block">
          &larr; Home
        </Link>
      </div>
    );
  }

  const priorityActiveColors = {
    High: "bg-red-500 text-white",
    Medium: "bg-amber-500 text-white",
    Low: "bg-emerald-500 text-white",
  };

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: "EDIT_TASK",
      payload: {
        id: task.id,
        updates: {
          title: title.trim(),
          deadline,
          time,
          category,
          priority,
          notes: notes.trim(),
        },
      },
    });

    router.push("/");
  }

  function handleDelete() {
    dispatch({ type: "DELETE_TASK", payload: { id: task.id } });
    router.push("/");
  }

  return (
    <div className="max-w-xl mx-auto mt-12 px-6">
      <Link
        href="/"
        className="text-xs text-neutral-400 hover:text-neutral-600 transition-colors"
      >
        &larr; Home
      </Link>
      <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mt-2 mb-8">
        Edit Task
      </h1>

      <form onSubmit={handleSubmit}>
        <div className="bg-white border border-neutral-200 rounded-2xl divide-y divide-neutral-100">
          <div className="p-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              className="w-full text-sm text-neutral-800 placeholder:text-neutral-300 bg-transparent focus:outline-none"
            />
          </div>

          <div className="p-5 flex gap-8">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Deadline
              </label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className="text-sm text-neutral-800 bg-transparent focus:outline-none"
              />
            </div>
            <div className="w-px bg-neutral-100" />
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
                Time <span className="normal-case tracking-normal font-normal">(optional)</span>
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="text-sm text-neutral-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>

          <div className="p-5 flex gap-8">
            <div className="flex-1">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
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
                        ? "bg-neutral-900 text-white"
                        : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-px bg-neutral-100" />

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-3">
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
                        : "bg-neutral-50 text-neutral-500 hover:bg-neutral-100"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-5">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400 mb-2">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional details (optional)"
              rows={3}
              className="w-full text-sm text-neutral-800 placeholder:text-neutral-300 bg-transparent resize-none focus:outline-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-5">
          <button
            type="submit"
            className="flex-1 py-3 rounded-2xl bg-neutral-900 text-white text-sm font-medium hover:bg-neutral-800 transition-colors"
          >
            Save Changes
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-2xl border border-neutral-200 text-sm font-medium text-neutral-500 hover:bg-neutral-50 transition-colors text-center"
          >
            Cancel
          </Link>
        </div>
      </form>

      <button
        onClick={handleDelete}
        className="w-full mt-3 py-3 rounded-2xl text-sm font-medium text-red-400 hover:bg-red-50 transition-colors"
      >
        Delete Task
      </button>
    </div>
  );
}
