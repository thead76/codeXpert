import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useAuth } from "../context/AuthContext";
import {
  ChevronsUp,
  ChevronUp,
  Equal,
  GripVertical,
  Folder,
} from "lucide-react";

const TaskCard = ({ task, onReviewClick, isDraggable }) => {
  // <-- isDraggable prop receive karein
  const { user } = useAuth();
  const isLeader = user?.role === "leader";

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id, disabled: !isDraggable }); // Dragging ko yahaan control karein

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityIcons = {
    High: (
      <ChevronsUp size={18} className="text-red-400" title="High Priority" />
    ),
    Medium: (
      <ChevronUp
        size={18}
        className="text-yellow-400"
        title="Medium Priority"
      />
    ),
    Low: <Equal size={18} className="text-green-400" title="Low Priority" />,
  };

  const statusBorderColor = {
    "To Do": "border-blue-500/50",
    "In Progress": "border-yellow-500/50",
    "Under Review": "border-purple-500/50",
    Completed: "border-green-500/50",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`bg-slate-900/70 p-4 rounded-xl border-l-4 ${
        statusBorderColor[task.status] || "border-gray-500"
      } mb-4 shadow-lg`}
    >
      <div className="flex justify-between items-start">
        <h4 className="font-bold text-white mb-2 flex-1 pr-2">{task.title}</h4>
        <div className="flex items-center gap-2">
          {priorityIcons[task.priority]}
          {/* --- YAHAN BADLAAV KIYA GAYA HAI --- */}
          {/* Drag handle sirf tab dikhega jab task draggable ho */}
          {isDraggable && (
            <button
              {...listeners}
              className="cursor-grab text-gray-500 hover:text-white focus:outline-none"
            >
              <GripVertical size={18} />
            </button>
          )}
        </div>
      </div>

      {task.team && (
        <div className="flex items-center gap-1.5 text-xs text-cyan-400 mb-2">
          <Folder size={14} />
          <span>{task.team.name}</span>
        </div>
      )}

      <p className="text-sm text-gray-400 mb-4 line-clamp-2">
        {task.description}
      </p>

      {task.reviewNotes && task.status === "To Do" && (
        <div className="text-xs bg-yellow-500/10 text-yellow-300 p-2 rounded-md mb-3">
          <strong>Leader's Feedback:</strong> {task.reviewNotes}
        </div>
      )}

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-xs text-gray-300">
          {task.assignedTo && (
            <>
              <img
                src={
                  task.assignedTo.avatar ||
                  `https://ui-avatars.com/api/?name=${task.assignedTo.name}&background=random`
                }
                alt={task.assignedTo.name}
                className="w-6 h-6 rounded-full"
              />
              <span>{task.assignedTo.name}</span>
            </>
          )}
        </div>
        {isLeader && task.status === "Under Review" && (
          <button
            onClick={() => onReviewClick(task)}
            className="text-xs bg-cyan-500 text-white px-3 py-1.5 rounded-md hover:bg-cyan-600 font-semibold"
          >
            Review
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;
