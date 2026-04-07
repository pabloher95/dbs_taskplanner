"use client";

import { format, addDays, subDays, isToday } from "date-fns";

export default function DayNavigation({ selectedDate, onDateChange }) {
  return (
    <div className="flex items-center gap-4">
      <button
        onClick={() => onDateChange(subDays(selectedDate, 1))}
        className="text-neutral-400 hover:text-neutral-600 text-lg px-2 transition-colors"
      >
        ←
      </button>
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-semibold text-neutral-800">
          {format(selectedDate, "EEEE, MMMM d")}
        </h2>
        {isToday(selectedDate) && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 font-medium">
            Today
          </span>
        )}
        <input
          type="date"
          value={format(selectedDate, "yyyy-MM-dd")}
          onChange={(e) => {
            if (e.target.value) onDateChange(new Date(e.target.value + "T00:00:00"));
          }}
          className="text-sm border border-neutral-200 rounded-md px-2 py-1 text-neutral-600 focus:outline-none focus:ring-2 focus:ring-neutral-300"
        />
      </div>
      <button
        onClick={() => onDateChange(addDays(selectedDate, 1))}
        className="text-neutral-400 hover:text-neutral-600 text-lg px-2 transition-colors"
      >
        →
      </button>
    </div>
  );
}
