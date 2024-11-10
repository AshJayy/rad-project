import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    makePayment, 
    getSubs, 
    deleteSub, 
    updateSub, 
    payhere,
    subscribe,
    checkoutSession,
    confirmPayment,
    cancelPayment
} from '../controllers/sub.controller.js';

const router = express.Router();

router.post('/makepayment', verifyToken, subscribe);
router.post('/payhere', payhere);
router.get('/getsubs/:userId', getSubs);
router.delete('/deletesub/:subId', verifyToken, deleteSub);
router.put('/updatesub/:subId', verifyToken, updateSub);
router.post('/create-checkout-session', verifyToken, checkoutSession);
router.post('/confirmpayment', verifyToken, confirmPayment);
router.post('/cancelpayment', verifyToken, cancelPayment);

export default router;