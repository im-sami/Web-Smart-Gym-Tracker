import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  target: { type: String },
  bodyPart: { type: String },
  equipment: { type: String },
  gifUrl: { type: String },
  instructions: [{ type: String }],
  secondaryMuscles: [{ type: String }],
  isCustom: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Exercise', exerciseSchema);
