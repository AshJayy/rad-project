import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const createUser = async (req, res) => {
  try {
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

export const updateUser = async (req, res, next) => {
  if (req.user.id != req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to update this user'));
  }
  if (req.body.password) {
    if (req.body.password.length < 2) {
      return next(errorHandler(400, 'Password must be at least 6 characters'));
    }
    req.body.password = bcryptjs.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 4 || req.body.username.length > 20) {
      return next(errorHandler(400, 'Username must be between 7 and 20 characters'));
    }
    if (req.body.username.includes(' ')) {
      return next(errorHandler(400, 'Username cannot contain spaces'));
    }
    if (req.body.username != req.body.username.toLowerCase()) {
      return next(errorHandler(400, 'Username must be lowercase'));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(errorHandler(400, 'Username can contain only letters and numbers'));
    }
  }
  if (req.body.email) {
    if (!req.body.email.includes('@') || !req.body.email.includes('.')) {
      return next(errorHandler(400, 'Invalid email'));
    }
  }
  if (req.body.phone) {
    if (req.body.phone.length !== 10) {
      return next(errorHandler(400, 'Invalid phone number'));
    }
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.userId, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        profilePicture: req.body.profilePicture,
        password: req.body.password,
        name: req.body.name,
        phone: req.body.phone,
      },
    }, { new: true });
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }

}

export const signout = (req, res, next) => {
  try {
    res
      .clearCookie('access_token')
      .status(200)
      .json('User has been signed out');
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const { limit, skip } = req.query;

    const now = new Date();

    const lastSevenMonthsData = [];

    for (let i = 0; i < 7; i++) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);


      const usersCount = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth }
      });

      const monthName = startOfMonth.toLocaleString('default', { month: 'long' });

      lastSevenMonthsData.push({
        month: monthName,
        usersCount
      });
    }

    const users = await User.find({})
      .limit(limit ? parseInt(limit) : 0)
      .skip(skip ? parseInt(skip) : 0)
      .exec();

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      lastSevenMonthsData,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  console.log("delete user");

  if (!req.user.userLevel > 0 && req.user.id !== req.params.userId) {
    return next(errorHandler(403, 'You are not allowed to delete this user'));
  }
  try {
    await User.findByIdAndDelete(req.params.userId);
    res.status(200).json('User has been deleted');
  } catch (error) {
    next(error);
  }
};

export const makeUserAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!req.user || req.user.userLevel <= 0) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    user.userLevel = 1;

    await user.save();

    res.status(200).json({ message: 'User successfully made an admin', user });
  } catch (error) {
    console.error('Error making user admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const currentPlan = async (req, res, next) => {
  const userId = req.params.userId;
  
  const { validUntil, startDate } = req.body;
  // console.log(req.body);
  
  try {
    // Fetch the current user
    const user = await User.findById(userId);

    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Convert validUntil and startDate to Date objects if they are strings
    const validUntilDate = new Date(validUntil);
    const startDateDate = new Date(startDate);

    // Calculate the difference in milliseconds
    const differenceInMillis = validUntilDate - startDateDate;

    // Convert milliseconds to different units
    const differenceInSeconds = differenceInMillis / 1000;
    const differenceInMinutes = differenceInSeconds / 60;
    const differenceInHours = differenceInMinutes / 60;
    const differenceInDays = differenceInHours / 24;

    // Initialize plan variable
    let plan;

    // Calculate the plan based on the difference in days
    if (differenceInDays <= 0) {
      plan = -1;
    } else if (differenceInDays <= 14) {
      plan = 0;
    } else if (differenceInDays <= 30) {
      plan = 1;
    } else if (differenceInDays <= 365) {
      plan = 2;
    }

   
    // Update user's current plan
    user.currentPlan = plan;

    // Save the updated user
    const updatedUser = await user.save();

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

