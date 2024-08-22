import express from 'express';
import { verifyToken } from '../utils/verifyUser.js';
import { 
    makePayment, 
    getSubs, 
    deleteSub, 
    updateSub, 
    payhere
} from '../controllers/sub.controller.js';

const router = express.Router();

router.post('/makepayment', makePayment);
router.post('/payhere', payhere);
router.get('/getsubs', getSubs);
router.delete('/deletesub/:subId', verifyToken, deleteSub);
router.put('/updatesub/:subId', verifyToken, updateSub);


export default router;