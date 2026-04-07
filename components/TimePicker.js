"use client";

const hours = Array.from({ length: 12 }, (_, i) => i + 1);
const minutes = ["00", "15", "30", "45"];
const periods = ["AM", "PM"];

export default function TimePicker({ value, onChange }) {
  // Parse "HH:MM" 24h format into parts
  let selHour = "";
  let selMin = "";
  let selPeriod = "AM";

  if (value) {
    const [h, m] = value.split(":");
    const hour24 = parseInt(h, 10);
    selPeriod = hour24 >= 12 ? "PM" : "AM";
    selHour = hour24 === 0 ? "12" : hour24 > 12 ? String(hour24 - 12) : String(hour24);
    selMin = m;
  }

  function buildValue(hour, min, period) {
    if (!hour || !min) return "";
    let h = parseInt(hour, 10);
    if (period === "AM" && h === 12) h = 0;
    if (period === "PM" && h !== 12) h += 12;
    return `${String(h).padStart(2, "0")}:${min}`;
  }

  function handleChange(newHour, newMin, newPeriod) {
    const h = newHour || selHour;
    const m = newMin || selMin;
    const p = newPeriod || selPeriod;
    if (h && m) {
      onChange(buildValue(h, m, p));
    }
  }

  return (
    <div className="flex items-center gap-1.5">
      <select
        value={selHour}
        onChange={(e) => handleChange(e.target.value, null, null)}
        className="text-sm text-stone-800 bg-transparent focus:outline-none appearance-none cursor-pointer"
      >
        <option value="">--</option>
        {hours.map((h) => (
          <option key={h} value={String(h)}>{h}</option>
        ))}
      </select>
      <span className="text-stone-400">:</span>
      <select
        value={selMin}
        onChange={(e) => handleChange(null, e.target.value, null)}
        className="text-sm text-stone-800 bg-transparent focus:outline-none appearance-none cursor-pointer"
      >
        <option value="">--</option>
        {minutes.map((m) => (
          <option key={m} value={m}>{m}</option>
        ))}
      </select>
      <select
        value={selPeriod}
        onChange={(e) => handleChange(null, null, e.target.value)}
        className="text-sm text-stone-800 bg-transparent focus:outline-none appearance-none cursor-pointer"
      >
        {periods.map((p) => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      {value && (
        <button
          type="button"
          onClick={() => onChange("")}
          className="text-stone-300 hover:text-stone-500 text-sm ml-1"
        >
          &times;
        </button>
      )}
    </div>
  );
}
