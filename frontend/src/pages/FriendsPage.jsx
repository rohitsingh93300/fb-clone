import FriendComp from '@/components/FriendComp'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import React from 'react'
import { BsThreeDots } from 'react-icons/bs'
import { FiUserX } from 'react-icons/fi'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import unfollow from "../assets/unfollow.png"
import userLogo from "../assets/emptyUser.webp"

const FriendsPage = () => {
    const { userProfile } = useSelector(store => store.auth)
    const navigate = useNavigate()
    return (
        <div className='flex max-w-6xl mx-auto gap-5 md:pb-5 pb-2 md:px-10 px-2'>
            <div className='bg-white dark:bg-[#262829] w-full p-5 rounded-lg mt-2 md:mt-5'>
                <h1 className='font-semibold text-xl mb-5'>Friends</h1>

                {
                    userProfile.friends.length > 0 ? <div className='grid md:grid-cols-2 gap-2 rounded-2xl'>
                        {
                            userProfile.friends.map((friend) => {
                                return <div className='flex justify-between items-center border rounded-2xl p-5 '>
                                    <div key={friend._id} className='flex gap-4 items-center'>
                                        <img onClick={() => navigate(`/profile/${friend._id}/post`)} src={friend.profilePicture || userLogo} alt="" className='aspect-square rounded-xl w-24 h-24 cursor-pointer' />
                                        <h1 className='font-semibold'>{friend.firstname} {friend.lastname}</h1>
                                    </div>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger>
                                           <BsThreeDots />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-[200px]">
                                            <DropdownMenuItem><img src={unfollow} alt="" className='h-4 w-4' />Unfollow</DropdownMenuItem>
                                            <DropdownMenuItem><FiUserX />Unfriend</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                    
                                </div>
                            })
                        }
                    </div> : <div>
                        <h1 className='text-gray-800 dark:text-gray-300'>You have no friends to show</h1>
                    </div>
                }

            </div>
        </div>
    )
}

export default FriendsPage
