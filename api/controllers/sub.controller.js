import { errorHandler } from "../utils/error.js"
import Sub from "../models/sub.model.js";

export const makepayment = async (req, res, next) => {
    // console.log(new Date().toISOString())
    if(!req.body.userId || !req.body.type) 
        return next(errorHandler(204, 'user id and type required'));
    if(req.body.type !== '1' && req.body.type !== '2' && req.body.type !== '3') 
        return next(errorHandler(400, 'Invalid request'));
    
    try {
        const { userId,type } = req.body;
        const sub = await Sub.findOne({userId: userId});
        
        if(sub) {
            const upTime = new Date(sub.validUntil);
            let valid = new Date( //default 1 month
                upTime.getFullYear(),
                upTime.getMonth() + 1,
                upTime.getDate(),
            );
            switch (req.body.type) {
                case '1':
                    const oneWeekAfter = new Date(
                        upTime.getFullYear(),
                        upTime.getMonth(),
                        upTime.getDate() +7,
                    );
                    valid = oneWeekAfter;
                    break;
                case '2':
                    const oneMonthAfter = new Date(
                        upTime.getFullYear(),
                        upTime.getMonth() + 1,
                        upTime.getDate(),
                    );
                    valid = oneMonthAfter;
                    break;
                case '3':
                    const oneYearAfter = new Date(
                        upTime.getFullYear() +1,
                        upTime.getMonth() ,
                        upTime.getDate(),
                    );
                    valid = oneYearAfter;
                    break;
                default:
                    break;
            }
            const updateSub = await Sub.findByIdAndUpdate(
                sub._id,
                { $set: {
                    validUntil: valid,
                    status: 1,
                    history: [...sub.history, {
                        paymentDate:upTime, 
                        type: type,
                        validUntil: valid, 
                    }],
                    }
                 },
                { new: true }
            );  
            updateSub.save();
            return res.status(200).json({message: "User subscription extended"})
        }else{
            const now = new Date();           
            //type: 1 = weekly, 2 = monthly,  3 = yearly
            // console.log(now)
            let valid = new Date(
                now.getFullYear(),
                now.getMonth() + 1,
                now.getDate(),
            );//default one month
            switch (req.body.type) {
                case '1':
                    const oneWeekAfter = new Date(
                        now.getFullYear(),
                        now.getMonth(),
                        now.getDate() +7,
                    );
                    valid = oneWeekAfter;
                    break;
                case '2':
                    const oneMonthAfter = new Date(
                        now.getFullYear(),
                        now.getMonth() + 1,
                        now.getDate(),
                    );
                    valid = oneMonthAfter;
                    break;
                case '3':
                    const oneYearAfter = new Date(
                        now.getFullYear() +1,
                        now.getMonth() ,
                        now.getDate(),
                    );
                    valid = oneYearAfter;
                    break;
                default:
                    break;
            }
            
                const newSub = new Sub({
                userId: userId,
                validUntil: valid,
                status: 1,
                history: [{
                    paymentDate:now, 
                    type: type,
                    validUntil: valid, 
                }]
            })
            await newSub.save();
            return res.status(200).json({message: "Subscription created"})
        }
        
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

export const payhere = async (req, res, next) => {
    return res.status(200).json({message: "payhere works"})
    try {
        const { userId } = req.body;
        
    } catch (error) {
        console.log(error.message)
    }
};


export const getsubs = async (req, res, next) => {
    console.log("works")
    
};

export const deletesub = async (req, res, next) => {
    console.log("works")
    
};

export const updatesub = async (req, res, next) => {
    console.log("works")
    
};

