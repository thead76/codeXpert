import React, { useState, useEffect } from "react";
import axios from "axios";
import { Bell, Check, X } from "lucide-react";

const NotificationPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("/api/v1/notifications");
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications", error);
    }
  };

  const handleInvitation = async (invitationId, status) => {
    try {
      await axios.put(`/api/v1/teams/invitations/${invitationId}`, { status });
      // Refresh notifications after responding
      fetchNotifications();
    } catch (error) {
      console.error(`Failed to ${status} invitation`, error);
    }
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <Bell size={24} />
        {notifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4 border-b border-gray-700">
            <h3 className="font-bold">Notifications</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="p-4 text-gray-400">No new notifications.</p>
            ) : (
              notifications.map((notif) => (
                <div key={notif._id} className="p-4 border-b border-gray-600">
                  <p>{notif.message}</p>
                  {notif.teamInvitation && (
                    <div className="flex gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleInvitation(notif.teamInvitation._id, "accepted")
                        }
                        className="bg-green-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Check size={16} /> Accept
                      </button>
                      <button
                        onClick={() =>
                          handleInvitation(notif.teamInvitation._id, "declined")
                        }
                        className="bg-red-600 px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <X size={16} /> Decline
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
