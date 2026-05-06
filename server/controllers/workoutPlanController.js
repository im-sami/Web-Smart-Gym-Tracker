import WorkoutPlan from '../models/WorkoutPlan.js';

// @desc    Create a workout plan
// @route   POST /api/workout-plans
// @access  Private/Trainer
export const createWorkoutPlan = async (req, res, next) => {
  try {
    const { title, description, memberId, workouts } = req.body;

    const plan = await WorkoutPlan.create({
      title,
      description,
      memberId,
      trainerId: req.user._id,
      workouts
    });

    res.status(201).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all workout plans (filtered by user/trainer)
// @route   GET /api/workout-plans
// @access  Private
export const getWorkoutPlans = async (req, res, next) => {
  try {
    let query;

    if (req.user.role === 'trainer') {
      query = WorkoutPlan.find({ trainerId: req.user._id });
    } else if (req.user.role === 'member') {
      query = WorkoutPlan.find({ memberId: req.user._id, status: 'active' });
    } else {
      query = WorkoutPlan.find(); // admin can see all
    }

    const plans = await query.populate('memberId', 'name email').populate('workouts.exerciseId', 'name bodyPart target equipment gifUrl');

    res.status(200).json({
      success: true,
      count: plans.length,
      data: plans
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a workout plan
// @route   PUT /api/workout-plans/:id
// @access  Private/Trainer
export const updateWorkoutPlan = async (req, res, next) => {
  try {
    let plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found', statusCode: 404 });
    }

    // Make sure user is plan owner or admin
    if (plan.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to update this plan', statusCode: 401 });
    }

    plan = await WorkoutPlan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: plan
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a workout plan
// @route   DELETE /api/workout-plans/:id
// @access  Private/Trainer/Admin
export const deleteWorkoutPlan = async (req, res, next) => {
  try {
    const plan = await WorkoutPlan.findById(req.params.id);

    if (!plan) {
      return res.status(404).json({ success: false, error: 'Plan not found', statusCode: 404 });
    }

    // Make sure user is plan owner or admin
    if (plan.trainerId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(401).json({ success: false, error: 'Not authorized to delete this plan', statusCode: 401 });
    }

    await plan.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    next(error);
  }
};
