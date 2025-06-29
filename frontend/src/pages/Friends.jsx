import Navbar from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { FiUserX } from "react-icons/fi";
import userLogo from "../assets/emptyUser.webp"
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
 import { useSelector } from 'react-redux';
import { setUser, setUserProfile } from '@/redux/authSlice';
import { useDispatch } from 'react-redux';

const Friends = () => {
    const [allRequest, setAllRequest] = useState([])
    const [peopleYouMayKnow, setPeopleYouMayKnow] = useState([])
     const {user, userProfile} = useSelector(store=>store.auth)
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const getFriendRequest = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/auth/requests`, { withCredentials: true })
            if (res.data.success) {
                setAllRequest(res.data.requests)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const getPeopleYouMayKnow = async () => {
        try {
            const res = await axios.get(`http://localhost:8000/api/v1/auth/suggestions`, { withCredentials: true })
            if (res.data.success) {
                setPeopleYouMayKnow(res.data.suggestions)
            }
        } catch (error) {
            console.log(error);
        }
    }

    const acceptFriendRequest = async (id) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/auth/request/accept/${id}`, {}, {
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                dispatch(setUserProfile(res.data.userProfile))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);

        }
    }

     const sendFriendRequest = async (id) => {
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/auth/request/send/${id}`, {}, {
                withCredentials: true
            })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                dispatch(setUserProfile(res.data.userProfile))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);

        }
    }

    const getCancelFriendRequest = async(id)=>{
        try {
            const res = await axios.put(`http://localhost:8000/api/v1/auth/request/cancel/${id}`,{},{withCredentials:true})
            if(res.data.success){
                dispatch(setUser(res.data.user))
                dispatch(setUserProfile(res.data.userProfile))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            
        }
    }

       const rejectFriendRequest = async(id)=>{
        try {
           const res = await axios.put(`http://localhost:8000/api/v1/auth/request/reject/${id}`, {}, { withCredentials: true })
            if (res.data.success) {
                dispatch(setUser(res.data.user))
                dispatch(setUserProfile(res.data.userProfile))
                toast.success(res.data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        }
    }

   
    useEffect(() => {
        getFriendRequest()
        getPeopleYouMayKnow()
    }, [user, userProfile])
    return (
        <div>
            <Navbar />
            <div className='pt-20 md:pl-[350px] px-4 h-screen md:h-full'>
                <h1 className='text-2xl font-semibold'>Friend Request</h1>
                {
                    allRequest.length > 0 ?
                        <div className='grid grid-cols-1 md:grid-cols-4 gap-2 mt-5'>
                            {
                                allRequest.map((user) => {
                                    return <div key={user._id} className='md:border dark:md:border-gray-200 md:border-gray-300 rounded-2xl p-2 md:p-0 w-[350px] md:w-[280px] dark:bg-[#262829] bg-white flex md:flex-col shadow-lg'>
                                        <img src={user.profilePicture || userLogo} onClick={() => navigate(`/profile/${user._id}/post`)} alt="" className='md:rounded-t-2xl md:rounded-b-none rounded-full w-28 md:p-0 p-4 md:w-full aspect-square bg-cover' />
                                        <div className='p-4 space-y-2'>
                                            <h1 className='font-semibold text-lg'>{user.firstname} {user.lastname}</h1>
                                            <div className='flex md:flex-col gap-2'>
                                            <Button onClick={() => acceptFriendRequest(user._id)} className="bg-[#0866ff] hover:bg-[#0866ff] text-white md:w-full cursor-pointer">Confirm</Button>
                                            <Button onClick={()=> rejectFriendRequest(user._id)} className="dark:bg-[#3b3d3e] dark:hover:bg-[#3b3d3e] bg-[#e1e4e8] hover:bg-[#e1e4e8] text-gray-800 dark:text-white md:w-full cursor-pointer">Delete</Button>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }

                        </div> : <div className='border p-5 mt-5 flex flex-col gap-3 items-center border-gray-200 rounded-2xl w-[280px] dark:bg-[#262829]'>
                            <FiUserX className='w-12 h-12' />
                            <h1 className='text-xl font-semibold'>No friend requests</h1>
                            <p className='text-center'>Looks like you're all caught up! Why not explore and connect with new people?</p>
                        </div>
                }
                <hr className='my-12' />
                <h1 className='text-2xl font-semibold'>People you may know</h1>
                
                    {
                        peopleYouMayKnow.length > 0 ? <div className='grid md:grid-cols-4 gap-2 mt-5'>
                            {
                                peopleYouMayKnow.map((user) => {
                                    return <div key={user._id} className='md:border md:border-gray-200 rounded-2xl p-2 md:p-0 w-[350px] md:w-[280px] dark:bg-[#262829] bg-white flex md:flex-col'>
                                        <img src={user.profilePicture || userLogo} onClick={() => navigate(`/profile/${user._id}/post`)} alt="" className='md:rounded-t-2xl md:rounded-b-none rounded-full w-28 md:p-0 p-4 md:w-full aspect-square bg-cover' />
                                        <div className='p-4 space-y-2'>
                                            <h1 className='font-semibold text-lg'>{user.firstname} {user.lastname}</h1>
                                            <div className='flex md:flex-col gap-2'>
                                            <Button onClick={() => sendFriendRequest(user._id)} className="dark:bg-[#243a52] dark:hover:bg-[#243a52bc] bg-[#ebf5ff] hover:bg-[#ebf5ff] text-blue-400 md:w-full cursor-pointer">Add friend</Button>
                                            <Button className="dark:bg-[#3b3d3e] dark:hover:bg-[#3b3d3e] bg-[#e1e4e8] hover:bg-[#e1e4e8] text-gray-800 dark:text-white md:w-full cursor-pointer">Remove</Button>
                                            </div>
                                        </div>
                                    </div>
                                })
                            }
                        </div>: <div className='border p-5 mt-5 mb-20 flex flex-col gap-3 items-center border-gray-200 rounded-2xl w-[280px] dark:bg-[#262829]'>
                            <FiUserX className='w-12 h-12' />
                            <h1 className='text-xl font-semibold'>No friend requests</h1>
                            <p className='text-center'>Looks like you're all caught up! Why not explore and connect with new people?</p>
                        </div>
                       
                    }

                
            </div>
        </div>
    )
}

export default Friends
