import express from 'express';
import { ObjectId } from 'mongodb';
import { getCycleByID, getAllCycles, createCycle, finishCycle, getUserById,  } from '../data';
import { checkObjectId } from '../helpers/error';
import { CycleObject, UserObject } from '../typings';

const router = express.Router();

// GET /cycles
router.get('/', async (req, res) => {
    // Gets current cycle
    try {
        let cycles: CycleObject[] = await getAllCycles(req.session.user._id);
        return res.json(cycles.slice(-1)[0]);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get current cycle.',
            error: e.message });
    }
});

// GET /cycles/:id
router.get('/:id', async (req, res) => {
    if(!checkObjectId(req.params.id)){
        return res.status(400).json({ message: 'Invalid id.' });
    }
    // Verify user owns cycle
    try {
        let userInfo: UserObject = await getUserById(req.session.user._id);
        if(!userInfo.cycles.includes(new ObjectId(req.params.id))) {
            throw new Error("User does not own cycle with that id.");
        }
    } catch(e) {
        return res.status(404).json({ 
            message: 'Not Found. Cycle with that id does not exist.',
            error: e.message });
    }

    // Get cycle
    try {
        let cycle: CycleObject = await getCycleByID(req.params.id);
        return res.json(cycle);
    } catch(e) {
        return res.status(404).json({ 
            message: 'Not Found. Cycle with that id does not exist.',
            error: e.message });
    }
});

// POST /cycles
router.post('/', async (req, res) => {
    // Creates a new cycle
    if(!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        let cycle: CycleObject = await createCycle(req.session.user._id);
        return res.json(cycle);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to create new cycle.',
            error: e.message });
    }
});

// POST /cycles/finish
router.post('/finish', async (req, res) => {
    // Finishes current cycle
    if(!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        let cycle: CycleObject = await finishCycle(req.session.user._id);
        return res.json(cycle);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to finish current cycle.',
            error: e.message });
    }
});

export default router;