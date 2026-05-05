import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import api from '../services/api';

const WorkoutLogger = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [duration, setDuration] = useState('');
  const [notes, setNotes] = useState('');
  const [exercises, setExercises] = useState([
    { exerciseName: '', sets: [{ weight: '', reps: '' }] }
  ]);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleAddExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: [{ weight: '', reps: '' }] }]);
  };

  const handleAddSet = (exerciseIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets.push({ weight: '', reps: '' });
    setExercises(newExercises);
  };

  const handleRemoveExercise = (index) => {
    const newExercises = exercises.filter((_, i) => i !== index);
    setExercises(newExercises);
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets = newExercises[exerciseIndex].sets.filter((_, i) => i !== setIndex);
    setExercises(newExercises);
  };

  const handleExerciseChange = (index, value) => {
    const newExercises = [...exercises];
    newExercises[index].exerciseName = value;
    setExercises(newExercises);
  };

  const handleSetChange = (exerciseIndex, setIndex, field, value) => {
    const newExercises = [...exercises];
    newExercises[exerciseIndex].sets[setIndex][field] = value;
    setExercises(newExercises);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/workout-logs', {
        date,
        durationMinutes: duration,
        notes,
        exercises
      });
      setSuccessMsg('Workout logged successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setExercises([{ exerciseName: '', sets: [{ weight: '', reps: '' }] }]);
      setDuration('');
      setNotes('');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Log Workout</h1>
      </div>

      {successMsg && (
        <div className="bg-emerald-50 text-emerald-600 p-4 rounded-xl border border-emerald-100">
          {successMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div className="flex-1 min-w-[200px]">
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
            <input 
              type="number" 
              value={duration} 
              onChange={(e) => setDuration(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary"
              placeholder="e.g. 60"
            />
          </div>
        </div>

        <div className="space-y-4">
          {exercises.map((exercise, eIndex) => (
            <div key={eIndex} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative">
              <button 
                type="button" 
                onClick={() => handleRemoveExercise(eIndex)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
              >
                <Trash2 size={20} />
              </button>

              <div className="mb-4 pr-10">
                <label className="block text-sm font-medium text-gray-700 mb-1">Exercise Name</label>
                <input 
                  type="text" 
                  value={exercise.exerciseName}
                  onChange={(e) => handleExerciseChange(eIndex, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium text-lg"
                  placeholder="e.g. Barbell Squat"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-12 gap-4 px-2 text-sm font-medium text-gray-500">
                  <div className="col-span-2 text-center">Set</div>
                  <div className="col-span-4 text-center">Weight (kg)</div>
                  <div className="col-span-4 text-center">Reps</div>
                  <div className="col-span-2"></div>
                </div>

                {exercise.sets.map((set, sIndex) => (
                  <div key={sIndex} className="grid grid-cols-12 gap-4 items-center bg-gray-50 p-2 rounded-xl border border-gray-100">
                    <div className="col-span-2 text-center font-medium text-gray-500">{sIndex + 1}</div>
                    <div className="col-span-4">
                      <input 
                        type="number" 
                        value={set.weight}
                        onChange={(e) => handleSetChange(eIndex, sIndex, 'weight', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="col-span-4">
                      <input 
                        type="number" 
                        value={set.reps}
                        onChange={(e) => handleSetChange(eIndex, sIndex, 'reps', e.target.value)}
                        className="w-full px-3 py-1.5 border border-gray-200 rounded-lg text-center focus:ring-2 focus:ring-primary/20"
                        placeholder="0"
                        required
                      />
                    </div>
                    <div className="col-span-2 flex justify-center">
                      <button 
                        type="button"
                        onClick={() => handleRemoveSet(eIndex, sIndex)}
                        className="text-gray-400 hover:text-red-500"
                        disabled={exercise.sets.length === 1}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <button 
                type="button" 
                onClick={() => handleAddSet(eIndex)}
                className="mt-4 flex items-center gap-2 text-sm font-medium text-primary hover:text-indigo-700 bg-primary/10 px-4 py-2 rounded-lg"
              >
                <Plus size={16} /> Add Set
              </button>
            </div>
          ))}
        </div>

        <button 
          type="button" 
          onClick={handleAddExercise}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-500 hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Plus size={20} /> Add Another Exercise
        </button>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea 
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary min-h-[100px]"
            placeholder="How did the workout feel?"
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-primary to-indigo-600 text-white font-medium rounded-xl hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-50"
          >
            {loading ? 'Saving...' : <><Save size={20} /> Save Workout</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutLogger;
