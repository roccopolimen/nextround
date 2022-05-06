import { useQuery, UseQueryResult } from "react-query";
import { fetcher } from "api/fetcher";
import { Failure, ForumPostObject } from "typings";

/**
 * @description GET /forum?num_posts=<number>
 * @param {number} numPosts 
 * @returns {UseQueryResult<Array<ForumPostObject>>} the requested number of posts
 * @throws if fails
 */
export const useGetForum = (numPosts: number): UseQueryResult<Array<ForumPostObject>> => {
    return useQuery('getForum', async () => {
        const { data, status } = await fetcher.get<Array<ForumPostObject> | Failure>(`/forum?num_posts=${numPosts}`);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as Array<ForumPostObject>);
    });
};

/**
 * @description POST /forum
 * @returns {UseQueryResult<ForumPostObject>} the newly created post
 * @throws if fails
 */
export const useCreatePost = (content: string): UseQueryResult<ForumPostObject> => {
    const body: Partial<ForumPostObject> = {
        content: content
    };
    return useQuery('createPost', async () => {
        const { data, status } = await fetcher.post<Partial<ForumPostObject> | Failure>('/forum', body);
        if(status !== 200) throw new Error(`${(data as Failure).message}\n\n${(data as Failure).error}`);
        return (data as ForumPostObject);
    });
};