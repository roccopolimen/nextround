import express from 'express';
import { createForumPost, getForumPosts } from '../data/';
import { checkNonEmptyString, checkNonNegativeNumber } from '../helpers';
import { ForumPostObject } from '../typings';

const router = express.Router();

// GET /forum?num_posts=<number>
router.get('/', async (req, res) => {
    if(!req.query.num_posts)
        return res.status(400).json({ message: 'Number of posts not provided.' });

    const num_posts: number = parseInt("" + req.query.num_posts);
    if(!checkNonNegativeNumber(num_posts))
        return res.status(400).json({ message: 'Invalid number of posts' });

    if(!req.session.user)
        return res.status(401).json({ message: 'User is not authorized, must be logged in.' });

    try {
        res.json(await getForumPosts(num_posts));
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to get forum posts.',
            error: e.message
        });
    }
});

// POST /forum
router.post('/', async (req, res) => {
    const { content } = req.body;
    if(!content || !checkNonEmptyString(content))
        return res.status(400).json({ message: 'Invalid content' });

    // Create new post and return it
    try {
        const newPost: ForumPostObject = await createForumPost(req.session.user._id, content);
        res.json(newPost);
    } catch(e) {
        res.status(500).json({ 
            message: 'Internal Server Error. Failed to create forum post.',
            error: e.message
        });
    }
});

export default router;