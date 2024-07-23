import express from 'express';
import { createUser, signout } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', createUser);
router.post('/signout',signout);
//router.get('/', getUsers);
//router.get('/:id', getUserById);
//router.put('/:id', updateUser);
//router.delete('/:id', deleteUser);

export default router;
