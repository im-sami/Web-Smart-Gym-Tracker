import React, { useState } from 'react';
import api from '../services/api';
import { Search, Loader2 } from 'lucide-react';

const ExerciseLibrary = () => {
  const [query, setQuery] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const res = await api.get(`/exercises/search?${searchType}=${encodeURIComponent(query)}`);
      setExercises(res.data.data);
    } catch (error) {
      console.error('Error fetching exercises', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Exercise Library</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Search through thousands of exercises by name, target muscle, body part, or equipment. Powered by ExerciseDB.
        </p>
      </div>

      <div className="max-w-2xl mx-auto mb-12">
        <form onSubmit={handleSearch} className="flex gap-2">
          <select 
            value={searchType} 
            onChange={(e) => setSearchType(e.target.value)}
            className="px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
          >
            <option value="name">Name</option>
            <option value="target">Target Muscle</option>
            <option value="bodyPart">Body Part</option>
            <option value="equipment">Equipment</option>
          </select>
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search by ${searchType}...`}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none"
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="px-6 py-3 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Search'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <>
          {hasSearched && exercises.length === 0 && (
            <div className="text-center py-20 text-gray-500">
              No exercises found matching your search.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {exercises.map((exercise) => (
              <div key={exercise.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <img 
                  src={exercise.gifUrl} 
                  alt={exercise.name} 
                  className="w-full h-64 object-cover object-center bg-gray-50"
                  loading="lazy"
                />
                <div className="p-5">
                  <h3 className="font-bold text-lg mb-2 capitalize truncate">{exercise.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full font-medium capitalize">
                      {exercise.target}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium capitalize">
                      {exercise.bodyPart}
                    </span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium capitalize">
                      {exercise.equipment}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ExerciseLibrary;
