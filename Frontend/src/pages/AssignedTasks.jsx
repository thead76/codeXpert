import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import KanbanColumn from "../components/KanbanColumn";
import ReviewTaskModal from "../components/ReviewTaskModal";
import CustomDropdown from "../components/CustomDropdown"; // Custom Dropdown ko import karein
import { Loader, Users, Calendar, Search, XCircle } from "lucide-react";
import toast from "react-hot-toast";

const columnOrder = ["To Do", "In Progress", "Under Review", "Completed"];
const dateFilterOptions = ["All", "Today", "This Week", "This Month"];
const priorityOptions = [
  { value: "All", label: "All Priorities" },
  { value: "High", label: "High" },
  { value: "Medium", label: "Medium" },
  { value: "Low", label: "Low" },
];

const AssignedTasks = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewTask, setReviewTask] = useState(null);

  // Filter states
  const [selectedMember, setSelectedMember] = useState("all");
  const [dateFilter, setDateFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      let tasksData = [];
      if (user.role === "leader") {
        const teamTasksRes = await axios.get("/tasks/team-tasks");
        const myTasksRes = await axios.get("/tasks/my-tasks");
        const allFetchedTasks = [...teamTasksRes.data, ...myTasksRes.data];
        tasksData = Array.from(new Set(allFetchedTasks.map((t) => t._id))).map(
          (id) => allFetchedTasks.find((t) => t._id === id)
        );

        const members = tasksData
          .map((task) => task.assignedTo)
          .filter(Boolean);
        const uniqueMembers = Array.from(
          new Set(members.map((m) => m._id))
        ).map((id) => members.find((m) => m._id === id));
        setTeamMembers(uniqueMembers);
      } else {
        const { data } = await axios.get("/tasks/my-tasks");
        tasksData = data;
      }
      setTasks(tasksData);
    } catch (error) {
      toast.error("Could not fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Member dropdown ke liye options format karein
  const memberOptions = useMemo(() => {
    const options = teamMembers.map((member) => ({
      value: member._id,
      label: `${member.name}${member._id === user._id ? " (You)" : ""}`,
    }));
    return [{ value: "all", label: "All Members" }, ...options];
  }, [teamMembers, user._id]);

  const handleClearFilters = () => {
    setSelectedMember("all");
    setDateFilter("All");
    setPriorityFilter("All");
    setSearchTerm("");
    toast.success("All filters cleared!");
  };

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    if (user.role === "leader" && selectedMember !== "all") {
      filtered = filtered.filter(
        (task) => task.assignedTo?._id === selectedMember
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((task) =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (priorityFilter !== "All") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    if (dateFilter !== "All") {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

      filtered = filtered.filter((task) => {
        if (task.status !== "Completed") {
          return true;
        }

        const taskDate = new Date(task.updatedAt);
        const taskDay = new Date(
          taskDate.getFullYear(),
          taskDate.getMonth(),
          taskDate.getDate()
        );

        switch (dateFilter) {
          case "Today":
            return taskDay.getTime() === today.getTime();
          case "This Week":
            const firstDayOfWeek = new Date(today);
            firstDayOfWeek.setDate(today.getDate() - today.getDay());
            const lastDayOfWeek = new Date(firstDayOfWeek);
            lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);
            return taskDay >= firstDayOfWeek && taskDay <= lastDayOfWeek;
          case "This Month":
            return (
              taskDate.getMonth() === now.getMonth() &&
              taskDate.getFullYear() === now.getFullYear()
            );
          default:
            return true;
        }
      });
    }

    return filtered;
  }, [
    tasks,
    selectedMember,
    dateFilter,
    priorityFilter,
    searchTerm,
    user.role,
  ]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (user.role === "leader") {
      toast.error("Leaders can only view tasks. Use the 'Review' button.");
      return;
    }
    const activeId = active.id;
    const activeTask = tasks.find((t) => t._id === activeId);
    const overContainerId = over.id;
    if (!columnOrder.includes(overContainerId)) return;
    const newStatus = overContainerId;
    if (activeTask.status === newStatus) return;
    if (newStatus === "Under Review" && activeTask.status !== "In Progress") {
      toast.error(
        "Task must be in 'In Progress' before moving to 'Under Review'."
      );
      return;
    }
    if (newStatus === "Completed") {
      toast.error("Please move tasks to 'Under Review' for approval.");
      return;
    }
    if (activeTask.status === "Under Review") {
      toast.error("You cannot move a task out of 'Under Review'.");
      return;
    }
    setTasks((prev) =>
      prev.map((t) => (t._id === activeId ? { ...t, status: newStatus } : t))
    );
    axios
      .put(`/tasks/${activeId}/status`, { status: newStatus })
      .then(() => toast.success(`Task moved to ${newStatus}`))
      .catch(() => {
        toast.error("Failed to update task status.");
        setTasks((prev) =>
          prev.map((t) =>
            t._id === activeId ? { ...t, status: activeTask.status } : t
          )
        );
      });
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const tasksByColumn = columnOrder.reduce((acc, status) => {
    acc[status] = filteredTasks.filter((task) => task.status === status);
    return acc;
  }, {});

  if (loading)
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader className="animate-spin text-cyan-400" size={48} />
      </div>
    );

  return (
    <>
      <div className="p-4 md:p-8 text-white">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl md:text-3xl font-bold font-orbitron">
            {user.role === "leader" ? "Team's Task Board" : "My Assigned Tasks"}
          </h1>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-pink-500/20 mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by task title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/30 p-3 pl-10 rounded-lg outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="w-full md:w-56">
              <CustomDropdown
                options={priorityOptions}
                value={priorityFilter}
                onChange={(value) => setPriorityFilter(value)}
              />
            </div>
            {user.role === "leader" && (
              <div className="w-full md:w-56">
                <CustomDropdown
                  options={memberOptions}
                  value={selectedMember}
                  onChange={(value) => setSelectedMember(value)}
                />
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-cyan-400" />
              <div className="flex items-center bg-black/20 rounded-full p-1">
                {dateFilterOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => setDateFilter(option)}
                    className={`px-3 py-1 text-xs md:text-sm rounded-full transition-colors ${
                      dateFilter === option
                        ? "bg-cyan-500 text-white font-semibold"
                        : "text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-2 text-sm text-gray-300 hover:text-red-400 transition-colors"
            >
              <XCircle size={18} />
              Clear Filters
            </button>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columnOrder.map((columnId) => (
              <KanbanColumn
                key={columnId}
                id={columnId}
                title={`${columnId} (${tasksByColumn[columnId].length})`}
                tasks={tasksByColumn[columnId]}
                onReviewClick={setReviewTask}
              />
            ))}
          </div>
        </DndContext>
      </div>
      <ReviewTaskModal
        isOpen={!!reviewTask}
        onClose={() => setReviewTask(null)}
        task={reviewTask}
        onTaskReviewed={fetchData}
      />
    </>
  );
};

export default AssignedTasks;
