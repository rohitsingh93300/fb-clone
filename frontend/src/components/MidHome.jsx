import React, { useEffect, useState } from 'react'
import StoryBar from './StoryBar'
import PostCard from './PostCard'
import CreatePost from './CreatePost'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setPosts, triggerPostCreated } from '@/redux/postSlice'

const MidHome = () => {
    const dispatch = useDispatch()
    const {posts, postCreated} = useSelector(store=>store.post)
    const [refreshPosts, setRefreshPosts] = useState(false);

    const getAllPost = async () => {
        try {
            const res = await axios.get(`https://fb-clone-726q.onrender.com/api/v1/post/getallpost`)
            if (res.data.success) {
               dispatch(setPosts(res.data.posts)) 
               
            }
        } catch (error) {
            console.log(error);

        }
    }
    useEffect(() => {
        getAllPost()
    }, [refreshPosts])

    console.log('Rohit')
    return (
        <div className='pt-16 md:pl-[420px] dark:bg-[#1b1b1c] bg-[#f2f4f7] flex-1 justify-center px-3 md:px-0'>
            <CreatePost setRefreshPosts={setRefreshPosts} />
            <StoryBar />
            <div className='space-y-4 max-w-[900px]'>

                {
                    posts.map((post, index) => {
                        return <PostCard key={index} post={post} />
                    })
                }
            </div>

        </div>
    )
}

export default MidHome
