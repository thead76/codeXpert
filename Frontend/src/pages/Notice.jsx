import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Loader, Megaphone, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import NoticeCard from "../components/NoticeCard";
import PostNoticeModal from "../components/PostNoticeModal";
import ConfirmationModal from "../components/ConfirmationModal"; // <-- ConfirmationModal ko import karein
import toast from "react-hot-toast";

const Notice = () => {
  const { user } = useAuth();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);

  // --- NAYA BADLAAV: Delete confirmation ke liye state ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [noticeToDelete, setNoticeToDelete] = useState(null);

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const { data } = await axios.get("/notices");
        setNotices(data);
      } catch (error) {
        console.error("Failed to fetch notices:", error);
        toast.error("Could not fetch notices.");
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

  const handleNoticePosted = (newNotice) => {
    // Naya notice aane par, use list mein sabse upar add karein
    setNotices((prevNotices) => [newNotice, ...prevNotices]);
  };

  // --- NAYA FUNCTION: Delete modal kholne ke liye ---
  const handleDeleteClick = (notice) => {
    setNoticeToDelete(notice);
    setIsConfirmModalOpen(true);
  };

  // --- NAYA FUNCTION: Deletion ko confirm karne par API call karega ---
  const handleConfirmDelete = () => {
    if (!noticeToDelete) return;

    const promise = axios.delete(`/notices/${noticeToDelete._id}`);
    toast.promise(promise, {
      loading: "Deleting notice...",
      success: () => {
        setNotices((prevNotices) =>
          prevNotices.filter((n) => n._id !== noticeToDelete._id)
        );
        setIsConfirmModalOpen(false);
        setNoticeToDelete(null);
        return "Notice deleted successfully!";
      },
      error: (err) => {
        setIsConfirmModalOpen(false);
        setNoticeToDelete(null);
        return err.response?.data?.message || "Failed to delete notice.";
      },
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-80px)]">
        <Loader className="animate-spin text-cyan-400" size={48} />
      </div>
    );
  }

  return (
    <>
      <div className="p-4 md:p-8 text-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4"
          >
            <div>
              <h1 className="text-2xl md:text-3xl font-bold font-orbitron tracking-wide">
                Notice Board
              </h1>
              <p className="text-gray-400 mt-2">
                Latest announcements and updates for your teams.
              </p>
            </div>
            {user.role === "leader" && (
              <button
                onClick={() => setIsPostModalOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white px-5 py-3 rounded-full font-semibold flex items-center gap-2 hover:scale-105 transition-transform"
              >
                <PlusCircle size={20} /> Post New Notice
              </button>
            )}
          </motion.div>

          {notices.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center bg-white/5 p-16 rounded-2xl border border-white/10"
            >
              <Megaphone size={48} className="mx-auto text-cyan-400 mb-4" />
              <h2 className="text-2xl font-semibold">
                The Notice Board is Empty
              </h2>
              <p className="text-gray-400 mt-2">
                {user.role === "leader"
                  ? "Post a notice to share updates with your teams."
                  : "No notices have been posted in your teams yet."}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {notices.map((notice) => (
                <NoticeCard
                  key={notice._id}
                  notice={notice}
                  onDeleteClick={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {user.role === "leader" && (
        <PostNoticeModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onNoticePosted={handleNoticePosted}
        />
      )}

      {/* --- NAYA BADLAAV: Confirmation Modal ko yahaan render karein --- */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message={`Are you sure you want to permanently delete the notice: "${noticeToDelete?.title}"?`}
      />
    </>
  );
};

export default Notice;
