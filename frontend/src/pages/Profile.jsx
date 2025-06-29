import { Button } from '@/components/ui/button';
import { Edit, Images, SquareUser } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { MdDashboard } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';
import userLogo from "../assets/user.jpg"
import emptyCover from "../assets/emptyCover.jpg"
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { setLoading, setUser, setUserProfile } from '@/redux/authSlice';
import { FaCamera, FaFacebookMessenger, FaUserPlus } from "react-icons/fa";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { FaUserCheck } from 'react-icons/fa6';
import unfollow from "../assets/unfollow.png"
import { FiUserX } from 'react-icons/fi';

const Profile = () => {
    const dispatch = useDispatch()
    const { user, userProfile, loading } = useSelector(store => store.auth)
    const coverImage = userProfile?.coverPhoto || emptyCover
    const params = useParams()
    const profileRef = useRef()
    const CoverRef = useRef()
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()

    const fetchUserProfile = async () => {
        try {
            const res = await axios.get(`https://fb-clone-726q.onrender.com/api/v1/auth/${params.id}/profile`)
            if (res.data.success) {
                dispatch(setUserProfile(res.data.user))
                console.log(res.data.user);

            }
        } catch (error) {
            console.log(error);

        }
    }



    const handleProfilePicChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            dispatch(setLoading(true))
            const res = await axios.put(
                `https://fb-clone-726q.onrender.com/api/v1/auth/update/profile-pic`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                const profilePicture = res.data.profilePicture
                dispatch(setUser({ ...user, profilePicture }))
                dispatch(setUserProfile({ ...userProfile, profilePicture }))
            }
            console.log("API Response:", res);
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            toast.error("Failed to update profile picture.");
        } finally {
            dispatch(setLoading(false))
        }
    };

    const handleCoverPicChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            dispatch(setLoading(true))
            const res = await axios.put(
                `https://fb-clone-726q.onrender.com/api/v1/auth/update/cover-pic`,
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data"
                    },
                    withCredentials: true,
                }
            );

            if (res.data.success) {
                toast.success(res.data.message);
                const coverPhoto = res.data.coverPhoto
                dispatch(setUser({ ...user, coverPhoto }))
                dispatch(setUserProfile({ ...userProfile, coverPhoto }))
            }
            console.log("API Response:", res);
        } catch (error) {
            console.error("Error uploading cover picture:", error);
            toast.error("Failed to update cover picture.");
        } finally {
            dispatch(setLoading(false))
        }

    }

    const sendFriendRequest = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/request/send/${id}`, {}, {
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

    const acceptFriendRequest = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/request/accept/${id}`, {}, {
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

    const getCancelFriendRequest = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/request/cancel/${id}`, {}, { withCredentials: true })
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

    const rejectFriendRequest = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/request/reject/${id}`, {}, { withCredentials: true })
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

    const unFriendUser = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/unfriend/${id}`, {}, { withCredentials: true })
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
    const unFollowUser = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/unfollow/${id}`, {}, { withCredentials: true })
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
    const followUser = async (id) => {
        try {
            const res = await axios.put(`https://fb-clone-726q.onrender.com/api/v1/auth/follow/${id}`, {}, { withCredentials: true })
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

    // const arr = user.friends.map((friend) => friend._id)
    useEffect(() => {
        fetchUserProfile()
        scrollTo(0, 0)
    }, [params.id, user])

    return (
        <div className=" min-h-screen ">

            {loading && (
                <div className="fixed inset-0 z-[9999] bg-black/30 backdrop-blur-sm flex items-center justify-center">
                    <div className="text-white text-xl font-semibold animate-pulse">
                        Uploading...
                    </div>
                </div>
            )}

            <div className="relative w-full ">
                {/* Blurred Background */}
                <div
                    className="absolute inset-0 bg-center bg-cover filter"
                    style={{
                        backgroundImage: `url(${coverImage})`,
                    }}
                ></div>

                {/* Overlay to darken the blur */}
                <div className="absolute inset-0 bg-black/40 backdrop-blur-lg bg-gradient-to-b from-transparent dark:to-[#262829] to-white"></div>

                {/* Actual Cover Image */}
                <div className="relative flex justify-center items-center">
                    <img
                        src={coverImage}
                        alt="Cover"
                        className="rounded-lg w-6xl h-[300px] md:h-[450px]  object-cover"
                    />
                    <input ref={CoverRef} type="file" className='hidden' onChange={handleCoverPicChange} />
                    {
                        user?._id === userProfile?._id && <Button onClick={() => CoverRef.current.click()} className="absolute right-3 md:right-52 cursor-pointer bottom-3 flex gap-2 items-center bg-white text-gray-800 hover:bg-gray-100 "><FaCamera /> <span className='hidden md:block'>Edit cover photo</span></Button>
                    }

                </div>
            </div>

            <div className='dark:bg-[#262829] bg-white z-40 py-4'>
                <div className='max-w-6xl mx-auto md:px-10 px-5 flex flex-col md:flex-row gap-2 md:gap-0  md:justify-between'>
                    <input ref={profileRef} type="file" className='hidden' onChange={handleProfilePicChange} />
                    <div className='flex flex-col md:flex-row md:gap-5 md:items-center relative'>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <img
                                    src={userProfile?.profilePicture || userLogo}
                                    alt="profile"
                                    className="w-44 h-44 cursor-pointer hover:invert-25 rounded-full border-4 border-white dark:border-[#262829] object-cover z-30 -mt-14"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-xs">
                                <DropdownMenuItem onClick={() => setOpen(true)} className="text-lg flex gap-2 items-center">
                                    <SquareUser />
                                    See profile picture
                                </DropdownMenuItem>
                                {
                                    user?._id === userProfile?._id && <DropdownMenuItem onClick={() => {
                                        console.log("Clicked Choose profile");
                                        profileRef?.current.click()
                                    }}
                                        className="text-lg flex gap-2 items-center"><Images className='' />Choose profile picture</DropdownMenuItem>
                                }

                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog open={open} onOpenChange={setOpen}>

                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle className="text-center">Profile Picture</DialogTitle>
                                    <hr className='mt-3' />
                                </DialogHeader>

                                <img src={userProfile?.profilePicture || userLogo} alt="" />

                            </DialogContent>
                        </Dialog>
                        {
                            user?._id === userProfile?._id && <span className='bg-gray-200 absolute z-40 left-32 cursor-pointer bottom-20 md:bottom-5 dark:bg-[#3a3c3d] p-2 rounded-full'><FaCamera className='h-5 w-5' /></span>
                        }

                        <div>
                            <h1 className="text-3xl font-bold">{userProfile?.firstname} {userProfile?.lastname}</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">{userProfile?.followers?.length} followers • {userProfile?.following?.length} following</p>
                        </div>
                    </div>
                    {
                        user?._id === userProfile?._id && <div className='flex gap-2 items-center'>
                            <Button className="bg-[#0866ff] hover:bg-[#0867ffd2] cursor-pointer text-white"><MdDashboard /> Professional Dashboard</Button>
                            <Button className="flex gap-2 items-center bg-[#e1e4e8] hover:bg-[#e1e7ef] cursor-pointer dark:bg-[#3a3c3d] text-gray-800 dark:text-gray-200"><Edit /> Edit</Button>
                        </div>
                    }

                    {
                        user.friends.includes(userProfile?._id) &&
                        <div className='flex gap-2 items-center'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='bg-[#e1e4e8] hover:bg-[#c0c3c6] dark:bg-[#3a3c3d] dark:text-white text-gray-800 cursor-pointer'><FaUserCheck /> Friends</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    {
                                        user.following.includes(userProfile._id) ? <DropdownMenuItem onClick={()=>unFollowUser(userProfile._id)}><img src={unfollow} alt="" className='h-4 w-4' />Unfollow</DropdownMenuItem>: <DropdownMenuItem onClick={()=>followUser(userProfile._id)}><img src={unfollow} alt="" className='h-4 w-4' />follow</DropdownMenuItem>
                                    }
                                    
                                    <DropdownMenuItem onClick={()=>unFriendUser(userProfile._id)}><FiUserX />Unfriend</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button className='bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer'><FaFacebookMessenger /> Message</Button>
                        </div>

                    }

                    {
                        (userProfile?.sentRequests.includes(user._id)) && <div className='flex gap-2 items-center'>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button className='bg-[#0866ff] text-white hover:bg-[#0867ffd2] cursor-pointer '><FaUserCheck />Respond</Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-[200px]">
                                    <DropdownMenuItem onClick={() => acceptFriendRequest(userProfile?._id)}>Confirm</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => rejectFriendRequest(userProfile._id)}>Delete Request</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <Button className='bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer'><FaFacebookMessenger /> Message</Button>
                        </div>

                    }

                    {
                        (userProfile?.friendRequests.includes(user._id)) && <div className='flex gap-2 items-center'>
                            <Button onClick={() => getCancelFriendRequest(userProfile._id)} className='bg-[#0866ff] text-white hover:bg-[#0867ffd2] cursor-pointer '><FaUserCheck />Cancel request</Button>
                            <Button className='bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer'><FaFacebookMessenger /> Message</Button>
                        </div>

                    }
                    {
                        (!user.sentRequests.includes(userProfile?._id) && !user.friendRequests.includes(userProfile?._id)) && (!user.friends.includes(userProfile?._id)) && (user._id !== userProfile?._id) && <div className='flex gap-2 items-center'>
                            <Button onClick={() => sendFriendRequest(userProfile?._id)} className='bg-[#e1e4e8] hover:bg-[#e1e7ef] cursor-pointer dark:bg-[#3a3c3d] text-gray-800 dark:text-gray-200'><FaUserPlus /> Add friend</Button>
                            <Button className='bg-[#0866ff] hover:bg-[#0866ff] text-white cursor-pointer'><FaFacebookMessenger /> Message</Button>
                        </div>
                    }



                    {/* <div className='flex gap-2 items-center'>
                        <Button onClick={() => sendFriendRequest(userProfile._id)} className='bg-[#e1e4e8] hover:bg-[#e1e7ef] cursor-pointer dark:bg-[#3a3c3d] text-gray-800 dark:text-gray-200'><FaUserPlus /> Add friend</Button>
                        <DropdownMenu>
                            <DropdownMenuTrigger>
                                <Button><FaUserCheck />Respond</Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-[200px]">
                                <DropdownMenuItem>Confirm</DropdownMenuItem>
                                <DropdownMenuItem>Delete Request</DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                    </div> */}


                </div>
                <hr className='mt-5 mb-2 max-w-6xl mx-auto' />
                <div className='flex md:gap-10 max-w-6xl mx-auto md:px-10'>
                    <span onClick={() => navigate(`/profile/${userProfile?._id}/post`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>Posts</span>
                    <span onClick={() => navigate(`/profile/${userProfile?._id}/about`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>About</span>
                    <span onClick={() => navigate(`/profile/${userProfile?._id}/friends`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>Friends</span>
                    <span onClick={() => navigate(`/profile/${userProfile?._id}/photos`)} className='hover:bg-[#e1e4e8] dark:hover:bg-[#3a3c3d] px-4 py-2 rounded-lg text-lg font-semibold dark:text-gray-300 text-gray-800 cursor-pointer'>Photos</span>
                </div>
            </div>

            <Outlet />


        </div>
    )
}

export default Profile
