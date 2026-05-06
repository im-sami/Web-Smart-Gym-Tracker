import mongoose from 'mongoose';

const workoutPlanSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['draft', 'active', 'completed'], default: 'draft' },
  workouts: [{
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise' },
    sets: { type: Number },
    reps: { type: Number },
    restTime: { type: Number }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('WorkoutPlan', workoutPlanSchema);
