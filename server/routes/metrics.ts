import express from 'express';
import { ObjectId } from 'mongodb';
import { getAllCycles, getCycleByID, getMetricsByID, getUserById } from '../data';
import { checkObjectId } from '../helpers/error';
import { CycleObject, MetricsObject, UserObject } from '../typings';

const router = express.Router();

// GET /metrics
router.get('/', async (req, res) => {
    // Gets current cycle
    try {
        let cycles: CycleObject[] = await getAllCycles(req.session.user._id);
        let metrics: MetricsObject = await getMetricsByID(
            cycles.slice(-1)[0]._id.toString());
        return res.json(metrics);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get metrics.',
            error: e.message });
    }
});

// GET /metrics/:id
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

    // Check cycle exists
    try {
        await getCycleByID(req.params.id);
    } catch(e) {
        return res.status(404).json({ 
            message: 'Not Found. Cycle with that id does not exist.',
            error: e.message });
    }

    // Get metrics
    try {
        let metrics: MetricsObject = await getMetricsByID(req.params.id);
        return res.json(metrics);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get metrics.',
            error: e.message });
    }
});

export default router;