import CreatePost from '@/components/CreatePost'
import FriendComp from '@/components/FriendComp'
import Intro from '@/components/Intro'
import Photos from '@/components/Photos'
import PostCard from '@/components/PostCard'
import React from 'react'
import { useSelector } from 'react-redux'

const PostPage = () => {
    const {userProfile} = useSelector(store=>store.auth)
    return (
        <div className='flex flex-col md:flex-row max-w-6xl mx-auto gap-2 md:gap-5 mt-2 md:mt-5 px-2 md:px-10'>
            <div>
                {/* intro */}
                <Intro />
                <Photos posts={userProfile?.posts} />
                <FriendComp friends={userProfile?.friends} />
            </div>
            {/* create post */}
            <div className='space-y-5'>
                <CreatePost />
                <div className='space-y-4'>
                    {
                        userProfile?.posts.map((post, index) => {
                            return <PostCard key={index} post={post} />
                        })
                    }
                </div>

            </div>
        </div>
    )
}

export default PostPage
