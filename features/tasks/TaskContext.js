"use client";

import { createContext, useContext, useReducer } from "react";

const TaskContext = createContext(null);
const TaskDispatchContext = createContext(null);

const CATEGORIES = ["job prep", "workout", "reading", "general tasks"];
const PRIORITIES = ["High", "Medium", "Low"];

function taskReducer(state, action) {
  switch (action.type) {
    case "ADD_TASK":
      return [
        ...state,
        {
          id: Date.now().toString(),
          title: action.payload.title,
          deadline: action.payload.deadline,
          time: action.payload.time || "",
          category: action.payload.category,
          priority: action.payload.priority,
          notes: action.payload.notes || "",
          completed: false,
          createdAt: new Date().toISOString(),
        },
      ];
    case "TOGGLE_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      );
    case "DELETE_TASK":
      return state.filter((task) => task.id !== action.payload.id);
    case "EDIT_TASK":
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, ...action.payload.updates }
          : task
      );
    default:
      return state;
  }
}

export function TaskProvider({ children }) {
  const [tasks, dispatch] = useReducer(taskReducer, []);

  return (
    <TaskContext.Provider value={tasks}>
      <TaskDispatchContext.Provider value={dispatch}>
        {children}
      </TaskDispatchContext.Provider>
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}

export function useTaskDispatch() {
  return useContext(TaskDispatchContext);
}

export { CATEGORIES, PRIORITIES };
