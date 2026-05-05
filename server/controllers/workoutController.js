import WorkoutLog from '../models/WorkoutLog.js';

export const createWorkoutLog = async (req, res) => {
  try {
    const { exercises, durationMinutes, notes, date } = req.body;

    const log = await WorkoutLog.create({
      memberId: req.user._id,
      date: date || Date.now(),
      exercises,
      durationMinutes,
      notes
    });

    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, statusCode: 500 });
  }
};

export const getWorkoutLogs = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { memberId: req.user._id };

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const logs = await WorkoutLog.find(query).sort({ date: -1 });
    res.json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message, statusCode: 500 });
  }
};
