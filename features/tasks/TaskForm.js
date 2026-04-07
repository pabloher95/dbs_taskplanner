"use client";

import { useState } from "react";
import { useTaskDispatch, CATEGORIES, PRIORITIES } from "./TaskContext";
import { format } from "date-fns";

export default function TaskForm({ selectedDate }) {
  const dispatch = useTaskDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[3]);
  const [priority, setPriority] = useState(PRIORITIES[1]);
  const [notes, setNotes] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    dispatch({
      type: "ADD_TASK",
      payload: {
        title: title.trim(),
        deadline: format(selectedDate, "yyyy-MM-dd"),
        category,
        priority,
        notes: notes.trim(),
      },
    });

    setTitle("");
    setCategory(CATEGORIES[3]);
    setPriority(PRIORITIES[1]);
    setNotes("");
    setIsOpen(false);
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="w-full py-2.5 border-2 border-dashed border-neutral-300 rounded-lg text-sm text-neutral-500 hover:border-neutral-400 hover:text-neutral-600 transition-colors"
      >
        + Add task
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="border border-neutral-200 rounded-lg p-4 bg-white space-y-3">
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus
        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
      <div className="flex gap-3">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="flex-1 px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="flex-1 px-3 py-2 border border-neutral-200 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-neutral-300"
        >
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>
      <textarea
        placeholder="Notes (optional)"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        rows={2}
        className="w-full px-3 py-2 border border-neutral-200 rounded-md text-sm resize-none focus:outline-none focus:ring-2 focus:ring-neutral-300"
      />
      <div className="flex gap-2 justify-end">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-3 py-1.5 text-sm text-neutral-600 hover:text-neutral-800 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 bg-neutral-800 text-white text-sm rounded-md hover:bg-neutral-700 transition-colors"
        >
          Add
        </button>
      </div>
    </form>
  );
}
