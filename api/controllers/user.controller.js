import User from '../models/user.model.js';

export const createUser = async (req, res) => {
    try{
        const newUser = new User(req.body);
        const savedUser = await newUser.save();
        res.status(201).json(savedUser);
    } catch(error){
        res.status(400).json({error: error.message})
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

    // Current date
    const now = new Date();

    // Array to hold the count of users for the last 6 months
    const lastSevenMonthsData = [];

    // Loop through the last 6 months
    for (let i = 0; i < 7; i++) {
      // Get the first and last date of the month
      const startOfMonth = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59, 999);

      // Query the count of users created in that month
      const usersCount = await User.countDocuments({
        createdAt: { $gte: startOfMonth, $lt: endOfMonth }
      });

      // Get the name of the month
      const monthName = startOfMonth.toLocaleString('default', { month: 'long' });

      // Add the result to the array
      lastSevenMonthsData.push({
        month: monthName,
        usersCount
      });
    }

    // Fetch users with pagination if limit and skip are provided
    const users = await User.find({})
      .limit(limit ? parseInt(limit) : 0)
      .skip(skip ? parseInt(skip) : 0)
      .exec();
    
    // Get the total number of users in the database
    const totalUsers = await User.countDocuments();

    res.status(200).json({
      success: true,
      users,
      totalUsers,
      lastSevenMonthsData, // Include the data for the last six months
    });
  } catch (error) {
    // Handle any errors and pass them to the next middleware (error handler)
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


 