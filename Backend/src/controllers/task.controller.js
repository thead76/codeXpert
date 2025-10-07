import Task from '../models/task.model.js';
import Notification from '../models/notification.model.js';
import Team from '../models/team.model.js';
import User from '../models/user.model.js';

// assignTask function (No changes needed)
export const assignTask = async (req, res) => {
  const { title, description, assignedTo, teamId, priority } = req.body;
  const createdBy = req.user;
  try {
    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: 'Team not found' });
    if (team.leader.toString() !== createdBy._id.toString()) {
      return res.status(403).json({ message: 'Only the team leader can assign tasks' });
    }
    if (!team.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }
    const task = new Task({
      title, description, assignedTo, team: teamId, createdBy: createdBy._id, priority, status: 'Pending'
    });
    const savedTask = await task.save();
    const notification = new Notification({
      user: assignedTo,
      message: `${createdBy.name} assigned you a new task: "${savedTask.title}"`,
      task: savedTask._id,
    });
    await notification.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error in assignTask:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// getMyTasks function
export const getMyTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ assignedTo: req.user._id, status: { $ne: 'Pending' } })
            .populate('assignedTo', 'name avatar')
            .populate('team', 'name') // <-- YEH LINE ZAROORI HAI
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error in getMyTasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// getTeamTasks function
export const getTeamTasks = async (req, res) => {
    try {
        const leaderTeams = await Team.find({ leader: req.user._id });
        const teamIds = leaderTeams.map(team => team._id);
        const tasks = await Task.find({ team: { $in: teamIds }, status: { $ne: 'Pending' } })
            .populate('assignedTo', 'name avatar')
            .populate('team', 'name') // <-- YEH LINE ZAROORI HAI
            .sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error('Error in getTeamTasks:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// updateTaskStatus function
export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (task.assignedTo.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'You can only update tasks assigned to you' });
    }
    task.status = status;
    await task.save();
    if (status === 'Under Review') {
      const memberWhoUpdated = await User.findById(req.user._id);
      if (!memberWhoUpdated) {
        throw new Error('Could not find user details for notification.');
      }
      const notification = new Notification({
        user: task.createdBy,
        message: `${memberWhoUpdated.name} has submitted the task "${task.title}" for review.`,
        task: task._id,
      });
      await notification.save();
    }
    res.json({ message: "Task status updated successfully" });
  } catch (error) {
    console.error('CRITICAL ERROR in updateTaskStatus:', error);
    res.status(500).json({ message: 'Server Error while updating status' });
  }
};

// reviewTask function
export const reviewTask = async (req, res) => {
    const { taskId } = req.params;
    const { status, reviewNotes } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the task creator can review it.' });
        }
        task.status = status;
        task.reviewNotes = reviewNotes || '';
        await task.save();
        let message = '';
        if (status === 'Completed') {
            message = `Your task "${task.title}" has been approved.`;
        } else if (status === 'In Progress') {
            message = `Your task "${task.title}" has been re-assigned with feedback.`;
        }
        if (message) {
            const notification = new Notification({ user: task.assignedTo, message, task: task._id });
            await notification.save();
        }
        res.json({ message: 'Review submitted.' });
    } catch (error) {
        console.error('Error in reviewTask:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// respondToTask function
export const respondToTask = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body;
    try {
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found' });
        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'This task is not assigned to you.' });
        }
        let responseMessage = '';
        if (status === 'accepted') {
            task.status = 'To Do';
            await task.save();
            responseMessage = 'Task accepted and moved to To Do.';
        } else if (status === 'declined') {
            const leaderNotification = new Notification({
                user: task.createdBy,
                message: `${req.user.name} has declined the task: "${task.title}".`
            });
            await leaderNotification.save();
            await task.deleteOne();
            responseMessage = 'Task declined and removed.';
        } else {
            return res.status(400).json({ message: 'Invalid response.' });
        }
        await Notification.findOneAndUpdate({ task: taskId, user: req.user._id }, { read: true });
        res.json({ message: responseMessage });
    } catch (error) {
        console.error('Error in respondToTask:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};