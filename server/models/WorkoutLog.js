import mongoose from 'mongoose';

const workoutLogSchema = new mongoose.Schema({
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true, default: Date.now },
  exercises: [
    {
      exerciseName: { type: String, required: true },
      sets: [
        {
          weight: { type: Number, required: true },
          reps: { type: Number, required: true }
        }
      ]
    }
  ],
  durationMinutes: { type: Number },
  notes: { type: String }
});

export default mongoose.model('WorkoutLog', workoutLogSchema);
