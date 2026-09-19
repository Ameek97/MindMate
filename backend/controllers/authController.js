const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

function createToken(user) {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
      patientId: user.patientId
    },
    process.env.JWT_SECRET
  );
}

async function register(req, res) {
  try {
    const { name, email, password, role, patientId } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        error: 'name, email, password, and role are required.'
      });
    }

    const allowedRoles = ['PATIENT', 'CAREGIVER'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: 'role must be PATIENT or CAREGIVER.'
      });
    }

    let associatedPatientId = patientId ?? null;
    if (role === 'PATIENT') {
      associatedPatientId = null;
    } else if (associatedPatientId !== null && associatedPatientId !== undefined && associatedPatientId !== '') {
      associatedPatientId = Number(associatedPatientId);
      if (Number.isNaN(associatedPatientId)) {
        return res.status(400).json({
          error: 'patientId must be a number.'
        });
      }
    } else {
      associatedPatientId = null;
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: 'Server configuration error.'
      });
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        patientId: associatedPatientId
      }
    });

    const token = createToken(user);

    return res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId: user.patientId,
      token
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'An account with this email already exists.'
      });
    }
    return res.status(500).json({
      error: 'Unable to register user.'
    });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'email and password are required.'
      });
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password);

    if (!passwordMatches) {
      return res.status(401).json({
        error: 'Invalid email or password.'
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        error: 'Server configuration error.'
      });
    }

    const token = createToken(user);

    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      patientId: user.patientId,
      token
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: 'Unable to log in.'
    });
  }
}

module.exports = {
  prisma,
  register,
  login
};
