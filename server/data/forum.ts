import { ObjectId } from 'mongodb';
import { media } from '../config/mongoCollections';
import { checkObjectId, checkNonNegativeNumber } from '../helpers';
import { ForumPostObject, MetricsObject, UserObject } from '../typings';
import { getMetricsByID } from './metrics';
import { getUserById } from './users';

/**
 * @description Gets all posts from the forum
 * @param {number} num_posts Number of posts to return
 * @returns {Promise<Array<ForumPostObject>>} List of posts
 */
export const getForumPosts = async (
    num_posts: number): Promise<Array<ForumPostObject>> => {
    if(!num_posts || !checkNonNegativeNumber(num_posts)){
        throw new Error('Invalid number of posts');
    }

    const forumCollection = await media();
    const forumPosts: Array<ForumPostObject> = await forumCollection.find({
        }).limit(num_posts).toArray();
    return forumPosts;
}

/**
 * @description Creates a new forum post
 * @param {string} userId User id
 * @param {string} content Content of the post
 * @returns {Promise<ForumPostObject>} The newly created post object
 */
export const createForumPost = async (userId: string,
     content: string): Promise<ForumPostObject> => {
    
    if(!userId || !checkObjectId(userId)){
        throw new Error('Invalid id');
    }

    if(!content) {
        throw new Error('Invalid content');
    }

    const poster: UserObject = await getUserById(userId);
    if(poster === null)
        throw new Error("There is no user with that id.");

    let jobCycle: ObjectId = poster.cycles[poster.cycles.length - 1];
    let metrics: MetricsObject = await getMetricsByID(jobCycle.toString());
    let postDate: Date = new Date();

    let forumPost: ForumPostObject = {
        _id: new ObjectId(),
        poster: poster._id,
        content: content,
        postDate: postDate,
        jobCycle: jobCycle,
        metrics: metrics
    };

    // Add to media database
    const forumCollection = await media();
    const insertInfo = await forumCollection.insertOne(forumPost);
    if(insertInfo.insertedCount === 0)
        throw new Error("Failed to create forum post.");
        
    return forumPost;
}