import express from 'express';
import cycleData from '../data/cycles';
import { checkObjectId } from '../helpers/error';

const router = express.Router();

// GET /cycles
router.get('/', async (req, res) => {
    // Gets current cycle
    try {
        let cycles: object[] = await cycleData.readAll(req.session.user._id);
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
        throw new Error('Invalid id');
    }
    // Gets cycle with id of :id
    try {
        let cycle: object = await cycleData.readById(req.params.id);
        return res.json(cycle);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get current cycle.',
            error: e.message });
    }
});

// POST /cycles
router.post('/', async (req, res) => {
    // Creates a new cycle
    try {
        let cycle: object = await cycleData.create(req.session.user._id);
        return res.json(cycle);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to create new cycle.',
            error: e.message });
    }
});

export default router;