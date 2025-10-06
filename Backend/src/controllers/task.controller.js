import Task from '../models/task.model.js';
import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import Notification from '../models/notification.model.js'; // Import Notification model

// @desc    Assign a new task to a team member and send a notification
// @route   POST /api/v1/tasks
// @access  Private (Team Leader)
export const assignTask = async (req, res) => {
  const { title, description, assignedTo, teamId } = req.body;
  const createdBy = req.user;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leader.toString() !== createdBy._id.toString()) {
      return res.status(403).json({ message: 'Only the team leader can assign tasks' });
    }

    if (!team.members.includes(assignedTo)) {
      return res.status(400).json({ message: 'The assigned user is not a member of this team' });
    }

    const task = new Task({
      title,
      description,
      assignedTo,
      team: teamId,
      createdBy: createdBy._id,
      status: 'Pending', // <-- New tasks are initially 'Pending'
    });

    const createdTask = await task.save();

    // --- NEW: Create a notification for the assigned user ---
    const notification = new Notification({
        user: assignedTo,
        message: `${createdBy.name} has assigned you a new task: "${createdTask.title}"`,
        // You'll need to add a 'task' field to your Notification model schema to link it
        // For now, this will work to create the message
    });
    await notification.save();


    res.status(201).json(createdTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// --- NEW FUNCTION ---
// @desc    Allow a member to respond to a task assignment
// @route   PUT /api/v1/tasks/:taskId/respond
// @access  Private (Assigned User)
export const respondToTask = async (req, res) => {
    const { taskId } = req.params;
    const { status } = req.body; // Expecting 'accepted' or 'declined'

    try {
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        if (task.assignedTo.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'This task is not assigned to you.' });
        }

        if (status === 'accepted') {
            task.status = 'To Do'; // Move task to 'To Do' list
            await task.save();
            res.json({ message: 'Task accepted and added to your To Do list.' });
        } else if (status === 'declined') {
            // If declined, we can notify the leader and delete the task
            const leaderId = task.createdBy;
            const notificationForLeader = new Notification({
                user: leaderId,
                message: `${req.user.name} has declined the task: "${task.title}"`
            });
            await notificationForLeader.save();
            await task.deleteOne(); // Or you could set a 'declined' status
            res.json({ message: 'Task declined.' });
        } else {
            return res.status(400).json({ message: 'Invalid status provided.' });
        }

        // Clean up the initial assignment notification
        // This assumes you have a way to link notifications to tasks
        // For example, by finding a notification with the same user and a related message.

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};


// @desc    Get all tasks for a team
// @route   GET /api/v1/tasks/team/:teamId
// @access  Private (Team Members)
export const getTasksForTeam = async (req, res) => {
  const { teamId } = req.params;
  const userId = req.user._id;

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.leader.toString() !== userId.toString() && !team.members.includes(userId)) {
      return res.status(403).json({ message: 'You are not authorized to view these tasks' });
    }

    const tasks = await Task.find({ team: teamId }).populate('assignedTo', 'name email');
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update task status (e.g., from To Do to In Progress)
// @route   PUT /api/v1/tasks/:taskId/status
// @access  Private (Assigned User)
export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const userId = req.user._id;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    if (task.assignedTo.toString() !== userId.toString()) {
      return res.status(403).json({ message: 'You can only update tasks assigned to you' });
    }

    // A member should not be able to revert a task to 'Pending'
    if (status === 'Pending') {
        return res.status(400).json({ message: 'Cannot set task status back to Pending.'});
    }

    task.status = status;
    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};