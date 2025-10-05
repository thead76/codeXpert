import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";

const TaskCard = ({ task }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    // Add a z-index while dragging to ensure the card appears above others
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-[#2a1f52] p-4 mb-3 rounded-lg shadow-md border-l-4 transition-shadow ${
        isDragging ? "shadow-lg shadow-pink-500/40 scale-105" : ""
      } border-cyan-500 flex justify-between items-center`}
    >
      <p className="flex-1 pr-2">{task.content}</p>
      {/* The drag handle is now a button with the necessary event listeners */}
      <button {...listeners} className="cursor-grab active:cursor-grabbing p-1">
        <GripVertical size={20} className="text-gray-500" />
      </button>
    </div>
  );
};

export default TaskCard;
