const express = require('express');
const { getUsers, createUser, getUserById, updateUser, deleteUser } = require('./people.controllar');

const router = express.Router();

// Define routes
router.get('/', getUsers);         // GET all users
router.post('/', createUser);      // Create new user
router.get('/:id', getUserById);   // Get user by ID
router.put('/:id', updateUser);    // Update user
router.delete('/:id', deleteUser); // Delete user

module.exports = { userRouter: router }; // ✅ Fixed export
