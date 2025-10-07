import Task from '../models/task.model.js';
import { startOfMonth, endOfMonth, eachMonthOfInterval, format, subMonths } from 'date-fns';

/**
 * @desc    Get personal work statistics for the logged-in user
 */
export const getUserStats = async (req, res) => {
    try {
        const userId = req.user._id;
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.updatedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        const completedTasks = await Task.find({
            assignedTo: userId,
            status: 'Completed',
            ...dateFilter,
        })
        .populate('team', 'name')
        .populate('createdBy', 'name');

        const totalTasksCompleted = completedTasks.length;
        const priorityBreakdown = { High: 0, Medium: 0, Low: 0 };
        completedTasks.forEach(task => {
            if (priorityBreakdown[task.priority] !== undefined) {
                priorityBreakdown[task.priority]++;
            }
        });

        const last12Months = eachMonthOfInterval({
            start: startOfMonth(subMonths(new Date(), 11)),
            end: endOfMonth(new Date())
        });

        const monthlyCompletion = last12Months.map(monthStart => {
            const monthName = format(monthStart, 'MMM yyyy');
            const count = completedTasks.filter(task => format(new Date(task.updatedAt), 'MMM yyyy') === monthName).length;
            return { name: monthName, tasks: count };
        });
        
        res.json({
            totalTasksCompleted,
            priorityBreakdown,
            monthlyCompletion,
            completedTasksHistory: completedTasks,
        });
    } catch (error) {
        console.error("Error fetching user stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};

// --- YEH NAYA FUNCTION HAI ---
/**
 * @desc    Get work statistics for the teams managed by the leader
 * @route   GET /api/v1/reports/leader-stats
 * @access  Private (Leader)
 */
export const getLeaderStats = async (req, res) => {
    try {
        const leaderId = req.user._id;
        const { startDate, endDate } = req.query;

        const dateFilter = {};
        if (startDate && endDate) {
            dateFilter.updatedAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }

        // Woh saare tasks jo leader ne banaye the aur ab 'Completed' hain (matlab review ho chuke hain)
        const reviewedTasks = await Task.find({
            createdBy: leaderId,
            status: 'Completed',
            ...dateFilter,
        }).populate('assignedTo', 'name');

        const totalTasksReviewed = reviewedTasks.length;

        // Kis member ne kitne tasks complete kiye (Pie chart ke liye)
        const memberPerformance = {};
        reviewedTasks.forEach(task => {
            const memberName = task.assignedTo.name;
            if (memberPerformance[memberName]) {
                memberPerformance[memberName]++;
            } else {
                memberPerformance[memberName] = 1;
            }
        });

        const performanceData = Object.keys(memberPerformance).map(name => ({
            name: name,
            tasks: memberPerformance[name],
        }));

        res.json({
            totalTasksReviewed,
            memberPerformance: performanceData,
        });

    } catch (error) {
        console.error("Error fetching leader stats:", error);
        res.status(500).json({ message: "Server Error" });
    }
};