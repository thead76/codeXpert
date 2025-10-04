import Team from '../models/team.model.js';

// @desc    Create a new team
// @route   POST /api/v1/teams
// @access  Private/Leader
export const createTeam = async (req, res) => {
  const { name, members } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'Please provide a team name' });
  }

  const team = new Team({
    name,
    leader: req.user._id, // The logged-in user is the leader
    members: members || [], // Add members if provided
  });

  const createdTeam = await team.save();
  res.status(201).json(createdTeam);
};

// @desc    Get teams for the logged-in user
// @route   GET /api/v1/teams
// @access  Private
export const getUserTeams = async (req, res) => {
    // Find teams where the user is either the leader or a member
    const teams = await Team.find({ 
        $or: [{ leader: req.user._id }, { members: req.user._id }] 
    }).populate('leader', 'name email').populate('members', 'name email');

    res.json(teams);
};