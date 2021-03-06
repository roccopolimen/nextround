import express from 'express';
import { getAllCycles } from '../data';
import { ApplicationObject, CycleObject } from '../typings';

const router = express.Router();

// GET /offers
router.get('/', async (req, res) => {
    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    // Gets current cycle
    try {
        let cycles: Array<CycleObject> = await getAllCycles(req.session.user._id);
        let offers: Array<ApplicationObject> = [];

        // For each app in current cycle, add to offers if progess is 2 (offer)
        for(let application of cycles.slice(-1)[0].applications)
            if(application.progress === 1)
                offers.push(application);
        
        res.json(offers);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to get offers.',
            error: e.message
        });
    }
});

export default router;