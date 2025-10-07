import React from "react";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import TaskCard from "./TaskCard";

const KanbanColumn = ({ id, title, tasks, onReviewClick }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  // Column ke border color ke liye aasan logic
  const columnStyles = {
    Completed: "border-green-500",
    "In Progress": "border-yellow-500",
    "Under Review": "border-purple-500",
    "To Do": "border-blue-500",
  };

  return (
    <div className="bg-[#1a103d]/80 backdrop-blur-sm border border-pink-500/30 rounded-2xl p-4 flex flex-col">
      <h3
        className={`font-semibold mb-4 text-lg text-center pb-2 border-b-2 ${
          columnStyles[id] || "border-gray-500"
        }`}
      >
        {title}
      </h3>

      <SortableContext
        id={id}
        items={tasks.map((t) => t._id)}
        strategy={verticalListSortingStrategy}
      >
        <div
          ref={setNodeRef}
          className={`flex-grow min-h-[200px] p-2 rounded-lg transition-colors ${
            isOver ? "bg-[#2a1f52]/50" : ""
          }`}
        >
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onReviewClick={onReviewClick} // onReviewClick ko pass karein
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default KanbanColumn;
