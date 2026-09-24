const express = require('express');
const {
  getRoutine,
  getTodayRoutine,
  createTodayRoutine,
  deleteRoutine
} = require('../controllers/routineController');
const { protect } = require('../middleware/authMiddleware');

const Router = express.Router();

 Router.get('/routine', getRoutine);



Router.get('/patients/:patientId/routine/today', getTodayRoutine);
Router.post('/routine/today', protect, createTodayRoutine);



Router.delete('/routine/:id', deleteRoutine);
module.exports = Router;
