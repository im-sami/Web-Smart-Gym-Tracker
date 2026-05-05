import WorkoutLog from '../models/WorkoutLog.js';
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
