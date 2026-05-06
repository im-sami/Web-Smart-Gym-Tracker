import React, { useState, useEffect } from 'react';
import api from '../services/api';

const WorkoutPlanBuilder = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [memberId, setMemberId] = useState('');
  const [workouts, setWorkouts] = useState([{ exerciseId: '', sets: 3, reps: 10, restTime: 60 }]);
  
  const [clients, setClients] = useState([]);
  const [exercises, setExercises] = useState([]);
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch clients and exercises
    const fetchData = async () => {
      try {
        const [usersRes, exRes] = await Promise.all([
          api.get('/users?limit=100'), // Quick hack for now, assuming Admin route works or Trainer can see users
          api.get('/exercises')
        ]);
        // Filter out only members
        setClients(usersRes.data.data.filter(u => u.role === 'member'));
        setExercises(exRes.data.data);
      } catch (error) {
        console.error('Error fetching data for plan builder', error);
      }
    };
    fetchData();
  }, []);

  const handleAddExercise = () => {
    setWorkouts([...workouts, { exerciseId: '', sets: 3, reps: 10, restTime: 60 }]);
  };

  const handleWorkoutChange = (index, field, value) => {
    const newWorkouts = [...workouts];
    newWorkouts[index][field] = value;
    setWorkouts(newWorkouts);
  };

  const handleRemoveExercise = (index) => {
    setWorkouts(workouts.filter((_, idx) => idx !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/workout-plans', {
        title, description, memberId, workouts
      });
      setMessage('Workout Plan created successfully!');
      setTitle(''); setDescription(''); setMemberId(''); setWorkouts([{ exerciseId: '', sets: 3, reps: 10, restTime: 60 }]);
    } catch (error) {
      setMessage('Failed to create workout plan.');
      console.error(error);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Workout Plan Builder</h1>
      
      {message && <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-lg">{message}</div>}

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Title</label>
            <input 
              required type="text" value={title} onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
              placeholder="e.g. 4-Week Hypertrophy"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Client</label>
            <select 
              required value={memberId} onChange={(e) => setMemberId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            >
              <option value="">Choose a client...</option>
              {clients.map(c => (
                <option key={c._id} value={c._id}>{c.name} ({c.email})</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
          <textarea 
            value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            rows="3" placeholder="Plan details..."
          />
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h2 className="text-xl font-bold mb-4">Exercises</h2>
          {workouts.map((w, idx) => (
            <div key={idx} className="flex flex-wrap md:flex-nowrap gap-4 items-end mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium text-gray-500 mb-1">Exercise</label>
                <select 
                  required value={w.exerciseId} onChange={(e) => handleWorkoutChange(idx, 'exerciseId', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Select exercise...</option>
                  {exercises.map(ex => (
                    <option key={ex._id} value={ex._id}>{ex.name}</option>
                  ))}
                </select>
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">Sets</label>
                <input type="number" min="1" value={w.sets} onChange={(e) => handleWorkoutChange(idx, 'sets', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="w-20">
                <label className="block text-xs font-medium text-gray-500 mb-1">Reps</label>
                <input type="number" min="1" value={w.reps} onChange={(e) => handleWorkoutChange(idx, 'reps', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              <div className="w-24">
                <label className="block text-xs font-medium text-gray-500 mb-1">Rest (s)</label>
                <input type="number" min="0" step="10" value={w.restTime} onChange={(e) => handleWorkoutChange(idx, 'restTime', Number(e.target.value))} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
              </div>
              {workouts.length > 1 && (
                <button type="button" onClick={() => handleRemoveExercise(idx)} className="px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors">
                  Remove
                </button>
              )}
            </div>
          ))}
          <button type="button" onClick={handleAddExercise} className="mt-2 text-sm font-medium text-primary hover:text-primary/80">
            + Add Another Exercise
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button type="submit" className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/30">
            Save Workout Plan
          </button>
        </div>
      </form>
    </div>
  );
};

export default WorkoutPlanBuilder;
