import catchAsync from "../../utils/catchAsync.js";
import sendResponse from "../../utils/sendResponse.js";
import User from "./people.models.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import httpStatus from "http-status";

const getUsers = (req, res) => {
  res.status(200).json({ message: 'List of users' });
};

const registerUser = catchAsync(async (req, res) => {
  const { username, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "username already exists!",
      data:null
    })
  }
  const existingUserName = await User.findOne({ username });
  if (existingUserName) {
    sendResponse(res, {
      statusCode: httpStatus.BAD_REQUEST,
      success: false,
      message: "username already exists!",
      data:null
    })
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await User.create({ username, email, password: hashedPassword });

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "User registered successfully!",
    data:newUser
  })
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
    expiresIn: '24h',
  });
  res.status(200).json({ token });

})




const getUserByEmail = catchAsync( async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({email}, {_id:0, __v:0, createdAt:0,updatedAt:0 });
  
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "profile found successfully!",
    data:user
  })
});

const updateUser = (req, res) => {
  res.status(200).json({ message: `User with ID ${req.params.id} updated` });
};

const deleteUser = (req, res) => {
  res.status(200).json({ message: `User with ID ${req.params.id} deleted` });
};


export const Users = { getUsers, registerUser, getUserByEmail, updateUser, deleteUser, loginUser };
