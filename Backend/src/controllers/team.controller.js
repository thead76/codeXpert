import Team from '../models/team.model.js';
import User from '../models/user.model.js';
import Invitation from '../models/invitation.model.js';
import Notification from '../models/notification.model.js';
import Task from '../models/task.model.js';

/**
 * @desc    Create a new team
 */
export const createTeam = async (req, res) => {
  const { name, description, memberEmails } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please provide a team name' });
  }

  try {
    const team = new Team({
      name,
      description,
      leader: req.user._id,
      members: [req.user._id],
    });

    const createdTeam = await team.save();

    if (memberEmails && memberEmails.length > 0) {
      const usersToInvite = await User.find({ email: { $in: memberEmails } });
      for (const user of usersToInvite) {
        const newInvitation = new Invitation({
          team: createdTeam._id,
          invitedUser: user._id,
        });
        const savedInvitation = await newInvitation.save();
        const notification = new Notification({
          user: user._id,
          message: `You have been invited to join the team: ${createdTeam.name}`,
          teamInvitation: savedInvitation._id,
        });
        await notification.save();
      }
    }
    res.status(201).json(createdTeam);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get all teams for the current user
 */
export const getUserTeams = async (req, res) => {
  try {
    const teams = await Team.find({
      $or: [{ leader: req.user._id }, { members: req.user._id }],
    })
    .populate('leader', 'name email')
    .populate('members', 'name email');
    res.json(teams);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Get a single team by its ID, including invitations
 */
export const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.teamId)
      .populate('leader', 'name email')
      .populate('members', 'name email avatar');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const isMember = team.members.some(member => member._id.equals(req.user._id));
    if (!isMember) {
        return res.status(403).json({ message: 'Not authorized to view this team' });
    }
    const invitations = await Invitation.find({ team: req.params.teamId })
      .populate('invitedUser', 'name email avatar');
    const responseData = {
      ...team.toObject(),
      invitations: invitations,
    };
    res.json(responseData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

/**
 * @desc    Update a team's details
 */
export const updateTeam = async (req, res) => {
    const { name, description } = req.body;
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this team' });
        }
        team.name = name || team.name;
        team.description = description ?? team.description;
        const updatedTeam = await team.save();
        res.json(updatedTeam);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Invite a new member to a team
 */
export const inviteMember = async (req, res) => {
    const { email } = req.body;
    const { teamId } = req.params;
    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the team leader can invite members' });
        }
        const userToInvite = await User.findOne({ email });
        if (!userToInvite) return res.status(404).json({ message: 'User with this email not found.' });
        if (team.members.includes(userToInvite._id)) {
            return res.status(400).json({ message: 'User is already a member of this team.' });
        }
        const existingInvitation = await Invitation.findOne({ team: teamId, invitedUser: userToInvite._id, status: 'pending' });
        if (existingInvitation) {
            return res.status(400).json({ message: 'An invitation has already been sent to this user.' });
        }
        const newInvitation = new Invitation({
            team: teamId,
            invitedUser: userToInvite._id,
        });
        const savedInvitation = await newInvitation.save();
        const notification = new Notification({
            user: userToInvite._id,
            message: `${req.user.name} has invited you to join the team: ${team.name}`,
            teamInvitation: savedInvitation._id,
        });
        await notification.save();
        res.status(200).json({ message: 'Invitation sent successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Remove a member from a team
 */
export const removeMember = async (req, res) => {
    const { teamId, memberId } = req.params;
    try {
        const team = await Team.findById(teamId);
        if (!team) return res.status(404).json({ message: 'Team not found' });
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the team leader can remove members' });
        }
        if (team.leader.toString() === memberId) {
            return res.status(400).json({ message: "A leader cannot be removed from their own team." });
        }
        team.members.pull(memberId);
        await team.save();
        res.json(team.members);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Respond to a team invitation
 */
export const respondToInvitation = async (req, res) => {
    const { invitationId } = req.params;
    const { status } = req.body;
    try {
        const invitation = await Invitation.findById(invitationId).populate('team', 'leader name');
        if (!invitation) return res.status(404).json({ message: "Invitation not found." });
        if (invitation.invitedUser.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "This is not your invitation to respond to." });
        }
        if (invitation.status !== 'pending') {
            return res.status(400).json({ message: "This invitation has already been responded to." });
        }
        if (status === 'accepted') {
            await Team.findByIdAndUpdate(invitation.team._id, { $addToSet: { members: req.user._id } });
            invitation.status = 'accepted';
            const leaderNotification = new Notification({
                user: invitation.team.leader,
                message: `${req.user.name} has accepted your invitation to join ${invitation.team.name}.`
            });
            await leaderNotification.save();
        } else {
            invitation.status = 'declined';
        }
        await invitation.save();
        await Notification.findOneAndUpdate({ teamInvitation: invitationId }, { read: true });
        res.status(200).json({ message: `Invitation ${status}.` });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Delete a team
 */
export const deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.teamId);
        if (!team) {
            return res.status(404).json({ message: 'Team not found' });
        }
        if (team.leader.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this team' });
        }
        await Task.deleteMany({ team: team._id });
        await Invitation.deleteMany({ team: team._id });
        await team.deleteOne();
        res.json({ message: 'Team and all associated data have been removed' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Get unread notifications for a user
 */
export const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user._id, read: false })
            .sort({ createdAt: -1 })
            .populate({
                path: 'teamInvitation',
                populate: { path: 'team', select: 'name' }
            })
            .populate('task');
        res.json(notifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

/**
 * @desc    Mark a single notification as read
 */
export const markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOneAndUpdate(
            { _id: req.params.notificationId, user: req.user._id },
            { read: true },
            { new: true }
        );
        if (!notification) return res.status(404).json({ message: 'Notification not found' });
        res.json(notification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// --- YEH NAYA FUNCTION HAI ---
/**
 * @desc    Mark all notifications as read for the current user
 */
export const markAllNotificationsAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, read: false },
            { $set: { read: true } }
        );
        res.json({ message: 'All notifications marked as read.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};