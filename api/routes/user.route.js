import express from "express";
import {
  createUser,
  getUsers,
  signout,
  deleteUser,
  makeUserAdmin,
  updateUser,
  searchUsers,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/", createUser);
router.post("/signout", signout);
router.get("/getusers", getUsers);
router.get("/searchuser", searchUsers);
router.delete("/delete/:userId", verifyToken, deleteUser);
//router.get('/:id', getUserById);
router.put("/update/:userId", verifyToken, updateUser);
router.put("/makeAdmin/:userId", verifyToken, makeUserAdmin);

export default router;
