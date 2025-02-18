import express from 'express';
import { Users } from './people.controllar.js';
import verifyToken from '../../middlewares/authMiddleware.js';

const router = express.Router();


router.get('/', Users.getUsers);       
router.post('/register', Users.registerUser);      
router.post('/login', Users.loginUser);      
router.post('/profile', verifyToken, Users.getUserByEmail);  
router.put('/:id', Users.updateUser);    
router.delete('/:id', Users.deleteUser); 

export const UserRoutes = router;
