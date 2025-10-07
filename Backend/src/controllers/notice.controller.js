import Notice from '../models/notice.model.js';
import Team from '../models/team.model.js';
import Notification from '../models/notification.model.js'; // Notification model ko import karein

/**
 * @desc    Create a new notice and notify team members
 */
export const createNotice = async (req, res) => {
    const { title, content, category, teamId } = req.body;
    try {
        const team = await Team.findById(teamId).populate('members'); // Members ko populate karein
        if (!team || team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not the leader of this team.' });
        }

        const notice = new Notice({
            title,
            content,
            category,
            team: teamId,
            postedBy: req.user._id,
        });
        const savedNotice = await notice.save();

        // --- YEH NAYA LOGIC HAI ---
        // Team ke sabhi members ko notification bhejein
        for (const member of team.members) {
            // Jo post kar raha hai (leader), usko chhod kar baaki sabko notification bhejein
            if (member._id.toString() !== req.user._id.toString()) {
                const notification = new Notification({
                    user: member._id,
                    message: `New notice in ${team.name}: "${title}"`,
                    // Yahaan aap notice se link kar sakte hain, agar zaroorat ho
                });
                await notification.save();
            }
        }

        res.status(201).json(savedNotice);
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get all notices for the teams a user is part of
 */
export const getNotices = async (req, res) => {
    try {
        const userTeams = await Team.find({ members: req.user._id });
        const teamIds = userTeams.map(team => team._id);
        const notices = await Notice.find({ team: { $in: teamIds } })
            .populate('postedBy', 'name avatar')
            .populate('team', 'name')
            .sort({ createdAt: -1 });
        res.json(notices);
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a notice
 */
export const deleteNotice = async (req, res) => {
    try {
        const notice = await Notice.findById(req.params.noticeId);
        if (!notice) {
            return res.status(404).json({ message: 'Notice not found.' });
        }
        if (notice.postedBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You are not authorized to delete this notice.' });
        }
        await notice.deleteOne();
        res.json({ message: 'Notice removed successfully.' });
    } catch (error) {
        console.error('Error deleting notice:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};