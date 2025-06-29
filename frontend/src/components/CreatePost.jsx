import { readFileAsDataURL } from '@/lib/utils';
import React, { useRef, useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { FaEarthAmericas } from "react-icons/fa6";
import { TiArrowSortedDown } from "react-icons/ti";
import { Textarea } from './ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Input } from './ui/input'
import { Image, Smile, Video, X } from 'lucide-react'
import { useSelector } from 'react-redux';
import userLogo from "../assets/user.jpg"
import axios from 'axios';
import { toast } from 'sonner';

const CreatePost = ({setRefreshPosts}) => {
    const [open, setOpen] = useState(false)
    const [content, setContent] = useState('');
    const [file, setFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const imageRef = useRef();
    const { user } = useSelector(store => store.auth)

    const fileChangeHandler = async (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file); // <-- save the file
            const dataUrl = await readFileAsDataURL(file);
            setImagePreview(dataUrl);
        }
    }

    const submitHandler = async () => {

        if (!content && !file) {
            toast.error("Post must have content or an image.");
            return;
        }

        const formData = new FormData();
        formData.append("content", content);
        if (file) formData.append("file", file);

        try {
            const res = await axios.post(`http://localhost:8000/api/v1/post/create`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                },
                withCredentials: true
            })
            if (res.data.success) {
                toast.success(res.data.message)
                setContent("");
                setFile(null);
                setImagePreview("");
                setOpen(false);
                setRefreshPosts(prev => !prev);
            }
        } catch (error) {
            console.log(error);
            toast.error("Failed to post");

        }
    }
    return (
        <div className='bg-white dark:bg-[#262829] p-5 rounded-lg max-w-[600px] md:mt-2'>
            <div className='flex gap-3'>
                <Avatar>
                    <AvatarImage src={user.profilePicture || userLogo} />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

                <Dialog open={open} onOpenChange={setOpen} className="bg-red-600">
                    <Input onClick={() => setOpen(true)} className="bg-gray-200 cursor-pointer rounded-full text-xl p-5 focus:outline-none focus:ring-0 focus-visible:outline-none" placeholder={`What's on your mind, ${user.firstname}?`} />

                    <DialogContent className="sm:max-w-[500px] dark:bg-[#262829]">
                        <DialogHeader>
                            <DialogTitle className="text-center text-xl font-semibold">Create Post</DialogTitle>
                            <hr className='my-2' />
                            <div className='flex gap-3 items-center'>
                                <Avatar>
                                    <AvatarImage src={user.profilePicture || userLogo} />
                                    <AvatarFallback>CN</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h1 className='font-semibold'>{user.firstname} {user.lastname}</h1>
                                    <div className='bg-gray-200 rounded-lg p-1 px-2 flex gap-1 items-center'>
                                        <FaEarthAmericas className='text-gray-700 w-4 h-4' />
                                        <span className='text-sm'>Public</span>
                                        <TiArrowSortedDown />
                                    </div>
                                </div>
                            </div>
                        </DialogHeader>
                        <Textarea placeholder={`What's on your mind, ${user.firstname}?`} className="text-xl"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
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
                            <Button onClick={submitHandler} type="submit" className="w-full bg-[#0866ff]">Post</Button>
                        </DialogFooter>
                    </DialogContent>

                </Dialog>


            </div>
            <hr className='my-4' />
            <div className='flex gap-7 items-center w-full'>
                <div onClick={() => setOpen(true)}
                    className='flex items-center gap-2 w-full justify-center font-semibold cursor-pointer'>
                    <Image className='text-green-600' />
                    Photo
                </div>
                <div onClick={() => setOpen(true)}
                    className='flex items-center gap-2 w-full justify-center font-semibold cursor-pointer'>
                    <Video className='text-red-500' />
                    Video
                </div>
                <div onClick={() => setOpen(true)}
                    className='flex items-center gap-2 w-full justify-center font-semibold cursor-pointer'>
                    <Smile className='text-orange-500' />
                    Feeling
                </div>
            </div>

        </div>

    )
}

export default CreatePost
