import catchAsync from "../../utils/catchAsync.js";
import User from "./people.models.js";

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



const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    return res.status(401).json({ error: 'Authentication failed' });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: '1h',
  });
  res.status(200).json({ token });

})



const getUserById = (req, res) => {
  res.status(200).json({ message: `User with ID ${req.params.id}` });
};

const updateUser = (req, res) => {
  res.status(200).json({ message: `User with ID ${req.params.id} updated` });
};

const deleteUser = (req, res) => {
  res.status(200).json({ message: `User with ID ${req.params.id} deleted` });
};


export const Users = { getUsers, registerUser, getUserById, updateUser, deleteUser, loginUser };
