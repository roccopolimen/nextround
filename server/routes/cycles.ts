import express from 'express';
import { ObjectId } from 'mongodb';
import { getCycleByID, getAllCycles, createCycle, finishCycle, getUserById,  } from '../data';
import { checkObjectId } from '../helpers/error';
import { CycleObject, UserObject } from '../typings';

const router = express.Router();

// GET /cycles
router.get('/', async (req, res) => {
    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    // Gets current cycle
    try {
        const cycles: Array<CycleObject> = await getAllCycles(req.session.user._id);
        res.json(cycles.slice(-1)[0]);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to get current cycle.',
            error: e.message
        });
    }
});

// GET /cycles/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if(!id || !checkObjectId(id))
        return res.status(400).json({ message: 'Invalid id.' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    // Verify user owns cycle
    try {
        const userInfo: UserObject = await getUserById(req.session.user._id);
        if(userInfo.cycles.findIndex(c => c.toString() === id) === -1)
            throw new Error("User does not own cycle with that id.");
    } catch(e) {
        return res.status(404).json({ 
            message: 'Not Found. Cycle with that id does not exist.',
            error: e.message
        });
    }

    // Get cycle
    try {
        const cycle: CycleObject = await getCycleByID(id);
        res.json(cycle);
    } catch(e) {
        res.status(404).json({ 
            message: 'Not Found. Cycle with that id does not exist.',
            error: e.message
        });
    }
});

// POST /cycles
router.post('/', async (req, res) => {

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    // Creates a new cycle
    try {
        const cycle: CycleObject = await createCycle(req.session.user._id);
        res.json(cycle);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to create new cycle.',
            error: e.message
        });
    }
});

// POST /cycles/finish
router.post('/finish', async (req, res) => {
    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });
    
    // Finishes current cycle
    try {
        const cycle: CycleObject = await finishCycle(req.session.user._id);
        res.json(cycle);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to finish current cycle.',
            error: e.message
        });
    }
});

export default router;