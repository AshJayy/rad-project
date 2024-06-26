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