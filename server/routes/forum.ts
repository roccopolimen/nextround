import express from 'express';
import { createForumPost, getForumPosts } from '../data/';
import { checkNonEmptyString, checkPositiveNumber } from '../helpers';
import { ForumPostObject } from '../typings';

const router = express.Router();

// GET /forum?num_posts=<number>
router.get('/', async (req, res) => {
    const num_posts: number = parseInt("" + req.query.num_posts);
    if(!checkPositiveNumber(num_posts)){
        return res.status(400).send('Invalid number of posts');
    }

    try {
        return res.json(await getForumPosts(num_posts));
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to get forum posts.',
            error: e.message });
    }
});

// POST /forum
router.post('/', async (req, res) => {
    const { content } = req.body;
    if(!checkNonEmptyString(content)){
        return res.status(400).send('Invalid content');
    }

    // Create new post and return it
    try {
        const newPost: ForumPostObject = await createForumPost(
            req.session.user._id, content);
        return res.json(newPost);
    } catch(e) {
        return res.status(500).json({ 
            message: 'Internal Server Error. Failed to create forum post.',
            error: e.message });
    }
});

export default router;