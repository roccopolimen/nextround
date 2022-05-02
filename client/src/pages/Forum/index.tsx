
import { useEffect, useState } from 'react';
import { useGetForum } from 'api';
import {ForumPostObject } from 'typings';

export default function Forum() {
    let startPosts: ForumPostObject[] = [];
    const { data: postData, isLoading: isLoadingPosts, refetch: refetchPosts } = useGetForum(10);

    useEffect(() => {
        console.log(postData);
        // setPosts(posts);
    });


    return (
        <div>

        </div>
    );
}