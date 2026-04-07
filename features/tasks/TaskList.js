"use client";

import { useTasks, useTaskDispatch } from "./TaskContext";
import { format, isBefore, parseISO, startOfDay } from "date-fns";

const priorityColors = {
  High: "bg-red-50 text-red-700 border-red-200",
  Medium: "bg-amber-50 text-amber-700 border-amber-200",
  Low: "bg-green-50 text-green-700 border-green-200",
};

export default function TaskList({ selectedDate }) {
  const tasks = useTasks();
  const dispatch = useTaskDispatch();
  const dateStr = format(selectedDate, "yyyy-MM-dd");
  const today = startOfDay(new Date());

  const dayTasks = tasks.filter((task) => task.deadline === dateStr);
  const sortedTasks = [...dayTasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const priorityOrder = { High: 0, Medium: 1, Low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  if (sortedTasks.length === 0) {
    return (
      <p className="text-sm text-neutral-400 py-8 text-center">
        No tasks for this day
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {sortedTasks.map((task) => {
        const isOverdue =
          !task.completed &&
          isBefore(parseISO(task.deadline), today);

        return (
          <div
            key={task.id}
            className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
              isOverdue
                ? "border-red-300 bg-red-50"
                : "border-neutral-200 bg-white"
            }`}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() =>
                dispatch({ type: "TOGGLE_TASK", payload: { id: task.id } })
              }
              className="mt-0.5 h-4 w-4 rounded border-neutral-300 accent-neutral-700"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm ${
                    task.completed
                      ? "line-through text-neutral-400"
                      : "text-neutral-800"
                  }`}
                >
                  {task.title}
                </span>
                {isOverdue && (
                  <span className="text-xs px-1.5 py-0.5 rounded bg-red-100 text-red-600 font-medium">
                    Overdue
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-1.5 py-0.5 rounded border ${
                    priorityColors[task.priority]
                  }`}
                >
                  {task.priority}
                </span>
                <span className="text-xs text-neutral-400">{task.category}</span>
              </div>
              {task.notes && (
                <p className="text-xs text-neutral-500 mt-1">{task.notes}</p>
              )}
            </div>
            <button
              onClick={() =>
                dispatch({ type: "DELETE_TASK", payload: { id: task.id } })
              }
              className="text-neutral-400 hover:text-red-500 text-sm transition-colors"
            >
              ×
            </button>
          </div>
        );
      })}
    </div>
  );
}
