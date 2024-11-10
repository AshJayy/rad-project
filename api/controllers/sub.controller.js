import { errorHandler } from "../utils/error.js"
import Sub from "../models/sub.model.js";
import Stripe from 'stripe';
import dotenv from 'dotenv';
dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const subscribe = async (req, res, next) => {
    try {
      // Check if user is allowed to subscribe
      console.log(req)
      if (req.user.userLevel === 1 || req.user.userLevel === 2) {
        return next(errorHandler(403, 'You are not allowed to subscribe'));
      }
  
      const { userId, plan } = req.body;
  
      // Calculate the validUntil date based on the plan
      const startDate = new Date();
      let validUntil;
  
      switch (plan) {
        case 0:
          validUntil = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from startDate
          break;
        case 1:
          validUntil = new Date(startDate.getTime() + 28 * 24 * 60 * 60 * 1000); // 28 days from startDate
          break;
        case 2:
          validUntil = new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()); // 1 year from startDate
          break;
        default:
          return next(errorHandler(400, 'Invalid plan')); // Handle invalid plan
      }
  
      // Create the subscription object
      const newSubscription = new Sub({
        userId,
        startDate,
        validUntil,
        status: 1,// Set status to pending initially
        history: [
          {
            paymentDate: startDate,
            type: plan, // Store the type of subscription (plan)
          },
        ],
      });
  
      // Save the subscription to the database
      await newSubscription.save();
  
      // Send success response
      return res.status(201).json({
        message: 'Subscription created successfully',
        subscription: newSubscription,
      });
    } catch (error) {
      return next(error);
    }
  };





// Reusable function for handling subscription updates
const handleSubscriptionUpdate = async (userId, type, sessionId, status = 2) => {
    const getUpdatedValidityDate = (currentDate, subscriptionType) => {
        switch (subscriptionType) {
            case 1: // Weekly
                return new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000); // 7 days from startDate
            case 2: // Monthly
                return new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000); // 30 days from startDate
            case 3: // Yearly
                return new Date(startDate.getFullYear() + 1, startDate.getMonth(), startDate.getDate()); // 1 year from startDate
            default:
                return currentDate;
        }
    };

    const sub = await Sub.findOne({ userId });
    const now = new Date();
    const valid = new Date(sub.validUntil);
    let startDate;
    if (valid < now) {
        startDate = now;
    }else{
        startDate = valid;
    }
    const validityDate = getUpdatedValidityDate(startDate, type);
    // console.log('start date is '+ startDate);
    // console.log('extended date is '+ validityDate);
    if (sub) {
        // Update existing subscription
        const updatedSub = await Sub.findByIdAndUpdate(
            sub._id,
            {
                $set: {
                    validUntil: validityDate,
                    status,
                    sessionId,
                },
                $push: {
                    history: {
                        paymentDate: now,
                        type,
                    }
                }
            },
            { new: true }
        );
        await updatedSub.save();
        // console.log(updatedSub);
    } else {
        // Create new subscription
        const newSub = new Sub({
            userId,
            validUntil: validityDate,
            status,
            sessionId,
            history: [{
                paymentDate: now,
                type,
            }]
        });
        await newSub.save();
        // console.log(newSub);
    }
};

// checkoutSession function to handle stripe session
export const checkoutSession = async (req, res, next) => {
    const { product, type, userId } = req.body;
    
    if (!product || typeof product !== 'object' || !userId || !type) {
        return res.status(400).json({ error: 'Product, userId, and type are required' });
    }

    const lineItem = {
        price_data: {
            currency: 'lkr',
            product_data: {
                name: product.name,
            },
            unit_amount: Math.round(product.price) * 100,
        },
        quantity: 1,
    };

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [lineItem],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/pricing?cancelled=false&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.CLIENT_URL}/pricing?cancelled=true&session_id={CHECKOUT_SESSION_ID}`,
        });

        // Call the reusable function for subscription handling
        await handleSubscriptionUpdate(userId, type, session.id, 2); // Default status is 2 (Pending)

        res.json({ id: session.id });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

// makePayment function to call handleSubscriptionUpdate
export const makePayment = async (req, res, next) => {
    try {
        // Check if user is allowed to subscribe
        if (req.user.userLevel === 1 || req.user.userLevel === 2) {
            return next(errorHandler(403, 'You are not allowed to subscribe'));
        }

        const { userId, type, status = 2 } = req.body;

        // Check for required fields
        if (!userId || !type) {
            return next(errorHandler(400, 'User ID and subscription type required'));
        }

        if (!['1', '2', '3'].includes(type)) {
            return next(errorHandler(400, 'Invalid subscription type'));
        }

        // Call the reusable function for subscription handling
        await handleSubscriptionUpdate(userId, type, req.body.sessionId, status);
        console.log("payment initailaied1")
        res.status(200).json({ message: "Subscription processed. Confirmation required!" });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

// function to confirm payment
export const confirmPayment = async (req, res, next) => {
    try {
        const { userId, sessionId } = req.body;

        // Validate required fields
        if (!userId || !sessionId) {
            return next(errorHandler(400, 'User ID, subscription type, and session ID required'));
        }

        // Find subscription by user ID
        const sub = await Sub.findOne({ userId });
        const now = new Date();  // Define the current date for history

        if (sub) {
            // Update existing subscription
            const updatedSub = await Sub.findByIdAndUpdate(
                sub._id,
                {
                    $set: {
                        status: 1,           // Confirmed status
                        sessionId: 0,        // Reset session ID after confirmation
                    },
                },
                { new: true }
            );

            await updatedSub.save();
            console.log("payment confirmed!")
            return res.status(200).json({ message: "Subscription confirmed!" });
        } else {
            // Handle case where subscription does not exist
            return next(errorHandler(404, 'Subscription not found for this user'));
        }
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

export const cancelPayment = async (req, res, next) => {
    try {
        const { userId, sessionId } = req.body;
        // console.log("cancle payment loaded");

        // Validate required fields
        if (!userId || !sessionId) {
            return next(errorHandler(400, 'User ID and session ID required'));
        }

        // Find subscription by user ID
        const sub = await Sub.findOne({ userId });
        
        if (sub) {
            // console.log("inside sub if");

            // Update existing subscription to canceled
            const updatedSub = await Sub.findByIdAndUpdate(
                sub._id,
                {
                    $set: {
                        status: 0,           // Canceled status
                        sessionId: 0,        // Reset session ID
                    },
                    $pop: { history: 1 }   // Remove the last item from the history array
                },
                { new: true }
            );

            await updatedSub.save();
            // console.log(updatedSub);
            console.log("payment canceled!")
            return res.status(200).json({ message: "Subscription canceled successfully, last history entry removed!" });
        } else {
            // Handle case where subscription does not exist
            return next(errorHandler(404, 'Subscription not found for this user'));
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


// Controller function to get a subscription by userId
export const getSubs = async (req, res, next) => {
    const userId = req.params.userId;  // Ensure userId is passed correctly

    try {
        // Check if userId is a valid MongoDB ObjectId or change to findOne if using userId as a field
        const sub = await Sub.findOne({ userId: userId });

        // If no subscription is found, return a 404 error
        if (!sub) {
            return next(errorHandler(400, 'Subscription not found'));
        }

        // Respond with the found subscription
        res.status(200).json(sub);
    } catch (error) {
        // Pass any errors to the error-handling middleware
        next(error);
    }
};


export const deleteSub = async (req, res, next) => {
    console.log("works")
    
};

export const updateSub = async (req, res, next) => {
    console.log("works")
    
};

