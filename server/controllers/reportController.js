import WorkoutLog from '../models/WorkoutLog.js';
import User from '../models/User.js';
import mongoose from 'mongoose';

export const getMemberReport = async (req, res) => {
  try {
    const memberId = req.params.id;

    // Optional: Only allow users to view their own reports or admins/trainers
    if (req.user._id.toString() !== memberId && req.user.role === 'member') {
      return res.status(403).json({ success: false, error: 'Access denied', statusCode: 403 });
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const analytics = await WorkoutLog.aggregate([
      { 
        $match: { 
          memberId: new mongoose.Types.ObjectId(memberId),
          date: { $gte: thirtyDaysAgo }
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
          totalDuration: { $sum: "$durationMinutes" },
          totalWorkouts: { $sum: 1 },
          exercises: { $push: "$exercises" }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Calculate total volume per day (simple calculation: sets * reps * weight)
    const formattedData = analytics.map(day => {
      let totalVolume = 0;
      day.exercises.forEach(exerciseArray => {
        exerciseArray.forEach(ex => {
          ex.sets.forEach(set => {
            totalVolume += set.weight * set.reps;
          });
        });
      });

      return {
        date: day._id,
        totalDuration: day.totalDuration,
        totalWorkouts: day.totalWorkouts,
        totalVolume
      };
    });

    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, statusCode: 500 });
  }
};

export const getSystemReport = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalTrainers = await User.countDocuments({ role: 'trainer' });
    const totalMembers = await User.countDocuments({ role: 'member' });
    const totalAdmins = await User.countDocuments({ role: 'admin' });

    const recentWorkouts = await WorkoutLog.countDocuments({
      date: { $gte: new Date(new Date() - 7 * 24 * 60 * 60 * 1000) }
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalTrainers,
        totalMembers,
        totalAdmins,
        recentWorkouts
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, statusCode: 500 });
  }
};
