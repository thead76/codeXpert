import React from "react";
import { ExternalLink } from "lucide-react";

const TaskHistoryTable = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return (
      <p className="text-gray-400 text-center mt-8">
        You haven't completed any tasks yet.
      </p>
    );
  }

  return (
    <div className="max-h-[400px] overflow-y-auto pr-2">
      <table className="w-full text-sm text-left text-gray-300">
        <thead className="text-xs text-gray-400 uppercase bg-white/5 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3">
              Task Title
            </th>
            <th scope="col" className="px-6 py-3">
              Team
            </th>
            <th scope="col" className="px-6 py-3">
              Assigned By
            </th>
            <th scope="col" className="px-6 py-3">
              Completed On
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task._id}
              className="border-b border-gray-700 hover:bg-white/5"
            >
              <td className="px-6 py-4 font-semibold text-white">
                {task.title}
              </td>
              <td className="px-6 py-4">{task.team.name}</td>
              <td className="px-6 py-4">{task.createdBy.name}</td>
              <td className="px-6 py-4">
                {new Date(task.updatedAt).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskHistoryTable;
