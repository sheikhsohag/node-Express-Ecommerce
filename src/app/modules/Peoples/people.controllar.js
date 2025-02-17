import catchAsync from "../../utils/catchAsync.js";

const getUsers = (req, res) => {
    res.status(200).json({ message: 'List of users' });
  };
  
const registerUser = catchAsync(async (req, res) => {
    const { username, email, password } = req.body;
  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'email already exists' });
    }
    const existingUserName = await User.findOne({ username });
    if (existingUserName) {
      return res.status(400).json({ success: false, message: 'username already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({ username, email, password: hashedPassword });
  
    res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
  });
  
 
  
  const getUserById = (req, res) => {
    res.status(200).json({ message: `User with ID ${req.params.id}` });
  };
  
  const updateUser = (req, res) => {
    res.status(200).json({ message: `User with ID ${req.params.id} updated` });
  };
  
  const deleteUser = (req, res) => {
    res.status(200).json({ message: `User with ID ${req.params.id} deleted` });
  };
  
  
export const Users = { getUsers, registerUser, getUserById, updateUser, deleteUser };
  