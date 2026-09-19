const { prisma } = require('./authController');

function getRoutine(req, res) {
  res.json([
    {
      id: 1,
      title: "Breakfast",
      time: "08:00",
      type: "MEAL",
      completed: false,
      isPinned: true
    },
    {
      id: 2,
      title: "Take Medicine",
      time: "10:00",
      type: "MEDICINE",
      completed: false,
      isPinned: true
    },
    {
      id: 3,
      title: "Doctor Appointment",
      time: "14:00",
      type: "APPOINTMENT",
      completed: false,
      isPinned: false
    }
  ]);
}

function getTodayRoutine(req, res) {
  res.json([
    {
      id: 1,
      title: "Breakfast",
      time: "08:00 AM",
      type: "MEAL",
      completed: false,
      isPinned: true
    },
    {
      id: 2,
      title: "Take Medicine",
      time: "10:00 AM",
      type: "MEDICINE",
      completed: false,
      isPinned: true
    },
    {
      id: 3,
      title: "Brain Activity",
      time: "11:00 AM",
      type: "ACTIVITY",
      completed: false,
      isPinned: false
    },
    {
      id: 4,
      title: "Evening Walk",
      time: "05:00 PM",
      type: "ACTIVITY",
      completed: false,
      isPinned: true
    }
  ]);
}

function createRoutine(req, res) {
  res.json({
    message: 'POST /api/routine'
  });
}

async function createTodayRoutine(req, res) {

  try {
    if (!req.user || req.user.role !== 'CAREGIVER') {
      return res.status(403).json({
        error: 'Only a caregiver can add a routine item.'
      });
    }

    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'items must be a non-empty array.'
      });
    }

    for (const item of items) {
      if (!item || !item.title || !item.time || !item.type) {
        return res.status(400).json({
          error: 'Each item requires title, time, and type.'
        });
      }
    }

    const caretaker = await prisma.user.findUnique({
      where: { id: req.user.id }
    });

    if (!caretaker || !caretaker.patientId) {
      return res.status(400).json({
        error: 'No assigned patient was found for this caregiver.'
      });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const result = await prisma.routineItem.createMany({
      data: items.map((item) => ({
        userId: caretaker.patientId,
        title: item.title,
        time: item.time,
        type: item.type,
        date: today,
        completed: false,
        isPinned: item.isPinned === true
      }))
    });

    return res.status(201).json({
      count: result.count
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Unable to add today\'s routine items.'

    });
  }
}



function completeRoutine(req, res) {
  res.json({
    message: 'PATCH /api/routine/:id/complete',
    id: req.params.id
  });
}

function deleteRoutine(req, res) {
  res.json({
    message: 'DELETE /api/routine/:id',
    id: req.params.id
  });
}

module.exports = {
  getRoutine,
  getTodayRoutine,
  createRoutine,
  createTodayRoutine,
  completeRoutine,
  deleteRoutine
};
