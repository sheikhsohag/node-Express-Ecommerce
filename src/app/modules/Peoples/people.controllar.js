// people.controller.js
const getUsers = (req, res) => {
    res.status(200).json({ message: 'List of users' });
  };
  
  const createUser = (req, res) => {
    res.status(201).json({ message: 'User created successfully' });
  };
  
  const getUserById = (req, res) => {
    res.status(200).json({ message: `User with ID ${req.params.id}` });
  };
  
  const updateUser = (req, res) => {
    res.status(200).json({ message: `User with ID ${req.params.id} updated` });
  };
  
  const deleteUser = (req, res) => {
    res.status(200).json({ message: `User with ID ${req.params.id} deleted` });
  };
  
  
export const Users = { getUsers, createUser, getUserById, updateUser, deleteUser };
  