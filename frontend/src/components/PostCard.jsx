import React, { useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { BsThreeDots } from "react-icons/bs";
import { Bookmark, Edit, Image, MessageSquare, Smile, ThumbsUp, Trash2, Video, X } from 'lucide-react';
import { PiShareFat } from "react-icons/pi";
import userLogo from "../assets/user.jpg"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import axios from 'axios';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { FaEarthAmericas } from 'react-icons/fa6';
import { TiArrowSortedDown } from 'react-icons/ti';
import { Textarea } from './ui/textarea';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { setPosts } from '@/redux/postSlice';
import { readFileAsDataURL } from '@/lib/utils';
import CommentBox from './CommentBox';

const PostCard = ({ post }) => {
    const { user } = useSelector(store => store.auth)
    const { posts } = useSelector(store => store.post)
    const [open, setOpen] = useState(false)
    const [imagePreview, setImagePreview] = useState(null)
    const [content, setContent] = useState(null)
    const [file, setFile] = useState(post.image)
    const [liked, setLiked] = useState(post?.likes?.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post?.likes?.length)
    const [openCommentDialog, setOpenCommentDialog] = useState(false)
    const imageRef = useRef()
    const dispatch = useDispatch()

    const deleteHandler = async (id) => {
        console.log(id);

        try {
            const res = await axios.delete(`http://localhost:8000/api/v1/post/delete/${id}`, { withCredentials: true })
            if (res.data.success) {
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Error deleting Post")
        }
    }

    const editPostHandler = async (post) => {
        setOpen(true)
        setImagePreview(post.image)
        setContent(post.content)

    }

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file); // <-- save the file
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    const onSubmitHandler = async (id) => {
        if (!content && !file) {
            toast.error("Post must have content or an image.");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        if (file) formData.append("file", file);
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/post/update-post/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setPosts([...posts, res.data.post]))
                toast.success(res.data.message)
                setOpen(false)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`http://localhost:8000/api/v1/post/${post._id}/${action}`, { withCredentials: true })
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked)

                //apne post ko update krunga
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                )
                toast.success(res.data.message);
                dispatch(setPosts(updatedPostData))
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)

        }
    }

    const handleShare = (postId) => {
        const postUrl = `${window.location.origin}/post/${postId}`;

        if (navigator.share) {
            navigator
                .share({
                    title: 'Check out this post!',
                    text: 'Check this amazing post.',
                    url: postUrl,
                })
                .then(() => console.log('Shared successfully'))
                .catch((err) => console.error('Error sharing:', err));
        } else {
            // fallback: copy to clipboard
            navigator.clipboard.writeText(postUrl).then(() => {
                toast.success('Post link copied to clipboard!');
            });
        }
    };

      function formatFBTime(isoTime) {
        const date = new Date(isoTime);
        const now = new Date();
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHr = Math.floor(diffMin / 60);
        const diffDay = Math.floor(diffHr / 24);

        const optionsTime = { hour: 'numeric', minute: '2-digit', hour12: true };
        const optionsDate = { month: 'long', day: 'numeric' };
        const optionsDateYear = { ...optionsDate, year: 'numeric' };

        if (diffSec < 60) return "Just now";
        if (diffMin < 60) return `${diffMin} mins ago`;
        if (diffHr < 24) return `${diffHr} hrs ago`;

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);

        if (
            date.getDate() === yesterday.getDate() &&
            date.getMonth() === yesterday.getMonth() &&
            date.getFullYear() === yesterday.getFullYear()
        ) {
            return `Yesterday at ${date.toLocaleTimeString('en-US', optionsTime)}`;
        }

        if (date.getFullYear() === now.getFullYear()) {
            return `${date.toLocaleDateString('en-US', optionsDate)} at ${date.toLocaleTimeString('en-US', optionsTime)}`;
        }

        return `${date.toLocaleDateString('en-US', optionsDateYear)} at ${date.toLocaleTimeString('en-US', optionsTime)}`;
    }
    return (
        <div className='bg-white dark:bg-[#262829] p-4 rounded-lg md:w-[600px]'>
            <div className='flex justify-between items-center mb-2'>
                <div className='flex gap-2 items-center'>
                    <Avatar>
                        <AvatarImage src={post?.user?.profilePicture || userLogo} />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div>
                        <h1 className='font-semibold'>{post?.user?.firstname} {post?.user?.lastname}</h1>
                        <p className=' text-sm'>{formatFBTime(post.createdAt)}</p>
                    </div>
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger className="">
                        <BsThreeDots className='cursor-pointer' />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-[250px] font-semibold text-gray-600">
                        {
                            user?._id === post?.user?._id && <>
                                <DropdownMenuItem onClick={() => editPostHandler(post)}><Edit /> Edit Post</DropdownMenuItem>
                                <DropdownMenuItem onClick={() => deleteHandler(post._id)}><Trash2 />Delete Post</DropdownMenuItem>
                            </>
                        }

                        <DropdownMenuItem><Bookmark />Save Post</DropdownMenuItem>
                        {/* <DropdownMenuItem>Subscription</DropdownMenuItem> */}
                    </DropdownMenuContent>
                </DropdownMenu>

                <Dialog open={open} onOpenChange={setOpen} className="bg-red-600">
                    <DialogContent className="sm:max-w-[500px] dark:bg-[#262829]">
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl font-semibold">Create Post</DialogTitle>
                            <hr className='my-2' />
                            <div className='flex gap-3 items-center'>
                                <Avatar>
                                    <AvatarImage src={user?.profilePicture || userLogo} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className='font-semibold'>{user?.firstname} {user.lastname}</h1>
                                    <div className='bg-gray-200 rounded-lg p-1 px-2 flex gap-1 items-center'>
                                        <FaEarthAmericas className='text-gray-700 w-4 h-4' />
                                        <span className='text-sm'>Public</span>
                                        <TiArrowSortedDown />
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>
                        <Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder={`What's on your mind, ${user?.firstname}?`} className="text-xl"

                        />
                        {
                            imagePreview && (
                                <div className='w-full h-64 flex items-center justify-center relative'>
                                    <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
                                    <button onClick={() => setImagePreview("")} variant="ghost" className="rounded-full p-1 cursor-pointer absolute top-3 right-3 bg-white text-gray-500"><X className='h-6 w-6 ' /></button>
                                </div>
                            )
                        }
                        <div className='border rounded-lg p-4 flex justify-between items-center'>
                            <h1 className='font-semibold text-gray-800'>Add to your post</h1>
                            <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
                            <div className='flex gap-3 items-center'>
                                <Image onClick={() => imageRef.current.click()} className='text-green-600 cursor-pointer' />
                                <Video onClick={() => imageRef.current.click()} className='text-red-500 cursor-pointer' />
                                <Smile className='text-orange-500 cursor-pointer' />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => onSubmitHandler(post._id)} type="submit" className="w-full cursor-pointer hover:bg-[#0866ff] bg-[#0866ff]">Update Post</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>

            </div>
            <h1 className='mb-2'>{post.content}</h1>
            <img src={post.image} alt="" className='aspect-square rounded-lg' />
            <div className='my-2'>
                <div className='flex justify-between'>
                    <p>{postLike} Likes</p>
                    <div  className='flex items-center gap-7'>
                        <p>{post?.comments?.length || 0} Comments</p>
                        <p>1 Share</p>
                    </div>
                </div>
            </div>
            <hr />
            <div className='flex justify-between items-center mt-2 md:px-7'>
                <div onClick={likeOrDislikeHandler}>
                    {
                        liked ? <div className='flex gap-2 items-center cursor-pointer'>
                            <ThumbsUp fill='#0866ff' className='text-gray-700' />
                            <p className='font-semibold text-blue-600'>Like</p>
                        </div> :
                            <div className='flex gap-2 items-center cursor-pointer'>
                                <ThumbsUp />
                                <p>Like</p>
                            </div>
                    }

                </div>

                <div onClick={()=>setOpenCommentDialog(!openCommentDialog)} className='flex gap-2 items-center cursor-pointer'>
                    <MessageSquare />
                    <p>Comment</p>
                </div>
                <div onClick={() => handleShare(post._id)} className='flex gap-2 items-center cursor-pointer'>
                    <PiShareFat className='h-6 w-6' />
                    <p>Share</p>
                </div>
            </div>
            {
                openCommentDialog && <CommentBox post={post} formatFBTime={formatFBTime}/>
            }
        </div>
    )
}

export default PostCard
