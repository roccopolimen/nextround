import express from 'express';
import { getAllCycles } from '../data';
import { ApplicationObject, CycleObject } from '../typings';

const router = express.Router();

// GET /offers
router.get('/', async (req, res) => {
    // Gets current cycle
    try {
        let cycles: CycleObject[] = await getAllCycles(req.session.user._id);
        let offers: ApplicationObject[] = [];
        // For each app in current cycle, add to offers if progess is 2 (offer)
        for(let application of cycles.slice(-1)[0].applications)
            if(application.progress === 1)
                offers.push(application);
        return res.json(offers);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get offers.',
            error: e.message });
    }
});

export default router;