const express = require('express');
const { register, login } = require('../controllers/authController');

const Router = express.Router();

Router.post('/auth/register', register);
Router.post('/auth/login', login);

module.exports = Router;
