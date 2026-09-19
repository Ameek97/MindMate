const express = require('express');
const {
  getRoutine,
  getTodayRoutine,
  createRoutine,
  createTodayRoutine,
  completeRoutine,
  deleteRoutine
} = require('../controllers/routineController');
const { protect } = require('../middleware/authMiddleware');

const Router = express.Router();

Router.get('/routine', getRoutine);
Router.get('/patients/:patientId/routine/today', getTodayRoutine);
Router.post('/routine/today', protect, createTodayRoutine);
Router.post('/routine', createRoutine);
Router.patch('/routine/:id/complete', completeRoutine);
Router.delete('/routine/:id', deleteRoutine);

module.exports = Router;
