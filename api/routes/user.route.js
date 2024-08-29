import express from 'express';
import { createUser, getUsers, signout } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', createUser);
router.post('/signout',signout);
router.get('/getusers', getUsers);
//router.get('/:id', getUserById);
//router.put('/:id', updateUser);
//router.delete('/:id', deleteUser);

export default router;
