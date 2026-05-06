import Exercise from '../models/Exercise.js';
import axios from 'axios';

// @desc    Get internal exercises
// @route   GET /api/exercises
// @access  Private
export const getExercises = async (req, res, next) => {
  try {
    const exercises = await Exercise.find();

    res.status(200).json({
      success: true,
      count: exercises.length,
      data: exercises
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search exercises via ExerciseDB API
// @route   GET /api/exercises/search
// @access  Private
export const searchExercises = async (req, res, next) => {
  try {
    const { name, target, bodyPart, equipment } = req.query;
    let url = 'https://exercisedb.p.rapidapi.com/exercises';
    
    if (name) {
      url = `https://exercisedb.p.rapidapi.com/exercises/name/${name}`;
    } else if (target) {
      url = `https://exercisedb.p.rapidapi.com/exercises/target/${target}`;
    } else if (bodyPart) {
      url = `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;
    } else if (equipment) {
      url = `https://exercisedb.p.rapidapi.com/exercises/equipment/${equipment}`;
    }

    const options = {
      method: 'GET',
      url,
      params: { limit: '20' },
      headers: {
        'x-rapidapi-key': process.env.EXERCISEDB_API_KEY,
        'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
      }
    };

    const response = await axios.request(options);

    res.status(200).json({
      success: true,
      count: response.data.length,
      data: response.data
    });
  } catch (error) {
    console.error('ExerciseDB API Error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch exercises from external API',
      statusCode: 500
    });
  }
};

// @desc    Create custom exercise
// @route   POST /api/exercises
// @access  Private/Admin/Trainer
export const createExercise = async (req, res, next) => {
  try {
    const exercise = await Exercise.create({
      ...req.body,
      isCustom: true
    });

    res.status(201).json({
      success: true,
      data: exercise
    });
  } catch (error) {
    next(error);
  }
};
