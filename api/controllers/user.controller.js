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

 