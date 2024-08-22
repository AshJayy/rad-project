import { errorHandler } from "../utils/error.js"
import Sub from "../models/sub.model.js";

export const makePayment = async (req, res, next) => {
    if (!req.body.userId || !req.body.type) {
        return next(errorHandler(204, 'User ID and subscription type required'));
    }

    if (!['1', '2', '3'].includes(req.body.type)) { // Ensure valid subscription type
        return next(errorHandler(400, 'Invalid subscription type'));
    }

    try {
        const { userId, type } = req.body;
        const sub = await Sub.findOne({ userId });

        const getUpdatedValidityDate = (currentDate, subscriptionType) => {
            switch (subscriptionType) {
                case '1': // Weekly
                    return new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7);
                case '2': // Monthly
                    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, currentDate.getDate());
                case '3': // Yearly
                    return new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), currentDate.getDate());
                default:
                    return currentDate;
            }
        };

        if (sub) {
            const updatedValidityDate = getUpdatedValidityDate(new Date(sub.validUntil), type);
            
            const updatedSub = await Sub.findByIdAndUpdate(
                sub._id,
                { 
                    $set: { 
                        validUntil: updatedValidityDate, 
                        status: 1 
                    },
                    $push: { 
                        history: { 
                            paymentDate: new Date(), 
                            type, 
                        } 
                    }
                },
                { new: true }
            );

            await updatedSub.save();
            return res.status(200).json({ message: "User subscription extended" });
        } else {
            const now = new Date();
            const validityDate = getUpdatedValidityDate(now, type);

            const newSub = new Sub({
                userId,
                validUntil: validityDate,
                status: 1,
                history: [{
                    paymentDate: now,
                    type,
                }]
            });

            await newSub.save();
            return res.status(200).json({ message: "Subscription created" });
        }

    } catch (error) {
        console.log(error.message);
        next(error);
    }
}
export const payhere = async (req, res, next) => {
    return res.status(200).json({message: "payhere works"})
    try {
        const { userId } = req.body;
        
    } catch (error) {
        console.log(error.message)
    }
};


export const getSubs = async (req, res, next) => {
    console.log("works")
    
};

export const deleteSub = async (req, res, next) => {
    console.log("works")
    
};

export const updateSub = async (req, res, next) => {
    console.log("works")
    
};

