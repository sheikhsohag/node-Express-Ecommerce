import express from 'express';
import { Users } from './people.controllar.js';

const router = express.Router();


router.get('/', Users.getUsers);       
router.post('/', Users.createUser);      
router.get('/:id', Users.getUserById);  
router.put('/:id', Users.updateUser);    
router.delete('/:id', Users.deleteUser); 

export const UserRoutes = router;
