import express from 'express';
import { getAllCycles, getCycleByID, getMetricsByID, getUserById } from '../data';
import { checkObjectId } from '../helpers/error';
import { CycleObject, MetricsObject, UserObject } from '../typings';

const router = express.Router();

// GET /metrics
router.get('/', async (req, res) => {
    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    // Gets current cycle
    try {
        const cycles: Array<CycleObject> = await getAllCycles(req.session.user._id);
        const metrics: MetricsObject = await getMetricsByID(cycles.slice(-1)[0]._id.toString());
        res.json(metrics);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to get metrics.',
            error: e.message
        });
    }
});

// GET /metrics/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    if(!id || !checkObjectId(id))
        return res.status(400).json({ message: 'Invalid id.' });

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

    // Check cycle exists
    try {
        await getCycleByID(id);
    } catch(e) {
        return res.status(404).json({ 
            message: 'Not Found. Cycle with that id does not exist.',
            error: e.message
        });
    }

    // Get metrics
    try {
        const metrics: MetricsObject = await getMetricsByID(id);
        res.json(metrics);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to get metrics.',
            error: e.message
        });
    }
});

export default router;