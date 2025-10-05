import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Loader, UserCheck } from "lucide-react";
import KanbanColumn from "../components/KanbanColumn";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

// --- DUMMY DATA ---
const dummyTasksForMember = [
  {
    _id: "task-1",
    content: "Implement user authentication flow",
    status: "todo",
  },
  { _id: "task-2", content: "Design the main dashboard UI", status: "todo" },
  {
    _id: "task-3",
    content: "Develop the API for team creation",
    status: "inprogress",
  },
  {
    _id: "task-4",
    content: "Fix the bug in the navigation bar",
    status: "inprogress",
  },
  {
    _id: "task-5",
    content: "Write documentation for the login API",
    status: "completed",
  },
];
const dummyTasksForLeader = [
  {
    _id: "task-6",
    content: "Database schema design",
    status: "completed",
    assignedTo: "Rohan",
  },
  {
    _id: "task-7",
    content: "Set up CI/CD pipeline",
    status: "inprogress",
    assignedTo: "Priya",
  },
  {
    _id: "task-8",
    content: "Create user profile modal",
    status: "todo",
    assignedTo: "Amit",
  },
  {
    _id: "task-9",
    content: "Research WebSocket integration",
    status: "todo",
    assignedTo: "Priya",
  },
];
// --- END DUMMY DATA ---

const AssignedTasks = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    completed: [],
  });

  useEffect(() => {
    setTimeout(() => {
      if (user?.role === "member") {
        setTasks(dummyTasksForMember);
        setColumns({
          todo: dummyTasksForMember.filter((t) => t.status === "todo"),
          inprogress: dummyTasksForMember.filter(
            (t) => t.status === "inprogress"
          ),
          completed: dummyTasksForMember.filter(
            (t) => t.status === "completed"
          ),
        });
      } else if (user?.role === "leader") {
        setTasks(dummyTasksForLeader);
      }
      setIsLoading(false);
    }, 500);
  }, [user]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id;
    const overId = over.id;
    if (activeId === overId) return;

    const activeContainer = active.data.current.sortable.containerId;
    const overContainer = over.data.current?.sortable.containerId || over.id;

    if (activeContainer === overContainer) {
      setColumns((prev) => ({
        ...prev,
        [activeContainer]: arrayMove(
          prev[activeContainer],
          active.data.current.sortable.index,
          over.data.current.sortable.index
        ),
      }));
    } else {
      let activeItem;
      const newColumns = { ...columns };
      newColumns[activeContainer] = newColumns[activeContainer].filter(
        (item) => {
          if (item._id === activeId) {
            activeItem = item;
            return false;
          }
          return true;
        }
      );
      if (over.data.current?.sortable) {
        const overIndex = over.data.current.sortable.index;
        newColumns[overContainer].splice(overIndex, 0, activeItem);
      } else {
        newColumns[overContainer].push(activeItem);
      }
      setColumns(newColumns);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96 text-white">
        <Loader className="animate-spin mr-3" size={32} />
        Loading tasks...
      </div>
    );
  }

  if (user?.role === "member") {
    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className="container mx-auto px-4 md:px-8 py-8 text-white">
          <h1 className="text-4xl font-bold font-orbitron mb-2">My Tasks</h1>
          <p className="text-gray-400 mb-8">
            Drag and drop tasks to update their status.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <KanbanColumn id="todo" title="To Do" tasks={columns.todo} />
            <KanbanColumn
              id="inprogress"
              title="In Progress"
              tasks={columns.inprogress}
            />
            <KanbanColumn
              id="completed"
              title="Completed"
              tasks={columns.completed}
            />
          </div>
        </div>
      </DndContext>
    );
  }

  return (
    <div
      className="container mx-auto px-4 md:px-8 py-8 text-white"
      style={{ fontFamily: "Orbitron, sans-serif" }}
    >
      <h1 className="text-4xl font-bold font-orbitron mb-2">
        Team Task Overview
      </h1>
      <p className="text-gray-400 mb-8">
        Monitor the progress of tasks assigned to your team members.
      </p>
      <div className="bg-[#1a103d]/80 backdrop-blur-sm border border-pink-500/30 rounded-2xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#2a1f52]/50">
              <tr>
                <th className="p-4 font-semibold">Task Description</th>
                <th className="p-4 font-semibold">Assigned To</th>
                <th className="p-4 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task._id} className="border-b border-pink-500/20">
                  <td className="p-4">{task.content}</td>
                  <td className="p-4 text-gray-300">
                    <div className="flex items-center gap-2">
                      <UserCheck size={16} className="text-cyan-400" />
                      {task.assignedTo}
                    </div>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        task.status === "completed"
                          ? "bg-green-500/20 text-green-300"
                          : task.status === "inprogress"
                          ? "bg-yellow-500/20 text-yellow-300"
                          : "bg-gray-500/20 text-gray-300"
                      }`}
                    >
                      {task.status.charAt(0).toUpperCase() +
                        task.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssignedTasks;
